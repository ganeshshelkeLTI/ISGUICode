/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:global-error-handler-service.ts **/
/** Description: This file is created to Handle exceptions generated across application and send them to server for documentation purpose **/
/** Created By: 10650919  Created Date: 01/10/2018 **/
/** Update By:  10650919  Update Date:  01/10/2018 **/
/** Developed at:  **/
/*******************************************************/

import {ErrorHandler, Injectable} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClient, HttpParams } from '@angular/common/http';
//import { environment } from '/../environments/environment';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
	providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler{

	public dashboardId:any;
	public errorTitle:any;
	public errorDescription:any;
	public pageName: any;
	public errorType: any;
	public errorPayload:any;
	public inputParams:any=[];
	private APIURL:string;

	constructor(private http:HttpClient) {
		this.APIURL = environment.apiUrl;
	  }

	handleError(error:any) {

		//get attributes from error objects

		if(error.dashboardId==undefined || error.dashboardId=='' || error.dashboardId==null)
		{
			//set NA
			this.dashboardId ='NA';
		}
		else
		{
			this.dashboardId =error.dashboardId;
		}

		if(error.pageName==undefined || error.pageName=='' || error.pageName==null)
		{
			//set NA
			this.pageName ='NA';
		}
		else
		{
			this.pageName =error.pageName;
		}

		if(error.errorTitle==undefined || error.errorTitle=='' || error.errorTitle==null)
		{
			//set NA
			this.errorTitle ='NA';
		}
		else
		{
			this.errorTitle =error.errorTitle;
		}

		if(error.errorType==undefined || error.errorType=='' || error.errorType==null)
		{
			//set NA
			this.errorType ='NA';
		}
		else
		{
			this.errorType =error.errorType;
		}

		if(error.errorDescription==undefined || error.errorDescription=='' || error.errorDescription==null)
		{
			//set NA
			this.errorDescription ='NA';
		}
		else
		{
			this.errorDescription =error.errorDescription;
		}

		if(error.errorObject==undefined || error.errorObject=='' || error.errorObject==null)
		{
			//set NA
			this.errorPayload ='NA';
		}
		else
		{
			this.errorPayload =error.errorObject;
		}

		if(error.message!=undefined && error.message!='' && error.message!=null)
		{
				this.errorType='warn';
				this.errorTitle='Client Side Data Error'
				this.errorDescription = error.message;
		}

		//console error details
		// console.warn("Dashboard Id: ", this.dashboardId);
		// console.warn("Page Name: ", this.pageName);
		// console.warn("Error Type: ", this.errorType);
		// console.warn("Error Title: ", this.errorTitle);
		// console.warn("Error Description: ", this.errorDescription);
		console.log(error);

		this.inputParams = {
		"dashboardId" : Number(this.dashboardId),
		"pageName": this.pageName,
		"errorType": this.errorType,
		"errorTitle": this.errorTitle,
		"errorDescription": this.errorDescription
		};


		//if error type is fatal, show roastr

		//call web service to document error details on server

		//ToDo.. 

		//return this.http.post(this.APIURL+"/isgDashboard/log",this.inputParams).subscribe((data)=>{

		//},(error)=>{
			//console.warn("Logger Error: "+error.message);
		//});


	}

	// public logExceptions(inputPramas:object)
	// {
	// 	//alert("http://10.101.42.44:8080/isgDashboard/log"+inputPramas);
	// 	//return this.http.get(this.APIURL+"/isgDashboard/log",inputPramas);
	// 	return this.http.post("http://10.101.42.44:8080/isgDashboard/log",inputPramas);
	// 	console.log('hit');
	// }


}
