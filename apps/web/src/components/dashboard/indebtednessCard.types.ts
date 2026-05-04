export interface Suggestion {
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  priority: number;
}
