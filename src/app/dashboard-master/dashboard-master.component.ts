import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { EventEmitter } from 'events';
import { ToastrService } from 'ngx-toastr';

import { KpiMaintenanceService } from '../services/kpi-maintenance.service';

import { DashboardMasterService } from '../services/admin/dashboard-master.service';

import { NgxSpinnerService } from 'ngx-spinner';

import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';
declare var $: any;
@Component({
  selector: 'app-dashboard-features',
  templateUrl: './dashboard-master.component.html',
  styleUrls: ['./dashboard-master.component.css']
})
export class DashboardMasterComponent implements OnInit {
  private dashboardMasterWork: boolean = false;
  private rows: any[] = [];
  private rowCount: number = 0;
  private rowIndex: number;
  private dashboardMasterData: any[] = [];
  private noDataPresend: boolean = false;
  dataLoadedDashboard: boolean;
  private enableSave: boolean;
  private isDisabled: boolean = false;
  submitted = false;
  private rowsDeleted = [];//keeping a record of deleted row
  private notify: EventEmitter = new EventEmitter();//this is event Emitter emitted on
  public userdata: any;
  public emailId: string;
  public sessionId: string;

  display_confirmationbox = 'none';

  dashboadMasterForm: FormGroup;

  private isActive: boolean = true;

  private today = new Date();
  private dd = this.today.getDate();
  //January is 0!
  private mm = this.today.getMonth()+1;
  private yyyy = this.today.getFullYear();

  constructor(private fb: FormBuilder, private service: DashboardMasterService, private spinner: NgxSpinnerService, private toastr: ToastrService, private loginDataBroadcastService: LoginDataBroadcastService) {
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

  ngOnInit() {
    let object = this;
    object.dataLoadedDashboard = false;
    object.enableSave = true;
    object.fetchData();
    object.getUserLoginInfo();
  }

  get dashboardMasterPoints() {
    return this.dashboadMasterForm.get('lkp_tower_data') as FormArray;
  }

  addData() {
    let object = this;
    object.isDisabled = false;
    // alert('here');
    try{
      object.dashboardMasterPoints.push(object.fb.group({
        dashBoardName: ['', Validators.required],
        defination: ['', Validators.required],
        // logged-in user name
        createdBy: "",
        modifiedBy: '',
        operation: 'I',
        dashBoardId: 0,
        active: 1
      }));

      object.dashboardMasterWork = true;

      let row: any = {};
      row.dashboardMasterData = object.dashboardMasterData;
      row.selectedStatus = 'I';
      row.readOnly=false;
      object.rows[++object.rowIndex] = row;

      object.rowCount++;
      // alert(object.rowIndex)
      // $("#dm"+object.rowIndex).prop('disabled', false);
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

  deleteData(dashBoardId,index) {
    let object = this;
    try{

      if(dashBoardId > 0) {
        let senddashBoardId = {"dashBoardId" : dashBoardId};
        object.service.deleteTower(senddashBoardId).subscribe((response) => {
          object.enableSave = true;
          object.dashboardMasterPoints.removeAt(index);
          object.display_confirmationbox = 'none';
          this.toastr.info('Dashboard Deleted Successfully', '', { timeOut: 1500, positionClass: 'toast-top-center' });
        }, (error) => {
          object.enableSave = true;
          object.display_confirmationbox = 'none';
          this.toastr.error('Some unexpected Error have occurred', '', { timeOut: 2000, positionClass: 'toast-top-center'});
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
          object.display_confirmationbox = 'none';
          throw errorObj;
        })
      } else {
        object.rows[index].selectedStatus = 'D';
        object.dashboardMasterPoints.removeAt(index);
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

  fetchData() {
    try{
      let object = this;
      object.service.retreiveData().subscribe((response: any) => {

        let count = response.length;
        object.dataLoadedDashboard = true;

        if (count == 0) {
          object.noDataPresend = true;
          object.initForm();
        } else {
          object.noDataPresend = false;
          object.initForm();
          object.isDisabled = true;

          let index = 0;
          while (index < count) {
            object.dashboardMasterPoints.push(this.fb.group({
              dashBoardName: response[index].dashBoardName,
              defination: response[index].defination,
              createdBy: response[index].createdBy,
              createdDate: response[index].createdDate,
              modifiedBy: response[index].modifiedBy,
              modifiedDate: response[index].modifiedDate,
              dashBoardId: response[index].dashBoardId,
              operation: 'O',
            }));

            // object.dashboardMasterPoints.at(index+1).get('dashBoardName').disable();
           // console.log(index,response[index].dashBoardName);
            let row: any = {};
            row.dashboardMasterData = [];
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
      this.dashboadMasterForm = this.fb.group({
        lkp_tower_data: this.fb.array([this.fb.group({
          dashBoardName: '',
          defination: '',
          createdBy: this.emailId,
          modifiedBy: this.emailId,
          dashBoardId: 0,
          operation: 'I',
          active: 1
        })])
      })
      let row: any = {};
      object.rowIndex = 0;
      row.dashboardMasterData = '';
      row.dashBoardName = '';
      row.defination = '';
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
      object.enableSave = false;

      this.submitted = true;
      if (this.dashboadMasterForm.invalid) {
        object.enableSave = true;
        object.toastr.warning('Please Enter the required Fields', '', { timeOut: 1000, positionClass: 'toast-top-center' })
        return;
      }

      let response: any = {};

      // this will be changes as per loggedin user
      response.sessionId = object.sessionId;
      let data = object.dashboadMasterForm.value.lkp_tower_data;

      let index = 0;
      let array = [];
      for (let y of data) {
        if(y.dashBoardId == 0) {
          y.operation = "I";
        }
        if (!(index == 0 && (!object.noDataPresend))) {
          array.push(y);
        }
        index++;
      }
      response.lkp_tower_data = array;

      //finally sending rows to server
      object.service.sendMasterData(response).subscribe((response) => {
        object.enableSave = true;
        object.fetchData();
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
