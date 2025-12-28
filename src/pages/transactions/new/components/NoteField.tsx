import { Textarea } from '@/components/ui/textarea';

interface NoteFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function NoteField({ value, onChange }: Readonly<NoteFieldProps>) {
  return (
    <div className="p-3 sm:p-4 space-y-2 bg-background dark:bg-background-dark">
      <div>
        <label
          htmlFor="note"
          className="block text-sm font-medium text-text dark:text-text-dark mb-1"
        >
          Observação
        </label>
        <Textarea
          id="note"
          name="note"
          value={value}
          onChange={onChange}
          placeholder="Adicione uma observação (opcional)"
          rows={3}
        />
      </div>
    </div>
  );
}

