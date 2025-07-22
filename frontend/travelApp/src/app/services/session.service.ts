import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private sessionExpiredSubject = new BehaviorSubject<boolean>(false);
  sessionExpired$ = this.sessionExpiredSubject.asObservable();

  get sessionExpired(): boolean {
    return this.sessionExpiredSubject.value;
  }

  notifySessionExpired() {
    this.sessionExpiredSubject.next(true);
  }

  clearSessionExpired() {
    this.sessionExpiredSubject.next(false);
  }
}
