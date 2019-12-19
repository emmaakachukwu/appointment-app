import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {

  appointments;
  selectedDate;
  id;
  showProgress: boolean;

  constructor(
    private data: DataService,
    private route: Router,
    private toast: ToastrService,
    private act: ActivatedRoute
  ) 
  {
    act.data.subscribe(
      resp => {
        this.id = resp.resolves[0].get.message;
      }
    );
  }

  ngOnInit() {
    let pload = {
      key: '03'
    }
    this.data.postMethod(pload).subscribe(
      res => {
        this.appointments = res['message'];
      }
    )
  }

  submit(a){
    this.showProgress = true;
    const sel = this.selectedDate;
    let p = {
      id: this.id,
      appointment: a.value.appointment,
      seldate: sel,
      key: '04'
    }
    console.log(a.value.selectedDate)
    this.data.postMethod(p).subscribe(
      res => {
        if ( res['code'] != '00' ) {
          this.toast.error(res['message']);
        } else {
          res['message'] == '0' ? this.route.navigate(['/survey/'+this.id]) : this.route.navigate(['/pay/'+this.id]);
        }
        this.showProgress = false;
      }
    )
  }

}
