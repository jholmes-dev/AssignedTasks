import { TaskParent } from './task-parent';

export interface Task {
    id: number;
    parent: TaskParent;
    created_at: Date;
    completed_at?: Date;
    completed_by?: number;
}