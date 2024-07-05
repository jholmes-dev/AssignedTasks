import { TaskParent } from './task-parent';

export interface Task {
    id: number;
    createdAt: Date;
    completedAt?: Date;
    dueAt?: Date;
    completedBy?: number;

    taskParent: TaskParent;
    // owner?: User; // TODO: This will be User model
}