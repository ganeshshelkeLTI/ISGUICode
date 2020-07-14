import { Component, OnInit, Input } from '@angular/core';
import { ViewAllUserService } from '../services/admin/view-all-user.service';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { EventEmitter } from 'events';
import { ToastrService } from 'ngx-toastr';

import { NgxSpinnerService } from 'ngx-spinner';
import { copyStyles } from '@angular/animations/browser/src/util';

import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';

@Component({
  selector: 'app-view-all-user',
  templateUrl: './view-all-user.component.html',
  styleUrls: ['./view-all-user.component.css']
})
export class ViewAllUserComponent implements OnInit {

  public userData:any;
  public userID: any;
  public selectedUser: any;
  public userObject: any;
  public userdata: any;
  public userRelatedData: any;
  public emailId: string;
  public userEmail: string;
  public sessionId: string;
  public defaultSelected: string;

  dataLoaded: boolean;

  display_confirmationbox = 'none';

  constructor(private fb: FormBuilder, private spinner: NgxSpinnerService, private toastr: ToastrService, private viewAllUserService: ViewAllUserService, private loginDataBroadcastService: LoginDataBroadcastService) {
    let object = this;
    object.selectedUser="0";
    let loginSharedData = object.loginDataBroadcastService.getEmitter();
    loginSharedData.on('setLoginData', function () {
      object.getUserLoginInfo();
    })
  }

  @Input('pid') selectedExternalPid: any = 0;

  getUserLoginInfo() {
    let _self = this;
    _self.userdata = _self.loginDataBroadcastService.get('userloginInfo');
    _self.emailId = _self.userdata['userDetails']['emailId'];
    _self.sessionId = _self.userdata['userDetails']["sessionId"];
  }

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
    object.display_confirmationbox = 'none';
    object.getUserLoginInfo();
    object.getAllData();
  }

  getUserDataById(selectedid=''){
    let object=this;
    try {
      object.userID = object.selectedUser;
      object.userObject = { "sessionId": object.sessionId, "id": object.userID };
      object.viewAllUserService.getUserData(object.userObject).subscribe((response: any) => {
        object.userRelatedData = response;
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

  deletePopup(id) {
    let object = this;
    object.selectedExternalPid = id;
    object.display_confirmationbox = 'block';
  }

  closeModalDialog() {
    this.display_confirmationbox = 'none';
  }

  deleteRow() {
    let pid = (<HTMLInputElement>document.getElementById("pid")).value;
    let object = this;
    try {
      let removeRow = { recordIds: [pid] };
      object.viewAllUserService.deleteData(removeRow).subscribe((response: any) => {
        object.getUserDataById(object.userID);
        object.toastr.info('Data Deleted Successfully', '', { timeOut: 1500 });
        object.display_confirmationbox = 'none';
        object.getAllData();
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

}
