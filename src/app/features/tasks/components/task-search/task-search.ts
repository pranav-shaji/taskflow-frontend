import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-search.html',
  styleUrl: './task-search.css',
})
export class TaskSearch {
  searchText: string ='';

  @Output() searchChanged = new EventEmitter<string>();
  

  onSearchChange() {
    this.searchChanged.emit(this.searchText);
  }

}
