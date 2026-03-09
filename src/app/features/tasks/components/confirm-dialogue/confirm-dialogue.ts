import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialogue.html',
  styleUrls: ['./confirm-dialogue.css']
})
export class ConfirmDialog {

  @Input() message: string = ''

  @Output() confirmed = new EventEmitter<void>()
  @Output() cancelled = new EventEmitter<void>()

  confirm() {
    this.confirmed.emit()
  }

  cancel() {
    this.cancelled.emit()
  }

}