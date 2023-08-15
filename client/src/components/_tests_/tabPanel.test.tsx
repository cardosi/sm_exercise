import { render } from '@testing-library/react'
import { TabPanel } from '../tabPanel'

describe('TabPanel', () => {

  it('renders correctly when value equals index', () => {
    const { getByText } = render(<TabPanel value={1} index={1}>Test Content</TabPanel>)
    expect(getByText('Test Content')).toBeInTheDocument()
  })

  it('does not render content when value does not equal index', () => {
    const { queryByText } = render(<TabPanel value={1} index={2}>Test Content</TabPanel>)
    expect(queryByText('Test Content')).toBeNull()
  })

  it('has correct role and id attributes', () => {
    const { getByRole } = render(<TabPanel value={1} index={1}>Test Content</TabPanel>)
    const tabPanel = getByRole('tabpanel')
    expect(tabPanel).toBeInTheDocument()
    expect(tabPanel.getAttribute('id')).toBe('tabpanel-1')
  })
})
