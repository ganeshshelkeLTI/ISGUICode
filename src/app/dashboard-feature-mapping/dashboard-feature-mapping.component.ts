import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { EventEmitter } from 'events';
import { ToastrService } from 'ngx-toastr';
import { KpiMaintenanceService } from '../services/kpi-maintenance.service';
import { DashboardFeatureMappingService } from '../services/admin/dashboard-feature-mapping.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Key } from 'protractor';

import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';
import { last } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-dashboard-feature-mapping',
  templateUrl: './dashboard-feature-mapping.component.html',
  styleUrls: ['./dashboard-feature-mapping.component.css']
})
export class DashboardFeatureMappingComponent implements OnInit {

  private dashboardFeatureWork: boolean = false;
  private rows: any[] = [];
  private rowCount: number = 0;
  private rowIndex: number;
  private dashboardFeatureData: any[] = [];
  private noDataPresend: boolean = false;
  dataLoaded: boolean;
  private dashBoards: any[] = [];
  private enableSave: boolean;
  submitted = false;
  private rowsDeleted = [];//keeping a record of deleted rows
  private notify: EventEmitter = new EventEmitter();//this is event Emitter emitted on
  private featuresCount:number;
  private dashBoardList: any[] = [];
  private dashboardDropDownLoaded: boolean;
  private selectedDashBoardId: any;
  private selectedFeatureIds: any;
  private featureNames: any;
  private enableCheckBox: boolean = false;
  private enableFeaturedMap:Map<number,boolean>;
  private fdataIndex:number;
  private addedFeatureIds:any[] = [];

  public userdata: any;
  public emailId: string;
  public sessionId: string;

  display_confirmationbox = 'none';

  constructor(private fb: FormBuilder, private service: DashboardFeatureMappingService, private spinner: NgxSpinnerService, private toastr: ToastrService, private loginDataBroadcastService: LoginDataBroadcastService) {
    let object=this;
    let loginSharedData = object.loginDataBroadcastService.getEmitter();
    loginSharedData.on('setLoginData', function () {
      object.getUserLoginInfo();
    })
  }

  dashboadFeatureForm: FormGroup;
  private isActive: boolean = true;


  ngOnInit() {
    let object = this;
    object.dataLoaded = false;
    object.enableSave = true;
    object.getUserLoginInfo();
    object.populateAllDropDown();
    object.getFeatureName();
    object.notify.on('dataLoadedSuccessFully', function () {
      if (object.dashboardDropDownLoaded) {
      }
    });
  }

  @Input('rid') selecteddashboardid: any = 0;
  @Input('ind') selectedindex: any = 0;

  getUserLoginInfo() {
    let _self = this;
    _self.userdata = _self.loginDataBroadcastService.get('userloginInfo');
    _self.emailId = _self.userdata['userDetails']['emailId'];
    _self.sessionId = _self.userdata['userDetails']["sessionId"];
  }

  get dashboardFeatureMappingPoints() {
    return this.dashboadFeatureForm.get('dashboard_feature_mapping_data') as FormArray;
  }

  addData() {
    try{
      this.dashboardFeatureMappingPoints.push(this.fb.group({
        id: ['', Validators.required],
        mappings:[this.addedFeatureIds],
        // logged-in user name
        // createdBy:"",
        // modifiedBy: "",
        // createdDate:"",
        // modifiedDate:"",
        // active: 1
      }));
      let object = this;

      object.dashboardFeatureWork = true;

      let row: any = {};
      row.dashboardFeatureData = object.dashboardFeatureData;
      row.selectedStatus='I';
      row.dashboards = object.dashBoards;//populating lazy loaded dashboards
      // row.selectedDashBoardId = object.selectedDashBoardItemId; //current select DashBoard
      object.rows[++object.rowIndex] = row;
      object.rowCount++;
    }
    catch(error)
    {
      //throw custom exception to global error handler
			//create error object
			let errorObj = {
				"dashboardId" : "NA",
				"pageName" : "Dashboard-Feature Mapping Screen",
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
    if(object.rows[rowIndex].selectedStatus=='R')
    object.rows[rowIndex].selectedStatus = 'U';

  }

  deleteData(index, id) {
    let object = this;
    if(id != 0) {
      try{
        object.rows[index].selectedStatus = 'D';
        let deleteObj = { "sessionId" : this.sessionId, "dashboardId" : Number(id)}
        object.service.deleteData(deleteObj).subscribe((response:any) => {
          object.enableSave = true;
          this.toastr.info('Data Deleted Successfully', '', { timeOut: 1500 });
          object.display_confirmationbox = 'none';
          object.fetchData();
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
    } else {
      object.rows[index].selectedStatus = 'D';
      object.dashboardFeatureMappingPoints.removeAt(index);
      object.display_confirmationbox = 'none';
    }

  }

  // this is added to get all the dashboards
  getDashBoard(row) {
    let object = this;
    row.dashboards = object.dashBoards;
  }

  fetchData() {
    try{
      let object = this;

      object.service.retreiveData().subscribe((response: any) => {

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
            object.dashboardFeatureMappingPoints.push(this.fb.group({
              id: response[index].id,
              createdBy: response[index].createdBy,
              createdDate: "NA",
              modifiedBy: "NA",
              modifiedDate: "NA",
            }));

            let row: any = {};
            row.selectedDashBoardId = response[index].id;
            row.selectedFeatureIds = response[index].featureData;
            row.towerFeatureId = response[index].autoFeatureId;

            row.selectedFeatureIds = row.selectedFeatureIds.map(Number);
            row.selectedcreatedBy = response[index].createdBy;
            row.selectedModifiedBy = response[index].modifiedBy;
            row.selectedCreatedDate = response[index].createdDate;
            row.selectedModifiedDate = response[index].modifiedDate;
            row.dashboards = [];
            row.selectedStatus='R';//for retrival
            // row.status=true;
            object.getDashBoard(row);

            if(row.selectedcreatedBy == null) {
              row.selectedcreatedBy = "NA";
            } else {
              row.selectedcreatedBy = row.selectedcreatedBy;
            }

            for(let features of object.featureNames){
              if(row.selectedFeatureIds.includes(features.featureId)){
                row[features.featureName]=true
              }else{
                row[features.featureName]=false
              }
            }

            object.rows[++object.rowIndex] = row
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
          "pageName" : "Dashboard Master Screen",
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
      this.dashboadFeatureForm = this.fb.group({
        dashboard_feature_mapping_data: this.fb.array([this.fb.group({
          dashboardName: '',

          createdBy: '',
          created_date: '',
          updated_by: '',
          updated_date: '',
          // operation: 'I',
          id:0
        })])
      })
      let row: any = {};
      object.rowIndex = 0;
      row.dashboardName = undefined;

      row.createdBy = "";
      row.updated_by = "";
      row.updated_date = "";
      row.dashboards = object.dashBoards;
      object.rows[object.rowIndex] = row;
      object.rowCount++;
    } catch(error) {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : "NA",
        "pageName" : "Dashboard-Feature Mapping Screen",
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
      let requestData=[];
      for(let index=1;index<object.rows.length;index++){

        if(object.rows[index].selectedStatus!=undefined&&(object.rows[index].selectedStatus=="U"||object.rows[index].selectedStatus=="I")){
          let _row:any={};

          _row.id=object.rows[index].selectedDashBoardId;


          let featuredIds=[];

          for(let feature of object.featureNames){

            if(object.rows[index][feature.featureName]==true){
              featuredIds.push(feature.featureId);
            }

          }
          _row.operation=object.rows[index].selectedStatus;
          _row.mappings=featuredIds;
          requestData.push(_row);

        }

      }


      let finalRequestData:any={};
      finalRequestData["sessionId"]=this.sessionId;
      finalRequestData["mappings"]=requestData;

      if (this.dashboadFeatureForm.invalid) {//if form is invalid then we wont be sending rows to server,applying validation here

        object.enableSave = true;
        object.toastr.warning('Please Enter the required Fields', '', { timeOut: 1000 })
        return;

      }

      let response: any = {};

      // this will be changes as per loggedin user
      response.sessionId = this.sessionId;
      let data = object.dashboadFeatureForm.value.dashboard_feature_mapping_data;
      let index = 0;
      let array = [];

      for (let y of data) {
        if (!(index == 0 && (!object.noDataPresend))) {
          array.push(y);
        }
        index++;
      }
      response.mappings = array;

      // for (let z of finalRequestData) {
      //   if(z.id == 0) {
      //     z.operation = "I";
      //   }
      // }

      // console.log('finalRequestData')
      // console.log(finalRequestData)

      object.service.saveTowerData(finalRequestData).subscribe((response) => {
        object.enableSave = true;
        this.toastr.info(response[0].value, '', { timeOut: 3000 });
        object.fetchData();
      }, (error) => {
        object.enableSave = true;
        this.toastr.error('Some unexpected Error have occurred', '', { timeOut: 2000 });
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId" : "NA",
          "pageName" : "Dashboard-Feature Mapping Screen",
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
        "pageName" : "Dashboard-Feature Mapping Screen",
        "errorType" : "warn",
        "errorTitle" : "Data Error",
        "errorDescription" : error.message,
        "errorObject" : error
      }

      throw errorObj;
    }

  }

  //these all function will lazy load all drop down data
  populateAllDropDown() {

    try{
      let object = this;
      object.dashboardDropDownLoaded = false;

      //this three service populate dropdowns async. and then after getting response they check
      object.service.getDashBoards().subscribe((response: any) => {
        object.dashBoards = response;

        object.dashboardDropDownLoaded = true//since we have all dashboard list
        object.notify.emit('dataLoadedSuccessFully');
      },(error)=>{
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId" : "NA",
          "pageName" : "KPI Maintenance Screen",
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
        "pageName" : "KPI Maintenance Screen",
        "errorType" : "warn",
        "errorTitle" : "Data Error",
        "errorDescription" : error.message,
        "errorObject" : error
      }

      throw errorObj;
    }

  }

  checkBoxValue(feature,fId,row){
    let i = this.addedFeatureIds.indexOf(fId);

    if(row.selectedStatus==undefined)row.selectedStatus='I';
    else
    row.selectedStatus='U';

    if(feature == true){
      row[fId.featureName]=true;
      //  this.addedFeatureIds.push(fId);
    } else {
      row[fId.featureName]=false;
      //this.addedFeatureIds.splice(i,1);
    }

  }

  getFeatureName() {
    try{
      let object = this;
      object.service.retreiveFeatureData().subscribe((response: any) => {

        object.featureNames = response;
        object.featuresCount=response.length;
        object.fetchData();
      },(error)=>{
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId" : "NA",
          "pageName" : "KPI Maintenance Screen",
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
        "pageName" : "KPI Maintenance Screen",
        "errorType" : "warn",
        "errorTitle" : "Data Error",
        "errorDescription" : error.message,
        "errorObject" : error
      }

      throw errorObj;
    }

  }

  checkCheckedStatus(row,featuredId):boolean{
    let result;

    result=row.map[featuredId];

    return true;
  }

  resetBtnHandler(index,did){
    let object = this;
    object.display_confirmationbox = 'block';
    object.selecteddashboardid = did;
    object.selectedindex = index;
  }

  resetConfirmYes(flag){
    let did = (<HTMLInputElement>document.getElementById("did")).value;
    let ind = (<HTMLInputElement>document.getElementById("ind")).value;
    if(flag) {
      this.deleteData(ind,did);
    }
  }

  closeModalDialog() {
    this.display_confirmationbox = 'none';
  }



}


