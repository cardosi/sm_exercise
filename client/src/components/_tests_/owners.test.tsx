import { render, fireEvent } from '@testing-library/react';
import { Owners } from '../owners';
import * as useFetchAll from '../../hooks/useFetchAll';
import * as useManageItem from '../../hooks/useManageItem';

describe('Owners', () => {
  const useFetchAllSpy = vi.spyOn(useFetchAll, 'useFetchAll');
  const useManageItemSpy = vi.spyOn(useManageItem, 'useManageItem');

  const mockDeleteTopping = vi.fn();
  const mockCreateTopping = vi.fn();
  const mockUpdateTopping = vi.fn();

  beforeEach(() => {
    useFetchAllSpy.mockImplementation((type) => {
      switch (type) {
        case 'toppings':
          return {
            data: [{ id: 1, name: 'Ham' }, { id: 2, name: 'Cheese' }],
            isLoading: false,
            error: null,
            fetchAll: vi.fn(),
          };
        case 'pizza_toppings':
          return {
            data: [{ id: 1, pizza_id: 1, topping_id: 1 }],
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
        case 'toppings':
          return {
            isLoading: false,
            deleteItem: mockDeleteTopping,
            createItem: mockCreateTopping,
            updateItem: mockUpdateTopping,
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
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByText } = render(<Owners />);
    expect(getByText('Available Toppings')).toBeInTheDocument();
  });

  it('fetches toppings and pizza_toppings when it is rendered', () => {
    render(<Owners />)
    expect(useFetchAllSpy).toHaveBeenCalledWith('toppings')
    expect(useFetchAllSpy).toHaveBeenCalledWith('pizza_toppings')
    expect(useManageItemSpy).toHaveBeenCalledWith('toppings')
  })

  it('displays a list of toppings', () => {
    const { getByText } = render(<Owners />);
    expect(getByText('Ham')).toBeInTheDocument();
    expect(getByText('Cheese')).toBeInTheDocument();
  });

  it('creates a new topping and clears the create topping input when a new topping is submitted', () => {
    const { getByTestId, getByLabelText } = render(<Owners />)
    fireEvent.change(getByLabelText('Create A Topping'), { target: { value: 'New Topping' } })
    fireEvent.click(getByTestId('add-button'))
    expect(getByLabelText('Create A Topping')).toHaveValue('')
    expect(mockCreateTopping).toHaveBeenCalledWith({ name: 'New Topping' })
  })

  it('does not create a duplicate topping, and it does clear the input', () => {
    const { getByTestId, getByLabelText } = render(<Owners />)
    fireEvent.change(getByLabelText('Create A Topping'), { target: { value: 'Ham' } })
    fireEvent.click(getByTestId('add-button'))
    expect(getByLabelText('Create A Topping')).toHaveValue('')
    expect(mockCreateTopping).not.toHaveBeenCalled()
  })

  it('deletes a topping when the delete button is clicked', () => {
    const { getAllByTestId } = render(<Owners />)
    fireEvent.click(getAllByTestId("CancelIcon")[0])
    expect(mockDeleteTopping).toHaveBeenCalledWith(1, [1])
  })

  it('clears the edit input when a selected topping is deleted', () => {
    const { getByText, getByLabelText, getAllByTestId } = render(<Owners />)
    fireEvent.click(getByText('Ham'))
    expect(getByLabelText('Edit A Topping')).toHaveValue('Ham')
    fireEvent.click(getAllByTestId("CancelIcon")[0])
    expect(getByLabelText('Edit A Topping')).toHaveValue('')
  })

  it('updates the edit input when a topping is selected', () => {
    const { getByText, getByLabelText, getByTestId } = render(<Owners />)
    expect(getByTestId('edit-button')).toBeDisabled()
    fireEvent.click(getByText('Ham'))
    expect(getByLabelText('Edit A Topping')).toHaveValue('Ham')
    expect(getByTestId('edit-button')).toBeEnabled()
  })

  it('calls the update topping function and clears the edit input when a topping edit is submitted', () => {
    const { getByText, getByLabelText, getByTestId } = render(<Owners />)
    fireEvent.click(getByText('Ham'))
    fireEvent.change(getByLabelText('Edit A Topping'), { target: { value: 'New Topping' } })
    fireEvent.click(getByTestId('edit-button'))
    expect(getByLabelText('Edit A Topping')).toHaveValue('')
    expect(mockUpdateTopping).toHaveBeenCalledWith(1, 'New Topping')
  })
})
