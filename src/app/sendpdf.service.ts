import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from './admin/admin.component'; // Import Item from the appropriate file

@Injectable({
  providedIn: 'root'
})
export class SendpdfService {

  constructor(private http: HttpClient) { }

  sendPDF(data: { email: string, employee: Item }, backendURL: string): Observable<any> {
    return this.http.post<any>(`${backendURL}/sendPDF`, data);
  }
}