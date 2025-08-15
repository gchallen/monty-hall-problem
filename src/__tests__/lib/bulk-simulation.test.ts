import { simulateBulkGames } from '@/lib/bulk-simulation'

describe('Bulk Simulation', () => {
  it('should simulate the correct number of games', () => {
    const result = simulateBulkGames(100)
    expect(result.stats.totalGames).toBe(100) // 100 games tested with both strategies
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

  it('should generate convergence data', () => {
    const result = simulateBulkGames(100)
    
    // Should have convergence data points
    expect(result.convergenceData).toBeDefined()
    expect(result.convergenceData.length).toBeGreaterThan(0)
    
    // Check structure of data points
    const firstPoint = result.convergenceData[0]
    expect(firstPoint).toHaveProperty('gameNumber')
    expect(firstPoint).toHaveProperty('stayPercentage')
    expect(firstPoint).toHaveProperty('switchPercentage')
    expect(firstPoint).toHaveProperty('theoreticalStay')
    expect(firstPoint).toHaveProperty('theoreticalSwitch')
    
    // Check theoretical values are correct
    expect(firstPoint.theoreticalStay).toBe(33.33)
    expect(firstPoint.theoreticalSwitch).toBe(66.67)
    
    // Check that game numbers increase
    const lastPoint = result.convergenceData[result.convergenceData.length - 1]
    expect(lastPoint.gameNumber).toBe(100)
  })
})