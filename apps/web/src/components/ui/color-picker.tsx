const COLORS = [
  '#8A05BE', // Roxo Nubank
  '#FF6900', // Laranja Itaú
  '#009688', // Verde
  '#1976D2', // Azul
  '#F44336', // Vermelho
  '#FFC107', // Amarelo
  '#607D8B', // Cinza
  '#22223B', // Escuro
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
  label?: string;
}

export function ColorPicker({
  value,
  onChange,
  className = '',
  label,
}: Readonly<ColorPickerProps>) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-text dark:text-text-dark mb-1">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        {COLORS.map((color) => (
          <button
            key={color}
            type="button"
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              value === color ? 'ring-2 ring-primary-500' : ''
            }`}
            style={{ background: color }}
            aria-label={`Selecionar cor ${color}`}
            onClick={() => onChange(color)}
          >
            {value === color && <span className="block w-3 h-3 rounded-full bg-white/80" />}
          </button>
        ))}
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 rounded-full cursor-pointer p-0 focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Selecionar cor personalizada"
          style={{ background: 'none' }}
        />
      </div>
    </div>
  );
}
