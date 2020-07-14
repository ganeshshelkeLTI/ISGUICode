import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CIOURLProperties } from '../../properties/cio-url-properties';

@Injectable({
  providedIn: 'root'
})
export class CompareGridService {

  private APIURL:string;
  private CIO_COMPARE_GRID_DATA:string;
  private CIO_SCENARIO_LIST_DATA:string;
  private CIO_SCENARIO_INPUT_DATA:string;
  private CIO_CRG_COMPARE_GRID_DATA :string;

  constructor(private http:HttpClient) { 
    this.APIURL = environment.apiUrl;
    this.CIO_COMPARE_GRID_DATA = CIOURLProperties.CIO_COMPARE_GRID_DATA;
    this.CIO_SCENARIO_LIST_DATA = CIOURLProperties.CIO_SCENARIO_LIST_DATA;
    this.CIO_SCENARIO_INPUT_DATA = CIOURLProperties.CIO_SCENARIO_INPUT_DATA;
    this.CIO_CRG_COMPARE_GRID_DATA = CIOURLProperties.CIO_CRG_COMPARE_GRID_DATA;
  }

  //Compare selected Industry/Region data
  getCompareData(selectedValue:any):Observable<any>{
   return this.http.post(this.APIURL+this.CIO_COMPARE_GRID_DATA,selectedValue);
  }

   //will populate scario list
   getScanrioData():Observable<any>{
    return this.http.get(this.APIURL+this.CIO_SCENARIO_LIST_DATA+"?dashboardId=1");
   }


   //this will send scanrio data to server
   sendScanrioData(requestParams):Observable<any>{
    return this.http.post(this.APIURL+this.CIO_SCENARIO_INPUT_DATA,requestParams);
  }

  getSavedScenarioData(savedScenarioObj:object):Observable<any>{
    return this.http.post(this.APIURL+this.CIO_SCENARIO_INPUT_DATA,savedScenarioObj);
  }

   //Compare CRG data
  getCRGCompareData(selectedValue:any):Observable<any>{
    return this.http.post(this.APIURL+this.CIO_CRG_COMPARE_GRID_DATA,selectedValue);
  }
}
