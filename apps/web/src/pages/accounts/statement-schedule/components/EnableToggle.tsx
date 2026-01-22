interface EnableToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function EnableToggle({ enabled, onToggle }: Readonly<EnableToggleProps>) {
  return (
    <div className="py-3 border-b border-border dark:border-border-dark">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onToggle(e.target.checked)}
          className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500 cursor-pointer"
        />
        <span className="text-sm font-medium text-text dark:text-text-dark">
          Sincronização automática
        </span>
      </label>
    </div>
  );
}
