import { Textarea } from '@/components/ui/textarea';

interface NoteFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function NoteField({ value, onChange }: Readonly<NoteFieldProps>) {
  return (
    <div className="p-3 bg-background dark:bg-background-dark">
      <div>
        <label
          htmlFor="note"
          className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1"
        >
          Observação
        </label>
        <Textarea
          id="note"
          name="note"
          value={value}
          onChange={onChange}
          placeholder="Adicione uma observação (opcional)"
          rows={2}
          className="min-h-[60px] resize-none bg-background dark:bg-background-dark border-border dark:border-border-dark rounded-lg text-sm"
        />
      </div>
    </div>
  );
}

