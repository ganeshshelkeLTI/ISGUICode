import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ViewAllUserService {

  private APIURL:string;
  private testData: any = {};
  // private UserId:string;

  constructor(private http:HttpClient) {
    this.APIURL = environment.apiUrl;
  }

  public searchUserById(userId) {
    let userType = "External";
    ///isgDashboard/dropDownDataList?dropDownSource=staff&dropDownId=al
    return this.http.get(this.APIURL+'isgDashboard/dropDownDataList?dropDownSource=staff&dropDownId='+userId+'&userType='+userType);
  }

  public retreiveUserTableData(sessionid, userid) {
    let userType = "External";
    // http://10.101.42.61:8080/
    // return this.http.get('http://10.101.42.61:8080/isgDashboard/userProjectsDetails?eMailId='+userid+'&userType='+userType);
    return this.http.get(this.APIURL+'isgDashboard/userProjectsDetails?eMailId='+userid+'&userType='+userType);
  }

  public retreiveExternalUsers() {
    return this.http.get(this.APIURL+'isgDashboard/findAllRole');
  }

  public retreiveUserId(){
    return this.http.get(this.APIURL+'isgDashboard/findAllExternalUser');
  }

  public getUserData(data){
    return this.http.post(this.APIURL+'isgDashboard/findAllViewUserByUserId', data);
  }

  public deleteData(data) {
    return this.http.post(this.APIURL+'isgDashboard/deleteExternalUserProject', data);
  }

}
