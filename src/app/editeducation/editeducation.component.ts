import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


export interface Item {

  Aadhar: string;
  Qualification: string;
  Discipline: string;
  School_College_Institute: string;
  Affiliated_Board_University: string;
  Marks_CGPA: string;
  Year_Enrollment: string;
  Year_Passed: string;
}

@Component({
  selector: 'app-editeducation',
  templateUrl: './editeducation.component.html',
  styleUrls: ['./editeducation.component.css']
})
export class EditeducationComponent implements OnInit {

  selectedItem: Item | undefined;
  Aadhar: string | undefined;
  // aadharNumber: string | undefined;
  Qualification: string | undefined;

  editexp() {
    // Navigate to the dashboard component
    this.router.navigate(['/editexperience']);
  }

  editpro() {
    this.router.navigate(['/edit'])
  }
  error = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
     // Retrieve the Aadhar number from query parameters
     this.route.queryParams.subscribe((params) => {
      this.Aadhar = params['aadhar'];
      console.log('Aadhar number received:', this.Aadhar);
      // Now you can use the Aadhar number in the editeducation form
    });
  }

  getItemById(): void {
    if (this.Aadhar && this.Qualification) {
        this.http.get<Item>(`http://localhost:8090/api/education/${this.Aadhar}/${this.Qualification}`)
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
    if (this.selectedItem && this.selectedItem.Aadhar && this.selectedItem.Qualification) {
        // Construct the URL with both Aadhar and Qualification
        const url = `http://localhost:8090/api/education/${this.selectedItem.Aadhar}/${this.selectedItem.Qualification}`;

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

navigateToEducation(): void {
  if (this.selectedItem && this.selectedItem.Aadhar) {
    // Navigate to the editeducation form and pass the Aadhar number as a query parameter
    this.router.navigate(['/editexperience'], {
      queryParams: { aadhar: this.selectedItem.Aadhar },
    });
  }
}



  // getItemById(): void {
  //   if (this.Aadhar !== undefined) {
  //     // this.loading = true;
  //     this.http.get<Item>('http://localhost:8090/api/education/' + this.Aadhar + this.Qualification)
  //       .subscribe({
  //         next: (item) => {
  //           console.log(item);
  //           this.selectedItem = Object(item)[0];
  //         },
  //         error: (error) => {
  //           this.error = 'Error fetching item by ID';
  //           console.error('Error fetching item by ID:', error);
  //         }
  //       });
  //   }
  // }
//   updateItem(): void {
//   if (this.selectedItem) {
//     this.http.put<Item>('http://localhost:8090/api/education/' + this.selectedItem.Aadhar, this.selectedItem)
//       .subscribe({
//         next: (updatedItem) => {
//           alert('Successfully updated');
//           console.log('Item updated successfully:', updatedItem);
//         },
//         error: (error) => {
//           alert(error);
//           console.error('Error updating item:', error);
//         }
//       });
//   } else {
//     console.error('No item selected for update');
//   }
// }
}
