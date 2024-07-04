import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Task } from '../../models/task';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  @Input() task!: Task;
}
