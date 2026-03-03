import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskFormComponent {

  title: string = '';
  description: string = '';

  @Output() taskCreated = new EventEmitter<Task>();

  constructor(private taskService: TaskService) {}

  submit(): void {

    if (!this.title || !this.description) return;

    const newTask = {
      title: this.title,
      description: this.description,
      isCompleted: false
    };

    this.taskService.create(newTask).subscribe({
      next: (createdTask) => {

        // Emit to parent (TaskListComponent)
        this.taskCreated.emit(createdTask);

        // Clear form
        this.title = '';
        this.description = '';
      },
      error: (err) => {
        console.error('Create error:', err);
      }
    });
  }
}
