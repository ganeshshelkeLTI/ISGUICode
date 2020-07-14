import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CIOURLProperties } from '../../properties/cio-url-properties';

@Injectable({
  providedIn: 'root'
})


export class CIOGeneralTabCompanyDetailService {
  private APIURL:string;
  private CIO_COMAPANY_DETAILS_DATA:string;
  private CIO_REGION_SPECIFIC_COUNTRY_LIST_DATA:string;
  private CIO_DATA_STATUS_LIST_DATA:string;
  private CIO_COMPANY_LIST_DATA:string;
  private CIO_VERTICAL_CODE_DATA:string;
  private CIO_SUBVERTICAL_CODE_DATA:string;
  private CIO_CURRENCY_INPUT_LIST_DATA:string;
  private CIO_INDUSTRY_INPUT_LIST_DATA: string;
  private CIO_REGION_INPUT_LIST_DATA:string;
  private CIO_GROUP_INPUT_LIST_DATA:string;
  private CIO_COUNTRY_LIST_DATA:string;
  private CIO_PROJECT_LIST_DATA:string;
  private CIO_COMPANY_SPECIFIC_PROJECT_LIST_DATA:string;
  private CIO_GET_SCENARIO_DATA:string;
  private CIO_SAVE_SCENARIO_DATA:string;
  private CIO_SCENARIO_LIST_DATA:string;

  constructor(private http:HttpClient) {
      this.APIURL = environment.apiUrl;
      this.CIO_COMAPANY_DETAILS_DATA = CIOURLProperties.CIO_COMAPANY_DETAILS_DATA;
      this.CIO_REGION_SPECIFIC_COUNTRY_LIST_DATA = CIOURLProperties.CIO_REGION_SPECIFIC_COUNTRY_LIST_DATA;
      this.CIO_DATA_STATUS_LIST_DATA = CIOURLProperties.CIO_DATA_STATUS_LIST_DATA;

      this.CIO_COMPANY_LIST_DATA = CIOURLProperties.CIO_COMPANY_LIST_DATA;
      this.CIO_VERTICAL_CODE_DATA = CIOURLProperties.CIO_VERTICAL_CODE_DATA;
      this.CIO_SUBVERTICAL_CODE_DATA = CIOURLProperties.CIO_SUBVERTICAL_CODE_DATA;
      this.CIO_CURRENCY_INPUT_LIST_DATA = CIOURLProperties.CIO_CURRENCY_INPUT_LIST_DATA;
      this.CIO_INDUSTRY_INPUT_LIST_DATA = CIOURLProperties.CIO_INDUSTRY_INPUT_LIST_DATA;
      this.CIO_REGION_INPUT_LIST_DATA = CIOURLProperties.CIO_REGION_INPUT_LIST_DATA;
      this.CIO_GROUP_INPUT_LIST_DATA = CIOURLProperties.CIO_GROUP_INPUT_LIST_DATA;
      this.CIO_COUNTRY_LIST_DATA = CIOURLProperties.CIO_COUNTRY_LIST_DATA;
      this.CIO_PROJECT_LIST_DATA = CIOURLProperties.CIO_PROJECT_LIST_DATA;
      this.CIO_COMPANY_SPECIFIC_PROJECT_LIST_DATA = CIOURLProperties.CIO_COMPANY_SPECIFIC_PROJECT_LIST_DATA;
      this.CIO_GET_SCENARIO_DATA = CIOURLProperties.CIO_GET_SCENARIO_DATA;
      this.CIO_SAVE_SCENARIO_DATA = CIOURLProperties.CIO_SAVE_SCENARIO_DATA;
      this.CIO_SCENARIO_LIST_DATA = CIOURLProperties.CIO_SCENARIO_LIST_DATA;
   }

getCompanyDetails(clientId):Observable<any>{
  return this.http.get(this.APIURL+'isgDashboard/defaultValues?clientId='+"'"+clientId+"'");
}

//getCountries based on region
getCountries(regionId):Observable<any>{
  return this.http.get(this.APIURL+this.CIO_REGION_SPECIFIC_COUNTRY_LIST_DATA+'?regionId='+"'"+regionId+"'");
}

//Get status list
getDataStatus():Observable<any>{
  return this.http.get(this.APIURL+this.CIO_DATA_STATUS_LIST_DATA);
}

//get all scenarion data for loggedin User
getAllScenarios():Observable<any>{
  //return this.http.get(this.APIURL+'isgDashboard/scenarios?userId=E5E8339B-0620-4377-82FE-0008029EDC53&dashboardId=1');
  return this.http.get(this.APIURL+this.CIO_SCENARIO_LIST_DATA+"?dashboardId=1");
}

//get all company list
getAllCompanies(){
  return this.http.get(this.APIURL+"isgDashboard/dropDownDataList?dropDownSource=client");
  // return this.http.get("http://10.101.42.44:8080/isgDashboard/dropDownDataList?dropDownSource=client");

}

//get vertical classification code list
getAllForbesVertical(){
  return this.http.get(this.APIURL+"isgDashboard/dropDownDataList?dropDownSource=forbesvertical");

}
//get subVertical classification code list
getAllForbesSubVertical(){
  return this.http.get(this.APIURL+"isgDashboard/dropDownDataList?dropDownSource=forbesSubvertical");
}

//get all currency list
getAllCurrency(){
  return this.http.get(this.APIURL+"isgDashboard/dropDownDataList?dropDownSource=currencyExchange");
}

//Get all industry list data
getAllIndustry(){
  return this.http.get(this.APIURL+"isgDashboard/dropDownDataList?dropDownSource=industryvertical")
}

//get all region list data
getAllRegion(){
  return this.http.get(this.APIURL+"isgDashboard/dropDownDataList?dropDownSource=region")
}

//get all group list data
getAllGroupByIndustryVertical(industryId){
  return this.http.get(this.APIURL+"isgDashboard/dropDownDataList?dropDownSource=industrygroup&dropDownId="+industryId);

}

//Get all country list 
getAllCountry(){
  return this.http.get(this.APIURL+"isgDashboard/dropDownDataList?dropDownSource=country");
}

//Get all project list data
getAllProjects(){
  return this.http.get(this.APIURL+"isgDashboard/dropDownDataList?dropDownSource=project");
}

//get project list by company wise
getAllProjectsForCompany(companyId,userType){
  return this.http.get(this.APIURL+"isgDashboard/dropDownDataList?dropDownSource=project&userType="+userType+"&dropDownId='"+companyId+"'");
}

//Get country list by region wise
getCountriesByRegion(regionId){
  return this.http.get(this.APIURL+"isgDashboard/dropDownDataList?dropDownSource=country&dropDownId="+regionId);

}

//get All Forbes SubVertical By SubVertical
getAllForbesSubVerticalByVertical(verticalid){
  return this.http.get(this.APIURL+"isgDashboard/dropDownDataList?dropDownSource=forbesSubvertical&dropDownId="+verticalid);

  //return this.http.get("http://10.101.42.44:8080/isgDashboard/dropDownDataList?dropDownSource=forbesSubvertical&dropDownId="+verticalid);

}


}

