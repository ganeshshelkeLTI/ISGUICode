import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

import { CommonURLProperties } from '../../../properties/common-url-properties';
import { ScenarioMaintainanceURLProperties } from '../../../properties/scenario-maintenance-url-properties';

@Injectable({
  providedIn: 'root'
})
export class InactiveScenarioMaintenanceService {

  private APIURL: string;
  private INACTIVE_SCENARIO_LIST: string;
  private DIGITAL_INACTIVE_SCENARIO_LIST: string;
  private RESTORE_DELETE_SCENARIO: string;
  private RESTORE_DELETE_SURVEY: string;
 
  public userType: any;

  constructor(private http: HttpClient) {
    this.APIURL = environment.apiUrl;
    
    this.INACTIVE_SCENARIO_LIST = ScenarioMaintainanceURLProperties.INACTIVE_SCENARIO_LIST;
    this.DIGITAL_INACTIVE_SCENARIO_LIST = ScenarioMaintainanceURLProperties.DIGITAL_INACTIVE_SCENARIO_LIST;
    this.RESTORE_DELETE_SCENARIO = ScenarioMaintainanceURLProperties.RESTORE_DELETE_SCENARIO;
    this.RESTORE_DELETE_SURVEY = ScenarioMaintainanceURLProperties.RESTORE_DELETE_SURVEY;
    
  }

  //get inactive scenario list
  public getInactiveScenarioList(dashboardId, userId)
  {
    return this.http.get(this.APIURL + this.INACTIVE_SCENARIO_LIST + dashboardId+'&userId='+userId);
  }

  public getDigitalInactiveScenarioList(dashboardId, userId)
  {
    return this.http.get(this.APIURL + this.DIGITAL_INACTIVE_SCENARIO_LIST + dashboardId+'&userId='+userId);
  }

  public restoreDeleteScenario(data):Observable<any>{
    return this.http.post(this.APIURL+this.RESTORE_DELETE_SCENARIO,data);
  }

  public restoreDeleteDigitalScenario(data):Observable<any>{
    return this.http.post(this.APIURL+this.RESTORE_DELETE_SURVEY,data);
  }

}





