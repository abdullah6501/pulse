// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { AadharService } from '../aadhar.service';

// interface Item {
//   Aadhar: string;
//   Qualification: string;
//   Discipline: string;
//   School_College_Institute: string;
//   Affiliated_Board_University: string;
//   Marks_CGPA: string;
//   Year_Enrollment: string;
//   Year_Passed: string;
// }

// @Component({
//   selector: 'app-education',
//   templateUrl: './education.component.html',
//   styleUrls: ['./education.component.css']
// })
// export class EducationComponent implements OnInit {
//   education: Item = {
//     Aadhar: '',
//     Qualification: '',
//     Discipline: '',
//     School_College_Institute: '',
//     Affiliated_Board_University: '',
//     Marks_CGPA: '',
//     Year_Enrollment: '',
//     Year_Passed: '',
//   };

//   constructor(private router: Router, private http: HttpClient, private aadharService: AadharService) { }

//   ngOnInit(): void {
//     this.aadharService.currentAadhar.subscribe(aadhar => {
//       this.education.Aadhar = aadhar;
//     });
//   }

//   onSubmit() {
//     this.router.navigate(['/experience']);
//     this.http.post<Item>('http://localhost:8090/api/education/add', this.education)
//       .subscribe({
//         next: (item) => {
//           console.log('Item added:', item);
//           this.education = {
//             Aadhar: '',
//             Qualification: '',
//             Discipline: '',
//             School_College_Institute: '',
//             Affiliated_Board_University: '',
//             Marks_CGPA: '',
//             Year_Enrollment: '',
//             Year_Passed: '',
//           };
//         },
//         error: (error) => {
//           console.error('Error adding item:', error);
//         }
//       });
//   }
// }


/////////////////////////////////////////////////



// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { AadharService } from '../aadhar.service';

// interface Item {
//   Aadhar: string;
//   Qualification: string;
//   Discipline: string;
//   School_College_Institute: string;
//   Affiliated_Board_University: string;
//   Marks_CGPA: string;
//   Year_Enrollment: string;
//   Year_Passed: string;
// }

// @Component({
//   selector: 'app-education',
//   templateUrl: './education.component.html',
//   styleUrls: ['./education.component.css']
// })
// export class EducationComponent implements OnInit {
//   education: Item = {
//     Aadhar: '',
//     Qualification: '',
//     Discipline: '',
//     School_College_Institute: '',
//     Affiliated_Board_University: '',
//     Marks_CGPA: '',
//     Year_Enrollment: '',
//     Year_Passed: '',
//   };

//   constructor(private router: Router, private http: HttpClient, private aadharService: AadharService) { }

//   ngOnInit(): void {
//     // Subscribe to the current Aadhar from the service and set the Aadhar in the education object
//     this.aadharService.currentAadhar.subscribe(aadhar => {
//       this.education.Aadhar = aadhar;
//     });
//   }

//   onSubmit() {
//     // Navigate to the next route (e.g., experience page)
//     this.router.navigate(['/experience']);

//     // Make a POST request to the server to save the education data
//     this.http.post<Item>('http://localhost:8090/api/education/add', this.education)
//       .subscribe({
//         next: (item) => {
//           console.log('Item added:', item);

//           // After successful submission, reset only the form fields except Aadhar
//           this.resetEducationFieldsExceptAadhar();
//         },
//         error: (error) => {
//           console.error('Error adding item:', error);
//         }
//       });
//   }

//   // Helper function to reset all education fields except Aadhar
//   resetEducationFieldsExceptAadhar() {
//     // Preserve the Aadhar value
//     const aadharValue = this.education.Aadhar;

//     // Reset all other fields
//     this.education = {
//       Aadhar: aadharValue, // Keep the Aadhar value unchanged
//       Qualification: '',
//       Discipline: '',
//       School_College_Institute: '',
//       Affiliated_Board_University: '',
//       Marks_CGPA: '',
//       Year_Enrollment: '',
//       Year_Passed: '',
//     };
//   }
// }


///////////////////////////////////

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AadharService } from '../aadhar.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


interface EducationItem {
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
    selector: 'app-education',
    templateUrl: './education.component.html',
    styleUrls: ['./education.component.css']
})
export class EducationComponent implements OnInit {
    education: EducationItem = {
        Aadhar: '',
        Qualification: '',
        Discipline: '',
        School_College_Institute: '',
        Affiliated_Board_University: '',
        Marks_CGPA: '',
        Year_Enrollment: '',
        Year_Passed: '',
    };

    // This array will store submitted form data
    educationList: EducationItem[] = [];

    // userForm: FormGroup;
    isFormSubmitted: boolean = false;
    exp() {
        this.router.navigate(['/experience']);
    }

    constructor(private router: Router, private http: HttpClient, private aadharService: AadharService) { }

    ngOnInit(): void {
        // Subscribe to Aadhar value from the service
        this.aadharService.currentAadhar.subscribe(aadhar => {
            this.education.Aadhar = aadhar;
        });
    }

    isFormInvalid: boolean = false;
    onSubmit() {

        // Save the form data to the backend
        this.http.post<EducationItem>('http://localhost:8090/api/education/add', this.education)
            .subscribe({
                next: (item) => {
                    console.log('Item added:', item);

                    // Add the submitted item to the educationList array
                    this.educationList.push(item);

                    // Reset form fields except for Aadhar
                    this.resetFormFieldsExceptAadhar();
                    // this.router.navigate(['/experience']);

                    // Navigate to the next page
                    this.exp();
                },
                error: (error) => {
                    console.error('Error adding item:', error);
                }
            });


        // Redirect to the experience page after submission
        // this.router.navigate(['/experience']);
    }


    resetFormFieldsExceptAadhar() {
        // Reset all form fields except Aadhar
        this.education = {
            Aadhar: this.education.Aadhar, // Keep the current Aadhar value
            Qualification: '',
            Discipline: '',
            School_College_Institute: '',
            Affiliated_Board_University: '',
            Marks_CGPA: '',
            Year_Enrollment: '',
            Year_Passed: '',
        };
    }
    pro() {
        // Navigate to the dashboard component
        this.router.navigate(['/profile']);
    }
}
