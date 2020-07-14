import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { checkAndUpdateDirectiveDynamic } from '@angular/core/src/view/provider';
import { INFRAURLProperties } from '../../properties/infra-url-properties';
import { EventEmitter } from 'events';

@Injectable({
  providedIn: 'root'
})
export class IndustrySizeService {

  private APIURL: string;
  private updatedScale = "Small";
  private updateRegion = "Global";
  private pageId = 2;

  private SCALE_DATA_LIST:string;
  private CIO_DEFINATION_DATA:string;
  private DEFINATION_DATA:string;
  private MAINFRAME_SCALE_FILTER_DATA:string;
  private SCALE_FILTER_DATA:string;
  private SCALE_LABEL:string;
  private ADM_FILTER_DATA:any;
  private AD_FILTER_DATA:any;
  private AM_FILTER_DATA:any;
  //currency object
  private currencyObject: any;
  private scaleTitle: any;
  private emitter: EventEmitter;

  private ADMFilterType:any;
  private ADMFilterValue:any;
  private APPLICATION_MAINTENANCE_DEFAULT_LANDING_DATA:any;
  public DASHBOARD_CRG_LIST: any;
  public DASHBOARD_CRG_DATA: any;
  public AD_DASHBOARD_CRG_DATA: any;
  public MAINFRAME_DASHBOARD_CRG_DATA: any;
  
  private ADFilterType:any;
  private ADFilterValue:any;
  private AMFilterType:any;
  private AMFilterValue:any;
  private userEmail;

  public CRGId: any;

  constructor(private http:HttpClient) {
    this.APIURL = environment.apiUrl;
    this.SCALE_DATA_LIST = INFRAURLProperties.SCALE_DATA_LIST;
    this.CIO_DEFINATION_DATA = INFRAURLProperties.CIO_DEFINATION_DATA;
    this.DEFINATION_DATA = INFRAURLProperties.DEFINATION_DATA;
    this.MAINFRAME_SCALE_FILTER_DATA = INFRAURLProperties.MAINFRAME_SCALE_FILTER_DATA;
    this.SCALE_FILTER_DATA = INFRAURLProperties.SCALE_FILTER_DATA;
    this.ADM_FILTER_DATA = INFRAURLProperties.ADM_FILTER_DATA;
    this.AD_FILTER_DATA = INFRAURLProperties.AD_FILTER_DATA;
    this.AM_FILTER_DATA = INFRAURLProperties.AM_FILTER_DATA;
    this.APPLICATION_MAINTENANCE_DEFAULT_LANDING_DATA = INFRAURLProperties.APPLICATION_MAINTENANCE_DEFAULT_LANDING_DATA
    this.DASHBOARD_CRG_LIST = INFRAURLProperties.DASHBOARD_CRG_LIST;
    this.DASHBOARD_CRG_DATA = INFRAURLProperties.DASHBOARD_CRG_DATA;
    this.AD_DASHBOARD_CRG_DATA = INFRAURLProperties.AD_DASHBOARD_CRG_DATA;
    this.MAINFRAME_DASHBOARD_CRG_DATA = INFRAURLProperties.MAINFRAME_DASHBOARD_CRG_DATA;
    this.emitter = new EventEmitter();
  }

  setPageId(pageId) {
    this.pageId = pageId;
    console.log('in service: ',this.pageId);
  }

  public getPageId() {
    return this.pageId;
  }

  getIndustrySize(): Observable<any> {
    return this.http.get(this.APIURL + this.SCALE_DATA_LIST + "&dropDownId=" + this.pageId);
  }

  public setInustrySize(scale) {
    this.updatedScale = scale;
  }

  public getselectedIndustrySize() {
    return this.updatedScale;
  }

  public setRegionValue(region) {
    this.updateRegion = region;
  }

  //following currency functions are used for currency conversion on compare grid pages

  public setCurrencyObject(currency) {
    this.currencyObject = currency;
  }

  public getCurrencyObject() {
    return this.currencyObject;
  }

  getMainFrameDataByScale(): Observable<any> {

    if (this.pageId == 2) {
      return this.http.get(this.APIURL + this.MAINFRAME_SCALE_FILTER_DATA + "&value=" + this.updateRegion + "&industrySize=" + this.updatedScale + "&dashboard_id=" + this.pageId);

    }

    if (this.pageId == 4 || this.pageId == 5 || this.pageId == 6 || this.pageId == 3 || this.pageId == 11 || this.pageId == 10 || this.pageId == 8 || this.pageId == 7 || this.pageId == 9) {
      return this.http.get(this.APIURL + this.SCALE_FILTER_DATA + "&value=" + this.updateRegion + "&dashboard_id=" + this.pageId + "&industrySize=" + this.updatedScale);
    }

  }

  // group definition data
  getDefinitionData():Observable<any> {
    return this.http.get(this.APIURL+this.DEFINATION_DATA+"?dashboardId="+this.pageId+"&industrySize=Small");
  }

  getCIODefinitionData(): Observable<any> {
    return this.http.get(this.APIURL + this.CIO_DEFINATION_DATA);
  }

  //definition without industry size
  getDefinitionDataWithoutIndustrySize():Observable<any> {
    return this.http.get(this.APIURL+this.DEFINATION_DATA+"?dashboardId="+this.pageId);
  }



  public setScaleLabel(label:string){
  this.SCALE_LABEL=label;
  }

  public getScale(): string {
    return this.SCALE_LABEL;
  }

  public getScaleTitle() {
    return this.scaleTitle;
  }

  public setScaleTitle(scaleTitle) {
    this.scaleTitle = scaleTitle;
  }

  public getEmitter(): EventEmitter {
    return this.emitter;
  }

  public setADMFilters(filterType,filterValue)
  {
    this.ADMFilterType = filterType;
    this.ADMFilterValue= filterValue;
  }

  
  public getADMFilteredLandingData()
  {
    return this.http.get(this.APIURL+this.ADM_FILTER_DATA+'?filter_type='+this.ADMFilterType+'&filter_value='+this.ADMFilterValue+'&dashboard_id='+this.pageId);
  }

  public setADFilters(filterType,filterValue)
  {
    this.ADFilterType = filterType;
    this.ADFilterValue= filterValue;
  }

  public getADFilteredLandingData()
  {
    return this.http.get(this.APIURL+this.AD_FILTER_DATA+'?filter_type='+this.ADFilterType+'&filter_value='+this.ADFilterValue+'&dashboard_id='+this.pageId);
  }

  public setAMFilters(filterType,filterValue)
  {
    this.AMFilterType = filterType;
    this.AMFilterValue= filterValue;
  }

  public getAMFilteredLandingData()
  {
    return this.http.get(this.APIURL+this.AM_FILTER_DATA+'?filter_type='+this.AMFilterType+'&filter_value='+this.AMFilterValue+'&dashboard_id='+this.pageId);
  }

  public getAMLandingData():Observable<any>
  {
    console.log(this.APIURL+this.APPLICATION_MAINTENANCE_DEFAULT_LANDING_DATA+this.pageId);
    return this.http.get(this.APIURL+this.APPLICATION_MAINTENANCE_DEFAULT_LANDING_DATA+this.pageId);
  }

  //set user email id
  public setUserEmail(useremail)
  {
    this.userEmail = useremail;
  }


  public getCustomRefereneGroupList()
  {
    console.log(this.APIURL+this.DASHBOARD_CRG_LIST+this.pageId+'&userId='+this.userEmail);
    return this.http.get(this.APIURL+this.DASHBOARD_CRG_LIST+this.pageId+'&userId='+this.userEmail);
    //http://localhost:8080/isgDashboard/customReferenceGroupListBasedOnUser?dashboardId=7&userId=LTIISG1@isg-one.com
  }

  public setCRGId(crgid)
  {
    this.CRGId = crgid;
  }

  public fetchCRGData()
  {
    if(this.pageId==12)//AD
    {
      //console.log(this.APIURL+this.AD_DASHBOARD_CRG_DATA+this.CRGId);
      return this.http.get(this.APIURL+this.AD_DASHBOARD_CRG_DATA+this.CRGId);
    }
    else if(this.pageId==2)//mainframe
    {
      return this.http.get(this.APIURL+this.MAINFRAME_DASHBOARD_CRG_DATA+this.CRGId);
    }
    else
    {
      return this.http.get(this.APIURL+this.DASHBOARD_CRG_DATA+this.pageId+'&customId='+this.CRGId);
      //http://localhost:8080/isgDashboard/customReferenceLandingPage?filter_type=Region&filter_value=Global&dashboard_id=6&customId=25&sessionId=LTIISG46bae6c8f262444478a5dd4af7b079643 
    }
  }

}
