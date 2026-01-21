import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface StatementScheduleConfigProps {
  accountId: string;
  accountName: string;
  open: boolean;
  onClose: () => void;
}

export function StatementScheduleConfig({
  accountId,
  open,
  onClose,
}: Readonly<StatementScheduleConfigProps>) {
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      navigate(`/accounts/${accountId}/statement-schedule`);
      onClose();
    }
  }, [open, accountId, navigate, onClose]);

  return null;
}
