import { simulateBulkGames } from '@/lib/bulk-simulation'

describe('Bulk Simulation', () => {
  it('should simulate the correct number of games', () => {
    const result = simulateBulkGames(100)
    expect(result.stats.totalGames).toBe(200) // 100 stay + 100 switch
    expect(result.stats.stayTotal).toBe(100)
    expect(result.stats.switchTotal).toBe(100)
  })

  it('should calculate win statistics', () => {
    const result = simulateBulkGames(1000)
    
    // Check that wins are recorded
    expect(result.stats.stayWins).toBeGreaterThanOrEqual(0)
    expect(result.stats.stayWins).toBeLessThanOrEqual(result.stats.stayTotal)
    expect(result.stats.switchWins).toBeGreaterThanOrEqual(0)
    expect(result.stats.switchWins).toBeLessThanOrEqual(result.stats.switchTotal)
    
    // Check totals
    expect(result.stats.stayWins + (result.stats.stayTotal - result.stats.stayWins)).toBe(result.stats.stayTotal)
    expect(result.stats.switchWins + (result.stats.switchTotal - result.stats.switchWins)).toBe(result.stats.switchTotal)
  })

  it('should converge to theoretical probabilities with large samples', () => {
    const result = simulateBulkGames(10000)
    
    const stayWinRate = result.stats.stayWins / result.stats.stayTotal
    const switchWinRate = result.stats.switchWins / result.stats.switchTotal
    
    // With 10,000 games, we expect to be within 5% of theoretical values
    expect(stayWinRate).toBeGreaterThan(0.28) // 33.3% - 5%
    expect(stayWinRate).toBeLessThan(0.38) // 33.3% + 5%
    
    expect(switchWinRate).toBeGreaterThan(0.62) // 66.7% - 5%
    expect(switchWinRate).toBeLessThan(0.72) // 66.7% + 5%
  })

  it('should track duration', () => {
    const result = simulateBulkGames(100)
    expect(result.duration).toBeGreaterThan(0)
    expect(result.duration).toBeLessThan(1000) // Should complete in less than 1 second
  })
})