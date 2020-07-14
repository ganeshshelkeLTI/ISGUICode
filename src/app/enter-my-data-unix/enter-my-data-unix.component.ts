/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:enter-my-data-unix.component.ts **/
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
import { UnixEditAndCompareSharedService } from '../services/servers/unix/unix-edit-and-compare-shared.service';
import { CIOGeneralTabCompanyDetailService } from '../services/ciogeneral-tab-company-detail.service';
import { ToastrService } from 'ngx-toastr';
import { MapSourceCodeDataValues } from '../map-source-code-data-values';
import { UnixInputMyDataSharedService } from '../services/servers/unix/unix-input-my-data-shared.service';
import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';
import { PrivilegesService } from '../services/privileges.service';
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
  selector: 'app-enter-my-data-unix',
  templateUrl: './enter-my-data-unix.component.html',
  styleUrls: ['./enter-my-data-unix.component.css']
})
export class EnterMyDataUnixComponent implements OnInit,OnDestroy {
  numberMask = numberMask;
  decimalNumberMask = decimalNumberMask;
  private scenarioData: any;
  private mapdata: any;
  public unixInputData: any;
  public isFormValid: boolean = true;
  public showErrorMesssage: boolean = false;
  showDiv:boolean = false;
  public pageId: any;
  validateAvailabilityPercentage: boolean = false;
  validateDollar: boolean = false;
  validateHash: boolean = false;
  private indexSrcCodeMap:Map<string,number>;
  private disabledStatus: any[] = [];
  private showRestBox:boolean;
  loginUserId: string = "%27E5E8339B-0620-4377-82FE-0008029EDC53%27";
  dashboardId: string;
  private scenarios: any[] = [];

  scenarioDataObj = [];
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
  private currencyMap:Map<string,string>;
  confirmBoxResetFlag:boolean = false;
  confirmBoxCloseFlag:boolean = false;

  public sessionId: string;
  public userdata: any;
  public emailId: any;
  public showSelectedOptionFlg: boolean = false;
  isDeleteAllowed: boolean = false;
  confirmBoxDeleteFlag: boolean = false;

  privilegesObject:any;
  public isCopyEnabled : boolean = false;

  constructor(private generateScenarioService: GenerateScenarioService, private genericEnterCompare:EnterCompareDataTowersService, private http:HttpClient, private toastr: ToastrService, private unixSharedService: UnixInputMyDataSharedService, private generalTabService: CIOGeneralTabCompanyDetailService,private unixEditAndCompareSharedService:UnixEditAndCompareSharedService, private loginDataBroadcastService: LoginDataBroadcastService,private privilegesService:PrivilegesService,private updateScenarioListNotificationServiceService: UpdateScenarioListNotificationServiceService) {
    let object=this;
    this.dashboardId="5";
    object.indexSrcCodeMap=new Map<string,number>();
    object.dataLoaded=false;
    object.selectedScanrio="0";
    object.genericEnterCompare.setPopID(5);
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
    updateScenarioListNotificationServiceService.getEmitter().on('updateUnixScenarioListAfterDeletion', function(){
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
    let data=object.unixEditAndCompareSharedService.getData();
    if(data!=undefined){

    }
    object.unixEditAndCompareSharedService.getEmitter().on('serverdataChange',function(){
      let scenarioID=object.unixEditAndCompareSharedService.getData().selectedScanrio;

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

  //Intercept Changes of general tab
  interceptGeneralTabChanges(srcCode){
    let object=this;
    object.activateShowBox(true);
    if(srcCode=="TD0110"){
      object.unixInputData.GeneralInformation.NA[object.indexSrcCodeMap["TD0120"]].src_code_value=null;
      object.unixInputData.GeneralInformation.NA[object.indexSrcCodeMap["TD0120"]].dropDown=[];
      object.getCountryByRegion(object.indexSrcCodeMap["TD0120"],object.unixInputData.GeneralInformation.NA[object.indexSrcCodeMap["TD0110"]].src_code_value);
    }
    if(srcCode=="ICE002"){
      let value=object.unixInputData.GeneralInformation.NA[object.indexSrcCodeMap["ICE002"]].src_code_value;
     object.changePlaceHolder(getCurrencySymbol(object.currencyMap[value],"narrow"));
    }
  }

  //function for getting scenario list & appending new scenario
  getScenariosList(defaultScarioId) {
    let object = this;
    object.genericEnterCompare.setPopID(5);
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
          "pageName" : "Non CIO Unix Tower Input My Data Screen",
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
        "pageName" : "Non CIO Unix Tower Input My Data Screen",
        "errorType" : "fatal",
        "errorTitle" : "Web Service Error",
        "errorDescription" : error.message,
        "errorObject" : error
      }

      throw errorObj;
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
        "pageName" : "Non CIO Unix Tower Input My Data Screen",
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

    if (object.selectedScanrio.src_code_value <= 0){
      this.isFormValid=false;
    }

    let requestedParam = {
      "userID": object.loginUserId,
      "dashboardId": "5",
      "scenarioId": []
    }
    //get id from emitter and assign to "savedScenarioId"
    //setting name of selected Scenario
    try{
      object.scenarioNameText =object.getScenarioName(object.selectedScanrio);
    }catch(error){
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : this.pageId,
        "pageName" : "Non CIO Unix Tower Input My Data Screen",
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
      let length = object.unixInputData.UnixServersInput.NA.length;

      while(index<length){
        object.unixInputData.UnixServersInput.NA[index].src_code_value=response.UnixServersInput.NA[index].src_code_value;
        object.unixInputData.UnixServersInput.NA[index].notes = response.UnixServersInput.NA[index].notes;
        index++;
      }
      index=0;
      response.GeneralInformation.NA=response.GeneralInformation.NA.slice(1,response.GeneralInformation.NA.length);
      length=response.GeneralInformation.NA.length;

      while(index<length){
        object.unixInputData.GeneralInformation.NA[index].src_code_value=response.GeneralInformation.NA[index].src_code_value;
        if(object.unixInputData.GeneralInformation.NA[index].src_code=="ICE002"){
          let currenyId=object.unixInputData.GeneralInformation.NA[index].src_code_value
          //changing placeholder acc to currency present in selected scenario
          object.changePlaceHolder(getCurrencySymbol(object.currencyMap[currenyId],"narrow"));
        }
        index++;
      }

      object.getCountryByRegion(object.indexSrcCodeMap["TD0120"],object.unixInputData.GeneralInformation.NA[object.indexSrcCodeMap["TD0110"]].src_code_value);
      object.checkValidation();
      object.activateShowBox(false);
      this.isDeleteAllowed = true;
    },(error)=>{
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : this.pageId,
        "pageName" : "Non CIO Unix Tower Input My Data Screen",
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
      object.unixInputData.GeneralInformation.NA[index].dropDown=response.region;
      object.regions=response.region;
    },(error)=>{
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : this.pageId,
        "pageName" : "Non CIO Unix Tower Input My Data Screen",
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
      object.unixInputData.GeneralInformation.NA[index].dropDown=response.country;
      object.countries=response.country;
    },(error)=>{
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : this.pageId,
        "pageName" : "Non CIO Unix Tower Input My Data Screen",
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
      object.unixInputData.GeneralInformation.NA[index].dropDown=response.currencyExchange;
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
        "pageName" : "Non CIO Unix Tower Input My Data Screen",
        "errorType" : "error",
        "errorTitle" : "Web Service Error",
        "errorDescription" : error.message,
        "errorObject" : error
      }

      throw errorObj;
    })
  }

  getCountryByRegion(index,regionId){
    let object=this;

    object.generalTabService.getCountriesByRegion(regionId).subscribe((response:any)=>{
      object.unixInputData.GeneralInformation.NA[index].dropDown=response.country;

    },(error)=>{
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : this.pageId,
        "pageName" : "Non CIO Unix Tower Input My Data Screen",
        "errorType" : "error",
        "errorTitle" : "Web Service Error",
        "errorDescription" : error.message,
        "errorObject" : error
      }

      throw errorObj;
    });
  }

  unmaskComma(value){
    let val: any;
    val = (value.toString()).replace(/,/g,"");
    return val;
  }

  checkValidation() {
    let object=this;
    let data = object.unixInputData;
    let length = data.UnixServersInput.NA.length;
    object.isFormValid=true;
    object.errorMessage="";
    let i = 0;
    let value_format;
    let Sum=0;
    object.activateShowBox(true);
    let requiredFilled=true;
    let arePercentageValid=true;
    let hasEnteredSum=false;

    while(i < length) {
      value_format = data.UnixServersInput.NA[i].value_format;
      let srcCodeValue=data.UnixServersInput.NA[i].src_code_value;
      let indidcator=data.UnixServersInput.NA[i].indicator;
      let srcCode= data.UnixServersInput.NA[i].src_code;
      if(srcCodeValue != null && srcCodeValue != undefined && srcCodeValue != ""){
        srcCodeValue =object.unmaskComma(srcCodeValue);
       }
      if(value_format == "%" && srcCodeValue > 100) {
        object.isFormValid=false;
        object.errorMessage="Percentage must be between 0 and 100";
        arePercentageValid=false;
      }
      if(indidcator=='R'){
        if(srcCodeValue==undefined||srcCodeValue==null||srcCodeValue == ""||srcCodeValue.trim().length==0){
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

    }else{
      this.isFormValid=true;
      this.errorMessage=""

    }
    this.disableSaveAndCompare=!this.isFormValid;
    // this.isCopyEnabled = this.isFormValid;
  }

  saveAndCompare(onlySave) {
    this.activateShowBox(false);
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
    //let category = Object.values(this.unixInputData);
    let category = Object.keys(this.unixInputData).map(e => this.unixInputData[e]);
    // return false;

    length1 = Object.keys(this.unixInputData).length;
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
    if (selectedScanrio.src_code_value <= 0){
      this.isFormValid = false;
    }
    if (selectedScanrio == 0) {
      selectedScanrio = null;
    }
    this.enteredDataObj.scenario.dashboardID = 5;
    this.enteredDataObj.scenario.userId = "E5E8339B-0620-4377-82FE-0008029EDC53";
    this.enteredDataObj.scenario.projectId = "679D007C-C668-40E1-A60E-06391512F388"; //ISG
    this.enteredDataObj.scenario.clientID = "E5E8339B-0620-4377-82FE-0008029EDC5311";
    this.enteredDataObj.scenario.scenarioID = selectedScanrio;
    this.enteredDataObj.scenario.scenarioName = this.scenarioNameText;
    this.enteredDataObj.kpi_maintenance_data = this.scenarioDataObj;
    this.enteredDataObj.sessionId = this.sessionId;

   
    let resetRequired=onlySave;

    this.generateScenarioService.savedNewScenario(this.enteredDataObj).subscribe((response) => {
       this.isCopyEnabled = true;
      let message;
      if (selectedScanrio == null) {
        message = "Saved";
        this.isResetRequired =!onlySave;
        //updating ScenarioList After Updating
        this.getScenariosList(response.value);
        //set saved scenario to service
        this.unixSharedService.setScenarioSelection(response.value);
        if(onlySave){
          //trigger a emitter to let landing page know
        this.unixSharedService.getEmitter().emit('newUnixScenarioSaved');
        }
  

      } else {
        message = "updated";
        this.isResetRequired =!onlySave;
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
      //for showing comparision on Unix dashboard
    if(!onlySave){
      //if user has not selected any currency ,then we are showing comparision in USD
       let currency=this.unixInputData.GeneralInformation.NA[this.indexSrcCodeMap["ICE002"]].src_code_value;
       let region=this.unixInputData.GeneralInformation.NA[this.indexSrcCodeMap["TD0110"]].src_code_value;

       if(currency==undefined||currency==null||currency.trim().length==0){
         currency="FE482E13-D3B6-4208-8C3C-2FD7AFBEBEA1";//USD key
       }
       let sharedData={"comparisionData":this.scenarioDataObj,"currency":currency,"region":region, "map":this.sourceCurrencyMap};
    this.unixSharedService.setData(sharedData);

    if(selectedScanrio!=null)
    {
      this.unixSharedService.setScenarioSelection(selectedScanrio);
    }


    this.unixSharedService.getEmitter().emit('newScenarioFromUnixInput');
      }
    });
    
  }

  toggle(){
    this.showDiv = !this.showDiv;
  }

  //function for fetching data from service
  getInputEnterData() {
    let object=this;
    this.genericEnterCompare.getInputData().subscribe((data:any)=>{
      this.unixInputData = data;
      //slicing it since
      object.unixInputData.GeneralInformation.NA=object.unixInputData.GeneralInformation.NA.slice(1,object.unixInputData.GeneralInformation.NA.length);
      object.populateGeneralTab();
      object.prepareSourceCurrentMap();
      this.isDeleteAllowed = false;
    });
  }

  populateGeneralTab(){
    let object=this;
    try{
      let index=0;
      let length=object.unixInputData.GeneralInformation.NA.length;
      while(index<length){

        let row: any = {};
        row.disabled = false;

        if(object.unixInputData.GeneralInformation.NA[index].src_code=="ICE002"){
          object.indexSrcCodeMap["ICE002"]=index;
          object.getAllReportingCurrency(index);
          row.disabled = false;
        }
        if(object.unixInputData.GeneralInformation.NA[index].src_code=="TD0100"){
          object.indexSrcCodeMap["TD0100"]=index;
          object.getAllYear(index);
        }if(object.unixInputData.GeneralInformation.NA[index].src_code=="TD0110"){
          object.indexSrcCodeMap["TD0110"]=index;
          object.getAllRegion(index);
        }if(object.unixInputData.GeneralInformation.NA[index].src_code=="TD0120"){
          object.indexSrcCodeMap["TD0120"]=index;
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
        "pageName" : "Non CIO Unix Tower Input My Data Screen",
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
    object.unixInputData.GeneralInformation.NA[index].dropDown = yearDropDown;
    object.unixInputData.GeneralInformation.NA[index].src_code_value = new Date().getFullYear();
  }

  //resetAll all fields
  resetAll(){
    let object=this;
    object.selectedScanrio=0;
    object.scenarioNameText="";
    object.activateShowBox(false);
    //forms
    object.isFormValid=true;
    object.disableSaveAndCompare=true;
    object.isCopyEnabled = false;
    object.errorMessage="";
    object.unixInputData.GeneralInformation.NA[object.indexSrcCodeMap["TD0120"]].dropDown=[];

    this.validateAvailabilityPercentage=false;
    try{
      let index = 0;
      let length = object.unixInputData.GeneralInformation.NA.length;
      //reseting general tab

      while (index < length) {
        object.unixInputData.GeneralInformation.NA[index].src_code_value='';
        if(object.unixInputData.GeneralInformation.NA[index].src_code=="TD0100") {
          object.unixInputData.GeneralInformation.NA[index].src_code_value=new Date().getFullYear();
        }
        if(object.unixInputData.GeneralInformation.NA[index].src_code == "TD0110"){
          object.unixInputData.GeneralInformation.NA[index].src_code_value=null;
        }
        index++;
      }
      index = 0;
      length = object.unixInputData.UnixServersInput.NA.length;
      //reseting MainframeInforamtion
      while (index < length) {
        object.unixInputData.UnixServersInput.NA[index].src_code_value = '';
        object.unixInputData.UnixServersInput.NA[index].notes=null;
        if(object.unixInputData.UnixServersInput.NA[index].value_format!="%"&&object.unixInputData.UnixServersInput.NA[index].value_format!="#"){
          object.unixInputData.UnixServersInput.NA[index].value_format="$";
        }
        index++;
      }

      object.isDeleteAllowed = false;
      //reseting ITOperationsHeadcount&Locations

    }catch(error){
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : this.pageId,
        "pageName" : "Non CIO Unix Tower Input My Data Screen",
        "errorType" : "warn",
        "errorTitle" : "Data Error",
        "errorDescription" : error.message,
        "errorObject" : error
      }

      throw errorObj;
    }

  }
  prepareSourceCurrentMap(){
    let object=this;
    let index=0;
    let length=object.unixInputData.UnixServersInput.NA.length;

      while(index<length){
        object.sourceCurrencyMap[object.unixInputData.UnixServersInput.NA[index].src_code]=object.unixInputData.UnixServersInput.NA[index].value_format;
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

      ngOnDestroy(){
        this.privilegesService.getEmitter().removeAllListeners();
    }
    changePlaceHolder(placeHolder){
      let object=this;
      let index = 0;
      let length = object.unixInputData.UnixServersInput.NA.length;
     
      while(index<length){
        let valueFormat=object.unixInputData.UnixServersInput.NA[index].value_format;
       
        if(valueFormat!="#"&&valueFormat!="%"){
          object.unixInputData.UnixServersInput.NA[index].value_format=placeHolder;
        }
        index++;
      }
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
        object.updateScenarioListNotificationServiceService.getEmitter().emit('updateUnixScenarioListAfterDeletion');
      
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
