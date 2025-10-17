import { render, screen, fireEvent } from '@testing-library/react'
import Door from '@/components/Door'
import { Door as DoorType } from '@/types/game'

describe('Door Component', () => {
  const mockOnClick = jest.fn()

  beforeEach(() => {
    mockOnClick.mockClear()
  })

  const createDoor = (overrides: Partial<DoorType> = {}): DoorType => ({
    id: 0,
    hasIllinois: false,
    isOpen: false,
    isSelected: false,
    ...overrides,
  })

  it('should render door with correct label', () => {
    const door = createDoor({ id: 1 })
    render(<Door door={door} onClick={mockOnClick} disabled={false} showContent={false} initialChoice={null} finalChoice={null} />)

    expect(screen.getByText('Door 2')).toBeInTheDocument()
  })

  it('should show question mark when door is closed and content hidden', () => {
    const door = createDoor()
    render(<Door door={door} onClick={mockOnClick} disabled={false} showContent={false} initialChoice={null} finalChoice={null} />)

    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('should show Illinois content when door has Illinois and is revealed', () => {
    const door = createDoor({ hasIllinois: true, isOpen: true })
    render(<Door door={door} onClick={mockOnClick} disabled={false} showContent={false} initialChoice={null} finalChoice={null} />)

    expect(screen.getByText('Illinois')).toBeInTheDocument()
    expect(screen.getByText('Acceptance!')).toBeInTheDocument()
  })

  it('should show Purdue content when door has Purdue and is revealed', () => {
    const door = createDoor({ hasIllinois: false, isOpen: true })
    render(<Door door={door} onClick={mockOnClick} disabled={false} showContent={false} initialChoice={null} finalChoice={null} />)

    expect(screen.getByText('Purdue')).toBeInTheDocument()
    expect(screen.getByText('Acceptance')).toBeInTheDocument()
  })

  it('should show content when showContent is true', () => {
    const door = createDoor({ hasIllinois: true })
    render(<Door door={door} onClick={mockOnClick} disabled={false} showContent={true} initialChoice={null} finalChoice={null} />)

    expect(screen.getByText('Illinois')).toBeInTheDocument()
  })

  it('should show "1" indicator for initial choice', () => {
    const door = createDoor({ id: 0 })
    render(<Door door={door} onClick={mockOnClick} disabled={false} showContent={false} initialChoice={0} finalChoice={null} />)

    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('should show "2" indicator for final choice', () => {
    const door = createDoor({ id: 1 })
    render(<Door door={door} onClick={mockOnClick} disabled={false} showContent={false} initialChoice={0} finalChoice={1} />)

    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('should show "1 2" indicator when both choices are the same', () => {
    const door = createDoor({ id: 0 })
    render(<Door door={door} onClick={mockOnClick} disabled={false} showContent={false} initialChoice={0} finalChoice={0} />)

    expect(screen.getByText('1 2')).toBeInTheDocument()
  })

  it('should not show indicator when neither choice', () => {
    const door = createDoor({ id: 2 })
    render(<Door door={door} onClick={mockOnClick} disabled={false} showContent={false} initialChoice={0} finalChoice={1} />)

    expect(screen.queryByText('1')).not.toBeInTheDocument()
    expect(screen.queryByText('2')).not.toBeInTheDocument()
  })

  it('should call onClick when clicked and not disabled', () => {
    const door = createDoor()
    render(<Door door={door} onClick={mockOnClick} disabled={false} showContent={false} initialChoice={null} finalChoice={null} />)

    const doorElement = screen.getByText('Door 1').closest('div')!
    fireEvent.click(doorElement)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('should not call onClick when disabled', () => {
    const door = createDoor()
    render(<Door door={door} onClick={mockOnClick} disabled={true} showContent={false} initialChoice={null} finalChoice={null} />)

    const doorElement = screen.getByText('Door 1').closest('div')!
    fireEvent.click(doorElement)

    expect(mockOnClick).not.toHaveBeenCalled()
  })

  it('should not call onClick when door is open', () => {
    const door = createDoor({ isOpen: true })
    render(<Door door={door} onClick={mockOnClick} disabled={false} showContent={false} initialChoice={null} finalChoice={null} />)

    const doorElement = screen.getByText('Door 1').closest('div')!
    fireEvent.click(doorElement)

    expect(mockOnClick).not.toHaveBeenCalled()
  })
})