// import { Item } from './../user/user.component';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import the jspdf-autotable plugin
import { Router } from '@angular/router';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { SendpdfService } from '../sendpdf.service';
import { Subscription } from 'rxjs';


export interface Item {
  profile_image: '',
  Emp_Name: '',
  First_Name: '',
  Middle_Name: '',
  Last_Name: '',
  Age: '',
  DOB: '',
  Gender: '',
  Marital_Status: '',
  Blood_Group: '',
  Nationality: '',
  Current_Location: '',
  Permanent_Location: '',
  Phone: '',
  Email: '',
  Language_Known: '',
  Aadhar: number,
  PanCard: '',
  Passport: '',
  E_Relationship: '',
  E_Name: '',
  E_Phone: '',
  isDeactivated?: boolean;
  disabled?: boolean;
  profile_image_url: string;
  is_deleted: number;
  employee_data: '',
  genEmail: string;
}


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  employee_data: Item[] = [];
  Emp_Name: string | undefined;
  email: string = '';

  private subscription: Subscription = new Subscription();



  private searchSubject = new Subject<string>();
  adminedu() {
    // Navigate to the dashboard component
    this.router.navigate(['/admineducation']);
  }
  adminexp() {
    // Navigate to the dashboard component
    this.router.navigate(['/adminexperience']);
  }
  backendURL: string = 'http://localhost:8090'; // Update this with your backend URL

  constructor(private http: HttpClient, private router: Router, private sendpdfService: SendpdfService) { }

  ngOnInit(): void {
    this.fetchItems();
    this.decodeImageUrls();
  }

  fetchItems(): void {
    this.http.get<Item[]>('http://localhost:8090/api/emp_info')
      .subscribe({
        next: (employee_data) => {
          this.employee_data = employee_data;
          this.decodeImageUrls();
        },
        error: (error) => {
          console.error('Error fetching items:', error);
        }
      });
  }

  onSearchChange(): void {
    // Only proceed if Emp_Name has a value
    if (this.Emp_Name) {
      // Make an HTTP GET request to fetch data from the backend
      this.http.get<Item[]>(`http://localhost:8090/api/emp_info?startsWith=${encodeURIComponent(this.Emp_Name)}`)
        .subscribe({
          next: (data) => {
            // Update employee_data with the retrieved data
            this.employee_data = data;

            // Decode profile images
            this.decodeImageUrls();

            // Optional: Add error handling if no results are found
            if (data.length === 0) {
              console.log('No matching employee found.');
            }
          },
          error: (error) => {
            console.log('Error fetching data from the backend:', error);
          }
        });
    } else {
      console.log('Please enter an employee name to search.');
    }
  }
  decodeImageUrls(): void {
    this.employee_data.forEach(item => {
      if (item.profile_image) {
        const hexEncodedImageUrl = item.profile_image as string;
        const decodedUrl = decodeURIComponent(hexEncodedImageUrl.replace(/(..)/g, '%$1'));
        item.profile_image_url = decodedUrl;
      }
    });
  }

  //pdf

  downloadAllPDF(): void {
    if (this.employee_data.length === 0) {
      return; // No data to download
    }

    const doc = new jsPDF.default();
    const tableData = this.getTableData();
    doc.text('Employee Records', 10, 10);

    // Call autoTable method on the jsPDF instance
    (doc as any).autoTable({
      head: [Object.keys(this.employee_data[0])],
      body: tableData
    });

    doc.save('all_data.pdf');

    // Mark all items as deactivated
    this.employee_data.forEach(item => {
      if (!item.isDeactivated) {
        item.isDeactivated = true;
      }
    });
  }

  // private getTableData(): any[] {
  //   return this.employee_data.map(item => Object.values(item));
  // }
  private getTableData(): string[][] {
    // Extract values from employee_data and convert to string
    const rawData: string[][] = this.employee_data.map(item => Object.values(item).map(value => String(value)));

    // Find the maximum width and height of the content
    let maxWidth = 0;
    let maxHeight = 0;
    rawData.forEach(row => {
      row.forEach(cell => {
        const cellWidth = cell.length;
        if (cellWidth > maxWidth) {
          maxWidth = cellWidth;
        }
        const cellHeight = cell.split('\n').length;
        if (cellHeight > maxHeight) {
          maxHeight = cellHeight;
        }
      });
    });

    // Create table data with uniform cell size
    const tableData: string[][] = [];
    rawData.forEach(row => {
      const newRow: string[] = [];
      row.forEach(cell => {
        const lines = cell.split('\n');
        const paddedLines = lines.map(line => line.padEnd(maxWidth, ' '));
        for (let i = lines.length; i < maxHeight; i++) {
          paddedLines.push(' '.repeat(maxWidth));
        }
        newRow.push(paddedLines.join('\n'));
      });
      tableData.push(newRow);
    });

    return tableData;
  }

  //csv
  downloadCSV(Aadhar: number): void {
    const dataForCSV = this.employee_data.find(item => item.Aadhar === Aadhar);
    if (dataForCSV && !dataForCSV.isDeactivated) {
      const csvContent = this.convertToCSV([dataForCSV]);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const downloadLink = document.createElement('a');
      const url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.setAttribute('download', `data_${Aadhar}.csv`);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      dataForCSV.isDeactivated = true;
    }
  }

  private convertToCSV(data: any[]): string {
    const csvHeader = Object.keys(data[0]).join(',');
    const csvRows = data.map(item => Object.values(item).join(',')).join('\n');
    return `${csvHeader}\n${csvRows}`;
  }

  downloadAllCSV(): void {
    if (this.employee_data.length === 0) {
      return; // No data to download
    }

    const csvContent = this.convertToCSV(this.employee_data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const downloadLink = document.createElement('a');
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.setAttribute('download', `all_data.csv`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Mark all items as deactivated
    this.employee_data.forEach(item => {
      if (!item.isDeactivated) {
        item.isDeactivated = true;
      }
    });
  }

  fetchEmployeeData(): void {
    // Make an HTTP request to fetch employee data from the backend
    this.http.get<Item[]>('http://localhost:8090/api/emp_info').subscribe({
      next: (data) => {
        this.employee_data = data;
      },
      error: (error) => {
        console.error('Error fetching employee data:', error);
      }
    });
  }

  toggleActivation(employee: Item): void {
    const url = `http://localhost:8090/api/emp_info/${employee.Aadhar}/toggle`;

    this.http.put(url, {}).subscribe({
      next: () => {
        employee.is_deleted = employee.is_deleted === 1 ? 0 : 1; // Toggle the status
        console.log('Employee activation status toggled successfully');
      },
      error: (error) => {
        console.error('Error toggling employee activation:', error);
      }
    });
  }

  generateEmail(item: Item): void {
    const firstName = item.Emp_Name.toLowerCase().replace(/\s/g, ''); // Remove spaces from name
    const increment = this.getIncrementForEmail(item.Emp_Name);
    const newEmail = `${firstName}${increment}@devpozent.com`;
    item.genEmail = newEmail;


    // Make HTTP POST request to store email in database
    this.http.post<any>('http://localhost:8090/store-email', { Aadhar: item.Aadhar, email: newEmail })
      .pipe(
        tap(response => {
          console.log('Email stored successfully:', response);
        }),
        catchError(error => {
          console.error('Error storing email:', error);
          return of(null);
        })
      )
      .subscribe();
  }


  private getIncrementForEmail(name: string): number {
    // Find the maximum increment value for employees with the same name
    const employeesWithSameName = this.employee_data.filter(item => item.Emp_Name === name && item.genEmail);
    if (employeesWithSameName.length === 0) {
      return 0; // No existing emails, start with 1
    }
    const maxIncrement = Math.max(...employeesWithSameName.map(item => parseInt(item.genEmail.split('poz')[1]) || 0), 0);
    return maxIncrement + 1; // Increment the maximum value
  }

  sendPDF(email: string, employee: Item) {
    const data = { email, employee };
    this.subscription.add(
      this.sendpdfService.sendPDF(data, this.backendURL).subscribe({
        next: (response) => {
          console.log('PDF sent successfully');
        },
        error: (error) => {
          console.error('Error sending PDF:', error);
        }
      })
    );
  }
}



