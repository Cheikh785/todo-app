import { Priority } from './priority.enum';
import { Label } from './label.enum';

export interface Todo {
  id?: number;
  title: string;
  personId: number;
  startDate: string | Date;
  endDate: string | Date | null;
  priority: Priority;
  labels: Label[];
  description: string;
}
