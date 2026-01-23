export interface BillPeriod {
  startDate: string;
  endDate: string;
}

export const calculateBillPeriod = (month: string, dueDay: number): BillPeriod => {
  const [year, monthNum] = month.split('-').map(Number);
  
  const nextMonth = monthNum === 12 ? 1 : monthNum + 1;
  const nextYear = monthNum === 12 ? year + 1 : year;
  
  const dueDate = new Date(nextYear, nextMonth - 1, dueDay);
  const closingDate = new Date(dueDate);
  closingDate.setDate(closingDate.getDate() - 7);
  
  const previousMonth = monthNum === 1 ? 12 : monthNum - 1;
  const previousYear = monthNum === 1 ? year - 1 : year;
  const daysInPreviousMonth = new Date(previousYear, previousMonth, 0).getDate();
  
  const startDate = new Date(previousYear, previousMonth - 1, daysInPreviousMonth);
  const endDate = new Date(closingDate.getFullYear(), closingDate.getMonth(), closingDate.getDate());
  
  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };
  
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
};

export const calculateDueDate = (month: string, dueDay: number): string => {
  const [year, monthNum] = month.split('-').map(Number);
  const nextMonth = monthNum === 12 ? 1 : monthNum + 1;
  const nextYear = monthNum === 12 ? year + 1 : year;
  return `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(dueDay).padStart(2, '0')}`;
};

export const determineBillStatus = (
  month: string,
  dueDay: number,
  currentDate: Date = new Date(),
): 'OPEN' | 'CLOSED' | 'PAID' => {
  const [year, monthNum] = month.split('-').map(Number);
  
  const nextMonth = monthNum === 12 ? 1 : monthNum + 1;
  const nextYear = monthNum === 12 ? year + 1 : year;
  const dueDate = new Date(nextYear, nextMonth - 1, dueDay);
  
  const closingDate = new Date(dueDate);
  closingDate.setDate(closingDate.getDate() - 7);
  
  if (currentDate > dueDate) {
    return 'PAID';
  }
  
  if (currentDate > closingDate) {
    return 'CLOSED';
  }
  
  return 'OPEN';
};
