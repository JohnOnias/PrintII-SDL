import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Input from './Input';

describe('Input Component', () => {
  it('renders the label and input with correct placeholder', () => {
    render(<Input nome="E-mail" placeholder="usuario@email.com" />);
    
    expect(screen.getByText('E-mail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('usuario@email.com')).toBeInTheDocument();
  });

  it('calls onChange handler when value changes', () => {
    const handleChange = vi.fn();
    render(<Input nome="E-mail" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('renders as disabled when the disabled prop is true', () => {
    render(<Input nome="E-mail" disabled={true} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('uses the correct input type', () => {
    render(<Input nome="Senha" tipo="password" />);
    
    const input = screen.getByLabelText('Senha');
    expect(input).toHaveAttribute('type', 'password');
  });
});
