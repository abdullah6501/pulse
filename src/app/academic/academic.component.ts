// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-academic',
//   templateUrl: './academic.component.html',
//   styleUrls: ['./academic.component.css']
// })
// export class AcademicComponent {

// }

// import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-academic',
//   templateUrl: './academic.component.html',
//   styleUrls: ['./academic.component.css']
// })
// export class AcademicComponent {
//   education: any = {};

//   constructor(private http: HttpClient) { }

//   submitForm() {
//     this.http.post<any>('http://localhost:3000/insert-education', this.education)
//       .subscribe(response => {
//         console.log(response);
//       });
//   }

// }

// import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-academic',
//   templateUrl: './academic.component.html',
//   styleUrls: ['./academic.component.css']
// })
// export class AcademicComponent {
//   education: any = {};
//   educationList: any[] = []; // Array to store submitted education data

//   constructor(private http: HttpClient) { }

//   onsubmit() {
//     this.http.post<any>('http://localhost:3000/insert-education', this.education)
//       .subscribe(response => {
//         console.log(response);
//         // Push submitted education data to the array
//         this.educationList.push(this.education);
//         // Clear the form fields after submission
//         this.clearForm();
//       });
//   }

//   clearForm() {
//     // Reset education object to clear form fields
//     this.education = {};
//   }
// }
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
// import { blob } from 'stream/consumers';

interface Item {
  id: string;
  Qualification: string;
  Discipline: string;
  School_College_Institute: string;
  Affiliated_Board_University: string;
  Marks_CGPA: string; 
  Year_Enrollment: string;
  Year_Passed: string;
  // profile_image:Blob;
}

@Component({
  selector: 'app-academic',
  templateUrl: './academic.component.html',
  styleUrls: ['./academic.component.css']
})
export class AcademicComponent implements OnInit {
  newItem: Item = {
    id: '',
    Qualification: '',
    Discipline: '',
    School_College_Institute: '',
    Affiliated_Board_University: '',
    Marks_CGPA: '',
    Year_Enrollment: '',
    Year_Passed: '',
    // profile_image: new Blob()
  }

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void { }

  onsubmit(): void {
    this.router.navigate(['/admin']);
    this.http.post<Item>('http://localhost:8088/api/education/add', this.newItem)
      .subscribe({
        next: (item) => {
          console.log('Item added:', item);
          this.newItem = {
            id: '',
            Qualification: '',
            Discipline: '',
            School_College_Institute: '',
            Affiliated_Board_University: '',
            Marks_CGPA: '',
            Year_Enrollment: '',
            Year_Passed: '',
            //  profile_image: new Blob()
          }; 
        },
        error: (error) => {
          console.error('Error adding item:', error);
        }
      });
    // this.router.navigate(['/admin'])
  }

  // onSubmit() {
  //   this.router.navigate(['/admin']);
  // }
}