import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-live-project',
  templateUrl: './live-project.component.html',
  styleUrls: ['./live-project.component.css']
})
export class LiveProjectComponent implements OnInit {
  email;
  surname;
  name;
  othernames;
  phone;
  input;selectedDate;
  message: string;
  showProgress: boolean;

  constructor( 
    private data: DataService,
    private toast: ToastrService,
    private route: Router
  ) { }

  ngOnInit() {
      
  }
    
  onSubmit(){
    this.showProgress = true;
    let pload = {
      key: "01",
      email: this.email
    }
    this.data.postMethod(pload).subscribe(
      res => {
        if ( res['code'] == '00' ) {
          this.input = res['message'];
          this.surname = this.input.surname;
          this.name = this.input.name;
          this.othernames = this.input.othernames;
          this.phone = this.input.phone_no;
        } else {
          if ( res['code'] == '01' ) {
            this.toast.error(res['message']);
          } else {
            this.input = true;
          }
        }
        this.showProgress = false;
      }
    );      
  }

  submit (a) {
    this.showProgress = true;
    let pload = {
      email: this.email,
      surname: this.surname,
      name: this.name,
      othernames: this.othernames,
      phone: this.phone,
      key: '02'
    }
    this.data.postMethod(pload).subscribe(
      res => {
        if ( res['code'] != '00' ) {
          this.toast.error(res['message'])
        } else {
          this.route.navigate(['/appointment/'+res['message']]);
        }
        this.showProgress = false;
      }
    );
  }

}