# Monty Hall Problem: Illinois vs Purdue Edition

An interactive web-based simulation of the classic Monty Hall problem with a college acceptance theme. Choose between staying with your original choice or switching doors to see if you get accepted to the University of Illinois!

## Features

- 🎓 Interactive game with Illinois/Purdue college acceptance theme
- 📊 Real-time statistics showing win rates for stay vs switch strategies
- 🌐 WebSocket integration for live global statistics across all players
- 🎨 Beautiful, responsive UI built with React, Next.js, and Tailwind CSS
- 🔍 Runtime type checking with Zod
- 🧪 Comprehensive unit tests
- 📱 Mobile-friendly design
- 🗄️ Optional MongoDB integration for data persistence

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd monty-hall-problem
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up MongoDB:
```bash
cp .env.example .env.local
# Edit .env.local with your MongoDB connection string
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Play

1. **Choose a Door**: Select one of the three doors. Behind one door is acceptance to Illinois, behind the other two are Purdue acceptances.

2. **Host Reveals**: The host will open one of the doors you didn't choose, revealing a Purdue acceptance.

3. **Final Decision**: You can either stay with your original choice or switch to the other unopened door.

4. **See the Results**: Find out if you got accepted to Illinois! The statistics will update to show how each strategy performs over time.

## The Mathematics

The Monty Hall problem demonstrates a counterintuitive probability puzzle:

- **Stay Strategy**: ~33% win rate (1/3 probability)
- **Switch Strategy**: ~67% win rate (2/3 probability)

The key insight is that when you initially choose a door, you have a 1/3 chance of being right. The host's action of revealing a losing door doesn't change this - it concentrates the remaining 2/3 probability onto the other unopened door.

## Technology Stack

- **Frontend**: React 18, Next.js 14, TypeScript
- **Styling**: Tailwind CSS with custom Illinois/Purdue color themes
- **Real-time**: Socket.IO for WebSocket connections
- **Validation**: Zod for runtime type checking
- **Database**: MongoDB (optional)
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel-ready configuration

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── app/                    # Next.js app directory
├── components/             # React components
│   ├── Door.tsx           # Individual door component
│   ├── GameBoard.tsx      # Main game interface
│   ├── StatsPanel.tsx     # Local statistics display
│   └── GlobalStatsPanel.tsx # Global statistics display
├── lib/                   # Utility libraries
│   ├── game.ts           # Core game logic
│   ├── mongodb.ts        # MongoDB integration
│   ├── websocket-client.ts # WebSocket client hook
│   └── websocket-server.ts # WebSocket server setup
├── types/                 # TypeScript type definitions
│   └── game.ts           # Game-related types
└── __tests__/            # Test files
    ├── components/       # Component tests
    ├── lib/             # Logic tests
    └── integration/     # Integration tests
```

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. (Optional) Set environment variables in Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB connection string

### Other Platforms

The application can be deployed to any Node.js hosting platform. Make sure to:

1. Run `npm run build` to build the application
2. Set `NODE_ENV=production`
3. Start with `npm start`

## Environment Variables

- `MONGODB_URI` (optional): MongoDB connection string for data persistence
- `NODE_ENV`: Set to 'production' for production builds

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Ensure all tests pass: `npm test`
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- The Monty Hall problem was named after Monty Hall, host of "Let's Make a Deal"
- University of Illinois and Purdue University for the thematic inspiration
- The probability puzzle demonstrates important concepts in statistics and decision theory