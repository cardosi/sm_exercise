import { render, fireEvent } from '@testing-library/react'
import { CreateInput } from '../createInput'

describe('CreateInput', () => {
  const mockHandleChange = vi.fn()
  const mockHandleClick = vi.fn()

  it('renders correctly', () => {
    const { getByLabelText, getByPlaceholderText } = render(<CreateInput label="Test Label" value="" placeholder="Test Placeholder" handleChange={mockHandleChange} handleClick={mockHandleClick} />)
    expect(getByLabelText('Test Label')).toBeInTheDocument()
    expect(getByPlaceholderText('Test Placeholder')).toBeInTheDocument()
  })

  it('calls handleChange with correct parameters when text field is changed', () => {
    const { getByLabelText } = render(<CreateInput label="Test Label" value="" placeholder="Test Placeholder" handleChange={mockHandleChange} handleClick={mockHandleClick} />)
    fireEvent.change(getByLabelText('Test Label'), { target: { value: 'Test Value' } })
    expect(mockHandleChange).toHaveBeenCalled()
  })

  it('calls handleClick when add button is clicked', () => {
    const { getByLabelText } = render(<CreateInput label="Test Label" value="Test Value" placeholder="Test Placeholder" handleChange={mockHandleChange} handleClick={mockHandleClick} />)
    fireEvent.click(getByLabelText('edit'))
    expect(mockHandleClick).toHaveBeenCalled()
  })

  it('disables add button when value is empty', () => {
    const { getByLabelText } = render(<CreateInput label="Test Label" value="" placeholder="Test Placeholder" handleChange={mockHandleChange} handleClick={mockHandleClick} />)
    expect(getByLabelText('edit')).toBeDisabled()
  })
})
