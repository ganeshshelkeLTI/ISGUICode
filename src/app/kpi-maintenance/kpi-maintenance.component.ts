/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:kpi-maintenance.component.ts **/
/** Description:  **/
/** Created By: 106##### Created Date: 28/09/2018 **/
/** Update By:  10650919 Update Date:  03/10/2018 **/
/*******************************************************/

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

import { MaintenanceData, SellingPoint } from '../maintenance-data';
import { KpiMaintenanceService } from '../services/kpi-maintenance.service';
import { EventEmitter } from 'events';
import { ToastrService } from 'ngx-toastr';

import { NgxSpinnerService } from 'ngx-spinner';
import { VALID } from '@angular/forms/src/model';
@Component({
  selector: 'app-kpi-maintenance',
  templateUrl: './kpi-maintenance.component.html',
  styleUrls: ['./kpi-maintenance.component.css']
})
export class KpiMaintenanceComponent implements OnInit {

  private visibilityStatus: boolean = true;
  private rows: any[] = [];
  private rowIndex: number;
  private dashBoards: any[] = [];
  private kpiData: any[] = [];
  private category: any[] = [];
  private subCategory: any[] = [];
  private rowCount: number = 0;
  private dashBoardList: any[] = [];
  private selectedDashBoardItemId: any;//this is for select tag above rows
  dataLoaded: boolean;
  // private dashBoardDropDownLoaded:boolean;
  submitted = false;
  private notify: EventEmitter = new EventEmitter();//this is event Emitter emitted on
  temp;
  private noDataPresend: boolean = false;
  private rowsDeleted = [];//keeping a record of deleted row
  //this is done because when we delete a row,it gets hidden "It is not deleted at that time"
  //we will keep a record of rows that are deleted and will delete them after getting response from form

  //the below three properties will check if three dropdown are loaded for lazy loading
  private dashboardDropDownLoaded: boolean;
  private kpiDropDownLoaded: boolean;
  private categoryDropDownLoaded: boolean;
  private enableSave: boolean;

  constructor(private fb: FormBuilder, private service: KpiMaintenanceService, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  productForm: FormGroup;

  ngOnInit() {
    let object = this;
    object.dataLoaded = false;
    object.enableSave = true;
    //populateDashBoard will populate select tag above all rows*
    object.populateDashBoard();


    object.notify.on('dataLoadedSuccessFully', function () {

      //populate rows if you have populated all three dropdowns
      if (object.dashboardDropDownLoaded && object.categoryDropDownLoaded && object.kpiDropDownLoaded) {

        object.fetchData(object.selectedDashBoardItemId);
      }
    });
  }

  updateKpidata() {
    let object = this;
    
    object.populateAllDropDown();

  }

  get dataPoints() {
    return this.productForm.get('kpi_maintenance_data') as FormArray;
  }

  //invoked on adding new row
  addData() {

    try{
    this.dataPoints.push(this.fb.group({
      dashboard_id: ['1', Validators.required],
      src_code: ['', Validators.required],
      desc: ['', Validators.required],
      short_desc: '',
      input_type: ['', Validators.required],
      valueFormat: '',
      visibility: ['', Validators.required],
      indicator: ['', Validators.required],
      mapped_kpi_group: [[], Validators.required],
      category: [[], Validators.required],
      sub_category: [[], Validators.required],
      is_visible: 1,
      operation: 'I',
      id: 0

    }));
    let object = this;
    
    
    let row: any = {};
    row.selectedSubCategory = "NA";
    row.kpidata = object.kpiData;//populating lazy loaded kpi data
    row.category = object.category;//populating lazy loaded category
    row.subCategory = [];//since sub-category depends on selected category
    row.dashboards = object.dashBoards;//populating lazy loaded dashboards
    row.selectedKpi = row.kpidata.length === 0 ? undefined : object.kpiData[0].kpiGroupID;
    row.selectedCategory = object.category.length === 0 ? undefined : object.category[0].categoryID;//default category

    row.selectedDashBoardId = object.selectedDashBoardItemId;//current select DashBoard
    row.selectedStatus = 'I'//default selectedStatus
    row.isHidden = false;
    row.selectedVisibility = "C";
    row.selectedIndicator = "R";
    row.selectedInputValue = "#";//default value is number
    row.showEye = true;
    object.rows[++object.rowIndex] = row;
    // object.updateDashBoard(object.rowIndex);

    object.rowCount++;

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

  //on delete click,
  //Please be aware it wont delete row ,it will just hide it
  deleteData(index) {
//console.log(index);
    try{
    let object = this;
    object.rows[index].selectedStatus = 'D';
    object.rows[index].isHidden = true;//hide
   
object.dataPoints.at(index).clearAsyncValidators();
object.dataPoints.at(index).clearValidators();
object.dataPoints.at(index).markAsPristine();
//console.log(object.rows[index]);
//object.dataPoints.at(index).clearValidators();
object.dataPoints.at(index).get('src_code').clearValidators();
object.dataPoints.at(index).get('src_code').updateValueAndValidity();

object.dataPoints.at(index).get('desc').clearValidators();
object.dataPoints.at(index).get('desc').updateValueAndValidity();

object.dataPoints.at(index).get('input_type').clearValidators();
object.dataPoints.at(index).get('input_type').updateValueAndValidity();

//object.dataPoints.at(index).updateValueAndValidity();
//console.log(object.dataPoints.at(index));
//object.dataPoints.removeAt(index);
//console.log(row);
    object.rowsDeleted.push(index);
    }
    catch(error)
    {
//console.log(error);
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

  //sending all row data from forms to server
  saveData(): void {

    try{
    let object = this;
    object.enableSave = false;

    this.submitted = true;
    if (this.productForm.invalid) {//if form is invalid then we wont be sending rows to server,applying validation here

      object.enableSave = true;
      object.toastr.warning('Please Enter the required Fields', '', { timeOut: 1000 })
      return;

    }

    let request: any = {};
    // response.logged_In_user = "E5E8339B-0620-4377-82FE-0008029EDC53";//subject to change
    request.sessionId = JSON.parse(localStorage.getItem('userloginInfo')).userDetails.sessionId;
    request.dashboard_id = parseInt(object.selectedDashBoardItemId);

    let data = object.productForm.value.kpi_maintenance_data;

    let index = 0;
    let array = [];
    //making neccessary changes in forms row,like parse to int,appending null instead of NA in each row etc etc
    for (let y of data) {
      y.category = parseInt(y.category);
      y.dashboard_id = parseInt(y.dashboard_id);
      if (y.sub_category == "NA") y.sub_category = null;
      else
        y.sub_category = parseInt(y.sub_category);

      if (y.mapped_kpi_group == "NA") y.mapped_kpi_group = null;
      if (y.is_visible === true) y.is_visible = 1;
      if (y.is_visible === false) y.is_visible = 0;


      if (!(index == 0 && (!object.noDataPresend))) {
        array.push(y);
      }



      index++;
    }
    request.kpi_maintenance_data = array;

// console.log(request);   
    //finally sending rows to server
    object.service.sendKpiData(request).subscribe((response) => {
      object.enableSave = true;
      this.toastr.info('Data Saved Successfully', '', { timeOut: 1500 });
      object.populateAllDropDown();//re-populating all rows again


    }, (error) => {
      object.enableSave = true;
      this.toastr.error('Some unexpected Error have occurred', '', { timeOut: 2000 });
      //throw custom exception to global error handler
			//create error object
			let errorObj = {
				"dashboardId" : "NA",
				"pageName" : "KPI Maintenance Screen",
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
				"pageName" : "KPI Maintenance Screen",
				"errorType" : "warn",
				"errorTitle" : "Data Error",
				"errorDescription" : error.message,
				"errorObject" : error 
			}

			throw errorObj; 
    }

  }

  //the below two function will be invoked when user click on row's dashboard select tag

  //call on click of dasboard dropdown(select) row*
  updateCategory(rowIndex) {

    try{
    let object = this;
    object.rows[rowIndex].selectedStatus = 'U';

    
    let dashBoradId = object.rows[rowIndex].selectedDashBoardId;
    
    object.service.getCategory(dashBoradId).subscribe((response) => {

    
      object.rows[rowIndex].category = response;


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
    });

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

  //call on click of category dropdown(select) row*
  updateSubCategory(rowIndex) {
    try{
    let object = this;
    object.rows[rowIndex].selectedStatus = 'U';

    let categoryId = object.rows[rowIndex].selectedCategory;
    object.service.getSubCategory(categoryId).subscribe((response) => {

      
      object.rows[rowIndex].subCategory = response;


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
    });
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

  createDynmicRow(): any {

  }

  //this will be populate
  fetchData(dashBoardId) {

    try{
    let object = this;

    object.service.retreiveData(dashBoardId).subscribe((response: any) => {

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
          object.dataPoints.push(this.fb.group({
            dashboard_id: response[index].dashboard_id,
            src_code: response[index].src_code,
            desc: response[index].desc,
            short_desc: response[index].short_desc,
            input_type: response[index].input_type,
            visibility: response[index].visibility,
            indicator: response[index].indicator,
            mapped_kpi_group: [],
            category: [],
            sub_category: [],
            is_visible: response[index].is_visible,
            operation: 'O',
            id: response[index].id,
            valueFormat: ''//subject to change
          }));
          let row: any = {};

          row.is_visible = response[index] === 1 ? true : false;
          row.selectedSubCategory = response[index].sub_category == null ? "NA" : response[index].sub_category;
          row.selectedKpi = response[index].dashboard_id;
          row.dashboards = [];
          row.kpidata = [];//selectedDashBoardId
          row.category = [];
          row.subCategory = [];
          row.selectedDashBoardId = response[index].dashboard_id;
          row.selectedCategory = response[index].category == null ? "NA" : response[index].category;
          row.selectedInputValue = response[index].valueFormat;
          row.showEye = response[index].is_visible === 0 ? false : true;

          
          row.selectedVisibility = response[index].visibility;
          row.selectedIndicator = response[index].indicator;
          row.selectedKpi = response[index].mapped_kpi_group;
          row.selectedStatus = 'O'
          row.isHidden = false;
          object.getCategory(row, response[index].category);
          object.getKpiData(row, response[index].dashboard_id);

          if (response[index].category != null)
            object.getSubCategory(row, response[index].category);
          object.getDashBoard(row);
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

  //this will be invoked when user will change dashboard value,this function will
  //update/populate Kpi select tag on basis of selected dashboard
  updateKpi(pointIndex) {

    try{
    let object = this;
    object.rows[pointIndex].selectedStatus = 'U';
    
    let kpiId = object.rows[pointIndex].selectedDashBoardId;
    object.service.getKpiGroup(kpiId).subscribe((response) => {

      object.rows[pointIndex].kpidata = response;


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
    });
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

  updateDashBoard(rowIndex) {

    try{
    let object = this;
    object.service.getDashBoards().subscribe((response: any) => {

      object.rows[rowIndex].dashboards = response;
      object.rows[rowIndex].selectedDashBoardId = response[0].dashboardID;

      
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

  //these all function will lazy load all drop down data
  populateAllDropDown() {

    try{
    let object = this;
    object.dashboardDropDownLoaded = false;
    object.kpiDropDownLoaded = false;
    object.categoryDropDownLoaded = false;

    //this three service populate dropdowns async. and then after getting response they check
    object.service.getDashBoards().subscribe((response: any) => {
      object.dashBoards = object.allowedDashBoardList(response);
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

    object.service.getKpiGroup(object.selectedDashBoardItemId).subscribe((response: any) => {
      object.kpiData = response;
      object.kpiDropDownLoaded = true;//since we have loaded kpi
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
    object.service.getCategory(object.selectedDashBoardItemId).subscribe((response: any) => {
      object.category = response;
      object.categoryDropDownLoaded = true;//same as above
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

  //for initForm
  initForm() {

    try{
    let object = this;
    this.productForm = this.fb.group({
      kpi_maintenance_data: this.fb.array([this.fb.group({
        dashboard_id: '1',
        src_code: '',
        desc: '',
        short_desc: '',
        input_type: '',
        valueFormat: '',
        visibility: '',
        indicator: '',
        mapped_kpi_group: [],
        category: [],
        sub_category: [],
        is_visible: 1,
        operation: 'I',
        id: 0
      })])
    })
    let row: any = {};
    object.rowIndex = 0;
    row.selectedDashBoardId = undefined;
    row.selectedKpi = undefined;
    row.selectedCategory = "NA";
    row.selectedSubCategory = "NA";
    row.kpidata = undefined;
    row.dashboards = object.dashBoards;
    row.selectedDashBoardId = "NA";
    row.category = [];
    row.subCategory = [];
    row.isHidden = false;
    row.selectedStatus = 'I';
    row.showEye = true;
    object.rows[object.rowIndex] = row;
    object.rowCount++;

  }catch(error)
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

  //tested:ok,invoked on populating row getCategory ,getKpiData,getCategory will return data already loaded
  getDashBoard(row) {
    let object = this;
    row.dashboards = object.dashBoards;

  }

  getKpiData(row, kpiId) {
    let object = this;
    row.kpidata = object.kpiData;
  }

  getCategory(row, categoryId) {
    let object = this;
    row.category = object.category;
  }

  //since subcategory depends upon category id,so we have to hit service for every row to populate for subcategory select tag
  getSubCategory(row, subCategoryId) {
    let object = this;
    object.service.getSubCategory(subCategoryId).subscribe((response: any) => {

      if (response.length == 0) {
        row.selectedSubCategory = "NA";
        row.subCategory = [];
      } else
        row.subCategory = response;
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

  //this will populate above row select tag*
  populateDashBoard() {
    let object = this;
    object.service.getDashBoards().subscribe((response: any) => {
  
    
    

      object.dashBoardList = object.allowedDashBoardList(response);
      console.log('object.dashBoardList', object.dashBoardList);
      object.selectedDashBoardItemId = object.dashBoardList[0].dashboardID;//select CIO dashboard as selected default DashBoardID(only for landing page)
      object.populateAllDropDown();//after population above dashboard dropdown,populate other dropdown

     
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

  //this will update RowStatus of each row on ,please refer component html
  updateRowStatus(rowIndex) {
    let object = this;

    object.rows[rowIndex].selectedStatus = 'U';
    
  }

  changeRowVisibility(rowIndex) {
    let object = this;
    object.rows[rowIndex].showEye = !object.rows[rowIndex].showEye;
  }

  allowedDashBoardList(dashboards):any{
    let alloweddashboardList=[];
    let allowedDashBoardMap=JSON.parse(localStorage.getItem('userloginInfo')).kpiAccess;
    for(let dashboard of dashboards){
  
if(allowedDashBoardMap[dashboard.dashboardName]!=undefined&&allowedDashBoardMap[dashboard.dashboardName]==true){
  //this is done for hiding digital and dadada dashboard in dashboard list
  if(dashboard.dashboardID != 14 && dashboard.dashboardID != 65){
    alloweddashboardList.push(dashboard);
  }
  
}

    }
    return alloweddashboardList;
  }
}
