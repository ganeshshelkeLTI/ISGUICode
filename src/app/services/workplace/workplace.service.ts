import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { INFRAURLProperties } from '../../../properties/infra-url-properties';

@Injectable({
  providedIn: 'root'
})
export class WorkplaceService {
  private APIURL:string;
  private WORKPLACE_SERVICES_DEFAULT_LANDING_DATA:string;
  constructor(private http:HttpClient) {
    this.APIURL = environment.apiUrl;
    this.WORKPLACE_SERVICES_DEFAULT_LANDING_DATA = INFRAURLProperties.WORKPLACE_SERVICES_DEFAULT_LANDING_DATA;
  }
  getData():Observable<any>{
    return this.http.get(this.APIURL+this.WORKPLACE_SERVICES_DEFAULT_LANDING_DATA);
  }
}
