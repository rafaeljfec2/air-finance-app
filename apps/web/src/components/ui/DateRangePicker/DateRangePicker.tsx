import React, { useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check } from 'lucide-react';
import { PRESET_OPTIONS } from './datePresets';
import { useDateRangePicker } from './useDateRangePicker';
import { PresetButton, CalendarView, CustomDateInputs } from './components';

interface DateRangePickerProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly startDate?: string | Date | null;
  readonly endDate?: string | Date | null;
  readonly onApply: (startDate: Date | undefined, endDate: Date | undefined) => void;
  readonly trigger?: React.ReactNode;
  readonly position?: 'bottom' | 'top' | 'left' | 'right';
}

export function DateRangePicker({
  open,
  onClose,
  startDate: initialStartDate,
  endDate: initialEndDate,
  onApply,
  trigger,
  position = 'bottom',
}: DateRangePickerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const {
    dateRange,
    selectedPreset,
    currentMonth,
    secondMonth,
    customStartDate,
    customEndDate,
    handlePresetClick,
    handleRangeSelect,
    handleCustomStartDateChange,
    handleCustomEndDateChange,
    handleCustomApply,
    handleApply,
    handlePrevMonth,
    handleNextMonth,
    getRangeLabel,
  } = useDateRangePicker({
    open,
    initialStartDate,
    initialEndDate,
    onApply,
    onClose,
  });

  const handleApplyWithClose = useCallback(() => {
    handleApply();
    onClose();
  }, [handleApply, onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  const handleBackdropKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDialogElement>) => {
      if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!dialogRef.current) return;
    if (open) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleCancel = () => onClose();
    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [onClose]);

  const mobileContent = (
    <div className="w-full bg-card dark:bg-card-dark rounded-t-2xl shadow-lg">
      <div className="flex justify-center pt-3 pb-2">
        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
      </div>
      <div className="px-4 pb-4">
        <h2 className="text-lg font-semibold text-text dark:text-text-dark">Filtros</h2>
      </div>
      <div className="px-4 pb-4">
        <h3 className="text-sm font-medium text-text dark:text-text-dark mb-3">Período</h3>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_OPTIONS.map((preset) => (
            <PresetButton
              key={preset.id}
              preset={preset}
              isSelected={selectedPreset === preset.id}
              onClick={() => handlePresetClick(preset)}
              isFullWidth={preset.id === 'all'}
            />
          ))}
        </div>
      </div>
      <div className="px-4 pb-4">
        <h3 className="text-sm font-medium text-text dark:text-text-dark mb-3">
          Período personalizado
        </h3>
        <CustomDateInputs
          startDate={customStartDate}
          endDate={customEndDate}
          onStartDateChange={handleCustomStartDateChange}
          onEndDateChange={handleCustomEndDateChange}
          onApply={handleCustomApply}
        />
      </div>
    </div>
  );

  const desktopContent = (
    <div className="w-full max-w-4xl bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-lg shadow-lg">
      <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] lg:divide-x lg:divide-border lg:dark:divide-border-dark">
        <div className="p-3 lg:p-4 space-y-1 border-b lg:border-b-0 border-border dark:border-border-dark">
          {PRESET_OPTIONS.map((preset) => (
            <PresetButton
              key={preset.id}
              preset={preset}
              isSelected={selectedPreset === preset.id}
              onClick={() => handlePresetClick(preset)}
            />
          ))}
        </div>
        <div className="p-3 lg:p-4">
          <div className="mb-3 lg:mb-4">
            <p className="text-xs lg:text-sm text-muted-foreground dark:text-gray-400">
              Ou selecione um período personalizado
            </p>
          </div>
          <div className="flex gap-2 lg:gap-4">
            <CalendarView
              month={currentMonth}
              dateRange={dateRange}
              onSelect={handleRangeSelect}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              showBothArrows={true}
            />
            <div className="hidden lg:flex flex-1">
              <CalendarView
                month={secondMonth}
                dateRange={dateRange}
                onSelect={handleRangeSelect}
                onNextMonth={handleNextMonth}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 lg:p-4 border-t border-border dark:border-border-dark bg-card dark:bg-card-dark">
        <span className="text-xs lg:text-sm text-text dark:text-text-dark">{getRangeLabel()}</span>
        <Button
          onClick={handleApplyWithClose}
          className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2"
        >
          <Check className="h-4 w-4" />
          Aplicar
        </Button>
      </div>
    </div>
  );

  const content = (
    <>
      <div className="lg:hidden">{mobileContent}</div>
      <div className="hidden lg:block">{desktopContent}</div>
    </>
  );

  if (trigger) {
    return (
      <Popover
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) onClose();
        }}
      >
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent
          align="start"
          side={position}
          sideOffset={0}
          className="w-screen sm:w-auto max-w-screen sm:max-w-4xl p-0 border-0 bg-transparent shadow-none z-[9999] lg:bg-card lg:dark:bg-card-dark lg:border lg:border-border lg:dark:border-border-dark lg:rounded-lg lg:sideOffset-8 date-range-picker-modal"
        >
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  if (!open) return null;

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-end lg:items-center justify-center backdrop-blur-sm p-0 lg:p-4 animate-in fade-in duration-200 border-0 bg-transparent backdrop:bg-black/60"
      onClick={handleBackdropClick}
      onKeyDown={handleBackdropKeyDown}
      aria-label="Seletor de período"
    >
      <div className="w-full max-w-full lg:w-full lg:max-w-4xl lg:max-h-[90vh] overflow-auto lg:rounded-lg date-range-picker-modal">
        {content}
      </div>
    </dialog>
  );
}
