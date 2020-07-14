import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CIOURLProperties } from '../../properties/cio-url-properties';

@Injectable({
  providedIn: 'root'
})
export class DropDownService {
  
  private APIURL:string;
  private CIO_INDUSTRY_FILTER_DROPDOWN_DATA:string;
  private CIO_REGION_FILTER_DROPDOWN_DATA:string;
  private CIO_REVENUE_FILTER_DROPDOWN_DATA:string;
  private CIO_CURRENCY_FILTER_DROPDOWN_DATA:string;
  
  constructor(private http:HttpClient) { 
    this.APIURL = environment.apiUrl;
    this.CIO_INDUSTRY_FILTER_DROPDOWN_DATA = CIOURLProperties.CIO_INDUSTRY_FILTER_DROPDOWN_DATA;
    this.CIO_REGION_FILTER_DROPDOWN_DATA = CIOURLProperties.CIO_REGION_FILTER_DROPDOWN_DATA;
    this.CIO_REVENUE_FILTER_DROPDOWN_DATA = CIOURLProperties.CIO_REVENUE_FILTER_DROPDOWN_DATA;
    this.CIO_CURRENCY_FILTER_DROPDOWN_DATA = CIOURLProperties.CIO_CURRENCY_FILTER_DROPDOWN_DATA;
  }


  //Get all Industry list
  public getIndustry(){
    return this.http.get(this.APIURL+this.CIO_INDUSTRY_FILTER_DROPDOWN_DATA);
  }
  
  //Get all Region list
  public getRegions(){
  return this.http.get(this.APIURL+this.CIO_REGION_FILTER_DROPDOWN_DATA);
  }

  //Get all Currency Exchange list
  public getCurrency(){
    return this.http.get(this.APIURL+this.CIO_CURRENCY_FILTER_DROPDOWN_DATA);
  }

  //Get all Revenue list
  public getRevenue(){
  return this.http.get(this.APIURL+this.CIO_REVENUE_FILTER_DROPDOWN_DATA);
  }

}
