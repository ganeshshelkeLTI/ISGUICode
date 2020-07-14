import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardMasterService {
  private APIURL:string;
  private testData: any = {};
  constructor(private http:HttpClient) {
    this.APIURL = environment.apiUrl;
  }
  public retreiveData(){
    return this.http.get(this.APIURL+'isgDashboard/findAllTower');
  }
  public sendMasterData(data){
    return this.http.post(this.APIURL+'isgDashboard/saveAllTower',data);
    // return this.http.post('http://10.101.42.44:8080/isgDashboard/saveAllTower',data)
  }

  public deleteTower(data){
    return this.http.post(this.APIURL+'isgDashboard/deleteTower',data)
  }

  //get admin data
  public getAdminData(data)
  {
    return this.http.post(this.APIURL+'isgDashboard/readMasterRecords', data);
  }
}
