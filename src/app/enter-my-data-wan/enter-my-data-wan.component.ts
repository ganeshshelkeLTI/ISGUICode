/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:enter-my-data-wan-service.component.ts **/
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
import { WanInputMydataSharedService } from '../services/network/wan/wan-input-mydata-shared.service';
import { CIOGeneralTabCompanyDetailService } from '../services/ciogeneral-tab-company-detail.service';
import { ToastrService } from 'ngx-toastr';
import { MapSourceCodeDataValues } from '../map-source-code-data-values';
import {
  WanEditAndCompareSharedService
} from '../services/network/wan/wan-edit-and-compare-shared.service';
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
  selector: 'app-enter-my-data-wan',
  templateUrl: './enter-my-data-wan.component.html',
  styleUrls: ['./enter-my-data-wan.component.css']
})
export class EnterMyDataWanComponent implements OnInit,OnDestroy {
  numberMask = numberMask;
  decimalNumberMask = decimalNumberMask;
  private scenarioData: any;
  private mapdata: any;
  public wanData: any;
  public isFormValid: boolean = true;
  public showErrorMesssage: boolean = false;
  showDiv:boolean = false;
  public pageId: any; // have not used yet
  validateAvailabilityPercentage: boolean = false;
  validateDollar: boolean = false;
  validateHash: boolean = false;
  private indexSrcCodeMap:Map<string,number>;
  private disabledStatus: any[] = [];
  showBlueBorder:boolean;
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
  private isResetRequired:boolean = false;
  private sourceCurrencyMap:Map<string,string>;
  private showRestBox:boolean;
  confirmBoxResetFlag:boolean = false;
  confirmBoxCloseFlag:boolean = false;
  public sessionId: string;
  public userdata: any;
  public emailId: any;
  privilegesObject:any;
  public showSelectedOptionFlg: boolean = false;
  private currencyMap:Map<string,string>;

  public legacyWANVal: number = 0;
  public sdWANVal: number = 0;

  isDeleteAllowed: boolean = false;
  confirmBoxDeleteFlag: boolean = false;
  public isCopyEnabled: boolean = false;

  //There are some services of CIODashBoard which are reused for mainframe
  constructor( private generateScenarioService: GenerateScenarioService, private genericEnterCompare:EnterCompareDataTowersService, private http:HttpClient, private toastr: ToastrService, private wanSharedService: WanInputMydataSharedService, private generalTabService: CIOGeneralTabCompanyDetailService,private wanEditAndCompareSharedService:WanEditAndCompareSharedService,  private loginDataBroadcastService: LoginDataBroadcastService,private privilegesService:PrivilegesService,private updateScenarioListNotificationServiceService: UpdateScenarioListNotificationServiceService) {
    let object=this;
    this.dashboardId="8";
    object.indexSrcCodeMap=new Map<string,number>();
    object.dataLoaded=false;
    object.selectedScanrio="0"
    object.genericEnterCompare.setPopID(8);
    object.errorMessage="";
    object.isFormValid=true;
    object.disableSaveAndCompare=true;
    object.sourceCurrencyMap=new Map<string,string>();
    object.activateShowBox(false);
    object.showBlueBorder=true;
    let loginSharedData = object.loginDataBroadcastService.getEmitter();
    loginSharedData.on('setLoginData', function () {
      object.getUserLoginInfo();
    });
    object.privilegesObject=object.privilegesService.getData();

      object.privilegesService.getEmitter().on('updatePrivileges',function(){
      object.privilegesObject=object.privilegesService.getData();
        });

    //update scenariolist after deletion from compare modal
    updateScenarioListNotificationServiceService.getEmitter().on('updateWanScenarioListAfterDeletion', function(){
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
    object.getUserLoginInfo();
    object.isCopyEnabled = false;
    this.isDeleteAllowed = false;
    object.loginUserId = object.sessionId;
    let data=object.wanEditAndCompareSharedService.getData();
    if(data!=undefined){

    }

    object.wanEditAndCompareSharedService.getEmitter().on('networkDataChange',function(){
      let scenarioID=object.wanEditAndCompareSharedService.getData().selectedScanrio;

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

  interceptGeneralTabChanges(srcCode){
    let object=this;
    object.activateShowBox(true);
    if(srcCode=="TD0110"){
      object.wanData.GeneralInformation.NA[object.indexSrcCodeMap["TD0120"]].src_code_value=null;
      object.wanData.GeneralInformation.NA[object.indexSrcCodeMap["TD0120"]].dropDown=[];
      object.getCountryByRegion(object.indexSrcCodeMap["TD0120"],object.wanData.GeneralInformation.NA[object.indexSrcCodeMap["TD0110"]].src_code_value);
    }
    if(srcCode=="ICE002"){
      let value=object.wanData.GeneralInformation.NA[object.indexSrcCodeMap["ICE002"]].src_code_value;
     // console.log(object.currencyMap[value]);
     // console.log(getCurrencySymbol(object.currencyMap[value],"narrow"));
      object.changePlaceHolder(getCurrencySymbol(object.currencyMap[value],"narrow"));
    }
  }

  //function for getting scenario list & appending new scenario
  getScenariosList(defaultScarioId) {
    let object = this;
    object.genericEnterCompare.setPopID(8);
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
          "pageName" : "Non CIO WAN Tower Input My Data Screen",
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
        "pageName" : "Non CIO WAN Tower Input My Data Screen",
        "errorType" : "error",
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
    let scenarioID = object.selectedScanrio;

    try{
      object.resetAll();
    }catch(error){
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : this.pageId,
        "pageName" : "Non CIO WAN Tower Input My Data Screen",
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
      "dashboardId": "8",
      "scenarioId": []
    }
    try{
      object.scenarioNameText =object.getScenarioName(object.selectedScanrio);
    }catch(error){
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : this.pageId,
        "pageName" : "Non CIO WAN Tower Input My Data Screen",
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
      let length = object.wanData.WANInput.NA.length;

      while(index<length){
        object.wanData.WANInput.NA[index].src_code_value=response.WANInput.NA[index].src_code_value;
        object.wanData.WANInput.NA[index].notes = response.WANInput.NA[index].notes;
        index++;
      }
      index=0;
      response.GeneralInformation.NA=response.GeneralInformation.NA.slice(1,response.GeneralInformation.NA.length);
      length=response.GeneralInformation.NA.length;

      while(index<length){
        object.wanData.GeneralInformation.NA[index].src_code_value=response.GeneralInformation.NA[index].src_code_value;
        if(object.wanData.GeneralInformation.NA[index].src_code=="ICE002"){
          let currenyId=object.wanData.GeneralInformation.NA[index].src_code_value
          //changing placeholder acc to currency present in selected scenario
          object.changePlaceHolder(getCurrencySymbol(object.currencyMap[currenyId],"narrow"));
        }
        index++;
      }
      object.getCountryByRegion(object.indexSrcCodeMap["TD0120"],object.wanData.GeneralInformation.NA[object.indexSrcCodeMap["TD0110"]].src_code_value);
      object.checkValidation();
      object.activateShowBox(false);
      this.isDeleteAllowed = true;
    },(error)=>{
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : this.pageId,
        "pageName" : "Non CIO WAN Tower Input My Data Screen",
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
      object.wanData.GeneralInformation.NA[index].dropDown=response.region;
      object.regions=response.region;
    },(error)=>{
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : this.pageId,
        "pageName" : "Non CIO WAN Tower Input My Data Screen",
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
      object.wanData.GeneralInformation.NA[index].dropDown=response.country;
      object.countries=response.country;
    },(error)=>{
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : this.pageId,
        "pageName" : "Non CIO WAN Tower Input My Data Screen",
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
      object.wanData.GeneralInformation.NA[index].dropDown=response.currencyExchange;
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
        "pageName" : "Non CIO WAN Tower Input My Data Screen",
        "errorType" : "error",
        "errorTitle" : "Web Service Error",
        "errorDescription" : error.message,
        "errorObject" : error
      }

      throw errorObj;
    })

  }

  unmaskComma(value){
    let val: any;
    val = (value.toString()).replace(/,/g,"");
    return val;
  }


  checkValidation() {
    let object=this;
    let data = object.wanData;
    let length = data.WANInput.NA.length;
    object.isFormValid=true;
    object.errorMessage="";
    let i = 0;
    let value_format;
    object.activateShowBox(true);
    let Sum=0;
    let isSumInValid=false;
    let requiredFilled=true;
    let arePercentageValid=true;
    let hasEnteredSum=false;
    object.showBlueBorder=true;
    let hasFilledNW0500=false;
    let hasFilledNW0550=false;

    while(i < length) {
      value_format = data.WANInput.NA[i].value_format;
      let srcCodeValue=data.WANInput.NA[i].src_code_value;
      let indidcator=data.WANInput.NA[i].indicator;
      let srcCode= data.WANInput.NA[i].src_code;
      if(srcCodeValue != null && srcCodeValue != undefined && srcCodeValue != ""){
        srcCodeValue =object.unmaskComma(srcCodeValue);
       }
      if(value_format == "%" && srcCodeValue > 100) {
        object.isFormValid=false;
        object.errorMessage="Percentage must be between 0 and 100";
        arePercentageValid=false;
      }
      if(indidcator=='R'){
        if(srcCodeValue==undefined||srcCodeValue==null||srcCodeValue == "" ||srcCodeValue.trim().length==0){
          this.isFormValid=false;
          this.errorMessage="Please enter the required fields";
          requiredFilled=false;
        }
        ;
      }
      if(srcCode=='NW0500'||srcCode=='NW0550'){
        if(srcCode == 'NW0500'){
          if(srcCodeValue != undefined && srcCodeValue != null && srcCodeValue.trim().length != 0){
            hasFilledNW0500=true;
            this.legacyWANVal = Number(this.unmaskComma(srcCodeValue));
          }else{
            hasFilledNW0500=false;
            this.legacyWANVal = null;
          }
        }else if(srcCode == 'NW0550'){
          if(srcCodeValue != undefined && srcCodeValue != null && srcCodeValue.trim().length != 0){
            hasFilledNW0550=true;
            this.sdWANVal = Number(this.unmaskComma(srcCodeValue));
          }else{
            hasFilledNW0550=false;
            this.sdWANVal = null;
          }
        }

        if(!hasFilledNW0500 && !hasFilledNW0550){
          isSumInValid = false;
        }else{
          Sum = this.legacyWANVal + this.sdWANVal;
          if(hasFilledNW0500 && hasFilledNW0550 && Sum == 100){
            isSumInValid = false;
          }else{
            isSumInValid = true;
          }
        }
        // if(srcCodeValue!=undefined&&srcCodeValue!=null&&srcCodeValue.trim().length!=0){
        //   let value=parseFloat(srcCodeValue);
        //  if(srcCode=="NW0500")hasFilledNW0500=true;
        //  if(srcCode=="NW0550")hasFilledNW0500=false;

        //   Sum+=value;
        //   hasEnteredSum=true;

        // }
      }
      i++;
    }

    // if(Sum==100){
    //   isSumInValid=false;
    // }else{

    //   if(hasEnteredSum)
    //   isSumInValid=true;
    //   else
    //   isSumInValid=false;

    // }

    if(isSumInValid||!arePercentageValid||!requiredFilled){
      this.isFormValid=false;

      if(isSumInValid){
        if(hasFilledNW0500 && hasFilledNW0550 && Sum != 100){
          this.errorMessage = "The Legacy WAN and SD WAN location entries equal "+Sum+"%, it must equal 100%.  Please revise to continue.";
          this.showBlueBorder = false;
        }else if((!hasFilledNW0500 || !hasFilledNW0550) && Sum == 100){
          this.errorMessage = "The Legacy WAN and SD WAN location entries equal 100%, however all cells require a value. If there is no value for a cell, please enter zero to continue.";
          this.showBlueBorder = true;
        }else if((!hasFilledNW0500 || !hasFilledNW0550) && Sum != 100){
          this.errorMessage = "The Legacy WAN and SD WAN location entries equal "+Sum+"%, it must equal 100%.  Please revise to continue.";
          this.showBlueBorder = true;
        }
        // this.errorMessage="sum of Legacy WAN and SD WAN must be equal to 100 ";
        // if((hasFilledNW0500&&hasFilledNW0550)||Sum>100){
        //   this.showBlueBorder=false;
        // }

      }

      // if(!requiredFilled)
      // this.errorMessage="Please enter the required fields"

      // if(!arePercentageValid)
      // this.errorMessage="Percentage must be between 0 and 100"

    }else{
      this.isFormValid=true;
      this.errorMessage=""

    }

    this.disableSaveAndCompare=!this.isFormValid;
    // this.isCopyEnabled = this.isFormValid;
    // if(this.errorMessage=="sum of Legacy WAN and SD WAN must be equal to 100 ")
    // this.showBlueBorder=false;
    // else
    // this.showBlueBorder=true;
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
    //let category = Object.values(this.wanData);
    let category = Object.keys(this.wanData).map(e => this.wanData[e]);
    // return false;

    length1 = Object.keys(this.wanData).length;
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
    this.enteredDataObj.scenario.dashboardID = 8;
    this.enteredDataObj.scenario.userId = "E5E8339B-0620-4377-82FE-0008029EDC53";
    this.enteredDataObj.scenario.projectId = "679D007C-C668-40E1-A60E-06391512F388"; //ISG
    this.enteredDataObj.scenario.clientID = "E5E8339B-0620-4377-82FE-0008029EDC5311";
    this.enteredDataObj.scenario.scenarioID = selectedScanrio;
    this.enteredDataObj.scenario.scenarioName = this.scenarioNameText;
    this.enteredDataObj.sessionId = this.sessionId;

    this.enteredDataObj.kpi_maintenance_data = this.scenarioDataObj;
    let resetRequired=onlySave;
    this.generateScenarioService.savedNewScenario(this.enteredDataObj).subscribe((response) => {
      this.isCopyEnabled = true;
      let message;
      if (selectedScanrio == null) {
        message = "Saved";
        this.isResetRequired = !onlySave;
        //updating ScenarioList After Updating
        this.getScenariosList(response.value);

         //set saved scenario to service
         this.wanSharedService.setScenarioSelection(response.value);
        if(onlySave){
           //trigger a emitter to let landing page know
         this.wanSharedService.getEmitter().emit('newWANScenarioSaved');
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
         let currency=this.wanData.GeneralInformation.NA[this.indexSrcCodeMap["ICE002"]].src_code_value;
         let region=this.wanData.GeneralInformation.NA[this.indexSrcCodeMap["TD0110"]].src_code_value;
         if(currency==undefined||currency==null||currency.trim().length==0){
           currency="FE482E13-D3B6-4208-8C3C-2FD7AFBEBEA1";//USD key
         }
         let sharedData={"comparisionData":this.scenarioDataObj,"currency":currency,"region":region, "map":this.sourceCurrencyMap};
      this.wanSharedService.setData(sharedData);
  
        if(selectedScanrio!=null)
        {
          this.wanSharedService.setScenarioSelection(selectedScanrio);
        }
  
      this.wanSharedService.getEmitter().emit('newWANScenarioFromInput');
    }
    },(error)=>{
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : this.pageId,
        "pageName" : "Non CIO WAN Tower Input My Data Screen",
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
      this.wanData = data;

      object.wanData.GeneralInformation.NA=object.wanData.GeneralInformation.NA.slice(1,object.wanData.GeneralInformation.NA.length);
      object.populateGeneralTab();
      object.prepareSourceCurrentMap();
      this.isDeleteAllowed = false;
    },(error)=>{
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : this.pageId,
        "pageName" : "Non CIO WAN Tower Input My Data Screen",
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
      let length=object.wanData.GeneralInformation.NA.length;
      while(index<length){

        let row: any = {};
        row.disabled = false;

        if(object.wanData.GeneralInformation.NA[index].src_code=="ICE002"){
          object.indexSrcCodeMap["ICE002"]=index;
          object.getAllReportingCurrency(index);
          row.disabled = false;
        }
        if(object.wanData.GeneralInformation.NA[index].src_code=="TD0100"){
          object.indexSrcCodeMap["TD0100"]=index;
          object.getAllYear(index);
        }if(object.wanData.GeneralInformation.NA[index].src_code=="TD0110"){
          object.indexSrcCodeMap["TD0110"]=index;
          object.getAllRegion(index);
        }if(object.wanData.GeneralInformation.NA[index].src_code=="TD0120"){
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
        "pageName" : "Non CIO WAN Tower Input My Data Screen",
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
    object.wanData.GeneralInformation.NA[index].dropDown = yearDropDown;
    object.wanData.GeneralInformation.NA[index].src_code_value = new Date().getFullYear();
  }

  //get country by region
  getCountryByRegion(index,regionId){
    let object=this;

    object.generalTabService.getCountriesByRegion(regionId).subscribe((response:any)=>{
      object.wanData.GeneralInformation.NA[index].dropDown=response.country;

    },(error)=>{
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : this.pageId,
        "pageName" : "Non CIO WAN Tower Input My Data Screen",
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
    object.isFormValid=true;
    object.disableSaveAndCompare=true;
    object.isCopyEnabled = false;
    object.errorMessage="";
    object.activateShowBox(false);
    object.showBlueBorder=true;
    object.wanData.GeneralInformation.NA[object.indexSrcCodeMap["TD0120"]].dropDown=[];
    this.isDeleteAllowed = false;
    try{
      let index = 0;
      let length = object.wanData.GeneralInformation.NA.length;
      //reseting general tab

      while (index < length) {
        object.wanData.GeneralInformation.NA[index].src_code_value='';
        if(object.wanData.GeneralInformation.NA[index].src_code=="TD0100") {
          object.wanData.GeneralInformation.NA[index].src_code_value=new Date().getFullYear();
        }
        if(object.wanData.GeneralInformation.NA[index].src_code=="TD0110") {
          object.wanData.GeneralInformation.NA[index].src_code_value=null;
        }
        index++;
      }
      index = 0;
      length = object.wanData.WANInput.NA.length;
      //reseting MainframeInforamtion
      while (index < length) {
        object.wanData.WANInput.NA[index].src_code_value = '';
        object.wanData.WANInput.NA[index].notes=null;
        if(object.wanData.WANInput.NA[index].value_format!="%"&&object.wanData.WANInput.NA[index].value_format!="#"){
          object.wanData.WANInput.NA[index].value_format="$";
        }
        index++;
      }

      //reseting ITOperationsHeadcount&Locations

    }catch(error){
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : this.pageId,
        "pageName" : "Non CIO WAN Tower Input My Data Screen",
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
    let length = object.wanData.WANInput.NA.length;
    //console.log(placeHolder);
    while(index<length){
      let valueFormat=object.wanData.WANInput.NA[index].value_format;
      //console.log(valueFormat);
      if(valueFormat!="#"&&valueFormat!="%"){
        object.wanData.WANInput.NA[index].value_format=placeHolder;
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
    let length=object.wanData.WANInput.NA.length;

      while(index<length){
        object.sourceCurrencyMap[object.wanData.WANInput.NA[index].src_code]=object.wanData.WANInput.NA[index].value_format
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

    console.log("requesObj",requestObj);
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
      
        object.updateScenarioListNotificationServiceService.getEmitter().emit('updateWanScenarioListAfterDeletion');
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
