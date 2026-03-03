import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskFormComponent } from '../task-form/task-form';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskFormComponent, FormsModule, NgIf],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  recentlyDeletedTask: Task | null = null;
  undoTimeout: any = null;

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
  ) {
    console.log('TaskList instance created:', Math.random());
  }

  ngOnInit(): void {
    console.log('TaskList initialized:', Math.random());
    this.reloadTasks(); //only for the initial reload, after that we will update the local state directly
  }
  reloadTasks(): void {
    this.taskService.getAll().subscribe({
      next: (data) => {
        this.tasks = [...data].sort((a, b) => b.id - a.id);

        console.log('Tasks loaded into THIS instance:', this.tasks);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('API Error:', err);
      },
    });
  }

  addTaskToList(task: Task): void {
    this.tasks = [task, ...this.tasks];
    this.cdr.detectChanges();
  }

  deleteTask(id: number): void {
    const taskToDelete = this.tasks.find((t) => t.id === id);
    if (!taskToDelete) return;

    // Remove from UI immediately
    this.tasks = this.tasks.filter((t) => t.id !== id);
    this.recentlyDeletedTask = taskToDelete;

    this.cdr.detectChanges();

    // Start 5 second timer
    this.undoTimeout = setTimeout(() => {
      this.taskService.delete(id).subscribe({
        error: (err) => {
          console.error('Delete error:', err);
        },
      });

      this.recentlyDeletedTask = null;

      // 🔥 Required in zoneless mode
      this.cdr.detectChanges();
    }, 5000);
  }

  toggleComplete(task: Task): void {
    const updatedTask = {
      title: task.title,
      description: task.description,
      isCompleted: !task.isCompleted,
    };

    this.taskService.update(task.id, updatedTask).subscribe({
      next: () => {
        // Update local state
        task.isCompleted = !task.isCompleted;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Update error:', err);
      },
    });
  }

  //edit method
  editingTaskId: number | null = null;
  editTitle: string = '';
  editDescription: string = '';

  startEdit(task: Task): void {
    this.editingTaskId = task.id;
    this.editTitle = task.title;
    this.editDescription = task.description;
  }

  saveEdit(task: Task): void {
    const updatedTask = {
      title: this.editTitle,
      description: this.editDescription,
      isCompleted: task.isCompleted,
    };

    this.taskService.update(task.id, updatedTask).subscribe({
      next: () => {
        const index = this.tasks.findIndex((t) => t.id === task.id);
        //local sate update;
        if (index !== -1) {
          this.tasks[index] = {
            ...task,
            ...updatedTask,
          };
        }

        this.editingTaskId = null;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Edit error:', err);
      },
    });
  }
  cancelEdit(): void {
    this.editingTaskId = null;
  }

  undoDelete(): void {
    if (!this.recentlyDeletedTask) return;

    clearTimeout(this.undoTimeout);

    // Restore task at top
    this.tasks = [this.recentlyDeletedTask, ...this.tasks];

    this.recentlyDeletedTask = null;

    this.cdr.detectChanges();
  }
}
