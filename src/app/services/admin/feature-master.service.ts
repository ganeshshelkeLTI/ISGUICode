import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeatureMasterService {
  private APIURL:string;

  constructor(private http:HttpClient) {
    this.APIURL = environment.apiUrl;
  }

  public retreiveData() {
    return this.http.get(this.APIURL+'isgDashboard/findAllFeature');
  }
  public saveData(data) {
    return this.http.post(this.APIURL+'isgDashboard/saveAllFeature',data);
  }
  public deleteFeature(featureId) {
    return this.http.post(this.APIURL+'isgDashboard/deleteFeature',featureId);
  }
}
