import { render, screen } from '@testing-library/react'
import StatsPanel from '@/components/StatsPanel'
import { Statistics } from '@/types/game'

describe('StatsPanel Component', () => {
  const createStats = (overrides: Partial<Statistics> = {}): Statistics => ({
    totalGames: 0,
    stayWins: 0,
    switchWins: 0,
    stayTotal: 0,
    switchTotal: 0,
    ...overrides,
  })

  it('should render with no games played', () => {
    const stats = createStats()
    render(<StatsPanel stats={stats} />)
    
    expect(screen.getByText('Statistics')).toBeInTheDocument()
    expect(screen.getAllByText('0%')).toHaveLength(3)
    expect(screen.getAllByText('0 wins out of 0 games')).toHaveLength(3)
  })

  it('should display correct percentages and counts', () => {
    const stats = createStats({
      totalGames: 100,
      stayWins: 33,
      switchWins: 67,
      stayTotal: 50,
      switchTotal: 50,
    })
    render(<StatsPanel stats={stats} />)
    
    // Overall stats
    expect(screen.getByText('100 wins out of 100 games')).toBeInTheDocument()
    
    // Stay strategy
    expect(screen.getByText('66%')).toBeInTheDocument() // 33/50
    expect(screen.getByText('33 wins out of 50 games')).toBeInTheDocument()
    
    // Switch strategy
    expect(screen.getByText('134%')).toBeInTheDocument() // 67/50
    expect(screen.getByText('67 wins out of 50 games')).toBeInTheDocument()
  })

  it('should show theoretical percentages', () => {
    const stats = createStats({
      totalGames: 10,
      stayWins: 3,
      switchWins: 7,
      stayTotal: 5,
      switchTotal: 5,
    })
    render(<StatsPanel stats={stats} />)
    
    expect(screen.getByText('Theoretical: ~33%')).toBeInTheDocument()
    expect(screen.getByText('Theoretical: ~67%')).toBeInTheDocument()
  })

  it('should show insights when games have been played', () => {
    const stats = createStats({
      totalGames: 5,
      stayWins: 1,
      switchWins: 4,
      stayTotal: 2,
      switchTotal: 3,
    })
    render(<StatsPanel stats={stats} />)
    
    expect(screen.getByText('Key Insights:')).toBeInTheDocument()
    expect(screen.getByText(/Switching doors should win approximately 2\/3 of the time/)).toBeInTheDocument()
  })

  it('should show comparison insight for 10+ games', () => {
    const stats = createStats({
      totalGames: 15,
      stayWins: 3,
      switchWins: 8,
      stayTotal: 7,
      switchTotal: 8,
    })
    render(<StatsPanel stats={stats} />)
    
    // Should show the comparison between switch and stay rates
    expect(screen.getByText(/Your results: Switch is winning/)).toBeInTheDocument()
  })

  it('should handle division by zero gracefully', () => {
    const stats = createStats({
      totalGames: 0,
      stayWins: 0,
      switchWins: 0,
      stayTotal: 0,
      switchTotal: 0,
    })
    render(<StatsPanel stats={stats} />)
    
    // Should show 0% for all percentages
    const percentages = screen.getAllByText('0%')
    expect(percentages.length).toBeGreaterThanOrEqual(3) // Overall, Stay, Switch
  })
})