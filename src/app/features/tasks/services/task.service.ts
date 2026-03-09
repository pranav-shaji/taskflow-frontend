import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'https://localhost:7080/api/tasks';

  constructor(private http: HttpClient) {}

  // GET all tasks
  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  // CREATE task
  create(task: Omit<Task, 'id'>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  // UPDATE task
  update(id: number, task: Omit<Task, 'id'>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, task);
  }

  // DELETE task
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  //add to calender
  // add to calendar
getCalendarUrl(taskId: number) {
  return this.http.get(`${this.apiUrl}/${taskId}/calendar-url`);
}

  
}


