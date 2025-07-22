import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session-expired-modal',
  standalone: true,
  imports: [],
  templateUrl: './session-expired-modal.component.html',
  styleUrl: './session-expired-modal.component.css',
})
export class SessionExpiredModalComponent {
  @Output() accept = new EventEmitter<void>();

  onAccept() {
    this.accept.emit();
  }
}
