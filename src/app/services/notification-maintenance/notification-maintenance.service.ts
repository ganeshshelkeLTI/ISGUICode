import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonURLProperties } from '../../../properties/common-url-properties';
import { NotificationMaintainanceURLProperties } from '../../../properties/notification-maintenance-url-properties';


@Injectable({
  providedIn: 'root'
})
export class NotificationMaintenanceService {

  private APIURL:string;
  private SAVE_WEBSERVICE_URL: string;
  private FETCH_WEBSERVICE_URL: string;

  constructor(private http:HttpClient) {

    this.APIURL = environment.apiUrl;
    this.SAVE_WEBSERVICE_URL = NotificationMaintainanceURLProperties.SAVE_WEBSERVICE_URL;
    this.FETCH_WEBSERVICE_URL = NotificationMaintainanceURLProperties.FETCH_WEBSERVICE_URL;
   }

   public saveNotificationDetails(data)
   {
    return this.http.post(this.APIURL+this.SAVE_WEBSERVICE_URL,data);
   }

   public fetchNotificationDetails(){
     return this.http.get(this.APIURL+this.FETCH_WEBSERVICE_URL);
   }

}
