import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  amount: number = 1000;
  payId;
  id;
  paid;
  info;
  infodate;
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
        this.payId = resp.resolves[0].get.message + 't' + Date.now();
      }
    );
  }

  ngOnInit() {
    this.onLoad();
  }

  onLoad () {
    this.showProgress = true
    let p = {
      id: this.id,
      key: '06'
    }
    this.data.postMethod(p).subscribe(
      res => {
        this.info = res['message'];
        this.infodate = res['code'];
        console.log(this.info)
        this.showProgress = false
        res['message'].paid == '0' ? this.paid = 0 : this.paid = 1;
      }
    )
  }

  paymentDone(event) {
    this.paid = 2;
    this.showProgress = true
    if ( event.status == 'success' ) { //if payment was successfull
      let pid = event.reference.slice(0, event.reference.indexOf('t'));
      let p = {
        id: pid,
        key: '07'
      }
      this.data.postMethod(p).subscribe(
        res => {
          if ( res['code'] == '00' ) {
            this.toast.success(res['message']);

            this.onLoad();
          } else {
            this.toast.error(res['message']);
            this.showProgress = false;
            this.paid = 0;
          }
        }
      )
    } else {
      this.toast.error('Payment not successful');
      this.showProgress = false;
      this.paid = 0;
    }
  }

}