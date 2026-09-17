import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { AddEntryModal } from '@/components/timesheets/AddEntryModal';
import { Project } from '@/types/project';

const mockProjects: Project[] = [
  { id: 'proj-1', name: 'Homepage Development' },
  { id: 'proj-2', name: 'Mobile App' },
];

describe('AddEntryModal Form Validation', () => {
  it('displays validation errors when submitting an empty form', async () => {
    const handleSubmit = vi.fn();
    const handleClose = vi.fn();

    render(
      <AddEntryModal
        isOpen={true}
        onClose={handleClose}
        onSubmit={handleSubmit}
        projects={[]}
        selectedDate="2024-01-22"
      />
    );

    // Click Add entry button without selecting project or entering description
    const submitButton = screen.getByRole('button', { name: /add entry/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please select a project/i)).toBeInTheDocument();
      expect(screen.getByText(/please provide a task description/i)).toBeInTheDocument();
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('submits successfully when required fields are filled', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    const handleClose = vi.fn();

    render(
      <AddEntryModal
        isOpen={true}
        onClose={handleClose}
        onSubmit={handleSubmit}
        projects={mockProjects}
        selectedDate="2024-01-22"
      />
    );

    // Select project
    const projectSelect = screen.getByLabelText(/select project/i);
    fireEvent.change(projectSelect, { target: { value: 'proj-1' } });

    // Enter task description
    const descTextarea = screen.getByPlaceholderText(/write text here/i);
    fireEvent.change(descTextarea, { target: { value: 'Revamp hero section banner' } });

    // Click submit
    const submitButton = screen.getByRole('button', { name: /add entry/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        projectId: 'proj-1',
        workType: 'Bug fixes',
        description: 'Revamp hero section banner',
        hours: 4,
        date: '2024-01-22',
      });
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
