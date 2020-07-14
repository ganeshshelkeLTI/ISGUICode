import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import {
	ToastrService
} from 'ngx-toastr';
import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';
import { DatePipe } from '@angular/common';
import { KpiMaintenanceService } from '../services/kpi-maintenance.service';
import { RoleUserMappingServiceService } from '../services/admin/role-user-mapping-service.service';
import { SurveyValidationService } from '../services/survey-validation.service';
import { DigitalSharedService } from '../services/digital/digital-shared.service';
import { PrivilegesService } from '../services/privileges.service';
import { InactiveScenarioMaintenanceService } from '../services/inactive-scenario-maintenance/inactive-scenario-maintenance.service'
import { UpdateScenarioListNotificationServiceService } from '../services/update-scenario-list-notification-service.service';

@Component({
	selector: 'scenarioMaintenance',
	templateUrl: './inactive-survey-maintenance.component.html',
	styleUrls: ['./inactive-survey-maintenance.component.css']
})
export class InactiveSurveyMaintenanceComponent implements OnInit {

	public surveyQuestionJSON: any;

	public LoggedUserData: any;
	public sessionId: any;

	public emitter = new EventEmitter();

	public dataLoaded: boolean;
	public userData: any;
	public userFound: boolean = false;
	public showSscenarioData: boolean = false;
	public enableSave: boolean;
	public selectedUserData: any;

	public dashBoardList: any[] = [];
	public allScenarioList: any[] = [];
	public selectedDashBoardItem: any;

	userId: any;
	public roleId: string;
	userType: any;
	userKey: any;
	public isUserFetched: boolean = false;

	public showSurveyValidationPopup: boolean = false;

	message: string;

	public selectedDashboard: any;
	public selectedUserId: string;

	public isDeleteEnabled = false;
	public isRestoreEnabled = false;
	public userKeyDetails: string;
	public surveyStatusList: any;
	public adminEmail: any;
	public confirmDeleteBoxFlag: boolean = false;
	public confirmRestoreBoxFlag: boolean = false;

	public deleteWarningMessage: any;
	public selectAllcheckBox: boolean = false;
	//public restoreWarningMessage = "All selected scenarios will be restored. Do you wish to continue?";

	public validationErrorMessage: boolean = false;

	constructor(private toastr: ToastrService,
		private service: KpiMaintenanceService,
		private roleuserMappingService: RoleUserMappingServiceService,
		private loginDataBroadcastService: LoginDataBroadcastService,
		private surveyValidationService: SurveyValidationService,
		private digitalSharedService: DigitalSharedService,
		private privilegesService: PrivilegesService,
		private inactiveScenarioMaintenanceService: InactiveScenarioMaintenanceService,
		private updateScenarioListNotificationServiceService: UpdateScenarioListNotificationServiceService) {

		let object = this;

		let loginSharedData = object.loginDataBroadcastService.getEmitter();
		loginSharedData.on('setLoginData', function () {
			object.getUserLoginInfo();
		});
	}

	getUserLoginInfo() {
		let object = this;
		object.LoggedUserData = object.loginDataBroadcastService.get('userloginInfo');
		object.sessionId = object.LoggedUserData['userDetails']["sessionId"];

	}


	ngOnInit() {

		let object = this;

		object.deleteWarningMessage = "Selected scenarios will be deleted permenantly. Do you wish to continue?";
		object.LoggedUserData = object.loginDataBroadcastService.get('userloginInfo');
		object.sessionId = object.LoggedUserData['userDetails']["sessionId"];
		object.adminEmail = object.LoggedUserData['userDetails']["emailId"];

		object.enableSave = true;
		object.populateDashBoard();

		object.digitalSharedService.currentMessage.subscribe(message => this.message = message);
	}

	//display dashboard list
	populateDashBoard() {
		let object = this;
		object.service.getDashBoards().subscribe((response: any) => {

			object.dashBoardList = response;
			object.selectedDashBoardItem = object.dashBoardList[0];
			object.selectedDashboard = object.dashBoardList[0].dashboardID;
			object.selectedUserId = null;
			object.getAllInactiveScenarios();


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

	getAllInactiveScenarios() {
		let object = this;

		object.allScenarioList = [];

		//call different service for digital
		if (object.selectedDashboard == 14) {


			object.inactiveScenarioMaintenanceService.getDigitalInactiveScenarioList(object.selectedDashboard, object.selectedUserId).subscribe((response: any) => {


				//get scenario status list
				object.digitalSharedService.getGeneralInfoStructure('14').subscribe((dataresponse: any) => {

					//get survey status list
					object.surveyStatusList = dataresponse.userDataStatus;

					for (let obj of response) {
						let tempObj = {
							'createdBy': '',
							'createdDate': '',
							'dashboardId': '',
							'dataStatusId': '',
							'externalUserId': '',
							'internalUserId': '',
							'surveyId': '',
							'surveyName': '',
							'updatedBy': '',
							'UpdatedDate': '',
							'updatedDate': '',
							'userSurveyId': '',
							'checked': false,



						};

						//assign data status id
						for (let cnt = 0; cnt < object.surveyStatusList.length; cnt++) {
							console.log('obj.dataStatusId: ', obj.dataStatusId);
							console.log('object.surveyStatusList[cnt].id: ', object.surveyStatusList[cnt].id);
							if (Number(obj.dataStatusId) == Number(object.surveyStatusList[cnt].id)) {
								tempObj.dataStatusId = object.surveyStatusList[cnt].data_Status;
							}
						}

						//console.log('obj: ', obj);
						tempObj.createdBy = obj.createdBy;
						tempObj.createdDate = obj.createdDate;
						tempObj.dashboardId = obj.dashboardId;
						tempObj.externalUserId = obj.externalUserId;
						tempObj.internalUserId = obj.internalUserId;
						tempObj.surveyId = obj.surveyId;
						tempObj.surveyName = obj.surveyName;
						tempObj.updatedBy = obj.updatedBy;
						tempObj.UpdatedDate = obj.UpdatedDate;
						tempObj.updatedDate = obj.updatedDate;
						tempObj.userSurveyId = obj.userSurveyId;
						tempObj.checked = false;



						object.allScenarioList.push(tempObj);
						//console.log('temp obj: ', object.allScenarioList);

					}

					object.isDeleteEnabled = false;
					object.isRestoreEnabled = false;



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
		else//other dashboards
		{

			if(object.selectedDashboard==13)
			{
				object.selectedDashboard=12;	
			}


			object.inactiveScenarioMaintenanceService.getInactiveScenarioList(object.selectedDashboard, object.selectedUserId).subscribe((response: any) => {

			
				for (let obj of response) {
					let tempObj = {
						'clientID': '',
						'createdBy': '',
						'createdDate': '',
						'dashboardID': '',
						'id': '',
						'isActive': '',
						'projectId': '',
						'scenarioID': '',
						'scenarioName': '',
						'updatedBy': '',
						'updatedDate': '',
						'userId': '',
						'checked': false,

					};
					//console.log('obj: ', obj);
					tempObj.clientID = obj.clientID;
					tempObj.createdBy = obj.createdBy;
					tempObj.createdBy = obj.createdBy;
					tempObj.createdDate = obj.createdDate;
					tempObj.dashboardID = obj.dashboardID;
					tempObj.id = obj.id;
					tempObj.isActive = obj.isActive;
					tempObj.projectId = obj.projectId;
					tempObj.scenarioID = obj.scenarioID;
					tempObj.scenarioName = obj.scenarioName;
					tempObj.updatedBy = obj.updatedBy;
					tempObj.updatedDate = obj.updatedDate;
					tempObj.userId = obj.userId;
					tempObj.checked = false;



					object.allScenarioList.push(tempObj);
					//console.log('temp obj: ', object.allScenarioList);

				}

				object.isDeleteEnabled = false;
				object.isRestoreEnabled = false;


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




		object.showSscenarioData = true;



	}

	//checkbox check uncheck
	checkUncheckSenario(scenario) {
		let object = this;

		//enable disable delete, restore buttons
		let checkedCount = 0;
		let validatedCheckedCount =0;

		for (let obj of object.allScenarioList) {

			if (obj.checked == true) {
				if (object.selectedDashboard == 14) {
					//if survey status is Validated, deactivate Delete button
					if (obj.dataStatusId == 'Validated') {
						object.isDeleteEnabled = false;
						object.validationErrorMessage = true;
						validatedCheckedCount++;

					}
				}
				checkedCount++;
			}
			
		}

		if (checkedCount > 0) {
			if(validatedCheckedCount==0)
			{
				object.validationErrorMessage=false;
			}
			if (object.validationErrorMessage == true) {
				object.isDeleteEnabled = false;
			}
			else {
				object.isDeleteEnabled = true;
			}
			object.isRestoreEnabled = true;
			object.selectAllcheckBox = false;
		}
		else {
			object.isDeleteEnabled = false;
			object.isRestoreEnabled = false;
			object.validationErrorMessage = false;
		}


	}

	updateScenariodata() {
		let object = this;

		object.selectedUserId = null;
		object.selectedDashboard = object.selectedDashBoardItem.dashboardID;
		object.getAllInactiveScenarios();

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
			this.selectedUserId = null;
			this.getAllInactiveScenarios();
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

			if (this.selectedDashboard != 14) {
				this.selectedUserId = user.id;

				//on change of suggested user get soft deleted scenario list of user
				this.getAllInactiveScenarios();
			}
			else {
				//get user 16 digit id

				//this.selectedUserId = this.getUserId(this.userId)

				this.roleuserMappingService.searchUserById(this.userId).subscribe((data: any) => {

					let userData = data;
					this.selectedUserId = userData.staff[0].key;
					//on change of suggested user get soft deleted scenario list of user
					this.getAllInactiveScenarios();

				});




			}


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

	deleteScenarios() {
		let object = this;

		object.isDeleteEnabled = false;
		object.isRestoreEnabled = false;

		//get dashboard
		if (object.selectedDashboard == 14) {
			object.deleteActivateDigitalScenarioWS('delete');
		}
		else {
			object.deleteActivateScenarioWS('delete');
		}

	}

	activateScenarios() {
		let object = this;

		object.isDeleteEnabled = false;
		object.isRestoreEnabled = false;


		//get dashboard
		if (object.selectedDashboard == 14) {
			object.deleteActivateDigitalScenarioWS('activate');
		}
		else {
			object.deleteActivateScenarioWS('activate');
		}

	}

	deleteActivateScenarioWS(action) {
		let object = this;

		//create a request object
		let requestObject = {

			"adminId": object.adminEmail,
			"dashboardId": object.selectedDashboard,
			"action": action,
			"surveyIDList": []


		}

		//loop through scenario object

		for (let scenario of object.allScenarioList) {
			if (scenario.checked == true) {

				let tempObj = {
					"scenarioId": scenario.scenarioID,
					"userId": scenario.createdBy
				}

				requestObject.surveyIDList.push(tempObj);
			}


		}

		console.log('request object: ', requestObject);

		//call web service
		object.inactiveScenarioMaintenanceService.restoreDeleteScenario(requestObject).subscribe(response => {

			let message;

			if (action == 'activate') {
				message = "Selected scenarios are restored successfully.";
			}
			else {
				message = "Selected scenarios are deleted successfully.";
			}

			//show success message
			object.toastr.info(message, '', {
				timeOut: 2000,
				positionClass: 'toast-top-center'

			});

			//refresh page
			object.getAllInactiveScenarios();

			//uncheck select all if checked
			object.selectAllcheckBox = false;

			//hide warning message
			object.validationErrorMessage=false;

		}, (error) => {

			object.toastr.error('Some unexpected Error have occurred', 'Error', {
				timeOut: 2000
			});

			//throw custom exception to global error handler
			//create error object
			let errorObj = {
				"dashboardId": "NA",
				"pageName": "Admin Role User mapping Screen",
				"errorType": "fatal",
				"errorTitle": "Web Service Error",
				"errorDescription": error.message,
				"errorObject": error
			}
			throw errorObj;
		});

	}

	deleteActivateDigitalScenarioWS(action) {
		let object = this;

		//create a request object
		let requestObject = {

			"adminId": object.adminEmail,
			"dashboardId": object.selectedDashboard,
			"action": action,
			"surveyIDList": []


		}

		//loop through scenario object

		for (let scenario of object.allScenarioList) {
			if (scenario.checked == true) {

				console.log('scenario to delete/restore: ', scenario);

				let tempObj = {
					"surveyId": scenario.surveyId,
					"userId": scenario.createdBy
				}

				requestObject.surveyIDList.push(tempObj);
			}


		}

		console.log('request object: ', requestObject);

		//call web service
		object.inactiveScenarioMaintenanceService.restoreDeleteDigitalScenario(requestObject).subscribe(response => {

			let message;

			if (action == 'activate') {
				message = "Selected scenarios are restored successfully.";
			}
			else {
				message = "Selected scenarios are deleted successfully.";
			}

			//show success message
			object.toastr.info(message, '', {
				timeOut: 2000,
				positionClass: 'toast-top-center'

			});

			//refresh page
			object.getAllInactiveScenarios();

			//uncheck select all if checked
			object.selectAllcheckBox = false;

			//hide warning message
			object.validationErrorMessage=false;

			object.updateScenarioListNotificationServiceService.getEmitter().emit('updateDigitalScenarioListAfterDeletion');

		}, (error) => {

			object.toastr.error('Some unexpected Error have occurred', 'Error', {
				timeOut: 2000
			});

			//throw custom exception to global error handler
			//create error object
			let errorObj = {
				"dashboardId": "NA",
				"pageName": "Admin Role User mapping Screen",
				"errorType": "fatal",
				"errorTitle": "Web Service Error",
				"errorDescription": error.message,
				"errorObject": error
			}
			throw errorObj;
		});

	}

	showDeletePopup() {
		let object = this;

		object.confirmDeleteBoxFlag = true;

	}

	// showRestorePopup()
	// {
	// 	let object = this;

	// 	object.confirmRestoreBoxFlag = true;

	// }

	deleteConfirmYes(flag) {
		let object = this;

		if (flag == true) {
			object.deleteScenarios();
			object.confirmDeleteBoxFlag = false;
		}
		else {
			object.confirmDeleteBoxFlag = false;
		}

	}

	// restoreConfirmYes(flag)
	// {
	// 	let object = this;

	// 	if(flag==true)
	// 	{
	// 		object.activateScenarios();
	// 		object.confirmRestoreBoxFlag=false;
	// 	}
	// 	else
	// 	{
	// 		object.confirmRestoreBoxFlag=false;
	// 	}

	// }

	selectAllScenarios(event) {
		let object = this;

		if (event.target.checked == true) {
			//check all scenarios
			for (let obj of object.allScenarioList) {

				if (object.selectedDashboard == 14) {
					//if survey status is Validated, deactivate Delete button
					if (obj.dataStatusId == 'Validated') {
						object.isDeleteEnabled = false;
						object.validationErrorMessage = true;

					}
				}

				obj.checked = true;
				object.isDeleteEnabled = true;
				object.isRestoreEnabled = true;
				object.selectAllcheckBox = true;


			}

			if (object.validationErrorMessage == true) {
				object.isDeleteEnabled = false;
			}

		}
		else {
			//uncheck all scenarios
			for (let obj of object.allScenarioList) {

				obj.checked = false;
				object.isDeleteEnabled = false;
				object.isRestoreEnabled = false;
				object.selectAllcheckBox = false;
				object.validationErrorMessage = false;
			}
		}


	}
}
