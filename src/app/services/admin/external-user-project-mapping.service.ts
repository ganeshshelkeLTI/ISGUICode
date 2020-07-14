import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExternalUserProjectMappingService {

  private APIURL:string;

  constructor(private http:HttpClient) {
    this.APIURL = environment.apiUrl;
  }

  public retreiveProjects() {
    let userType = "All";
    // http://10.101.42.44:8080
    // return this.http.get('http://10.101.42.44:8080/isgDashboard/dropDownDataList?dropDownSource=project&userType='+userType);
    return this.http.get(this.APIURL+'isgDashboard/dropDownDataList?dropDownSource=project&userType='+userType);
  }

  public saveData(data) {
    // return this.http.post('http://10.101.42.44:8080/isgDashboard/saveAllExternalUserProject',data);
    return this.http.post(this.APIURL+'isgDashboard/saveAllExternalUserProject',data);
  }
}
