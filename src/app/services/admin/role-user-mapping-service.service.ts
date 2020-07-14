import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleUserMappingServiceService {

  private APIURL:string;

  constructor(private http:HttpClient) {
    this.APIURL = environment.apiUrl;
  }
  public searchUserById(userId) {
    let userType = "All";
    return this.http.get(this.APIURL+'isgDashboard/dropDownDataList?dropDownSource=staff&dropDownId='+userId+'&userType='+userType);
  }


  public retreiveUserTableData(sessionid, userid, userType) {
    return this.http.get(this.APIURL+'isgDashboard/userProjectsDetails?eMailId='+userid+'&userType='+userType);
  }

  public saveAllUserRole(data):Observable<any>{
    return this.http.post(this.APIURL+'isgDashboard/saveAllUserRole',data);
  }

  public findRolesByUserId(userId, userType):Observable<any>{
    return this.http.get(this.APIURL+'isgDashboard/findRolesByUserId?userId='+userId+'&userType='+userType);
  }

  public deleteUserRole(data):Observable<any>{
    return this.http.post(this.APIURL+'isgDashboard/deleteRoleByUserId',data);
  }
}
