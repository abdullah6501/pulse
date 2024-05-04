import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export interface Item {

  Aadhar: string;
  CompanyName: string;
  DesignationDepartmentEmployeeNo: string;
  AddressTelephone: string;
  ReportingManagerDetails: string;
  EmploymentDates: string;
  AnnualCTC: string;
}

@Component({
  selector: 'app-editexperience',
  templateUrl: './editexperience.component.html',
  styleUrls: ['./editexperience.component.css']
})
export class EditexperienceComponent implements OnInit {

  selectedItem: Item | undefined;
  Aadhar: string | undefined;
  CompanyName: string | undefined;

  error = '';

  editpro() {
    this.router.navigate(['/edit']);
  }
  editedu() {
    this.router.navigate(['/editeducation']);
  }
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    // Retrieve the Aadhar number from query parameters
    this.route.queryParams.subscribe((params) => {
      this.Aadhar = params['aadhar'];
      console.log('Aadhar number received:', this.Aadhar);
      // Now you can use the Aadhar number in the editeducation form
    });
  }

  getItemById(): void {
    if (this.Aadhar && this.CompanyName) {
        this.http.get<Item>(`http://localhost:8090/api/experience/${this.Aadhar}/${this.CompanyName}`)
            .subscribe({
                next: (item) => {
                    console.log(item);
                    this.selectedItem = Object(item)[0];
                },
                error: (error) => {
                    this.error = 'Error fetching item by ID';
                    console.log('Error fetching item by ID:', error);
                }
            });
    } else {
        console.error('Aadhar and Qualification must be provided');
                alert('hii')

    }
}
updateItem(): void {
    if (this.selectedItem && this.selectedItem.Aadhar && this.selectedItem.CompanyName) {
        // Construct the URL with both Aadhar and Qualification
        const url = `http://localhost:8090/api/experience/${this.selectedItem.Aadhar}/${this.selectedItem.CompanyName}`;

        // Perform the HTTP PUT request with the selected item data
        this.http.put<Item>(url, this.selectedItem)
            .subscribe({
                next: (updatedItem) => {
                    alert('Successfully updated');
                    console.log('Item updated successfully:', updatedItem);
                },
                error: (error) => {
                    console.log('Error updating item:', error);
                    alert('Error updating item. Please try again.');
                }
            });
    } else {
        console.error('Aadhar or Qualification is undefined');
        alert('Aadhar or Qualification is undefined. Please provide valid inputs.');
    }
}
}
