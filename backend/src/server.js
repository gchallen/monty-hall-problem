const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa-cors');
const bodyParser = require('koa-bodyparser');
const { createServer } = require('http');
const { Server } = require('socket.io');

const { connectToDatabase, saveGameResult, getStatisticsFromDatabase } = require('./lib/mongodb');

const app = new Koa();
const router = new Router();
const server = createServer(app.callback());

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Global statistics cache
let globalStats = {
  totalGames: 0,
  stayWins: 0,
  switchWins: 0,
  stayTotal: 0,
  switchTotal: 0,
};

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000"
}));
app.use(bodyParser());

// Health check endpoint
router.get('/health', async (ctx) => {
  ctx.body = { status: 'ok', timestamp: new Date().toISOString() };
});

// Get current statistics
router.get('/api/stats', async (ctx) => {
  try {
    const stats = await getStatisticsFromDatabase();
    ctx.body = stats;
  } catch (error) {
    console.error('Error fetching stats:', error);
    ctx.body = globalStats;
  }
});

// Submit game result
router.post('/api/game-result', async (ctx) => {
  try {
    const gameResult = ctx.request.body;
    
    // Validate game result
    if (!gameResult || !gameResult.strategy || typeof gameResult.won !== 'boolean') {
      ctx.status = 400;
      ctx.body = { error: 'Invalid game result data' };
      return;
    }

    // Save to database
    await saveGameResult(gameResult);
    
    // Update global stats
    globalStats.totalGames += 1;
    if (gameResult.strategy === 'stay') {
      globalStats.stayTotal += 1;
      if (gameResult.won) globalStats.stayWins += 1;
    } else {
      globalStats.switchTotal += 1;
      if (gameResult.won) globalStats.switchWins += 1;
    }

    // Broadcast updated stats to all connected clients
    io.emit('stats-update', globalStats);
    
    ctx.body = { success: true, stats: globalStats };
  } catch (error) {
    console.error('Error saving game result:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
  }
});

// Reset statistics (for testing)
router.post('/api/reset-stats', async (ctx) => {
  try {
    globalStats = {
      totalGames: 0,
      stayWins: 0,
      switchWins: 0,
      stayTotal: 0,
      switchTotal: 0,
    };
    
    io.emit('stats-update', globalStats);
    ctx.body = { success: true, stats: globalStats };
  } catch (error) {
    console.error('Error resetting stats:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send current stats to newly connected client
  socket.emit('stats-update', globalStats);

  socket.on('game-result', async (result) => {
    try {
      // Save to database
      await saveGameResult(result);
      
      // Update global stats
      globalStats.totalGames += 1;
      if (result.strategy === 'stay') {
        globalStats.stayTotal += 1;
        if (result.won) globalStats.stayWins += 1;
      } else {
        globalStats.switchTotal += 1;
        if (result.won) globalStats.switchWins += 1;
      }

      // Broadcast to all clients
      io.emit('stats-update', globalStats);
    } catch (error) {
      console.error('Error processing game result:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Initialize database and load existing stats
async function initializeServer() {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    
    // Load existing statistics from database
    const stats = await getStatisticsFromDatabase();
    globalStats = stats;
    console.log('Loaded existing stats:', stats);
  } catch (error) {
    console.log('Database connection failed, using in-memory stats:', error.message);
  }
  
  const PORT = process.env.PORT || 8080;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  });
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

initializeServer();