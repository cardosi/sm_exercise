import { render, fireEvent } from '@testing-library/react'
import { Chefs } from '../chefs';
import * as useFetchAll from '../../hooks/useFetchAll';
import * as useManageItem from '../../hooks/useManageItem';

describe('Chefs', () => {
  const useFetchAllSpy = vi.spyOn(useFetchAll, 'useFetchAll')
  const useManageItemSpy = vi.spyOn(useManageItem, 'useManageItem')

  const mockDeletePizza = vi.fn();
  const mockCreatePizza = vi.fn();
  const mockUpdatePizza = vi.fn();

  const mockDeletePizzaTopping = vi.fn();
  const mockCreatePizzaTopping = vi.fn();

  beforeEach(() => {
    useFetchAllSpy.mockImplementation((type) => {
      switch (type) {
        case 'pizzas':
          return {
            data: [{ id: 1, name: 'Margherita' }, { id: 2, name: 'Pepperoni' }],
            isLoading: false,
            error: null,
            fetchAll: vi.fn(),
          };
        case 'toppings':
          return {
            data: [{ id: 1, name: 'Mushrooms' }, { id: 2, name: 'Olives' }],
            isLoading: false,
            error: null,
            fetchAll: vi.fn(),
          };
        case 'pizza_toppings':
          return {
            data: [{ id: 1, pizza_id: 1, topping_id: 1 }, { id: 2, pizza_id: 2, topping_id: 2 }],
            isLoading: false,
            error: null,
            fetchAll: vi.fn(),
          };
        default:
          return {
            data: [],
            isLoading: false,
            error: null,
            fetchAll: vi.fn(),
          };
      }
    });

    useManageItemSpy.mockImplementation((type) => {
      switch (type) {
        case 'pizzas':
          return {
            isLoading: false,
            deleteItem: mockDeletePizza,
            createItem: mockCreatePizza,
            updateItem: mockUpdatePizza,
            error: null,
          };
        case 'pizza_toppings':
          return {
            isLoading: false,
            deleteItem: mockDeletePizzaTopping,
            createItem: mockCreatePizzaTopping,
            updateItem: vi.fn(),
            error: null,
          };
        default:
          return {
            isLoading: false,
            deleteItem: vi.fn(),
            createItem: vi.fn(),
            updateItem: vi.fn(),
            error: null,
          };
      }
    });
  });

  afterEach(() => {
    vi.clearAllMocks()
  });

  it('renders without crashing', () => {
    const { getByText, getByTestId } = render(<Chefs />)
    expect(getByText('Pizzas')).toBeInTheDocument()
    expect(getByText('Toppings')).toBeInTheDocument()
    expect(getByText('Select a Pizza to edit')).toBeInTheDocument()
    expect(getByTestId('create-input')).toBeInTheDocument()
    expect(getByTestId('edit-button')).toBeInTheDocument()
    expect(getByTestId('add-button')).toBeInTheDocument()
  })

  it('fetches pizzas, toppings, and pizza_toppings when it is rendered', () => {
    render(<Chefs />)
    expect(useFetchAllSpy).toHaveBeenCalledWith('pizzas')
    expect(useFetchAllSpy).toHaveBeenCalledWith('toppings')
    expect(useFetchAllSpy).toHaveBeenCalledWith('pizza_toppings')
    expect(useManageItemSpy).toHaveBeenCalledWith('pizzas')
    expect(useManageItemSpy).toHaveBeenCalledWith('pizza_toppings')
  })

  it('displays a list of pizzas', () => {
    const { getByText } = render(<Chefs />);
    expect(getByText('Margherita')).toBeInTheDocument();
    expect(getByText('Pepperoni')).toBeInTheDocument();
  });

  it('creates a new pizza and clears the create pizza input when a new pizza is submitted', () => {
    const { getByTestId, getByLabelText } = render(<Chefs />)
    fireEvent.change(getByLabelText('Create A Pizza'), { target: { value: 'New Pizza' } })
    fireEvent.click(getByTestId('add-button'))
    expect(getByLabelText('Create A Pizza')).toHaveValue('')
    expect(mockCreatePizza).toHaveBeenCalledWith({ name: 'New Pizza' })
  })

  it('does not create a duplicate pizza, and it does clear the input', () => {
    const { getByTestId, getByLabelText } = render(<Chefs />)
    fireEvent.change(getByLabelText('Create A Pizza'), { target: { value: 'Margherita' } })
    fireEvent.click(getByTestId('add-button'))
    expect(getByLabelText('Create A Pizza')).toHaveValue('')
    expect(mockCreatePizza).not.toHaveBeenCalled()
  })

  it('calls the delete pizza function with the correct args when a pizza is deleted', () => {
    const { getAllByTestId } = render(<Chefs />)
    fireEvent.click(getAllByTestId("CancelIcon")[0])
    expect(mockDeletePizza).toHaveBeenCalledWith(1, [1])
  })

  it('resets all pizza topping switches and clears the selected pizza when the selected pizza is deleted', () => {
    const { getByText, getAllByRole, getByTestId, getAllByTestId, queryByTestId } = render(<Chefs />)
    fireEvent.click(getByText('Margherita'))
    expect(getAllByRole('checkbox')[0]).toBeChecked()
    expect(getByTestId('pizza-topping-chip-1')).toBeInTheDocument()
    fireEvent.click(getAllByTestId("CancelIcon")[0])
    expect(getByTestId('editable-title-static-text')).toHaveTextContent('Select a Pizza to edit')
    expect(queryByTestId('pizza-topping-chip-1')).not.toBeInTheDocument()
    expect(getAllByRole('checkbox')[0]).not.toBeChecked()
  })

  it('calls the updatePizza function when a pizza is updated', () => {
    const { getByTestId, getByLabelText, getByText } = render(<Chefs />)
    fireEvent.click(getByText('Margherita'))
    fireEvent.click(getByTestId('edit-button'))
    fireEvent.change(getByLabelText('Edit Pizza Name'), { target: { value: 'Supreme' } })
    fireEvent.click(getByTestId('submit-button'))
    expect(getByTestId('editable-title-static-text')).toHaveTextContent('Select a Pizza to edit')
    expect(mockUpdatePizza).toHaveBeenCalledWith(1, 'Supreme')
  })


  it('does not update a pizza to a duplicate name, and it does clear the input', () => {
    const { getByTestId, getByLabelText, getByText } = render(<Chefs />)
    fireEvent.click(getByText('Margherita'))
    fireEvent.click(getByTestId('edit-button'))
    fireEvent.change(getByLabelText('Edit Pizza Name'), { target: { value: 'Pepperoni' } })
    fireEvent.click(getByTestId('submit-button'))
    expect(getByTestId('editable-title-static-text')).toHaveTextContent('Select a Pizza to edit')
    expect(mockUpdatePizza).not.toHaveBeenCalled()
  })

  it('updates the selected pizza when a pizza is clicked', () => {
    const { getByText, getByTestId } = render(<Chefs />)
    fireEvent.click(getByText('Margherita'))
    expect(getByTestId('editable-title-static-text')).toHaveTextContent('Margherita')
    expect(getByTestId('pizza-topping-chip-1')).toBeInTheDocument()
  })

  it('updates the topping switches when a pizza is clicked', () => {
    const { getByText, getAllByRole } = render(<Chefs />)
    fireEvent.click(getByText('Margherita'))
    expect(getAllByRole('checkbox')[0]).toBeChecked()
    expect(getAllByRole('checkbox')[1]).not.toBeChecked()
  })

  it('creates a pizza topping when an unchecked switch is clicked', () => {
    const { getByText, getAllByRole } = render(<Chefs />)
    fireEvent.click(getByText('Margherita'))
    fireEvent.click(getAllByRole('checkbox')[1])
    expect(mockCreatePizzaTopping).toHaveBeenCalledWith({ pizza_id: 1, topping_id: 2 })
  })

  it('deletes a pizza topping when a checked switch is clicked', () => {
    const { getByText, getAllByRole } = render(<Chefs />)
    fireEvent.click(getByText('Margherita'))
    fireEvent.click(getAllByRole('checkbox')[0])
    expect(mockDeletePizzaTopping).toHaveBeenCalledWith(1, [])
  })
})
