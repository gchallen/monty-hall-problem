# Monty Hall Problem: Illinois vs Purdue Edition

An interactive web-based simulation of the classic Monty Hall problem with a college acceptance theme. Choose between staying with your original choice or switching doors to see if you get accepted to the University of Illinois!

## Architecture

This application uses a separated frontend and backend architecture:

- **Frontend**: Next.js with React and Tailwind CSS (deployed on Vercel)
- **Backend**: Koa.js with Socket.IO and MongoDB (deployed on Fly.io)

## Features

- 🎓 Interactive game with Illinois/Purdue college acceptance theme
- 📊 Real-time global statistics across all players via WebSocket
- 🌐 Separate backend API with MongoDB persistence
- 🎨 Beautiful, responsive UI built with React, Next.js, and Tailwind CSS
- 🔍 Runtime type checking with Zod
- 🧪 Comprehensive unit tests
- 📱 Mobile-friendly design
- 🐳 Docker containerized backend
- ☁️ Cloud deployment ready (Vercel + Fly.io)

## Local Development

### Prerequisites

- Node.js 18+
- Docker (for backend)
- MongoDB (optional, for persistence)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the backend server:
```bash
npm run dev
```

The backend will be available at http://localhost:8080

### Frontend Setup

1. Navigate to the root directory:
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:3000

## Deployment

### Backend Deployment (Fly.io)

1. Install the Fly CLI:
```bash
curl -L https://fly.io/install.sh | sh
```

2. Authenticate with Fly:
```bash
fly auth login
```

3. Deploy the application:
```bash
fly deploy
```

4. Set environment variables:
```bash
fly secrets set MONGODB_URI="your-mongodb-connection-string"
fly secrets set FRONTEND_URL="https://your-frontend-domain.vercel.app"
```

### Frontend Deployment (Vercel)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_BACKEND_URL`: Your Fly.io backend URL

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

### Backend (.env)
```env
PORT=8080
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/monty-hall
```

## API Endpoints

### Backend API

- `GET /health` - Health check
- `GET /api/stats` - Get current global statistics
- `POST /api/game-result` - Submit a game result
- `POST /api/reset-stats` - Reset all statistics (development only)

### WebSocket Events

- `stats-update` - Broadcast updated statistics to all clients
- `game-result` - Receive game result from client

## Docker

### Build Backend Image
```bash
cd backend
docker build -t monty-hall-backend .
```

### Run Backend Container
```bash
docker run -p 8080:8080 \
  -e MONGODB_URI="your-connection-string" \
  -e FRONTEND_URL="http://localhost:3000" \
  monty-hall-backend
```

## Testing

### Frontend Tests
```bash
npm test
```

### Backend Tests
```bash
cd backend
npm test
```

## How to Play

1. **Choose a Door**: Select one of the three doors. Behind one door is acceptance to Illinois, behind the other two are Purdue acceptances.

2. **Host Reveals**: The host will open one of the doors you didn't choose, revealing a Purdue acceptance.

3. **Final Decision**: You can either stay with your original choice or switch to the other unopened door.

4. **See the Results**: Find out if you got accepted to Illinois! The statistics will update in real-time to show how each strategy performs across all players.

## The Mathematics

The Monty Hall problem demonstrates a counterintuitive probability puzzle:

- **Stay Strategy**: ~33% win rate (1/3 probability)
- **Switch Strategy**: ~67% win rate (2/3 probability)

The key insight is that when you initially choose a door, you have a 1/3 chance of being right. The host's action of revealing a losing door doesn't change this - it concentrates the remaining 2/3 probability onto the other unopened door.

## Technology Stack

### Frontend
- **Framework**: Next.js 14 with React 18
- **Styling**: Tailwind CSS with custom Illinois/Purdue themes
- **TypeScript**: Full type safety
- **Real-time**: Socket.IO client for live updates
- **Validation**: Zod for runtime type checking
- **Testing**: Jest, React Testing Library

### Backend
- **Framework**: Koa.js
- **Real-time**: Socket.IO server
- **Database**: MongoDB with aggregation pipelines
- **Validation**: Zod schemas
- **Containerization**: Docker
- **Deployment**: Fly.io

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details