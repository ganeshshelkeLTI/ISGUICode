import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { INFRAURLProperties } from '../../../../properties/infra-url-properties';

@Injectable({
  providedIn: 'root'
})
export class UnixServiceService {
  private APIURL:string;
  private UNIX_DEFAULT_LANDING_DATA:string;
  constructor(private http:HttpClient) {
    this.APIURL = environment.apiUrl;
    this.UNIX_DEFAULT_LANDING_DATA = INFRAURLProperties.UNIX_DEFAULT_LANDING_DATA;
   }

  getData():Observable<any>{
    return this.http.get(this.APIURL+this.UNIX_DEFAULT_LANDING_DATA);
  }
}
