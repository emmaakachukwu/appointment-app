import { Injectable } from '@angular/core';
import { DataService } from '../service/data.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ResolveIdService {

  constructor(
    private data: DataService,
    private route: Router
  ) { }

  resolve(snapshot: ActivatedRouteSnapshot) {
    let call = new Promise((resolve, reject)=>{
      this.data.postMethod({
        key: '05',
        id: snapshot.params.id
      }).subscribe((ans) => {
        console.log(ans);
        if ( ans['code'] != '00' ) {
          this.route.navigate([''])
        } else {
          resolve({'get': ans})
        }
      });
    })
    return Promise.all([call]);
  }
}
