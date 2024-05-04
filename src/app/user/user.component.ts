import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export interface Item {
  id: number;
  First_Name: string;
  Middle_Name: string;
  Last_Name: string;
  DOB: Date;
  Email: string;
  Phone: string;
  Father_Name: string;
  Gender: string;
  Marital_Status: string;
  Hobbies: string;
  Language_Known: string;
  Permanent_Address: string;
  Temporary_Address: string;
  is_deleted: boolean;
  profile_image: string;
  Aadhar: string;
  profile_image_url: string;
}

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {
  selectedItem: Item | undefined;
  Aadhar: string | undefined;

  error = '';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.getItemById();
  }

  getItemById(): void {
    if (this.Aadhar !== undefined) {
      this.http.get<Item>('http://localhost:8088/api/profile/' + this.Aadhar)
        .subscribe({
          next: (item) => {
            console.log(this.error);
            this.selectedItem = item;
            this.decodeImageUrls(); // Call decodeImageUrls after fetching the item
          },
          error: (error) => {
            this.error = 'Error fetching item by ID';
            console.error('Error fetching item by ID:', error);
          }
        });
    }
  }

  decodeImageUrls(): void {
    if (this.selectedItem && this.selectedItem.profile_image) {
      const hexEncodedImageUrl = this.selectedItem.profile_image;
      const decodedUrl = decodeURIComponent(hexEncodedImageUrl.replace(/(..)/g, '%$1'));
      this.selectedItem.profile_image_url = decodedUrl;
    }
  }
}
