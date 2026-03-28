// Water payment related types and utilities
export interface PreviousBill {
  id: string;
  billMonth: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'unpaid';
}
