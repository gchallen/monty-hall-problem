import { simulateBulkGames } from '../lib/bulk-simulation'

describe('Bulk Simulation', () => {
  test('game counts should add up correctly', () => {
    const result = simulateBulkGames(100)
    const { stats } = result
    
    console.log(`\n=== Testing 100 games ===`)
    console.log(`Total games: ${stats.totalGames}`)
    console.log(`Stay: ${stats.stayWins} wins / ${stats.stayTotal} games`)
    console.log(`Switch: ${stats.switchWins} wins / ${stats.switchTotal} games`)
    console.log(`Stay + Switch wins: ${stats.stayWins + stats.switchWins}`)
    console.log(`Stay + Switch totals: ${stats.stayTotal + stats.switchTotal}`)
    console.log(`Stay losses: ${stats.stayTotal - stats.stayWins}`)
    console.log(`Switch losses: ${stats.switchTotal - stats.switchWins}`)
    console.log(`Total losses: ${(stats.stayTotal - stats.stayWins) + (stats.switchTotal - stats.switchWins)}`)
    
    // Core assertions - THIS IS THE ISSUE
    expect(stats.totalGames).toBe(100)
    expect(stats.stayTotal + stats.switchTotal).toBe(200) // Both strategies tested on each game
    
    // In Monty Hall, every game should have exactly one winner
    // So wins should equal total games
    expect(stats.stayWins + stats.switchWins).toBe(100)
    
    // No negative values
    expect(stats.stayWins).toBeGreaterThanOrEqual(0)
    expect(stats.switchWins).toBeGreaterThanOrEqual(0)
    expect(stats.stayTotal).toBeGreaterThanOrEqual(0)
    expect(stats.switchTotal).toBeGreaterThanOrEqual(0)
    
    // Wins should not exceed totals
    expect(stats.stayWins).toBeLessThanOrEqual(stats.stayTotal)
    expect(stats.switchWins).toBeLessThanOrEqual(stats.switchTotal)
  })
  
  test('probabilities should converge to expected values', () => {
    const result = simulateBulkGames(10000)
    const { stats } = result
    
    const stayPercentage = (stats.stayWins / stats.stayTotal) * 100
    const switchPercentage = (stats.switchWins / stats.switchTotal) * 100
    
    console.log(`\n=== Probability Convergence Test ===`)
    console.log(`Stay win rate: ${stayPercentage.toFixed(2)}% (expected ~33.33%)`)
    console.log(`Switch win rate: ${switchPercentage.toFixed(2)}% (expected ~66.67%)`)
    
    // Allow for some variance due to randomness, but should be reasonably close
    expect(stayPercentage).toBeGreaterThan(25)
    expect(stayPercentage).toBeLessThan(42)
    expect(switchPercentage).toBeGreaterThan(58)
    expect(switchPercentage).toBeLessThan(75)
  })
  
  test('convergence data should be generated correctly', () => {
    const result = simulateBulkGames(1000)
    const { convergenceData } = result
    
    expect(convergenceData).toBeDefined()
    expect(convergenceData.length).toBeGreaterThan(0)
    
    // Check the last data point
    const lastPoint = convergenceData[convergenceData.length - 1]
    expect(lastPoint.gameNumber).toBe(1000)
    expect(lastPoint.theoreticalStay).toBe(33.33)
    expect(lastPoint.theoreticalSwitch).toBe(66.67)
  })
})