import { TaskTypes } from '../../constants/task.constants';

export interface CreateAssTaskView {
    title: string;
    description: string;
    frequencyType: TaskTypes;
    priority: number;
    frequency: number;
    days?: number[];
}