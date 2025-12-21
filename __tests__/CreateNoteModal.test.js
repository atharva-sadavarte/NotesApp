// __tests__/CreateNoteModal.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CreateNoteModal from '../src/components/CreateNoteModal';

describe('CreateNoteModal', () => {
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();

  const props = {
    visible: true,
    mode: 'create',
    initialTitle: '',
    initialContent: '',
    onSubmit: mockOnSubmit,
    onClose: mockOnClose,
    loading: false,
  };

  it('renders correctly and matches snapshot', () => {
    const { toJSON } = render(<CreateNoteModal {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('shows error when submitting empty title', () => {
    const { getByText } = render(<CreateNoteModal {...props} />);
    fireEvent.press(getByText('Create Note'));
    expect(getByText('Title is required')).toBeTruthy();
  });

  it('calls onSubmit with title and content', () => {
    const { getByText, getByPlaceholderText } = render(
      <CreateNoteModal {...props} />
    );

    fireEvent.changeText(getByPlaceholderText('Note Title'), 'My Note');
    fireEvent.changeText(getByPlaceholderText('Note Content'), 'Content');
    fireEvent.press(getByText('Create Note'));

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'My Note',
        content: 'Content',
      })
    );
  });

  it('calls onClose when cancel button is pressed', () => {
    const { getByText } = render(<CreateNoteModal {...props} />);
    fireEvent.press(getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
