import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleDashboardService {
  private APIURL:string;

  constructor(private http:HttpClient) { 
    this.APIURL = environment.apiUrl;
  }

  public getMappedFeaturesOfRole(data){
    return this.http.post(this.APIURL+'isgDashboard/findAllRoleDashBoardFeature', data);
  }

  public saveAllFeatures(data){
    return this.http.post(this.APIURL+'isgDashboard/saveAllRoleFeature',data);
    //return this.http.post('http://10.101.42.44:8080/isgDashboard/saveAllRoleFeature',data);
  }

  public findAllTowerFeatureByDashBoardId(data){
    return this.http.post(this.APIURL+'isgDashboard/findAllTowerFeatureByDashBoardId',data);
  }

   public saveAdminConfiguration(data){
    return this.http.post(this.APIURL+'isgDashboard/saveAllRoleLink',data);
    //return this.http.post('http://10.101.42.44:8080/isgDashboard/saveAllRoleFeature',data);
  }

  public retrieveAdminMapping(roleId)
  {
   
     return this.http.get(this.APIURL+'isgDashboard/findAllRoleLink?roleId='+roleId);
    //return this.http.get('http://10.101.42.44:8080/isgDashboard/findAllRoleLink?roleId='+roleId);
  }

}
