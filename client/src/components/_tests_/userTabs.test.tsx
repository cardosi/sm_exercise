import { render, fireEvent } from '@testing-library/react'
import { UserTabs } from '../userTabs'

describe('UserTabs', () => {
  const mockHandleChange = vi.fn()

  it('renders correctly', () => {
    const { getByText } = render(<UserTabs value={0} handleChange={mockHandleChange} />)
    expect(getByText('Owners')).toBeInTheDocument()
    expect(getByText('Chefs')).toBeInTheDocument()
  })

  it('calls handleChange with correct parameters when tab is clicked', () => {
    const { getByText } = render(<UserTabs value={0} handleChange={mockHandleChange} />)
    fireEvent.click(getByText('Chefs'))
    expect(mockHandleChange).toHaveBeenCalled()
  })
})
