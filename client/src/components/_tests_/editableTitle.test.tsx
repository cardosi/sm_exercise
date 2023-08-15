import { render, fireEvent } from '@testing-library/react'
import { EditableTitle } from '../editableTitle';

describe('EditableTitle', () => {
  const handleChange = vi.fn();
  const handleClick = vi.fn();

  const getFreshProps = () => ({
    label: 'Test Label',
    value: 'Test Value',
    helperText: 'Helper Text',
    disabled: false,
    handleChange,
    handleClick
  });

  it('renders without crashing', () => {
    const { getByTestId } = render(<EditableTitle {...getFreshProps()} />)
    expect(getByTestId('edit-button')).toBeInTheDocument()
  })

  it('renders the correct initial state', () => {
    const { getByTestId } = render(<EditableTitle {...getFreshProps()} />)
    expect(getByTestId('edit-button')).toBeInTheDocument()
  })

  it('switches to edit mode when the edit button is clicked', () => {
    const { getByTestId } = render(<EditableTitle {...getFreshProps()} />)
    fireEvent.click(getByTestId('edit-button'))
    expect(getByTestId('submit-button')).toBeInTheDocument()
  })

  it('switches back from edit mode when the check button is clicked', () => {
    const { getByTestId } = render(<EditableTitle {...getFreshProps()} />)
    fireEvent.click(getByTestId('edit-button'))
    fireEvent.click(getByTestId('submit-button'))
    expect(getByTestId('edit-button')).toBeInTheDocument()
  })

  it('calls the handleChange function when the text field value changes', () => {
    const { getByTestId, getByLabelText } = render(<EditableTitle {...getFreshProps()} />)
    fireEvent.click(getByTestId('edit-button'))
    fireEvent.change(getByLabelText('Test Label'), { target: { value: 'New Value' } })
    expect(handleChange).toHaveBeenCalled()
  })

  it('calls the handleClick function when the check button is clicked', () => {
    const { getByTestId } = render(<EditableTitle {...getFreshProps()} />)
    fireEvent.click(getByTestId('edit-button'))
    fireEvent.click(getByTestId('submit-button'))
    expect(handleClick).toHaveBeenCalled()
  })

  it('disables the edit button when the disabled prop is true', () => {
    const props = getFreshProps();
    props.disabled = true;
    const { getByTestId } = render(<EditableTitle {...props} />)
    expect(getByTestId('edit-button')).toBeDisabled()
  })

  it('disables the check button when the value prop is an empty string', async () => {
    const props = getFreshProps();
    props.value = '';
    const { getByTestId, getByLabelText } = render(<EditableTitle {...props} />)
    fireEvent.click(getByTestId('edit-button'))
    fireEvent.change(getByLabelText('Test Label'), { target: { value: 'New Value' } })
    expect(getByTestId('submit-button')).toBeDisabled()
  })
})
