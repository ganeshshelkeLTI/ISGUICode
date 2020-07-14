import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleMasterService {

  private APIURL:string;

  constructor(private http:HttpClient) {
    this.APIURL = environment.apiUrl;
  }
  public retreiveData() {
    // 10.101.42.44
    return this.http.get(this.APIURL+'isgDashboard/findAllRole');
  }
  public saveData(data):Observable<any>{
    return this.http.post(this.APIURL+'isgDashboard/saveAllRole',data);
  }
  public deleteRole(roleId) {
    return this.http.post(this.APIURL+'isgDashboard/deleteRole',roleId);
  }

  public saveAllUserRole(data):Observable<any>{
    // return this.http.post('http://10.101.42.44:8080/isgDashboard/saveAllUserRole',data);
    return this.http.post(this.APIURL+'isgDashboard/saveAllUserRole',data);
  }

  public retreiveUserTableData() {
    return this.http.get(this.APIURL+'isgDashboard/userProjectsDetails');
  }

}
