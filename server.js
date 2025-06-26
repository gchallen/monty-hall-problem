const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  // Initialize WebSocket server
  const { Server } = require('socket.io')
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })

  let globalStats = {
    totalGames: 0,
    stayWins: 0,
    switchWins: 0,
    stayTotal: 0,
    switchTotal: 0,
  }

  // Optional MongoDB integration
  let mongoEnabled = false
  let saveGameResult = null
  let getStatisticsFromDatabase = null

  // Skip MongoDB integration in JavaScript server for now
  // MongoDB integration would require TypeScript compilation
  console.log('MongoDB URI not provided, using in-memory storage')

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)
    
    socket.emit('stats-update', globalStats)

    socket.on('game-result', async (result) => {
      // Update in-memory stats
      globalStats.totalGames += 1
      
      if (result.strategy === 'stay') {
        globalStats.stayTotal += 1
        if (result.won) globalStats.stayWins += 1
      } else {
        globalStats.switchTotal += 1
        if (result.won) globalStats.switchWins += 1
      }

      // MongoDB integration disabled in development server

      io.emit('stats-update', globalStats)
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })

  server
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})