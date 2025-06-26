import { MongoClient, Db, Collection } from 'mongodb'
import { GameResult, Statistics } from '@/types/game'

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'
  const client = new MongoClient(uri)
  
  await client.connect()
  const db = client.db('monty-hall')
  
  cachedClient = client
  cachedDb = db
  
  return { client, db }
}

export async function saveGameResult(result: GameResult): Promise<void> {
  if (!process.env.MONGODB_URI) {
    console.log('MongoDB URI not provided, skipping database save')
    return
  }

  try {
    const { db } = await connectToDatabase()
    const collection: Collection<GameResult> = db.collection('game-results')
    await collection.insertOne(result)
  } catch (error) {
    console.error('Error saving game result to MongoDB:', error)
  }
}

export async function getStatisticsFromDatabase(): Promise<Statistics> {
  if (!process.env.MONGODB_URI) {
    return {
      totalGames: 0,
      stayWins: 0,
      switchWins: 0,
      stayTotal: 0,
      switchTotal: 0,
    }
  }

  try {
    const { db } = await connectToDatabase()
    const collection: Collection<GameResult> = db.collection('game-results')
    
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
    ]

    const result = await collection.aggregate(pipeline).toArray()
    
    if (result.length === 0) {
      return {
        totalGames: 0,
        stayWins: 0,
        switchWins: 0,
        stayTotal: 0,
        switchTotal: 0,
      }
    }

    const stats = result[0]
    return {
      totalGames: stats.totalGames,
      stayWins: stats.stayWins,
      switchWins: stats.switchWins,
      stayTotal: stats.stayTotal,
      switchTotal: stats.switchTotal,
    }
  } catch (error) {
    console.error('Error fetching statistics from MongoDB:', error)
    return {
      totalGames: 0,
      stayWins: 0,
      switchWins: 0,
      stayTotal: 0,
      switchTotal: 0,
    }
  }
}

export async function clearAllGameResults(): Promise<void> {
  if (!process.env.MONGODB_URI) {
    console.log('MongoDB URI not provided, skipping database clear')
    return
  }

  try {
    const { db } = await connectToDatabase()
    const collection: Collection<GameResult> = db.collection('game-results')
    await collection.deleteMany({})
  } catch (error) {
    console.error('Error clearing game results from MongoDB:', error)
  }
}