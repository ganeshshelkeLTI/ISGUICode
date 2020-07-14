import { Component, OnInit, Input } from '@angular/core';
import {
	ToastrService
} from 'ngx-toastr';
import {RoleUserMappingServiceService } from '../services/admin/role-user-mapping-service.service';
import { RoleMasterService } from '../services/admin/role-master.service';
import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';
import { DatePipe } from '@angular/common';


declare var $:any;

@Component({
	selector: 'app-role-user-mapping',
	templateUrl: './role-user-mapping.component.html',
	styleUrls: ['./role-user-mapping.component.css']
})
export class RoleUserMappingComponent implements OnInit {

	public roleId:string;
	public userData:any;
	public selectedUserData:any;
	public userFound:boolean=false;
	public roleObject:any;
	public isSaveDisabled:boolean=true;
	public selectedRoles=[];
	public selectedName
	public isUserFetched:boolean = false;
	public isRoleSelected:boolean = false;
	public isStartDateSelected:boolean = false;
	public isEndDateSelected:boolean = false;
	public selectedEndDate:any;
	public selectedStartDate:any;
	public LoggedUserData:any;
	public sessionId:any;
	public selectedRoleArray:any=[];
	public userTabularData:any;
	public dateValidation:boolean=true;
	public userSelectedRoles = [];


	public displayRoleName: string;

	private dataLoaded: boolean;

	displayRole: boolean = false;

	public UserTabularData:any;
	public isTabularData:boolean =false;
	private createdBy:string="";
	private modifiedBy:string="";
	private createdDate:string="";

	private modifiedDate:string="";

	display_confirmationbox = 'none';
	private retrievedRoles = [];

	constructor(private toastr: ToastrService, private roleuserMappingService : RoleUserMappingServiceService,private roleService: RoleMasterService,private loginDataBroadcastService: LoginDataBroadcastService) {
		let object=this;
		let loginSharedData = object.loginDataBroadcastService.getEmitter();
		loginSharedData.on('setLoginData', function () {
			object.getUserLoginInfo();
		})
	}

	@Input('rid') selectedroleid: any = 0;

	getUserLoginInfo() {
		let object = this;
		object.LoggedUserData = object.loginDataBroadcastService.get('userloginInfo');
		object.sessionId = object.LoggedUserData['userDetails']["sessionId"];
	}



	ngOnInit() {
		let object=this;
		object.display_confirmationbox = 'none';
		object.dataLoaded = false;
		object.initiateDatepicker();
		//diable save button
		object.isSaveDisabled=true;
		object.isUserFetched = false;
		object.isRoleSelected = false;
		object.isStartDateSelected = false;
		object.isEndDateSelected = false;
		object.dateValidation=true;
		object.isTabularData=false;
		object.LoggedUserData = object.loginDataBroadcastService.get('userloginInfo');
		object.sessionId = object.LoggedUserData['userDetails']["sessionId"];
		//get user roles
		object.fetchUserRoles();
		// let utype = "test123tet@gmail.com";
		// object.displaySelectedRoles(1,2);
	}

	fetchUserRoles()
	{
		try
		{
			//call web serivce to get roles
			this.roleService.retreiveData().subscribe((data:any)=>{
				this.dataLoaded = true;
				this.roleObject = data;
				for(let obj of this.roleObject)
				{
					obj.checked=false;
				}

			},(error)=>{
				//throw custom exception to global error handler
				//create error object
				let errorObj = {
					"dashboardId" : "NA",
					"pageName" : "Admin Role User mapping Screen",
					"errorType" : "Fatal",
					"errorTitle" : "Web Service Error",
					"errorDescription" : error.message,
					"errorObject" : error
				}

				throw errorObj;
			});
		}

		catch(error)
		{
			//throw custom exception to global error handler
			//create error object
			let errorObj = {
				"dashboardId" : "NA",
				"pageName" : "Admin Role User mapping Screen",
				"errorType" : "warn",
				"errorTitle" : "data Error",
				"errorDescription" : error.message,
				"errorObject" : error
			}

			throw errorObj;
		}
	}

	suggestUserId(roleId, event)
	{
		if(event.target.value!=undefined && event.target.value!=null && event.target.value.length>=2)
		{
			//call web serivce to get data
			this.roleuserMappingService.searchUserById(event.target.value).subscribe((data:any)=>{

				this.userData=data;
				if(this.userData.staff.length>0)
				{
					this.userFound=true;
				}
				else
				{
					this.userFound=false;
				}

			},(error)=>{
				//throw custom exception to global error handler
				//create error object
				let errorObj = {
					"dashboardId" : "NA",
					"pageName" : "Admin Role User mapping Screen",
					"errorType" : "Fatal",
					"errorTitle" : "Web Service Error",
					"errorDescription" : error.message,
					"errorObject" : error
				}

				throw errorObj;
			});
		}

		if(event.target.value.length<2)
		{
			this.userFound=false;
		}
	}

	selectUser(user)
	{
		try
		{
			//on selection of suggested user, hide suggestion container
			this.userFound=false;
			// this.selectedRoleArray = [];
			//set selected user with suggestion
			this.roleId = user.id;
			this.selectedUserData = user;
			this.isUserFetched=true;
			this.displayRole = false;

			//empty selected roles array
			this.selectedRoles=[];

			this.displayUserTable(user);
			this.displaySelectedRoles(user.id,user.value);
			this.validateSaveButton();
		}
		catch(error)
		{
			//throw custom exception to global error handler
			//create error object
			let errorObj = {
				"dashboardId" : "NA",
				"pageName" : "Admin Role User mapping Screen",
				"errorType" : "warn",
				"errorTitle" : "Data Error",
				"errorDescription" : error.message,
				"errorObject" : error
			}
		}
	}

	displayUserTable(user)
	{
		let userType = this.selectedUserData.value;
		//call web service to get user data
		let object =this;
		try
		{
			//call web serivce to get roles
			object.roleuserMappingService.retreiveUserTableData(object.sessionId, user.id, userType).subscribe((data:any)=>{

				object.UserTabularData = data;

				if(object.UserTabularData==undefined || object.UserTabularData=='' || object.UserTabularData==null || object.UserTabularData.length==0)
				{
					object.isTabularData=false;
				}
				else
				{
					object.isTabularData=true;
				}


			},(error)=>{
				//throw custom exception to global error handler
				//create error object
				let errorObj = {
					"dashboardId" : "NA",
					"pageName" : "Admin Role User mapping Screen",
					"errorType" : "Fatal",
					"errorTitle" : "Web Service Error",
					"errorDescription" : error.message,
					"errorObject" : error
				}

				throw errorObj;
			});
		}

		catch(error)
		{
			//throw custom exception to global error handler
			//create error object
			let errorObj = {
				"dashboardId" : "NA",
				"pageName" : "Admin Role User mapping Screen",
				"errorType" : "warn",
				"errorTitle" : "data Error",
				"errorDescription" : error.message,
				"errorObject" : error
			}

			throw errorObj;
		}


	}

	deleteData(dRoleId){
		let object = this;
		let deleteRoledata = {
			"sessionId": object.sessionId,
			"roleId": dRoleId,
			"userType": object.selectedUserData.value,
			"userId": object.selectedUserData.id
		}

		object.roleuserMappingService.deleteUserRole(deleteRoledata).subscribe(response => {
			//show success message
			object.toastr.info(response.value, '', {
				timeOut: 2000
			});

			for(let role of object.roleObject){
				if(role.roleId==dRoleId){
					role.checked=false;
				}
			}

			if(object.userSelectedRoles[0].roleList == undefined) {
				object.displayRole = false;
			}

			object.displaySelectedRoles(object.selectedUserData.id, object.selectedUserData.value);
			object.display_confirmationbox = 'none';

		}, (error)=>{
			if(object.userSelectedRoles[0].roleList == undefined) {
				object.displayRole = false;
			}
			object.display_confirmationbox = 'none';
			object.toastr.error('Some unexpected Error have occurred', 'Error', {
				timeOut: 2000
			});
			//reset role selection
			object.selectedRoleArray =[];
			//throw custom exception to global error handler
			//create error object
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

	//public adminSelected:boolean=false;

	validateUserRole(role, event, rolename)
	{

		try
		{
			let object=this;
			object.displayRoleName = rolename;

			if(event.target.checked==true)
			{

				//remove other selected roles
				for(let obj of this.roleObject)
				{	
					obj.checked=false;
				}

				for(let roleCounter=0; roleCounter<object.selectedRoles.length; roleCounter++)
				{
					if(object.selectedRoles[roleCounter].roleId !=role.roleId)
					{
						object.selectedRoles.splice(roleCounter,1);
					}
				}

				//selected role
				for(let obj of this.roleObject)
				{
					if(obj.roleId==role.roleId)
					{
						obj.checked=true;
					}

				}

				object.selectedRoles.push(role);
				//object.adminSelected=true;

			}
			else //remove element from selected array
			{
				for(let roleCounter=0; roleCounter<object.selectedRoles.length; roleCounter++)
				{
					if(object.selectedRoles[roleCounter].roleId ==role.roleId)
					{
						object.selectedRoles.splice(roleCounter,1);
					}
				}

				for(let obj of this.roleObject)
				{
					if(obj.roleId==role.roleId)
					{
						obj.checked=false;
					}

				}
				//object.adminSelected=false;
			}

			if(object.selectedRoles.length>0)
			{
				object.isRoleSelected=true;
			}
			else
			{
				object.isRoleSelected=false;
			}

			console.log('object.selectedRoles:', object.selectedRoles);

		}
		catch(error)
		{
			//throw custom exception to global error handler
			//create error object
			let errorObj = {
				"dashboardId" : "NA",
				"pageName" : "Admin Role User mapping Screen",
				"errorType" : "warn",
				"errorTitle" : "Data Error",
				"errorDescription" : error.message,
				"errorObject" : error
			}
			throw errorObj;
		}

		this.validateSaveButton();

	}

	validateSaveButton()
	{

		//check button disable validation
		if(this.isUserFetched==true&&this.dateValidation==true)
		{
			this.isSaveDisabled=false;
		}
		else
		{
			this.isSaveDisabled=true;
		}
	}

	public inputParamObj:any;
	saveUserDetails()
	{
		let object=this;

		console.log(object.selectedRoles);

		 //remove duplicates
		 object.selectedRoles = Array.from(new Set(object.selectedRoles));

		 //after duplicate removal
		 console.log('after duplicate removal: ', object.selectedRoles);


		//create an input param object
		object.selectedRoleArray = [];
		//get roles array
		for(let obj of object.selectedRoles)
		{
			object.selectedRoleArray.push(String(obj.roleId));
		}

		object.inputParamObj = {
			"sessionId":object.sessionId,
			"mappings" : [
				{
					"id":object.selectedUserData.id,
					"userType": object.selectedUserData.value,
					"mappings":object.selectedRoleArray,
					"validityStartDate" : object.selectedStartDate,
					"validityendDate" : object.selectedEndDate,
					"operation":"U"
				}
			]
		};

		let message= "Data Saved Successfully";

		console.log('test');
		console.log(object.inputParamObj);

		// call web service
		object.roleuserMappingService.saveAllUserRole(object.inputParamObj).subscribe(response => {
			this.displayRole = true;
			object.displaySelectedRoles(object.selectedUserData.id, object.selectedUserData.value);
			//show success message
			object.toastr.info(response.value, '', {
				timeOut: 2000
			});
			//reset role selection
			object.selectedRoleArray =[];

		}, (error)=>{
			object.displaySelectedRoles(object.selectedUserData.id, object.selectedUserData.value);
			object.toastr.error('Some unexpected Error have occurred', 'Error', {
				timeOut: 2000
			});
			//reset role selection
			object.selectedRoleArray =[];
			//throw custom exception to global error handler
			//create error object
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

	displaySelectedRoles(userEmailId,userType){
		let object = this;
		object.roleuserMappingService.findRolesByUserId(userEmailId,userType).subscribe((data:any)=>{
			object.userSelectedRoles = data;
			if(data==[]||data.length==0) {
				object.displayRole = false;
				object.userSelectedRoles=[];
				object.resetRoles();
				return;
			}
			object.displayRole = true;
			object.createdBy=data[0].createdBy;
			object.createdDate=data[0].createdDate;
			object.modifiedBy=data[0].modifiedBy;
			object.modifiedDate=data[0].modifiedDate;
		  let datePipe=new DatePipe('en-US');
		  object.selectedStartDate=datePipe.transform(data[0].validityStartDate,'dd/MM/yyyy');
		  object.selectedEndDate=datePipe.transform(data[0].validityEndDate,'dd/MM/yyyy');
		  
			object.resetRoles();
			object.checkRole(data[0].roleList);
			object.retrievedRoles = data[0].roleList
			object.isSaveDisabled = false;
		})
	}

	initiateDatepicker()
	{
		let object =this;

		$('.start-date-container').datepicker({format: 'dd/mm/yyyy'});
		$('.end-date-container').datepicker({format: 'dd/mm/yyyy'});

		$(".start-date-container").datepicker("setDate", new Date());
		$(".end-date-container").datepicker("setDate", new Date());

		//set start date end date
		var startDate = $('#start-date-picker').val();
		this.selectedStartDate = startDate;

		var endDate = $('#end-date-picker').val();
		this.selectedEndDate = endDate;

		$('.start-date-container .datepicker').css('display','none');
		$('.start-date-container .datepicker').attr('id','start-period-datepicker');

		//override default styles
		$('#start-period-datepicker').css('background','white');
		$('#start-period-datepicker').css('z-index','1500');
		$('#start-period-datepicker').css('position','absolute');
		$('#start-period-datepicker').css('border','1px solid gray');

		$('.end-date-container .datepicker').css('display','none');
		$('.end-date-container .datepicker').attr('id','end-period-datepicker');

		//override default styles
		$('#end-period-datepicker').css('background','white');
		$('#end-period-datepicker').css('z-index','1500');
		$('#end-period-datepicker').css('position','absolute');
		$('#end-period-datepicker').css('border','1px solid gray');

		$('#start-date-picker').change(function(){

			$('.start-date-container .datepicker').toggle();
			var startDate = $('#start-date-picker').val();
			object.selectedStartDate = startDate;
			var endDate = $('#end-date-picker').val();
			var arrStartDate = startDate.split("/");
			var date1 = new Date(arrStartDate[2], arrStartDate[1], arrStartDate[0]);
			var arrEndDate = endDate.split("/");
			var date2 = new Date(arrEndDate[2], arrEndDate[1], arrEndDate[0]);

			if(date1>date2)
			{
				object.dateValidation=false;
			}
			else
			{
				object.dateValidation=true;
			}
			object.validateSaveButton();
		});

		$('#end-date-picker').change(function(){

			$('.end-date-container .datepicker').toggle();
			var endDate = $('#end-date-picker').val();
			var startDate = $('#start-date-picker').val();
			object.selectedEndDate = endDate;
			var arrStartDate = startDate.split("/");
			var date1 = new Date(arrStartDate[2], arrStartDate[1], arrStartDate[0]);
			var arrEndDate = endDate.split("/");
			var date2 = new Date(arrEndDate[2], arrEndDate[1], arrEndDate[0]);

			if(date1>date2)
			{
				object.dateValidation=false;
			}
			else
			{
				object.dateValidation=true;
			}
			object.validateSaveButton();
		});

	}

	validateStartDate(startDate)
	{
		if(startDate!=undefined&&startDate!=null&&startDate!='')
		{
			this.isStartDateSelected=true;
		}
		else
		{
			this.isEndDateSelected=false;
		}

		this.validateSaveButton();
	}

	validateEndDate(endDate)
	{
		if(endDate!=undefined&&endDate!=null&&endDate!='')
		{
			this.isEndDateSelected=true;
		}
		else
		{
			this.isEndDateSelected=false;
		}
		this.validateSaveButton();
	}

	resetRoles(){
		let object=this;
		for(let role of object.roleObject){
			role.checked=false;
		}
	}

	checkRole(selectedRoles){
		let object=this;
		object.selectedRoles=[];
		// console.log(JSON.stringify(object.roleObject));
		for(let role of selectedRoles){

			for(let _role of object.roleObject){

				if(_role.roleId==role.key){
					_role.checked=true;
					object.selectedRoles.push(_role);
				}
			}
		}

		//console.log('checked roles: ', object.selectedRoles);
	}

	resetBtnHandler(roleId){
		let object = this;
		object.display_confirmationbox = 'block';
		object.selectedroleid = roleId;
	}

	resetConfirmYes(flag){
		let rid = (<HTMLInputElement>document.getElementById("rid")).value;
		if(flag) {
			this.deleteData(rid);
		}
	}

	closeModalDialog() {
		this.display_confirmationbox = 'none';
	}

}

