import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


export interface Item {

  profile_image: '',
  Emp_Name: '',
  Age: 0,
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
  Aadhar: '',
  PanCard: '',
  Passport: '',
  E_Relationship: '',
}

@Component({
  selector: 'app-editeducation',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  selectedItem: Item | undefined;
  Aadhar: string | undefined;
  editexp() {
    // Navigate to the dashboard component
    this.router.navigate(['/editexperience']);
  }

  editpro() {
    this.router.navigate(['/editeducation'])
  }
  error = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
  }

  getItemById(): void {
    if (this.Aadhar !== undefined) {
      // this.loading = true;
      this.http.get<Item>('http://localhost:8090/api/emp_info/' + this.Aadhar)
        .subscribe({
          next: (item) => {
            console.log(item);
            this.selectedItem = Object(item)[0];
          },
          error: (error) => {
            this.error = 'Error fetching item by ID';
            console.error('Error fetching item by ID:', error);
          }
        });
    }
  }
  updateItem(): void {
    if (this.selectedItem) {
      this.http.put<Item>('http://localhost:8090/api/emp_info/' + this.selectedItem.Aadhar, this.selectedItem)
        .subscribe({
          next: (updatedItem) => {
            alert('Successfully updated');
            console.log('Item updated successfully:', updatedItem);
          },
          error: (error) => {
            alert(error);
            console.error('Error updating item:', error);
          }
        });
    } else {
      console.error('No item selected for update');
    }
  }

  navigateToExperience(): void {
    if (this.selectedItem && this.selectedItem.Aadhar) {
      // Navigate to the editeducation form and pass the Aadhar number as a query parameter
      this.router.navigate(['/editeducation'], {
        queryParams: { aadhar: this.selectedItem.Aadhar },
      });
    }
  }

}
