import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { checkAndUpdateDirectiveDynamic } from '@angular/core/src/view/provider';
import { INFRAURLProperties } from '../../properties/infra-url-properties';


@Injectable({
  providedIn: 'root'
})
export class TokenAuthenticationService {

  private APIURL:string;
  private tokenId;
  private state;
  private code;
  public loginData:any;

  constructor(private http:HttpClient) {
    this.APIURL = environment.apiUrl;
   }

   setParameters(tokenid, state, code)
   {
      this.tokenId=tokenid;
      this.state=state;
      this.code=code;
   }

   public authenticateToken(data) {


    return this.http.post(this.APIURL+'isgDashboard/validateUser', data);

    //return this.http.post('http://10.101.42.44:8080/isgDashboard/validateUser', data);
   }
   

}
