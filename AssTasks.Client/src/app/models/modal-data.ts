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