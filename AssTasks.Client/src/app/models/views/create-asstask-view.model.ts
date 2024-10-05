import { TaskTypes } from '../../constants/task.constants';

export interface CreateAssTaskView {
    Title: string;
    Description: string;
    FrequencyType: TaskTypes;
    Priority: number;
    Frequency: number;
    Days?: number[];
    StartDate: Date;
    Active: boolean;
    OwnerId?: number;
}