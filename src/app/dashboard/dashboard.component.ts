import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  year = new Date().getFullYear();
  showProgress;
  head;

  constructor(
    private route: Router,
    private cookie: CookieService,
    private data: DataService,
  ) { 
    route.url == '/admin' ? route.navigate(['/admin/home']) : '';
    
    data.currentLoader.subscribe(
      load => this.showProgress = load
    );

    data.currentHead.subscribe(
      head => this.head = head
    );
  }

  ngOnInit() {
  }

  //logout
  onLogout () {
    //clear cookie and localStorage
    this.data.logout();
  }

}
