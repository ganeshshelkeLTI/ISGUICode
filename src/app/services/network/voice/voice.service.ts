import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { INFRAURLProperties } from '../../../../properties/infra-url-properties';

@Injectable({
  providedIn: 'root'
})
export class VoiceService {
  private APIURL:string;
  private VOICE_DEFAULT_LANDING_DATA:string;
  constructor(private http:HttpClient) {
    this.APIURL = environment.apiUrl;
    this.VOICE_DEFAULT_LANDING_DATA = INFRAURLProperties.VOICE_DEFAULT_LANDING_DATA
  }
  getData():Observable<any>{
    return this.http.get(this.APIURL+this.VOICE_DEFAULT_LANDING_DATA);
  }
}
