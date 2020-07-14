import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CommonURLProperties } from '../../properties/common-url-properties';


@Injectable({
  providedIn: 'root'
})
//service dedicated to KPIMaintenace 
export class KpiMaintenanceService {

  private APIURL:string;
  private DASHBOARD_SPECIFIC_CATEGORY_LIST:string;
  private CATEGORY_SPECIFIC_SUB_CATEGORY_LIST:string;
  private DASHBOARD_SPECIFIC_KPI_GROUP_LIST:string;
  private DASHBOARD_LIST:string;
  private SELECTED_DASHBOARD_QUESTION_DATA_LIST:string;
  private SEND_DASHBOARD_QUESTION_DATA_LIST:string;

  constructor(private http:HttpClient) {
    this.APIURL = environment.apiUrl;
    this.DASHBOARD_SPECIFIC_CATEGORY_LIST = CommonURLProperties.DASHBOARD_SPECIFIC_CATEGORY_LIST;
    this.CATEGORY_SPECIFIC_SUB_CATEGORY_LIST = CommonURLProperties.CATEGORY_SPECIFIC_SUB_CATEGORY_LIST;
    this.DASHBOARD_SPECIFIC_KPI_GROUP_LIST = CommonURLProperties.DASHBOARD_SPECIFIC_KPI_GROUP_LIST;
    this.DASHBOARD_LIST = CommonURLProperties.DASHBOARD_LIST;
    this.SELECTED_DASHBOARD_QUESTION_DATA_LIST = CommonURLProperties.SELECTED_DASHBOARD_QUESTION_DATA_LIST;
    this.SEND_DASHBOARD_QUESTION_DATA_LIST = CommonURLProperties.SEND_DASHBOARD_QUESTION_DATA_LIST;
   }

  getCategory(dashboardId:number){
    return this.http.get(this.APIURL+this.DASHBOARD_SPECIFIC_CATEGORY_LIST+'?dashboardId='+dashboardId);
  }

  getSubCategory(categoryId:number){
  return this.http.get(this.APIURL+this.CATEGORY_SPECIFIC_SUB_CATEGORY_LIST+'?categoryId='+categoryId);
  }

  getKpiGroup(dashboardId:number){
    return this.http.get(this.APIURL+this.DASHBOARD_SPECIFIC_KPI_GROUP_LIST+'?dashboardId='+dashboardId); 
  }
        
  public retreiveData(dashboardId:number){
    console.log(this.APIURL+ this.SELECTED_DASHBOARD_QUESTION_DATA_LIST+'?dashboardId='+dashboardId);
    return this.http.get(this.APIURL+ this.SELECTED_DASHBOARD_QUESTION_DATA_LIST+'?dashboardId='+dashboardId);

  }

  public getDashBoards(){
    return this.http.get(this.APIURL+this.DASHBOARD_LIST);
  }

  public sendKpiData(data){
    console.log(this.APIURL+this.SEND_DASHBOARD_QUESTION_DATA_LIST,data);
    return this.http.post(this.APIURL+this.SEND_DASHBOARD_QUESTION_DATA_LIST,data);
  }
  

}
