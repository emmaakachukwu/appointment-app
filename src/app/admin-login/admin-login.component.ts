import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  constructor(
    private data: DataService,
    private toast: ToastrService,
    private cookie: CookieService,
    private route: Router
  ) { }

  ngOnInit() {
  }

  showProgress;

  login (a) {
    this.showProgress = true;
    let p = {
      key: '10',
      username: a.value.user,
      password: a.value.password
    }
    this.data.postMethod(p).subscribe(
      res => {
        if ( res['code'] == '00' ) {
          this.showProgress = false
          this.toast.success(res['message']);
          !this.cookie.get('user') ? this.cookie.set('user', res['cookie']) : '';
          this.route.navigate(['/admin/users']);
        } else {
          this.showProgress = false
          this.toast.error(res['message']);
        }
      }
    )
  }

}
