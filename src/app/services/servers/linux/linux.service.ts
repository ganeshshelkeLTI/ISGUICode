import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { INFRAURLProperties } from '../../../../properties/infra-url-properties';

@Injectable({
  providedIn: 'root'
})
export class LinuxService {
  private APIURL:string;
  private LINUX_DEFAULT_LANDING_DATA:string;
  private LINUX_DEFINATION_DATA:string;
  
  constructor(private http:HttpClient) {
    this.APIURL = environment.apiUrl;
    this.LINUX_DEFAULT_LANDING_DATA = INFRAURLProperties.LINUX_DEFAULT_LANDING_DATA;
    this.LINUX_DEFINATION_DATA = INFRAURLProperties.LINUX_DEFINATION_DATA;
  }
  getData():Observable<any>{
    return this.http.get(this.APIURL+this.LINUX_DEFAULT_LANDING_DATA);
  }

  getDefinition():Observable<any> {
   return this.http.get(this.APIURL+this.LINUX_DEFINATION_DATA);
  }
}
