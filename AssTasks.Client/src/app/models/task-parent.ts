import { TaskTypes } from '../constants/task.constants';

interface BaseTaskParent {
    id: number;
    title: string;
    description?: string;
    active: boolean;
    priority: number;
    frequency: number;
    createdAt: Date;
}

interface IntervalTaskParent extends BaseTaskParent {
    frequencyType: TaskTypes.INTERVAL_TASK;
}

interface DaysTaskParent extends BaseTaskParent {
    frequencyType: TaskTypes.DAYS_TASK;
    days: number[];
}

export type TaskParent = IntervalTaskParent | DaysTaskParent;