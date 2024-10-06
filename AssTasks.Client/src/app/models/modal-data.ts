import { Task } from './task';
import { TaskParent } from './task-parent';
import { User } from './user';

export interface BaseModalData {
    state: boolean;
}

export interface CreateTaskModalData extends BaseModalData {
    data: {
        taskParent: TaskParent | null
    };
}

export interface CreateEditUserModalData extends BaseModalData {
    data: {
        user: User | null
    }
}

export interface CompleteTaskModalData extends BaseModalData {
    data: {
        task: Task
    }
}

export interface ReassignTaskModalData extends CompleteTaskModalData {};