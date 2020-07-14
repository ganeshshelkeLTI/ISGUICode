import { Injectable } from '@angular/core';
import { CRGProperties } from '../../../properties/crg-properties';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { INFRAURLProperties } from '../../../properties/infra-url-properties';

@Injectable({
  providedIn: 'root'
})
export class CustomRefGroupService {

  private APIURL : string;
  private CUSTOM_REF_GROUP_LANDING_DATA: string;
  private CUSTOM_REF_GROUP_LANDING_DATA_ADAM: string;
  public DASHBOARD_CRG_DATA: any;
  public DASHBOARD_ADM_CRG_DATA: any;
  public dashboardId: any;
  public CRGId: any;
  private SAVED_CRG_DATA: string;
  private CUSTOM_REF_GROUP_LIST: string;
  private CUSTOM_REF_GENERAL_DATA: string;
  private SELECTEED_CUSTOM_REFERENCE_GROUP: string;
  private SAVE_UPDATE_CRG_MAINTENANCE: any;
  private CIO_CUSTOM_REF_LANDING_DATA: string;
  public DASHBOARD_ADM_CRG_DATA_BYID: any;
  public DASHBOARD_CRG_DATA_BYID:any;
  public MAPPED_CRG_LIST_USER: any;
  public userEmail: any;
  public userType: any;
  public DIGITAL_LANDING_DATA: any;
  public DIGITAL_SAVE_CRG_DATA: any;
  public DIGITAL_DELETE_CRG_DATA: any;
  public DIGITAL_FETCH_CRG_DATA: any;


  constructor(private http:HttpClient) {
    this.APIURL = environment.apiUrl;
    this.CUSTOM_REF_GROUP_LANDING_DATA =  CRGProperties.CUSTOM_REF_GROUP_LANDING_DATA;
    this.CUSTOM_REF_GROUP_LANDING_DATA_ADAM = CRGProperties.CUSTOM_REF_GROUP_LANDING_DATA_ADAM;
    this.DASHBOARD_CRG_DATA = INFRAURLProperties.ADMIN1_DASHBOARD_CRG_DATA;
    this.DASHBOARD_ADM_CRG_DATA = INFRAURLProperties.ADMIN1_DASHBOARD_ADM_CRG_DATA;
    this.SAVED_CRG_DATA = CRGProperties.SAVED_CRG_DATA;
    this.CUSTOM_REF_GROUP_LIST = CRGProperties.CUSTOM_REF_GROUP_LIST;
    this.CUSTOM_REF_GENERAL_DATA = CRGProperties.CUSTOM_REF_GENERAL_DATA;
    this.SELECTEED_CUSTOM_REFERENCE_GROUP = CRGProperties.SELECTEED_CUSTOM_REFERENCE_GROUP;
    this.SAVE_UPDATE_CRG_MAINTENANCE = INFRAURLProperties.SAVE_UPDATE_CRG_MAINTENANCE;
    this.CIO_CUSTOM_REF_LANDING_DATA = CRGProperties.CIO_CUSTOM_REF_LANDING_DATA;
    this.DASHBOARD_ADM_CRG_DATA_BYID = INFRAURLProperties.DASHBOARD_ADM_CRG_DATA_BYID;
    this.DASHBOARD_CRG_DATA_BYID = INFRAURLProperties.DASHBOARD_CRG_DATA_BYID;
    this.MAPPED_CRG_LIST_USER = INFRAURLProperties.MAPPED_CRG_LIST_USER;
    this.DIGITAL_LANDING_DATA = CRGProperties.DIGITAL_LANDING_DATA;
    this.DIGITAL_SAVE_CRG_DATA = CRGProperties.DIGITAL_SAVE_CRG_DATA;
    this.DIGITAL_DELETE_CRG_DATA = CRGProperties.DIGITAL_DELETE_CRG_DATA;
    this.DIGITAL_FETCH_CRG_DATA = CRGProperties.DIGITAL_FETCH_CRG_DATA;


}

//fetch the template of CRG maintenance page
getData(dashboardId):Observable<any>{
  if(dashboardId == 12 || dashboardId == 13){
    return this.http.get(this.APIURL+this.CUSTOM_REF_GROUP_LANDING_DATA_ADAM+dashboardId);
  }else if(dashboardId == 14){
    return this.http.get(this.APIURL+this.DIGITAL_LANDING_DATA+dashboardId);
  }else{
    return this.http.get(this.APIURL+this.CUSTOM_REF_GROUP_LANDING_DATA+dashboardId);
  }
}

//set email
setUserEmail(email)
{
  this.userEmail = email;
}

//set user type
setUserType(usertype)
{
  this.userType = usertype;
}


getCustomRefGroupList(dashboardId){
  return this.http.get(this.APIURL+this.CUSTOM_REF_GROUP_LIST+dashboardId+'&userId='+this.userEmail);
}

//get mapped CRG for selected user - Admin 2
getMappedCRGsForUser()
{
  return this.http.get(this.APIURL+this.MAPPED_CRG_LIST_USER+this.userEmail+'&userType='+this.userType+'&dashboardId='+this.dashboardId);
  //return this.http.get('http://172.20.99.72:8080/'+this.MAPPED_CRG_LIST_USER+this.userEmail+'&userType='+this.userType+'&dashboardId='+this.dashboardId);
  //http://172.20.99.72:8080/
}

getCIOCCRGLandingData(){
  return this.http.get(this.APIURL+this.CIO_CUSTOM_REF_LANDING_DATA+this.CRGId );
}

getGeneralData(customRefGroupId, dashboardId){
  return this.http.get(this.APIURL+"isgDashboard/customReferenceGeneralInformation?dashboardId="+dashboardId+"&costomId="+customRefGroupId)
}

public setDashboardId(pageId)
{
  this.dashboardId =pageId;
}

public getDashboardId()
{
  return this.dashboardId;
}

public setCRGId(crgid)
  {
    this.CRGId = crgid;
  }


public fetchCRGData()
  {
    if(this.dashboardId==12 ||this.dashboardId==13)
    {
      return this.http.get(this.APIURL+this.DASHBOARD_ADM_CRG_DATA+this.dashboardId+'&custom_id='+this.CRGId);
    }
    else
    {
      return this.http.get(this.APIURL+this.DASHBOARD_CRG_DATA+this.dashboardId+'&custom_id='+this.CRGId);
    }
  }

  fetchCRGDataById()
  {
    if(this.dashboardId==12 ||this.dashboardId==13)
    {
      return this.http.get(this.APIURL+this.DASHBOARD_ADM_CRG_DATA_BYID+this.dashboardId+'&customId='+this.CRGId);
    }else if(this.dashboardId==14){
      return this.http.get(this.APIURL+"isgDashboard/digitalCustomReferenceFetch?filterValue=Global&customId="+this.CRGId+'&dashboardId='+this.dashboardId);
   }
    else
    {
      return this.http.get(this.APIURL+this.DASHBOARD_CRG_DATA_BYID+this.dashboardId+'&customId='+this.CRGId);
    }
  }
  //return this.http.get(this.APIURL+this.CUSTOM_REF_GENERAL_DATA+dashboardId+"&costomId="+customRefGroupId)
//}

getSelectedCustomRefGroup(userId,userType,dashboardId){
  return this.http.get(this.APIURL+this.SELECTEED_CUSTOM_REFERENCE_GROUP+userId+"&userType="+userType+"&dashboardId="+dashboardId);
  //return this.http.get('http://172.20.99.72:8080/'+this.SELECTEED_CUSTOM_REFERENCE_GROUP+userId+"&userType="+userType+"&dashboardId="+dashboardId);
}

saveCustomRefData(data){
  //https://172.20.99.72:8080/
  return this.http.post(this.APIURL+this.SAVED_CRG_DATA,data);
  //return this.http.post('http://172.20.99.72:8080/'+this.SAVED_CRG_DATA,data);
}

//delete CRG mapping wth user - CRG User Mapping Page (Admin 2)
public deleteUserCustomRefMapping(userType,userCustomId):Observable<any>{
  return this.http.delete(this.APIURL+'isgDashboard/deleteCustomRefGroup?userType='+userType+'&userId='+userCustomId);
}

//delete CRG  - CRG maintenenace Page (Admin 1)
public deleteCRG(isDigitalTower):Observable<any>{
  if(isDigitalTower){
    //if admin wants to delete CRG of digital tower
    return this.http.delete(this.APIURL+this.DIGITAL_DELETE_CRG_DATA+this.CRGId);
  }else{
    //if admin wants to delete CRG of tower other than digital
    return this.http.delete(this.APIURL+'isgDashboard/deleteCustomRefGroupMaster?customRefGroupId='+this.CRGId);
  }
  
}
//save CRG- Admin 1
public saveCRG(crgData):Observable<any>
{
  if(this.dashboardId == 14){
    return this.http.post(this.APIURL+this.DIGITAL_SAVE_CRG_DATA,crgData);
  }else{
    //console.log(this.APIURL+this.SAVE_UPDATE_CRG_MAINTENANCE);
    return this.http.post(this.APIURL+this.SAVE_UPDATE_CRG_MAINTENANCE,crgData);
  }
  
} 
}
