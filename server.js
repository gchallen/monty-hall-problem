const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const { MongoClient } = require('mongodb');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// MongoDB connection
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.log('MONGODB_URI not set, running without database');
    return { client: null, db: null };
  }
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('monty-hall');
    
    cachedClient = client;
    cachedDb = db;
    
    console.log('Connected to MongoDB');
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    return { client: null, db: null };
  }
}

async function saveGameResult(result) {
  if (!result) {
    console.log('Invalid result, skipping database save');
    return;
  }

  try {
    const { db } = await connectToDatabase();
    if (!db) {
      console.log('Database not available, skipping save');
      return;
    }
    
    const collection = db.collection('game-results');
    
    const gameResult = {
      ...result,
      timestamp: new Date(),
      id: result.id || generateId()
    };
    
    await collection.insertOne(gameResult);
    console.log('Game result saved to database');
  } catch (error) {
    console.error('Error saving game result to MongoDB:', error);
  }
}

async function getStatisticsFromDatabase() {
  try {
    const { db } = await connectToDatabase();
    if (!db) {
      return {
        totalGames: 0,
        stayWins: 0,
        switchWins: 0,
        stayTotal: 0,
        switchTotal: 0,
      };
    }
    
    const collection = db.collection('game-results');
    
    const pipeline = [
      {
        $group: {
          _id: null,
          totalGames: { $sum: 1 },
          stayTotal: {
            $sum: { $cond: [{ $eq: ['$strategy', 'stay'] }, 1, 0] }
          },
          switchTotal: {
            $sum: { $cond: [{ $eq: ['$strategy', 'switch'] }, 1, 0] }
          },
          stayWins: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$strategy', 'stay'] }, { $eq: ['$won', true] }] },
                1,
                0
              ]
            }
          },
          switchWins: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$strategy', 'switch'] }, { $eq: ['$won', true] }] },
                1,
                0
              ]
            }
          }
        }
      }
    ];

    const result = await collection.aggregate(pipeline).toArray();
    
    if (result.length === 0) {
      return {
        totalGames: 0,
        stayWins: 0,
        switchWins: 0,
        stayTotal: 0,
        switchTotal: 0,
      };
    }

    const stats = result[0];
    return {
      totalGames: stats.totalGames,
      stayWins: stats.stayWins,
      switchWins: stats.switchWins,
      stayTotal: stats.stayTotal,
      switchTotal: stats.switchTotal,
    };
  } catch (error) {
    console.error('Error fetching statistics from MongoDB:', error);
    return {
      totalGames: 0,
      stayWins: 0,
      switchWins: 0,
      stayTotal: 0,
      switchTotal: 0,
    };
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Global statistics (in-memory fallback)
let globalStats = {
  totalGames: 0,
  stayWins: 0,
  switchWins: 0,
  stayTotal: 0,
  switchTotal: 0,
};

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      if (pathname === '/api/stats') {
        // Get statistics from database or fallback to in-memory
        try {
          const dbStats = await getStatisticsFromDatabase();
          // Use database stats if they have data, otherwise use in-memory stats
          const currentStats = dbStats.totalGames > 0 ? dbStats : globalStats;
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(currentStats));
        } catch (error) {
          console.error('Error fetching stats:', error);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(globalStats));
        }
      } else if (pathname === '/api/game-result' && req.method === 'POST') {
        // Handle game result submission
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', async () => {
          try {
            const gameResult = JSON.parse(body);
            
            // Validate game result
            if (!gameResult || !gameResult.strategy || typeof gameResult.won !== 'boolean') {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid game result data' }));
              return;
            }

            // Save to database
            await saveGameResult(gameResult);

            // Update in-memory stats
            globalStats.totalGames += 1;
            if (gameResult.strategy === 'stay') {
              globalStats.stayTotal += 1;
              if (gameResult.won) globalStats.stayWins += 1;
            } else if (gameResult.strategy === 'switch') {
              globalStats.switchTotal += 1;
              if (gameResult.won) globalStats.switchWins += 1;
            }

            // Get current stats from database or use in-memory stats
            const dbStats = await getStatisticsFromDatabase();
            const currentStats = dbStats.totalGames > 0 ? dbStats : globalStats;
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, stats: currentStats }));
          } catch (error) {
            console.error('Error processing game result:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error' }));
          }
        });
      } else {
        // Handle all other requests with Next.js
        await handle(req, res, parsedUrl);
      }
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Initialize Socket.IO
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Socket.IO connection handling
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Send current statistics when client connects
    getStatisticsFromDatabase().then(dbStats => {
      const currentStats = dbStats.totalGames > 0 ? dbStats : globalStats;
      socket.emit('stats-update', currentStats);
    }).catch(error => {
      console.error('Error getting stats for new connection:', error);
      socket.emit('stats-update', globalStats);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    socket.on('game-result', async (gameResult) => {
      try {
        // Validate game result
        if (!gameResult || !gameResult.strategy || typeof gameResult.won !== 'boolean') {
          socket.emit('error', { message: 'Invalid game result data' });
          return;
        }

        // Save to database
        await saveGameResult(gameResult);

        // Update in-memory stats
        globalStats.totalGames += 1;
        if (gameResult.strategy === 'stay') {
          globalStats.stayTotal += 1;
          if (gameResult.won) globalStats.stayWins += 1;
        } else if (gameResult.strategy === 'switch') {
          globalStats.switchTotal += 1;
          if (gameResult.won) globalStats.switchWins += 1;
        }

        // Get current stats from database or use in-memory stats and broadcast to all clients
        const dbStats = await getStatisticsFromDatabase();
        const currentStats = dbStats.totalGames > 0 ? dbStats : globalStats;
        io.emit('stats-update', currentStats);
      } catch (error) {
        console.error('Error processing game result:', error);
        socket.emit('error', { message: 'Failed to process game result' });
      }
    });
  });

  // Initialize database connection and load existing stats
  connectToDatabase().then(async () => {
    try {
      const dbStats = await getStatisticsFromDatabase();
      // Only load from database if it has data, otherwise keep in-memory stats
      if (dbStats.totalGames > 0) {
        globalStats = dbStats;
        console.log('Loaded statistics from database:', globalStats);
      } else {
        console.log('Database has no statistics, using in-memory stats:', globalStats);
      }
    } catch (error) {
      console.error('Failed to load initial statistics:', error);
    }
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});