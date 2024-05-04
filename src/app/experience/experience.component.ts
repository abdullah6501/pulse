// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { AadharService } from '../aadhar.service';

// interface Item {
//   Aadhar: string;
//   CompanyName: string;
//   DesignationDepartmentEmployeeNo: string;
//   AddressTelephone: string;
//   ReportingManagerDetails: string;
//   EmploymentDates: string;
//   AnnualCTC: string
// }

// @Component({
//   selector: 'app-experience',
//   templateUrl: './experience.component.html',
//   styleUrls: ['./experience.component.css']
// })
// export class ExperienceComponent implements OnInit {
//   newItem: Item = {
//     Aadhar: '',
//     CompanyName: '',
//     DesignationDepartmentEmployeeNo: '',
//     AddressTelephone: '',
//     ReportingManagerDetails: '',
//     EmploymentDates: '',
//     AnnualCTC: ''
//   }

//   constructor(private router: Router, private http: HttpClient, private aadharService: AadharService) { }

//   ngOnInit(): void {
//     this.aadharService.currentAadhar.subscribe(aadhar => {
//       this.newItem.Aadhar = aadhar;
//     });
//   }

//   onsubmit(): void {
//     // this.router.navigate(['/education']);
//     this.http.post<Item>('http://localhost:8090/api/experience/add', this.newItem)
//       .subscribe({
//         next: (item) => {
//           console.log('Item added:', item);
//           alert('Employement Details added successfully');
//           this.newItem = {
//             Aadhar: '',
//             CompanyName: '',
//             DesignationDepartmentEmployeeNo: '',
//             AddressTelephone: '',
//             ReportingManagerDetails: '',
//             EmploymentDates: '',
//             AnnualCTC: ''
//           };
//         },
//         error: (error) => {
//           console.error('Error adding item:', error);
//         }
//       });
//   }
// }



import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AadharService } from '../aadhar.service';

interface ExperienceItem {
    Aadhar: string;
    CompanyName: string;
    DesignationDepartmentEmployeeNo: string;
    AddressTelephone: string;
    ReportingManagerDetails: string;
    EmploymentDates: string;
    AnnualCTC: string;
    // Year_Enrollment: string;
    // Year_Passed: string;
}

@Component({
    selector: 'app-experience',
    templateUrl: './experience.component.html',
    styleUrls: ['./experience.component.css']
})
export class ExperienceComponent implements OnInit {
    experience: ExperienceItem = {
        Aadhar:'',
        CompanyName: '',
        DesignationDepartmentEmployeeNo: '',
        AddressTelephone: '',
        ReportingManagerDetails: '',
        EmploymentDates: '',
        AnnualCTC: '',
        // Year_Enrollment: '',
        // Year_Passed: '',
    };

    // This array will store submitted form data
    experienceList: ExperienceItem[] = [];

    // exp() {
    //   this.router.navigate(['/experience']);
    // }

    constructor(private router: Router, private http: HttpClient, private aadharService: AadharService) {}

    ngOnInit(): void {
        // Subscribe to Aadhar value from the service
        this.aadharService.currentAadhar.subscribe(aadhar => {
            this.experience.Aadhar = aadhar;
        });
    }

    onSubmit() {
        // Save the form data to the backend
        this.http.post<ExperienceItem>('http://localhost:8090/api/experience/add', this.experience)
            .subscribe({
                next: (item) => {
                    console.log('Item added:', item);

                    // Add the submitted item to the educationList array
                    this.experienceList.push(item);

                    // Reset form fields except for Aadhar
                    this.resetFormFieldsExceptAadhar();
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
        this.experience = {
            Aadhar: this.experience.Aadhar, // Keep the current Aadhar value
            CompanyName: '',
            DesignationDepartmentEmployeeNo: '',
            AddressTelephone: '',
            ReportingManagerDetails: '',
            EmploymentDates: '',
            AnnualCTC: '',
            // Year_Passed: '',
        };
    }

    success(){
      alert('Successfully Submitted');
    }
  edu() {
    // Navigate to the dashboard component
    this.router.navigate(['/education']);
  }
}
