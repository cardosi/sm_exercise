import { render, fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest'
import { MUIAlert } from '../alert';

describe('MUIAlert', () => {
  it('renders without crashing', () => {
    render(<MUIAlert message="Test message" open={true} setOpen={() => { }} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('closes when the close button is clicked', () => {
    const setOpen = vi.fn();
    render(<MUIAlert message="Test message" open={true} setOpen={setOpen} />);

    fireEvent.click(screen.getByRole('button'));
    expect(setOpen).toHaveBeenCalledWith(false);
  });
});
