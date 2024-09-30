import { CreateAssTaskView } from './create-asstask-view.model';

export interface EditAssTaskView extends CreateAssTaskView {
    Id: number;
    CreatedAt: Date;
}