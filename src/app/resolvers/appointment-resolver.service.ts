import { Injectable } from '@angular/core';
import { DataService } from '../service/data.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentResolverService {

  constructor(
    private data: DataService,
    private cookie: CookieService
  ) { }

  showProgress: boolean;
  resolve () {
    if ( this.cookie.get('user') ) {
      this.data.currentLoader.subscribe(
        load => this.showProgress = load
      );
      this.data.changeLoader(true);
      let call = new Promise((resolve, reject)=>{
        this.data.postMethod({
          key: "12",
          id: '0'
        }).subscribe((ans) => {
          console.log(ans);
          this.data.changeLoader(false);
          resolve({'get': ans})
        });
      })
      return Promise.all([call]);
    } else {
      this.data.logout();
    }
  }
}
