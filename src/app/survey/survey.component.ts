import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {
  id;
  showProgress: boolean;

  constructor(
    private data: DataService,
    private route: Router,
    private toast: ToastrService,
    private act: ActivatedRoute
  ) {
    act.data.subscribe(
      resp => {
        this.id = resp.resolves[0].get.message;
      }
    );
  }

  showdiv: number = 1;
  bio = {
    fullname: '',
    email: '',
    phone: '',
    status: null
  }

  payload = {
    fullname: '',
    email: '',
    phone: '',
    instagram: '',
    address: '',
    age_range: '',
    fav_color: '',
    fav_designer: '',
    fav_icon: '',
    fash_trend: '',
    fav_style: '',
    neverwear: '',
    wardrobe_woman: '',
    fitted_or_free: '',
    garment_length: '',
    notify_me: '',
    key: '08'
  }

  ngOnInit() {
    let pload = {
      key: "09",
      id: this.id
    }
    this.data.postMethod(pload).subscribe(
      res => {
        console.log(res['message'])
        if ( res['code'] == '00' ) {
          this.bio.fullname = res['message'].surname + ' ' + res['message'].name + ' ' + res['message'].othernames;
          this.bio.email = res['message'].email;
          this.bio.phone = res['message'].phone_no;
          this.bio.status = res['message'].survey_status;
        }
      }
    );  
  }

  skip () {
    this.route.navigate(['/pay/'+this.id]);
  }

  submit(a, x){
    if ( x == 'bio') {
      this.showdiv = 2;

      this.payload.fullname = a.value.fullname,
      this.payload.email = a.value.email,
      this.payload.phone = a.value.phone
    } else if ( x == 'demo' ) {
      this.showdiv = 3;

      this.payload.instagram = a.value.instagram;
      this.payload.address = a.value.address;
      this.payload.age_range = a.value.age_range;
    } else {
      this.showProgress = true;

      this.payload.fav_color = a.value.fav_color;
      this.payload.fav_designer = a.value.fav_designer;
      this.payload.fav_icon = a.value.fav_icon;
      this.payload.fash_trend = a.value.fash_trend;
      this.payload.fav_style = a.value.fav_style;
      this.payload.neverwear = a.value.neverwear;
      this.payload.wardrobe_woman = a.value.wardrobe_woman;
      this.payload.fitted_or_free = a.value.fitted_or_free;
      this.payload.garment_length = a.value.garment_length;
      this.payload.notify_me = a.value.notify_me;

      this.data.postMethod(this.payload).subscribe(
        res => {
          if ( res['code'] == '00' ) {
            this.showProgress = false;
            this.route.navigate(['/pay/'+this.id]);
          } else {
            this.toast.error(res['message']);
          }
          this.showProgress = false;
        }
      )
    }
  }

}
