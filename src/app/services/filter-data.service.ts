import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CIOURLProperties } from '../../properties/cio-url-properties';

@Injectable({
  providedIn: 'root'
})
export class FilterDataService {
  
  private APIURL:string;
  private CIO_FILTER_KPI_DATA:string;
  constructor(private http:HttpClient) {
      this.APIURL = environment.apiUrl;
      this.CIO_FILTER_KPI_DATA = CIOURLProperties.CIO_FILTER_KPI_DATA;
  }

   //Get CIO Dashboard data with filter value
  getFilterData(filter:string,filterValue:string):Observable<any>{
      const params = new HttpParams().set('filter',filter).set('filterValue', filterValue);
      return this.http.get(this.APIURL+this.CIO_FILTER_KPI_DATA+"?filter="+filter+"&value="+filterValue);
  }

}
