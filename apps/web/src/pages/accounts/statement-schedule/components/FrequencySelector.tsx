import { scheduleOptions, type FrequencyType } from '../utils/scheduleUtils';

interface FrequencySelectorProps {
  selectedType: FrequencyType;
  onSelect: (type: FrequencyType) => void;
}

export function FrequencySelector({
  selectedType,
  onSelect,
}: Readonly<FrequencySelectorProps>) {
  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium text-text dark:text-text-dark">Frequência</h2>
      <div className="space-y-2">
        {scheduleOptions.map((option) => (
          <button
            key={option.type}
            type="button"
            onClick={() => onSelect(option.type)}
            className={`w-full p-3 rounded-lg border transition-all text-left ${
              selectedType === option.type
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-border dark:border-border-dark hover:border-primary-300 dark:hover:border-primary-700'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <div className="text-sm font-medium text-text dark:text-text-dark">
                  {option.label}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  {option.description}
                </div>
              </div>
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  selectedType === option.type
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {selectedType === option.type && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
