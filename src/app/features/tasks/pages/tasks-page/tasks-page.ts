import { Component } from '@angular/core';
import { TaskListComponent } from '../../components/task-list/task-list';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [TaskListComponent],
  template: `
    <h1>Focus on what matters..</h1>
    <app-task-list></app-task-list>
  `
})
export class TasksPageComponent {}
