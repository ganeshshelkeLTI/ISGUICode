import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class Interceptor implements HttpInterceptor {
  intercept(request: HttpRequest < any > , next: HttpHandler): Observable < HttpEvent < any >> {

    let currentUser = JSON.parse(localStorage.getItem('userloginInfo'));
    // console.log(currentUser.sessionId);
    if (currentUser !== null && currentUser !== undefined) {
      request = request.clone({
        setParams: {
          sessionId: currentUser.userDetails.sessionId
        }
      });
    }
    return next.handle(request);
  }
}
