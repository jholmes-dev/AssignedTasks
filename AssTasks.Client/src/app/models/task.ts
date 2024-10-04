import { TaskParent } from './task-parent';

export interface Task {
    id: number;
    createdAt: Date;
    completedAt?: Date;
    dueAt: Date;
    completedBy?: number;
    ownerId?: number;
    taskParent: TaskParent;
}