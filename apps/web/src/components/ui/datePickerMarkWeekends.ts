export function markWeekendDaysInCalendar(
  calendar: HTMLElement | null | undefined,
  currentMonth: number,
  currentYear: number,
): void {
  const days = calendar?.querySelectorAll('.flatpickr-day');
  days?.forEach((day) => {
    const dayElement = day as HTMLElement;

    if (dayElement.classList.contains('flatpickr-disabled')) {
      dayElement.classList.remove('weekend');
      return;
    }

    if (
      dayElement.classList.contains('prevMonthDay') ||
      dayElement.classList.contains('nextMonthDay')
    ) {
      dayElement.classList.remove('weekend');
      return;
    }

    const dayNum = dayElement.textContent?.trim();
    if (!dayNum) {
      dayElement.classList.remove('weekend');
      return;
    }

    const dayValue = Number.parseInt(dayNum, 10);
    if (Number.isNaN(dayValue) || dayValue < 1 || dayValue > 31) {
      dayElement.classList.remove('weekend');
      return;
    }

    const dateObj = new Date(currentYear, currentMonth, dayValue);

    if (
      dateObj.getMonth() === currentMonth &&
      dateObj.getFullYear() === currentYear &&
      dateObj.getDate() === dayValue
    ) {
      const dayOfWeek = dateObj.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        dayElement.classList.add('weekend');
      } else {
        dayElement.classList.remove('weekend');
      }
    } else {
      dayElement.classList.remove('weekend');
    }
  });
}
