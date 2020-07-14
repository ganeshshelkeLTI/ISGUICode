import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { EventEmitter } from 'events';
import { ToastrService } from 'ngx-toastr';

import { NgxSpinnerService } from 'ngx-spinner';
import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';

import { ViewAllUserService } from '../services/admin/view-all-user.service';

import { ExternalUserProjectMappingService } from '../services/admin/external-user-project-mapping.service';
declare var $: any;
@Component({
  selector: 'app-admin-master',
  templateUrl: './external-user-project-mapping.component.html',
  styleUrls: ['./external-user-project-mapping.component.css']
})
export class ExternalUserProjectMapping implements OnInit {
  private projectMap:Map<string,any>;
  public userdata: any;
  public emailId: string;
  public sessionId: string;
  public projectData: any;
  public backendResponse: any;
  public saveDataObject: any;
  public userEmail: string;
  public addedProjectIds: any[] = [];
  public selectedUserData:any;
  public roleId:string;
  public userData:any;
  public selectedUser: any;
  public userID: any;
  public userObject: any;
  public userRelatedData: any;
  public roleObject:any;
  public UserTabularData:any;
  public saveOrupdate:any;

  // private enableSave: boolean;
  dataLoaded: boolean;
  private userFound: boolean;
  private emailFlag: boolean;
  private isTabularData: boolean;
  private isUserFetched:boolean = false;

  private selectOneProject:boolean = false;

  display_confirmationbox = 'none';

  constructor(private fb: FormBuilder, private service: ExternalUserProjectMappingService, private spinner: NgxSpinnerService, private toastr: ToastrService, private loginDataBroadcastService: LoginDataBroadcastService, private viewAllUserService: ViewAllUserService,) {
    let object=this;
    let loginSharedData = object.loginDataBroadcastService.getEmitter();
    loginSharedData.on('setLoginData', function () {
      object.getUserLoginInfo();
    })
  }

  @Input('pid') selectedExternalPid: any = 0;

  getAllData() {
    let object = this;
    object.viewAllUserService.retreiveUserId().subscribe((userData: any) => {
      object.userData = userData;
      object.dataLoaded = true;
      object.selectedUser = object.userData[0];
      object.getUserDataById(object.selectedUser);
    });
  }

  ngOnInit() {
    let object = this;
    object.dataLoaded = false;
    // object.enableSave = false;
    object.userFound = false;
    object.projectMap=new Map<string,any>();
    object.getUserLoginInfo();
    object.fetchData();
    object.getAllData();
  }

  displayUserTable(user)
	{
		//call web service to get user data
		let object =this;
		try
		{
			//call web serivce to get roles
			object.viewAllUserService.retreiveUserTableData(object.sessionId, user.id).subscribe((data:any)=>{

        object.resetProject();

        object.UserTabularData = data;
        // console.log('UserTabularData')
        // console.log(JSON.stringify(object.UserTabularData))
        if(object.UserTabularData==undefined || object.UserTabularData=='' || object.UserTabularData==null || object.UserTabularData.length==0)
				{
          object.isTabularData=false;
          // object.enableSave = false;
				}
				else{
          object.isTabularData=true;
          // object.enableSave = true;
          object.checkProject(data);

          //move to the top of table to selections
          object.scrollToTopOfTable();
				}
			},(error)=>{
				//throw custom exception to global error handler
				//create error object
				let errorObj = {
					"dashboardId" : "NA",
					"pageName" : "External User mapping Screen",
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
				"pageName" : "External User mapping Screen",
				"errorType" : "warn",
				"errorTitle" : "data Error",
				"errorDescription" : error.message,
				"errorObject" : error
			}
			throw errorObj;
		}
  }

  scrollToTopOfTable()
  {

   $('#proj-table tbody').scrollTop(0);

  }


  resetProject() {
    let object = this;
    object.selectOneProject = false;
    object.addedProjectIds=[];
    for(let project of object.projectData.project)
    {
      object.projectMap[project.key]=project;
      project.checked = false;
    }
    // object.fetchData();
  }

  selectUser(user)
	{
    let object = this;
    // console.log(JSON.stringify(user))
    object.resetProject();
		try
		{
			//on selection of suggested user, hide suggestion container
      object.userFound = false;

			//set selected user with suggestion
			object.userEmail = user.id;
			object.selectedUserData = user;
      object.isUserFetched = true;
      if(object.isUserFetched == true) {
        object.userFound = false;
        object.emailFlag = true;
      }

      object.displayUserTable(user);


		}
		catch(error)
		{
			//throw custom exception to global error handler
			//create error object
			let errorObj = {
				"dashboardId" : "NA",
				"pageName" : "External User mapping Screen",
				"errorType" : "warn",
				"errorTitle" : "Data Error",
				"errorDescription" : error.message,
				"errorObject" : error
			}
		}
	}

  suggestUserId(userEmail, event)
	{
    let object = this;
    // && event.target.value.length>=2 // this is used to search after 2 charachters
		if(event.target.value!=undefined && event.target.value!=null)
		{
			//call web serivce to get data
			object.viewAllUserService.searchUserById(userEmail).subscribe((data:any)=>{
        object.userData = data;

        let length = object.addedProjectIds.length;
        if(object.emailFlag == false || length <= 0 || length == 0) {
          // object.enableSave = false;
        }
				if(object.userData.staff.length>0)
				{
          object.userFound = true;

				}
				else
				{
          object.userFound = false;
          object.emailcheck();
        }



			},(error)=>{
				//throw custom exception to global error handler
				//create error object
				let errorObj = {
					"dashboardId" : "NA",
					"pageName" : "External User mapping Screen",
					"errorType" : "Fatal",
					"errorTitle" : "Web Service Error",
					"errorDescription" : error.message,
					"errorObject" : error
				}
				throw errorObj;
      });




		}

		if(event.target.value.length<=0)
		{
      object.userFound = false;
      object.isUserFetched = false;
		}
  }

  sortProjectData()
  {
    let object = this;

   // console.log('data: ', object.projectData.project);

    object.projectData.project = object.projectData.project.sort(function(a, b) {
      return b.checked - a.checked
    });

  //  console.log('data: ', object.userData.project);

  }


  getUserDataById(selectedid=''){
    let object=this;
    try {
      object.userID = object.selectedUser;
      object.userObject = { "sessionId": object.sessionId, "id": object.userID };
      object.viewAllUserService.getUserData(object.userObject).subscribe((response: any) => {
        object.userRelatedData = response;
        // console.log(object.userRelatedData)
      })
    } catch(error) {
      //throw custom exception to global error handler
			//create error object
			let errorObj = {
				"dashboardId" : "NA",
				"pageName" : "Dashboard Master Screen",
				"errorType" : "warn",
				"errorTitle" : "Data Error",
				"errorDescription" : error.message,
				"errorObject" : error
			}
			throw errorObj;
    }
  }

  getUserLoginInfo() {
    let _self = this;
    _self.userdata = _self.loginDataBroadcastService.get('userloginInfo');
    _self.emailId = _self.userdata['userDetails']['emailId'];
    _self.sessionId = _self.userdata['userDetails']["sessionId"];
  }

  fetchData() {
    try {
      let object = this;
      // let sessionId = object.sessionId;
      object.service.retreiveProjects().subscribe((response: any) => {
        object.projectData = response;

        if(object.projectData!=undefined)
        {
          object.sortProjectData();
        }

        for(let project of object.projectData.project)
				{
          object.projectMap[project.key]=project;
          project.checked = false;
        }
        object.dataLoaded = true;
      });
    } catch(error) {
      //throw custom exception to global error handler
			//create error object
			let errorObj = {
				"dashboardId" : "NA",
				"pageName" : "Dashboard Master Screen",
				"errorType" : "warn",
				"errorTitle" : "Data Error",
				"errorDescription" : error.message,
				"errorObject" : error
			}
			throw errorObj;
    }
  }

  resetAll() {
    let object = this;
    // object.enableSave = false;
    object.isTabularData=false;
    object.selectOneProject = false;
    object.userEmail = '';
    object.resetProject();
    // object.fetchData();
  }

  checkValue(project,projectId) {
    let object = this;
    object.selectOneProject = false;
    // alert(object.emailFlag)
    let selectedCount = 0;
    let index = object.addedProjectIds.indexOf(projectId);
    if(project.target.checked) {
      object.addedProjectIds.push(projectId);
    } else {
      object.addedProjectIds.splice(index, 1);
    }
    let length = object.addedProjectIds.length;
    if(length > 0) {
      // object.enableSave = true;
      if(object.userEmail == '' || object.userEmail == undefined || object.emailFlag == false) {
        // object.enableSave = false;
      }
    } else {
      // object.enableSave = false;
    }


  }

  // checking email is validated or not
  emailcheck() {
    let object = this;
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    object.userFound = false;
    // object.enableSave = true;
    let length = object.addedProjectIds.length;
    if(length <= 0 || length == 0) {
      // object.enableSave = false;
    }
    if (object.userEmail!= "" && !EMAIL_REGEXP.test(object.userEmail)) {
      object.emailFlag = false;
    } else {
      object.emailFlag = true;
    }

    return null;
  }

  checkEmail() {
    let object = this;
    // alert(object.userEmail);
    if(object.userEmail == '' || object.userEmail == undefined) {
      // object.enableSave = false;
    } else {
      // object.enableSave = true;
      let length = object.addedProjectIds.length;
      if(length > 0) {
        // object.enableSave = true;
      } else {
        // object.enableSave = false;
      }
    }
  }

  saveData() {
    let object = this;

    let saveDataObject:any = {};

    if(object.userFound == false) {
      object.saveOrupdate = "I";
    } else {
      object.saveOrupdate = "U";
    }

    let length = object.addedProjectIds.length;

    if(length == 0) {
      object.selectOneProject = true;
    } else {
      let tempobj = {
        id : object.userEmail,
        mappings : object.addedProjectIds,
        // userType: "External",
        operation: object.saveOrupdate
      }
      saveDataObject.sessionId = object.sessionId;
      saveDataObject.mappings = [];
      // saveDataObject.userType = "External";
      saveDataObject.mappings.push(tempobj);

      // console.log('saveDataObject')
      // console.log(JSON.stringify(saveDataObject))

      object.service.saveData(saveDataObject).subscribe((response: any) => {
        object.backendResponse = response;
        object.afterSaveorDelete(object.sessionId,object.userEmail);
        // object.userEmail = '';
        // object.fetchData();
        object.resetProject();
        // object.enableSave = false;
        if(response.key == 'Fail') {
          object.toastr.error(response.value, '', { timeOut: 1500 });
        } else {
          object.toastr.info('Data Saved Successfully', '', { timeOut: 1500 });
        }

          //move to the top of table to selections
          object.scrollToTopOfTable();
      });
    }

  } catch(error) {
    let object = this;
    object.toastr.error('Some unexpected Error have occurred', '', { timeOut: 2000 });
    //throw custom exception to global error handler
    //create error object
    let errorObj = {
      "dashboardId" : "NA",
      "pageName" : "Dashboard Master Screen",
      "errorType" : "warn",
      "errorTitle" : "Data Error",
      "errorDescription" : error.message,
      "errorObject" : error
    }
    throw errorObj;
  }

  deletePopup(id) {
    let object = this;
    object.selectedExternalPid = id;
    object.display_confirmationbox = 'block';
  }

  closeModalDialog() {
    this.display_confirmationbox = 'none';
  }

  afterSaveorDelete(sessionId,email) {
    let object = this;
    object.viewAllUserService.retreiveUserTableData(sessionId,email).subscribe((data:any)=>{

      object.resetProject();

      object.UserTabularData = data;
      if(object.UserTabularData==undefined || object.UserTabularData=='' || object.UserTabularData==null || object.UserTabularData.length==0)
      {
        object.isTabularData=false;
      }
      else
      {
        object.isTabularData=true;
        object.checkProject(data);
      }
    },(error)=>{
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : "NA",
        "pageName" : "External User mapping Screen",
        "errorType" : "Fatal",
        "errorTitle" : "Web Service Error",
        "errorDescription" : error.message,
        "errorObject" : error
      }

      throw errorObj;
    });
  }

  deleteRow() {
    let pid = (<HTMLInputElement>document.getElementById("pid")).value;
    let object = this;
    try {
      let removeRow = { recordIds: [pid] };
      object.viewAllUserService.deleteData(removeRow).subscribe((response: any) => {
        object.toastr.info('Data Deleted Successfully', '', { timeOut: 1500 });
        object.display_confirmationbox = 'none';
        object.resetProject();
        object.afterSaveorDelete(object.sessionId,object.userEmail);
      });
    } catch(error) {
      //throw custom exception to global error handler
			//create error object
			let errorObj = {
				"dashboardId" : "NA",
				"pageName" : "Dashboard Master Screen",
				"errorType" : "warn",
				"errorTitle" : "Data Error",
				"errorDescription" : error.message,
				"errorObject" : error
			}
			throw errorObj;
    }
  }

  checkProject(projects) {
    let object=this;
    // object.enableSave = true;
    object.addedProjectIds=[];

    for(let project of projects) {
      let projectObject=object.projectMap[project.projectId];
      object.addedProjectIds.push(project.projectId);
      projectObject.checked=true;
    }

    object.sortProjectData();
  }

}
