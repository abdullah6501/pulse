// education.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from './user/user.component';
// import { Education } from './education.model';

@Injectable({
  providedIn: 'root'
})
export class EducationService {
  private apiUrl = 'http://192.168.0.147:8090/education'; // Adjust URL to your backend endpoint

  constructor(private http: HttpClient) { }

  addEducation(education: Item): Observable<Item> {
    return this.http.post<Item>(this.apiUrl, education);
  }
}
