// import { Item } from './../user/user.component';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as jsPDF from 'jspdf';
import { Router } from '@angular/router';

import 'jspdf-autotable'; // Import the jspdf-autotable plugin

interface Item {
  Aadhar: string;
  CompanyName: string;
  DesignationDepartmentEmployeeNo: string;
  AddressTelephone: string;
  // DOB: Date;
  ReportingManagerDetails: string;
  EmploymentDates: string;
  AnnualCTC: string;
  // Marital_Status: string;
  // Aadhar: string;
  // Hobbies: string;
  // Language_Known: string;
  // Permanent_Address: string;
  // Temporary_Address: string;
  isDeactivated?: boolean;
  is_deleted: boolean;
  disabled?: boolean;
  // profile_image: Blob;

}

@Component({
  selector: 'app-adminexperience',
  templateUrl: './adminexperience.component.html',
  styleUrls: ['./adminexperience.component.css']
})
export class AdminexperienceComponent implements OnInit {
  employee_data: Item[] = [];

  // doc = new jsPDF();

  admin() {
    this.router.navigate(['/admin']);
  }
  adminedu() {
    this.router.navigate(['/admineducation']);
  }

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.fetchItems();
  }

  // fetchItems(): void {
  //   this.http.get<Item[]>('http://localhost:8088/api/profile')
  //     .subscribe({
  //       next: (employee_data) => {
  //         this.employee_data = employee_data.filter(Item => !Item.is_deleted)
  //       },
  //       error: (error) => {
  //         console.error('Error fetching items:', error);
  //       }
  //     });
  // }

  fetchItems(): void {
    this.http.get<Item[]>('http://localhost:8090/api/experience')
      .subscribe({
        next: (employee_data) => {
          this.employee_data = employee_data;
        },
        error: (error) => {
          console.error('Error fetching items:', error);
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
  downloadCSV(Aadhar: string): void {
    const dataForCSV = this.employee_data.find(item => item.Aadhar === Aadhar);
    if (dataForCSV && !dataForCSV.isDeactivated) {
      const csvContent = this.convertToCSV([dataForCSV]);
      // const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const downloadLink = document.createElement('a');
      // const url = URL.createObjectURL(blob);
      // downloadLink.href = url;
      downloadLink.setAttribute('download', `data_${Aadhar}.csv`);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      dataForCSV.isDeactivated = true;
    }
  }

  // deactivateItem(item: Item): void {
  //   item.isDeactivated = true;
  // }

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

  // activateEmployee(employeeId: number): void {
  //   const url = `http://localhost:8088/api/education/${employeeId}/activate`;

  //   this.http.put(url, {}).subscribe({
  //     next: () => {
  //       // Find the employee by ID and mark them as enabled
  //       const employee = this.employee_data.find(emp => emp.id === employeeId);
  //       if (employee) {
  //         employee.disabled = false; // Mark the employee as enabled
  //       } else {
  //         console.error('Employee not found with ID:', employeeId);
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error activating employee:', error);
  //     }
  //   });
  // }

  // deactivateEmployee(employeeId: number): void {
  //   const url = `http://localhost:8088/api/education/${employeeId}/deactivate`;

  //   this.http.put(url, {}).subscribe({
  //     next: () => {
  //       // Find the employee by ID and mark them as disabled
  //       const employee = this.employee_data.find(item => item.id === employeeId);
  //       if (employee) {
  //         employee.isDeactivated = true; // Mark the employee as deactivated
  //       } else {
  //         console.error('Employee not found with ID:', employeeId);
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error deactivating employee:', error);
  //     }
  //   });
  // }
  // toggleActivation(employeeId: number): void {
  //   const employee = this.employee_data.find(emp => emp.id === employeeId);
  //   if (employee) {
  //     if (employee.disabled) {
  //       this.activateEmployee(employeeId);
  //     } else {
  //       this.deactivateEmployee(employeeId);
  //     }
  //   } else {
  //     console.error('Employee not found with ID:', employeeId);
  //   }
  // }
}
