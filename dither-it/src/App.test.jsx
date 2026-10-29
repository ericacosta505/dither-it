import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the dithering controls', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Dither It' })).toBeInTheDocument();
  expect(screen.getByRole('combobox')).toBeInTheDocument();
});
