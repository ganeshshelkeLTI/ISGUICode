
/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:server-input-my-data.component.ts **/
/** Description: This file is created to get the ladning page data, filter related data and compare/input my data with drill downs (Chart) **/
/** Created By: 10651577  Created Date: 28/09/2018 **/
/** Update By:  10650919  Update Date:  03/10/2018 **/
/*******************************************************/


import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { EnterCompareDataTowersService} from '../services/enter-compare-data-towers.service';
import { GenerateScenarioService } from '../services/generate-scenario.service';

import { CIOGeneralTabCompanyDetailService } from '../services/ciogeneral-tab-company-detail.service';

import { ToastrService } from 'ngx-toastr';
import { MapSourceCodeDataValues } from '../map-source-code-data-values';

import {
  CioheaderdataService
} from '../services/cioheaderdata.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-input-my-data',
  templateUrl: './server-input-my-data.component.html',
  styleUrls: ['./server-input-my-data.component.css']
})

export class ServerInputMyDataComponent implements OnInit {

  private scenarioData: any;
  private mapdata: any;

  public inputData: any;
  public isFormValid: boolean = true;
  public showErrorMesssage: boolean = false;
  showDiv:boolean = false;
  public pageId: any; // have not used yet
  validateAvailabilityPercentage: boolean = false;
  validateDollar: boolean = false;
  validateHash: boolean = false;
  private indexSrcCodeMap:Map<string,number>;;

  loginUserId: string = "%27E5E8339B-0620-4377-82FE-0008029EDC53%27";
  dashboardId: string;
  private scenarios: any[] = [];

  scenarioDataObj = [];
  mainFrameInputData: any;
  private selectedScanrio: any;
  enteredDataObj: any;
  public scenarioNameText:string;
  dataLoaded:boolean;
  private regions:any=[];
  private countries: any = [];
  private years:any[]=[];
  private currencies:any[]=[];
  public showSelectedOptionFlg: boolean = false;

  //There are some services of CIODashBoard which are reused for mainframe
  constructor( private generateScenarioService: GenerateScenarioService, private genericEnterCompare:EnterCompareDataTowersService, private http:HttpClient,private commonService: CioheaderdataService, private toastr: ToastrService,private generalTabService: CIOGeneralTabCompanyDetailService,private router:Router) {
    let object=this;
    this.dashboardId="3";
    object.indexSrcCodeMap=new Map<string,number>();
    object.dataLoaded=false;
    object.selectedScanrio="0"
  }

  ngOnInit() {
    let object=this;
    object.getInputEnterData();
    object.getScenariosList(this.selectedScanrio);

object.router.events.subscribe((url)=>{

})

  }

  //function for getting scenario list & appending new scenario
  getScenariosList(defaultScarioId) {
    let object = this;
    object.genericEnterCompare.setPopID(3);
    object.genericEnterCompare.getScanrioData().subscribe((response: any) => {
      object.scenarios = [];
      for (let key in response) {
        let scenario: any = {};
        scenario.key = key
        scenario.value = key+"_"+response[key];
        scenario.name = response[key]; //adding name in scenarioList
        object.scenarios.push(scenario);
      }
      object.selectedScanrio = defaultScarioId;
      try{
        object.scenarioNameText = object.scenarios[object.selectedScanrio-1].name;
      }catch(error){
         //throw custom exception to global error handler
  //create error object
  let errorObj = {
    "dashboardId" : this.pageId,
    "pageName" : "Non CIO Server Tower Landing Screen",
    "errorType" : "warn",
    "errorTitle" : "Data Error",
    "errorDescription" : error.message,
    "errorObject" : error
  }

  throw errorObj;
      }
    })
  }

  //get saved scenario data of selected Scanrio Id
  getScenarioDataById() {
    let object = this;
    //this is done becuz when i reset form,i will lose selectedScenrio Id
    let scenarioID = object.selectedScanrio;
    //this means that there is no present or this function is first hit to server
    try{
      object.resetAll();
    }catch(error){
       //throw custom exception to global error handler
  //create error object
  let errorObj = {
    "dashboardId" : this.pageId,
    "pageName" : "Non CIO Server Tower Landing Screen",
    "errorType" : "warn",
    "errorTitle" : "Data Error",
    "errorDescription" : error.message,
    "errorObject" : error
  }

  throw errorObj;
    }
    object.selectedScanrio = scenarioID;//after reset again reseting selectedScenario


    if (object.selectedScanrio == 0) {
      object.scenarioNameText="";
      return;
    }

    let requestedParam = {
      "userID": object.loginUserId,
      "dashboardId": "2",
      "scenarioId": []
    }
    //get id from emitter and assign to "savedScenarioId"
    //setting name of selected Scenario
    try{
      // object.scenarioNameText = object.scenarios[object.selectedScanrio-1].name;
      object.scenarioNameText =object.getScenarioName(object.selectedScanrio);
    }catch(error){
       //throw custom exception to global error handler
  //create error object
  let errorObj = {
    "dashboardId" : this.pageId,
    "pageName" : "Non CIO Server Tower Landing Screen",
    "errorType" : "warn",
    "errorTitle" : "Data Error",
    "errorDescription" : error.message,
    "errorObject" : error
  }

  throw errorObj;
    }

    object.generateScenarioService.getSavedScenarioDataToPopulate(object.dashboardId, object.loginUserId, object.selectedScanrio).subscribe((response) => {
      let index=0;
      let length = object.inputData.MainframeInput.NA.length;

      while(index<length){
        object.inputData.MainframeInput.NA[index].src_code_value=response.MainframeInput.NA[index].src_code_value;

        index++;
      }
      index=0;
      response.GeneralInformation.NA=response.GeneralInformation.NA.slice(1,5);
      length=response.GeneralInformation.NA.length;

      while(index<length){
        object.inputData.GeneralInformation.NA[index].src_code_value=response.GeneralInformation.NA[index].src_code_value;
        index++;
      }




    })
  }

  getScenarioName(key):string{
    let object=this;
    let name="";
    for(let scenario of object.scenarios){
      if(scenario.key==key){
        name=scenario.name;
      }
    }

    return name;
  }


  getAllRegion(index){
    let object=this;
    object.generalTabService.getAllRegion().subscribe((response:any)=>{
      object.inputData.GeneralInformation.NA[index].dropDown=response.region;
      object.regions=response.region;
    },(error)=>{
      //throw custom exception to global error handler
  //create error object
  let errorObj = {
    "dashboardId" : this.pageId,
    "pageName" : "Non CIO Server Tower Landing Screen",
    "errorType" : "Fatal",
    "errorTitle" : "Web Service Error",
    "errorDescription" : error.message,
    "errorObject" : error
  }

  throw errorObj;
    })
  }

  getAllCountries(index){
    let object=this;
    object.generalTabService.getAllCountry().subscribe((response:any)=>{
      object.inputData.GeneralInformation.NA[index].dropDown=response.country;
      object.countries=response.country;
    },(error)=>{
      //throw custom exception to global error handler
  //create error object
  let errorObj = {
    "dashboardId" : this.pageId,
    "pageName" : "Non CIO Server Tower Landing Screen",
    "errorType" : "Fatal",
    "errorTitle" : "Web Service Error",
    "errorDescription" : error.message,
    "errorObject" : error
  }

  throw errorObj;
    })
  }


  getAllReportingCurrency(index){
    let object=this;

    object.generalTabService.getAllCurrency().subscribe((response:any)=>{
      object.inputData.GeneralInformation.NA[index].dropDown=response.currencyExchange;
      object.currencies=response.currencyExchange;
    },(error)=>{
      //throw custom exception to global error handler
  //create error object
  let errorObj = {
    "dashboardId" : this.pageId,
    "pageName" : "Non CIO Server Tower Landing Screen",
    "errorType" : "Fatal",
    "errorTitle" : "Web Service Error",
    "errorDescription" : error.message,
    "errorObject" : error
  }

  throw errorObj;
    })

  }



  checkValidation(srccode) {
    let data = this.inputData;
    let length = data.MainframeInput.NA.length;
    let i = 0;
    let value_format;
    while(i < length) {
      value_format = data.MainframeInput.NA[i].value_format;
      if(value_format == "%" && srccode > 100) {
        this.validateAvailabilityPercentage=true;
      } else {
        this.validateAvailabilityPercentage=false;
      }
      if(value_format == "#" && srccode <= 0) {
        this.validateHash=true;
      } else {
        this.validateHash=false;
      }
      if(value_format == "$" && srccode <= 0) {
        this.validateDollar=true;
      } else {
        this.validateDollar=false;
      }
      i++;
    }
  }

  saveAndCompare() {
    this.scenarioDataObj = [];
    this.enteredDataObj = {
      scenario: {
        clientID: "",
        projectId: "",
        userId: "",
        scenarioID: null,
        scenarioName: null,
        dashboardID: null,
        createdDate: null,
        updatedDate: null,
        createdBy: null,
        updatedBy: null
      },
      kpi_maintenance_data: [{
        key: "",
        value: "",
        note: null
      }]
    };
    let i: number;
    let j: number;
    let subCatValue = [];
    let subcategory = [];
    let length1: any;
    let length2: any;
    // this.availablityPercentage =
    let category = Object.values(this.inputData);
    // return false;

    length1 = Object.keys(this.inputData).length;
    for (i = 0; i < length1; i++) {
      subcategory = Object.values(category[i]);
      length2 = Object.keys(subcategory).length;
      for (j = 0; j < length2; j++) {
        subCatValue = Object.values(subcategory[j]);
        for (let obj of subCatValue) {
          let t1: any = {};
          t1.key = obj.src_code;
          t1.value = obj.src_code_value;
          //once save note functionality done append value of each src code note here
          t1.note = obj.notes;
          this.scenarioDataObj.push(t1);
        }
      }
    }

    let selectedScanrio = this.selectedScanrio;
    if (selectedScanrio == 0) {
      selectedScanrio = null;
    }
    this.enteredDataObj.scenario.dashboardID = 2;
    this.enteredDataObj.scenario.userId = "E5E8339B-0620-4377-82FE-0008029EDC53";
    this.enteredDataObj.scenario.projectId = "679D007C-C668-40E1-A60E-06391512F388"; //ISG
    this.enteredDataObj.scenario.clientID = "E5E8339B-0620-4377-82FE-0008029EDC5311";
    this.enteredDataObj.scenario.scenarioID = selectedScanrio;
    this.enteredDataObj.scenario.scenarioName = this.scenarioNameText;

    this.enteredDataObj.kpi_maintenance_data = this.scenarioDataObj;

    this.generateScenarioService.savedNewScenario(this.enteredDataObj).subscribe((response) => {
      let message;
      if (selectedScanrio == null) {
        message = "Saved";
        //updating ScenarioList After Updating
        this.getScenariosList(response.value);
      } else {
        message = "updated";
        this.getScenariosList(response.value);
      }
      this.toastr.info('Scenario id ' + response.value + " " + message, '', {
        timeOut: 7000,
        positionClass: 'toast-top-center'
      });

    });

   // this.mainframeSharedService.setData(this.scenarioDataObj);
    //this.mainframeSharedService.getEmitter().emit('callFunction');
  }

  toggle(){
    this.showDiv = !this.showDiv;
  }
  closeEnterDataModal(){
    
  }

  //function for fetching data from service
  getInputEnterData() {
    let object=this;
    this.genericEnterCompare.getInputData().subscribe((data:any)=>{
      this.inputData = data;
      //slicing it since
      object.inputData.GeneralInformation.NA=object.inputData.GeneralInformation.NA.slice(1,5);
      object.populateGeneralTab();

    });
  }

  populateGeneralTab(){
    let object=this;
    try{
      let index=0;
      let length=object.inputData.GeneralInformation.NA.length;
      while(index<length){

        if(object.inputData.GeneralInformation.NA[index].src_code=="ICE002"){
          object.indexSrcCodeMap["ICE002"]=index;
          object.getAllReportingCurrency(index);}
          if(object.inputData.GeneralInformation.NA[index].src_code=="TD0100"){
            object.indexSrcCodeMap["TD0100"]=index;
            object.getAllYear(index);
          }if(object.inputData.GeneralInformation.NA[index].src_code=="TD0110"){
            object.indexSrcCodeMap["TD0110"]=index;
            object.getAllRegion(index);
          }if(object.inputData.GeneralInformation.NA[index].src_code=="TD0120"){
            object.indexSrcCodeMap["TD0120"]=index;
            object.getAllCountries(index);
          }
          index++;
        }

        object.dataLoaded=true;
      }catch(error){
        //throw custom exception to global error handler
  //create error object
  let errorObj = {
    "dashboardId" : this.pageId,
    "pageName" : "Non CIO Server Tower Landing Screen",
    "errorType" : "warn",
    "errorTitle" : "Data Error",
    "errorDescription" : error.message,
    "errorObject" : error
  }

  throw errorObj;
      }


    }

    getAllYear(index:number){
      let object=this;
      let yearDropDown = [];

      // for (var x = 1900; x <= 2100; x++) {
        for (var x = 2100; x >= 1900; x--) {
        let year: any = {};
        year.key = x;
        year.value = x;
        yearDropDown.push(year);
      }
      object.inputData.GeneralInformation.NA[index].dropDown = yearDropDown;


    }



    //resetAll all fields
    resetAll(){
      let object=this;
      object.selectedScanrio=0;
      object.scenarioNameText="";
      try{
        let index = 0;
        let length = object.inputData.GeneralInformation.NA.length;
        //reseting general tab

        while (index < length) {
          object.inputData.GeneralInformation.NA[index].src_code_value=null;
          index++;
        }
        index = 0;
        length = object.inputData.MainframeInput.NA.length;
        //reseting MainframeInforamtion
        while (index < length) {
          object.inputData.MainframeInput.NA[index].src_code_value = null;
          index++;
        }

        while (index < length) {
          object.inputData.MainframeInput.NA[index].src_code_value = null;
          index++;
        }
        //reseting   ITOperationsHeadcount&Locations ta


      }catch(error){
         //throw custom exception to global error handler
  //create error object
  let errorObj = {
    "dashboardId" : this.pageId,
    "pageName" : "Non CIO Server Tower Landing Screen",
    "errorType" : "warn",
    "errorTitle" : "Data Error",
    "errorDescription" : error.message,
    "errorObject" : error
  }

  throw errorObj;
      }



    }


  }
