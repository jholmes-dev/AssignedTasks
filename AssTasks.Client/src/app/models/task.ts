import { TaskParent } from './task-parent';

export interface Task {
    id: number;
    createdAt: string;
    completedAt?: string;
    dueAt: string;
    completedBy?: number;

    taskParent: TaskParent;
    // owner?: User; // TODO: This will be User model
}