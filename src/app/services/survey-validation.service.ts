import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

import { CommonURLProperties } from '../../properties/common-url-properties';
import { SurveyMaintainanceURLProperties } from '../../properties/survey-maintenance-url-properties';

@Injectable({
  providedIn: 'root'
})
export class SurveyValidationService {

  private APIURL: string;
  private DASHBOARD_LIST: string;
  private SURVEY_VALIDATION_DATA_LIST: string;
  private SURVEY_VALIDATION_DATA_LIST_USERBASED:string;

  public userType: any;
  public dashboardId: any;

  constructor(private http: HttpClient) {
    this.APIURL = environment.apiUrl;
    this.DASHBOARD_LIST = CommonURLProperties.DASHBOARD_LIST;
    this.SURVEY_VALIDATION_DATA_LIST = SurveyMaintainanceURLProperties.SURVEY_VALIDATION_DATA_LIST;
    this.SURVEY_VALIDATION_DATA_LIST_USERBASED = SurveyMaintainanceURLProperties.SURVEY_VALIDATION_DATA_LIST_USERBASED;
  }

  public setDashboardId(pageId) {
    this.dashboardId = pageId;
  }

  setUserType(usertype) {
    this.userType = usertype;
  }


  fetchSurveyList(dashboardId) {
    return this.http.get(this.APIURL + this.SURVEY_VALIDATION_DATA_LIST + dashboardId);
  }

  fetchSurveyListByUserId(userId, userType, dashboardId) {
    return this.http.get(this.APIURL + this.SURVEY_VALIDATION_DATA_LIST_USERBASED + userId+"&userType="+userType+"&dashboardId="+dashboardId);
  }

}
