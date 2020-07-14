import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DigitalURLProperties } from '../../../properties/digital-url-properties';
import { Observable } from 'rxjs';
import { EventEmitter } from 'events';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DigitalSharedService {

  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

  //private emitter:EventEmitter;
  public GET_DIGITAL_LANDING_DATA:any;
  public  DEFINATION_DATA :any;
  public LANDING_DATA_BASED_ON_FILTERVALUE : any;
  public APIURL: any;
  public SURVEY_LIST_BY_USER: any;
  public DIGITAL_GENERAL_INFO: any;
  public DIGITAL_QUESTION_INFO;
  public SAVE_SURVEY_DATA;
  public GET_SURVEY_DATA_BY_ID;
  public GET_DIGITAL_SCALE_DATA;
  public DIGITAL_REVENUE_DROPDOWN: any;
  public COMPARE_DATA_MASTER: any;
  public COMPARE_CRG_DATA: any;
  public COMPARE_SURVEY_DATA: any;
  public surveyId: any;
  public COMPARE_All_SURVEY_DATA: any;
  public SAVE_VALIDATED_SURVEY_DATA: any;
  public surveyID: any;
  public UPDATE_SURVEY_STATUS: any;
  public DIGITAL_DEFINATION_DATA: any;
  public surveyName: string;
  public surveyQuestionJSON: any;


  constructor(private http: HttpClient) {

    //this.emitter=new EventEmitter();

    this.APIURL = environment.apiUrl;
    this.GET_DIGITAL_LANDING_DATA = DigitalURLProperties.GET_DIGITAL_LANDING_DATA;
    this.SURVEY_LIST_BY_USER = DigitalURLProperties.SURVEY_LIST_BY_USER;
    this.DEFINATION_DATA = DigitalURLProperties.DEFINATION_DATA;
    this.LANDING_DATA_BASED_ON_FILTERVALUE = DigitalURLProperties.LANDING_DATA_BASED_ON_FILTERVALUE;
    this.DIGITAL_GENERAL_INFO = DigitalURLProperties.DIGITAL_GENERAL_INFO;
    this.DIGITAL_QUESTION_INFO = DigitalURLProperties.DIGITAL_QUESTION_INFO;
    this.SAVE_SURVEY_DATA = DigitalURLProperties.SAVE_SURVEY_DATA;
    this.GET_SURVEY_DATA_BY_ID = DigitalURLProperties.GET_SURVEY_DATA_BY_ID;
    this.GET_DIGITAL_SCALE_DATA = DigitalURLProperties.GET_DIGITAL_SCALE_DATA;

    this.DIGITAL_REVENUE_DROPDOWN = DigitalURLProperties.DIGITAL_REVENUE_DROPDOWN;
    this.COMPARE_DATA_MASTER = DigitalURLProperties.COMPARE_DATA_MASTER;
    this.COMPARE_CRG_DATA = DigitalURLProperties.COMPARE_CRG_DATA;
    this.COMPARE_SURVEY_DATA = DigitalURLProperties.COMPARE_SURVEY_DATA;
    this.COMPARE_All_SURVEY_DATA = DigitalURLProperties.COMPARE_All_SURVEY_DATA;
    this.SAVE_VALIDATED_SURVEY_DATA = DigitalURLProperties.SAVE_VALIDATED_SURVEY_DATA;
    this.UPDATE_SURVEY_STATUS = DigitalURLProperties.UPDATE_SURVEY_STATUS;

    this.DIGITAL_DEFINATION_DATA = DigitalURLProperties.DIGITAL_DEFINATION_DATA;
  }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  public setsurveyQuestionJSON(json)
  {
    this.surveyQuestionJSON =json;
  }

  public getsurveyQuestionJSON()
  {
    return this.surveyQuestionJSON;
  }

   public setSurveyId(surveyId) {
    this.surveyID = surveyId;
  }

  public setSurveyName(surveyname)
  {
    this.surveyName = surveyname;
  }

  public getSurveyName()
  {
    return this.surveyName;
  }

  public getSurveyId() {
    return this.surveyID;
  }

  public getDefaultLandingData(dashboardid) {
    return this.http.get(this.APIURL + this.GET_DIGITAL_LANDING_DATA + dashboardid);
  }

  public getDefinitaionData(dashboardid) {
    return this.http.get(this.APIURL + this.DEFINATION_DATA + dashboardid);
  }

  public getSurveyListForUser(dashboardid) {
    return this.http.get(this.APIURL + this.SURVEY_LIST_BY_USER + dashboardid);
  }

  getDataByFilterValue(filterType, filterValue, dashboardid) {
    return this.http.get(this.APIURL + this.LANDING_DATA_BASED_ON_FILTERVALUE + filterType + '&filterValue=' + filterValue + '&dashboardId=' + dashboardid);
  }

  public getGeneralInfoStructure(dashboardid) {
    return this.http.get(this.APIURL + this.DIGITAL_GENERAL_INFO + dashboardid);
  }

  public getSurveyTemplate(dashboardid) {

    return this.http.get(this.APIURL + this.DIGITAL_QUESTION_INFO + dashboardid);
  }

  public saveScenario(scenarioObj): Observable<any> {

    //172.20.99.64
    //return this.http.post('http://172.20.99.64:8080/'+this.SAVE_SURVEY_DATA, scenarioObj);
    return this.http.post(this.APIURL + this.SAVE_SURVEY_DATA, scenarioObj);

  }

  public getSurveyDataById(dashboardid, surveyId) {
    //return this.http.get('http://172.20.99.72:8080/'+ this.GET_SURVEY_DATA_BY_ID + dashboardid + '&survey_Id=' + surveyId);
    return this.http.get(this.APIURL + this.GET_SURVEY_DATA_BY_ID + dashboardid + '&survey_Id=' + surveyId);
  }

  public getScaleDetails() {
    return this.http.get(this.APIURL + this.GET_DIGITAL_SCALE_DATA);
  }
  public getRevenue() {
    return this.http.get(this.APIURL + this.DIGITAL_REVENUE_DROPDOWN);
  }

  public getMasterCompareData(selectedValue: any): Observable<any> {
    return this.http.post(this.APIURL + this.COMPARE_DATA_MASTER, selectedValue);
  }

  public getCRGCompareData(selectedValue: any): Observable<any> {
    return this.http.post(this.APIURL + this.COMPARE_CRG_DATA, selectedValue);
  }

  public getSurveyCompareData(selectedValue: any): Observable<any> {
    return this.http.post(this.APIURL + this.COMPARE_All_SURVEY_DATA, selectedValue);
  }

  public getEmitter(){
    return this.emitter;
  }

  private emitter:EventEmitter=new EventEmitter();

  public getSurveyDataForDashboard(surveyDataObj: any): Observable<any> {
    return this.http.post(this.APIURL + 'isgDashboard/digitalCompareAll?', surveyDataObj);
  }

  public saveValidatedSurvey(surveyObj): Observable<any> {

    return this.http.post(this.APIURL + this.SAVE_VALIDATED_SURVEY_DATA, surveyObj);

  }

  public updateSurveyStatus(dataStatusObj): Observable<any> {

    return this.http.post(this.APIURL + this.UPDATE_SURVEY_STATUS, dataStatusObj);

  }

  public getDigitalDefinationData(dashboardid) {
    return this.http.get(this.APIURL + this.DIGITAL_DEFINATION_DATA + dashboardid);
  }
 
}
