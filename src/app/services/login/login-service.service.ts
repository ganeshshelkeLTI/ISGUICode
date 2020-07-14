/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved ***********/
/******************************************************/

/*******************************************************/
/** File Name: login service.ts**/
/** Description: Get user login details based upon the data returned**/
/**                                                                                                                **/
/**                                                                                                                **/
/** Created By: 10641888  Created Date: 09/19/2018    **/
/** Update By: 10641888  Update Date: 28/09/2018      **/
/** Developed at:             **/
/*******************************************************/


import { Injectable, Input } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LoginDataBroadcastService } from '../login/login-data-broadcast.service';
import { CommonURLProperties } from '../../../properties/common-url-properties';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  private APIURL: string;
  loginRequestData: any;
  private DASHBOARD_LOGIN:string;

  constructor(private http: HttpClient,private loginDataBroadcastService:LoginDataBroadcastService) {
    this.APIURL = environment.apiUrl;
    this.DASHBOARD_LOGIN = CommonURLProperties.DASHBOARD_LOGIN;
  }

  getUserLoginInfo(uname, pwd) {
    let userLoginDetails = {
      "username" : uname,
      "password": pwd
    }
    // this.loginDataBroadcastService.getEmitter().emit('setLoginData'); 
    let params: HttpParams = new HttpParams();
    return this.http.post(this.APIURL + this.DASHBOARD_LOGIN, userLoginDetails);
    // return this.http.post('http://10.101.42.61:8080/isgWeb/userLogin', userLoginDetails);
 //return  this.http.get("http://localhost:3000/get");
  }
}
