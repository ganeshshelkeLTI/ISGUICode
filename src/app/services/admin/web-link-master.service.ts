import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebLinkMasterService {

  private APIURL:string;

  constructor(private http:HttpClient) {
    this.APIURL = environment.apiUrl;
  }
  public retreiveData(data) {
    // http://10.101.42.61:8080/isgDashboard/readMasterRecords
    return this.http.post(this.APIURL+'isgDashboard/readMasterRecords',data);
  }
  public saveData(data) {
    return this.http.post(this.APIURL+'isgDashboard/saveOrUpdateMaster',data);
  }
  public deleteLink(deleteData) {
    return this.http.post(this.APIURL+'isgDashboard/deleteMaster',deleteData);
  }
}
