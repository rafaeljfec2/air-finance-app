interface EmptyStateProps {
  readonly message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return <p className="px-3 py-4 text-center text-gray-500 dark:text-gray-400">{message}</p>;
}
