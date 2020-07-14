import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonURLProperties } from '../../../properties/common-url-properties';
import { SurveyMaintainanceURLProperties } from '../../../properties/survey-maintenance-url-properties';

@Injectable({
  providedIn: 'root'
})
export class SurveyQuestionMaintenanceService {

  private DASHBOARD_LIST:string;
  private APIURL:string;
  public DASHBOARD_SPECIFIC_DATA: any;
  private DASHBOARD_SPECIFIC_KPI_GROUP_LIST:string;
  private DASHBOARD_SPECIFIC_CATEGORY_LIST:string;
  private CATEGORY_SPECIFIC_SUB_CATEGORY_LIST:string;
  private SELECTED_DASHBOARD_QUESTION_DATA_LIST:string;
  private SEND_DASHBOARD_QUESTION_DATA_LIST:string;
  public SURVEY_QUESTION_LIST: any;
  public SURVEY_INPUT_TYPE: any;
  public SAVE_SURVEY_QUESTION_DATA: any;
  public EDIT_SURVEY_QUESTION_DATA: any;


  constructor(private http:HttpClient) { 
    this.APIURL = environment.apiUrl;
    this.DASHBOARD_LIST = CommonURLProperties.DASHBOARD_LIST;
    this.DASHBOARD_SPECIFIC_DATA = SurveyMaintainanceURLProperties.DASHBOARD_SPECIFIC_DATA;
    this.DASHBOARD_SPECIFIC_KPI_GROUP_LIST = CommonURLProperties.DASHBOARD_SPECIFIC_KPI_GROUP_LIST;
    this.DASHBOARD_SPECIFIC_CATEGORY_LIST = CommonURLProperties.DASHBOARD_SPECIFIC_CATEGORY_LIST;
    this.CATEGORY_SPECIFIC_SUB_CATEGORY_LIST = CommonURLProperties.CATEGORY_SPECIFIC_SUB_CATEGORY_LIST;
    this.DASHBOARD_SPECIFIC_KPI_GROUP_LIST = CommonURLProperties.DASHBOARD_SPECIFIC_KPI_GROUP_LIST;
    this.DASHBOARD_LIST = CommonURLProperties.DASHBOARD_LIST;
    this.SELECTED_DASHBOARD_QUESTION_DATA_LIST = CommonURLProperties.SELECTED_DASHBOARD_QUESTION_DATA_LIST;
    this.SEND_DASHBOARD_QUESTION_DATA_LIST = CommonURLProperties.SEND_DASHBOARD_QUESTION_DATA_LIST;
    this.SURVEY_QUESTION_LIST = SurveyMaintainanceURLProperties.SURVEY_QUESTION_LIST;
    this.SURVEY_INPUT_TYPE = SurveyMaintainanceURLProperties.SURVEY_INPUT_TYPE;
    this.SAVE_SURVEY_QUESTION_DATA = SurveyMaintainanceURLProperties.SAVE_SURVEY_QUESTION_DATA;
    this.EDIT_SURVEY_QUESTION_DATA = SurveyMaintainanceURLProperties.EDIT_SURVEY_QUESTION_DATA;
  }

  public getDashBoards(){
    return this.http.get(this.APIURL+this.DASHBOARD_LIST);
  }

  getKpiGroup(dashboardId:number){
    return this.http.get(this.APIURL+this.DASHBOARD_SPECIFIC_KPI_GROUP_LIST+'?dashboardId='+dashboardId); 
  }

  //get dashboard column list
  public getDashBoardData(dashboardId)
  {
    return this.http.get(this.APIURL+this.DASHBOARD_SPECIFIC_DATA+dashboardId);
  }

  getCategory(dashboardId:number){
    return this.http.get(this.APIURL+this.DASHBOARD_SPECIFIC_CATEGORY_LIST+'?dashboardId='+dashboardId);
  }

  getSubCategory(categoryId:number){
  return this.http.get(this.APIURL+this.CATEGORY_SPECIFIC_SUB_CATEGORY_LIST+'?categoryId='+categoryId);
  }

  public retreiveData(dashboardId:number){
    console.log(this.APIURL+ this.SELECTED_DASHBOARD_QUESTION_DATA_LIST+dashboardId);
    return this.http.get(this.APIURL+ this.DASHBOARD_SPECIFIC_DATA+dashboardId);

  }

  public sendKpiData(data){
    console.log(this.APIURL+this.SEND_DASHBOARD_QUESTION_DATA_LIST,data);
    return this.http.post(this.APIURL+this.SEND_DASHBOARD_QUESTION_DATA_LIST,data);
  }

  public fetchQuestionDetails()
  {
    return this.http.get(this.APIURL+this.SURVEY_QUESTION_LIST);
  }

  public getInputType()
  {
    return this.http.get(this.APIURL+this.SURVEY_INPUT_TYPE);
  }

  public saveSurveyQuestionData(data)
  {
    //return this.http.post(this.APIURL+this.SAVE_SURVEY_QUESTION_DATA,data);
    return this.http.post(this.APIURL+this.SAVE_SURVEY_QUESTION_DATA,data);
    //return this.http.post('http://172.20.99.72:8080/'+this.SAVE_SURVEY_QUESTION_DATA,data);
    //172.
  }

  public editSurveyQuestions(data)
  {
    return this.http.post(this.APIURL+this.EDIT_SURVEY_QUESTION_DATA,data);
  }
  

}
