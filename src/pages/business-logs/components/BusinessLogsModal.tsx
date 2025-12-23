import { Modal } from '@/components/ui/Modal';
import { BusinessLogsPageContent } from './BusinessLogsPageContent';

interface BusinessLogsModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly entityId?: string;
  readonly entityType?: string;
}

export function BusinessLogsModal({
  open,
  onClose,
  entityId,
  entityType,
}: BusinessLogsModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Histórico de Operações"
      className="w-full max-w-7xl mx-4 max-h-[90vh] overflow-hidden flex flex-col"
    >
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <BusinessLogsPageContent entityId={entityId} entityType={entityType} />
      </div>
    </Modal>
  );
}

