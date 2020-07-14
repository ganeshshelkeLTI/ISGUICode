import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardFeatureMappingService {
  private APIURL:string;
  private testData: any = {};

  constructor(private http:HttpClient) {
    this.APIURL = environment.apiUrl;
  }

  public retreiveData(){
    return this.http.get(this.APIURL+'isgDashboard/findAllTowerFeature');
  }

  public saveTowerData(data){
    return this.http.post(this.APIURL+'isgDashboard/saveAllTowerFeature',data);
  }

  public getDashBoards(){
    return this.http.get(this.APIURL+'isgDashboard/findAllTower');
  }

  public retreiveFeatureData() {
    return this.http.get(this.APIURL+'isgDashboard/findAllFeature');
  }

  public deleteData(data) {
    return this.http.post(this.APIURL+'isgDashboard/deleteTowerFeature',data);
  }


}
