import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../service/data.service';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';

@Component({
  selector: 'app-view-survey',
  templateUrl: './view-survey.component.html',
  styleUrls: ['./view-survey.component.css']
})
export class ViewSurveyComponent implements OnInit {

  dataTable: any;
  surveys;

  constructor(
    private route: Router,
    private cookie: CookieService,
    private data: DataService,
    private act: ActivatedRoute
  ) { 
    data.changeHead('SURVEY');
  }

  ngOnInit() {
    this.act.data.subscribe(
      res => {
        let body = res.resolves[0].get;
        this.surveys = body.message;
        
        setTimeout(() => {
          const table: any = $('table');
          this.dataTable = table.DataTable();
        }, 10);
      }
    )
  }

}
