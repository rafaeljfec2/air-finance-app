import { ComboBox } from '@/components/ui/ComboBox';
import { timeOptions } from '../utils/scheduleUtils';

interface TimeSelectorProps {
  selectedTime: string;
  onTimeChange: (time: string) => void;
}

export function TimeSelector({ selectedTime, onTimeChange }: Readonly<TimeSelectorProps>) {
  return (
    <div className="space-y-2">
      <ComboBox
        label="Horário"
        options={timeOptions.map((time) => ({
          value: time.value,
          label: time.label,
        }))}
        value={selectedTime}
        onValueChange={(value) => onTimeChange(value ?? '8')}
        placeholder="Selecione o horário"
      />
    </div>
  );
}
