import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { INFRAURLProperties } from '../../../properties/infra-url-properties';


@Injectable({
  providedIn: 'root'
})
export class ApplicationDevelopmentService {

  private APIURL:string;
  private APPLICATION_DEVELOPMENT_DEFAULT_LANDING_DATA:string;
  private APPLICATION_DEVELOPMENT_FILTERED_LANDING_DATA:string;
  

  constructor(private http:HttpClient) { 
    this.APIURL = environment.apiUrl;
    this.APPLICATION_DEVELOPMENT_DEFAULT_LANDING_DATA = INFRAURLProperties.APPLICATION_DEVELOPMENT_DEFAULT_LANDING_DATA
    //this.APPLICATION_DEVELOPMENT_FILTERED_LANDING_DATA = INFRAURLProperties.APPLICATION_DEVELOPMENT_FILTERED_LANDING_DATA
  }

  
  getData():Observable<any>{
    return this.http.get(this.APIURL+this.APPLICATION_DEVELOPMENT_DEFAULT_LANDING_DATA);
  }

}

