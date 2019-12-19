import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient,
    private cookie: CookieService,
    private route: Router
  ) { }

  //for sending payloads to the backend
  postMethod ( payLoad ) {
    return this.http.post ("http://localhost/appointment/appointmentapi.php", JSON.stringify(payLoad));
  }

  // postMethod ( payLoad ) {
  //   return this.http.post ("http://learnpower.com.ng/app2/appointment/appointmentapi.php", JSON.stringify(payLoad));
  // }

  //displaying progress bar
  private loaderStatus = new BehaviorSubject<boolean>(false);
  currentLoader = this.loaderStatus.asObservable();

  private headSource = new BehaviorSubject<string>('Dashboard');
  currentHead = this.headSource.asObservable();

  changeLoader(progressBar: boolean){
    this.loaderStatus.next(progressBar);
  }
  
  changeHead(head: string) {
    this.headSource.next(head);
  }

  logout () {
    this.cookie.deleteAll('/');
    localStorage.clear();
    this.route.navigate(['/admin-login']);
  }
}
