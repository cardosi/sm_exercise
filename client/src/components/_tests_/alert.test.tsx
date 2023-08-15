import { render, screen, fireEvent } from '@testing-library/react'
import { MUIAlert } from '../alert'

describe('MUIAlert', () => {
  it('renders Snackbar when alert is open', () => {
    render(<MUIAlert alert={{ open: true, message: 'Test message' }} setAlert={() => { }} />)
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('does not render Snackbar when alert is not open', () => {
    render(<MUIAlert alert={{ open: false, message: 'Test message' }} setAlert={() => { }} />)
    expect(screen.queryByText('Test message')).toBeNull()
  })

  it('calls setAlert with correct arguments when Snackbar is closed', () => {
    const setAlert = vi.fn()
    render(<MUIAlert alert={{ open: true, message: 'Test message' }} setAlert={setAlert} />)
    fireEvent.click(screen.getByRole('button'))
    expect(setAlert).toHaveBeenCalledWith(false, '')
  })
})
