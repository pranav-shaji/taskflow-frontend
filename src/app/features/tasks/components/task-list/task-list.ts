import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskFormComponent } from '../task-form/task-form';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { TaskSearch } from '../task-search/task-search';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskFormComponent, FormsModule, NgIf, TaskSearch],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskListComponent implements OnInit {
  filteredTasks: Task[] = [];
  tasks: Task[] = [];
  searchText: string = '';
  recentlyDeletedTask: Task | null = null;
  undoTimeout: any = null;
  activeFilter: string = 'all';

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer

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
        this.filteredTasks = this.tasks;   // ✅ IMPORTANT 

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
    this.filteredTasks = this.tasks; 
    this.cdr.detectChanges();
  }

  deleteTask(id: number): void {
    const taskToDelete = this.tasks.find((t) => t.id === id);
    if (!taskToDelete) return;

    // Remove from UI immediately
    this.tasks = this.tasks.filter((t) => t.id !== id);
    this.filteredTasks = this.tasks;
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

  addToCalendar(taskId: number) {
  this.taskService.getCalendarUrl(taskId).subscribe({
    next: (res: any) => {
      window.open(res.calendarUrl, '_blank');
    },
    error: (err) => {
      alert(err.error?.message || 'Unable to open calendar');
    }
  });
}




filterTasks(searchText: string) {

  this.searchText = searchText;

  if (!searchText) {
    this.filteredTasks = [...this.tasks];
    return;
  }

  const text = searchText.toLowerCase();

  this.filteredTasks = this.tasks
    .filter(task =>
      task.title.toLowerCase().includes(text) ||
      task.description.toLowerCase().includes(text)
    )
    .map(task => ({ ...task }));   // force Angular refresh
}


highlightText(text: string): SafeHtml {

  if (!this.searchText) return text;

  const escaped = this.searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const regex = new RegExp(`(${escaped})`, 'gi');

  const highlighted = text.replace(regex, `<span class="highlight">$1</span>`);

  return this.sanitizer.bypassSecurityTrustHtml(highlighted);
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

  filterBy(type: string) {

  this.activeFilter = type;

  let tempTasks = [...this.tasks];

  // Apply search first
  if (this.searchText) {
    const text = this.searchText.toLowerCase();

    tempTasks = tempTasks.filter(t =>
      t.title.toLowerCase().includes(text) ||
      t.description.toLowerCase().includes(text)
    );
  }

  const now = new Date();

  // Apply filter
  switch (type) {

    case 'pending':
      tempTasks = tempTasks.filter(t => !t.isCompleted);
      break;

    case 'completed':
      tempTasks = tempTasks.filter(t => t.isCompleted);
      break;

    case 'overdue':
      tempTasks = tempTasks.filter(t =>
        t.dueDate &&
        new Date(t.dueDate) < now &&
        !t.isCompleted
      );
      break;
  }

  this.filteredTasks = tempTasks;
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
