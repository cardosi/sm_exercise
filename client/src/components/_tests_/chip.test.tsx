import { render, fireEvent } from '@testing-library/react'
import { MuiChip } from '../chip'

describe('MuiChip', () => {
  it('renders correctly', () => {
    const item = { id: 1, name: 'TestChip' }
    const { getByText } = render(<MuiChip item={item} selectedID={null} handleClick={() => { }} handleDelete={() => { }} />)
    expect(getByText('TestChip')).toBeInTheDocument()
  })

  it('calls handleClick on click', () => {
    const handleClick = vi.fn()
    const item = { id: 1, name: 'TestChip' }
    const { getByText } = render(<MuiChip item={item} selectedID={null} handleClick={handleClick} handleDelete={() => { }} />)
    fireEvent.click(getByText('TestChip'))
    expect(handleClick).toHaveBeenCalled()
  })

  it('calls handleDelete on delete', () => {
    const handleDelete = vi.fn()
    const item = { id: 1, name: 'TestChip' }
    const { getByTestId } = render(<MuiChip item={item} selectedID={null} handleClick={() => { }} handleDelete={handleDelete} />)
    fireEvent.click(getByTestId("CancelIcon"))
    expect(handleDelete).toHaveBeenCalled()
  })

  it('changes variant based on selectedID', () => {
    const item = { id: 1, name: 'TestChip' }
    const { rerender, getByText } = render(<MuiChip item={item} selectedID={null} handleClick={() => { }} handleDelete={() => { }} />)
    expect(getByText('TestChip').parentNode).toHaveClass('MuiChip-outlined')
    rerender(<MuiChip item={item} selectedID={1} handleClick={() => { }} handleDelete={() => { }} />)
    expect(getByText('TestChip').parentNode).toHaveClass('MuiChip-filled')
  })
});

