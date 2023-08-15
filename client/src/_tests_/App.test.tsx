import { render, fireEvent } from '@testing-library/react'
import App from '../App'

describe('App', () => {

  it('renders correctly', () => {
    const { getByText } = render(<App />)
    expect(getByText('SM Slices')).toBeInTheDocument()
    expect(getByText('Owners')).toBeInTheDocument()
    expect(getByText('Chefs')).toBeInTheDocument()
  })

  it('changes tab and displays correct content when tab is clicked', () => {
    const { getByText, queryByText } = render(<App />)
    expect(getByText('Available Toppings')).toBeInTheDocument()
    expect(queryByText('Pizzas')).toBeNull()
    fireEvent.click(getByText('Chefs'))
    expect(queryByText('Available Toppings')).toBeNull()
    expect(getByText('Pizzas')).toBeInTheDocument()
  })
})
