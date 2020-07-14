/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:enter-my-data-window-service.component.ts **/
/** Description: This file is created to compare input my data on the landing page and generate new scenario and save them  **/
/** Created By: 10651577  Created Date: 28/09/2018 **/
/** Update By:  10651577  Update Date:  28/09/2018 **/
/** Developed at:  **/
/*******************************************************/
import {getCurrencySymbol} from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { EnterCompareDataTowersService} from '../services/enter-compare-data-towers.service';
import { GenerateScenarioService } from '../services/generate-scenario.service';
import { WindowInputMydataSharedService } from '../services/servers/windows/window-input-mydata-shared.service';

import { CIOGeneralTabCompanyDetailService } from '../services/ciogeneral-tab-company-detail.service';

import { ToastrService } from 'ngx-toastr';
import { MapSourceCodeDataValues } from '../map-source-code-data-values';
import { PrivilegesService } from '../services/privileges.service';

import {
  WindowsEditAndCompareSharedService
} from '../services/servers/windows/windows-edit-and-compare-shared.service';

import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';
import { TextMaskModule } from 'angular2-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { UpdateScenarioListNotificationServiceService } from '../services/update-scenario-list-notification-service.service';

declare var $: any;

//for decimal numbers
const decimalNumberMask = createNumberMask({
  prefix: '',
  suffix: '',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ',' ,
  allowDecimal: true,
  decimalSymbol: '.',
  decimalLimit: 6,
  integerLimit: null,
  allowNegative: false,
  allowLeadingZeroes: true
});

//mask for integer numbers
const numberMask = createNumberMask({
  prefix: '',
  suffix: '',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ',' ,
  allowDecimal: false,
  integerLimit: null,
  allowNegative: false,
  allowLeadingZeroes: true
});

@Component({
  selector: 'app-enter-my-data-windows',
  templateUrl: './enter-my-data-windows.component.html',
  styleUrls: ['./enter-my-data-windows.component.css']
})
export class EnterMyDataWindowsComponent implements OnInit,OnDestroy {

  numberMask = numberMask;
decimalNumberMask = decimalNumberMask;

  private scenarioData: any;
  private mapdata: any;

  public windowsData: any;
  public isFormValid: boolean = true;
  public showErrorMesssage: boolean = false;
  showDiv:boolean = false;
  public pageId: any; // have not used yet
  validateAvailabilityPercentage: boolean = false;
  validateDollar: boolean = false;
  validateHash: boolean = false;
  private indexSrcCodeMap:Map<string,number>;
  private disabledStatus: any[] = [];

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
  errorMessage:string;
  private disableSaveAndCompare:boolean;
  isResetRequired:boolean = false;
  private sourceCurrencyMap:Map<string,string>;
  confirmBoxResetFlag:boolean = false;
  confirmBoxCloseFlag:boolean = false;
  private showRestBox:boolean;
  public sessionId: string;
  public userdata: any;
  public emailId: any;
  privilegesObject:any;
  public showSelectedOptionFlg: boolean = false;
  private currencyMap:Map<string,string>;
  isDeleteAllowed: boolean = false;
  confirmBoxDeleteFlag: boolean = false;
  public isCopyEnabled: boolean = false;

  //There are some services of CIODashBoard which are reused for mainframe
  constructor( private generateScenarioService: GenerateScenarioService, private genericEnterCompare:EnterCompareDataTowersService, private http:HttpClient, private toastr: ToastrService, private windowSharedService: WindowInputMydataSharedService, private generalTabService: CIOGeneralTabCompanyDetailService,private windowsEditAndCompareSharedService:WindowsEditAndCompareSharedService, private loginDataBroadcastService: LoginDataBroadcastService,private privilegesService:PrivilegesService,private updateScenarioListNotificationServiceService: UpdateScenarioListNotificationServiceService) {
    let object=this;
    this.dashboardId="3";
    object.indexSrcCodeMap=new Map<string,number>();
    object.dataLoaded=false;
    object.selectedScanrio="0"
    object.genericEnterCompare.setPopID(3);
    object.errorMessage="";
    object.isFormValid=true;
    object.disableSaveAndCompare=true;
    object.sourceCurrencyMap=new Map<string,string>();
    object.activateShowBox(false);
    let loginSharedData = object.loginDataBroadcastService.getEmitter();
    loginSharedData.on('setLoginData', function () {
      object.getUserLoginInfo();
    });
    object.privilegesObject=object.privilegesService.getData();

      object.privilegesService.getEmitter().on('updatePrivileges',function(){
      object.privilegesObject=object.privilegesService.getData();
        });

    //update scenariolist after deletion from compare modal
    updateScenarioListNotificationServiceService.getEmitter().on('updateWindowsScenarioListAfterDeletion', function(){
      object.getScenariosList(0);
    });    
  }

  getUserLoginInfo() {
    let _self = this;
    _self.userdata = _self.loginDataBroadcastService.get('userloginInfo');
    _self.emailId = _self.userdata['userDetails']['emailId'];
    _self.sessionId = _self.userdata['userDetails']["sessionId"];
  }

  ngOnInit() {
    let object=this;

    object.isCopyEnabled = false;
    object.getUserLoginInfo();
    object.isDeleteAllowed = false;
    object.loginUserId = object.sessionId;

    let data=object.windowsEditAndCompareSharedService.getData();
    if(data!=undefined){

    }

    object.windowsEditAndCompareSharedService.getEmitter().on('serverdataChange',function(){
      let scenarioID=object.windowsEditAndCompareSharedService.getData().selectedScanrio;

      if(scenarioID==0){
        object.selectedScanrio=0;
        object.scenarioNameText="";
        object.resetAll();
      }else{
        object.selectedScanrio=scenarioID;
        object.getScenarioDataById();
      }


    })

    this.getInputEnterData();

    this.getScenariosList(this.selectedScanrio);
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
      object.scenarios.reverse();
      object.selectedScanrio = defaultScarioId;
      try{
        object.scenarioNameText = object.getScenarioName(object.selectedScanrio);
      }catch(error){
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId" : this.pageId,
          "pageName" : "Non CIO Windows Tower Input My Data Screen",
          "errorType" : "warn",
          "errorTitle" : "Data Error",
          "errorDescription" : error.message,
          "errorObject" : error
        }

        throw errorObj;
      }
      if(this.isResetRequired){
        this.resetAll();
      }
    },(error)=>{
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : this.pageId,
        "pageName" : "Non CIO Windows Tower Input My Data Screen",
        "errorType" : "error",
        "errorTitle" : "Web Service Error",
        "errorDescription" : error.message,
        "errorObject" : error
      }

      throw errorObj;
    })
  }
  //as name suggests it will intercept Changes of general tab
  interceptGeneralTabChanges(srcCode){
    let object=this;
    object.activateShowBox(true);
    if(srcCode=="TD0110"){
      object.windowsData.GeneralInformation.NA[object.indexSrcCodeMap["TD0120"]].src_code_value=null;
      object.windowsData.GeneralInformation.NA[object.indexSrcCodeMap["TD0120"]].dropDown=[];

      object.getCountryByRegion(object.indexSrcCodeMap["TD0120"],object.windowsData.GeneralInformation.NA[object.indexSrcCodeMap["TD0110"]].src_code_value);
    }

    if(srcCode=="ICE002"){
      let value=object.windowsData.GeneralInformation.NA[object.indexSrcCodeMap["ICE002"]].src_code_value;
     
      object.changePlaceHolder(getCurrencySymbol(object.currencyMap[value],"narrow"));
    }
  }


  //get saved scenario data of selected Scanrio Id
  getScenarioDataById() {
    let object = this;
    //this is done becuz when i reset form,i will lose selectedScenrio Id
    let scenarioID = object.selectedScanrio;

    //object.getAllCountries(object.indexSrcCodeMap[""]);
    //this means that there is no present or this function is first hit to server
    try{
      object.resetAll();
    }catch(error){
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : this.pageId,
        "pageName" : "Non CIO Windows Tower Input My Data Screen",
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
      "dashboardId": "3",
      "scenarioId": []
    }
    try{
      object.scenarioNameText =object.getScenarioName(object.selectedScanrio);
    }catch(error){
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : this.pageId,
        "pageName" : "Non CIO Windows Tower Input My Data Screen",
        "errorType" : "warn",
        "errorTitle" : "Data Error",
        "errorDescription" : error.message,
        "errorObject" : error
      }

      throw errorObj;
    }

    object.generateScenarioService.getSavedScenarioDataToPopulate(object.dashboardId, object.loginUserId, object.selectedScanrio).subscribe((response) => {
      object.isCopyEnabled = true;
      let index=0;
      let length = object.windowsData.WindowsServersInput.NA.length;

     
      while(index<length){
        object.windowsData.WindowsServersInput.NA[index].src_code_value=response.WindowsServersInput.NA[index].src_code_value;
        object.windowsData.WindowsServersInput.NA[index].notes = response.WindowsServersInput.NA[index].notes;

        index++;
      }
      index=0;
      response.GeneralInformation.NA=response.GeneralInformation.NA.slice(1,response.GeneralInformation.NA.length);
      length=response.GeneralInformation.NA.length;

      while(index<length){
        object.windowsData.GeneralInformation.NA[index].src_code_value=response.GeneralInformation.NA[index].src_code_value;
        if(object.windowsData.GeneralInformation.NA[index].src_code=="ICE002"){
          let currenyId=object.windowsData.GeneralInformation.NA[index].src_code_value
          //changing placeholder acc to currency present in selected scenario
          object.changePlaceHolder(getCurrencySymbol(object.currencyMap[currenyId],"narrow"));
        }
        index++;
      }

      object.getCountryByRegion(object.indexSrcCodeMap["TD0120"],object.windowsData.GeneralInformation.NA[object.indexSrcCodeMap["TD0110"]].src_code_value);


      object.checkValidation();
      object.activateShowBox(false);
      object.isDeleteAllowed = true;

    },(error)=>{
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : this.pageId,
        "pageName" : "Non CIO Windows Tower Input My Data Screen",
        "errorType" : "error",
        "errorTitle" : "Web Service Error",
        "errorDescription" : error.message,
        "errorObject" : error
      }

      throw errorObj;
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
      let regionGlobal = {key: "", value: "Global", id: "Global"};
      response.region.unshift(regionGlobal);
      object.windowsData.GeneralInformation.NA[index].dropDown=response.region;
      object.regions=response.region;
    },(error)=>{
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : this.pageId,
        "pageName" : "Non CIO Windows Tower Input My Data Screen",
        "errorType" : "error",
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
      object.windowsData.GeneralInformation.NA[index].dropDown=response.country;
      object.countries=response.country;
    },(error)=>{
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : this.pageId,
        "pageName" : "Non CIO Windows Tower Input My Data Screen",
        "errorType" : "error",
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
      object.windowsData.GeneralInformation.NA[index].dropDown=response.currencyExchange;
      object.currencies=response.currencyExchange;
      object.currencyMap=new Map<string,string>();

      for(let element of object.currencies){
        object.currencyMap[element.key]=element.value;
      }
    },(error)=>{
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : this.pageId,
        "pageName" : "Non CIO Windows Tower Input My Data Screen",
        "errorType" : "error",
        "errorTitle" : "Web Service Error",
        "errorDescription" : error.message,
        "errorObject" : error
      }

      throw errorObj;
    })

  }




  checkValidation() {
    let object=this;
    object.activateShowBox(true);
    let data = object.windowsData;
    let length = data.WindowsServersInput.NA.length;
    object.isFormValid=true;
    object.errorMessage="";
    let i = 0;//wanData.WANInput
    let value_format;
    let Sum=0;

    let requiredFilled=true;
    let arePercentageValid=true;
    let hasEnteredSum=false;
    let srcCodeValue;
    let srcCode;

    while(i < length) {
      value_format = data.WindowsServersInput.NA[i].value_format;
      srcCodeValue=data.WindowsServersInput.NA[i].src_code_value;
      let indidcator=data.WindowsServersInput.NA[i].indicator;
      srcCode= data.WindowsServersInput.NA[i].src_code;
      if(srcCodeValue != null && srcCodeValue != undefined && srcCodeValue != ""){
        srcCodeValue =object.unmaskComma(srcCodeValue);
       }
      if(value_format == "%" && srcCodeValue > 100) {
        object.isFormValid=false;
        object.errorMessage="Percentage must be between 0 and 100";
        arePercentageValid=false;
      }



      if(indidcator=='R'){
        if(srcCodeValue==undefined||srcCodeValue==null||srcCodeValue == "" || srcCodeValue.trim().length==0){
          this.isFormValid=false;
          this.errorMessage="Please enter the required fields";
          requiredFilled=false;
        }
        ;
      }

      i++;
    }


    if(!arePercentageValid||!requiredFilled){
      this.isFormValid=false;


      if(!requiredFilled)
      this.errorMessage="Please enter the required fields"

      if(!arePercentageValid)
      this.errorMessage="Percentage must be between 0 and 100"


    }else if(requiredFilled){

      if(srcCode == "DA2005" && srcCodeValue > 365){
        this.isFormValid=false;
        this.errorMessage="Working Days cannot be greater than 365";
      }
      else{
        this.isFormValid=true;
        this.errorMessage=""
      }
    }


    this.disableSaveAndCompare=!this.isFormValid;
    // this.isCopyEnabled = this.isFormValid;
  }






  saveAndCompare(onlySave) {

    this.activateShowBox(false);
    this.scenarioDataObj = [];
    this.enteredDataObj = {
      sessionId: null,
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
    //let category = Object.values(this.windowsData);
    let category = Object.keys(this.windowsData).map(e => this.windowsData[e]);
    // return false;

    length1 = Object.keys(this.windowsData).length;
    for (i = 0; i < length1; i++) {
      //subcategory = Object.values(category[i]);
      subcategory = Object.keys(category[i]).map(e => category[i][e])
      length2 = Object.keys(subcategory).length;
      for (j = 0; j < length2; j++) {
        //subCatValue = Object.values(subcategory[j]);
        subCatValue = Object.keys(subcategory[j]).map(e => subcategory[j][e])
        for (let obj of subCatValue) {
          let t1: any = {};
          t1.key = obj.src_code;
          t1.value = obj.src_code_value;
          if(t1.value != null && t1.value != "" && t1.value != undefined){
            t1.value = (t1.value.toString()).replace(/,/g,"");
 }
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
    this.enteredDataObj.scenario.dashboardID = 3;
    this.enteredDataObj.scenario.userId = "E5E8339B-0620-4377-82FE-0008029EDC53";
    this.enteredDataObj.scenario.projectId = "679D007C-C668-40E1-A60E-06391512F388"; //ISG
    this.enteredDataObj.scenario.clientID = "E5E8339B-0620-4377-82FE-0008029EDC5311";
    this.enteredDataObj.scenario.scenarioID = selectedScanrio;
    this.enteredDataObj.scenario.scenarioName = this.scenarioNameText;
    let resetRequired=onlySave;
    this.enteredDataObj.sessionId = this.sessionId;
    this.enteredDataObj.kpi_maintenance_data = this.scenarioDataObj;

    
    this.generateScenarioService.savedNewScenario(this.enteredDataObj).subscribe((response) => {
      this.isCopyEnabled = true;
      let message;
      if (selectedScanrio == null) {
        message = "Saved";
        //updating ScenarioList After Updating
        this.isResetRequired = !onlySave;
        this.getScenariosList(response.value);
        //set saved scenario to service
        this.windowSharedService.setScenarioSelection(response.value);
        if(onlySave){
          //trigger a emitter to let landing page know
        this.windowSharedService.getEmitter().emit('newWindowsScenarioSaved');
        }

      } else {
        message = "updated";
        this.isResetRequired = !onlySave;
        this.getScenariosList(response.value);
      }

      let description=this.scenarioNameText;
      if(description==undefined||description==undefined||description.trim().length==0){
        description=response.value+'_Scenario '+response.value;
      }else{
        description=response.value+'_'+this.scenarioNameText;
      }
      this.toastr.info('Scenario ' +description+" " + message, '', {
        timeOut: 7000,
        positionClass: 'toast-top-center'
      });
      this.isDeleteAllowed = true;
      if(!onlySave){
        //if user has not selected any currency ,then we are showing comparision in USD
        let currency=this.windowsData.GeneralInformation.NA[this.indexSrcCodeMap["ICE002"]].src_code_value;
        let region=this.windowsData.GeneralInformation.NA[this.indexSrcCodeMap["TD0110"]].src_code_value;
        if(currency==undefined||currency==null||currency.trim().length==0){
          currency="FE482E13-D3B6-4208-8C3C-2FD7AFBEBEA1";//USD key
        }
        let sharedData={"comparisionData":this.scenarioDataObj,"currency":currency,"region":region, "map":this.sourceCurrencyMap};
  
  
        this.windowSharedService.setData(sharedData);
  
        if(selectedScanrio!=null)
        {
          this.windowSharedService.setScenarioSelection(selectedScanrio);
        }
  
        this.windowSharedService.getEmitter().emit('newScenarioFromInputMyData');
      }
    },(error)=>{
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : this.pageId,
        "pageName" : "Non CIO Windows Tower Input My Data Screen",
        "errorType" : "error",
        "errorTitle" : "Web Service Error",
        "errorDescription" : error.message,
        "errorObject" : error
      }

      throw errorObj;
    });
    

  }
  //function for fetching data from service
  getInputEnterData() {
    let object=this;
    this.genericEnterCompare.getInputData().subscribe((data:any)=>{
      this.windowsData = data;

      //slicing it since
      object.windowsData.GeneralInformation.NA=object.windowsData.GeneralInformation.NA.slice(1,object.windowsData.GeneralInformation.NA.length);
      object.populateGeneralTab();
      object.prepareSourceCurrentMap();
      object.isDeleteAllowed = false;
    },(error)=>{
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : this.pageId,
        "pageName" : "Non CIO Windows Tower Input My Data Screen",
        "errorType" : "error",
        "errorTitle" : "Web Service Error",
        "errorDescription" : error.message,
        "errorObject" : error
      }

      throw errorObj;
    });
  }

  populateGeneralTab(){
    let object=this;
    try{
      let index=0;
      let length=object.windowsData.GeneralInformation.NA.length;
      while(index<length){
        let row: any = {};
        row.disabled = false;


        if(object.windowsData.GeneralInformation.NA[index].src_code=="ICE002"){
          object.indexSrcCodeMap["ICE002"]=index;
          object.getAllReportingCurrency(index);
          //    object.windowsData.GeneralInformation.NA[index].src_code_value="FE482E13-D3B6-4208-8C3C-2FD7AFBEBEA1";
          row.disabled = false;
        }
        if(object.windowsData.GeneralInformation.NA[index].src_code=="TD0100"){
          object.indexSrcCodeMap["TD0100"]=index;
          object.getAllYear(index);
        }if(object.windowsData.GeneralInformation.NA[index].src_code=="TD0110"){
          object.indexSrcCodeMap["TD0110"]=index;
          object.getAllRegion(index);
        }if(object.windowsData.GeneralInformation.NA[index].src_code=="TD0120"){
          object.indexSrcCodeMap["TD0120"]=index;
          //object.getAllCountries(index);
        }

        object.disabledStatus.push(row);
        index++;
      }

      object.dataLoaded=true;
    }catch(error){
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : this.pageId,
        "pageName" : "Non CIO Windows Tower Input My Data Screen",
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
    object.windowsData.GeneralInformation.NA[index].dropDown = yearDropDown;
    object.windowsData.GeneralInformation.NA[index].src_code_value = new Date().getFullYear();

  }
  getCountryByRegion(index,regionId){
    let object=this;

    object.generalTabService.getCountriesByRegion(regionId).subscribe((response:any)=>{



      object.windowsData.GeneralInformation.NA[index].dropDown=response.country;

    },(error)=>{
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : this.pageId,
        "pageName" : "Non CIO Windows Tower Input My Data Screen",
        "errorType" : "error",
        "errorTitle" : "Web Service Error",
        "errorDescription" : error.message,
        "errorObject" : error
      }

      throw errorObj;
    });



  }



  //resetAll all fields
  resetAll(){
    let object=this;
    object.selectedScanrio=0;
    object.scenarioNameText="";
    this.validateAvailabilityPercentage=false;
    object.activateShowBox(false);
    //for validations
    object.isFormValid=true;
    object.disableSaveAndCompare=true;
    object.isCopyEnabled = false;
    object.errorMessage="";
    object.windowsData.GeneralInformation.NA[object.indexSrcCodeMap["TD0120"]].dropDown=[];

    try{
      let index = 0;
      let length = object.windowsData.GeneralInformation.NA.length;
      //reseting general tab

      while (index < length) {
        object.windowsData.GeneralInformation.NA[index].src_code_value='';
        if(object.windowsData.GeneralInformation.NA[index].src_code=="TD0100") {
          object.windowsData.GeneralInformation.NA[index].src_code_value=new Date().getFullYear();
        }
        if(object.windowsData.GeneralInformation.NA[index].src_code=="TD0110") {
          object.windowsData.GeneralInformation.NA[index].src_code_value=null;
        }
        index++;
      }
      index = 0;
      length = object.windowsData.WindowsServersInput.NA.length;
      //reseting MainframeInforamtion
      while (index < length) {
        object.windowsData.WindowsServersInput.NA[index].src_code_value = '';
        object.windowsData.WindowsServersInput.NA[index].notes = null;
        if(object.windowsData.WindowsServersInput.NA[index].value_format!="%"&&object.windowsData.WindowsServersInput.NA[index].value_format!="#"){
          object.windowsData.WindowsServersInput.NA[index].value_format="$";
        }
        index++;
      }

      //reseting   ITOperationsHeadcount&Locations ta
      object.isDeleteAllowed = false;

    }catch(error){
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : this.pageId,
        "pageName" : "Non CIO Windows Tower Input My Data Screen",
        "errorType" : "warn",
        "errorTitle" : "Data Error",
        "errorDescription" : error.message,
        "errorObject" : error
      }

      throw errorObj;
    }



  }
  changePlaceHolder(placeHolder){
    let object=this;
    let index = 0;
    let length = object.windowsData.WindowsServersInput.NA.length;
    
    while(index<length){
      let valueFormat=object.windowsData.WindowsServersInput.NA[index].value_format;
      
      if(valueFormat!="#"&&valueFormat!="%"){
        object.windowsData.WindowsServersInput.NA[index].value_format=placeHolder;
      }
      index++;
    }
  }
  closeEnterDataModal(){
    let object=this;
    if(object.showRestBox){
      this.confirmBoxCloseFlag = true;
    }else{
      object.resetAll();
      $('.modal-select-to-compare-tower').modal('hide');
    }
  }
  prepareSourceCurrentMap(){
    let object=this;
    let index=0;
    let length=object.windowsData.WindowsServersInput.NA.length;

    while(index<length){
      object.sourceCurrencyMap[object.windowsData.WindowsServersInput.NA[index].src_code]=object.windowsData.WindowsServersInput.NA[index].value_format;
      index++;
    }
  }
  resetBtnHandler(){
    this.confirmBoxResetFlag = true;
  }
  resetConfirmYes(flag){
    if(flag){
      this.resetAll();
    }
    this.confirmBoxResetFlag = false;
  }
  closeConfirmYes(flag){
    if(flag){
      this.resetAll();
      $('.modal-select-to-compare-tower').modal('hide');
    }
    this.confirmBoxCloseFlag = false;
  }

  activateShowBox(value){
    let object=this;
    object.showRestBox=value;
  }

  onPaste(srcCodeObj,$event){
    
    srcCodeObj.src_code_value = $event.target.value;
    this.checkValidation();
  }

  unmaskComma(value){
    let val: any;
    val = (value.toString()).replace(/,/g,"");
    return val;
  }

  ngOnDestroy(){
    this.privilegesService.getEmitter().removeAllListeners();
    
  }

  //this is to open delete modal
 deleteScenario(){
  let object = this;
  object.confirmBoxDeleteFlag = true;
}

//this is to delete scenario
deleteConfirmYes(flag){
  let object = this;
  if(flag){
    let userId = object.emailId;
    let requestObj = {
      "userId": userId,
      "dashboardID":object.dashboardId,
      "scenarioIDList":[]
    };
    let tempObj = {
      "scenarioId": object.selectedScanrio,
      "isActive": 0
      };
      requestObj.scenarioIDList.push(tempObj);

    
    //call webservice
    object.genericEnterCompare.deleteScenario(requestObj).subscribe(function (response) {
        //after successfull response close confirmation box
        //once scenario get deleted refresh scenario list and reset scenario selection as well
        object.resetAll();      
        object.getScenariosList(0);
        let message = "deleted successfully."
        
        let  description = object.getScenarioName(tempObj.scenarioId);

        if (description == "" || description == undefined || description.trim().length == 0) {
          description = tempObj.scenarioId + '_Scenario ' + tempObj.scenarioId;
        } else {
          description = tempObj.scenarioId + '_' +  description;
        }
        object.toastr.info('Scenario ' + description + " " + message, '', {
          timeOut: 7000,
          positionClass: 'toast-top-center'
        });
      
        object.updateScenarioListNotificationServiceService.getEmitter().emit('updateWindowsScenarioListAfterDeletion');
    });
    
    object.confirmBoxDeleteFlag = false;
    
  }else{
    object.confirmBoxDeleteFlag = false;
  }
}

createSceCopy(){
  let object =this;
  //reset general section
  object.selectedScanrio=0;
  object.scenarioNameText='';

  //enable save button
  object.disableSaveAndCompare=false;
  object.isCopyEnabled = false;
  object.isDeleteAllowed = false;
}


}
