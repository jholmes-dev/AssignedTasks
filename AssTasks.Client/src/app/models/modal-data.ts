import { TaskParent } from './task-parent';

export interface BaseModalData {
    state: boolean;
}

export interface CreateTaskModalData extends BaseModalData {
    data: {
        taskParent: TaskParent | null
    };
}