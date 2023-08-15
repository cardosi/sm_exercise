import { render, fireEvent } from '@testing-library/react'
import { PizzaList } from '../pizzaList'

describe('PizzaList', () => {
  const mockHandleSelectPizza = vi.fn()
  const mockHandleDeletePizza = vi.fn()

  const pizzasData = [
    { id: 1, name: 'Margherita' },
    { id: 2, name: 'Pepperoni' },
  ]

  const selectedPizza = { id: null, name: '' }

  it('renders correctly', () => {
    const { getByText } = render(
      <PizzaList
        pizzasData={pizzasData}
        selectedPizza={selectedPizza}
        handleSelectPizza={mockHandleSelectPizza}
        handleDeletePizza={mockHandleDeletePizza}
      />
    )

    expect(getByText('Margherita')).toBeInTheDocument()
    expect(getByText('Pepperoni')).toBeInTheDocument()
  })

  it('calls handleSelectPizza with correct args when pizza is clicked', () => {
    const { getByText } = render(
      <PizzaList
        pizzasData={pizzasData}
        selectedPizza={selectedPizza}
        handleSelectPizza={mockHandleSelectPizza}
        handleDeletePizza={mockHandleDeletePizza}
      />
    )

    fireEvent.click(getByText('Margherita'))
    expect(mockHandleSelectPizza).toHaveBeenCalledWith(1, 'Margherita')
  })

  it('calls handleDeletePizza with correct args when delete is clicked', () => {
    const { getAllByTestId } = render(
      <PizzaList
        pizzasData={pizzasData}
        selectedPizza={selectedPizza}
        handleSelectPizza={mockHandleSelectPizza}
        handleDeletePizza={mockHandleDeletePizza}
      />
    )

    fireEvent.click(getAllByTestId('CancelIcon')[0])
    expect(mockHandleDeletePizza).toHaveBeenCalledWith(1)
  })
})
