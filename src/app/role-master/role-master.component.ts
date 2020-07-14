import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { EventEmitter } from 'events';
import { ToastrService } from 'ngx-toastr';

import { RoleMasterService } from '../services/admin/role-master.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { copyStyles } from '@angular/animations/browser/src/util';

import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';

@Component({
  selector: 'app-role-master',
  templateUrl: './role-master.component.html',
  styleUrls: ['./role-master.component.css']
})
export class RoleMasterComponent implements OnInit {
  private dashboardMasterWork: boolean = false;
  private rows: any[] = [];
  private rowCount: number = 0;
  private rowIndex: number;
  private dashboardMasterData: any[] = [];
  private noDataPresend: boolean = false;
  dataLoaded: boolean;
  private enableSave: boolean;
  submitted = false;
  private rowsDeleted = [];//keeping a record of deleted row
  private notify: EventEmitter = new EventEmitter();//this is event Emitter emitted on
  public userdata: any;
  public emailId: string;
  public sessionId: string;
  public retrieveData: any;

  private isUpdated: boolean = false;

  display_confirmationbox = 'none';

  confirmBoxResetFlag:boolean = false;

  constructor(private fb: FormBuilder, private service: RoleMasterService, private spinner: NgxSpinnerService, private toastr: ToastrService, private loginDataBroadcastService: LoginDataBroadcastService) {
    let object=this;
    let loginSharedData = object.loginDataBroadcastService.getEmitter();
    loginSharedData.on('setLoginData', function () {
      object.getUserLoginInfo();
    })
  }

  @Input('rid') selectedroleid: any = 0;
  @Input('ind') selectedindex: any = 0;

  getUserLoginInfo() {
    let _self = this;
    _self.userdata = _self.loginDataBroadcastService.get('userloginInfo');
    _self.emailId = _self.userdata['userDetails']['emailId'];
    _self.sessionId = _self.userdata['userDetails']["sessionId"];
  }

  roleMasterForm: FormGroup;

  private isActive: boolean = true;

  private today = new Date();
  private dd = this.today.getDate();
  //January is 0!
  private mm = this.today.getMonth()+1;
  private yyyy = this.today.getFullYear();

  ngOnInit() {
    let object = this;
    object.dataLoaded = false;
    object.enableSave = true;
    object.getUserLoginInfo();
    object.fetchData();
  }

  get roleMasterPoints() {
    return this.roleMasterForm.get('role_master_data') as FormArray;
  }

  addData() {
    let object = this;
    try{
      object.roleMasterPoints.push(object.fb.group({
        roleName: ['', Validators.required],
        description: ['', Validators.required],
        // logged-in user name
        createdBy: "",
        modifiedBy: '',
        // active: 1,
        modifiedDate: '',
        createdDate: '',
        operation: 'I',
        roleId: 0
      }));

      object.dashboardMasterWork = true;

      let row: any = {};
      row.dashboardMasterData = object.dashboardMasterData;
      row.operation = 'I';
      object.rows[++object.rowIndex] = row;
      object.rowCount++;
    }
    catch(error)
    {
      //throw custom exception to global error handler
			//create error object
			let errorObj = {
				"dashboardId" : "NA",
				"pageName" : "Role Master Screen",
				"errorType" : "warn",
				"errorTitle" : "Data Error",
				"errorDescription" : error.message,
				"errorObject" : error
			}
			throw errorObj;
    }
  }

  updateRowStatus(rowIndex) {
    let object = this;
    object.isUpdated = true;
    object.rows[rowIndex].selectedStatus = 'U';
  }

  changeRowVisibility(rowIndex) {
    let object = this;
    object.rows[rowIndex].showEye = !object.rows[rowIndex].showEye;
  }

  deleteData(roleId,index) {
    let object = this;
    try{
      if(roleId != 0) {
        let sendRoleId = {"roleId" : roleId, "sessionId" : object.sessionId};
        object.service.deleteRole(sendRoleId).subscribe((response) => {
          object.dataLoaded = false;
          object.enableSave = true;
          object.fetchData();
          object.display_confirmationbox = 'none';
          object.toastr.info('Role Deleted Successfully', '', { timeOut: 1500, positionClass: 'toast-top-center' });
        }, (error) => {
          object.enableSave = true;
          object.display_confirmationbox = 'none';
          object.toastr.error('Some unexpected Error have occurred', '', { timeOut: 2000, positionClass: 'toast-top-center' });
          //throw custom exception to global error handler
          //create error object
          let errorObj = {
            "dashboardId" : "NA",
            "pageName" : "Role Master Screen",
            "errorType" : "fatal",
            "errorTitle" : "Web Service Error",
            "errorDescription" : error.message,
            "errorObject" : error
          }
          throw errorObj;
        })
      } else {
        object.rows[index].selectedStatus = 'D';
        // object.rows[index].isHidden = true;
        object.roleMasterPoints.removeAt(index);
        object.display_confirmationbox = 'none';
        // object.confirmBoxResetFlag = false;
      }
    }
    catch(error)
    {
      // object.confirmBoxResetFlag = false;
      //throw custom exception to global error handler
			//create error object
			let errorObj = {
				"dashboardId" : "NA",
				"pageName" : "Role Master Screen",
				"errorType" : "warn",
				"errorTitle" : "Data Error",
				"errorDescription" : error.message,
				"errorObject" : error
      }
      object.display_confirmationbox = 'none';
			throw errorObj;
    }
  }

  fetchData() {
    try{
      let object = this;
      // object.service.retreiveData(object.sessionId).subscribe((response: any) => {
      object.service.retreiveData().subscribe((response: any) => {
        object.retrieveData = response;
        let count = response.length;
        object.dataLoaded = true;
        if (count == 0) {
          object.noDataPresend = true;
          object.initForm();
        } else {
          object.noDataPresend = false;
          object.initForm();

          let index = 0;
          while (index < count) {
            object.roleMasterPoints.push(this.fb.group({
              roleName: response[index].roleName,
              description: response[index].description,
              createdBy: response[index].createdBy,
              createdDate: response[index].createdDate,
              modifiedBy: response[index].modifiedBy,
              modifiedDate: response[index].modifiedDate,
              roleId: response[index].roleId,
              operation: 'O',
            }));
            let row: any = {};
            row.dashboardMasterData = [];

            row.selectedStatus = 'O';
            object.rows[++object.rowIndex] = row;
            object.rowCount++;
            index++;
          }
        }
        object.enableSave = true;

      },(error)=>{
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId" : "NA",
          "pageName" : "Role Master Screen",
          "errorType" : "Fatal",
          "errorTitle" : "Web Service Error",
          "errorDescription" : error.message,
          "errorObject" : error
        }

        throw errorObj;
      })
    }
    catch(error)
    {
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

  //for initForm
  initForm() {
    try {
      let object = this;
      this.roleMasterForm = this.fb.group({
        role_master_data: this.fb.array([this.fb.group({
          roleName: '',
          description: '',
          createdBy: this.emailId,
          modifiedBy: this.emailId,
          modifiedDate: '',
          createdDate: '',
          operation: 'I',
          roleId: 0
        })])
      })
      let row: any = {};
      object.rowIndex = 0;
      row.dashboardMasterData = '';
      row.roleName = '';
      row.description = '';
      row.createdBy = this.emailId;
      row.modifiedBy = this.emailId;
      row.showEye = true;
      row.selectedStatus = 'I';
      object.rows[object.rowIndex] = row;
      object.rowCount++;
    } catch(error) {
      //throw custom exception to global error handler
			//create error object
			let errorObj = {
				"dashboardId" : "NA",
				"pageName" : "Role Master Screen",
				"errorType" : "warn",
				"errorTitle" : "Data Error",
				"errorDescription" : error.message,
				"errorObject" : error
			}

			throw errorObj;
    }
  }

  saveData(): void {

    try{
      let object = this;
      // object.enableSave = false;

      this.submitted = true;
      if (this.roleMasterForm.invalid) {
        object.enableSave = true;
        object.toastr.warning('Please Enter the required Fields', '', { timeOut: 1000, positionClass: 'toast-top-center' })
        return;
      }

      let response: any = {};

      // this will be changes as per loggedin user
      response.sessionId = object.sessionId;
      let data = object.roleMasterForm.value.role_master_data;
      let index = 0;
      let array = [];
      for (let y of data) {
        if(y.roleId == 0) {
          y.operation = "I";
        }
        if (!(index == 0 && (!object.noDataPresend))) {
          array.push(y);
        }
        index++;
      }
      response.role_master_data = array;

      // let saveRes = response.role_master_data;
      // console.log('res');
      // console.log(response)
      //finally sending rows to server
      object.service.saveData(response).subscribe((response) => {
        object.enableSave = true;
        this.fetchData();
        this.toastr.info('Data Saved Successfully', '', { timeOut: 1500, positionClass: 'toast-top-center' });
      }, (error) => {
        object.enableSave = true;
        this.toastr.error('Some unexpected Error have occurred', '', { timeOut: 2000, positionClass: 'toast-top-center' });
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId" : "NA",
          "pageName" : "Role Master Screen",
          "errorType" : "fatal",
          "errorTitle" : "Web Service Error",
          "errorDescription" : error.message,
          "errorObject" : error
        }
        throw errorObj;
      })
    }
    catch(error)
    {
      //throw custom exception to global error handler
			//create error object
			let errorObj = {
				"dashboardId" : "NA",
				"pageName" : "Role Master Screen",
				"errorType" : "warn",
				"errorTitle" : "Data Error",
				"errorDescription" : error.message,
				"errorObject" : error
			}

			throw errorObj;
    }

  }

  resetBtnHandler(roleId,index){
    let object = this;
    object.display_confirmationbox = 'block';
    object.selectedroleid = roleId;
    object.selectedindex = index;
  }

  resetConfirmYes(flag){
    let rid = (<HTMLInputElement>document.getElementById("rid")).value;
    let ind = (<HTMLInputElement>document.getElementById("ind")).value;
    if(flag) {
      this.deleteData(rid,ind);
    }
  }

  closeModalDialog() {
    this.display_confirmationbox = 'none';
  }

}
