import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../service/data.service';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';

@Component({
  selector: 'app-view-apointments',
  templateUrl: './view-apointments.component.html',
  styleUrls: ['./view-apointments.component.css']
})
export class ViewApointmentsComponent implements OnInit {

  constructor(
    private route: Router,
    private cookie: CookieService,
    private data: DataService,
    private act: ActivatedRoute,
  ) { 
    data.changeHead('APPOINTMENTS');
  }

  appointments;
  appDate;
  appTime;
  selected: string = '0';
  message: string;

  dataTable: any;

  ngOnInit() {
    this.act.data.subscribe(
      res => {
        let body = res.resolves[0].get;
        if ( body.code != '11' ) {
          this.appointments = body.message;
          this.appDate = body.code[0];
          this.appTime = body.code[1];
        } else {
          this.appointments = null;
          this.appDate = []; 
          this.appTime = [];
        }
        
        setTimeout(() => {
          const table: any = $('table');
          this.dataTable = table.DataTable();
        }, 10);
      }
    )
  }

  onLoad () {
    setTimeout(() => {
      this.data.changeLoader(true);
    }, 10);
    
    let p = {
      key: '12',
      id: this.selected
    }
    this.data.postMethod(p).subscribe(
      res => {
        if ( res['code'] != '11' ) {
          this.appointments = res['message'];
          this.appDate = res['code'][0]; 
          this.appTime = res['code'][1];
        } else {
          this.appointments = 0;
          this.appDate = []; 
          this.appTime = [];
        }

        setTimeout(() => {
          const table: any = $('table');
          this.dataTable = table.DataTable();
          this.data.changeLoader(false);
        }, 10);
      }
    )
  }

  filter (event) {
    this.data.changeLoader(true);
    this.appointments = null;

    setTimeout(() => {
      let p = {
        key: '12',
        id: this.selected
      }
      this.data.postMethod(p).subscribe(
        res => {
          if ( res['code'] != '11' ) {
            this.appointments = res['message'];
            this.appDate = res['code'][0]; 
            this.appTime = res['code'][1];
          } else {
            this.appointments = null;
            this.appDate = []; 
            this.appTime = [];
          }
          
          setTimeout(() => {
            const table: any = $('table');
            this.dataTable = table.DataTable();
            this.data.changeLoader(false);
          }, 10);
        }
      )
    }, 1);
    
  }

}
