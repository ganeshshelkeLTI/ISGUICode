import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { INFRAURLProperties } from '../../../properties/infra-url-properties';

@Injectable({
  providedIn: 'root'
})
export class ServicedeskService {
  private APIURL:string;
  private SERVICE_DESK_DEFAULT_LANDING_DATA:string;
  
  constructor(private http:HttpClient) {
    this.APIURL = environment.apiUrl;
    this.SERVICE_DESK_DEFAULT_LANDING_DATA = INFRAURLProperties.SERVICE_DESK_DEFAULT_LANDING_DATA
   }
  getData():Observable<any>{
    return this.http.get(this.APIURL+this.SERVICE_DESK_DEFAULT_LANDING_DATA);
  }
}
