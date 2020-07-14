import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { INFRAURLProperties } from '../../properties/infra-url-properties';

@Injectable({
  providedIn: 'root'
})
export class GenerateScenarioService {

  private APIURL:string;
  private SAVE_SCENARIO_DATA:string;
  private SCENARIO_DATA:string;

  constructor(private http:HttpClient) {
    this.APIURL = environment.apiUrl;
    this.SAVE_SCENARIO_DATA = INFRAURLProperties.SAVE_SCENARIO_DATA;
    this.SCENARIO_DATA = INFRAURLProperties.SCENARIO_DATA;
  }

  //Get Scenarion data
  getScenarioData(dashboardId:string,loggedinId:string,scenarioId):Observable<any>{
    if(scenarioId==0){
      return this.http.get(this.APIURL+this.SCENARIO_DATA+"?dashboardId="+dashboardId+"&loginUserId="+loggedinId);
    }else{
      return this.http.get(this.APIURL+this.SCENARIO_DATA+"?dashboardId="+dashboardId+"&loginUserId="+loggedinId+"&scenarioId="+scenarioId);
    }
  }

  //Saved new scenarion
  savedNewScenario(scenarioObj: object):Observable<any>{
    // http://10.101.42.44:8080/isgDashboard/saveScenario
    return this.http.post(this.APIURL+this.SAVE_SCENARIO_DATA, scenarioObj);
    // return this.http.post('http://10.101.42.44:8080/isgDashboard/saveScenario', scenarioObj);
  }

  //Get Saved Scenario data
  getSavedScenarioDataToPopulate(dashboardId:string,loggedinId:string,scenarioId:string):Observable<any>{
    const params = new HttpParams().set('dashboardId',dashboardId).set('loginUserId', loggedinId).set('scenarioId',scenarioId);
    return this.http.get(this.APIURL+this.SCENARIO_DATA+"?dashboardId="+dashboardId+"&loginUserId="+loggedinId+"&scenarioId="+scenarioId);
  }

}
