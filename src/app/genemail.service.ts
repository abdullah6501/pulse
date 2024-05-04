import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EducationService {
  private apiUrl = 'http://localhost:8088';

  constructor(private http: HttpClient) { }

  updateEmployeeEmailInEducationSystem(Aadhar: string, newEmail: string): Observable<any> {
    const url = `${this.apiUrl}/store-email`;
    return this.http.post(url, { Aadhar: Aadhar, email: newEmail });
  }
}
