import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AadharService {
  private aadharSource = new BehaviorSubject<string>('');
  currentAadhar = this.aadharSource.asObservable();

  constructor() { }

  changeAadhar(aadhar: string) {
    this.aadharSource.next(aadhar);
  }
}