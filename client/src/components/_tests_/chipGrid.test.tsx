import { render, fireEvent } from '@testing-library/react'
import { ChipGrid } from '../chipGrid'

describe('ChipGrid', () => {
  const mockHandleDelete = vi.fn()
  const mockHandleSelect = vi.fn()

  const toppings = [
    { id: 1, name: 'Mushrooms' },
    { id: 2, name: 'Pepperoni' },
  ]

  it('renders correctly', () => {
    const { getByText } = render(<ChipGrid items={toppings} handleDelete={mockHandleDelete} handleSelect={mockHandleSelect} selectedID={null} />)
    expect(getByText('Mushrooms')).toBeInTheDocument()
    expect(getByText('Pepperoni')).toBeInTheDocument()
  })

  it('calls handleSelect with correct parameters when chip is clicked', () => {
    const { getByText } = render(<ChipGrid items={toppings} handleDelete={mockHandleDelete} handleSelect={mockHandleSelect} selectedID={null} />)
    fireEvent.click(getByText('Mushrooms'))
    expect(mockHandleSelect).toHaveBeenCalledWith(1, 'Mushrooms')
  })

  it('calls handleDelete with correct parameters when delete is clicked', () => {
    const { getAllByTestId } = render(<ChipGrid items={toppings} handleDelete={mockHandleDelete} handleSelect={mockHandleSelect} selectedID={null} />)
    fireEvent.click(getAllByTestId('CancelIcon')[0])
    expect(mockHandleDelete).toHaveBeenCalledWith(1)
  })
})
