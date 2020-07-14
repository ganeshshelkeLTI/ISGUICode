/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:enter-my-data-linux.component.ts **/
/** Description: This file is created to compare input my data on the landing page and generate new scenario and save them  **/
/** Created By: 10651577  Created Date: 28/09/2018 **/
/** Update By:  10650919  Update Date:  01/10/2018 **/
/*******************************************************/
import {getCurrencySymbol} from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnterCompareDataTowersService} from '../services/enter-compare-data-towers.service';
import { GenerateScenarioService } from '../services/generate-scenario.service';
import { LinuxInputmydataSharedServiceService } from '../services/servers/linux/linux-inputmydata-shared-service.service';
import { CIOGeneralTabCompanyDetailService } from '../services/ciogeneral-tab-company-detail.service';
import { ToastrService } from 'ngx-toastr';
import { MapSourceCodeDataValues } from '../map-source-code-data-values';
import { LinuxEditAndCompareSharedService } from '../services/servers/linux/linux-edit-and-compare-shared.service';
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
  selector: 'app-enter-my-data-linux',
  templateUrl: './enter-my-data-linux.component.html',
  styleUrls: ['./enter-my-data-linux.component.css']
})
export class EnterMyDataLinuxComponent implements OnInit, OnDestroy {
  numberMask = numberMask;
  decimalNumberMask = decimalNumberMask;
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

  confirmBoxResetFlag:boolean = false;
  confirmBoxCloseFlag:boolean = false;
  private sourceCurrencyMap:Map<string,string>;
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
  constructor( private generateScenarioService: GenerateScenarioService, 
    private genericEnterCompare:EnterCompareDataTowersService, 
    private http:HttpClient, private toastr: ToastrService, 
    private generalTabService: CIOGeneralTabCompanyDetailService,
    private LinuxEditAndCompareSharedService:LinuxEditAndCompareSharedService, 
    private linuxSharedService: LinuxInputmydataSharedServiceService, 
    private loginDataBroadcastService: LoginDataBroadcastService , 
    private privilegesService:PrivilegesService,
    private updateScenarioListNotificationServiceService: UpdateScenarioListNotificationServiceService) {
    let object = this;
    this.dashboardId="4";
    object.indexSrcCodeMap=new Map<string,number>();
    object.dataLoaded=false;
    object.selectedScanrio="0";
    object.genericEnterCompare.setPopID(4);
    object.errorMessage="";
    object.disableSaveAndCompare=true;
    object.sourceCurrencyMap=new Map<string,string>();

     //update scenariolist after deletion from compare modal
     updateScenarioListNotificationServiceService.getEmitter().on('updateLinuxScenarioListAfterDeletion', function(){
      object.getScenariosList(0);
    });

    object.privilegesObject=object.privilegesService.getData();

    object.privilegesService.getEmitter().on('updatePrivileges',function(){
      object.privilegesObject=object.privilegesService.getData();
    });

    object.activateShowBox(false);
    let loginSharedData = object.loginDataBroadcastService.getEmitter();
    loginSharedData.on('setLoginData', function () {
      object.getUserLoginInfo();
    })
  }

  getUserLoginInfo() {
    let _self = this;
    _self.userdata = _self.loginDataBroadcastService.get('userloginInfo');
    _self.emailId = _self.userdata['userDetails']['emailId'];
    _self.sessionId = _self.userdata['userDetails']["sessionId"];
  }

  ngOnInit() {
    let object = this;
    this.isDeleteAllowed = false;
    object.getUserLoginInfo();
    object.isCopyEnabled = false;
    object.loginUserId = object.sessionId;
    try{
      let data=object.LinuxEditAndCompareSharedService.getData();
      if(data!=undefined){ }
    }
    catch(error)
    {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : this.pageId,
        "pageName" : "Non CIO Linux Tower Input My Data Screen",
        "errorType" : "Fatal",
        "errorTitle" : "Data Error",
        "errorDescription" : error.message,
        "errorObject" : error
      }

      throw errorObj;
    }
    object.LinuxEditAndCompareSharedService.getEmitter().on('serverdataChange',function(){

      try{
        let scenarioID=object.LinuxEditAndCompareSharedService.getData().selectedScanrio;
        if(scenarioID==0){
          object.selectedScanrio=0;
          object.scenarioNameText="";
          object.resetAll();
        }else{
          object.selectedScanrio=scenarioID;
          object.getScenarioDataById();
        }
      }
      catch(error)
      {
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId" : this.pageId,
          "pageName" : "Non CIO Linux Tower Input My Data Screen",
          "errorType" : "Fatal",
          "errorTitle" : "Data Error",
          "errorDescription" : error.message,
          "errorObject" : error
        }

        throw errorObj;
      }

    })

    this.getInputEnterData();
    this.getScenariosList(this.selectedScanrio);
  }

  interceptGeneralTabChanges(srcCode){
    let object=this;
    object.activateShowBox(true);
    if(srcCode=="TD0110"){
      object.inputData.GeneralInformation.NA[object.indexSrcCodeMap["TD0120"]].src_code_value=null;
      object.inputData.GeneralInformation.NA[object.indexSrcCodeMap["TD0120"]].dropDown=[];

      object.getCountryByRegion(object.indexSrcCodeMap["TD0120"],object.inputData.GeneralInformation.NA[object.indexSrcCodeMap["TD0110"]].src_code_value);
    }
    if(srcCode=="ICE002"){
      let value=object.inputData.GeneralInformation.NA[object.indexSrcCodeMap["ICE002"]].src_code_value;
     
      object.changePlaceHolder(getCurrencySymbol(object.currencyMap[value],"narrow"));
    }

  }

  //function for getting scenario list & appending new scenario
  getScenariosList(defaultScarioId) {
    try{

      let object = this;
      object.genericEnterCompare.setPopID(4);
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
          // object.scenarioNameText = object.scenarios[object.selectedScanrio-1].name;
          object.scenarioNameText = object.getScenarioName(object.selectedScanrio);
        }catch(error){
          //throw custom exception to global error handler
          //create error object
          let errorObj = {
            "dashboardId" : this.pageId,
            "pageName" : "Non CIO Linux Tower Input My Data Screen",
            "errorType" : "Fatal",
            "errorTitle" : "Web Service Error",
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
          "pageName" : "Non CIO Linux Tower Input My Data Screen",
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
        "dashboardId" : this.pageId,
        "pageName" : "Non CIO Linux Tower Input My Data Screen",
        "errorType" : "Fatal",
        "errorTitle" : "Data Error",
        "errorDescription" : error.message,
        "errorObject" : error
      }

      throw errorObj;
    }
  }

  //get saved scenario data of selected Scanrio Id
  getScenarioDataById() {
    try{

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
          "pageName" : "Non CIO Linux Tower Input My Data Screen",
          "errorType" : "Fatal",
          "errorTitle" : "Web Service Error",
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
        "dashboardId": "4",
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
          "pageName" : "Non CIO Linux Tower Input My Data Screen",
          "errorType" : "Fatal",
          "errorTitle" : "Web Service Error",
          "errorDescription" : error.message,
          "errorObject" : error
        }

        throw errorObj;}

        object.generateScenarioService.getSavedScenarioDataToPopulate(object.dashboardId, object.loginUserId, object.selectedScanrio).subscribe((response) => {
          object.isCopyEnabled = true;
          let index=0;
          let length = object.inputData.LinuxServersInput.NA.length;

          while(index<length){
            object.inputData.LinuxServersInput.NA[index].src_code_value=response.LinuxServersInput.NA[index].src_code_value;
            object.inputData.LinuxServersInput.NA[index].notes = response.LinuxServersInput.NA[index].notes;
            index++;
          }
          index=0;
          response.GeneralInformation.NA=response.GeneralInformation.NA.slice(1,response.GeneralInformation.NA.length);
          length=response.GeneralInformation.NA.length;

          while(index<length){
            object.inputData.GeneralInformation.NA[index].src_code_value=response.GeneralInformation.NA[index].src_code_value;
            if(object.inputData.GeneralInformation.NA[index].src_code=="ICE002"){
              let currenyId=object.inputData.GeneralInformation.NA[index].src_code_value
              //changing placeholder acc to currency present in selected scenario
              object.changePlaceHolder(getCurrencySymbol(object.currencyMap[currenyId],"narrow"));
            }
            index++;
          }
          object.getCountryByRegion(object.indexSrcCodeMap["TD0120"],object.inputData.GeneralInformation.NA[object.indexSrcCodeMap["TD0110"]].src_code_value);
          object.checkValidation();
          object.activateShowBox(false);
          object.isDeleteAllowed = true;

        },(error)=>{
          //throw custom exception to global error handler
          //create error object
          let errorObj = {
            "dashboardId" : this.pageId,
            "pageName" : "Non CIO Linux Tower Input My Data Screen",
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
          "dashboardId" : this.pageId,
          "pageName" : "Non CIO Linux Tower Input My Data Screen",
          "errorType" : "Fatal",
          "errorTitle" : "Data Error",
          "errorDescription" : error.message,
          "errorObject" : error
        }

        throw errorObj;
      }
    }

    getScenarioName(key):string{
      let object = this;
      let name="";
      for(let scenario of object.scenarios){
        if(scenario.key==key){
          name=scenario.name;
        }
      }

      return name;
    }


    getAllRegion(index){

      try{
        let object = this;
        object.generalTabService.getAllRegion().subscribe((response:any)=>{
          let regionGlobal = {key: "", value: "Global", id: "Global"};
          response.region.unshift(regionGlobal);
          object.inputData.GeneralInformation.NA[index].dropDown=response.region;
          object.regions=response.region;
        },(error)=>{
          //throw custom exception to global error handler
          //create error object
          let errorObj = {
            "dashboardId" : this.pageId,
            "pageName" : "Non CIO Linux Tower Input My Data Screen",
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
          "dashboardId" : this.pageId,
          "pageName" : "Non CIO Linux Tower Input My Data Screen",
          "errorType" : "Fatal",
          "errorTitle" : "Data Error",
          "errorDescription" : error.message,
          "errorObject" : error
        }

        throw errorObj;
      }
    }

    getAllCountries(index){

      try{

        let object = this;
        object.generalTabService.getAllCountry().subscribe((response:any)=>{
          object.inputData.GeneralInformation.NA[index].dropDown=response.country;
          object.countries=response.country;
        },(error)=>{
          //throw custom exception to global error handler
          //create error object
          let errorObj = {
            "dashboardId" : this.pageId,
            "pageName" : "Non CIO Linux Tower Input My Data Screen",
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
          "dashboardId" : this.pageId,
          "pageName" : "Non CIO Linux Tower Input My Data Screen",
          "errorType" : "Fatal",
          "errorTitle" : "Data Error",
          "errorDescription" : error.message,
          "errorObject" : error
        }

        throw errorObj;
      }
    }


    getAllReportingCurrency(index){

      try{

        let object = this;
        object.generalTabService.getAllCurrency().subscribe((response:any)=>{
          object.inputData.GeneralInformation.NA[index].dropDown=response.currencyExchange;
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
            "pageName" : "Non CIO Linux Tower Input My Data Screen",
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
          "dashboardId" : this.pageId,
          "pageName" : "Non CIO Linux Tower Input My Data Screen",
          "errorType" : "Fatal",
          "errorTitle" : "Data Error",
          "errorDescription" : error.message,
          "errorObject" : error
        }

        throw errorObj;
      }
    }

    checkValidation() {

      try{

        let object=this;
        object.activateShowBox(true);
        let data = object.inputData;
        let length = data.LinuxServersInput.NA.length;
        object.isFormValid=true;
        object.errorMessage="";
        let i = 0;//wanData.WANInput
        let value_format;
        let Sum=0;

        let requiredFilled=true;
        let arePercentageValid=true;
        let hasEnteredSum=false;
        
        while(i < length) {
          value_format = data.LinuxServersInput.NA[i].value_format;
          let srcCodeValue=data.LinuxServersInput.NA[i].src_code_value;
          let indidcator=data.LinuxServersInput.NA[i].indicator;
          let srcCode= data.LinuxServersInput.NA[i].src_code;
          if(srcCodeValue != null && srcCodeValue != undefined && srcCodeValue != ""){
            srcCodeValue =object.unmaskComma(srcCodeValue);
           }
          if(srcCode == 'DA2005') {
            object.isFormValid=false;
            object.errorMessage="Working days must not be greater than 365";
          }
          if(value_format == "%" && srcCodeValue > 100) {
            object.isFormValid=false;
            object.errorMessage="Percentage must be between 0 and 100";
            arePercentageValid=false;
          }
          if(indidcator=='R'){
            if(srcCodeValue==undefined||srcCodeValue==null||srcCodeValue== ""|| srcCodeValue.trim().length==0){
              this.isFormValid=false;
              this.errorMessage="Please enter the required fields";
              requiredFilled=false;
            }
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
      catch(error)
      {
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId" : this.pageId,
          "pageName" : "Non CIO Linux Tower Input My Data Screen",
          "errorType" : "Fatal",
          "errorTitle" : "Data Error",
          "errorDescription" : error.message,
          "errorObject" : error
        }

        throw errorObj;
      }
    }

    saveAndCompare(onlySave) {
      let object = this;
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
      //let category = Object.values(this.inputData);
      let category = Object.keys(this.inputData).map(e => this.inputData[e]);
      // return false;

      length1 = Object.keys(this.inputData).length;
      for (i = 0; i < length1; i++) {
        //subcategory = Object.values(category[i]);
        subcategory = Object.keys(category[i]).map(e => category[i][e])
        length2 = Object.keys(subcategory).length;
        for (j = 0; j < length2; j++) {
         // subCatValue = Object.values(subcategory[j]);
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
      this.enteredDataObj.scenario.dashboardID = 4;
      this.enteredDataObj.scenario.userId = "E5E8339B-0620-4377-82FE-0008029EDC53";
      this.enteredDataObj.scenario.projectId = "679D007C-C668-40E1-A60E-06391512F388"; //ISG
      this.enteredDataObj.scenario.clientID = "E5E8339B-0620-4377-82FE-0008029EDC5311";
      this.enteredDataObj.scenario.scenarioID = selectedScanrio;
      this.enteredDataObj.scenario.scenarioName = this.scenarioNameText;
      this.enteredDataObj.sessionId = this.sessionId;

      this.enteredDataObj.kpi_maintenance_data = this.scenarioDataObj;
      let resetRequired=onlySave;
      //dont reset on save
      this.generateScenarioService.savedNewScenario(this.enteredDataObj).subscribe((response) => {
        object.isCopyEnabled = true;
        let message;
        if (selectedScanrio == null) {
          message = "Saved";
          //updating ScenarioList After Updating
          this.isResetRequired = !onlySave;
          this.getScenariosList(response.value);
          //set saved scenario to service
        this.linuxSharedService.setScenarioSelection(response.value);
        if(onlySave){
          //trigger a emitter to let landing page know
        this.linuxSharedService.getEmitter().emit('newLinuxScenarioSaved');
        }

        } else {
          message = "updated";
          this.isResetRequired = !onlySave;
          this.getScenariosList(response.value);
        }

        let description=this.scenarioNameText;
        if(description==undefined||description==undefined||description.trim().length==0){
          description=response.value+'_Scenario '+response.value;
        }else{
          description=response.value+'_'+this.scenarioNameText;
        }
        this.toastr.info('Scenario ' +description+" " + message, '', {
          timeOut: 7000,
          positionClass: 'toast-top-center'
        });
        object.isDeleteAllowed = true;
        //if saveAndCompare is clicked
      if(!onlySave){
        //if user has not selected any currency ,then we are showing comparision in USD
        let currency=this.inputData.GeneralInformation.NA[this.indexSrcCodeMap["ICE002"]].src_code_value;
        let region=this.inputData.GeneralInformation.NA[this.indexSrcCodeMap["TD0110"]].src_code_value;
        if(currency==undefined||currency==null||currency.trim().length==0){
          currency="FE482E13-D3B6-4208-8C3C-2FD7AFBEBEA1";//USD key
        }

        let sharedData={"comparisionData":this.scenarioDataObj,"currency":currency,"region":region, "map":this.sourceCurrencyMap};
        this.linuxSharedService.setData(sharedData);
        if(selectedScanrio!=null)
        {
          this.linuxSharedService.setScenarioSelection(selectedScanrio);
        }

        this.linuxSharedService.getEmitter().emit('newSceanrioFromLinuxInput');
      }

      },(error)=>{
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId" : this.pageId,
          "pageName" : "Non CIO Linux Tower Input My Data Screen",
          "errorType" : "Fatal",
          "errorTitle" : "Web Service Error",
          "errorDescription" : error.message,
          "errorObject" : error
        }

        throw errorObj;
      });
      
    }
    toggle(){
      this.showDiv = true;
      this.comapreLinuxInputData()
    }

    comapreLinuxInputData() {
      let object = this;
      let test = new MapSourceCodeDataValues();
      object.scenarioData = object.linuxSharedService.getData();
      object.mapdata = test.mapData(object.scenarioData);
    }

    //function for fetching data from service
    getInputEnterData() {
      let object = this;
      object.isDeleteAllowed = false;
      this.genericEnterCompare.getInputData().subscribe((data:any)=>{
        this.inputData = data;
        //slicing it since
        object.inputData.GeneralInformation.NA=object.inputData.GeneralInformation.NA.slice(1,object.inputData.GeneralInformation.NA.length);
        object.populateGeneralTab();
        object.prepareSourceCurrentMap();
      },(error)=>{
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId" : this.pageId,
          "pageName" : "Non CIO Linux Tower Input My Data Screen",
          "errorType" : "Fatal",
          "errorTitle" : "Web Service Error",
          "errorDescription" : error.message,
          "errorObject" : error
        }

        throw errorObj;
      });
    }

    populateGeneralTab(){
      let object = this;
      try{
        let index=0;
        let length=object.inputData.GeneralInformation.NA.length;
        while(index<length){

          let row: any = {};
          row.disabled = false;

          if(object.inputData.GeneralInformation.NA[index].src_code=="ICE002"){
            object.indexSrcCodeMap["ICE002"]=index;
            object.getAllReportingCurrency(index);
            row.disabled = false;
          }
          if(object.inputData.GeneralInformation.NA[index].src_code=="TD0100"){
            object.indexSrcCodeMap["TD0100"]=index;
            object.getAllYear(index);
          }if(object.inputData.GeneralInformation.NA[index].src_code=="TD0110"){
            object.indexSrcCodeMap["TD0110"]=index;
            object.getAllRegion(index);
          }if(object.inputData.GeneralInformation.NA[index].src_code=="TD0120"){
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
          "pageName" : "Non CIO Linux Tower Input My Data Screen",
          "errorType" : "Fatal",
          "errorTitle" : "Web Service Error",
          "errorDescription" : error.message,
          "errorObject" : error
        }

        throw errorObj;
      }
    }

    getCountryByRegion(index,regionId){
      let object=this;

      object.generalTabService.getCountriesByRegion(regionId).subscribe((response:any)=>{
        object.inputData.GeneralInformation.NA[index].dropDown=response.country;

      },(error)=>{
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId" : this.pageId,
          "pageName" : "Non CIO Linux Tower Input My Data Screen",
          "errorType" : "Fatal",
          "errorTitle" : "Web Service Error",
          "errorDescription" : error.message,
          "errorObject" : error
        }

        throw errorObj;
      });

    }

    getAllYear(index:number){
      let object = this;
      let yearDropDown = [];

      // for (var x = 1900; x <= 2100; x++) {
        for (var x = 2100; x >= 1900; x--) {
        let year: any = {};
        year.key = x;
        year.value = x;
        yearDropDown.push(year);
      }
      object.inputData.GeneralInformation.NA[index].dropDown = yearDropDown;
      object.inputData.GeneralInformation.NA[index].src_code_value = new Date().getFullYear();
    }

    //resetAll all fields
    resetAll(){
      let object = this;
      object.selectedScanrio=0;
      object.scenarioNameText="";
      object.isFormValid=true;
      object.disableSaveAndCompare=true;
      object.isCopyEnabled = false;
      object.activateShowBox(false);
      object.errorMessage="";
      try{
        let index = 0;
        let length = object.inputData.GeneralInformation.NA.length;
        //reseting general tab
        object.inputData.GeneralInformation.NA[object.indexSrcCodeMap["TD0120"]].dropDown=[];

        while (index < length) {
          object.inputData.GeneralInformation.NA[index].src_code_value='';
          if(object.inputData.GeneralInformation.NA[index].src_code=="TD0100") {
            object.inputData.GeneralInformation.NA[index].src_code_value=new Date().getFullYear();
          }
          if(object.inputData.GeneralInformation.NA[index].src_code == "TD0110"){
            object.inputData.GeneralInformation.NA[index].src_code_value=null;
          }
          index++;
        }
        index = 0;
        length = object.inputData.LinuxServersInput.NA.length;
        //reseting Linux Inforamtion
        while (index < length) {
          object.inputData.LinuxServersInput.NA[index].src_code_value = '';
          object.inputData.LinuxServersInput.NA[index].notes =null;
          if(object.inputData.LinuxServersInput.NA[index].value_format!="%"&&object.inputData.LinuxServersInput.NA[index].value_format!="#"){
            object.inputData.LinuxServersInput.NA[index].value_format="$";
          }
          index++;
        }

        while (index < length) {
          object.inputData.LinuxServersInput.NA[index].src_code_value = '';
          let valueFormat=object.inputData.LinuxServersInput.NA[index].value_format;
          if(valueFormat!="#"&&valueFormat!="%")object.inputData.LinuxServersInput.NA[index].value_format="$"
          index++;
        }

        object.isDeleteAllowed = false;
      }catch(error){
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId" : this.pageId,
          "pageName" : "Non CIO Linux Tower Input My Data Screen",
          "errorType" : "Fatal",
          "errorTitle" : "Web Service Error",
          "errorDescription" : error.message,
          "errorObject" : error
        }

        throw errorObj;
      }
    }
    changePlaceHolder(placeHolder){
      let object=this;
      let index = 0;
      let length = object.inputData.LinuxServersInput.NA.length;
      
      while(index<length){
        let valueFormat=object.inputData.LinuxServersInput.NA[index].value_format;
        
        if(valueFormat!="#"&&valueFormat!="%"){
          object.inputData.LinuxServersInput.NA[index].value_format=placeHolder;
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
      let length=object.inputData.LinuxServersInput.NA.length;

      while(index<length){
        object.sourceCurrencyMap[object.inputData.LinuxServersInput.NA[index].src_code]=object.inputData.LinuxServersInput.NA[index].value_format;

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
      "dashboardID":4,
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
        
        object.resetAll(); 
        //once scenario get deleted refresh scenario list and reset scenario selection as well
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
      
        object.updateScenarioListNotificationServiceService.getEmitter().emit('updateLinuxScenarioListAfterDeletion');
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

ngOnDestroy(){
  this.privilegesService.getEmitter().removeAllListeners();
}

}

