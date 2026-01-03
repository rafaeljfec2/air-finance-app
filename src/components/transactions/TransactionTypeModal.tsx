import { Dialog, Transition } from '@headlessui/react';
import { ArrowRightLeft, X } from 'lucide-react';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

interface TransactionTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionTypeModal({ isOpen, onClose }: Readonly<TransactionTypeModalProps>) {
  const navigate = useNavigate();

  const handleNavigate = (type: 'REVENUE' | 'EXPENSE') => {
    navigate(`/transactions/new?type=${type}`);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-card-dark p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    Nova Transação
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleNavigate('REVENUE')}
                    className="flex flex-col items-center justify-center p-6 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-100 dark:border-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors group"
                  >
                    <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                      <ArrowRightLeft className="w-6 h-6 rotate-90 sm:rotate-0" />
                    </div>
                    <span className="font-medium text-emerald-700 dark:text-emerald-300">
                      Receita
                    </span>
                  </button>

                  <button
                    onClick={() => handleNavigate('EXPENSE')}
                    className="flex flex-col items-center justify-center p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group"
                  >
                    <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 mb-3 group-hover:scale-110 transition-transform">
                      <ArrowRightLeft className="w-6 h-6 rotate-90 sm:rotate-0" />
                    </div>
                    <span className="font-medium text-red-700 dark:text-red-300">Despesa</span>
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
