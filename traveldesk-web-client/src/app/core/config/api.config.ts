import { InjectionToken } from '@angular/core';

export const API_URL = new InjectionToken<string>('apiUrl');

export function provideApiUrl(url: string) {
  return {
    provide: API_URL,
    useValue: url,
  };
}
