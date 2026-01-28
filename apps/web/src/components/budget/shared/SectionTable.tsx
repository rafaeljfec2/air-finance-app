import type { ReactNode } from 'react';

export interface TableColumn {
  readonly key: string;
  readonly label: string;
  readonly width: string;
  readonly align?: 'left' | 'center' | 'right';
}

interface SectionTableProps<T> {
  readonly columns: TableColumn[];
  readonly data: T[];
  readonly keyExtractor: (item: T) => string;
  readonly renderCell: (item: T, column: TableColumn) => ReactNode;
}

export function SectionTable<T>({ columns, data, keyExtractor, renderCell }: SectionTableProps<T>) {
  const getAlignClass = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  return (
    <table className="w-full text-xs">
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className={`px-2 py-1.5 text-gray-400 ${col.width} ${getAlignClass(col.align)}`}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-border/60 dark:divide-border-dark/60">
        {data.map((item) => (
          <tr key={keyExtractor(item)}>
            {columns.map((col) => (
              <td key={col.key} className={`px-2 py-1.5 ${getAlignClass(col.align)}`}>
                {renderCell(item, col)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
