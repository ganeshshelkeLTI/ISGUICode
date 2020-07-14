import { Component, EventEmitter, OnInit,Output, Input } from '@angular/core';
import {
	ToastrService
} from 'ngx-toastr';
import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';
import { DatePipe } from '@angular/common';
import { KpiMaintenanceService } from '../services/kpi-maintenance.service';
import { RoleUserMappingServiceService } from '../services/admin/role-user-mapping-service.service';
import { SurveyValidationService } from '../services/survey-validation.service';
import { DigitalSharedService }from '../services/digital/digital-shared.service';
import { PrivilegesService } from '../services/privileges.service';
//import { EventEmitter } from '@angular/core';
// import { Router } from '@angular/router'

@Component({
	selector: 'app-survey-validation',
	templateUrl: './survey-validation.component.html',
	styleUrls: ['./survey-validation.component.css']
})
export class SurveyValidationComponent implements OnInit {

	public surveyQuestionJSON: any;

	public LoggedUserData: any;
	public sessionId: any;

	public emitter = new EventEmitter();

	public dataLoaded: boolean;
	public userData: any;
	public userFound: boolean = false;
	public showSurveyData: boolean = false;
	public enableSave: boolean;
	public selectedUserData: any;

	public dashBoardList: any[] = [];
	public allSurveyList: any[] = [];
	public selectedDashBoardItem: any;

	userId: any;
	public roleId: string;
	userType: any;
	userKey: any;
	public isUserFetched: boolean = false;

	public showSurveyValidationPopup: boolean =false;

	message:string;


	@Output() messageEvent = new EventEmitter<string>();
	@Output() flagEvent = new EventEmitter<boolean>();

	constructor(private toastr: ToastrService,
		private service: KpiMaintenanceService,
		private roleuserMappingService: RoleUserMappingServiceService,
		private loginDataBroadcastService: LoginDataBroadcastService,
		private surveyValidationService: SurveyValidationService,
		private digitalSharedService: DigitalSharedService,
		private privilegesService: PrivilegesService,
		// private routeconfig: Router
	) {
		let object = this;

		//refresh records after survey status update
		object.digitalSharedService.getEmitter().on('surveyStatusUpdated', function () {
	   
			
			if(object.userData!=undefined) //if user surveys are selected
			{
				object.getSurveyValidationListByUser();
			}
			else //if all surveys are selected
			{
				object.getSurveyValidationList();
			}

		  
		 });
	 

		let loginSharedData = object.loginDataBroadcastService.getEmitter();
		loginSharedData.on('setLoginData', function () {
			object.getUserLoginInfo();
		});

		//on survey status update refresh records
		// if(object.message=='surveyStatusUpdate'){
		// 	alert('update');

		// 	if(object.userFound==true)
		// 	{
		// 		object.getSurveyValidationListByUser();
		// 	}
		// }
		
	}

	surveyId:any;
	goToSurveyValidate(surveyData) {

		let object =this;
		
		object.surveyId = surveyData;
		var surveyid = object.surveyId.surveyId;
		object.digitalSharedService.setSurveyId(surveyid);
		object.digitalSharedService.setSurveyName(object.surveyId.surveyName);

		//get selected survey question data

    //web service call here

    object.digitalSharedService.getSurveyDataById('14', surveyid).subscribe((response: any) => {

        object.surveyQuestionJSON = response;

		
		//set to service
		object.digitalSharedService.setsurveyQuestionJSON(object.surveyQuestionJSON);


    }, (error) => {
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
            "dashboardId": '14',
            "pageName": "Non CIO Service Desk Tower Input My Data Screen",
            "errorType": "Fatal",
            "errorTitle": "Web Service Error",
            "errorDescription": error.message,
            "errorObject": error
        }

        throw errorObj;
    });


		//let emitter: EventEmitter = object.digitalSharedService.getEmitter();

		//emitter.setMaxListeners(40);
		
		object.showSurveyValidationPopup=true;

		object.digitalSharedService.changeMessage('surveySelection');

		object.digitalSharedService.getEmitter().emit('StartSurveyValidation');
		
	}

	getUserLoginInfo() {
		let object = this;
		object.LoggedUserData = object.loginDataBroadcastService.get('userloginInfo');
		object.sessionId = object.LoggedUserData['userDetails']["sessionId"];
	}

	ngOnInit() {
		let object = this;
		object.LoggedUserData = object.loginDataBroadcastService.get('userloginInfo');
		object.sessionId = object.LoggedUserData['userDetails']["sessionId"];

		object.enableSave = true;
		object.populateDashBoard();

		object.digitalSharedService.currentMessage.subscribe(message => this.message = message);

	
	}

	//display dashboard list
	populateDashBoard() {
		let object = this;
		object.service.getDashBoards().subscribe((response: any) => {

			object.dashBoardList = response;
			object.dashBoardList = object.dashBoardList.splice(13, 1);
			object.selectedDashBoardItem = object.dashBoardList[0];
			// object.getAllCustomRefGroup();
			console.log('object.dashBoardList', object.dashBoardList);

			this.getSurveyValidationList();

		}, (error) => {
			let errorObj = {
				"dashboardId": "NA",
				"pageName": "Admin Custom Reference Group User mapping Screen",
				"errorType": "Fatal",
				"errorTitle": "Web Service Error",
				"errorDescription": error.message,
				"errorObject": error
			}

			throw errorObj;
		})
	}

	//get user list
	suggestUserId(roleId, event) {
		if (event.target.value != undefined && event.target.value != null && event.target.value.length >= 2) {
			console.log("in loop");
			//call web serivce to get data
			this.roleuserMappingService.searchUserById(event.target.value).subscribe((data: any) => {

				this.userData = data;
				if (this.userData.staff.length > 0) {
					this.userFound = true;
				}
				else {
					this.userFound = false;
				}

			}, (error) => {
				//create error object
				let errorObj = {
					"dashboardId": "NA",
					"pageName": "Admin Custom Reference Group User mapping Screen",
					"errorType": "Fatal",
					"errorTitle": "Web Service Error",
					"errorDescription": error.message,
					"errorObject": error
				}

				throw errorObj;
			});
		}

		if (event.target.value.length < 2) {
			this.userFound = false;
		}
	}

	//get data of selected user
	selectUser(user) {
		try {
			//on selection of suggested user, hide suggestion container

			this.userFound = false;
			this.userType = user.value;
			this.roleId = user.id;
			this.userId = user.id;
			this.userKey = user.key;
			this.selectedUserData = user;
			this.isUserFetched = true;

			this.surveyValidationService.setUserType(this.userType);
			this.surveyValidationService.setDashboardId(this.selectedDashBoardItem.dashboardID);

			//on change of suggested user get survey list of user
			// this.getSurveyVlidationList();
			this.getSurveyValidationListByUser();
		}
		catch (error) {
			//throw custom exception to global error handler
			//create error object
			let errorObj = {
				"dashboardId": "NA",
				"pageName": "Admin Custom Reference Group User mapping Screen",
				"errorType": "warn",
				"errorTitle": "Data Error",
				"errorDescription": error.message,
				"errorObject": error
			}
		}
	}


	getSurveyValidationList() {
		let object = this;
		object.allSurveyList = [];
		object.surveyValidationService.fetchSurveyList(object.selectedDashBoardItem.dashboardID).subscribe((data) => {
			object.showSurveyData = true;
			let surveyList: any;
			surveyList = data;
			for (let survey of surveyList) {
				object.allSurveyList.push(survey);
			}
			console.log("syrrvList", object.allSurveyList);
			object.getSurveyValidationListByUser();
		});

	}

	getSurveyValidationListByUser() {

		let object = this;
		if ((object.userId != null && object.userId != '' && object.userId != undefined) && (object.userType != '' && object.userType != null && object.userType != undefined) && (object.selectedDashBoardItem.dashboardID != null && object.selectedDashBoardItem.dashboardID != '' && object.selectedDashBoardItem.dashboardID != undefined)) {
			object.surveyValidationService.fetchSurveyListByUserId(object.userId, object.userType, object.selectedDashBoardItem.dashboardID).subscribe((data) => {
				object.showSurveyData = true;
				object.allSurveyList = [];

				let surveyList: any;
				surveyList = data;
				for (let survey of surveyList) {
					object.allSurveyList.push(survey);
					console.log("survey data", object.allSurveyList);
				}
			})
		}
		else {
			console.log("length of surveys is null");
			// object.showSurveyData=false;
		}
	}

	//get survey list on change of dashboard
	updateKpidata() {
		let object = this;
		object.getSurveyValidationList();
		object.getSurveyValidationListByUser();


	}

	ngOnDestroy(){
		this.digitalSharedService.getEmitter().removeAllListeners();
		this.privilegesService.getEmitter().removeAllListeners();
	  }
}
