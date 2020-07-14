import { Component, OnInit, Input } from '@angular/core';
import {
	ToastrService
} from 'ngx-toastr';
import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';
import { DatePipe } from '@angular/common';
import { RoleUserMappingServiceService } from '../services/admin/role-user-mapping-service.service';
import { RoleMasterService } from '../services/admin/role-master.service';
import { KpiMaintenanceService } from '../services/kpi-maintenance.service';
import { EventEmitter } from 'events';
import { CustomRefGroupService } from '../services/custom-ref-group/custom-ref-group.service';

@Component({
	selector: 'customReferenceRoleUserMapping',
	templateUrl: './customrefence-group-user-mapping.component.html',
	styleUrls: ['./customrefence-group-user-mapping.component.css']
})
export class CustomrefenceGroupUserMappingComponent implements OnInit {

	public LoggedUserData: any;
	public sessionId: any;

	private dataLoaded: boolean;
	public userData: any;
	public userFound: boolean = false;
	public selectedUserData: any;
	public roleId: string;
	public isUserFetched: boolean = false;
	public isSaveDisabled: boolean = true;

	public dashBoardList: any[] = [];
	public dashboardDropDownLoaded: boolean;
	public selectedDashBoardItem: any;
	public enableSave: boolean;
	public notify: EventEmitter = new EventEmitter();//this is event Emitter emitted on
	public customRefGroupData: any[] = [];
	public mappedCustomReferenceGroup: any[] = [];
	public allCustomRefGroupList: any;
	display_confirmationbox = 'none';
	selecteduserCustomId:any;
	displayCRGData: boolean = false;
	userId: any;
	userType: any;
	userKey: any;
	selectedCustomId:any;

	public saveMappingMessage: any;

	constructor(private toastr: ToastrService, private service: KpiMaintenanceService, private roleuserMappingService: RoleUserMappingServiceService, private roleService: RoleMasterService, private loginDataBroadcastService: LoginDataBroadcastService, private crgService: CustomRefGroupService) {
		let object = this;
		let loginSharedData = object.loginDataBroadcastService.getEmitter();
		loginSharedData.on('setLoginData', function () {
			object.getUserLoginInfo();
		})
	}

	getUserLoginInfo() {
		let object = this;
		object.LoggedUserData = object.loginDataBroadcastService.get('userloginInfo');
		object.crgService.setUserEmail(object.LoggedUserData['userDetails']['emailId']);
		object.sessionId = object.LoggedUserData['userDetails']["sessionId"];
	}

	ngOnInit() {
		let object = this;
		object.display_confirmationbox = 'none';
		object.dataLoaded = false;
		object.LoggedUserData = object.loginDataBroadcastService.get('userloginInfo');
		object.sessionId = object.LoggedUserData['userDetails']["sessionId"];

		object.enableSave = true;
		object.populateDashBoard();


		object.notify.on('dataLoadedSuccessFully', function () {

		});
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
			this.roleId = user.id;
			this.userType = user.value;
			this.userId = user.id;
			this.userKey = user.key;
			this.selectedUserData = user;
			this.isUserFetched = true;

			this.crgService.setUserType(this.userType);
			this.crgService.setDashboardId(this.selectedDashBoardItem.dashboardID);
			
			//on change of suggested user get mapped custom ref group of user
			// this.getCustomReferenceGroupData();
			this.getAllCustomRefGroup();
			//this.getMappedCRGsForUser();
			this.validateSaveButton();
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

	getMappedCRGsForUser()
	{

	}


	validateSaveButton() {

		//check button disable validation
		if (this.isUserFetched == true) {
			this.isSaveDisabled = false;
		}
		else {
			this.isSaveDisabled = true;
		}
	}

	//get custom reference group on change of dashboard
	updateKpidata() {
		let object = this;
		object.getCustomReferenceGroupData();
		object.getAllCustomRefGroup();
		

	}

	//display dashboard list
	populateDashBoard() {
		let object = this;
		object.service.getDashBoards().subscribe((response: any) => {




			object.dashBoardList = response;
			object.selectedDashBoardItem = object.dashBoardList[0];
			object.getAllCustomRefGroup();
			console.log('object.dashBoardList', object.dashBoardList);
			

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

	//on change of suggested user get mapped custom ref group of user
	getCustomReferenceGroupData() {
		let object = this;
		if((object.userId != null && object.userId != '' && object.userId != undefined) &&(object.userType != '' && object.userType != null && object.userType != undefined) && (object.selectedDashBoardItem.dashboardID != null && object.selectedDashBoardItem.dashboardID != '' && object.selectedDashBoardItem.dashboardID != undefined)){
			object.crgService.getSelectedCustomRefGroup(object.userId,object.userType,object.selectedDashBoardItem.dashboardID).subscribe((data) => {
				
				let response: any = data;

				console.log('user CRG mapping list: ',response);

				object.customRefGroupData = response;
				if(object.customRefGroupData.length != 0  && object.customRefGroupData != undefined && object.customRefGroupData != null){
					for (let crg of object.customRefGroupData) {
						let index = 0;
						while (index != object.allCustomRefGroupList.length) {
							console.log("before if loop",object.allCustomRefGroupList[index].customId);
							console.log("selected one",crg.groupList[0].key);
							if (object.allCustomRefGroupList[index].customId == crg.groupList[0].key) {
								console.log("i m inside if block");
								object.allCustomRefGroupList[index].checked = true;
							}
							object.allCustomRefGroupList[index].updatedDate = object.allCustomRefGroupList[index].UpdatedDate;
			
							index++;
						}
					}
					object.displayCRGData = true;
					console.log("updated Data",object.allCustomRefGroupList)
				}else{
					let index = 0;
					while(index != object.allCustomRefGroupList.length){
						if(object.allCustomRefGroupList[index].checked == true){
							object.allCustomRefGroupList[index].checked  = false;
						}
						object.allCustomRefGroupList[index].updatedDate = object.allCustomRefGroupList[index].UpdatedDate;
						index ++;
					}
					object.displayCRGData = false;
				}
			});
		}


	}

	//get all custom reference group according to selected dashboard id
	getAllCustomRefGroup() {
		let object = this;
		object.allCustomRefGroupList = [];
		object.crgService.getCustomRefGroupList(object.selectedDashBoardItem.dashboardID).subscribe((data) => {
			let customRefGroupList: any;
			customRefGroupList = data;
			for (let customeRefGroup of customRefGroupList) {
				customeRefGroup.checked = false;
				object.allCustomRefGroupList.push(customeRefGroup);
			}
			object.getCustomReferenceGroupData();
		});
	}

	//update selected custom reference group 
	updateSelectedCustomRefGroup(customRefGroup, event) {

		try {
			let object = this;

			if (event.target.checked == true) {
				
				for (let obj of object.allCustomRefGroupList) {
					if (obj.customId == customRefGroup.customId) {
						obj.checked = true;
					}

				}


			} else {
				for (let obj of object.allCustomRefGroupList) {
					if (obj.customId == customRefGroup.customId) {
						obj.checked = false;
					}

				}

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
			throw errorObj;
		}

		this.validateSaveButton();

	}

	//save updated crg data which is mapped or unmapped
	saveMappedData() {
		let object = this;
		let data = {
			// "dashboardId": object.selectedDashBoardItem.dashboardID,
			"userId": object.userKey,
			"userType": object.userType,
			"groupList": object.allCustomRefGroupList
		}
		console.log("saved data", data);
		object.crgService.saveCustomRefData(data).subscribe((response)=>{
			
			object.saveMappingMessage = response;

			var message = ''+object.saveMappingMessage.value;

			//console.log('object.saveMappingMessage: ',message);

			this.toastr.info('' +message+" " + '', '', {
				timeOut: 7000,
				positionClass: 'toast-top-center'
			  });

			object.getCustomReferenceGroupData();
		})
		
	}

	resetBtnHandler(userCustomId,customId){
		let object = this;
		object.display_confirmationbox = 'block';
		object.selecteduserCustomId = userCustomId;
		object.selectedCustomId = customId;
		console.log("delete ID is:",object.selecteduserCustomId);
	}

	resetConfirmYes(flag){
		let object = this;
		console.log("delete id",object.selecteduserCustomId);
		console.log("userType:",object.userType);
		object.closeModalDialog();
		if(flag) {
			this.deleteData(this.selecteduserCustomId,this.selectedCustomId);
		}
	}

	closeModalDialog() {
		this.display_confirmationbox = 'none';
	}

	
	deleteData(customUserId,customId){
		let object = this;
		let userType = object.userType;
		object.crgService.deleteUserCustomRefMapping(userType,customUserId).subscribe(response => {
			//show success message
			object.toastr.info(response.value, '', {
				timeOut: 2000
			});

			for(let crgData of object.allCustomRefGroupList){
				if(crgData.customId==customId){
					crgData.checked=false;
				}
			}

			if(object.customRefGroupData == undefined) {
				object.displayCRGData = false;
			}

			object.getCustomReferenceGroupData();
			object.display_confirmationbox = 'none';

		}, (error)=>{
			if(object.customRefGroupData == undefined) {
				object.displayCRGData = false;
			}
			object.display_confirmationbox = 'none';
			object.toastr.error('Some unexpected Error have occurred', 'Error', {
				timeOut: 2000
			});
			let errorObj = {
				"dashboardId" : "NA",
				"pageName" : "Admin Role User mapping Screen",
				"errorType" : "fatal",
				"errorTitle" : "Web Service Error",
				"errorDescription" : error.message,
				"errorObject" : error
			}
			throw errorObj;
		});
	}

}
