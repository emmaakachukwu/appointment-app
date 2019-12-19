import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../service/data.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { UserModalComponent } from '../user-modal/user-modal.component';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  customers;
  selected: string = '0';
  dataTable: any;
  viewMessage: string;

  constructor(
    private route: Router,
    private cookie: CookieService,
    private data: DataService,
    private toast: ToastrService,
    public dialog: MatDialog,
    private act: ActivatedRoute,
  ) { 
    data.changeHead('USERS');
  }

  ngOnInit() {
    this.onLoad();
  }

  onLoad () {
    this.act.data.subscribe(
      res => {
        let body = res.resolves[0].get;
        this.customers = body.message;
        
        setTimeout(() => {
          const table: any = $('table');
          this.dataTable = table.DataTable();
        }, 10);
      }
    )
  }

  //to view user's appointmeent history
  view (email, name, i) {
    let x = document.getElementById(i);
    x.style.display = 'none';
    this.viewMessage = i;
    let p = {
      email: email,
      key: '14'
    }
    this.data.postMethod(p).subscribe(
      res => {
        if ( res['code'] != '11' ) {
          this.viewMessage = null;
          x.style.display = 'inline';
          this.dialog.open(UserModalComponent, {
            width: '99%',
            disableClose: true,
            data: {
              name: name,
              appHist: res['message'],
              appDate: res['code'][0],
              appTime: res['code'][1]
            }
          });
        } else {
          this.toast.error(res['message']);
          this.viewMessage = null;
          x.style.display = 'inline';
        }
      }
    )
  }

  filter (event) {
    this.customers = null;
    if ( event == '0' ) {
      setTimeout(() => {
        this.onLoad();
      }, 1);
    } else {
      this.data.changeLoader(true);

      let p = {
        key: '11',
        type: '2'
      }
      this.data.postMethod(p).subscribe(
        res => {
          setTimeout(() => {
            if ( res['code'] == '00' ) {
              this.customers = res['message'];
            } else {
              this.customers = null;
            }
          }, 1);
          
          setTimeout(() => {
            const table: any = $('table');
            this.dataTable = table.DataTable();
            this.data.changeLoader(false);
          }, 1);
        }
      )
    }
    
  }

}
