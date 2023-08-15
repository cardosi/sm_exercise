import { render, fireEvent } from '@testing-library/react'
import { EditInput } from '../editInput'

describe('EditInput', () => {
  const mockHandleChange = vi.fn()
  const mockHandleClick = vi.fn()

  it('renders correctly', () => {
    const { getByLabelText, getByText } = render(<EditInput label="Test Label" value="" helperText="Test Helper Text" disabled={false} handleChange={mockHandleChange} handleClick={mockHandleClick} />)
    expect(getByLabelText('Test Label')).toBeInTheDocument()
    expect(getByText('Test Helper Text')).toBeInTheDocument()
  })

  it('calls handleChange with correct parameters when text field is changed', () => {
    const { getByLabelText } = render(<EditInput label="Test Label" value="" helperText="Test Helper Text" disabled={false} handleChange={mockHandleChange} handleClick={mockHandleClick} />)
    fireEvent.change(getByLabelText('Test Label'), { target: { value: 'Test Value' } })
    expect(mockHandleChange).toHaveBeenCalled()
  })

  it('calls handleClick when edit button is clicked', () => {
    const { getByLabelText } = render(<EditInput label="Test Label" value="Test Value" helperText="Test Helper Text" disabled={false} handleChange={mockHandleChange} handleClick={mockHandleClick} />)
    fireEvent.click(getByLabelText('edit'))
    expect(mockHandleClick).toHaveBeenCalled()
  })

  it('disables edit input when disabled prop is true', () => {
    const { getByLabelText } = render(<EditInput label="Test Label" value="test value" helperText="Test Helper Text" disabled={true} handleChange={mockHandleChange} handleClick={mockHandleClick} />)
    expect(getByLabelText('edit')).toBeDisabled()
  })

  it('disables edit button when value is empty', () => {
    const { getByTestId } = render(<EditInput label="Test Label" value="" helperText="Test Helper Text" disabled={false} handleChange={mockHandleChange} handleClick={mockHandleClick} />)
    expect(getByTestId('edit-button')).toBeDisabled()
  })
})
