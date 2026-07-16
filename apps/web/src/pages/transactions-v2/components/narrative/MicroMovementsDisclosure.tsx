import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState, type ReactNode } from 'react';

interface MicroMovementsDisclosureProps {
  readonly microCount: number;
  readonly children: ReactNode;
}

export function MicroMovementsDisclosure({
  microCount,
  children,
}: Readonly<MicroMovementsDisclosureProps>) {
  const [expanded, setExpanded] = useState(true);

  if (microCount <= 0) {
    return null;
  }

  return (
    <div>
      {expanded ? children : null}
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-center justify-center gap-1 border-t border-border/40 px-3 py-1.5 text-[11px] font-medium text-text-muted transition-colors hover:bg-background/40 hover:text-text dark:border-border-dark/40 dark:text-text-muted-dark dark:hover:bg-background-dark/40 dark:hover:text-text-dark"
      >
        {expanded ? (
          <>
            Ocultar {microCount} micro {microCount === 1 ? 'movimento' : 'movimentos'}
            <ChevronUp className="h-3.5 w-3.5" />
          </>
        ) : (
          <>
            Ver mais {microCount} {microCount === 1 ? 'movimento' : 'movimentos'}
            <ChevronDown className="h-3.5 w-3.5" />
          </>
        )}
      </button>
    </div>
  );
}
