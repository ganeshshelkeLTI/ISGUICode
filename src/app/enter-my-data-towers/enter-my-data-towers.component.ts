/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:enter-my-data-towers.component.ts **/
/** Description: This file is created to compare input my data on the landing page and generate new scenario and save them  **/
/** Created By: 10651577  Created Date: 28/09/2018 **/
/** Update By:  10651577  Update Date:  28/09/2018 **/
/** Developed at:  **/
/*******************************************************/
import { getCurrencySymbol } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnterCompareDataTowersService } from '../services/enter-compare-data-towers.service';
import { GenerateScenarioService } from '../services/generate-scenario.service';
import { MainframeInputmydataSharedService } from '../services/mainframe-inputmydata-shared.service';
import { CIOGeneralTabCompanyDetailService } from '../services/ciogeneral-tab-company-detail.service';
import { ToastrService } from 'ngx-toastr';
import { MapSourceCodeDataValues } from '../map-source-code-data-values';
import {
  CioheaderdataService
} from '../services/cioheaderdata.service';
import {
  MainframeEditAndCompareSharedService
} from '../services/mainframe/mainframe-edit-and-compare-shared.service';

import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';
import { PrivilegesService } from '../services/privileges.service';
import { TextMaskModule } from 'angular2-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import {
  HeaderCompareScreenDataService
} from '../services/header-compare-screen-data.service';
import { UpdateScenarioListNotificationServiceService } from '../services/update-scenario-list-notification-service.service';


declare var $: any;

//for decimal numbers
const decimalNumberMask = createNumberMask({
  prefix: '',
  suffix: '',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ',',
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
  thousandsSeparatorSymbol: ',',
  allowDecimal: false,
  integerLimit: null,
  allowNegative: false,
  allowLeadingZeroes: true
});

@Component({
  selector: 'enter-my-data-towers',
  templateUrl: './enter-my-data-towers.component.html',
  styleUrls: ['./enter-my-data-towers.component.css']
})
export class EnterMyDataTowersComponent implements OnInit, OnDestroy {

  numberMask = numberMask;
  decimalNumberMask = decimalNumberMask;
  private scenarioData: any;
  private mapdata: any;
  private disableSaveAndCompare: boolean;
  public inputData: any;
  public isFormValid: boolean = true;
  public showErrorMesssage: boolean = false;
  showDiv: boolean = false;
  public pageId: any; // have not used yet
  validateAvailabilityPercentage: boolean = false;
  validateDollar: boolean = false;
  validateHash: boolean = false;
  private indexSrcCodeMap: Map<string, number>;
  private disabledStatus: any[] = [];
  private sourceCurrencyMap: Map<string, string>;
  private currencyMap: Map<string, string>;//for currency
  public loginUserId: string;

  dashboardId: string;
  private scenarios: any[] = [];

  scenarioDataObj = [];
  mainFrameInputData: any;
  private selectedScanrio: any;
  enteredDataObj: any;
  public scenarioNameText: string;
  dataLoaded: boolean;
  private regions: any = [];
  private countries: any = [];
  private years: any[] = [];
  private currencies: any[] = [];
  errorMessage: string;
  isResetRequired: boolean = false;
  //this flag Variable is created to show
  private showRestBox: boolean;
  confirmBoxResetFlag: boolean = false;
  confirmBoxCloseFlag: boolean = false;

  public userdata: any;
  public emailId: string;
  public sessionId: string;
  privilegesObject: any;
  public showSelectedOptionFlg: boolean = false;
  isDeleteAllowed: boolean = false;
  confirmBoxDeleteFlag: boolean = false;
  public isCopyEnabled: boolean = false;

  //There are some services of CIODashBoard which are reused for mainframe
  constructor(private generateScenarioService: GenerateScenarioService, private genericEnterCompare: EnterCompareDataTowersService, private http: HttpClient, private commonService: CioheaderdataService, private toastr: ToastrService, private mainframeSharedService: MainframeInputmydataSharedService, private generalTabService: CIOGeneralTabCompanyDetailService, private mainframeEditAndCompareSharedService: MainframeEditAndCompareSharedService, private loginDataBroadcastService: LoginDataBroadcastService, private privilegesService: PrivilegesService, private compareHeaderDataService: HeaderCompareScreenDataService,private updateScenarioListNotificationServiceService: UpdateScenarioListNotificationServiceService) {
    let object = this;
    this.dashboardId = "2";
    object.indexSrcCodeMap = new Map<string, number>();
    object.dataLoaded = false;
    object.selectedScanrio = "0";
    object.genericEnterCompare.setPopID(2);
    object.errorMessage = "";
    object.isFormValid = true;
    object.disableSaveAndCompare = true;
    object.sourceCurrencyMap = new Map<string, string>();
    object.activateShowBox(false);
    let loginSharedData = object.loginDataBroadcastService.getEmitter();
    loginSharedData.on('setLoginData', function () {
      object.getUserLoginInfo();
    });
    object.privilegesObject = object.privilegesService.getData();
    object.privilegesService.getEmitter().on('updatePrivileges', function () {
      object.privilegesObject = object.privilegesService.getData();
    });

    //update scenariolist after deletion from compare modal
    updateScenarioListNotificationServiceService.getEmitter().on('updateMainframeScenarioListAfterDeletion', function () {
      object.getScenariosList(0);
    });

    //update scenariolist after deletion from input my data
    //  compareHeaderDataService.getEmitter().on('updateMainframeScenarioListAfterDeletion', function(){
    //   object.getScenariosList(0);
    // });
  }

  getUserLoginInfo() {
    let _self = this;
    _self.userdata = _self.loginDataBroadcastService.get('userloginInfo');
    _self.emailId = _self.userdata['userDetails']['emailId'];
    _self.sessionId = _self.userdata['userDetails']["sessionId"];
  }

  ngOnInit() {
    let object = this;

    object.getUserLoginInfo();
    object.isDeleteAllowed = false;
    object.isCopyEnabled = false;

    object.loginUserId = object.sessionId;

    let data = object.mainframeEditAndCompareSharedService.getData();
    if (data != undefined) {

    }

    object.mainframeEditAndCompareSharedService.getEmitter().on('editmainframescenario', function () {
      let scenarioID = object.mainframeEditAndCompareSharedService.getData().selectedScanrio;

      if (scenarioID == 0) {
        object.selectedScanrio = 0;
        object.scenarioNameText = "";
        object.resetAll();
      } else {
        object.selectedScanrio = scenarioID;
        object.getScenarioDataById();
      }

    })

    this.getInputEnterData();
    this.getScenariosList(this.selectedScanrio);
  }

  ngOnDestroy(): void {
    let object = this;
    let emitter = object.loginDataBroadcastService.getEvent();
    emitter.removeAllListeners('setLoginData');
    this.privilegesService.getEmitter().removeAllListeners();
  }

  //function for getting scenario list & appending new scenario
  getScenariosList(defaultScarioId) {
    let object = this;
    object.genericEnterCompare.setPopID(2);
    object.genericEnterCompare.getScanrioData().subscribe((response: any) => {
      object.scenarios = [];
      for (let key in response) {
        let scenario: any = {};
        scenario.key = key
        scenario.value = key + "_" + response[key];
        scenario.name = response[key]; //adding name in scenarioList
        object.scenarios.push(scenario);
      }
      object.scenarios.reverse();
      object.selectedScanrio = defaultScarioId;
      try {
        object.scenarioNameText = object.getScenarioName(object.selectedScanrio);
      } catch (error) {

        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId": this.pageId,
          "pageName": "Non CIO Mainframe Tower Input My Data Screen",
          "errorType": "warn",
          "errorTitle": "Data Error",
          "errorDescription": error.message,
          "errorObject": error
        }

        throw errorObj;

      }
      if (this.isResetRequired) {
        this.resetAll();
      }
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": this.pageId,
        "pageName": "Non CIO Mainframe Tower Input My Data Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
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
    try {
      object.resetAll();
    } catch (error) {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": this.pageId,
        "pageName": "Non CIO Mainframe Tower Input My Data Screen",
        "errorType": "warn",
        "errorTitle": "Data Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    }
    object.selectedScanrio = scenarioID;//after reset again reseting selectedScenario


    if (object.selectedScanrio == 0) {
      object.scenarioNameText = "";
      return;
    }



    let requestedParam = {
      "userID": object.loginUserId,
      "dashboardId": "2",
      "scenarioId": []
    }
    //get id from emitter and assign to "savedScenarioId"
    //setting name of selected Scenario
    try {
      // object.scenarioNameText = object.scenarios[object.selectedScanrio-1].name;
      object.scenarioNameText = object.getScenarioName(object.selectedScanrio);


    } catch (error) {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": this.pageId,
        "pageName": "Non CIO Mainframe Tower Input My Data Screen",
        "errorType": "warn",
        "errorTitle": "Data Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    }

    object.generateScenarioService.getSavedScenarioDataToPopulate(object.dashboardId, object.loginUserId, object.selectedScanrio).subscribe((response) => {
      object.isCopyEnabled = true;
      let index = 0;
      let length = object.inputData.MainframeInput.NA.length;
      // let swapping=response.MainframeInput.NA[0];
      // response.MainframeInput.NA[0]=response.MainframeInput.NA[1];
      // response.MainframeInput.NA[1]=swapping;

    
      while (index < length) {
        object.inputData.MainframeInput.NA[index].src_code_value = response.MainframeInput.NA[index].src_code_value;
        object.inputData.MainframeInput.NA[index].notes = response.MainframeInput.NA[index].notes;
        index++;
      }

     
      index = 0;
      response.GeneralInformation.NA = response.GeneralInformation.NA.slice(1, response.GeneralInformation.NA.length);
      length = response.GeneralInformation.NA.length;

      while (index < length) {
        object.inputData.GeneralInformation.NA[index].src_code_value = response.GeneralInformation.NA[index].src_code_value;
        if (object.inputData.GeneralInformation.NA[index].src_code == "ICE002") {
          let currenyId = object.inputData.GeneralInformation.NA[index].src_code_value
          //changing placeholder acc to currency present in selected scenario
          object.changePlaceHolder(getCurrencySymbol(object.currencyMap[currenyId], "narrow"));
        }
        index++;
      }
      object.getCountryByRegion(object.indexSrcCodeMap["TD0120"], object.inputData.GeneralInformation.NA[object.indexSrcCodeMap["TD0110"]].src_code_value);

      object.checkValidation();

      object.activateShowBox(false);
      object.isDeleteAllowed = true;
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": this.pageId,
        "pageName": "Non CIO Mainframe Tower Input My Data Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })
  }

  getScenarioName(key): string {
    let object = this;
    let name = "";
    for (let scenario of object.scenarios) {
      if (scenario.key == key) {
        name = scenario.name;
      }
    }

    return name;
  }

  getAllRegion(index) {
    let object = this;
    object.generalTabService.getAllRegion().subscribe((response: any) => {
      let regionGlobal = { key: "", value: "Global", id: "Global" };
      response.region.unshift(regionGlobal);
      object.inputData.GeneralInformation.NA[index].dropDown = response.region;
      object.regions = response.region;
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": this.pageId,
        "pageName": "Non CIO Mainframe Tower Input My Data Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })
  }

  getAllCountries(index) {
    let object = this;
    object.generalTabService.getAllCountry().subscribe((response: any) => {
      object.inputData.GeneralInformation.NA[index].dropDown = response.country;
      object.inputData.GeneralInformation.NA[index].src_code_value = null;;

      object.countries = response.country;
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": this.pageId,
        "pageName": "Non CIO Mainframe Tower Input My Data Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })
  }

  getAllReportingCurrency(index) {
    let object = this;

    object.generalTabService.getAllCurrency().subscribe((response: any) => {
      object.inputData.GeneralInformation.NA[index].dropDown = response.currencyExchange;
      object.currencies = response.currencyExchange;
      object.currencyMap = new Map<string, string>();

      for (let element of object.currencies) {
        object.currencyMap[element.key] = element.value;
      }
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": this.pageId,
        "pageName": "Non CIO Mainframe Tower Input My Data Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })

  }

  interceptGeneralTabChanges(srcCode) {
    let object = this;

    object.activateShowBox(true);

    let index = 0;
    if (srcCode == "TD0110") {
      object.inputData.GeneralInformation.NA[object.indexSrcCodeMap["TD0120"]].src_code_value = null;
      object.inputData.GeneralInformation.NA[object.indexSrcCodeMap["TD0120"]].dropDown = [];

      object.getCountryByRegion(object.indexSrcCodeMap["TD0120"], object.inputData.GeneralInformation.NA[object.indexSrcCodeMap["TD0110"]].src_code_value);
    }
    if (srcCode == "ICE002") {
      let value = object.inputData.GeneralInformation.NA[object.indexSrcCodeMap["ICE002"]].src_code_value;
      
      object.changePlaceHolder(getCurrencySymbol(object.currencyMap[value], "narrow"));
    }
    while (index < length) {
      if (object.inputData.CIODashboardDataGeneralTab.NA[index].src_code == "ICE002") {
        object.inputData.CIODashboardDataGeneralTab.NA[index].src_code_value = "FE482E13-D3B6-4208-8C3C-2FD7AFBEBEA1"
      }
    }

  }

  unmaskComma(value) {
    let val: any;
    val = (value.toString()).replace(/,/g, "");
    return val;
  }

  checkValidation() {
    let object = this;

    object.activateShowBox(true);

    let data = this.inputData;
    let length = data.MainframeInput.NA.length;
    object.isFormValid = true;
    object.errorMessage = "";
    let i = 0;
    let value_format;
    let Sum = 0;

    let requiredFilled = true;
    let arePercentageValid = true;
    let hasEnteredSum = false;

    while (i < length) {
      value_format = data.MainframeInput.NA[i].value_format;
      let srcCodeValue = data.MainframeInput.NA[i].src_code_value;
      let indidcator = data.MainframeInput.NA[i].indicator;
      let srcCode = data.MainframeInput.NA[i].src_code;
      if (srcCodeValue != null && srcCodeValue != undefined && srcCodeValue != "") {
        srcCodeValue = object.unmaskComma(srcCodeValue);
      }
      if (value_format == "%" && srcCodeValue > 100) {
        object.isFormValid = false;
        object.errorMessage = "Percentage must be between 0 and 100";
        arePercentageValid = false;
        
      }
      if (indidcator == 'R') {
        if (srcCodeValue == undefined || srcCodeValue == null || srcCodeValue == "" || srcCodeValue.trim().length == 0) {
          this.isFormValid = false;
          this.errorMessage = "Please enter the required fields";
          requiredFilled = false;
          
        }
        ;
      }

      i++;
    }





    if (!arePercentageValid || !requiredFilled) {
      this.isFormValid = false;
      
      if (!requiredFilled)
        this.errorMessage = "Please enter the required fields"

      if (!arePercentageValid)
        this.errorMessage = "Percentage must be between 0 and 100"

    } else {
      this.isFormValid = true;
      this.errorMessage = ""
      

    }

    this.disableSaveAndCompare = !this.isFormValid;
    // object.isCopyEnabled = this.isFormValid;
  }

  saveAndCompare(onlySave) {
    //after save we are not supposed to show confirmation box

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
    //let category = Object.values(this.inputData);
    let category = Object.keys(this.inputData).map(e => this.inputData[e])

    length1 = Object.keys(this.inputData).length;
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
          if (t1.value != null && t1.value != "" && t1.value != undefined) {
            t1.value = (t1.value.toString()).replace(/,/g, "");
          }

          //once save note functionality done append value of each src code note here
          t1.note = obj.notes;
          this.scenarioDataObj.push(t1);
        }
      }
    }

    let selectedScanrio = this.selectedScanrio;
    if (selectedScanrio.src_code_value <= 0) {
      this.isFormValid = false;
    }
    if (selectedScanrio == 0) {
      selectedScanrio = null;
    }
    this.enteredDataObj.scenario.dashboardID = 2;
    this.enteredDataObj.scenario.userId = "E5E8339B-0620-4377-82FE-0008029EDC53";
    this.enteredDataObj.scenario.projectId = "679D007C-C668-40E1-A60E-06391512F388"; //ISG
    this.enteredDataObj.scenario.clientID = "E5E8339B-0620-4377-82FE-0008029EDC5311";
    this.enteredDataObj.scenario.scenarioID = selectedScanrio;
    this.enteredDataObj.scenario.scenarioName = this.scenarioNameText;

    this.enteredDataObj.sessionId = this.sessionId;

    this.enteredDataObj.kpi_maintenance_data = this.scenarioDataObj;
    let resetRequired = onlySave;

    this.generateScenarioService.savedNewScenario(this.enteredDataObj).subscribe((response) => {
      let message;
      this.isCopyEnabled = true;
      if (selectedScanrio == null) {
        message = "Saved";
        this.isResetRequired = !onlySave;
        //updating ScenarioList After Updating
        this.getScenariosList(response.value);

        //set saved scenario to service
        this.mainframeSharedService.setScenarioSelection(response.value);
        if (onlySave) {
          //trigger a emitter to let landing page know
          this.mainframeSharedService.getEmitter().emit('newScenarioSaved');
        }

      } else {
        message = "updated";
        this.isResetRequired = !onlySave;
        this.getScenariosList(response.value);
      }

      let description = this.scenarioNameText;
      if (description == undefined || description == undefined || description.trim().length == 0) {
        description = response.value + '_Scenario ' + response.value;
      } else {
        description = response.value + '_' + this.scenarioNameText;
      }
      this.toastr.info('Scenario ' + description + " " + message, '', {
        timeOut: 7000,
        positionClass: 'toast-top-center'
      });
      this.isDeleteAllowed = true;
      if (!onlySave) {
        //if user has not selected any currency ,then we are showing comparision in USD
        let currency = this.inputData.GeneralInformation.NA[this.indexSrcCodeMap["ICE002"]].src_code_value;
        let region = this.inputData.GeneralInformation.NA[this.indexSrcCodeMap["TD0110"]].src_code_value;
        if (currency == undefined || currency == null || currency.trim().length == 0) {
          currency = "FE482E13-D3B6-4208-8C3C-2FD7AFBEBEA1";//USD key
        }
        let sharedData = { "comparisionData": this.scenarioDataObj, "currency": currency, "region": region, "map": this.sourceCurrencyMap };
        this.mainframeSharedService.setData(sharedData);
        if (selectedScanrio != null) {
          this.mainframeSharedService.setScenarioSelection(selectedScanrio);
        }

       
        this.mainframeSharedService.getEmitter().emit('navigatedFromInputMyData');
      }

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": this.pageId,
        "pageName": "Non CIO Mainframe Tower Input My Data Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });

  }


  toggle() {
    this.showDiv = !this.showDiv;
  }

  //function for fetching data from service
  getInputEnterData() {
    let object = this;
    this.genericEnterCompare.getInputData().subscribe((data: any) => {
      this.inputData = data;
      //slicing it since
      object.inputData.GeneralInformation.NA = object.inputData.GeneralInformation.NA.slice(1, object.inputData.GeneralInformation.NA.length);
      object.populateGeneralTab();
      object.prepareSourceCurrentMap();
      object.isDeleteAllowed = false;
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": this.pageId,
        "pageName": "Non CIO Mainframe Tower Input My Data Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });
  }

  populateGeneralTab() {
    let object = this;
    try {
      let index = 0;
      let length = object.inputData.GeneralInformation.NA.length;
      while (index < length) {

        let row: any = {};
        row.disabled = false;

        if (object.inputData.GeneralInformation.NA[index].src_code == "ICE002") {
          object.indexSrcCodeMap["ICE002"] = index;
          object.getAllReportingCurrency(index);
          row.disabled = false;

        }
        if (object.inputData.GeneralInformation.NA[index].src_code == "TD0100") {
          object.indexSrcCodeMap["TD0100"] = index;
          object.getAllYear(index);
        } if (object.inputData.GeneralInformation.NA[index].src_code == "TD0110") {
          object.indexSrcCodeMap["TD0110"] = index;
          object.getAllRegion(index);
        } if (object.inputData.GeneralInformation.NA[index].src_code == "TD0120") {
          object.indexSrcCodeMap["TD0120"] = index;
        }

        object.disabledStatus.push(row);
        index++;

      }

      object.dataLoaded = true;
    } catch (error) {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": this.pageId,
        "pageName": "Non CIO Mainframe Tower Input My Data Screen",
        "errorType": "warn",
        "errorTitle": "Data Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    }

  }

  getAllYear(index: number) {
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
  //getting countries by region
  getCountryByRegion(index, regionId) {
    let object = this;

    object.generalTabService.getCountriesByRegion(regionId).subscribe((response: any) => {



      object.inputData.GeneralInformation.NA[index].dropDown = response.country;

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": this.pageId,
        "pageName": "Non CIO Mainframe Tower Input My Data Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });

  }

  //resetAll all fields
  resetAll() {
    let object = this;
    object.selectedScanrio = 0;
    object.scenarioNameText = "";
    this.validateAvailabilityPercentage = false;
    object.isFormValid = true;
    object.disableSaveAndCompare = true;
    object.isCopyEnabled = false;
    object.errorMessage = "";
    object.activateShowBox(false);

    //setting countries and resetting countries
    object.inputData.GeneralInformation.NA[object.indexSrcCodeMap["TD0120"]].dropDown = [];
    try {
      let index = 0;
      let length = object.inputData.GeneralInformation.NA.length;
      //reseting general tab

      while (index < length) {
        object.inputData.GeneralInformation.NA[index].src_code_value = '';
       
        if (object.inputData.GeneralInformation.NA[index].src_code == "TD0100") {
          object.inputData.GeneralInformation.NA[index].src_code_value = new Date().getFullYear();
        }
        if (object.inputData.GeneralInformation.NA[index].src_code == "TD0110") {
          object.inputData.GeneralInformation.NA[index].src_code_value = null;
        }
        index++;
      }
      index = 0;
      length = object.inputData.MainframeInput.NA.length;
      //reseting MainframeInforamtion
      while (index < length) {
        object.inputData.MainframeInput.NA[index].src_code_value = '';
        object.inputData.MainframeInput.NA[index].notes=null;
        if (object.inputData.MainframeInput.NA[index].value_format != "%" && object.inputData.MainframeInput.NA[index].value_format != "#") {
          object.inputData.MainframeInput.NA[index].value_format = "$";
        }
        index++;
      }

      object.isDeleteAllowed = false;
      //reseting ITOperationsHeadcount&Locations

    } catch (error) {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": this.pageId,
        "pageName": "Non CIO Mainframe Tower Input My Data Screen",
        "errorType": "warn",
        "errorTitle": "Data Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    }

  }
  changePlaceHolder(placeHolder) {
    let object = this;
    let index = 0;
    let length = object.inputData.MainframeInput.NA.length;
    
    while (index < length) {
      let valueFormat = object.inputData.MainframeInput.NA[index].value_format;
      
      if (valueFormat != "#" && valueFormat != "%") {
        object.inputData.MainframeInput.NA[index].value_format = placeHolder;
      }
      index++;
    }
  }
  prepareSourceCurrentMap() {
    let object = this;
    let index = 0;
    let length = object.inputData.MainframeInput.NA.length;

    while (index < length) {
      object.sourceCurrencyMap[object.inputData.MainframeInput.NA[index].src_code] = object.inputData.MainframeInput.NA[index].value_format
      index++;
    }
  }

  closeEnterDataModal() {
    let object = this;
    if (object.showRestBox) {
      this.confirmBoxCloseFlag = true;
    } else {
      object.resetAll();
      $('.modal-select-to-compare-tower').modal('hide');
    }

  }

  resetBtnHandler() {
    this.confirmBoxResetFlag = true;
  }
  resetConfirmYes(flag) {
    if (flag) {
      this.resetAll();
    }
    this.confirmBoxResetFlag = false;
  }
  closeConfirmYes(flag) {

    if (flag) {
      this.resetAll();
      $('.modal-select-to-compare-tower').modal('hide');

    }

    this.confirmBoxCloseFlag = false;
  }

  activateShowBox(value) {
    let object = this;
    object.showRestBox = value;
  }
  onPaste(srcCodeObj, $event) {
    srcCodeObj.src_code_value = $event.target.value;
    this.checkValidation();
  }

  //this is to open delete modal
  deleteScenario() {
    let object = this;
    object.confirmBoxDeleteFlag = true;
  }

  //this is to delete scenario
  deleteConfirmYes(flag) {
    let object = this;
    if (flag) {
      let userId = object.emailId;
      let requestObj = {
        "userId": userId,
        "dashboardID": object.dashboardId,
        "scenarioIDList": []
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

        let description = object.getScenarioName(tempObj.scenarioId);

        if (description == "" || description == undefined || description.trim().length == 0) {
          description = tempObj.scenarioId + '_Scenario ' + tempObj.scenarioId;
        } else {
          description = tempObj.scenarioId + '_' + description;
        }
        object.toastr.info('Scenario ' + description + " " + message, '', {
          timeOut: 7000,
          positionClass: 'toast-top-center'
        });
        object.updateScenarioListNotificationServiceService.getEmitter().emit('updateMainframeScenarioListAfterDeletion');
      });

      object.confirmBoxDeleteFlag = false;


    } else {
      object.confirmBoxDeleteFlag = false;
    }
  }

  createSceCopy(){
    let object =this;
    //reset general section
    object.selectedScanrio=0;
    object.scenarioNameText='';
  
    //enable save button
    object.disableSaveAndCompare = false;
    object.isCopyEnabled = false;
    object.isDeleteAllowed = false;
  }

}
