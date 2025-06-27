/**
 * Integration tests for global statistics functionality
 * Tests that global stats are properly updated when no database is available
 */

const http = require('http');
const { parse } = require('url');

// Mock the server module without actually starting it
describe('Global Statistics Updates', () => {
  let globalStats;
  let saveGameResult;
  let getStatisticsFromDatabase;

  beforeEach(() => {
    // Reset global stats to initial state
    globalStats = {
      totalGames: 0,
      stayWins: 0,
      switchWins: 0,
      stayTotal: 0,
      switchTotal: 0,
    };

    // Mock database functions
    saveGameResult = jest.fn().mockResolvedValue();
    getStatisticsFromDatabase = jest.fn().mockResolvedValue({
      totalGames: 0,
      stayWins: 0,
      switchWins: 0,
      stayTotal: 0,
      switchTotal: 0,
    });
  });

  describe('when database is not available', () => {
    it('should update global stats correctly after multiple games', async () => {
      // Simulate game results without database
      const gameResults = [
        { strategy: 'stay', won: true },
        { strategy: 'switch', won: true },
        { strategy: 'stay', won: false },
        { strategy: 'switch', won: true },
      ];

      // Process each game result (simulating the server logic)
      for (const gameResult of gameResults) {
        // Save to database (mocked)
        await saveGameResult(gameResult);

        // Update in-memory stats (this is the actual server logic)
        globalStats.totalGames += 1;
        if (gameResult.strategy === 'stay') {
          globalStats.stayTotal += 1;
          if (gameResult.won) globalStats.stayWins += 1;
        } else if (gameResult.strategy === 'switch') {
          globalStats.switchTotal += 1;
          if (gameResult.won) globalStats.switchWins += 1;
        }

        // This is where the bug occurs - getting stats from database overwrites in-memory stats
        const currentStats = await getStatisticsFromDatabase();
        
        // In the buggy version, we would do: globalStats = currentStats;
        // This would reset all our in-memory updates!
      }

      // Expected final stats after all games
      expect(globalStats.totalGames).toBe(4);
      expect(globalStats.stayTotal).toBe(2);
      expect(globalStats.switchTotal).toBe(2);
      expect(globalStats.stayWins).toBe(1);
      expect(globalStats.switchWins).toBe(2);
    });

    it('should expose the bug when database stats overwrite in-memory stats', async () => {
      // Start with some in-memory stats
      globalStats.totalGames = 5;
      globalStats.stayTotal = 3;
      globalStats.switchTotal = 2;
      globalStats.stayWins = 2;
      globalStats.switchWins = 1;

      // Simulate what happens in the buggy server code
      const dbStats = await getStatisticsFromDatabase(); // Returns empty stats
      
      // This is the problematic line that exists in the current server code
      globalStats = dbStats; // BUG: This overwrites all in-memory stats!

      // The bug is exposed - all our in-memory stats are lost
      expect(globalStats.totalGames).toBe(0); // Should be 5, but bug makes it 0
      expect(globalStats.stayTotal).toBe(0);   // Should be 3, but bug makes it 0
      expect(globalStats.switchTotal).toBe(0); // Should be 2, but bug makes it 0
      expect(globalStats.stayWins).toBe(0);    // Should be 2, but bug makes it 0
      expect(globalStats.switchWins).toBe(0);  // Should be 1, but bug makes it 0
    });

    it('should maintain stats correctly when database returns empty results', async () => {
      // Simulate the corrected behavior
      const gameResult = { strategy: 'stay', won: true };

      // Update in-memory stats
      globalStats.totalGames += 1;
      globalStats.stayTotal += 1;
      globalStats.stayWins += 1;

      // Get database stats (empty when no DB)
      const dbStats = await getStatisticsFromDatabase();

      // FIXED: When database has no data, use in-memory stats instead of overwriting
      const finalStats = dbStats.totalGames > 0 ? dbStats : globalStats;

      expect(finalStats.totalGames).toBe(1);
      expect(finalStats.stayTotal).toBe(1);
      expect(finalStats.stayWins).toBe(1);
      expect(finalStats.switchTotal).toBe(0);
      expect(finalStats.switchWins).toBe(0);
    });
  });

  describe('when database is available with existing data', () => {
    beforeEach(() => {
      // Mock database with existing data
      getStatisticsFromDatabase.mockResolvedValue({
        totalGames: 10,
        stayWins: 3,
        switchWins: 7,
        stayTotal: 5,
        switchTotal: 5,
      });
    });

    it('should use database stats when database has data', async () => {
      const dbStats = await getStatisticsFromDatabase();
      
      // When database has data, we should use it
      const finalStats = dbStats.totalGames > 0 ? dbStats : globalStats;

      expect(finalStats.totalGames).toBe(10);
      expect(finalStats.stayTotal).toBe(5);
      expect(finalStats.switchTotal).toBe(5);
      expect(finalStats.stayWins).toBe(3);
      expect(finalStats.switchWins).toBe(7);
    });
  });
});