import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { INFRAURLProperties } from '../../../properties/infra-url-properties';

@Injectable({
  providedIn: 'root'
})
export class MainframelandingService {

  private APIURL:string;
  private MAINFRAME_DEFAULT_LANDING_DATA:string;
  constructor(private http:HttpClient) {
    this.APIURL = environment.apiUrl;
    this.MAINFRAME_DEFAULT_LANDING_DATA = INFRAURLProperties.MAINFRAME_DEFAULT_LANDING_DATA;
  }

  // this will load default landing page with dynamic data
  getData():Observable<any>{
    return this.http.get(this.APIURL+this.MAINFRAME_DEFAULT_LANDING_DATA);
  }
}
