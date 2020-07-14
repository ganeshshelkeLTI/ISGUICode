import {
  Injectable
} from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import {
  ActivatedRoute
} from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('userloginInfo')) {
      // logged in so return true
      let role = JSON.parse(localStorage.getItem('userloginInfo')).userDetails.role;



      let accessMap = JSON.parse(localStorage.getItem('userloginInfo')).accessMap;
      let landingPageURL = JSON.parse(localStorage.getItem('userloginInfo')).landPageURL;
      let canAccessKPI = JSON.parse(localStorage.getItem('userloginInfo')).canAceessKPI;
      let screenAccessMap=JSON.parse(localStorage.getItem('userloginInfo')).screensMap;
      let isInternal=JSON.parse(localStorage.getItem('userloginInfo')).userDetails.isInternal;
      if (screenAccessMap[state.url] != undefined && screenAccessMap[state.url] == false) {
        this.router.navigate([landingPageURL]);
        return false;
      }

      if (accessMap[state.url] != undefined && accessMap[state.url] == false) {
        this.router.navigate([landingPageURL]);
        return false;
      }


      if (!canAccessKPI && state.url == '/kpiMaintainace'&&isInternal=="yes") {
        this.router.navigate([landingPageURL]);
        return false;
      }


      return true;
    }

    // not logged in so redirect to login page with the return url
    // this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    this.router.navigate(['/login']);
    return false;
  }



}
