import { Modal } from '@/components/ui/Modal';
import { OnboardingFlow } from './OnboardingFlow';

export interface OnboardingModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onComplete: () => void | Promise<void>;
}

export function OnboardingModal({ open, onClose, onComplete }: Readonly<OnboardingModalProps>) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      dismissible={true}
      className="max-w-4xl w-full overflow-y-auto overflow-hidden flex flex-col max-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-2rem)] lg:max-h-[calc(100dvh-2rem)] bg-background dark:bg-background-dark border border-border dark:border-border-dark"
    >
      <div className="flex flex-col h-full min-h-0">
        <div className="flex-1 min-h-0 overflow-y-auto">
          <OnboardingFlow onComplete={onComplete} onSkip={onClose} showStepIndicator={true} />
        </div>
      </div>
    </Modal>
  );
}
