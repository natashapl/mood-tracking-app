import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomCheckbox from '../CustomCheckbox';

describe('CustomCheckbox', () => {
  it('renders the label text', () => {
    render(
      <CustomCheckbox label="Grateful" checked={false} onChange={() => {}} />
    );
    expect(screen.getByText('Grateful')).toBeInTheDocument();
  });

  it('renders as unchecked by default', () => {
    render(
      <CustomCheckbox label="Calm" checked={false} onChange={() => {}} />
    );
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('renders as checked when checked prop is true', () => {
    render(
      <CustomCheckbox label="Joyful" checked={true} onChange={() => {}} />
    );
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls onChange when clicked', async () => {
    const handleChange = vi.fn();
    render(
      <CustomCheckbox label="Motivated" checked={false} onChange={handleChange} />
    );
    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('generates a unique id from the label', () => {
    render(
      <CustomCheckbox label="Very Happy" checked={false} onChange={() => {}} />
    );
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.id).toBe('checkbox-very-happy');
  });
});
