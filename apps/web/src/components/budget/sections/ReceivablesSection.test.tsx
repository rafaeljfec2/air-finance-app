import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Receivable } from '@/types/budget';

import { ReceivablesSection } from './ReceivablesSection';

const mockToggleStatus = vi.fn();
const mockStartEditing = vi.fn();
const mockCommitValueOnBlur = vi.fn();
const mockHandleKeyDown = vi.fn();
const mockHandleValueChange = vi.fn();

vi.mock('../hooks/useReceivableActions', () => ({
  useReceivableActions: () => ({
    editingId: null,
    editingValue: '',
    inputRef: { current: null },
    isUpdating: false,
    togglingId: null,
    isToggleable: () => true,
    isValueEditable: () => true,
    startEditing: mockStartEditing,
    commitValueOnBlur: mockCommitValueOnBlur,
    handleKeyDown: mockHandleKeyDown,
    handleValueChange: mockHandleValueChange,
    toggleStatus: mockToggleStatus,
  }),
}));

const receivables: Receivable[] = [
  {
    id: 'rx-pending',
    description: 'OUTSERA',
    value: 25376.4,
    dueDate: '2026-08-20',
    status: 'PENDING',
  },
  {
    id: 'rx-received',
    description: 'AIRBNB ESPIRITO SANTO 1/6',
    value: 210.66,
    dueDate: '2026-08-31',
    status: 'RECEIVED',
  },
  {
    id: 'rx-finishing',
    description: 'Parcela 3/3 final',
    value: 100,
    dueDate: '2026-08-15',
    status: 'PENDING',
  },
];

describe('ReceivablesSection', () => {
  beforeEach(() => {
    mockToggleStatus.mockClear();
    mockStartEditing.mockClear();
  });

  it('renders grouped sections by default', () => {
    render(<ReceivablesSection receivables={receivables} isLoading={false} />);

    expect(screen.getByRole('heading', { name: /Outras Receitas/i })).toBeInTheDocument();
    expect(screen.getByText('OUTSERA')).toBeInTheDocument();
    expect(screen.getAllByText('Pendente').length).toBeGreaterThanOrEqual(1);
  });

  it('toggles status when clicking a pending badge', () => {
    render(<ReceivablesSection receivables={receivables} isLoading={false} />);

    fireEvent.click(screen.getAllByRole('button', { name: /^Pendente$/i })[0]);

    expect(mockToggleStatus).toHaveBeenCalled();
  });

  it('starts value editing on double click', () => {
    render(<ReceivablesSection receivables={receivables} isLoading={false} />);

    const valueCell = screen.getByRole('button', { name: /R\$\s*25\.376,40/i });
    fireEvent.doubleClick(valueCell);

    expect(mockStartEditing).toHaveBeenCalledWith('rx-pending', 25376.4);
  });
});
