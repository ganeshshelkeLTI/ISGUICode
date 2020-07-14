import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { EventEmitter } from 'events';
import { ToastrService } from 'ngx-toastr';

import { WebLinkMasterService } from '../services/admin/web-link-master.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { copyStyles } from '@angular/animations/browser/src/util';

import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';

@Component({
  selector: 'app-web-link-master',
  templateUrl: './web-link-master.component.html',
  styleUrls: ['./web-link-master.component.css']
})
export class WebLinkMasterComponent implements OnInit {

  private webLinkMasterWork: boolean = false;
  private rows: any[] = [];
  private rowCount: number = 0;
  private rowIndex: number;
  private webLinkMasterData: any[] = [];
  private noDataPresend: boolean = false;
  dataLoaded: boolean;
  private enableSave: boolean;
  submitted = false;
  private rowsDeleted = [];//keeping a record of deleted row
  private notify: EventEmitter = new EventEmitter();//this is event Emitter emitted on
  public userdata: any;
  public emailId: string;
  public sessionId: string;
  public masterType = "WebLink";

  display_confirmationbox = 'none';

  webLinkMasterForm: FormGroup;

  constructor(private fb: FormBuilder, private service: WebLinkMasterService, private spinner: NgxSpinnerService, private toastr: ToastrService, private loginDataBroadcastService: LoginDataBroadcastService) {
    let object=this;
    let loginSharedData = object.loginDataBroadcastService.getEmitter();
    loginSharedData.on('setLoginData', function () {
      object.getUserLoginInfo();
    })
  }

  @Input('rid') selectedroleid: any = 0;
  @Input('ind') selectedindex: any = 0;

  ngOnInit() {
    let object = this;
    object.dataLoaded = false;
    object.enableSave = true;
    object.getUserLoginInfo();
    object.fetchData();
  }

  getUserLoginInfo() {
    let _self = this;
    _self.userdata = _self.loginDataBroadcastService.get('userloginInfo');
    _self.emailId = _self.userdata['userDetails']['emailId'];
    _self.sessionId = _self.userdata['userDetails']["sessionId"];
  }

  get webLinkMasterPoints() {
    return this.webLinkMasterForm.get('master_data') as FormArray;
  }

  fetchData() {
    try{
      let object = this;
      let sendPostData = {
        "sessionId":  this.sessionId,
        "masterType": this.masterType
      }
      object.service.retreiveData(sendPostData).subscribe((response: any) => {
        let count = response.master_data.length;
        object.dataLoaded = true;
        if (count == 0) {
          object.noDataPresend = true;
          object.initForm();
        } else {
          object.noDataPresend = false;
          object.initForm();

          let index = 0;
          while (index < count) {
            object.webLinkMasterPoints.push(this.fb.group({
              masterName: response.master_data[index].masterName,
              masterDescription: response.master_data[index].masterDescription,
              masterId: response.master_data[index].masterId,
              createdBy: response.master_data[index].createdBy,
              createdDate: response.master_data[index].createdDate,
              modifiedBy: response.master_data[index].modifiedBy,
              modifiedDate: response.master_data[index].modifiedDate,
              operation: 'O'
            }));
            // object.webLinkMasterPoints.at(index+1).get('masterName').disable();
            let row: any = {};
            row.webLinkMasterData = [];
            row.selectedStatus = 'O';
            row.readOnly=true;
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
      this.webLinkMasterForm = this.fb.group({
        master_data: this.fb.array([this.fb.group({
          masterName: '',
          masterDescription: '',
          masterId: 0,
          createdBy: '',
          modifiedBy: '',
          modifiedDate: '',
          operation: 'I',
          createdDate: '',
        })])
      })
      let row: any = {};
      object.rowIndex = 0;
      row.webLinkMasterData = '';
      row.masterName = '';
      row.masterDescription = '';
      row.createdBy = '';
      row.modifiedBy = '';
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

  addData() {
    let object = this;
    try{
      object.webLinkMasterPoints.push(object.fb.group({
        masterName: ['', Validators.required],
        masterDescription: ['', Validators.required],
        // logged-in user name
        createdBy: "",
        modifiedBy: '',
        // active: 1,
        modifiedDate: '',
        createdDate: '',
        operation: 'I',
        masterId: 0
      }));

      object.webLinkMasterWork = true;

      let row: any = {};
      row.webLinkMasterData = object.webLinkMasterData;
      row.selectedStatus = 'I';
      row.readOnly=false;
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
    object.rows[rowIndex].selectedStatus = 'U';
  }

  changeRowVisibility(rowIndex) {
    let object = this;
    object.rows[rowIndex].showEye = !object.rows[rowIndex].showEye;
  }

  deleteData(masterId,index) {
    let object = this;
    try {
      let sendMasterId = {
        "sessionId": this.sessionId,
        "masterType": this.masterType,
        "master_data":[ { "masterId": masterId } ]
      }
      if(masterId != 0) {
        // let sendMasterId = {"masterId" : masterId};
        object.service.deleteLink(sendMasterId).subscribe((response) => {
          object.enableSave = true;
          this.fetchData();
          object.display_confirmationbox = 'none';
          this.toastr.info('Admin Feature Deleted Successfully', '', { timeOut: 1500, positionClass: 'toast-top-center' });
        }, (error) => {
          object.enableSave = true;
          object.display_confirmationbox = 'none';
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
      } else {
        object.rows[index].selectedStatus = 'D';
        // object.rows[index].isHidden = true;
        object.webLinkMasterPoints.removeAt(index);
        object.rowsDeleted.push(index);
        object.display_confirmationbox = 'none';
      }

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
      object.display_confirmationbox = 'none';
			throw errorObj;
    }
  }

  saveData(): void {

    try{
      let object = this;
      object.enableSave = false;

      this.submitted = true;
      if (this.webLinkMasterForm.invalid) {
        object.enableSave = true;
        object.toastr.warning('Please Enter the required Fields', '', { timeOut: 1000, positionClass: 'toast-top-center' })
        return;
      }

      let response: any = {};

      // this will be changes as per loggedin user
      response.sessionId = object.sessionId;
      response.masterType = this.masterType;
      let data = object.webLinkMasterForm.value.master_data;
      let index = 0;
      let array = [];
      for (let y of data) {
        if(y.masterId == 0) {
          y.operation = "I";
        }
        if (!(index == 0 && (!object.noDataPresend))) {
          array.push(y);
        }
        index++;
      }
      response.master_data = array;

      // console.log('response');
      // console.log(JSON.stringify(response));

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
