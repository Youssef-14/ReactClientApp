import React from 'react';
import { render ,Screen } from '@testing-library/react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import expect from "expect";

it('renders without crashing', async () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(
    <MemoryRouter>
      <App />
    </MemoryRouter>);
  await new Promise(resolve => setTimeout(resolve, 1000));
});

test('Filter', () => {
  render(<App />);
  const linkElement = Screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
