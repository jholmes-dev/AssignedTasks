import { TaskParent } from './task-parent';
import { User } from './user';

export interface Task {
    id: number;
    createdAt: Date;
    completedAt?: Date;
    dueAt: Date;
    completedBy?: number;
    ownerId?: number;
    owner?: User;
    taskParent: TaskParent;
}