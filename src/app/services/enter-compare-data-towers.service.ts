import { Injectable, Input } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { checkAndUpdateDirectiveDynamic } from '@angular/core/src/view/provider';
import { environment } from '../../environments/environment';
import { INFRAURLProperties } from '../../properties/infra-url-properties';

@Injectable({
  providedIn: 'root'
})
export class EnterCompareDataTowersService {

  private pageId = 2;
  private loginUserId = "E5E8339B-0620-4377-82FE-0008029EDC53"; // we need to change this
  private visibility: boolean = false;
  private APIURL:string;
  private INPUT_MY_DATA_TEMPLATE:string;
  private REGION_INPUT_LIST_DATA:string;
  private COMPARE_GRID_DATA:string;
  private SCENARIO_LIST_DATA:string;
  private SCENARIO_INPUT_DATA:string;
  private CRG_COMPARE_GRID_DATA:String;
  private SCENARIO_DELETION: string;
  private DIGITAL_SURVEY_DELETION: string;

  constructor(private http:HttpClient) {
    this.APIURL = environment.apiUrl;
    this.INPUT_MY_DATA_TEMPLATE = INFRAURLProperties.INPUT_MY_DATA_TEMPLATE;
    this.REGION_INPUT_LIST_DATA = INFRAURLProperties.REGION_INPUT_LIST_DATA;
    this.COMPARE_GRID_DATA = INFRAURLProperties.COMPARE_GRID_DATA;
    this.SCENARIO_LIST_DATA = INFRAURLProperties.SCENARIO_LIST_DATA;
    this.SCENARIO_INPUT_DATA = INFRAURLProperties.SCENARIO_INPUT_DATA;
    this.CRG_COMPARE_GRID_DATA = INFRAURLProperties.CRG_COMPARE_GRID_DATA;
    this.SCENARIO_DELETION = INFRAURLProperties.SCENARIO_DELETION;
    this.DIGITAL_SURVEY_DELETION = INFRAURLProperties.DIGITAL_SURVEY_DELETION;
  }

  // pop-up id is input my data and comapre
  setPopID(pageId)
  {
    this.pageId = pageId;
    // alert(this.pageId);
  }

  getPopupId()
  {
    return this.pageId;
  }

  getInputData():Observable<any> {
    return this.http.get(this.APIURL+this.INPUT_MY_DATA_TEMPLATE+"?dashboardId="+this.pageId+"&loginUserId='"+this.loginUserId+"'");
  //  return this.http.get("http://10.101.42.44:8080/"+this.INPUT_MY_DATA_TEMPLATE+"?dashboardId="+this.pageId+"&loginUserId='"+this.loginUserId+"'");
  }

  getAllRegion(){
    return this.http.get(this.APIURL+this.REGION_INPUT_LIST_DATA)
  }


  isPopupVisible(visibility) {
    this.visibility = visibility;
  }

  //methods for comapre page

  //get comapre data
  getCompareData(selectedValue:any):Observable<any>{
      return this.http.post(this.APIURL+this.COMPARE_GRID_DATA,selectedValue);
  }

  //will populate scario list
  getScanrioData():Observable<any>{
    return this.http.get(this.APIURL+this.SCENARIO_LIST_DATA+'?userId='+this.loginUserId+'&dashboardId='+this.pageId);
  }


  //this will send scanrio data to server
  sendScanrioData(requestParams):Observable<any>{
    return this.http.post(this.APIURL+this.SCENARIO_INPUT_DATA,requestParams);
  }

  getSavedScenarioData(savedScenarioObj:object):Observable<any>{
    return this.http.post(this.APIURL+this.SCENARIO_INPUT_DATA,savedScenarioObj);
  }

//get custom reference data
getCRGCompareData(selectedValue:any):Observable<any>{
  return this.http.post(this.APIURL+this.CRG_COMPARE_GRID_DATA,selectedValue);
}

//delete selected scenarios
deleteScenario(requestObj):Observable<any>{
  if(requestObj.dashboardID == 14){
    return  this.http.post(this.APIURL+this.DIGITAL_SURVEY_DELETION,requestObj);
  }else{
    return this.http.post(this.APIURL+this.SCENARIO_DELETION,requestObj);
  }
  
}


}
