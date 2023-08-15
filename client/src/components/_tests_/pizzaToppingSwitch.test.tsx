import { render, fireEvent } from '@testing-library/react'
import { PizzaToppingSwitch } from '../pizzaToppingSwitch'

describe('PizzaToppingSwitch', () => {
  const mockAddPizzaTopping = vi.fn()
  const mockRemovePizzaTopping = vi.fn()

  const pizzaToppingData = [
    { id: 1, pizza_id: 1, topping_id: 1 },
    { id: 2, pizza_id: 1, topping_id: 2 },
  ]

  it('renders correctly', () => {
    const { getByRole } = render(<PizzaToppingSwitch pizzaToppingData={pizzaToppingData} toppingId={1} selectedPizzaId={1} addPizzaTopping={mockAddPizzaTopping} removePizzaTopping={mockRemovePizzaTopping} />)
    expect(getByRole('checkbox')).toBeInTheDocument()
  })

  it('is checked when there is a pizzaTopping with the correct toppingId and selectedPizzaId', () => {
    const { getByRole } = render(<PizzaToppingSwitch pizzaToppingData={pizzaToppingData} toppingId={1} selectedPizzaId={1} addPizzaTopping={mockAddPizzaTopping} removePizzaTopping={mockRemovePizzaTopping} />)
    expect(getByRole('checkbox')).toBeChecked()
  })

  it('is not checked when there is not a pizzaTopping with the correct toppingId and selectedPizzaId', () => {
    const { getByRole } = render(<PizzaToppingSwitch pizzaToppingData={pizzaToppingData} toppingId={3} selectedPizzaId={1} addPizzaTopping={mockAddPizzaTopping} removePizzaTopping={mockRemovePizzaTopping} />)
    expect(getByRole('checkbox')).not.toBeChecked()
  })

  it('calls addPizzaTopping with correct parameters when switch is clicked and pizzaTopping is null', () => {
    const { getByRole } = render(<PizzaToppingSwitch pizzaToppingData={pizzaToppingData} toppingId={3} selectedPizzaId={1} addPizzaTopping={mockAddPizzaTopping} removePizzaTopping={mockRemovePizzaTopping} />)
    fireEvent.click(getByRole('checkbox'))
    expect(mockAddPizzaTopping).toHaveBeenCalledWith({ pizza_id: 1, topping_id: 3 })
  })

  it('calls removePizzaTopping with correct parameters when switch is clicked and pizzaTopping is not null', () => {
    const { getByRole } = render(<PizzaToppingSwitch pizzaToppingData={pizzaToppingData} toppingId={1} selectedPizzaId={1} addPizzaTopping={mockAddPizzaTopping} removePizzaTopping={mockRemovePizzaTopping} />)
    fireEvent.click(getByRole('checkbox'))
    expect(mockRemovePizzaTopping).toHaveBeenCalledWith(1, [])
  })
})
