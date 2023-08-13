
// import { test } from 'vitest';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import { Chefs } from '../chefs';

// test('renders', async ({ expect }) => {
//   render(<Chefs />);

//   // Check if the UI elements are present
//   expect(screen.getByText('Pizzas')).toBeInTheDocument();
//   expect(screen.getByText('Toppings')).toBeInTheDocument();
//   expect(screen.getByLabelText('Create A Pizza')).toBeInTheDocument();

//   // More checks...
// });

// test('creates a new pizza', async ({ expect }) => {
//   render(<Chefs />);

//   // Simulate user typing a new pizza name
//   fireEvent.change(screen.getByLabelText('Create A Pizza'), { target: { value: 'New Pizza' } });

//   // Simulate user clicking the create button
//   fireEvent.click(screen.getByText('Create'));

//   // Wait for the alert to show up
//   await waitFor(() => screen.getByText('Pizza New Pizza created successfully!'));

//   // Check if the new pizza is in the list
//   expect(screen.getByText('New Pizza')).toBeInTheDocument();
// });

// test('updates a pizza', async ({ expect }) => {
//   render(<Chefs />);

//   // Simulate user selecting a pizza
//   fireEvent.click(screen.getByText('Pizza to update'));

//   // Simulate user typing a new pizza name
//   fireEvent.change(screen.getByLabelText('Edit Pizza Name'), { target: { value: 'Updated Pizza' } });

//   // Simulate user clicking the update button
//   fireEvent.click(screen.getByText('Update'));

//   // Wait for the alert to show up
//   await waitFor(() => screen.getByText('Pizza Updated Pizza updated successfully!'));

//   // Check if the updated pizza is in the list
//   expect(screen.getByText('Updated Pizza')).toBeInTheDocument();
// });

// test('deletes a pizza', async ({ expect }) => {
//   render(<Chefs />);

//   // Simulate user clicking the delete button of a pizza
//   fireEvent.click(screen.getByText('Delete Pizza to delete'));

//   // Wait for the alert to show up
//   await waitFor(() => screen.getByText('Pizza deleted successfully!'));

//   // Check if the pizza is not in the list
//   expect(screen.queryByText('Pizza to delete')).not.toBeInTheDocument();
// });
