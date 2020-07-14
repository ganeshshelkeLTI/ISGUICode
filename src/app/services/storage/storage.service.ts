import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { INFRAURLProperties } from '../../../properties/infra-url-properties';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private APIURL:string;
  private STORAGE_DEFAULT_LANDING_DATA:string;
  constructor(private http:HttpClient) {
    this.APIURL = environment.apiUrl;
    this.STORAGE_DEFAULT_LANDING_DATA = INFRAURLProperties.STORAGE_DEFAULT_LANDING_DATA;
  }
  getData():Observable<any>{
    return this.http.get(this.APIURL+this.STORAGE_DEFAULT_LANDING_DATA);
  }
}
