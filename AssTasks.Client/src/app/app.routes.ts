import { Routes } from '@angular/router';
import { CreateTaskComponent } from "./components/create-task/create-task.component";
import { TaskGridComponent } from "./components/task-grid/task-grid.component";

export const routes: Routes = [
    { path: '', component: TaskGridComponent },
    { path: 'create-task', component: CreateTaskComponent },
];
