import { render, fireEvent } from '@testing-library/react'
import { ToppingList } from '../toppingList';

describe('ToppingList', () => {
  const createPizzaTopping = vi.fn();
  const deletePizzaTopping = vi.fn();

  const getFreshProps = () => ({
    toppingsData: [{ id: 1, name: 'cheese' }, { id: 2, name: 'pepperoni' }],
    pizzaToppingData: [{ id: 1, pizza_id: 1, topping_id: 1 }],
    selectedPizza: { id: 1, name: 'Margherita' },
    createPizzaTopping,
    deletePizzaTopping
  });

  it('renders without crashing', () => {
    const props = getFreshProps();
    const { getByText } = render(<ToppingList {...props} />)
    expect(getByText('Cheese')).toBeInTheDocument()
    expect(getByText('Pepperoni')).toBeInTheDocument()
  })

  it('renders the correct number of PizzaToppingSwitch components', () => {
    const props = getFreshProps();
    const { getAllByRole } = render(<ToppingList {...props} />)
    expect(getAllByRole('checkbox')).toHaveLength(props.toppingsData.length)
  })

  it('calls the createPizzaTopping function when a topping is added', () => {
    const props = getFreshProps();
    const { getAllByRole } = render(<ToppingList {...props} />)
    fireEvent.click(getAllByRole('checkbox')[1])
    expect(createPizzaTopping).toHaveBeenCalled()
  })

  it('calls the deletePizzaTopping function when a topping is removed', () => {
    const props = getFreshProps();
    const { getAllByRole } = render(<ToppingList {...props} />)
    fireEvent.click(getAllByRole('checkbox')[0])
    expect(deletePizzaTopping).toHaveBeenCalled()
  })
})
