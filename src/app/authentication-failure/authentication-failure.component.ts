import { Component, OnInit } from '@angular/core';
import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';
import { environment } from '../../environments/environment'
import {
  Router
} from '@angular/router';

import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'app-authentication-failure',
  templateUrl: './authentication-failure.component.html',
  styleUrls: ['./authentication-failure.component.css']
})
export class AuthenticationFailureComponent implements OnInit {
  userdata:any;
  errorMessage:any;
  APIURL: String;
  loggedInUserInfo:any;

  constructor(private loginDataBroadcastService: LoginDataBroadcastService, private router:Router, public oktaAuth: OktaAuthService) {
    this.APIURL = environment.apiUrl;
   }

  ngOnInit() {

    
      let _self = this;
      
      _self.errorMessage = "You do not have the necessary privileges to access the system. Please contact ISG support @ ISGInform@isg-one.com";
      //_self.loginDataBroadcastService.get('errorMessage');


      if (localStorage.getItem('userloginInfo') != undefined || localStorage.getItem('userloginInfo') != null) {
        this.router.navigate(['/CIODashboard']);
      }
      else
      {
        this.router.navigate(['/app-authentication-failure']);
      }

  }

  redirectToLogin(){
//redirect to external login page

          localStorage.removeItem('userloginInfo');
            //window.location.href = "https://dev-772272.okta.com/oauth2/default";
          this.oktaAuth.logout('/');

          //dev
          // if(this.APIURL=='https://isgintellisourcedev.isg-one.com:8443/')
          // {
          //   //window.location.href='https://isgb2c.b2clogin.com/isgb2c.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_ISG_Momentum_SU_SI&client_id=c5501d47-10fc-48b8-b6c1-384e5ec3e995&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fisginformxdev.isg-one.com%2Fdev&scope=openid&response_type=id_token&prompt=login';
          //   //local
          //   this.oktaAuth.loginRedirect('/profile');
          //   //this.oktaAuth.logout('/');
            
          // }
          // //QA
          // else if(this.APIURL=='https://isgintellisourceqaws.isg-one.com:8443/')
          // {
          //   window.location.href='https://isgb2c.b2clogin.com/isgb2c.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_ISG_GENERIC_SUSI&client_id=c663867c-064b-455e-9d58-364fa911dc28&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fisginformxtest.isg-one.com&scope=openid&response_type=id_token&prompt=login';
          // }
          // //prod
          // else if(this.APIURL=='https://isgintellisource.isg-one.com:8443/')
          // {
          //   window.location.href='https://isgb2c.b2clogin.com/isgb2c.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_ISG_GENERIC_SUSI&client_id=848bd326-7030-4952-b9c1-d567b550ba6b&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fisginformx.isg-one.com&scope=openid&response_type=id_token&prompt=login';
          // }
          // else
          // {
          //   //window.location.href='https://isgb2c.b2clogin.com/isgb2c.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_ISG_Momentum_SU_SI&client_id=c5501d47-10fc-48b8-b6c1-384e5ec3e995&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fisginformxdev.isg-one.com%2Fdev&scope=openid&response_type=id_token&prompt=login';
          //   //this.privileges.resetALL();
          //   localStorage.removeItem('userloginInfo');
          //   //window.location.href = "https://dev-772272.okta.com/oauth2/default";
          //   this.oktaAuth.logout('/');
          //   //this.oktaAuth.loginRedirect('/profile');
          // }
  }

} 
