import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CIOURLProperties } from '../../properties/cio-url-properties';
import { INFRAURLProperties } from '../../properties/infra-url-properties';

@Injectable({
  providedIn: 'root'
})
export class CioDashboardService {


  private APIURL:string;
  private CIO_DEFAULT_LANDING_DATA:string;
  private CIO_DEFINATION_DATA:string;

  constructor(private http:HttpClient) {
      this.APIURL = environment.apiUrl;
      this.CIO_DEFAULT_LANDING_DATA = CIOURLProperties.CIO_DEFAULT_LANDING_DATA;
      this.CIO_DEFINATION_DATA = INFRAURLProperties.CIO_DEFINATION_DATA;
  }

  getCIODefinitionData():Observable<any> {
    return this.http.get(this.APIURL+this.CIO_DEFINATION_DATA);
  }

  //load default data once CIO dashboard open
  getData():Observable<any>{
    return this.http.get(this.APIURL+this.CIO_DEFAULT_LANDING_DATA);
  }
}
