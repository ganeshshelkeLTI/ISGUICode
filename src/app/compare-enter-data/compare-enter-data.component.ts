/******************************************* ***********/
/************** © 2019 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:cio-dashboard.component.ts **/
/** Description: This file is created to save, update, validate and retrieve data on input my data form **/
/** Created By: 10651227, 10641888, 10650615 Created Date: 28/09/2018 **/
/** Update By:  10650919  Update Date:  01/10/2018 **/

/*******************************************************/

import {
  Component,
  OnInit,
  ElementRef,
  ViewChild, OnDestroy,
  Compiler
} from '@angular/core';
import {
  GenerateScenarioService
} from '../services/generate-scenario.service';
import {
  Response
} from '@angular/http';
import {
  SiblingDataService
} from '../services/sibling-data.service';
import {
  GetScenarioDataService
} from '../services/get-scenario-data.service';
import {
  CIOEnterMyDataSharedService
} from '../services/cioenter-my-data-shared.service';
import {
  ComparegridService
} from '../services/comparegrid.service';
import {
  CIOGeneralTabCompanyDetailService
} from '../services/ciogeneral-tab-company-detail.service';
import {
  ToastrService
} from 'ngx-toastr';
import {
  CompareGridService
} from '../services/compare-grid.service';
import {
  EditAndCompareSharedService
} from '../services/edit-and-compare-shared.service';
import {
  EventEmitter
} from 'events';
import {
  HeaderCompareEnterDataSharedService
} from '../services/header-compare-enter-data-shared.service';
import { forEach } from '@angular/router/src/utils/collection';
import { PrivilegesService } from '../services/privileges.service';
import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';
import { elementStart } from '@angular/core/src/render3/instructions';
import { getCurrencySymbol } from '@angular/common';
import {
  CioheaderdataService
} from '../services/cioheaderdata.service';

import { TextMaskModule } from 'angular2-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { EnterCompareDataTowersService } from '../services/enter-compare-data-towers.service';
import { UpdateScenarioListNotificationServiceService } from '../services/update-scenario-list-notification-service.service';

declare var $: any;
//for decimal negative
const decimalNegativeNumberMask = createNumberMask({
  prefix: '',
  suffix: '',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ',' ,
  allowDecimal: true,
  decimalSymbol: '.',
  decimalLimit: 6,
  integerLimit: null,
  allowNegative: true,
  allowLeadingZeroes: true
});

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
  selector: 'compare-enter-data',
  templateUrl: './compare-enter-data.component.html',
  styleUrls: ['./compare-enter-data.component.css']
})
export class CompareEnterDataComponent implements OnInit, OnDestroy {
  numberMask = numberMask;
  decimalNumberMask = decimalNumberMask;
  decimalNegativeNumberMask = decimalNegativeNumberMask;
  scenarioDataObj = [];
  enteredDataObj: any;

  myData: any;
  loginUserId: string = "%27E5E8339B-0620-4377-82FE-0008029EDC53%27";
  dashboardId: string;
  public scenarioNameText: string;
  public showSelectedOptionFlg: boolean = false;
  public isISGUser: boolean = true;
  dataLoaded: boolean;
  private dropDown: {
    "dropDown": any,
    "src_code": "string;"
  }
  private dropDowns: any[] = [];
  private saveMode: boolean = false;
  private scenarios: any[] = [];
  private selectedScanrio: any;

  //these are used for storing dropdowns
  private yearDropdown: any[] = [];
  private countries: any = [];
  private regions: any = [];
  private group: any = [];
  private projects: any[] = [];
  private companies: any[] = [];
  private industries: any[] = [];
  private forbesVertical: any[] = [];
  private forbesSubVertical: any[] = [];
  private currencies: any[] = [];
  private disabledStatus: any[] = [];
  private indexSourceCodeMap: any = {};
  private showRestBox: boolean;
  /** Ganesh validation code start*/
  totalannualSpend: number;
  portionInfra: number;
  portionITApplication: number;
  portionITManagement: number;
  sumOfFinanceBreakdown: number;
  operationSpendCondition: boolean = true;
  private singleProject: any;
  private hasOnlyOneProject: any;
  TDD300: any;
  TDD310: any;
  TDD320: any;
  sumOfOutsourcedCost: any;
  private temperoryDisable = false;
  private currencyMap: Map<string, string>;
  //Taking reference of document element in angular
  TDC150: number = 0;
  errorMessageUsersAndLoc: any;

  sumOfITInfraAPlMngEmp: number;
  sumOfITInfraAplMngContractor: number;
  isValidTotalHeadCount: boolean = true;
  errorTotalHeadcountMessage: string;


  //#overallPer
  @ViewChild('overallPer') overAllPercentTag: ElementRef;

  //#generalPer
  @ViewChild('generalPer') generalPercentTag: ElementRef;

  //#financialPer
  @ViewChild('financialPer') financialPercentTag: ElementRef;

  //#overallPer
  @ViewChild('headcountPer') headcountPercentTag: ElementRef;

  //#generalPer
  @ViewChild('itspendPer') itspendPercentTag: ElementRef;


  @ViewChild('Project ID') projectDropDownTag: ElementRef;
  @ViewChild('Company Name') companyDropDownTag: ElementRef;



  enableSaveAndCompareButton: boolean;
  //distribution by tower
  aanualCostEndUser: number;
  annualCostServiceDesk: number;
  annualCostDataCentre: number;
  annualCostNetwork: number;
  annualCostTelecom: number;
  annualCostAppOperations: number;
  annualCostdevProjects: number;
  annualCostITSecurity: number;
  sumOfTowerBreakDown: number;
  TowerValidationCondition: string = 'true';
  annualSpendITSecurity: number;

  //IT spending type
  itCostPersonel: number = 0;
  ITcostHardware: number = 0;
  ITcostSoftware: number = 0;
  ITCostOutSourced: number = 0;
  ITCostOthers: number = 0;
  sumOfITSpending: number = 0;
  ITCostValidation: string = 'true';

  //Run transform Business
  itCostRunBusiness: number = 0;
  itCostChangeBusiness: number = 0;
  itCostTransBusiness: number = 0;
  sumITChangeTransform: number = 0;
  ITChangeTransformValidation = 'true';

  //IT CAAPITAL
  itCapitalSpend: number = 0;
  itOperationSpend: number = 0;
  sumOfITCapital: number = 0;
  ITCapitalValidation = 'true';


  sumOfEndUserthroughtelecom: number;
  sumOfOperAndDevProj: number;
  sumOfITSecurity: number;
  isSumOfEndUserthroughtelecomValid: boolean = true;
  isSumOfOperAndDevProjValid: boolean = true;
  isSumOfITSecurityValid: boolean = true;
  totalNumOfEmp: number = 0;
  numOfITUsersServed: number = 0;
  isITUsersServedValid: boolean = true;
  totalNumOfITEmp: number;
  numOfITInfraEmp: number;
  totalNumOfITContractor: number;
  numOfITInfraContractor: number;
  numOfITAplEmp: number;
  numOfITAplContractor: number;
  numOfITManagementEmp: number;
  numOfITManagementContractor: number;
  isItInfraEmpValid: boolean = true;
  isITInfraContractorValid: boolean = true;
  isITAplEmpValid: boolean = true;
  ITAplContractorValid: boolean = true;
  isITManagementEmpValid: boolean = true;
  isITManagementContractorValid: boolean = true;
  showErrorMesssage: boolean = false;
  isFormValid: boolean = true;
  isFormedFilled: boolean = false;
  isDeleteAllowed: boolean = false;

  scenarioId: string;
  errorMessageFinanceTowerBreakdown: string;
  errorMessageItOperationsHeadcountAndLocation: string;

  annualRev: number;
  netProfit: number;
  errorMessageCompFin: string;
  isCompFinValid: boolean = true;

  totalITEmployees: number;


  public generalVar: boolean = false;
  public generalVar1: boolean = false;

  public emitter = new EventEmitter();
  private sourceCurrencyMap: Map<string, string>;
  isResetRequired: boolean = false;
  confirmBoxResetFlag: boolean = false;
  confirmBoxCloseFlag: boolean = false;
  confirmBoxDeleteFlag: boolean = false;

  isBlack: boolean = true;
  isFinanceBreakdownBlack: boolean = true;
  isTowerBreakdownBlack: boolean = true;
  isITSpendBlack: boolean = true;
  isRunBlack: boolean = true;
  isCapitaBlank: boolean = true;
  isTotalHeadCountBlack: boolean = true;

  loggedInUserInfo: any;

  public userdata: any;
  public emailId: string;
  public sessionId: string;
  public isInternal: string;
  privilegesObject: any;
  private hasOnlyCompany: boolean;
  private singleCompany: any;

  appEmpOffshorePerc: number = 0;
  appContraOffshorePerc: number = 0;
  infraEmpOffshorePerc: number = 0;
  infraContraOffshorePerc: number = 0;
  managementEmpOffshorePerc: number = 0;
  managementContraOffshorePerc: number = 0;

  public financeDataBreakDownError: string = "";
  public spendingTypeError: string = "";
  public runchangetranError:string = "";
  public capitalError:string = "";
  public userKeyDetails: any;
  public isCopyEnabled: boolean = false;

  constructor(private generateScenarioService: GenerateScenarioService,
    private siblingData: SiblingDataService,
    private getScenarioDataService: GetScenarioDataService,
    private cIOEnterMyDataSharedService: CIOEnterMyDataSharedService,
    private comparegridsharedservice: ComparegridService,
    private generalTabService: CIOGeneralTabCompanyDetailService,
    private toastr: ToastrService,
    private compareGridService: CompareGridService,
    private editAndCompareSharedService: EditAndCompareSharedService,
    private inputMyDataheaderSharedService: HeaderCompareEnterDataSharedService,
    private loginDataBroadcastService: LoginDataBroadcastService,
    private privilegesService: PrivilegesService,
    private compiler: Compiler,
    private commonService: CioheaderdataService,
    private enterCompareDataTowersService:EnterCompareDataTowersService,
    private updateScenarioListNotificationServiceService: UpdateScenarioListNotificationServiceService) {
    let object = this;
    //update scenariolist after deletion from compare modal
    updateScenarioListNotificationServiceService.getEmitter().on('updateCIOScenarioListAfterDeletion', function(){
      object.getScenariosList(0);
    });
    object.hasOnlyOneProject = false;
    object.hasOnlyCompany = false;
    object.privilegesObject = object.privilegesService.getData();

    object.privilegesService.getEmitter().on('updatePrivileges', function () {
      object.privilegesObject = object.privilegesService.getData();
    });

    let loginSharedData = object.loginDataBroadcastService.getEmitter();
    loginSharedData.on('setLoginData', function () {
      object.getUserLoginInfo();
    })

    object.loggedInUserInfo = JSON.parse(localStorage.getItem('userloginInfo'));

    object.dataLoaded = false;
    object.enableSaveAndCompareButton = true;
    object.selectedScanrio = 0;
    object.dashboardId = "1";
    object.sourceCurrencyMap = new Map<string, string>();
    object.activateShowBox(false);
    //Path 3//this callback will be invoked when we click on edit and compare from
    //compare screen and component is already being initialized
    object.editAndCompareSharedService.getEmitter().on('dataChange', function () {
      let sharedData = object.editAndCompareSharedService.getData();

      object.isResetRequired = false;
      object.setScenarioId(parseInt(sharedData.selectedScanrio));

    });

    object.emitter.on('calculate', function () {
      if (object.generalVar && object.generalVar1)
        object.calculateGeneralPercentage();
    });
    //this will be invoked when some one will click input my data from header
    object.inputMyDataheaderSharedService.getEmitter().on('showSaveAndCompareButton', function () {
      object.enableSaveAndCompareButton = true;
      object.resetEnterFormTabular();
    });
    //this will be invoked when someone will click on edit scenario and enter new scenario from compare screen
    object.editAndCompareSharedService.getEmitter().on('hideSaveAndCompareButton', function () {
      object.enableSaveAndCompareButton = true;
      object.resetEnterFormTabular();
    })

    //this is a hack,we are trying to get boolean value from shared service between compare and compare enter my data
    //this will be set from compare enter my data.
    //it will be set true by default but when i click on enter new scenario from compare screen
    let showSaveAndCompare = object.editAndCompareSharedService.isShowSaveAndCompareButton();
    object.enableSaveAndCompareButton = true;

  }

  // get selected company data
  getCompanyData(clientId) {
    let object = this;
    object.generalTabService.getCompanyDetails(clientId).subscribe((response) => {

      

      
      let selectedValues = response["Default Drop Down Values"]
      let projects = response['ICE000'];


      object.populateGeneralTab(selectedValues);
      object.getCompanyProjects(object.indexSourceCodeMap['ICE000'], clientId);

      object.generalVar1 = true;
      object.emitter.emit('calculate');

    }, (error) => {
      
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "1",
        "pageName": "CIO Dashboard Input My Data Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;

    })

  }
  // get selected company data

  //it will be invoked when you click on any dropdown in general tab
  interceptGeneralTabChange(srcCode) {

    let object = this;
    let inputTags = object.myData.CIODashboardDataGeneralTab.NA;
    object.activateShowBox(true);
    if (srcCode == "ICE001") {
      for (let inputTag of inputTags) {
        if (inputTag.src_code == "ICE001") {

          object.setDefaultValues();
          object.myData.CIODashboardDataGeneralTab.NA[object.indexSourceCodeMap["ICE000"]].src_code_value = null;
          object.myData.CIODashboardDataGeneralTab.NA[object.indexSourceCodeMap["ICE000"]].dropDown = [];
          object.getCompanyData(inputTag.src_code_value);

        }
      }
    }

    if (srcCode == "TD0110") {
      for (let inputTag of inputTags) {
        if (inputTag.src_code == "TD0110") {
          object.myData.CIODashboardDataGeneralTab.NA[object.indexSourceCodeMap["TD0120"]].src_code_value = null;
          object.myData.CIODashboardDataGeneralTab.NA[object.indexSourceCodeMap["TD0120"]].dropDown = [];
          object.updateCountryDropDown(inputTag.src_code_value);

        }
        if (inputTag.src_code == "TD0120") {
          inputTag.dropDown = [];
        }
      }
    }
    if (srcCode == "ICE007") {
      for (let inputTag of inputTags) {
        if (inputTag.src_code == "ICE007") {


          object.myData.CIODashboardDataGeneralTab.NA[object.indexSourceCodeMap["ICE008"]].src_code_value = null;
          object.myData.CIODashboardDataGeneralTab.NA[object.indexSourceCodeMap["ICE008"]].dropDown = [];
          object.updateIndustryGroup(inputTag.src_code_value);

        }

      }
    }
    if (srcCode == "TDA100") {
      for (let inputTag of inputTags) {
        if (inputTag.src_code == "TDA100") {


          object.myData.CIODashboardDataGeneralTab.NA[object.indexSourceCodeMap["TDA105"]].src_code_value = null;
          object.myData.CIODashboardDataGeneralTab.NA[object.indexSourceCodeMap["TDA105"]].dropDown = [];
          object.updateForbesSubVertical(inputTag.src_code_value);

        }

      }
    }

    if (srcCode == "ICE002") {
      for (let inputTag of inputTags) {
        if (inputTag.src_code == "ICE002") {



          let value = object.myData.CIODashboardDataGeneralTab.NA[object.indexSourceCodeMap["ICE002"]].src_code_value;
         
          object.changePlaceHolder(getCurrencySymbol(object.currencyMap[value], "narrow"));

        }

      }

    }

    this.calculateGeneralPercentage();
    //added bcz of updated general percentage after set dynamic data
    setTimeout(() => {
      this.calculateGeneralPercentage();
    }, 2000);

  }

  //  Track
  customTrackBy(index: number, obj: any): any {
    return index;
  }
  //  Track

  
  getUserLoginInfo() {
    let _self = this;
    _self.userdata = _self.loginDataBroadcastService.get('userloginInfo');
    _self.emailId = _self.userdata['userDetails']['emailId'];
    _self.sessionId = _self.userdata['userDetails']["sessionId"];
    _self.isInternal = _self.userdata['userDetails']['isInternal'];
  }

  ngOnInit() {
    let object = this;
    object.isCopyEnabled = false;
    object.getUserLoginInfo();
    this.siblingData.enterDataHeaderFlagMessage.subscribe(message => this.showSelectedOptionFlg = message);
    //this.getScenarioDataById();
    let sharedData = this.editAndCompareSharedService.getData();

    //it will be undefined if no user had directly clicked on input my data from header for first time
    //it wont be undefined when user will click on edit scenario from compare screen
    //This will be invoked from only when input my data is launched from first time
    //#Path 1,#Path 2
   
    if (sharedData == undefined) {
      this.getAllTabsData(0);

    } else {
      object.temperoryDisable = true;
      object.getAllTabsData(parseInt(sharedData.selectedScanrio));
      object.selectedScanrio = parseInt(sharedData.selectedScanrio)
      //disable projectId and Company
      // this.setScenarioId(parseInt(sharedData.selectedScanrio));
      object.enableSaveAndCompareButton = false;

    }
    //get Scenaril list and auto select scenario
    this.getScenariosList(this.selectedScanrio);
    this.validateFinanceBreakDown();
    this.validateFinanceTowerBreakDown();
    this.onITSpendingType();
    this.onRunChangeTransform();
    this.onCapitalChange();
    this.validateItOperationsHeadcountAndLocations();
    this.validateUsersAndLocations();
    this.validateCompFinancial();
    this.validateOutsorced();
    this.validateTotalHeadcount();
    this.isFormValid = true;
    //calculations

    this.calculatePercentage();
    this.calculateGeneralPercentage();
    this.isFormedFilled = false;
    this.isDeleteAllowed = false;
    

  }


  //this functions are made for validations
  OnCompFinChnage($event, companyInfo) {

    //if TDB200(profit in net millions), retain negative value
    // if (companyInfo.src_code == 'TDB200') {
      // $event.target.value = companyInfo.src_code_value;
    // }

    this.calculatePercentage();
    this.validateCompFinancial();
  }

  onFinanceDataChange(event: any) {

    let object = this;
    object.calculatePercentage();

    // let _self = this;
    if(object.myData.ITOperationsSpending.ITFinancialData[0].src_code_value == null || object.myData.ITOperationsSpending.ITFinancialData[0].src_code_value==""||object.myData.ITOperationsSpending.ITFinancialData[0].src_code_value==undefined){
      object.totalannualSpend = null;
    }else{
      object.totalannualSpend = Number(this.unmaskComma(object.myData.ITOperationsSpending.ITFinancialData[0].src_code_value));
    }
    

    //if nothing is entered in IT financial breakdown, do not call validation on it
    //appending dynamic values

    let ITOperationsSpendingBreakDown = true;

    object.myData.ITOperationsSpending.ITFinancialDataBreakdown.forEach(element => {
      if (element.src_code_value != null) {
        ITOperationsSpendingBreakDown = false;
      }

    });


    if (object.totalannualSpend >= 0 && ITOperationsSpendingBreakDown != true) {
      object.validateFinanceBreakDown();
    }

  };

  validateFinanceBreakDownOnChange(event: any) {
    this.calculatePercentage();

    this.validateFinanceBreakDown();
  };

  onFinanceBreakTower(event: any) {
    this.calculatePercentage();
    this.validateFinanceTowerBreakDown();
  };

  ITspendingTypeChange(event: any) {
    this.calculatePercentage();
    this.onITSpendingType();
  };

  RunChangeTransform(event: any) {
    this.calculatePercentage();
    this.onRunChangeTransform();
  };

  capitalChange(event: any) {
    this.calculatePercentage();
    this.onCapitalChange();
  };

  OnOutsourcedChanged(event: any) {
    this.calculatePercentage();
    this.validateOutsorced();
  }

  onTotalNumEmplChange(event: any) {
    this.calculatePercentage();
    this.validateUsersAndLocations();
    this.validateTotalHeadcount();
  }

  validateUsersAndLocationsOnChange(event: any) {
    this.calculatePercentage();
    this.validateUsersAndLocations();
  };

  OnTotalHeadcountChange(event: any) {
    this.calculatePercentage();
    this.validateTotalHeadcount();
  }

  ITOperationsHeadcountChange(event: any) {
    this.calculatePercentage();
    this.validateItOperationsHeadcountAndLocations();
  };

 netProfitSrcAvailable:boolean = false;
  validateCompFinancial() {
    let object = this;


    object.myData.CompanyFinancialInformationGeneralTab.NA.forEach(element => {
      
      // if(element.src_code == "TDB200"){
      //   object.netProfitSrcAvailable = true;
      // }


      if (element.src_code == "TDB100") {
        if(element.src_code_value == null || element.src_code_value == "" || element.src_code_value ==undefined ){
          object.annualRev = Number(element.src_code_value);
        }else{
          object.annualRev = Number(this.unmaskComma(element.src_code_value));
        }
      } else if (element.src_code == "TDB200") {
        if(element.src_code_value == null || element.src_code_value == "" || element.src_code_value ==undefined ){
          object.netProfit = Number(element.src_code_value);
        }else{
          object.netProfit = Number(this.unmaskComma(element.src_code_value));
        }
      }
    });

    // if(object.netProfitSrcAvailable == false){
    //   object.isCompFinValid = true;
    //   object.isFormValid = true;
    // }else 
    if (object.annualRev == 0 && object.netProfit == 0) {

      object.isCompFinValid = true;
      object.isFormValid = true;

    } else if (object.annualRev != 0 && (Number(object.annualRev) > Number(object.netProfit))) {

      object.isCompFinValid = true;
      object.isFormValid = true;

    } else {
      object.errorMessageCompFin = "Annual revenue must be greater than net profit.";
      object.isFormValid = false;
      object.isCompFinValid = false;


    }

    if (object.ITCostValidation == 'true' && object.isITUsersServedValid && this.ITCapitalValidation == 'true' && object.ITChangeTransformValidation == 'true' && object.isItInfraEmpValid && object.operationSpendCondition && object.isSumOfEndUserthroughtelecomValid && object.isCompFinValid && object.isValidTotalHeadCount) {
      object.isFormValid = true;
    }
    else {
      object.isFormValid = false;
    }

    object.calculatePercentage();
  }

  public ITFinBreakErrorMsg: string;

  validateFinanceBreakDown() {
    let object = this;
    
        try {
    
          //appending dynamic values
          let FinBreakValueChanged = false;
          this.financeDataBreakDownError = "";
          if(object.myData.ITOperationsSpending.ITFinancialData[0].src_code_value == null || object.myData.ITOperationsSpending.ITFinancialData[0].src_code_value==""||object.myData.ITOperationsSpending.ITFinancialData[0].src_code_value==undefined){
            object.totalannualSpend = null;
          }else{
            object.totalannualSpend = Number(this.unmaskComma(object.myData.ITOperationsSpending.ITFinancialData[0].src_code_value));
          }
          
          this.myData.ITOperationsSpending.ITFinancialDataBreakdown.forEach(element => {
    
            if (element.src_code_value != '') {
              FinBreakValueChanged = true;
            }
    
    
            if (element.src_code == "TDD150") {
              if(element.src_code_value == null || element.src_code_value == ''){
                this.portionInfra = null;
              }else{
                this.portionInfra = Number(this.unmaskComma(element.src_code_value));
              }
            } else if (element.src_code == "TDD160") {
              if(element.src_code_value == null || element.src_code_value == ''){
                this.portionITApplication = null;
              }else{
                this.portionITApplication = Number(this.unmaskComma(element.src_code_value));
              }
            } else if (element.src_code == "TDD170") {
              if(element.src_code_value == null || element.src_code_value == ''){
                this.portionITManagement = null;
              }else{
                this.portionITManagement = Number(this.unmaskComma(element.src_code_value));
              }
            }
          });
    
          if (null == this.portionInfra && null == this.portionITApplication && null == this.portionITManagement) {
            this.sumOfFinanceBreakdown = undefined;
          }else {
            this.sumOfFinanceBreakdown = this.portionInfra + this.portionITApplication + this.portionITManagement;
          }
    
          var totalannualSpend = Number(this.totalannualSpend);
          var financeDataBreak = Number(this.sumOfFinanceBreakdown);
    
      
    
          //in case of portion it spend is not equal to total it spend
          if (null == this.portionInfra && null == this.portionITApplication && null == this.portionITManagement){
            this.operationSpendCondition = true;
          }else if(this.totalannualSpend != null && this.sumOfFinanceBreakdown >= 0 && 
            (totalannualSpend.toFixed(6) == financeDataBreak.toFixed(6)) && null != this.portionInfra && null != this.portionITApplication && null != this.portionITManagement) {
            this.operationSpendCondition = true;
          }
          else if(this.totalannualSpend == null && Number(this.sumOfFinanceBreakdown) >= 0){
            if (null == this.portionInfra || null == this.portionITApplication || null == this.portionITManagement){
              this.isFinanceBreakdownBlack = true;
            }else{
              this.isFinanceBreakdownBlack = false;
            }
            this.financeDataBreakDownError = "The entries for the top three cells is: "+financeDataBreak+" it must equal the Annual IT Spend entry of: "+this.totalannualSpend+". Please revise to continue.";
            this.operationSpendCondition = false;
            this.isFormValid = false;
          }
          else if (this.totalannualSpend != null && this.sumOfFinanceBreakdown >= 0) {
            //if(this.sumOfFinanceBreakdown == undefined || (((null == this.portionInfra && null != this.portionITApplication && null != this.portionITManagement) || (null != this.portionInfra && null == this.portionITApplication && null != this.portionITManagement) || (null != this.portionInfra && null != this.portionITApplication && null == this.portionITManagement) || (null != this.portionInfra && null == this.portionITApplication && null == this.portionITManagement) || (null == this.portionInfra && null != this.portionITApplication && null == this.portionITManagement) || (null == this.portionInfra && null == this.portionITApplication && null != this.portionITManagement)) && this.sumOfFinanceBreakdown < Number(this.totalannualSpend))){
            //if(null == this.portionInfra || null == this.portionITApplication && null != this.portionITManagement) || (null != this.portionInfra && null == this.portionITApplication && null != this.portionITManagement) || (null != this.portionInfra && null != this.portionITApplication && null == this.portionITManagement) || (null != this.portionInfra && null == this.portionITApplication && null == this.portionITManagement) || (null == this.portionInfra && null != this.portionITApplication && null == this.portionITManagement) || (null == this.portionInfra && null == this.portionITApplication && null != this.portionITManagement)) && this.sumOfFinanceBreakdown < Number(this.totalannualSpend){
    
            if (null == this.portionInfra || '' == String(this.portionInfra) || null == this.portionITApplication || '' == String(this.portionITApplication) || null == this.portionITManagement || '' == String(this.portionITManagement)) {
              this.isFinanceBreakdownBlack = true;
              if(totalannualSpend.toFixed(6) == financeDataBreak.toFixed(6)){
                this.financeDataBreakDownError = "The entries for the top three cells is equal to the Annual IT Spend entry of 100, however all cells require a value. If there is no value for a cell, please enter zero to continue."
              }else{
                this.financeDataBreakDownError = "The entries for the top three cells is: "+financeDataBreak+" it must equal the Annual IT Spend entry of: "+this.totalannualSpend+". Please revise to continue.";
              }
            } else {
              this.isFinanceBreakdownBlack = false;
              if(totalannualSpend.toFixed(6) != financeDataBreak.toFixed(6)){
                this.financeDataBreakDownError = "The entries for the top three cells is: "+financeDataBreak+" it must equal the Annual IT Spend entry of: "+this.totalannualSpend+". Please revise to continue.";
              }
            }
    
            this.operationSpendCondition = false;
            this.isFormValid = false;
          }
    
          if (this.ITCostValidation == 'true' && this.isITUsersServedValid && this.ITCapitalValidation == 'true' && this.ITChangeTransformValidation == 'true' && this.isItInfraEmpValid && this.operationSpendCondition && this.isSumOfEndUserthroughtelecomValid && this.isCompFinValid && this.isValidTotalHeadCount) {
            this.isFormValid = true;
          } else {
            this.isFormValid = false;
          }
    
          this.calculatePercentage();
    
          if (FinBreakValueChanged) {
            this.validateFinanceTowerBreakDown();
          }
    
          //this.validateFinanceTowerBreakDown();
    
        }
        catch (error) {
          
          //throw custom exception to global error handler
          //create error object
          let errorObj = {
            "dashboardId": "1",
            "pageName": "CIO Dashboard Input My Data Screen",
            "errorType": "warn",
            "errorTitle": "Data Error",
            "errorDescription": error.message,
            "errorObject": error
          }
    
          throw errorObj;
        }
    
      }
    

  selectYear(event) {

  }

  //function for validations of IT financial breakdown by tower which Must be call on change of any input parameter comes under ITFinancialBreakdownbyTower
  validateFinanceTowerBreakDown() {

    //appending dynamic values for infra, application and management
    this.myData.ITOperationsSpending.ITFinancialDataBreakdown.forEach(element => {
      if (element.src_code == "TDD150") {
        if(element.src_code_value == null || element.src_code_value == ''){
          this.portionInfra = null;
        }else{
          this.portionInfra = Number(this.unmaskComma(element.src_code_value));
        }
      } else if (element.src_code == "TDD160") {
        if(element.src_code_value == null || element.src_code_value == ''){
          this.portionITApplication = null;
        }else{
          this.portionITApplication = Number(this.unmaskComma(element.src_code_value));
        }
      } else if (element.src_code == "TDD170") {
        if(element.src_code_value == null || element.src_code_value == ''){
          this.portionITManagement = null;
        }else{
          this.portionITManagement = Number(this.unmaskComma(element.src_code_value));
        }
      }
    });

    let isITFinTowerBreakValidationCleared = true;
    let isAnnualCostOpBreakDownCleared = true;
    let isSecurityValidationCleared = true;

    this.myData.ITOperationsSpending.ITFinancialBreakdownbyTower.forEach(element => {


      // assisgned dynamic values
      if (element.src_code == "TDD200") {
        if(element.src_code_value == null || element.src_code_value == "" || element.src_code_value ==undefined){
          this.aanualCostEndUser = null;
        }else{
          this.aanualCostEndUser = Number(this.unmaskComma(element.src_code_value));
        }
        if (element.src_code_value != '') {
          isITFinTowerBreakValidationCleared = false;
        }
      } else if (element.src_code == "TDD205") {
        if(element.src_code_value == null || element.src_code_value == "" || element.src_code_value ==undefined){
          this.annualCostServiceDesk = null;
        }else{
          this.annualCostServiceDesk = Number(this.unmaskComma(element.src_code_value));
        }
        if (element.src_code_value != '') {
          isITFinTowerBreakValidationCleared = false;
        }
      } else if (element.src_code == "TDD210") {
        if(element.src_code_value == null || element.src_code_value == "" || element.src_code_value ==undefined){
          this.annualCostDataCentre = null;
        }else{
          this.annualCostDataCentre = Number(this.unmaskComma(element.src_code_value));
        }
        if (element.src_code_value != '') {
          isITFinTowerBreakValidationCleared = false;
        }
      } else if (element.src_code == "TDD220") {
        if(element.src_code_value == null || element.src_code_value == "" || element.src_code_value ==undefined){
          this.annualCostNetwork = null;
        }else{
          this.annualCostNetwork = Number(this.unmaskComma(element.src_code_value));
        }
        if (element.src_code_value != '') {
          isITFinTowerBreakValidationCleared = false;
        }
      } else if (element.src_code == "TDD225") {
        if(element.src_code_value == null || element.src_code_value == "" || element.src_code_value ==undefined){
          this.annualCostTelecom = null;
        }else{
          this.annualCostTelecom = Number(this.unmaskComma(element.src_code_value));
        }
        if (element.src_code_value != '') {
          isITFinTowerBreakValidationCleared = false;
        }
      } else if (element.src_code == "TDD230") {
        if(element.src_code_value == null || element.src_code_value == "" || element.src_code_value ==undefined){
          this.annualCostAppOperations = null;
        }else{
          this.annualCostAppOperations = Number(this.unmaskComma(element.src_code_value));
        }
        if (element.src_code_value != '') {
          isAnnualCostOpBreakDownCleared = false;
        }
      } else if (element.src_code == "TDD240") {
        if(element.src_code_value == null || element.src_code_value == "" || element.src_code_value ==undefined){
          this.annualCostdevProjects = null;
        }else{
          this.annualCostdevProjects = Number(this.unmaskComma(element.src_code_value));
        }
        if (element.src_code_value != '') {
          isAnnualCostOpBreakDownCleared = false;
        }
      } else if (element.src_code == "TDD250") {
        if(element.src_code_value == null || element.src_code_value == "" || element.src_code_value ==undefined){
          this.annualCostITSecurity = null;
        }else{
          this.annualCostITSecurity = Number(this.unmaskComma(element.src_code_value));
        }
        if (element.src_code_value != '') {
          isSecurityValidationCleared = false;
        }
      } else if (element.src_code == "TDD260") {
        if(element.src_code_value == null || element.src_code_value == "" || element.src_code_value ==undefined){
          this.annualSpendITSecurity = null;
        }else{
          this.annualSpendITSecurity = Number(this.unmaskComma(element.src_code_value));
        }
        if (element.src_code_value != '') {
          isSecurityValidationCleared = false;
        }
      }


    });



    var sum = Number(this.aanualCostEndUser) + Number(this.annualCostServiceDesk) + Number(this.annualCostDataCentre) +
      Number(this.annualCostNetwork) + Number(this.annualCostTelecom);

    // calculating sum of end user computing,help desk, reporting currency, annual cost for n/w and annual cost for telecom(TDD200 to TDD225)
    if ((null == this.aanualCostEndUser && null == this.annualCostServiceDesk && null == this.annualCostDataCentre && null == this.annualCostNetwork && null == this.annualCostTelecom)||((undefined == this.aanualCostEndUser && undefined == this.annualCostServiceDesk && undefined == this.annualCostDataCentre && undefined == this.annualCostNetwork && undefined == this.annualCostTelecom))) {
      this.sumOfEndUserthroughtelecom = undefined;
    } else {
      this.sumOfEndUserthroughtelecom = Number(this.aanualCostEndUser) + Number(this.annualCostServiceDesk) + Number(this.annualCostDataCentre) +
        Number(this.annualCostNetwork) + Number(this.annualCostTelecom)
    }

    // calculating sum of annual Cost for Application Operations & annual Cost for development Projects(TDD230 + TDD240)
    if( (null == this.annualCostAppOperations && null == this.annualCostdevProjects) || (undefined == this.annualCostAppOperations && undefined == this.annualCostdevProjects)){
      this.sumOfOperAndDevProj = undefined;
    } else {
      this.sumOfOperAndDevProj = Number(this.annualCostAppOperations) + Number(this.annualCostdevProjects)

    }


    //appending annual cost for it security
    if ((null == this.annualCostITSecurity && null == this.annualSpendITSecurity) || (undefined == this.annualCostITSecurity && undefined == this.annualSpendITSecurity)) {
      this.sumOfITSecurity = undefined;
    } else {
      this.sumOfITSecurity = Number(this.annualCostITSecurity) + Number(this.annualSpendITSecurity);
    }


    /*set flags according to rules mentioned in sheet:
    1)sum of end user computing,help desk, reporting currency, annual cost for n/w and annual cost for telecom(TDD200 to TDD225) Must be equal to portionInfra(TDD150)
    2)sum of annual Cost for Application Operations & annual Cost for development Projects(TDD230 + TDD240) = portionITApplication(TDD160)
    3)annual cost for it security Must not be greater than portionITManagement(TDD170)
    */

    var portionInfraVal = Number(this.portionInfra);
    var telecomSum = Number(this.sumOfEndUserthroughtelecom);

    var itSpendAppSum = Number(this.sumOfOperAndDevProj);
    var actualITPortionAppValue = Number(this.portionITApplication);

    var sumITSecurity = Number(this.sumOfITSecurity);
    var actualITSecSum = Number(this.portionITManagement);

    if (this.portionInfra != null && this.portionITApplication != null && this.portionITManagement != null && this.sumOfEndUserthroughtelecom != undefined && this.sumOfOperAndDevProj != undefined && this.sumOfITSecurity !=undefined &&
      (null != this.aanualCostEndUser && null != this.annualCostServiceDesk && null != this.annualCostDataCentre && null != this.annualCostNetwork && null != this.annualCostTelecom && 
      null != this.annualCostITSecurity && null != this.annualSpendITSecurity && null != this.annualCostAppOperations && null != this.annualCostdevProjects) && 
      (telecomSum.toFixed(6) == portionInfraVal.toFixed(6)) && (itSpendAppSum.toFixed(6) == actualITPortionAppValue.toFixed(6)) &&  (sumITSecurity.toFixed(6) == actualITSecSum.toFixed(6))) {

      this.isSumOfEndUserthroughtelecomValid = true;

    }
    //for infra if all 0 are entered and infra value is blank, red error
    // else if (
    // isITFinTowerBreakValidationCleared != true 
    // && this.sumOfEndUserthroughtelecom == 0 && this.sumOfEndUserthroughtelecom != undefined) {
    //   //if(this.sumOfEndUserthroughtelecom  == undefined || (((null != this.aanualCostEndUser && null == this.annualCostServiceDesk && null == this.annualCostDataCentre && null == this.annualCostNetwork && null == this.annualCostTelecom) || (null == this.aanualCostEndUser && null != this.annualCostServiceDesk && null == this.annualCostDataCentre && null == this.annualCostNetwork && null == this.annualCostTelecom) || (null == this.aanualCostEndUser && null == this.annualCostServiceDesk && null != this.annualCostDataCentre && null == this.annualCostNetwork && null == this.annualCostTelecom) || (null == this.aanualCostEndUser && null == this.annualCostServiceDesk && null == this.annualCostDataCentre && null != this.annualCostNetwork && null == this.annualCostTelecom) || (null == this.aanualCostEndUser && null == this.annualCostServiceDesk && null == this.annualCostDataCentre && null == this.annualCostNetwork && null != this.annualCostTelecom) || (null == this.aanualCostEndUser && null != this.annualCostServiceDesk && null != this.annualCostDataCentre && null != this.annualCostNetwork && null != this.annualCostTelecom) || (null != this.aanualCostEndUser && null == this.annualCostServiceDesk && null != this.annualCostDataCentre && null != this.annualCostNetwork && null != this.annualCostTelecom) || (null != this.aanualCostEndUser && null != this.annualCostServiceDesk && null == this.annualCostDataCentre && null != this.annualCostNetwork && null != this.annualCostTelecom) || (null != this.aanualCostEndUser && null != this.annualCostServiceDesk && null != this.annualCostDataCentre && null == this.annualCostNetwork && null != this.annualCostTelecom) || (null != this.aanualCostEndUser && null != this.annualCostServiceDesk && null != this.annualCostDataCentre && null != this.annualCostNetwork && null == this.annualCostTelecom) || (null != this.aanualCostEndUser && null != this.annualCostServiceDesk && null == this.annualCostDataCentre && null == this.annualCostNetwork && null == this.annualCostTelecom) || (null != this.aanualCostEndUser && null == this.annualCostServiceDesk && null != this.annualCostDataCentre && null == this.annualCostNetwork && null == this.annualCostTelecom) || (null != this.aanualCostEndUser && null == this.annualCostServiceDesk && null == this.annualCostDataCentre && null != this.annualCostNetwork && null == this.annualCostTelecom) || (null != this.aanualCostEndUser && null == this.annualCostServiceDesk && null == this.annualCostDataCentre && null == this.annualCostNetwork && null != this.annualCostTelecom) || (null == this.aanualCostEndUser && null != this.annualCostServiceDesk && null != this.annualCostDataCentre && null == this.annualCostNetwork && null == this.annualCostTelecom) || (null == this.aanualCostEndUser && null != this.annualCostServiceDesk && null == this.annualCostDataCentre && null != this.annualCostNetwork && null == this.annualCostTelecom) || (null == this.aanualCostEndUser && null != this.annualCostServiceDesk && null == this.annualCostDataCentre && null == this.annualCostNetwork && null != this.annualCostTelecom) || (null == this.aanualCostEndUser && null == this.annualCostServiceDesk && null != this.annualCostDataCentre && null != this.annualCostNetwork && null == this.annualCostTelecom) || (null == this.aanualCostEndUser && null == this.annualCostServiceDesk && null != this.annualCostDataCentre && null == this.annualCostNetwork && null != this.annualCostTelecom) || (null == this.aanualCostEndUser && null == this.annualCostServiceDesk && null == this.annualCostDataCentre && null != this.annualCostNetwork && null != this.annualCostTelecom) || (null == this.aanualCostEndUser && null == this.annualCostServiceDesk && null != this.annualCostDataCentre && null != this.annualCostNetwork && null != this.annualCostTelecom) || (null == this.aanualCostEndUser && null != this.annualCostServiceDesk && null == this.annualCostDataCentre && null != this.annualCostNetwork && null != this.annualCostTelecom) || (null == this.aanualCostEndUser && null != this.annualCostServiceDesk && null != this.annualCostDataCentre && null == this.annualCostNetwork && null != this.annualCostTelecom) || (null == this.aanualCostEndUser && null != this.annualCostServiceDesk && null != this.annualCostDataCentre && null != this.annualCostNetwork && null == this.annualCostTelecom) || (null != this.aanualCostEndUser && null == this.annualCostServiceDesk && null == this.annualCostDataCentre && null != this.annualCostNetwork && null != this.annualCostTelecom) || (null != this.aanualCostEndUser && null == this.annualCostServiceDesk && null != this.annualCostDataCentre && null == this.annualCostNetwork && null != this.annualCostTelecom) || (null != this.aanualCostEndUser && null == this.annualCostServiceDesk && null != this.annualCostDataCentre && null != this.annualCostNetwork && null == this.annualCostTelecom) || (null != this.aanualCostEndUser && null != this.annualCostServiceDesk && null == this.annualCostDataCentre && null == this.annualCostNetwork && null != this.annualCostTelecom) || (null != this.aanualCostEndUser && null != this.annualCostServiceDesk && null == this.annualCostDataCentre && null != this.annualCostNetwork && null == this.annualCostTelecom) || (null != this.aanualCostEndUser && null != this.annualCostServiceDesk && null != this.annualCostDataCentre && null == this.annualCostNetwork && null == this.annualCostTelecom)) && this.sumOfEndUserthroughtelecom < Number(this.portionInfra))){
    //   if (null == this.aanualCostEndUser 
    //     || '' == String(this.aanualCostEndUser) 
    //     || null == this.annualCostServiceDesk 
    //     || '' == String(this.annualCostServiceDesk) 
    //     || null == this.annualCostDataCentre 
    //     || '' == String(this.annualCostDataCentre) 
    //     || null == this.annualCostNetwork 
    //     || '' == String(this.annualCostNetwork) 
    //     || null == this.annualCostTelecom 
    //     || '' == String(this.annualCostTelecom) 
    //     || null == this.annualCostDataCentre 
    //     || '' == String(this.annualCostDataCentre)) {
    //     this.isTowerBreakdownBlack = true;
    //   } else {
    //     this.isTowerBreakdownBlack = false;
    //   }
    //   //this.errorMessageFinanceTowerBreakdown = "The Sum of End-user Computing, Helpdesk, Reporting Currency, Network and Telecomm Must Be Equal to the IT Spend for IT Infrastructure";
    //   this.errorMessageFinanceTowerBreakdown = "The sum of spend for end user computing, service desk, hosting, network, and telecommunications must equal the spend for IT infrastructure.";
    //   this.isSumOfEndUserthroughtelecomValid = false;
    //   this.isFormValid = false;

    // }  
    //for infra if sum is matched but some fields are blank, blue error
    else if (
      isITFinTowerBreakValidationCleared != true 
      && this.sumOfEndUserthroughtelecom == this.portionInfra && this.sumOfEndUserthroughtelecom != undefined
    &&(null == this.aanualCostEndUser 
      || '' == String(this.aanualCostEndUser) 
      || null == this.annualCostServiceDesk 
      || '' == String(this.annualCostServiceDesk) 
      || null == this.annualCostDataCentre 
      || '' == String(this.annualCostDataCentre) 
      || null == this.annualCostNetwork 
      || '' == String(this.annualCostNetwork) 
      || null == this.annualCostTelecom 
      || '' == String(this.annualCostTelecom) 
      )) {
        //if(this.sumOfEndUserthroughtelecom  == undefined || (((null != this.aanualCostEndUser && null == this.annualCostServiceDesk && null == this.annualCostDataCentre && null == this.annualCostNetwork && null == this.annualCostTelecom) || (null == this.aanualCostEndUser && null != this.annualCostServiceDesk && null == this.annualCostDataCentre && null == this.annualCostNetwork && null == this.annualCostTelecom) || (null == this.aanualCostEndUser && null == this.annualCostServiceDesk && null != this.annualCostDataCentre && null == this.annualCostNetwork && null == this.annualCostTelecom) || (null == this.aanualCostEndUser && null == this.annualCostServiceDesk && null == this.annualCostDataCentre && null != this.annualCostNetwork && null == this.annualCostTelecom) || (null == this.aanualCostEndUser && null == this.annualCostServiceDesk && null == this.annualCostDataCentre && null == this.annualCostNetwork && null != this.annualCostTelecom) || (null == this.aanualCostEndUser && null != this.annualCostServiceDesk && null != this.annualCostDataCentre && null != this.annualCostNetwork && null != this.annualCostTelecom) || (null != this.aanualCostEndUser && null == this.annualCostServiceDesk && null != this.annualCostDataCentre && null != this.annualCostNetwork && null != this.annualCostTelecom) || (null != this.aanualCostEndUser && null != this.annualCostServiceDesk && null == this.annualCostDataCentre && null != this.annualCostNetwork && null != this.annualCostTelecom) || (null != this.aanualCostEndUser && null != this.annualCostServiceDesk && null != this.annualCostDataCentre && null == this.annualCostNetwork && null != this.annualCostTelecom) || (null != this.aanualCostEndUser && null != this.annualCostServiceDesk && null != this.annualCostDataCentre && null != this.annualCostNetwork && null == this.annualCostTelecom) || (null != this.aanualCostEndUser && null != this.annualCostServiceDesk && null == this.annualCostDataCentre && null == this.annualCostNetwork && null == this.annualCostTelecom) || (null != this.aanualCostEndUser && null == this.annualCostServiceDesk && null != this.annualCostDataCentre && null == this.annualCostNetwork && null == this.annualCostTelecom) || (null != this.aanualCostEndUser && null == this.annualCostServiceDesk && null == this.annualCostDataCentre && null != this.annualCostNetwork && null == this.annualCostTelecom) || (null != this.aanualCostEndUser && null == this.annualCostServiceDesk && null == this.annualCostDataCentre && null == this.annualCostNetwork && null != this.annualCostTelecom) || (null == this.aanualCostEndUser && null != this.annualCostServiceDesk && null != this.annualCostDataCentre && null == this.annualCostNetwork && null == this.annualCostTelecom) || (null == this.aanualCostEndUser && null != this.annualCostServiceDesk && null == this.annualCostDataCentre && null != this.annualCostNetwork && null == this.annualCostTelecom) || (null == this.aanualCostEndUser && null != this.annualCostServiceDesk && null == this.annualCostDataCentre && null == this.annualCostNetwork && null != this.annualCostTelecom) || (null == this.aanualCostEndUser && null == this.annualCostServiceDesk && null != this.annualCostDataCentre && null != this.annualCostNetwork && null == this.annualCostTelecom) || (null == this.aanualCostEndUser && null == this.annualCostServiceDesk && null != this.annualCostDataCentre && null == this.annualCostNetwork && null != this.annualCostTelecom) || (null == this.aanualCostEndUser && null == this.annualCostServiceDesk && null == this.annualCostDataCentre && null != this.annualCostNetwork && null != this.annualCostTelecom) || (null == this.aanualCostEndUser && null == this.annualCostServiceDesk && null != this.annualCostDataCentre && null != this.annualCostNetwork && null != this.annualCostTelecom) || (null == this.aanualCostEndUser && null != this.annualCostServiceDesk && null == this.annualCostDataCentre && null != this.annualCostNetwork && null != this.annualCostTelecom) || (null == this.aanualCostEndUser && null != this.annualCostServiceDesk && null != this.annualCostDataCentre && null == this.annualCostNetwork && null != this.annualCostTelecom) || (null == this.aanualCostEndUser && null != this.annualCostServiceDesk && null != this.annualCostDataCentre && null != this.annualCostNetwork && null == this.annualCostTelecom) || (null != this.aanualCostEndUser && null == this.annualCostServiceDesk && null == this.annualCostDataCentre && null != this.annualCostNetwork && null != this.annualCostTelecom) || (null != this.aanualCostEndUser && null == this.annualCostServiceDesk && null != this.annualCostDataCentre && null == this.annualCostNetwork && null != this.annualCostTelecom) || (null != this.aanualCostEndUser && null == this.annualCostServiceDesk && null != this.annualCostDataCentre && null != this.annualCostNetwork && null == this.annualCostTelecom) || (null != this.aanualCostEndUser && null != this.annualCostServiceDesk && null == this.annualCostDataCentre && null == this.annualCostNetwork && null != this.annualCostTelecom) || (null != this.aanualCostEndUser && null != this.annualCostServiceDesk && null == this.annualCostDataCentre && null != this.annualCostNetwork && null == this.annualCostTelecom) || (null != this.aanualCostEndUser && null != this.annualCostServiceDesk && null != this.annualCostDataCentre && null == this.annualCostNetwork && null == this.annualCostTelecom)) && this.sumOfEndUserthroughtelecom < Number(this.portionInfra))){
        
          this.isTowerBreakdownBlack = true;
          //this.errorMessageFinanceTowerBreakdown = "The Sum of End-user Computing, Helpdesk, Reporting Currency, Network and Telecomm Must Be Equal to the IT Spend for IT Infrastructure";
        // this.errorMessageFinanceTowerBreakdown = "The sum of spend for end user computing, service desk, hosting, network, and telecommunications must equal the spend for IT infrastructure.";
        this.errorMessageFinanceTowerBreakdown = "The top 5 entries for Financial Breakdown by Tower equal "+this.sumOfEndUserthroughtelecom+" , which equals the Annual IT Infrastructure Spend entry, however all cells require a value. If there is no value for a cell, please enter zero to continue."
        this.isSumOfEndUserthroughtelecomValid = false;
        this.isFormValid = false;
  
        // } else {
        //   this.isTowerBreakdownBlack = false;
        // }
        
      }
    else if ((this.sumOfEndUserthroughtelecom != this.portionInfra) 
    && isITFinTowerBreakValidationCleared != true 
    && this.sumOfEndUserthroughtelecom >= 0 && this.sumOfEndUserthroughtelecom != undefined) {
      //if(this.sumOfEndUserthroughtelecom  == undefined || (((null != this.aanualCostEndUser && null == this.annualCostServiceDesk && null == this.annualCostDataCentre && null == this.annualCostNetwork && null == this.annualCostTelecom) || (null == this.aanualCostEndUser && null != this.annualCostServiceDesk && null == this.annualCostDataCentre && null == this.annualCostNetwork && null == this.annualCostTelecom) || (null == this.aanualCostEndUser && null == this.annualCostServiceDesk && null != this.annualCostDataCentre && null == this.annualCostNetwork && null == this.annualCostTelecom) || (null == this.aanualCostEndUser && null == this.annualCostServiceDesk && null == this.annualCostDataCentre && null != this.annualCostNetwork && null == this.annualCostTelecom) || (null == this.aanualCostEndUser && null == this.annualCostServiceDesk && null == this.annualCostDataCentre && null == this.annualCostNetwork && null != this.annualCostTelecom) || (null == this.aanualCostEndUser && null != this.annualCostServiceDesk && null != this.annualCostDataCentre && null != this.annualCostNetwork && null != this.annualCostTelecom) || (null != this.aanualCostEndUser && null == this.annualCostServiceDesk && null != this.annualCostDataCentre && null != this.annualCostNetwork && null != this.annualCostTelecom) || (null != this.aanualCostEndUser && null != this.annualCostServiceDesk && null == this.annualCostDataCentre && null != this.annualCostNetwork && null != this.annualCostTelecom) || (null != this.aanualCostEndUser && null != this.annualCostServiceDesk && null != this.annualCostDataCentre && null == this.annualCostNetwork && null != this.annualCostTelecom) || (null != this.aanualCostEndUser && null != this.annualCostServiceDesk && null != this.annualCostDataCentre && null != this.annualCostNetwork && null == this.annualCostTelecom) || (null != this.aanualCostEndUser && null != this.annualCostServiceDesk && null == this.annualCostDataCentre && null == this.annualCostNetwork && null == this.annualCostTelecom) || (null != this.aanualCostEndUser && null == this.annualCostServiceDesk && null != this.annualCostDataCentre && null == this.annualCostNetwork && null == this.annualCostTelecom) || (null != this.aanualCostEndUser && null == this.annualCostServiceDesk && null == this.annualCostDataCentre && null != this.annualCostNetwork && null == this.annualCostTelecom) || (null != this.aanualCostEndUser && null == this.annualCostServiceDesk && null == this.annualCostDataCentre && null == this.annualCostNetwork && null != this.annualCostTelecom) || (null == this.aanualCostEndUser && null != this.annualCostServiceDesk && null != this.annualCostDataCentre && null == this.annualCostNetwork && null == this.annualCostTelecom) || (null == this.aanualCostEndUser && null != this.annualCostServiceDesk && null == this.annualCostDataCentre && null != this.annualCostNetwork && null == this.annualCostTelecom) || (null == this.aanualCostEndUser && null != this.annualCostServiceDesk && null == this.annualCostDataCentre && null == this.annualCostNetwork && null != this.annualCostTelecom) || (null == this.aanualCostEndUser && null == this.annualCostServiceDesk && null != this.annualCostDataCentre && null != this.annualCostNetwork && null == this.annualCostTelecom) || (null == this.aanualCostEndUser && null == this.annualCostServiceDesk && null != this.annualCostDataCentre && null == this.annualCostNetwork && null != this.annualCostTelecom) || (null == this.aanualCostEndUser && null == this.annualCostServiceDesk && null == this.annualCostDataCentre && null != this.annualCostNetwork && null != this.annualCostTelecom) || (null == this.aanualCostEndUser && null == this.annualCostServiceDesk && null != this.annualCostDataCentre && null != this.annualCostNetwork && null != this.annualCostTelecom) || (null == this.aanualCostEndUser && null != this.annualCostServiceDesk && null == this.annualCostDataCentre && null != this.annualCostNetwork && null != this.annualCostTelecom) || (null == this.aanualCostEndUser && null != this.annualCostServiceDesk && null != this.annualCostDataCentre && null == this.annualCostNetwork && null != this.annualCostTelecom) || (null == this.aanualCostEndUser && null != this.annualCostServiceDesk && null != this.annualCostDataCentre && null != this.annualCostNetwork && null == this.annualCostTelecom) || (null != this.aanualCostEndUser && null == this.annualCostServiceDesk && null == this.annualCostDataCentre && null != this.annualCostNetwork && null != this.annualCostTelecom) || (null != this.aanualCostEndUser && null == this.annualCostServiceDesk && null != this.annualCostDataCentre && null == this.annualCostNetwork && null != this.annualCostTelecom) || (null != this.aanualCostEndUser && null == this.annualCostServiceDesk && null != this.annualCostDataCentre && null != this.annualCostNetwork && null == this.annualCostTelecom) || (null != this.aanualCostEndUser && null != this.annualCostServiceDesk && null == this.annualCostDataCentre && null == this.annualCostNetwork && null != this.annualCostTelecom) || (null != this.aanualCostEndUser && null != this.annualCostServiceDesk && null == this.annualCostDataCentre && null != this.annualCostNetwork && null == this.annualCostTelecom) || (null != this.aanualCostEndUser && null != this.annualCostServiceDesk && null != this.annualCostDataCentre && null == this.annualCostNetwork && null == this.annualCostTelecom)) && this.sumOfEndUserthroughtelecom < Number(this.portionInfra))){
      if (null == this.aanualCostEndUser 
        || '' == String(this.aanualCostEndUser) 
        || null == this.annualCostServiceDesk 
        || '' == String(this.annualCostServiceDesk) 
        || null == this.annualCostDataCentre 
        || '' == String(this.annualCostDataCentre) 
        || null == this.annualCostNetwork 
        || '' == String(this.annualCostNetwork) 
        || null == this.annualCostTelecom 
        || '' == String(this.annualCostTelecom) 
        || null == this.annualCostDataCentre 
        || '' == String(this.annualCostDataCentre)) {
        this.isTowerBreakdownBlack = true;
      } else {
        this.isTowerBreakdownBlack = false;
      }
      //this.errorMessageFinanceTowerBreakdown = "The Sum of End-user Computing, Helpdesk, Reporting Currency, Network and Telecomm Must Be Equal to the IT Spend for IT Infrastructure";
      // this.errorMessageFinanceTowerBreakdown = "The sum of spend for end user computing, service desk, hosting, network, and telecommunications must equal the spend for IT infrastructure.";
      this.errorMessageFinanceTowerBreakdown = "The top 5 entries for the Financial Breakdown by Tower is: "+this.sumOfEndUserthroughtelecom+" it must equal the Annual IT spend for IT Infrastructure entry of: "+this.portionInfra+". Please revise to continue.";
      this.isSumOfEndUserthroughtelecomValid = false;
      this.isFormValid = false;

    } 
    //if all 0s entered and sum does not matches portion, red error
    // else if (
    //  isAnnualCostOpBreakDownCleared != true 
    // && this.sumOfOperAndDevProj == 0 && this.sumOfOperAndDevProj != undefined) {
    //   //if(this.sumOfOperAndDevProj == undefined || (((null == this.annualCostAppOperations && null != this.annualCostdevProjects) || (null != this.annualCostAppOperations && null == this.annualCostdevProjects))  &&  this.sumOfOperAndDevProj < Number(this.portionITApplication)) ){
    //   if (null == this.annualCostAppOperations || '' == String(this.annualCostAppOperations) || null == this.annualCostdevProjects || '' == String(this.annualCostdevProjects)) {
    //     this.isTowerBreakdownBlack = true;
    //   } else {
    //     this.isTowerBreakdownBlack = false;
    //   }
    //   this.errorMessageFinanceTowerBreakdown = "The sum of spend for application operations and development projects must equal the spend for applications.";
    //   this.isSumOfEndUserthroughtelecomValid = false;
    //   this.isFormValid = false;

    // }
    //for portion if sum is matched but some fields are blank, blue error
    else if (
      isAnnualCostOpBreakDownCleared != true 
     && this.sumOfOperAndDevProj == this.portionITApplication && this.sumOfOperAndDevProj != undefined
    &&(null == this.annualCostAppOperations 
      || '' == String(this.annualCostAppOperations) 
      || null == this.annualCostdevProjects 
      || '' == String(this.annualCostdevProjects))) {
       //if(this.sumOfOperAndDevProj == undefined || (((null == this.annualCostAppOperations && null != this.annualCostdevProjects) || (null != this.annualCostAppOperations && null == this.annualCostdevProjects))  &&  this.sumOfOperAndDevProj < Number(this.portionITApplication)) ){
         this.isTowerBreakdownBlack = true;
       
      //  this.errorMessageFinanceTowerBreakdown = "The sum of spend for application operations and development projects must equal the spend for applications.";
      this.errorMessageFinanceTowerBreakdown = "The Annual Application Support and Maintenance and Application Development value of "+this.sumOfOperAndDevProj+" is equal to the Annual IT Spend entry, however all cells require a value. If there is no value for a cell, please enter zero to continue."
       this.isSumOfEndUserthroughtelecomValid = false;
       this.isFormValid = false;
 
     }
    else if ((this.sumOfOperAndDevProj != this.portionITApplication) 
    && isAnnualCostOpBreakDownCleared != true 
    && this.sumOfOperAndDevProj >= 0 && this.sumOfOperAndDevProj != undefined) {
      //if(this.sumOfOperAndDevProj == undefined || (((null == this.annualCostAppOperations && null != this.annualCostdevProjects) || (null != this.annualCostAppOperations && null == this.annualCostdevProjects))  &&  this.sumOfOperAndDevProj < Number(this.portionITApplication)) ){
      if (null == this.annualCostAppOperations || '' == String(this.annualCostAppOperations) || null == this.annualCostdevProjects || '' == String(this.annualCostdevProjects)) {
        this.isTowerBreakdownBlack = true;
      } else {
        this.isTowerBreakdownBlack = false;
      }
      // this.errorMessageFinanceTowerBreakdown = "The sum of spend for application operations and development projects must equal the spend for applications.";
      this.errorMessageFinanceTowerBreakdown = "The cells for Annual Application Support and Maintenance and Application Development cells equal: "+this.sumOfOperAndDevProj+" the entries must equal the Annual IT Spend for Applications entry of: "+this.portionITApplication+". Please revise to continue."
      this.isSumOfEndUserthroughtelecomValid = false;
      this.isFormValid = false;

    } 
    //if all 0s entered in security and sum do not match, red error
    // else if (isSecurityValidationCleared != true && this.sumOfITSecurity == 0 && this.sumOfITSecurity != undefined) {
    //   //if(this.sumOfITSecurity == undefined  || (((null == this.annualCostITSecurity && null != this.annualSpendITSecurity) || (null == this.annualSpendITSecurity && null != this.annualCostITSecurity)) &&  this.sumOfITSecurity  < Number(this.portionITManagement)) ) {
    //   if (null == this.annualCostITSecurity || '' == String(this.annualCostITSecurity) || null == this.annualSpendITSecurity || '' == String(this.annualSpendITSecurity)) {
    //     this.isTowerBreakdownBlack = true;
    //   } else {
    //     this.isTowerBreakdownBlack = false;
    //   }
    //   this.errorMessageFinanceTowerBreakdown = "The sum of spend for IT service management and IT security must equal the spend for IT management and security.";
    //   this.isSumOfEndUserthroughtelecomValid = false;
    //   this.isFormValid = false;
    // }
    //if sum matches but some fields are blank, blue error
    else if ((this.sumOfITSecurity == this.portionITManagement) 
    && isSecurityValidationCleared != true && this.sumOfITSecurity != undefined
  && (null == this.annualCostITSecurity || '' == String(this.annualCostITSecurity) || null == this.annualSpendITSecurity || '' == String(this.annualSpendITSecurity))) {
      //if(this.sumOfITSecurity == undefined  || (((null == this.annualCostITSecurity && null != this.annualSpendITSecurity) || (null == this.annualSpendITSecurity && null != this.annualCostITSecurity)) &&  this.sumOfITSecurity  < Number(this.portionITManagement)) ) {

        this.isTowerBreakdownBlack = true;
      
      // this.errorMessageFinanceTowerBreakdown = "The sum of spend for IT service management and IT security must equal the spend for IT management and security.";
      this.errorMessageFinanceTowerBreakdown = "The entries for IT Management and Security equal "+this.sumOfITSecurity+" , however all cells require a value. If there is no value for a cell, please enter zero to continue."
      this.isSumOfEndUserthroughtelecomValid = false;
      this.isFormValid = false;
    }
    else if ((this.sumOfITSecurity != this.portionITManagement) && isSecurityValidationCleared != true && this.sumOfITSecurity >= 0 && this.sumOfITSecurity != undefined) {
      //if(this.sumOfITSecurity == undefined  || (((null == this.annualCostITSecurity && null != this.annualSpendITSecurity) || (null == this.annualSpendITSecurity && null != this.annualCostITSecurity)) &&  this.sumOfITSecurity  < Number(this.portionITManagement)) ) {
      if (null == this.annualCostITSecurity || '' == String(this.annualCostITSecurity) || null == this.annualSpendITSecurity || '' == String(this.annualSpendITSecurity)) {
        this.isTowerBreakdownBlack = true;
      } else {
        this.isTowerBreakdownBlack = false;
      }
      // this.errorMessageFinanceTowerBreakdown = "The sum of spend for IT service management and IT security must equal the spend for IT management and security.";
      this.errorMessageFinanceTowerBreakdown =  "The entries for the IT Management and Security is: "+this.sumOfITSecurity+" it must equal the IT management entry of: "+this.portionITManagement+". Please revise to continue."
      this.isSumOfEndUserthroughtelecomValid = false;
      this.isFormValid = false;
    }
    else if(this.sumOfEndUserthroughtelecom != undefined || this.sumOfOperAndDevProj == undefined || this.sumOfITSecurity == undefined){
      this.isSumOfEndUserthroughtelecomValid = true;
      this.isFormValid = true;
    }
    else//remove validations
    {
      this.isSumOfEndUserthroughtelecomValid = true;
      this.isFormValid = true;

    }

    if (this.ITCostValidation == 'true' && this.isITUsersServedValid && this.ITCapitalValidation == 'true' && this.ITChangeTransformValidation == 'true' && this.isItInfraEmpValid && this.operationSpendCondition && this.isSumOfEndUserthroughtelecomValid && this.isCompFinValid && this.isValidTotalHeadCount) {
      this.isFormValid = true;
    } else {
      this.isFormValid = false;
    }

    this.calculatePercentage();

  }

  validateOutsorced() {

    //appending data value
    this.myData.ITOperationsSpending.OutsourcedCosts.forEach(outsourced => {
      if (outsourced.src_code == "TDD300") {
        this.TDD300 = outsourced.src_code_value;
      } else if (outsourced.src_code == "TDD310") {
        this.TDD310 = outsourced.src_code_value;
      } else if (outsourced.src_code == "TDD320") {
        this.TDD320 = outsourced.src_code_value;
      }
    });

    this.sumOfOutsourcedCost = Number(this.TDD300) + Number(this.TDD310) + Number(this.TDD320);



    if (this.ITCostValidation == 'true' && this.isITUsersServedValid && this.ITCapitalValidation == 'true' && this.ITChangeTransformValidation == 'true' && this.isItInfraEmpValid && this.operationSpendCondition && this.isSumOfEndUserthroughtelecomValid && this.isCompFinValid && this.isValidTotalHeadCount) {
      this.isFormValid = true;
    }
    else {
      this.isFormValid = false;
    }

    this.calculatePercentage();

  }

  //function for validation of IT spending type
  onITSpendingType() {

    let ITSpendValidationCleared = true;
    this.spendingTypeError = "";
    this.myData.ITOperationsSpending.ITSpendingType.forEach(element => {

      if (element.src_code_value != '') {
        ITSpendValidationCleared = false;
      }

      if(element.src_code_value !='' && element.src_code_value != null){
        if (Number(this.unmaskComma(element.src_code_value)) > 100) {
          element.src_code_value = 100;
        }
      }

      // assisgned dynamic values
      if (element.src_code == "TDD350") {
        if(element.src_code_value == null || element.src_code_value == ''){
          this.itCostPersonel = null;
        }else{
          this.itCostPersonel = Number(this.unmaskComma(element.src_code_value));
        }
        
      } else if (element.src_code == "TDD360") {
        if(element.src_code_value == null || element.src_code_value == ''){
          this.ITcostHardware  = null;
        }else{
          this.ITcostHardware  = Number(this.unmaskComma(element.src_code_value));
        }
      } else if (element.src_code == "TDD370") {
        if(element.src_code_value == null || element.src_code_value == ''){
          this.ITcostSoftware  = null;
        }else{
          this.ITcostSoftware  = Number(this.unmaskComma(element.src_code_value));
        }
      } else if (element.src_code == "TDD380") {
        if(element.src_code_value == null || element.src_code_value == ''){
          this.ITCostOutSourced  = null;
        }else{
          this.ITCostOutSourced  = Number(this.unmaskComma(element.src_code_value));
        }
      } else if (element.src_code == "TDD390") {
        if(element.src_code_value == null || element.src_code_value == ''){
          this.ITCostOthers  = null;
        }else{
          this.ITCostOthers  = Number(this.unmaskComma(element.src_code_value));
        }
      }

    });




    //total of IT spending values Must be equal to 100%
    if (null == this.itCostPersonel && null == this.ITcostHardware && null == this.ITcostSoftware && null == this.ITCostOutSourced && null == this.ITCostOthers) {
      this.sumOfITSpending = undefined;
    } else {
      this.sumOfITSpending =this.itCostPersonel + this.ITcostHardware + this.ITcostSoftware +
        this.ITCostOutSourced + this.ITCostOthers;
    }


    var sumOfITSpendingPercentages = Number(this.sumOfITSpending);

    var hundredpercent = 100;

    if(null == this.itCostPersonel && null == this.ITcostHardware && null == this.ITcostSoftware && null == this.ITCostOutSourced && null == this.ITCostOthers){
      this.ITCostValidation = 'true';
      this.isFormValid = true;
    }else if (sumOfITSpendingPercentages.toFixed(6) == hundredpercent.toFixed(6) && null != this.itCostPersonel && null != this.ITcostHardware && null != this.ITcostSoftware && null != this.ITCostOutSourced && null != this.ITCostOthers) {
      this.ITCostValidation = 'true';
      this.isFormValid = true;
    } else if (this.sumOfITSpending >= 0 && ITSpendValidationCleared != true) {
      //if(this.sumOfITSpending == undefined || (( (null != this.itCostPersonel && null == this.ITcostHardware && null == this.ITcostSoftware && null == this.ITCostOutSourced && null == this.ITCostOthers)|| (null == this.itCostPersonel && null != this.ITcostHardware && null == this.ITcostSoftware && null == this.ITCostOutSourced && null == this.ITCostOthers)|| (null == this.itCostPersonel && null == this.ITcostHardware && null != this.ITcostSoftware && null == this.ITCostOutSourced && null == this.ITCostOthers)|| (null == this.itCostPersonel && null == this.ITcostHardware && null == this.ITcostSoftware && null != this.ITCostOutSourced && null == this.ITCostOthers)|| (null == this.itCostPersonel && null == this.ITcostHardware && null == this.ITcostSoftware && null == this.ITCostOutSourced && null != this.ITCostOthers) || (null == this.itCostPersonel && null != this.ITcostHardware && null != this.ITcostSoftware && null != this.ITCostOutSourced && null != this.ITCostOthers)|| (null != this.itCostPersonel && null == this.ITcostHardware && null != this.ITcostSoftware && null != this.ITCostOutSourced && null != this.ITCostOthers)|| (null != this.itCostPersonel && null != this.ITcostHardware && null == this.ITcostSoftware && null != this.ITCostOutSourced && null != this.ITCostOthers)|| (null != this.itCostPersonel && null != this.ITcostHardware && null != this.ITcostSoftware && null == this.ITCostOutSourced && null != this.ITCostOthers) || (null != this.itCostPersonel && null != this.ITcostHardware && null != this.ITcostSoftware && null != this.ITCostOutSourced && null == this.ITCostOthers) || (null == this.itCostPersonel && null == this.ITcostHardware && null != this.ITcostSoftware && null != this.ITCostOutSourced && null != this.ITCostOthers) || (null != this.itCostPersonel && null == this.ITcostHardware && null == this.ITcostSoftware && null != this.ITCostOutSourced && null != this.ITCostOthers) || (null != this.itCostPersonel && null != this.ITcostHardware && null == this.ITcostSoftware && null == this.ITCostOutSourced && null != this.ITCostOthers) || (null != this.itCostPersonel && null != this.ITcostHardware && null != this.ITcostSoftware && null == this.ITCostOutSourced && null == this.ITCostOthers) || (null != this.itCostPersonel && null != this.ITcostHardware && null == this.ITcostSoftware && null == this.ITCostOutSourced && null == this.ITCostOthers) || (null == this.itCostPersonel && null != this.ITcostHardware && null != this.ITcostSoftware && null == this.ITCostOutSourced && null == this.ITCostOthers) || (null == this.itCostPersonel && null == this.ITcostHardware && null != this.ITcostSoftware && null != this.ITCostOutSourced && null == this.ITCostOthers) || (null == this.itCostPersonel && null == this.ITcostHardware && null == this.ITcostSoftware && null != this.ITCostOutSourced && null != this.ITCostOthers) || (null != this.itCostPersonel && null == this.ITcostHardware && null != this.ITcostSoftware && null == this.ITCostOutSourced && null == this.ITCostOthers) || (null != this.itCostPersonel && null == this.ITcostHardware && null == this.ITcostSoftware && null != this.ITCostOutSourced && null == this.ITCostOthers) || (null != this.itCostPersonel && null == this.ITcostHardware && null == this.ITcostSoftware && null == this.ITCostOutSourced && null != this.ITCostOthers) || (null == this.itCostPersonel && null != this.ITcostHardware && null == this.ITcostSoftware && null != this.ITCostOutSourced && null != this.ITCostOthers) || (null == this.itCostPersonel && null != this.ITcostHardware && null != this.ITcostSoftware && null == this.ITCostOutSourced && null != this.ITCostOthers) || (null == this.itCostPersonel && null != this.ITcostHardware && null != this.ITcostSoftware && null != this.ITCostOutSourced && null == this.ITCostOthers) || (null != this.itCostPersonel && null == this.ITcostHardware && null != this.ITcostSoftware && null == this.ITCostOutSourced && null != this.ITCostOthers) || (null != this.itCostPersonel && null == this.ITcostHardware && null != this.ITcostSoftware && null != this.ITCostOutSourced && null == this.ITCostOthers) || (null == this.itCostPersonel && null != this.ITcostHardware && null == this.ITcostSoftware && null != this.ITCostOutSourced && null == this.ITCostOthers) || (null == this.itCostPersonel && null != this.ITcostHardware && null == this.ITcostSoftware && null == this.ITCostOutSourced && null != this.ITCostOthers) || (null == this.itCostPersonel && null == this.ITcostHardware && null != this.ITcostSoftware && null == this.ITCostOutSourced && null != this.ITCostOthers) || (null != this.itCostPersonel && null != this.ITcostHardware && null == this.ITcostSoftware && null != this.ITCostOutSourced && null == this.ITCostOthers)) && this.sumOfITSpending < 100) ){
      if (null == this.itCostPersonel || '' == String(this.itCostPersonel) || null == this.ITcostHardware || '' == String(this.ITcostHardware) || null == this.ITcostSoftware || '' == String(this.ITcostSoftware) || null == this.ITCostOutSourced || '' == String(this.ITCostOutSourced) || null == this.ITCostOthers || '' == String(this.ITCostOthers)) {
        this.isITSpendBlack = true;
        if(this.sumOfITSpending == 100){
          this.spendingTypeError = "The entries for IT Spend by Type equal 100%, however all cells require a value. If there is no value for a cell, please enter zero to continue."
        }else{
          this.spendingTypeError = "The entries for IT Spend by Type equal "+sumOfITSpendingPercentages+"%, it must equal 100%. Please revise to continue."
        }
      } else {
        this.isITSpendBlack = false;
        this.spendingTypeError = "The entries for IT Spend by Type equal "+sumOfITSpendingPercentages+"%, it must equal 100%. Please revise to continue."
      }
      this.ITCostValidation = 'false';
      this.isFormValid = false;
    }
    else {
      this.ITCostValidation = 'true';
    }


    if (this.ITCostValidation == 'true' && this.isITUsersServedValid && this.ITCapitalValidation == 'true' && this.ITChangeTransformValidation == 'true' && this.isItInfraEmpValid && this.operationSpendCondition && this.isSumOfEndUserthroughtelecomValid && this.isCompFinValid && this.isValidTotalHeadCount) {
      this.isFormValid = true;
    } else {
      this.isFormValid = false;
    }

    this.calculatePercentage();

  };

  //function for validation of Run change transform
  onRunChangeTransform() {

    let runChangeValidationCleared = true;
    this.runchangetranError = "";

    this.myData.ITOperationsSpending.RunChangeTransform.forEach(element => {
      
      if (element.src_code_value != '') {
        runChangeValidationCleared = false; 
      }
      if(element.src_code_value !='' && element.src_code_value != null){
        element.src_code_value = this.unmaskComma(element.src_code_value);
        if (Number(element.src_code_value) > 100) {
          element.src_code_value = 100;
        }
      }
      

      if (element.src_code == "TDD400") {
        if(element.src_code_value =='' || element.src_code_value == null){
          this.itCostRunBusiness = null;
        }else{
          this.itCostRunBusiness = Number(this.unmaskComma(element.src_code_value));
        }
        
      } else if (element.src_code == "TDD410") {
        if(element.src_code_value =='' || element.src_code_value == null){
          this.itCostChangeBusiness = null;
        }else{
          this.itCostChangeBusiness = Number(this.unmaskComma(element.src_code_value));
        }
        
      } else if (element.src_code == "TDD420") {
        if(element.src_code_value =='' || element.src_code_value == null){
          this.itCostTransBusiness = null;
        }else{
          this.itCostTransBusiness = Number(this.unmaskComma(element.src_code_value));
        }
      }

    });


    if (null == this.itCostRunBusiness && null == this.itCostChangeBusiness && null == this.itCostTransBusiness) {
      this.sumITChangeTransform = undefined;
    } else {
      //Run, Change, Transform values total Must be 100%
      this.sumITChangeTransform = this.itCostRunBusiness + this.itCostChangeBusiness + this.itCostTransBusiness;
    }

    var sumOfRunChangePercentages = Number(this.sumITChangeTransform);
    var runChangeHundred = 100;


    if (null == this.itCostRunBusiness && null == this.itCostChangeBusiness && null == this.itCostTransBusiness) {
      this.ITChangeTransformValidation = 'true';
    }else if (sumOfRunChangePercentages.toFixed(6) == runChangeHundred.toFixed(6) && null != this.itCostRunBusiness && null != this.itCostChangeBusiness && null != this.itCostTransBusiness) {
      this.ITChangeTransformValidation = 'true';
    } else if (this.sumITChangeTransform >= 0 && runChangeValidationCleared != true) {
      //if(this.sumITChangeTransform == undefined || (((null == this.itCostRunBusiness && null != this.itCostChangeBusiness && null != this.itCostTransBusiness) || (null != this.itCostRunBusiness && null == this.itCostChangeBusiness && null == this.itCostTransBusiness) || (null == this.itCostRunBusiness && null != this.itCostChangeBusiness && null == this.itCostTransBusiness) || (null != this.itCostRunBusiness && null == this.itCostChangeBusiness && null != this.itCostTransBusiness) || (null == this.itCostRunBusiness && null == this.itCostChangeBusiness && null != this.itCostTransBusiness) || (null != this.itCostRunBusiness && null != this.itCostChangeBusiness && null == this.itCostTransBusiness)) && this.sumITChangeTransform < 100)){
      if (null == this.itCostRunBusiness || '' == String(this.itCostRunBusiness) || null == this.itCostChangeBusiness || '' == String(this.itCostChangeBusiness) || null == this.itCostTransBusiness || '' == String(this.itCostChangeBusiness)) {
        this.isRunBlack = true;
        if(this.sumITChangeTransform == 100){
          this.runchangetranError = "The entries for Run, Change and Transform equal 100%, however all cells require a value. If there is no value for a cell, please enter zero to continue."
        }else{
          this.runchangetranError = "The entries for Run, Change and Transform equal "+sumOfRunChangePercentages+"%, it must equal 100%. Please revise to continue.";
        }
      } else {
        this.isRunBlack = false;
        this.runchangetranError = "The entries for Run, Change and Transform equal "+sumOfRunChangePercentages+"%, it must equal 100%. Please revise to continue.";
      }
      //show warning message
      this.ITChangeTransformValidation = 'false';
      this.isFormValid = false;
    }
    else {
      this.ITChangeTransformValidation = 'true';
    }

    if (this.ITCostValidation == 'true' && this.isITUsersServedValid && this.ITCapitalValidation == 'true' && this.ITChangeTransformValidation == 'true' && this.isItInfraEmpValid && this.operationSpendCondition && this.isSumOfEndUserthroughtelecomValid && this.isCompFinValid && this.isValidTotalHeadCount) {
      this.isFormValid = true;
    } else {
      this.isFormValid = false;
    }

    this.calculatePercentage();

  }

  //function for validation of capital and operational spending
  onCapitalChange() {

    let CapexValidationCleared = true;
    this.capitalError = "";
    this.myData.ITOperationsSpending.CapitalvsOperational.forEach(element => {

      if (element.src_code_value != '') {
        CapexValidationCleared = false;
      }

      if(element.src_code_value !='' && element.src_code_value != null){
        if (Number(this.unmaskComma(element.src_code_value)) > 100) {
          element.src_code_value = 100;
        }
      }

      if (element.src_code == "TDD450") {
        if(element.src_code_value == '' || element.src_code_value == null){
          this.itCapitalSpend = null;
        }else{
          this.itCapitalSpend = Number(this.unmaskComma(element.src_code_value));
        }
        
      } else if (element.src_code == "TDD460") {
        if(element.src_code_value == '' || element.src_code_value == null){
          this.itOperationSpend = null
        }else{
          this.itOperationSpend = Number(this.unmaskComma(element.src_code_value));
        }
      }

    });

    //Capital vs. Operational values total Must be 100%
    if(this.itCapitalSpend == null && this.itOperationSpend == null){
      this.sumOfITCapital = undefined;
   }else{
      this.sumOfITCapital = this.itCapitalSpend + this.itOperationSpend;
    }
    

    var captialSum = Number(this.sumOfITCapital);
    var ITSumHundred = 100;

    if(this.itCapitalSpend == null && this.itOperationSpend == null){
      this.ITCapitalValidation = 'true';
    }else if (captialSum.toFixed(6) == ITSumHundred.toFixed(6) && this.itCapitalSpend != null && this.itOperationSpend != null) {
      this.ITCapitalValidation = 'true';
    } else if (this.sumOfITCapital >= 0 && CapexValidationCleared != true) {
      if (null == this.itCapitalSpend || '' == String(this.itCapitalSpend) || null == this.itOperationSpend || '' == String(this.itOperationSpend)) {
        this.isCapitaBlank = true;
        if(this.sumOfITCapital == 100){
          this.capitalError = "The entries for Capital and Operational spend equal 100%, however all cells require a value. If there is no value for a cell, please enter zero to continue."
        }else{
          this.capitalError = "The entries for Capital and Operational spend equal "+captialSum+"%, it must equal 100%. Please revise to continue."
        }
      } else {
        this.isCapitaBlank = false;
        this.capitalError = "The entries for Capital and Operational spend equal "+captialSum+"%, it must equal 100%. Please revise to continue."
      }
      //show warning message
      this.ITCapitalValidation = 'false';
      this.isFormValid = false;
    }else {
      this.ITCapitalValidation = 'false';
      this.isFormValid = false;
    }

    if (this.ITCostValidation == 'true' && this.isITUsersServedValid && this.ITCapitalValidation == 'true' && this.ITChangeTransformValidation == 'true' && this.isItInfraEmpValid && this.operationSpendCondition && this.isSumOfEndUserthroughtelecomValid && this.isCompFinValid && this.isValidTotalHeadCount) {
      this.isFormValid = true;
    } else {
      this.isFormValid = false;
    }

    this.calculatePercentage();
  }

  validateUsersAndLocations() {

    this.myData['ITOperationsHeadcount&Locations'].NA.forEach(element => {
      if (element.src_code == "TDB170") {
        if(element.src_code_value == null || element.src_code_value == "" || element.src_code_value == undefined){
          this.totalNumOfEmp = element.src_code_value;
        }else{
          this.totalNumOfEmp = Number(this.unmaskComma(element.src_code_value));
        }
      }
    });

    this.myData['ITOperationsHeadcount&Locations']['Users&Locations'].forEach(element => {
      if (element.src_code == "TDC100") {
        if(element.src_code_value == null || element.src_code_value == "" || element.src_code_value == undefined){
          this.numOfITUsersServed = Number(element.src_code_value);
        }else{
          this.numOfITUsersServed = Number(this.unmaskComma(element.src_code_value));
        }
        
      } else if (element.src_code == "TDC150") {
        if(element.src_code_value == null || element.src_code_value == "" || element.src_code_value == undefined){
          this.TDC150 = Number(element.src_code_value);
        }else{
          this.TDC150 = Number(this.unmaskComma(element.src_code_value));
        }
      }
    });



    // else if (this.numOfITUsersServed > this.totalNumOfEmp) {
    //   this.isITUsersServedValid = false;
    //   this.isFormValid = false;
    //   this.errorMessageUsersAndLoc = "Number of Internal IT Users Served Must Not Exceed Total Number of Employees"
    // }

    if (this.ITCostValidation == 'true' && this.isITUsersServedValid && this.ITCapitalValidation == 'true' && this.ITChangeTransformValidation == 'true' && this.isItInfraEmpValid && this.operationSpendCondition && this.isSumOfEndUserthroughtelecomValid && this.isCompFinValid && this.isValidTotalHeadCount) {
      this.isFormValid = true;
    } else {
      this.isFormValid = false;
    }

    //call percentage
    this.calculatePercentage();

  }

  validateTotalHeadcount() {
    this.errorTotalHeadcountMessage = "";
    this.myData['ITOperationsHeadcount&Locations'].NA.forEach(element => {
      if (element.src_code == "TDB170") {
        if(element.src_code_value == null || element.src_code_value == "" || element.src_code_value == undefined){
          this.totalNumOfEmp = null;
        }else{
          this.totalNumOfEmp = Number(this.unmaskComma(element.src_code_value));
        }
      }
    });
    // this.totalNumOfEmp = this.myData['ITOperationsHeadcount&Locations'].NA[0].src_code_value;

    let isTotalHeadCountEmpty = true;

    this.myData['ITOperationsHeadcount&Locations'].TotalHeadcount.forEach(totalHeadcount => {
      // totalHeadcount.src_code_value = this.unmaskComma(totalHeadcount.src_code_value);
      if (totalHeadcount.src_code_value != '') {
        isTotalHeadCountEmpty = false;
      }

      if (totalHeadcount.src_code == "TDC200") {
        if(totalHeadcount.src_code_value == '' || totalHeadcount.src_code_value == null){
          this.totalNumOfITEmp = null;
        }else{
          this.totalNumOfITEmp = Number(this.unmaskComma(totalHeadcount.src_code_value));   
        }
      } else if (totalHeadcount.src_code == "TDC210") {
        if(totalHeadcount.src_code_value == '' || totalHeadcount.src_code_value == null){
          this.totalNumOfITContractor = null;
        }else{
          this.totalNumOfITContractor = Number(this.unmaskComma(totalHeadcount.src_code_value));
        }        
      }
    });

 
      this.totalITEmployees = this.totalNumOfITEmp + this.totalNumOfITContractor;
    
    
    if(this.totalNumOfITEmp ==null && this.totalNumOfITContractor == null){
      this.isValidTotalHeadCount = true;
      this.isFormValid = true;
      this.errorTotalHeadcountMessage = "";
    }else if(this.totalNumOfEmp == null){
      if(this.totalNumOfITEmp !=null && this.totalNumOfITContractor != null){
        this.isValidTotalHeadCount = false;
        this.isFormValid = false;
        this.errorTotalHeadcountMessage = "The entries below equal:" +this.totalITEmployees+ ". The value cannot exceed the total number of employees entry of:" +this.totalNumOfEmp+". Please revise to continue.";
        this.isTotalHeadCountBlack = false;
      }else if(this.totalNumOfITEmp ==null || this.totalNumOfITContractor == null){
        this.isValidTotalHeadCount = false;
        this.isFormValid = false;
        this.isTotalHeadCountBlack = true;
        this.errorTotalHeadcountMessage = "The entries below equal:" +this.totalITEmployees+ ". The value cannot exceed the total number of employees entry of:" +this.totalNumOfEmp+". Please revise to continue.";
        // this.errorTotalHeadcountMessage = "The sum of IT employees and IT contractors must not exceed the total number of employees.";  
      }
    }else if (this.totalNumOfEmp != null  && (Number(this.totalNumOfEmp) >= this.totalITEmployees)) {
      if(this.totalNumOfITEmp !=null && this.totalNumOfITContractor != null){
        this.isValidTotalHeadCount = true;
        this.isFormValid = true;
        this.errorTotalHeadcountMessage = "";
      }else if(this.totalNumOfITEmp ==null || this.totalNumOfITContractor == null){
        this.isValidTotalHeadCount = false;
        this.isFormValid = false;
        this.isTotalHeadCountBlack = true;
        if((Number(this.totalNumOfEmp) > this.totalITEmployees)){
          // this.errorTotalHeadcountMessage = "Your entries for top two cells is : "+this.totalITEmployees+" which is not exceeding the total number of employees entry of : "+Number(this.totalNumOfEmp)+", however all cells require a value. If there is no value for a cell, please enter zero."
          this.errorTotalHeadcountMessage = "The entries for the top two cells are not exceeding the total number of employees entry, however all cells require a value. If there is no value for a cell, please enter zero to continue."
        }else if((Number(this.totalNumOfEmp) == this.totalITEmployees)){
          // this.errorTotalHeadcountMessage = "Your entries for top two cells is : "+this.totalITEmployees+" which is equal to the total number of employees entry of : "+Number(this.totalNumOfEmp)+", however all cells require a value. If there is no value for a cell, please enter zero."
          this.errorTotalHeadcountMessage = "The entries for the top two cells equal the total number of employees entry, however all cells require a value. If there is no value for a cell, please enter zero to continue."
        }
        // this.errorTotalHeadcountMessage = "The sum of IT employees and IT contractors must not exceed the total number of employees.";  
      }
      
    }else if(this.totalNumOfEmp != null && (Number(this.totalNumOfEmp) < this.totalITEmployees)) {
      if(this.totalNumOfITEmp !=null && this.totalNumOfITContractor != null){
        this.isValidTotalHeadCount = false;
        this.isFormValid = false;
        this.errorTotalHeadcountMessage = "The entries below equal:" +this.totalITEmployees+ ". The value cannot exceed the total number of employees entry of:" +this.totalNumOfEmp+". Please revise to continue.";
        this.isTotalHeadCountBlack = false;
      }else if(this.totalNumOfITEmp ==null || this.totalNumOfITContractor == null){
        this.isValidTotalHeadCount = false;
        this.isFormValid = false;
        this.isTotalHeadCountBlack = true;
        this.errorTotalHeadcountMessage = "The entries below equal:" +this.totalITEmployees+ ". The value cannot exceed the total number of employees entry of:" +this.totalNumOfEmp+". Please revise to continue.";
        // this.errorTotalHeadcountMessage = "The sum of IT employees and IT contractors must not exceed the total number of employees.";  
      }
     }

    if (this.ITCostValidation == 'true' && this.isITUsersServedValid && this.ITCapitalValidation == 'true' && this.ITChangeTransformValidation == 'true' && this.isItInfraEmpValid && this.operationSpendCondition && this.isSumOfEndUserthroughtelecomValid && this.isCompFinValid && this.isValidTotalHeadCount) {
      this.isFormValid = true;
    }
    else {
      this.isFormValid = false;
    }


    //validate headcount breakdown if something is entered in total headcount and breakdown section is not empty
    let isBreakDownEmpty = true;
    this.myData['ITOperationsHeadcount&Locations'].HeadcountBreakdown.forEach(headcountBreakDownValue => {


      if (headcountBreakDownValue.src_code_value != null) {
        isBreakDownEmpty = false;
      }

    });

    if (isTotalHeadCountEmpty != true && isBreakDownEmpty != true) {
      this.validateItOperationsHeadcountAndLocations();
    }

    //this.validateItOperationsHeadcountAndLocations();
    this.calculatePercentage();


  }


  validateItOperationsHeadcountAndLocations() {

    this.myData['ITOperationsHeadcount&Locations'].HeadcountBreakdown.forEach(headcountBreakDownValue => {


      if (headcountBreakDownValue.src_code == "TDC220") {
        if(headcountBreakDownValue.src_code_value == '' || headcountBreakDownValue.src_code_value == null){
          this.numOfITAplEmp = null;
        }else{
          this.numOfITAplEmp = Number(this.unmaskComma(headcountBreakDownValue.src_code_value));
        }
      } else if (headcountBreakDownValue.src_code == "TDC230") {
        if(headcountBreakDownValue.src_code_value == '' || headcountBreakDownValue.src_code_value == null){
          this.numOfITAplContractor = null;
        }else{
          this.numOfITAplContractor = Number(this.unmaskComma(headcountBreakDownValue.src_code_value));
        }
        
      } else if (headcountBreakDownValue.src_code == "TDC240") {
        if(headcountBreakDownValue.src_code_value == '' || headcountBreakDownValue.src_code_value == null){
          this.numOfITInfraEmp = null;
        }else{
          this.numOfITInfraEmp = Number(this.unmaskComma(headcountBreakDownValue.src_code_value));
        }
        
      } else if (headcountBreakDownValue.src_code == "TDC250") {
        if(headcountBreakDownValue.src_code_value == '' || headcountBreakDownValue.src_code_value == null){
          this.numOfITInfraContractor = null;
        }else{
          this.numOfITInfraContractor = Number(this.unmaskComma(headcountBreakDownValue.src_code_value));
        }
        
      } else if (headcountBreakDownValue.src_code == "TDC260") {
        if(headcountBreakDownValue.src_code_value == '' || headcountBreakDownValue.src_code_value == null){
          this.numOfITManagementEmp = null;
        }else{
          this.numOfITManagementEmp = Number(this.unmaskComma(headcountBreakDownValue.src_code_value));
        }
      } else if (headcountBreakDownValue.src_code == "TDC270") {
        if(headcountBreakDownValue.src_code_value == '' || headcountBreakDownValue.src_code_value == null){
          this.numOfITManagementContractor = null;
        }else{
          this.numOfITManagementContractor = Number(this.unmaskComma(headcountBreakDownValue.src_code_value));
        }
        
      } else if (headcountBreakDownValue.src_code == "TDC221") {
        if(headcountBreakDownValue.src_code_value == "" || headcountBreakDownValue.src_code_value == null || headcountBreakDownValue.src_code_value == undefined){
          this.appEmpOffshorePerc = null;
        }else{
          this.appEmpOffshorePerc = Number(this.unmaskComma(headcountBreakDownValue.src_code_value));
        }
        
      } else if (headcountBreakDownValue.src_code == "TDC231") {
        if(headcountBreakDownValue.src_code_value == "" || headcountBreakDownValue.src_code_value == null || headcountBreakDownValue.src_code_value == undefined){
          this.appContraOffshorePerc = null;
        }else{
          this.appContraOffshorePerc = Number(this.unmaskComma(headcountBreakDownValue.src_code_value));
        }
        
      } else if (headcountBreakDownValue.src_code == "TDC241") {
        if(headcountBreakDownValue.src_code_value == "" || headcountBreakDownValue.src_code_value == null || headcountBreakDownValue.src_code_value == undefined){
          this.infraEmpOffshorePerc = null;
        }else{
          this.infraEmpOffshorePerc = Number(this.unmaskComma(headcountBreakDownValue.src_code_value));
        }
        
      } else if (headcountBreakDownValue.src_code == "TDC251") {
        if(headcountBreakDownValue.src_code_value == "" || headcountBreakDownValue.src_code_value == null || headcountBreakDownValue.src_code_value == undefined){
          this.infraContraOffshorePerc = null;
        }else{
          this.infraContraOffshorePerc = Number(this.unmaskComma(headcountBreakDownValue.src_code_value));
        }
      } else if (headcountBreakDownValue.src_code == "TDC261") {
        if(headcountBreakDownValue.src_code_value == "" || headcountBreakDownValue.src_code_value == null || headcountBreakDownValue.src_code_value == undefined){
          this.managementEmpOffshorePerc = null;
        }else{
          this.managementEmpOffshorePerc = Number(this.unmaskComma(headcountBreakDownValue.src_code_value));
        }
        
      } else if (headcountBreakDownValue.src_code == "TDC271") {
        if(headcountBreakDownValue.src_code_value == "" || headcountBreakDownValue.src_code_value == null || headcountBreakDownValue.src_code_value == undefined){
          this.managementContraOffshorePerc = null;
        }else{
          this.managementContraOffshorePerc = Number(this.unmaskComma(headcountBreakDownValue.src_code_value));
        }
        
      }
    });



    this.myData['ITOperationsHeadcount&Locations'].TotalHeadcount.forEach(totalHeadcount => {
      if (totalHeadcount.src_code == "TDC200") {
        if(totalHeadcount.src_code_value == null || totalHeadcount.src_code_value == "" || totalHeadcount.src_code_value == undefined){
          this.totalNumOfITEmp = null;
        }else{
          this.totalNumOfITEmp = Number(this.unmaskComma(totalHeadcount.src_code_value));
        }
        
      } else if (totalHeadcount.src_code == "TDC210") {
        if(totalHeadcount.src_code_value == null || totalHeadcount.src_code_value == "" || totalHeadcount.src_code_value == undefined){
          this.totalNumOfITContractor = null;
        }else{
          this.totalNumOfITContractor = Number(this.unmaskComma(totalHeadcount.src_code_value));
        }
      }
    });

    if (null == this.numOfITInfraEmp && null == this.numOfITAplEmp && null == this.numOfITManagementEmp) {
      this.sumOfITInfraAPlMngEmp = undefined;
    } else {
      this.sumOfITInfraAPlMngEmp = this.numOfITInfraEmp + this.numOfITAplEmp + this.numOfITManagementEmp;
    }

    if (null == this.numOfITInfraContractor && null == this.numOfITAplContractor && null == this.numOfITManagementContractor) {
      this.sumOfITInfraAplMngContractor = undefined;
    } else {
      this.sumOfITInfraAplMngContractor = this.numOfITInfraContractor + this.numOfITAplContractor + this.numOfITManagementContractor;
    }

    let empCnt = Number(this.totalNumOfITEmp);
    let contraCnt = Number(this.totalNumOfITContractor);
    
    
    if ((this.appEmpOffshorePerc > 0 || this.infraEmpOffshorePerc > 0 || this.managementEmpOffshorePerc > 0) && empCnt == 0) {
      //if any of offshore contractor percentage is > 0
      this.errorMessageItOperationsHeadcountAndLocation = "The percentage of offshore employees cannot be greater than zero if the number of corresponding employees is zero.";
      this.isItInfraEmpValid = false;
      this.isFormValid = false;
      this.isBlack = false;

    } else if ((this.appContraOffshorePerc > 0 || this.infraContraOffshorePerc > 0 || this.managementContraOffshorePerc > 0) && contraCnt == 0) {

      this.errorMessageItOperationsHeadcountAndLocation = "The percentage of offshore contractors cannot be greater than zero if the number of corresponding contractors is zero.";
      this.isItInfraEmpValid = false;
      this.isFormValid = false;
      this.isBlack = false;

    } else if (this.totalNumOfITEmp != null && this.totalNumOfITContractor != null &&
      Number(this.totalNumOfITEmp) == this.sumOfITInfraAPlMngEmp && (Number(this.totalNumOfITContractor) == this.sumOfITInfraAplMngContractor)
      && this.numOfITInfraEmp !=null && this.numOfITAplEmp != null && this.numOfITManagementEmp != null&& this.numOfITInfraContractor != null 
      && this.numOfITAplContractor!= null && this.numOfITManagementContractor != null) {
// set form as valid if sum is equal and all fields are entered 
      this.isItInfraEmpValid = true;
      this.isFormValid = true;
      this.isBlack = true;

    }else if(this.totalNumOfITContractor == this.sumOfITInfraAplMngContractor && this.totalNumOfITContractor >= 0 && this.sumOfITInfraAplMngContractor >= 0 && (this.numOfITInfraContractor == null || this.numOfITAplContractor== null || this.numOfITManagementContractor == null)){
    // if sum of total contractors is equal to num of contractor but all fields are not entered displaying message in blue
      // this.errorMessageItOperationsHeadcountAndLocation = "The sum of IT infrastructure, applications, and IT management and security contractors must equal the total number of IT contractors.";
      // this.errorMessageItOperationsHeadcountAndLocation = "Your entries for the bottom three cells "+this.sumOfITInfraAplMngContractor+" is equal to the equal the total IT contractors entry of: "+Number(this.totalNumOfITContractor)+", however all cells require a value. If there is no value for a cell, please enter zero."
      this.errorMessageItOperationsHeadcountAndLocation = "The entries for the bottom three cells on the left is equal to the total IT contractors entry, however all cells require a value. If there is no value for a cell, please enter zero to continue."
      this.isItInfraEmpValid = false;
      this.isFormValid = false;
      this.isBlack = true;
    }else if(this.totalNumOfITEmp == this.sumOfITInfraAPlMngEmp  && this.sumOfITInfraAPlMngEmp >= 0 && this.totalNumOfITEmp >=0 &&
      (this.numOfITInfraEmp ==null || this.numOfITAplEmp == null || this.numOfITManagementEmp == null)){
        
      // if sum of total employee is equal to num of employee but all fields are not entered displaying message in blue
      this.isBlack = true;
      // this.errorMessageItOperationsHeadcountAndLocation = "The sum of IT infrastructure, applications, and IT management and security employees must equal the total number of IT employees.";
      // this.errorMessageItOperationsHeadcountAndLocation = "Your entries for the top three cells "+this.sumOfITInfraAPlMngEmp+" is equal to the total IT employees entry of: "+Number(this.totalNumOfITEmp)+", however all cells require a value.  If there is no value for a cell, please enter zero."
      this.errorMessageItOperationsHeadcountAndLocation = "The entries for top 3 cells on the left is equal to the total IT employees entry, however all cells require a value. If there is no value for a cell, please enter zero to continue."
      this.isItInfraEmpValid = false;
      this.isFormValid = false;
    }
    else if ((this.totalNumOfITEmp != this.sumOfITInfraAPlMngEmp) && this.sumOfITInfraAPlMngEmp >= 0) {
      
      if (null == this.numOfITInfraEmp || '' == String(this.numOfITInfraEmp) || null == this.numOfITAplEmp || '' == String(this.numOfITAplEmp) || null == this.numOfITManagementEmp || '' == String(this.numOfITManagementEmp)) {
       // if sum of total employees is not equal to num of employees but all fields are not entered displaying message in blue
        this.isBlack = true;
      }
      else {
        // if sum of total employees is not equal to num of employees but all fields are not entered displaying message in red
        this.isBlack = false;
      }

      // this.errorMessageItOperationsHeadcountAndLocation = "The sum of IT infrastructure, applications, and IT management and security employees must equal the total number of IT employees.";
      this.errorMessageItOperationsHeadcountAndLocation = "The entries for the top 3 cells on the left equal: "+this.sumOfITInfraAPlMngEmp+", it must equal the total IT employees entry of: "+this.totalNumOfITEmp+". Please revise to continue.";
      this.isItInfraEmpValid = false;
      this.isFormValid = false;
    }else if ((this.totalNumOfITContractor != this.sumOfITInfraAplMngContractor) && this.sumOfITInfraAplMngContractor >= 0) {
      
      if (null == this.numOfITInfraContractor || '' == String(this.numOfITInfraContractor) || null == this.numOfITAplContractor || '' == String(this.numOfITAplContractor) || null == this.numOfITManagementContractor || '' == String(this.numOfITManagementContractor)) {
        // if sum of total contractors is not equal to num of contractor but all fields are not entered displaying message in blue
        this.isBlack = true;
      }
      else {
        // if sum of total contractors is not equal to num of contractor but all fields are not entered displaying message in red
        this.isBlack = false;
      }

      this.errorMessageItOperationsHeadcountAndLocation = "The entries for the bottom three cells on the left is: "+this.sumOfITInfraAplMngContractor+", it must equal the total IT contractors entry of: "+this.totalNumOfITContractor+". Please revise to continue.";
      this.isItInfraEmpValid = false;
      this.isFormValid = false;
    } else if ((this.totalNumOfITContractor == this.sumOfITInfraAplMngContractor && this.numOfITInfraContractor != null && this.numOfITAplContractor!= null && this.numOfITManagementContractor != null)) {

      this.isItInfraEmpValid = true;
      this.isFormValid = true;
      this.isBlack = true;

    } else if (this.totalNumOfITEmp == this.sumOfITInfraAPlMngEmp && this.numOfITInfraEmp !=null && this.numOfITAplEmp != null && this.numOfITManagementEmp != null) {

      this.isItInfraEmpValid = true;
      this.isFormValid = true;
      this.isBlack = true;

    } else if(this.numOfITInfraEmp == null && this.numOfITAplEmp  == null && this.numOfITManagementEmp == null && this.numOfITInfraContractor == null && this.numOfITAplContractor == null && this.numOfITManagementContractor == null && this.appEmpOffshorePerc == null && this.appContraOffshorePerc == null && this.infraEmpOffshorePerc == null && this.infraContraOffshorePerc == null && this.managementEmpOffshorePerc == null && this.managementContraOffshorePerc == null){
      this.isItInfraEmpValid = true;
      this.isFormValid = true;
      this.isBlack = true;
    }else if(this.numOfITInfraEmp == null && this.numOfITAplEmp  == null && this.numOfITManagementEmp == null && this.numOfITInfraContractor == null && this.numOfITAplContractor == null && this.numOfITManagementContractor == null){
      this.isItInfraEmpValid = true;
      this.isFormValid = true;
      this.isBlack = true;
    }
   

    if (this.ITCostValidation == 'true' && this.isITUsersServedValid && this.ITCapitalValidation == 'true' && this.ITChangeTransformValidation == 'true' && this.isItInfraEmpValid && this.operationSpendCondition && this.isSumOfEndUserthroughtelecomValid && this.isCompFinValid && this.isValidTotalHeadCount) {
      this.isFormValid = true;
    } else {
      this.isFormValid = false;
    }

    //if nothing is entered, clear validations on section
    let clearHeadCountBreakDownValidations = true;
    this.myData['ITOperationsHeadcount&Locations'].HeadcountBreakdown.forEach(headcountBreakDownValue => {


      if (headcountBreakDownValue.src_code_value != null) {
        clearHeadCountBreakDownValidations = false;
      }
    });

    if (clearHeadCountBreakDownValidations == true) {
      this.isItInfraEmpValid = true;
    }



    this.calculatePercentage();

  }

  //this will hit service and get all data from service

  //this will hit service and get all data
  getAllTabsData(scenarioId) {
    let object = this;
    object.dashboardId = "1";

    object.generateScenarioService.getScenarioData(object.dashboardId, object.loginUserId, scenarioId).subscribe(data => {
      object.getDataStatus();
      object.myData = data;
      object.temperoryDisable = false;
      if(scenarioId == 0){
        object.isDeleteAllowed = false;
      }else{
        object.isDeleteAllowed = true;
      }
      
      //since the recieved response give project id as 0th element and company as 1st element
      //thats why we are swapping it
      let swapping = object.myData.CIODashboardDataGeneralTab.NA[0];
      object.myData.CIODashboardDataGeneralTab.NA[0] = object.myData.CIODashboardDataGeneralTab.NA[1];
      object.myData.CIODashboardDataGeneralTab.NA[1] = swapping;





      let index = 0;
      let length = object.myData.CIODashboardDataGeneralTab.NA.length;

      while (index < length) {
        let row: any = {};
        row.disabled = false;
        if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code == "ICE000") {
          object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = [];
          object.indexSourceCodeMap["ICE000"] = index;
          //if selected id is 0,i.e  for new scenario we will disable/enable company and project .
          if (object.selectedScanrio != 0) {
            row.disabled = false;
          } else {

            row.disabled = false;
          }
          //
        }
        if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code == "TD0120") {
          object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = [];
          // object.getAllCountries(index);
          object.indexSourceCodeMap["TD0120"] = index;
        }
        if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code == "ICE001") {
          object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = [];
          object.getAllCompanies(index);
          if (object.selectedScanrio != 0) {
            row.disabled = true;
          } else {
            row.disabled = false;
          }
          object.getCompanyProjects(1, object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value);
          object.indexSourceCodeMap["ICE001"] = index;
        }
        if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code == "ICE007") {
          object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = [];
          object.getAllIndustries(index);
          object.indexSourceCodeMap["ICE007"] = index;
          //control will go inside if we click on edit scenario from edit and compare and we are visiting input my data for first time
          if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value != undefined && object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value != null) {
            object.updateIndustryGroup(object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value);
          }
        }

        if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code == "ICE008") {
          object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = [];

          object.indexSourceCodeMap["ICE008"] = index;
        }

        if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code == "TDA100") {
          object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = [];
          object.getAllForbesVertical(index);
          object.indexSourceCodeMap["TDA100"] = index;
          //control will go inside if we click on edit scenario from edit and compare and we are visiting input my data for first time
          if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value != undefined && object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value != null) {
            object.updateForbesSubVertical(object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value);
          }
        }
        if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code == "TDA105") {
          object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = [];
          // object.getAllForbesVertical(index);
          object.indexSourceCodeMap["TDA105"] = index;
        }
        if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code == "ICE002") {
          object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = [];
          if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value != undefined && object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value != null) {

            object.getAllReportingCurrency(index, true, object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value);

          } else {
            object.getAllReportingCurrency(index, false);

          }
          object.indexSourceCodeMap["ICE002"] = index;
          // object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value="FE482E13-D3B6-4208-8C3C-2FD7AFBEBEA1";
          //  row.disabled = false;
        }
        if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code == "TD0110") {
          object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = [];
          object.getAllRegion(index);
          //the control will go to below if condition ,if we are initialzing component and selecting existing scenario  from edit my scenario from edit my scenario
          //
          if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value != undefined && object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value != null) {
            object.updateCountryDropDown(object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value);
          }

          object.indexSourceCodeMap["TD0110"] = index;
        }
        if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code == "ICE005") {
          object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = object.getDataUsage();

        }
        //populating year drop down
        if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code == "TD0100") {

          let yearDropDown = [];

          // for (var x = 1900; x <= 2100; x++) {
          for (var x = 2100; x >= 1900; x--) {
            let year: any = {};
            year.key = x;
            year.value = x;
            yearDropDown.push(year);
          }
          object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = yearDropDown;
          object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value = new Date().getFullYear();
          object.yearDropdown = yearDropDown;

        }


        object.disabledStatus.push(row);

        index++;
      }



      object.dataLoaded = true;


      object.prepareSourceCurrencyMap();

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
     

      let errorObj = {
        "dashboardId": "1",
        "pageName": "CIO Dashboard Input My Data Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })

  }


  closeEnterDataModal() {
    let object = this;
    object.siblingData.changeEnterDataModalFlag(true);
    if (object.showRestBox) {
      this.confirmBoxCloseFlag = true;
    } else {
      object.resetAll();
      $('.modal-select-to-compare').modal('hide');
    }

    //this will reset entered data so that new form will be populated when user clicks on input my data and enter new scenario
    // object.resetAll();
  }

  //this will be invoked when entered scenario is saved
  saveEnteredScenarion() {
    let object = this;
    object.activateShowBox(false);


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

    // let category = Object.values(this.myData);
    let category = Object.keys(this.myData).map(e => this.myData[e]);
    length1 = Object.keys(this.myData).length;


    for (i = 0; i < length1; i++) {

      // subcategory = Object.values(category[i]);
      subcategory = Object.keys(category[i]).map(e => category[i][e]);

      length2 = Object.keys(subcategory).length;

      for (j = 0; j < length2; j++) {

        // subCatValue = Object.values(subcategory[j]);
        subCatValue = Object.keys(subcategory[j]).map(e => subcategory[j][e]);

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
    this.enteredDataObj.scenario.dashboardID = 1;
    this.enteredDataObj.scenario.userId = "E5E8339B-0620-4377-82FE-0008029EDC53";
    this.enteredDataObj.scenario.projectId = "679D007C-C668-40E1-A60E-06391512F388"; //ISG
    this.enteredDataObj.scenario.clientID = "E5E8339B-0620-4377-82FE-0008029EDC5311";
    this.enteredDataObj.scenario.scenarioID = selectedScanrio;
    this.enteredDataObj.scenario.scenarioName = this.scenarioNameText;

    this.enteredDataObj.kpi_maintenance_data = this.scenarioDataObj;
    this.enteredDataObj.sessionId = object.loggedInUserInfo.userDetails.sessionId;

    this.generateScenarioService.savedNewScenario(this.enteredDataObj).subscribe((response) => {
      object.isCopyEnabled = true;
      object.disabledStatus[0].disabled = true;
      object.disabledStatus[1].disabled = true;

      let message;
      if (selectedScanrio == null) {
        message = "Saved";

        object.isResetRequired = false;
        //updating ScenarioList After Updating
        object.getScenariosList(response.value);



      } else {
        message = "updated";
        object.isResetRequired = false;
        object.getScenariosList(response.value);

      }

      let  description = object.scenarioNameText;
      if (description == undefined || description == undefined || description.trim().length == 0) {
        description = response.value + '_Scenario ' + response.value;
      } else {
        description = response.value + '_' + this.scenarioNameText;
      }
      this.toastr.info('Scenario ' + description + " " + message, '', {
        timeOut: 7000,
        positionClass: 'toast-top-center'
      });

      object.isDeleteAllowed = true;

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
     

      let errorObj = {
        "dashboardId": "1",
        "pageName": "CIO Dashboard Input My Data Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });
    // if(selectedScanrio){
    //   //if user has not selected any currency ,then we are showing comparision in USD
    //   let currency=this.myData.GeneralInformation.NA[this.indexSourceCodeMap["ICE002"]].src_code_value;
    //   let region = this.myData.GeneralInformation.NA[this.indexSourceCodeMap["TD0110"]].src_code_value;
    //   if(currency==undefined||currency==null||currency.trim().length==0){
    //     currency="FE482E13-D3B6-4208-8C3C-2FD7AFBEBEA1";//USD key
    //   }
    //   let sharedData={"comparisionData":this.scenarioDataObj,"currency":currency,"region":region, "map":this.sourceCurrencyMap};
    //   this.cIOEnterMyDataSharedService.setData(sharedData);
    //   if(selectedScanrio!=null)
    //   {
    //     this.cIOEnterMyDataSharedService.setScenarioSelection(selectedScanrio);
    //   }

    //   
    //   this.cIOEnterMyDataSharedService.getEmitter().emit('');
    // }
  }

  //this will get Data Status dropdown
  getDataStatus() {
    let object = this;
    object.generalTabService.getDataStatus().subscribe((response) => {
      let index = 0;
      let length = object.myData.CIODashboardDataGeneralTab.NA.length;
      index = 0;
      while (index < length) {
        if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code == "ICE009") {
          object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = response.dataStatus;
        }


        index++;
      }


    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      

      let errorObj = {
        "dashboardId": "1",
        "pageName": "CIO Dashboard Input My Data Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });

  }

  //this peice of code is no longer used
  enableCompanyAndProjectDropdown() {
    let object = this;
    object.projectDropDownTag.nativeElement.disabled = false;
    object.companyDropDownTag.nativeElement.disabled = false;

  }

  //this peice of code is no longer used
  disableCompanyAndProjectDropdown() {
    let object = this;

    object.projectDropDownTag.nativeElement.disabled = true;
    object.companyDropDownTag.nativeElement.disabled = true;
  }

  readyNewScenarioScreen() {
    let object = this;
    object.selectedScanrio = 0;
    object.resetAll();
  }

  //same as saveEnterScenario ,only it will give entered data to CIO dashboard for comparision
  saveAndCompare() {

    if (!this.isFormValid) {
      this.showErrorMesssage = true;
      // return false;
    } else {
      this.showErrorMesssage = false;
      let object = this;
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
      object.activateShowBox(false);


      // let category = Object.values(this.myData);
      let category = Object.keys(this.myData).map(e => this.myData[e]);
      length1 = Object.keys(this.myData).length;


      for (i = 0; i < length1; i++) {

        // subcategory = Object.values(category[i]);
        subcategory = Object.keys(category[i]).map(e => category[i][e]);

        length2 = Object.keys(subcategory).length;

        for (j = 0; j < length2; j++) {

          // subCatValue = Object.values(subcategory[j]);
          subCatValue = Object.keys(subcategory[j]).map(e => subcategory[j][e]);

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

      //preparing request for saving scenario
      this.enteredDataObj.scenario.dashboardID = 1;
      this.enteredDataObj.scenario.userId = "E5E8339B-0620-4377-82FE-0008029EDC53";
      this.enteredDataObj.scenario.projectId = "679D007C-C668-40E1-A60E-06391512F388"; //ISG
      this.enteredDataObj.scenario.clientID = "E5E8339B-0620-4377-82FE-0008029EDC5311";
      this.enteredDataObj.scenario.scenarioID = selectedScanrio;
      this.enteredDataObj.scenario.scenarioName = this.scenarioNameText;

      this.enteredDataObj.kpi_maintenance_data = this.scenarioDataObj;
      this.enteredDataObj.sessionId = object.loggedInUserInfo.userDetails.sessionId;

      this.generateScenarioService.savedNewScenario(this.enteredDataObj).subscribe((response) => {
        let message;
        object.isCopyEnabled = false;
        object.disabledStatus[0].disabled = true;
        object.disabledStatus[1].disabled = true;



        if (selectedScanrio == null) {

          message = "Saved";

          object.isResetRequired = true;

          //updating ScenarioList After Updating
          object.getScenariosList(response.value);

          //set saved scenario to service
          object.cIOEnterMyDataSharedService.setScenarioSelection(response.value);
          //trigger a emitter to let landing page know
          object.commonService.getEvent().emit('newCIOScenarioSaved');

        } else {
          message = "updated";
          object.isResetRequired = true;
          object.getScenariosList(response.value);
          object.cIOEnterMyDataSharedService.setScenarioSelection(response.value);
          object.commonService.getEvent().emit('newCIOScenarioSaved');
        }

        let  description = this.scenarioNameText;
        if (description == undefined || description == undefined || description.trim().length == 0) {
          description = response.value + '_Scenario ' + response.value;
        } else {
          description = response.value + '_' + this.scenarioNameText;
        }
        this.toastr.info('Scenario ' + description + " " + message, '', {
          timeOut: 7000,
          positionClass: 'toast-top-center'
        });

        //object.resetAll();
        object.selectedScanrio = 0;
        object.scenarioNameText = ""
      }, (error) => {
        //throw custom exception to global error handler
        //create error object
        

        let errorObj = {
          "dashboardId": "1",
          "pageName": "CIO Dashboard Input My Data Screen",
          "errorType": "Fatal",
          "errorTitle": "Web Service Error",
          "errorDescription": error.message,
          "errorObject": error
        }

        throw errorObj;
      });


      this.getScenarioDataService.setData(this.enteredDataObj.kpi_maintenance_data);
      
      this.getScenarioDataService.getEmitter().emit('dataChange');//myData.CIODashboardDataGeneralTab.NA[index]
      let currency = this.myData.CIODashboardDataGeneralTab.NA[object.indexSourceCodeMap["ICE002"]].src_code_value;
      if (currency == undefined || currency == null || currency.trim().length == 0) {
        currency = "FE482E13-D3B6-4208-8C3C-2FD7AFBEBEA1";//USD key
      }
      let sharedData = { "comparisionData": this.scenarioDataObj, "currency": currency, "map": this.sourceCurrencyMap };

      object.cIOEnterMyDataSharedService.setData(sharedData);
      if (selectedScanrio != null) {
        this.cIOEnterMyDataSharedService.setScenarioSelection(selectedScanrio);
      }
      //be cautious
      object.cIOEnterMyDataSharedService.getEmitter().emit('newCIOScenarioFromInput');
    }

  }

  //as name suggests ,this code will populate general tab
  populateGeneralTab(selectedValues) {
    let object = this;


    //object.myData.CIODashboardDataGeneralTab.NA[0].src_code_value
    if (selectedValues.length == 0) {

      object.setDefaultValues();
      return;
    }


    let defaultValue = selectedValues[0];
    let index = 0;
    let length = object.myData.CIODashboardDataGeneralTab.NA.length;
    while (index < length) {
      let key = object.myData.CIODashboardDataGeneralTab.NA[index].src_code;

      if (key != undefined) { //since undefined break the code
        let value = defaultValue[key];

        if (value != undefined || value != null) {
          object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value = value;
          if (key == "TD0110") {
            object.updateCountryDropDown(value);
          }


        } else {
          object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value = null;

        }

        if (key == "ICE007") {
          object.updateIndustryGroup(value);
        }
        if (key == "TDA100") {
          object.updateForbesSubVertical(value);
        }
      }
      if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code == "TD0100")
        object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value = new Date().getFullYear();
      index++;
    }

  }

  //making default values ,this function will erase data of all dropdows except company
  setDefaultValues() {
    let index = 0;
    let object = this;
    let length = object.myData.CIODashboardDataGeneralTab.NA.length;

    while (index < length) {

      if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code != "ICE001" && object.myData.CIODashboardDataGeneralTab.NA[index].src_code != "TD0100")
        object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value = null;
      index++;
    }

    object.generalVar = true;
    object.emitter.emit('calculate');

  }

  //this will populate all projects related to that company
  populateProjects(projects) {


    let projectList = [];


    let index = 0;
    let object = this;
    let length = object.myData.CIODashboardDataGeneralTab.NA.length;
    //need optimization
    while (index < length) {

      if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code == "ICE000") {

        if (projects.length == 0 || projects === []) {
          object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = [];
          break;
        } else {
          object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = object.projects;
          let projectsMap: any = {}

          for (let projectid of projects) {
            projectsMap[projectid] = projectid;
          }


          for (let project of object.myData.CIODashboardDataGeneralTab.NA[index].dropDown) {

            if (projectsMap[project.key] != undefined) {

              projectList.push(project);
            }

          }

          object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = projectList;

          object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value = projectList[0].key;

        }
      }




      index++;
    }
  }

  //below are the functions to populate all dropdowns

  getAllProjects(index) {
    let object = this;

    object.generalTabService.getAllProjects().subscribe((response: any) => {
      // object.myData.CIODashboardDataGeneralTab.NA[index].dropDown=response.project;
      object.projects = response.project;
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
     

      let errorObj = {
        "dashboardId": "1",
        "pageName": "CIO Dashboard Input My Data Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })



  }

  getAllCompanies(index) {
    let object = this;
    //it must be noted that for now we are only populating 9000 companies for now until we found a
    //solution to enhance performance
    object.generalTabService.getAllCompanies().subscribe((response: any) => {
      object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = response.client;
      object.companies = response.client;

      if (response.client.length == 1) {

        object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value = response.client[0].key;
        object.disabledStatus[index].disabled = true
        object.hasOnlyCompany = true;
        object.singleCompany = response.client;
        object.getCompanyProjects(1, response.client[0].key);
      } else {
        object.disabledStatus[index].disabled = false
        object.hasOnlyCompany = false;

      }





    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      
      let errorObj = {
        "dashboardId": "1",
        "pageName": "CIO Dashboard Input My Data Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })

  }

  //get reporting currency
  getAllReportingCurrency(index, setPlaceHolder, value?: any) {
    let object = this;

    object.generalTabService.getAllCurrency().subscribe((response: any) => {
      object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = response.currencyExchange;
      object.currencies = response.currencyExchange;
      object.currencyMap = new Map<string, string>();

      for (let element of object.currencies) {
        object.currencyMap[element.key] = element.value;
      }

      if (setPlaceHolder) {
        object.changePlaceHolder(getCurrencySymbol(object.currencyMap[value], "narrow"));

      }

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      
      let errorObj = {
        "dashboardId": "1",
        "pageName": "CIO Dashboard Input My Data Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })

  }

  //get all groups
  /*
  getAllGroups(index) {
    let object = this;

    object.generalTabService.getAllGroup().subscribe((response: any) => {
      object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = response.industrygroup;
      object.group = response.industrygroup;
    },(error)=>{
      //throw custom exception to global error handler
			//create error object
			let errorObj = {
				"dashboardId" : "1",
				"pageName" : "CIO Dashboard Input My Data Screen",
				"errorType" : "Fatal",
				"errorTitle" : "Web Service Error",
				"errorDescription" : error.message,
				"errorObject" : error
			}

			throw errorObj;
    })

  }
  */
  //get all regions
  getAllRegion(index) {
    let object = this;

    object.generalTabService.getAllRegion().subscribe((response: any) => {
      let regionGlobal = { key: "", value: "Global", id: "Global" };
      response.region.unshift(regionGlobal);
      object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = response.region;
      object.regions = response.region;
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      

      let errorObj = {
        "dashboardId": "1",
        "pageName": "CIO Dashboard Input My Data Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })

  }

  //getting all countries
  getAllCountries(index) {
    let object = this;

    object.generalTabService.getAllCountry().subscribe((response: any) => {
      object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = response.country;
      object.countries = response.country;
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      
      let errorObj = {
        "dashboardId": "1",
        "pageName": "CIO Dashboard Input My Data Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })

  }

  getAllForbesVertical(index) {
    let object = this;

    object.generalTabService.getAllForbesVertical().subscribe((response: any) => {
      object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = response.forbesvertical;
      object.forbesVertical = response.forbesvertical;
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      
      let errorObj = {
        "dashboardId": "1",
        "pageName": "CIO Dashboard Input My Data Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })

  }

  getAllForbesSubVertical(index) {
    let object = this;

    object.generalTabService.getAllForbesSubVertical().subscribe((response: any) => {
      object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = response.forbesSubvertical;
      object.forbesSubVertical = response.forbesSubvertical;
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      
      let errorObj = {
        "dashboardId": "1",
        "pageName": "CIO Dashboard Input My Data Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })

  }

  getAllIndustries(index) {
    let object = this;

    object.generalTabService.getAllIndustry().subscribe((response: any) => {
      object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = response.industryvertical;
      object.industries = response.industryvertical;
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      
      let errorObj = {
        "dashboardId": "1",
        "pageName": "CIO Dashboard Input My Data Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })


  }


  getDataUsage(): any {

    let dropDown = [{ key: 1, "value": "Approval Required" }, { key: 2, "value": "Not Specified" }, { key: 3, "value": "No" }, { key: 4, "value": "Yes" }];
    return dropDown;
  }

  //As name suggests,it will reset form
  resetAll() {



    let object = this;
    object.isCopyEnabled = false;
    object.selectedScanrio = 0; //default as client wants it
    //resetting every  thing on page
    object.scenarioNameText = "";
    let index = 0;
    let length = object.myData.CIODashboardDataGeneralTab.NA.length;
    object.activateShowBox(false);
    //reseting general tab
    while (index < length) {
      object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value = null;
      object.disabledStatus[index].disabled = false;
      if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code == "TD0120") {
        //object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = object.countries;
        //now we also clean dropdown of country on reset
        object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = [];
      }
      
      if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code == "ICE000" && object.hasOnlyCompany) {
        object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value = object.singleProject[0].key;
        object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = object.singleProject;
        object.getCompanyProjects(1, object.companies[0].key);
        
        object.disabledStatus[index].disabled = true;
      }

      if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code == "ICE002") {
        object.disabledStatus[index].disabled = false;
        //object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value="FE482E13-D3B6-4208-8C3C-2FD7AFBEBEA1"
      }
      if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code == "ICE008") {
        object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = [];
      }
      if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code == "TDA105") {
        object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = [];
      }
      if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code == "TD0100") {
        object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value = new Date().getFullYear();
      }
      if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code == "ICE001" && object.hasOnlyCompany) {
        object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value = object.companies[0].key;
        object.disabledStatus[index].disabled = true;
      }

      index++;
    }

    //reseting CompanyFinancialInformationGeneralTab
    index = 0;
    length = object.myData.CompanyFinancialInformationGeneralTab.NA.length;
    while (index < length) {
      object.myData.CompanyFinancialInformationGeneralTab.NA[index].src_code_value = null;
      object.myData.CompanyFinancialInformationGeneralTab.NA[index].notes = null;
      if (object.myData.CompanyFinancialInformationGeneralTab.NA[index].value_format != "%" && object.myData.CompanyFinancialInformationGeneralTab.NA[index].value_format != "#") {
        object.myData.CompanyFinancialInformationGeneralTab.NA[index].value_format = "$";
      }
      index++;
    }
    //reseting   ITOperationsHeadcount&Locations tab
    index = 0;
    length = object.myData['ITOperationsHeadcount&Locations'].NA.length;
    while (index < length) {
      object.myData['ITOperationsHeadcount&Locations'].NA[index].src_code_value = null;
      object.myData['ITOperationsHeadcount&Locations'].NA[index].notes = null;
      if (object.myData['ITOperationsHeadcount&Locations'].NA[index].value_format != "%" && object.myData['ITOperationsHeadcount&Locations'].NA[index].value_format != "#") {
        object.myData['ITOperationsHeadcount&Locations'].NA[index].value_format = "$";
      }
      index++;
    }

    //reseting Users&Locations
    index = 0;
    length = object.myData['ITOperationsHeadcount&Locations']['Users&Locations'].length;
    while (index < length) {
      object.myData['ITOperationsHeadcount&Locations']['Users&Locations'][index].src_code_value = null;
      object.myData['ITOperationsHeadcount&Locations']['Users&Locations'][index].notes = null;
      if (object.myData['ITOperationsHeadcount&Locations']['Users&Locations'][index].value_format != "%" && object.myData['ITOperationsHeadcount&Locations']['Users&Locations'][index].value_format != "#") {
        object.myData['ITOperationsHeadcount&Locations']['Users&Locations'][index].value_format = "$";
      }
      index++;
    }
    //reseting ...
    index = 0;
    length = object.myData['ITOperationsHeadcount&Locations']['TotalHeadcount'].length;
    while (index < length) {
      object.myData['ITOperationsHeadcount&Locations']['TotalHeadcount'][index].src_code_value = null;
      object.myData['ITOperationsHeadcount&Locations']['TotalHeadcount'][index].notes = null;
      if (object.myData['ITOperationsHeadcount&Locations']['TotalHeadcount'][index].value_format != "%" && object.myData['ITOperationsHeadcount&Locations']['TotalHeadcount'][index].value_format != "#") {
        object.myData['ITOperationsHeadcount&Locations']['TotalHeadcount'][index].value_format = "$";
      }
      index++;
    }
    index = 0;
    length = object.myData['ITOperationsHeadcount&Locations']['HeadcountBreakdown'].length;
    while (index < length) {
      object.myData['ITOperationsHeadcount&Locations']['HeadcountBreakdown'][index].src_code_value = null;
      object.myData['ITOperationsHeadcount&Locations']['HeadcountBreakdown'][index].notes = null;
      if (object.myData['ITOperationsHeadcount&Locations']['HeadcountBreakdown'][index].value_format != "%" && object.myData['ITOperationsHeadcount&Locations']['HeadcountBreakdown'][index].value_format != "#") {
        object.myData['ITOperationsHeadcount&Locations']['HeadcountBreakdown'][index].value_format = "$";
      }
      index++;
    }

    //reseting ItOperationSpending Values
    index = 0;

    length = object.myData.ITOperationsSpending.ITFinancialData.length;
    while (index < length) {
      object.myData.ITOperationsSpending.ITFinancialData[index].src_code_value = null;
      object.myData.ITOperationsSpending.ITFinancialData[index].notes = null;
      if (object.myData.ITOperationsSpending.ITFinancialData[index].value_format != "%" && object.myData.ITOperationsSpending.ITFinancialData[index].value_format != "#") {
        object.myData.ITOperationsSpending.ITFinancialData[index].value_format = "$";
      }
      index++;
    }
    //resting ITOperationsSpending.NA
    index = 0;
    length = object.myData.ITOperationsSpending.ITFinancialDataBreakdown.length;
    while (index < length) {
      object.myData.ITOperationsSpending.ITFinancialDataBreakdown[index].src_code_value = null;
      object.myData.ITOperationsSpending.ITFinancialDataBreakdown[index].notes = null;
      if (object.myData.ITOperationsSpending.ITFinancialDataBreakdown[index].value_format != "%" && object.myData.ITOperationsSpending.ITFinancialDataBreakdown[index].value_format != "#") {
        object.myData.ITOperationsSpending.ITFinancialDataBreakdown[index].value_format = "$";
      }
      index++;
    }
    //
    index = 0;

    length = object.myData.ITOperationsSpending.ITFinancialBreakdownbyTower.length;
    while (index < length) {
      object.myData.ITOperationsSpending.ITFinancialBreakdownbyTower[index].src_code_value = null;
      object.myData.ITOperationsSpending.ITFinancialBreakdownbyTower[index].notes = null;
      if (object.myData.ITOperationsSpending.ITFinancialBreakdownbyTower[index].value_format != "%" && object.myData.ITOperationsSpending.ITFinancialBreakdownbyTower[index].value_format != "#") {
        object.myData.ITOperationsSpending.ITFinancialBreakdownbyTower[index].value_format = "$";
      }
      index++;
    }
    //reseting ItOperationSpendingOutsourcedCosts
    index = 0;

    length = object.myData.ITOperationsSpending.OutsourcedCosts.length;
    while (index < length) {
      object.myData.ITOperationsSpending.OutsourcedCosts[index].src_code_value = null;
      object.myData.ITOperationsSpending.OutsourcedCosts[index].notes = null;
      if (object.myData.ITOperationsSpending.OutsourcedCosts[index].value_format != "%" && object.myData.ITOperationsSpending.OutsourcedCosts[index].value_format != "#") {
        object.myData.ITOperationsSpending.OutsourcedCosts[index].value_format = "$";
      }
      index++;
    }
    //resetting ITOperationSpending.ItSpendingType Value
    index = 0;

    length = object.myData.ITOperationsSpending.ITSpendingType.length;
    while (index < length) {
      object.myData.ITOperationsSpending.ITSpendingType[index].src_code_value = null;
      object.myData.ITOperationsSpending.ITSpendingType[index].notes = null;
      if (object.myData.ITOperationsSpending.ITSpendingType[index].value_format != "%" && object.myData.ITOperationsSpending.ITSpendingType[index].value_format != "#") {
        object.myData.ITOperationsSpending.ITSpendingType[index].value_format = "$";
      }
      index++;
    }
    //
    index = 0;

    length = object.myData.ITOperationsSpending.RunChangeTransform.length;

    while (index < length) {
      object.myData.ITOperationsSpending.RunChangeTransform[index].src_code_value = null;
      object.myData.ITOperationsSpending.RunChangeTransform[index].notes = null;
      if (object.myData.ITOperationsSpending.RunChangeTransform[index].value_format != "%" && object.myData.ITOperationsSpending.RunChangeTransform[index].value_format != "#") {
        object.myData.ITOperationsSpending.RunChangeTransform[index].value_format = "$";
      }

      index++;
    }

    index = 0;

    length = object.myData.ITOperationsSpending.CapitalvsOperational.length;
    while (index < length) {
      object.myData.ITOperationsSpending.CapitalvsOperational[index].src_code_value = null;
      object.myData.ITOperationsSpending.CapitalvsOperational[index].notes = null
      if (object.myData.ITOperationsSpending.CapitalvsOperational[index].value_format != "%" && object.myData.ITOperationsSpending.CapitalvsOperational[index].value_format != "#") {
        object.myData.ITOperationsSpending.CapitalvsOperational[index].value_format = "$";
      }
      index++;
    }


    //angular way of doing document.getElementById
    object.financialPercentTag.nativeElement.innerHTML = 0;
    object.generalPercentTag.nativeElement.innerHTML = 0;
    object.overAllPercentTag.nativeElement.innerHTML = 0;
    object.itspendPercentTag.nativeElement.innerHTML = 0;
    object.headcountPercentTag.nativeElement.innerHTML = 0;

    object.ITCostValidation = 'true';
    object.isITUsersServedValid = true;
    object.ITCapitalValidation = 'true';
    object.ITChangeTransformValidation = 'true';
    object.isSumOfEndUserthroughtelecomValid = true;
    object.isItInfraEmpValid = true;
    object.operationSpendCondition = true;
    object.isFormValid = true;
    object.isCompFinValid = true;
    object.isValidTotalHeadCount = true;
    object.isDeleteAllowed = false;
  }


  changePlaceHolder(placeHolder) {
    let object = this;
    
    let index = 0;

    //setting Place holder for CompanyFinancialInformationGeneralTab
    length = object.myData.CompanyFinancialInformationGeneralTab.NA.length;
    while (index < length) {
      if (object.myData.CompanyFinancialInformationGeneralTab.NA[index].value_format != "%" && object.myData.CompanyFinancialInformationGeneralTab.NA[index].value_format != "#") {
        object.myData.CompanyFinancialInformationGeneralTab.NA[index].value_format = placeHolder;
      }
      index++;
    }
    
    //setting Place holder for   ITOperationsHeadcount&Locations tab
    index = 0;
    //setting place holder ItOperationSpending Values
    index = 0;

    length = object.myData.ITOperationsSpending.ITFinancialData.length;
    while (index < length) {
      if (object.myData.ITOperationsSpending.ITFinancialData[index].value_format != "%" && object.myData.ITOperationsSpending.ITFinancialData[index].value_format != "#") {
        object.myData.ITOperationsSpending.ITFinancialData[index].value_format = placeHolder;
      }
      index++;
    }
    //setting place holder ITOperationsSpending.NA
    index = 0;
    length = object.myData.ITOperationsSpending.ITFinancialDataBreakdown.length;
    while (index < length) {
      if (object.myData.ITOperationsSpending.ITFinancialDataBreakdown[index].value_format != "%" && object.myData.ITOperationsSpending.ITFinancialDataBreakdown[index].value_format != "#") {
        object.myData.ITOperationsSpending.ITFinancialDataBreakdown[index].value_format = placeHolder;
      }
      index++;
    }
    //
    index = 0;

    length = object.myData.ITOperationsSpending.ITFinancialBreakdownbyTower.length;
    while (index < length) {
      if (object.myData.ITOperationsSpending.ITFinancialBreakdownbyTower[index].value_format != "%" && object.myData.ITOperationsSpending.ITFinancialBreakdownbyTower[index].value_format != "#") {
        object.myData.ITOperationsSpending.ITFinancialBreakdownbyTower[index].value_format = placeHolder;
      }
      index++;
    }
    //setting place holderItOperationSpendingOutsourcedCosts
    index = 0;

    length = object.myData.ITOperationsSpending.OutsourcedCosts.length;
    while (index < length) {
      if (object.myData.ITOperationsSpending.OutsourcedCosts[index].value_format != "%" && object.myData.ITOperationsSpending.OutsourcedCosts[index].value_format != "#") {
        object.myData.ITOperationsSpending.OutsourcedCosts[index].value_format = placeHolder;
      }
      index++;
    }
    //resetting ITOperationSpending.ItSpendingType Value
    index = 0;

    length = object.myData.ITOperationsSpending.ITSpendingType.length;
    while (index < length) {
      if (object.myData.ITOperationsSpending.ITSpendingType[index].value_format != "%" && object.myData.ITOperationsSpending.ITSpendingType[index].value_format != "#") {
        object.myData.ITOperationsSpending.ITSpendingType[index].value_format = placeHolder;
      }
      index++;
    }
    //
    index = 0;

    length = object.myData.ITOperationsSpending.RunChangeTransform.length;

    while (index < length) {
      if (object.myData.ITOperationsSpending.RunChangeTransform[index].value_format != "%" && object.myData.ITOperationsSpending.RunChangeTransform[index].value_format != "#") {
        object.myData.ITOperationsSpending.RunChangeTransform[index].value_format = placeHolder;
      }

      index++;
    }

    index = 0;

    length = object.myData.ITOperationsSpending.CapitalvsOperational.length;
    while (index < length) {
      if (object.myData.ITOperationsSpending.CapitalvsOperational[index].value_format != "%" && object.myData.ITOperationsSpending.CapitalvsOperational[index].value_format != "#") {
        object.myData.ITOperationsSpending.CapitalvsOperational[index].value_format = placeHolder;
      }
      index++;
    }



  }
  //this will populate all the scenarios
  getScenariosList(defaultScarioId) {
    let object = this;
    //default scenario

    object.generalTabService.getAllScenarios().subscribe((response: any) => {
      object.scenarios = [];
      for (let key in response) {
        let scenario: any = {};
        scenario.key = key
        if (response[key] == null || response[key].trim().length == 0) {
          scenario.value = key;
        } else {
          scenario.value = key + "_" + response[key];
        }
        scenario.name = response[key]; //adding name in scenarioList
        object.scenarios.push(scenario);
      }
      object.selectedScanrio = defaultScarioId;
      try {

        object.scenarioNameText = object.getScenarioName(object.selectedScanrio);
        
      } catch (error) {
        //throw custom exception to global error handler
        //create error object
        
        let errorObj = {
          "dashboardId": "1",
          "pageName": "CIO Dashboard Input My Data Screen",
          "errorType": "warn",
          "errorTitle": "Data Error",
          "errorDescription": error.message,
          "errorObject": error
        }

        throw errorObj;
      }
      object.scenarios.reverse();
      if (object.isResetRequired) {

        object.resetAll();
      }

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      
      let errorObj = {
        "dashboardId": "1",
        "pageName": "CIO Dashboard Input My Data Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })


  }


  //get ForbesVertical According to SubVertical
  updateForbesSubVertical(verticalId) {
    let object = this;
    object.generalTabService.getAllForbesSubVerticalByVertical(verticalId).subscribe((response: any) => {
      let index = 0;
      let length = object.myData.CIODashboardDataGeneralTab.NA.length;
      //
      //

      while (index < length) {
        if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code === "TDA105") {

          if (response.length === 0 || response == []) {
            object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = [];
            break;
          }

          object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = response.forbesSubvertical;

        }

        index++;
      }


    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      
      let errorObj = {
        "dashboardId": "1",
        "pageName": "CIO Dashboard Input My Data Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });



  }

  updateIndustryGroup(industryId) {
    let object = this;
    object.generalTabService.getAllGroupByIndustryVertical(industryId).subscribe((response: any) => {
      let index = 0;
      let length = object.myData.CIODashboardDataGeneralTab.NA.length;
      //
      //

      while (index < length) {
        if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code === "ICE008") {

          if (response.length === 0 || response == []) {
            object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = [];
            break;
          }

          object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = response.industrygroup;

        }

        index++;
      }


    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      
      let errorObj = {
        "dashboardId": "1",
        "pageName": "CIO Dashboard Input My Data Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });


  }




  //when we will click on region then this will get all countries related to that company
  updateCountryDropDown(regionId) {
    let object = this;
    object.generalTabService.getCountriesByRegion(regionId).subscribe((response: any) => {
      let index = 0;
      let length = object.myData.CIODashboardDataGeneralTab.NA.length;
      while (index < length) {
        if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code === "TD0120") {

          if (response.length === 0 || response == []) {
            object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = [];
            break;
          }

          object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = response.country;

        }

        index++;
      }


    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      

      let errorObj = {
        "dashboardId": "1",
        "pageName": "CIO Dashboard Input My Data Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });


  }

  //this will get projects related to company
  getCompanyProjects(index, companyId) {
    let object = this;

    if (companyId == null || companyId == undefined) {
      object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = [];
      return;
    }
    let isInternal = object.isInternal;
    let userType = "All";
    if (isInternal == "NO") {
      userType = "External";
    } else {
      userType = "Internal"
    }

    object.generalTabService.getAllProjectsForCompany(companyId, userType).subscribe((response: any) => {
      object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = response.project;


      if (response.project.length == 1) {
        object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value = response.project[0].key;
        object.myData.CIODashboardDataGeneralTab.NA[index].dropDown = response.project;
        object.disabledStatus[index].disabled = true;
        object.hasOnlyOneProject = true;
        object.singleProject = response.project;
      } else {
        object.hasOnlyOneProject = false;
        object.disabledStatus[index].disabled = false;

      }
      //object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value=response.project[0].key;

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
     

      let errorObj = {
        "dashboardId": "1",
        "pageName": "CIO Dashboard Input My Data Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })


  }


  //this will get scenario name on basis of key given
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

  //this will calculate % of form filled
  calculateGeneralPercentage() {

    let calculatedGeneralPercentage;
    let completedGeneralElement = 0;
    let totalGeneralElements = 0;
    let calculatedFinancePercentage;
    let completedFinanceElement = 0;
    let totalFinanceElements = 0;
    let calculatedheadcountPercentage;
    let completedHeadElement = 0;
    let totalHeadElements = 0;

    let calculatedITSpendPercentage = 0;
    let completedSpendElements = 0;
    let totalSpendElements = 0;

    let overallcompletedElements = 0;
    let overallTotalelements = 0;
    let overallCalculatedpercentage = 0;




    $(".general-section .form-control").each(function (index) {

      if ($(this).val() != '' && $(this).val() != null) {
        completedGeneralElement++;
      }

      totalGeneralElements = index + 1;


    });


    calculatedGeneralPercentage = completedGeneralElement / totalGeneralElements * 100;

    $('#general-percentage').text(Math.round(calculatedGeneralPercentage) + '%');

    //loop through finance form controls
    $("#comapny-finance-card input").each(function (index) {

      if ($(this).val() != '' && $(this).val() != null) {
        completedFinanceElement++;
      }

      totalFinanceElements = index + 1;

    });

    calculatedFinancePercentage = completedFinanceElement / totalFinanceElements * 100;

    $('#fiancial-percentage').text(Math.round(calculatedFinancePercentage) + '%');

    //loop through headcount form controls
    $("#headcount-card input").each(function (index) {

      if ($(this).val() != '' && $(this).val() != null) {
        completedHeadElement++;
      }

      totalHeadElements = index + 1;

    });

    calculatedheadcountPercentage = completedHeadElement / totalHeadElements * 100;

    $('#headcount-percentage').text(Math.round(calculatedheadcountPercentage) + '%');

    //it spending

    $("#itspending-card input").each(function (index) {

      if ($(this).val() != '' && $(this).val() != null) {
        completedSpendElements++;
      }

      totalSpendElements = index + 1;

    });

    calculatedITSpendPercentage = completedSpendElements / totalSpendElements * 100;

    $('#itspending-percentage').text(Math.round(calculatedITSpendPercentage) + '%');

    //overall calculation
    overallcompletedElements = completedGeneralElement + completedFinanceElement + completedHeadElement + completedSpendElements;
    overallTotalelements = totalGeneralElements + totalFinanceElements + totalHeadElements + totalSpendElements;
    overallCalculatedpercentage = overallcompletedElements / overallTotalelements * 100;
    $('#overall-percentage').text(Math.round(overallCalculatedpercentage) + '%');

    $('#headcount-percentage').text(Math.round(calculatedheadcountPercentage) + '%');

    if (overallCalculatedpercentage == 100) {
      this.isFormedFilled = true;
    } else {
      this.isFormedFilled = false;
    }

  }

  calculatePercentage() {

    let calculatedGeneralPercentage;
    let completedGeneralElement = 0;
    let totalGeneralElements = 0;
    let calculatedFinancePercentage;
    let completedFinanceElement = 0;
    let totalFinanceElements = 0;
    let calculatedheadcountPercentage;
    let completedHeadElement = 0;
    let totalHeadElements = 0;

    let calculatedITSpendPercentage = 0;
    let completedSpendElements = 0;
    let totalSpendElements = 0;

    let overallcompletedElements = 0;
    let overallTotalelements = 0;
    let overallCalculatedpercentage = 0;

    //genral
    $(".general-section .form-control").each(function (index) {

      if ($(this).val() != '' && $(this).val() != null) {
        completedGeneralElement++;
      }

      totalGeneralElements = index + 1;


    });


    calculatedGeneralPercentage = completedGeneralElement / totalGeneralElements * 100;

    $('#general-percentage').text(Math.round(calculatedGeneralPercentage) + '%');

    //loop through finance form controls
    $("#comapny-finance-card input").each(function (index) {

      if ($(this).val() != '' && $(this).val() != null) {
        completedFinanceElement++;
      }

      totalFinanceElements = index + 1;

    });

    calculatedFinancePercentage = completedFinanceElement / totalFinanceElements * 100;

    $('#fiancial-percentage').text(Math.round(calculatedFinancePercentage) + '%');

    //loop through headcount form controls
    $("#headcount-card input").each(function (index) {

      if ($(this).val() != '' && $(this).val() != null) {
        completedHeadElement++;
      }

      totalHeadElements = index + 1;

    });

    calculatedheadcountPercentage = completedHeadElement / totalHeadElements * 100;

    $('#headcount-percentage').text(Math.round(calculatedheadcountPercentage) + '%');

    //it spending

    $("#itspending-card input").each(function (index) {

      if ($(this).val() != '' && $(this).val() != null) {
        completedSpendElements++;
      }

      totalSpendElements = index + 1;

    });

    calculatedITSpendPercentage = completedSpendElements / totalSpendElements * 100;

    $('#itspending-percentage').text(Math.round(calculatedITSpendPercentage) + '%');

    //overall calculation
    overallcompletedElements = completedGeneralElement + completedFinanceElement + completedHeadElement + completedSpendElements;
    overallTotalelements = totalGeneralElements + totalFinanceElements + totalHeadElements + totalSpendElements;
    overallCalculatedpercentage = overallcompletedElements / overallTotalelements * 100;
    $('#overall-percentage').text(Math.round(overallCalculatedpercentage) + '%');

    //$('#headcount-percentage').text(Math.round(calculatedheadcountPercentage) + '%');

    if (overallCalculatedpercentage == 100) {
      this.isFormedFilled = true;
    } else {
      this.isFormedFilled = false;
    }

  }

  //this will set scenario id and will get data according to that selected scenario id
  setScenarioId(scenarioId) {
    let object = this;
    object.selectedScanrio = scenarioId;

    object.getScenariosList(object.selectedScanrio);
    object.getScenarioDataById();
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
        "dashboardId": "1",
        "pageName": "CIO Dashboard Input My Data Screen",
        "errorType": "warn",
        "errorTitle": "Data Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    }
    object.selectedScanrio = scenarioID; //after reset again reseting selectedScenario


    if (object.selectedScanrio == 0) {
      object.scenarioNameText = "";
      //enable here
      return;
    }
    //get id from emitter and assign to "savedScenarioId"
    //setting name of selected Scenario
    object.temperoryDisable = true;

    try {
      object.scenarioNameText = object.getScenarioName(object.selectedScanrio);

    } catch (error) {
      //throw custom exception to global error handler
      //create error object
      

      let errorObj = {
        "dashboardId": "1",
        "pageName": "CIO Dashboard Input My Data Screen",
        "errorType": "warn",
        "errorTitle": "Data Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    }

    object.generateScenarioService.getSavedScenarioDataToPopulate(object.dashboardId, object.loginUserId, object.selectedScanrio).subscribe((response) => {
      object.isCopyEnabled = true;
      object.compiler.clearCache();
      //object.myData = response;
      //object.getDataStatus();
      let index = 0;
      object.temperoryDisable = false;
      let currenyId;
      let length = object.myData.CIODashboardDataGeneralTab.NA.length;
      let swapping = response.CIODashboardDataGeneralTab.NA[0];
      response.CIODashboardDataGeneralTab.NA[0] = response.CIODashboardDataGeneralTab.NA[1];
      response.CIODashboardDataGeneralTab.NA[1] = swapping;

      object.getCompanyProjects(1, response.CIODashboardDataGeneralTab.NA[0].src_code_value);


      while (index < length) {
        object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value = response.CIODashboardDataGeneralTab.NA[index].src_code_value;
        //enabling disabling company and project dropdowns
        if (index == 0 || index == 1) {
          object.disabledStatus[index].disabled = true;
         
        } else {
          object.disabledStatus[index].disabled = false;

        }
        //getting countries related to that region
        if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code == "TD0110") {
          object.updateCountryDropDown(object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value);
        }
        if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code == "ICE007") {
          object.updateIndustryGroup(object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value);
        }
        if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code == "TDA100") {
          object.updateForbesSubVertical(object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value);
        }
        if (object.myData.CIODashboardDataGeneralTab.NA[index].src_code == "ICE002") {
          currenyId = object.myData.CIODashboardDataGeneralTab.NA[index].src_code_value
          //changing placeholder acc to currency present in selected scenario

        }
        index++;

      }

      object.myData.CompanyFinancialInformationGeneralTab = response.CompanyFinancialInformationGeneralTab;
      object.myData["ITOperationsHeadcount&Locations"] = response["ITOperationsHeadcount&Locations"];
      object.myData.ITOperationsSpending = response.ITOperationsSpending;

      object.changePlaceHolder(getCurrencySymbol(object.currencyMap[currenyId], "narrow"));
      setTimeout(() => {
        object.calculatePercentage();
      }, 2000);

        this.isDeleteAllowed = true;
      

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      
      object.temperoryDisable = false;
      let errorObj = {
        "dashboardId": "1",
        "pageName": "CIO Dashboard Input My Data Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })





  }

  prepareSourceCurrencyMap() {

    let object = this;


    let index = 0;
    let length = object.myData.CIODashboardDataGeneralTab.NA.length;

    //reseting general tab
    while (index < length) {
      object.sourceCurrencyMap[object.myData.CIODashboardDataGeneralTab.NA[index].src_code] = object.myData.CIODashboardDataGeneralTab.NA[index].value_format;

      index++;
    }

    //reseting CompanyFinancialInformationGeneralTab
    index = 0;
    length = object.myData.CompanyFinancialInformationGeneralTab.NA.length;
    while (index < length) {
      object.sourceCurrencyMap[object.myData.CompanyFinancialInformationGeneralTab.NA[index].src_code] = object.myData.CompanyFinancialInformationGeneralTab.NA[index].value_format;
      index++;
    }
    //reseting   ITOperationsHeadcount&Locations tab
    index = 0;
    length = object.myData['ITOperationsHeadcount&Locations'].NA.length;
    while (index < length) {
      object.sourceCurrencyMap[object.myData['ITOperationsHeadcount&Locations'].NA[index].src_code] = object.myData['ITOperationsHeadcount&Locations'].NA[index].value_format;
      index++;
    }

    //reseting Users&Locations
    index = 0;
    length = object.myData['ITOperationsHeadcount&Locations']['Users&Locations'].length;
    while (index < length) {
      object.sourceCurrencyMap[object.myData['ITOperationsHeadcount&Locations']['Users&Locations'][index].src_code] = object.myData['ITOperationsHeadcount&Locations']['Users&Locations'][index].value_format;
      index++;
    }
    //reseting ...
    index = 0;
    length = object.myData['ITOperationsHeadcount&Locations']['TotalHeadcount'].length;
    while (index < length) {
      object.sourceCurrencyMap[object.myData['ITOperationsHeadcount&Locations']['TotalHeadcount'][index].src_code] = object.myData['ITOperationsHeadcount&Locations']['TotalHeadcount'][index].value_format;
      index++;
    }


    //reseting HeadcountBreakdown
    index = 0;
    length = object.myData['ITOperationsHeadcount&Locations']['HeadcountBreakdown'].length;
    while (index < length) {
      object.sourceCurrencyMap[object.myData['ITOperationsHeadcount&Locations']['HeadcountBreakdown'][index].src_code] = object.myData['ITOperationsHeadcount&Locations']['HeadcountBreakdown'][index].value_format;
      index++;
    }
    //reseting ItOperationSpending Values
    index = 0;

    length = object.myData.ITOperationsSpending.ITFinancialData.length;
    while (index < length) {
      object.sourceCurrencyMap[object.myData.ITOperationsSpending.ITFinancialData[index].src_code] = object.myData.ITOperationsSpending.ITFinancialData[index].value_format;
      index++;
    }
    //resting ITOperationsSpending.NA
    index = 0;
    length = object.myData.ITOperationsSpending.ITFinancialDataBreakdown.length;
    while (index < length) {
      object.sourceCurrencyMap[object.myData.ITOperationsSpending.ITFinancialDataBreakdown[index].src_code] = object.myData.ITOperationsSpending.ITFinancialDataBreakdown[index].value_format;
      index++;
    }
    //
    index = 0;

    length = object.myData.ITOperationsSpending.ITFinancialBreakdownbyTower.length;
    while (index < length) {
      object.sourceCurrencyMap[object.myData.ITOperationsSpending.ITFinancialBreakdownbyTower[index].src_code] = object.myData.ITOperationsSpending.ITFinancialBreakdownbyTower[index].value_format;
      index++;
    }
    //reseting ItOperationSpendingOutsourcedCosts
    index = 0;

    length = object.myData.ITOperationsSpending.OutsourcedCosts.length;
    while (index < length) {
      object.sourceCurrencyMap[object.myData.ITOperationsSpending.OutsourcedCosts[index].src_code] = object.myData.ITOperationsSpending.OutsourcedCosts[index].value_format;
      index++;
    }
    //resetting ITOperationSpending.ItSpendingType Value
    index = 0;

    length = object.myData.ITOperationsSpending.ITSpendingType.length;
    while (index < length) {
      object.sourceCurrencyMap[object.myData.ITOperationsSpending.ITSpendingType[index].src_code] = object.myData.ITOperationsSpending.ITSpendingType[index].value_format;
      index++;
    }
    //
    index = 0;

    length = object.myData.ITOperationsSpending.RunChangeTransform.length;

    while (index < length) {
      object.sourceCurrencyMap[object.myData.ITOperationsSpending.RunChangeTransform[index].src_code] = object.myData.ITOperationsSpending.RunChangeTransform[index].value_format;
      index++;
    }

    index = 0;

    length = object.myData.ITOperationsSpending.CapitalvsOperational.length;
    while (index < length) {
      object.sourceCurrencyMap[object.myData.ITOperationsSpending.CapitalvsOperational[index].src_code] = object.myData.ITOperationsSpending.CapitalvsOperational[index].value_format;
      index++;
    }

    


  }

  //% threshold and -ve value validation
  validateCompFinNumberThresholds(val, placeholder, event, companyFinancialInfo) {


    if (companyFinancialInfo.src_code != 'TDB200') {
      this.validateNumberThresholds(val, placeholder, event);
    }

     //placeholder
     if (placeholder == '%') {
      if(event.target.value == null || event.target.value == "" || event.target.value == undefined){
        event.target.value = event.target.value;
      }else{
        event.target.value = this.unmaskComma(event.target.value);
      }
      if (Number(event.target.value) > 100) {
        event.target.value = 100;
        companyFinancialInfo.src_code_value = 100;
      }
    }

    if (companyFinancialInfo.src_code_value.split('.').length > 0) {
      var decimalplaces = companyFinancialInfo.src_code_value.split('.')[1].length;
      var temp1 = companyFinancialInfo.src_code_value.split('.')[0];
      var temp2 = companyFinancialInfo.src_code_value.split('.')[1];

      if (decimalplaces > 6) {
        temp2 = temp2.substring(0, 6);
        companyFinancialInfo.src_code_value = temp1 + '.' + temp2;
      }

    }

   


  }

  validateTotEmpNumberThresholds(val, placeholder, event, totalEmp) {

    this.validateNumberThresholds(val, placeholder, event);

    //placeholder
    if (placeholder == '%') {
      if(event.target.value == null || event.target.value == "" || event.target.value == undefined){
        event.target.value = event.target.value;
      }else{
        event.target.value = this.unmaskComma(event.target.value);
      }
      if (Number(event.target.value) > 100) {
        event.target.value = 100;
        totalEmp.src_code_value = 100;
      }
    }

  }

  validateNumberUserLocThresholds(val, placeholder, event, userAndLocation) {

    this.validateNumberThresholds(val, placeholder, event);

    //placeholder
    if (placeholder == '%') {
      if(event.target.value == null || event.target.value == "" || event.target.value == undefined){
        event.target.value = event.target.value;
      }else{
        event.target.value = this.unmaskComma(event.target.value);
      }
      if (Number(event.target.value) > 100) {
        event.target.value = 100;
        userAndLocation.src_code_value = 100;
      }
    }

  }

  validateTotalHeadNumberThresholds(val, placeholder, event, totalHeadcount) {


    this.validateNumberThresholds(val, placeholder, event);

    //placeholder
    if (placeholder == '%') {
      if(event.target.value == null || event.target.value == "" || event.target.value == undefined){
        event.target.value = event.target.value;
      }else{
        event.target.value = this.unmaskComma(event.target.value);
      }
      if (Number(event.target.value) > 100) {
        event.target.value = 100;
        totalHeadcount.src_code_value = 100;
      }
    }

  }

  validateNumberHeadcountThresholds(val, placeholder, event, subcatOfHeadcount) {


    this.validateNumberThresholds(val, placeholder, event);

    //placeholder
    if (placeholder == '%') {
      if(event.target.value == null || event.target.value == "" || event.target.value == undefined){
        event.target.value = event.target.value;
      }else{
        event.target.value = this.unmaskComma(event.target.value);
      }
      
      if (Number(event.target.value) > 100) {
        event.target.value = 100;
        subcatOfHeadcount.src_code_value = 100;
      }
    }

  }

  validateFinDataNumberThresholds(val, placeholder, event) {

    this.validateNumberThresholds(val, placeholder, event);
    
  }

  validateFinBreakNumberThresholds(val, placeholder, event, itFinancialBreakdown) {

    this.validateNumberThresholds(val, placeholder, event);

    if (val.split('.').length > 0) {
      var decimalplaces = val.split('.')[1].length;
      var temp1 = val.split('.')[0];
      var temp2 = val.split('.')[1];

      if (decimalplaces > 6) {
        temp2 = temp2.substring(0, 6);
        itFinancialBreakdown.src_code_value = temp1 + '.' + temp2;
      }

    }


    //placeholder
    if (placeholder == '%') {
      if(event.target.value == null || event.target.value == "" || event.target.value == undefined){
        event.target.value = event.target.value;
      }else{
        event.target.value = this.unmaskComma(event.target.value);
      }
      if (Number(event.target.value) > 100) {
        event.target.value = 100;
        itFinancialBreakdown.src_code_value = 100;
      }
    }

  }

  validateByTowerNumberThresholds(val, placeholder, event, demographicalBreakdown) {

    if (val.split('.').length > 0) {
      var decimalplaces = val.split('.')[1].length;
      var temp1 = val.split('.')[0];
      var temp2 = val.split('.')[1];

      if (decimalplaces > 6) {
        temp2 = temp2.substring(0, 6);
        demographicalBreakdown.src_code_value = temp1 + '.' + temp2;
      }

    }

    this.validateNumberThresholds(val, placeholder, event);

    //placeholder
    if (placeholder == '%') {
      if(event.target.value == null || event.target.value == "" || event.target.value == undefined){
        event.target.value = event.target.value;
      }else{
        event.target.value = this.unmaskComma(event.target.value);
      }
      if (Number(event.target.value) > 100) {
        event.target.value = 100;
        demographicalBreakdown.src_code_value = 100;
      }
    }

  }

  validateOutsourceNumberThresholds(val, placeholder, event, outsourcedCosts) {

    this.validateNumberThresholds(val, placeholder, event);

    //placeholder
    if (placeholder == '%') {
      if(event.target.value == null || event.target.value == "" || event.target.value == undefined){
        event.target.value = event.target.value;
      }else{
        event.target.value = this.unmaskComma(event.target.value);
      }
      if (Number(event.target.value) > 100) {
        event.target.value = 100;
        outsourcedCosts.src_code_value = 100;
      }
    }

  }

  validateITSpendNumberThresholds(val, placeholder, event, itSpendingType) {

    this.validateNumberThresholds(val, placeholder, event);

    //placeholder
    if (placeholder == '%') {
      if(event.target.value == null || event.target.value == "" || event.target.value == undefined){
        event.target.value = event.target.value;
      }else{
        event.target.value = this.unmaskComma(event.target.value);
      }
      if (Number(event.target.value) > 100) {
        event.target.value =100;
        itSpendingType.src_code_value = 100;
      }
    }

  }

  validateRunNumberThresholds(val, placeholder, event, itRunvsChangevsTransform) {

    this.validateNumberThresholds(val, placeholder, event);

    //placeholder
    if (placeholder == '%') {
      if(event.target.value == null || event.target.value == "" || event.target.value == undefined){
        event.target.value = event.target.value;
      }else{
        event.target.value = this.unmaskComma(event.target.value);
      }
      if (Number(event.target.value) > 100) {
        event.target.value = 100;
        itRunvsChangevsTransform.src_code_value = 100;
      }
    }

  }


  validateCAPOpNumberThresholds(val, placeholder, event, capitalvsoperational) {
    this.validateNumberThresholds(val, placeholder, event);

    //placeholder
    if (placeholder == '%') {
      if(event.target.value == null || event.target.value == "" || event.target.value == undefined){
        event.target.value = event.target.value;
      }else{
        event.target.value = this.unmaskComma(event.target.value);
      }
      if (Number(event.target.value) > 100) {
        event.target.value = 100;
        capitalvsoperational.src_code_value = 100;
      }
    }
  }

  validateITFinAnnual(val, placeholder, event, itFinancialData) {
    this.validateNumberThresholds(val, placeholder, event);

    if (val.split('.').length > 0) {
      var decimalplaces = val.split('.')[1].length;
      var temp1 = val.split('.')[0];
      var temp2 = val.split('.')[1];

      if (decimalplaces > 6) {
        temp2 = temp2.substring(0, 6);
        itFinancialData.src_code_value = temp1 + '.' + temp2;
      }

    }


    //placeholder
    if (placeholder == '%') {
      if(event.target.value == null || event.target.value == "" || event.target.value == undefined){
        event.target.value = event.target.value;
      }else{
        event.target.value = this.unmaskComma(event.target.value);
      }
      if (Number(event.target.value) > 100) {
        event.target.value = 100;
        itFinancialData.src_code_value = 100;
      }
    }
  }

  validateNumberThresholds(val, placeholder, event) {

    if (Number(val) < 0) {
      //this.ITCapVsOp.nativeElement.value = 0;
      event.target.value = '';
    }


  }

  expandEnterDataForm(obj) {
    if ($(obj).attr("lastState") === null || $(obj).attr("lastState") === 0) {
      $(".collapseHeader").attr("aria-expanded", true);
      $(".collapseBody").addClass("show");
      $(obj).attr("lastState", 1);
    } else {
      $(".collapseHeader").attr("aria-expanded", false);
      $(".collapseBody").removeClass("show");
      $(obj).attr("lastState", 0);
    }

  }

  resetEnterFormTabular() {
    $(".collapseHeader").attr("aria-expanded", false);
    $(".collapseBody").removeClass("show");
    setTimeout(() => {
      $("#collapse-link1").attr("aria-expanded", true);
      $("#collapse1").addClass("show");
    }, 1000);
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
      $('.modal-select-to-compare').modal('hide');
    }
    this.confirmBoxCloseFlag = false;
  }
  setScrollPosition(scrollVal) {
    $(".main-data-section").scrollTop(scrollVal);
  }

  activateShowBox(value) {
    let object = this;
    object.showRestBox = value;
  }
  onPaste(srcCodeObj, $event) {
    srcCodeObj.src_code_value = $event.target.value;
    // this.checkValidation();
  }
  ngOnDestroy() {
    let object = this;
    object.privilegesService.getEmitter().removeAllListeners();
  }

  unmaskComma(value){
    let t1: any;
    t1 = value.toString().replace(/,/g,"");
    return t1;
    
  }

  deleteScenario(){
    let object = this;
    object.confirmBoxDeleteFlag = true;
  }

  deleteConfirmYes(flag){
    let object = this;
    if(flag){
      let userId = object.loggedInUserInfo['userDetails']['emailId'];
      let requestObj = {
        "userId": userId,
        "dashboardID":1,
        "scenarioIDList":[]
      };
      let tempObj = {
        "scenarioId": object.selectedScanrio,
        "isActive": 0
        };
        requestObj.scenarioIDList.push(tempObj);

      
      //call webservice
      object.enterCompareDataTowersService.deleteScenario(requestObj).subscribe(function (response) {
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
          object.updateScenarioListNotificationServiceService.getEmitter().emit('updateCIOScenarioListAfterDeletion');
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
  object.temperoryDisable=false;
  object.isCopyEnabled = false;
  object.isDeleteAllowed = false;
}

}



$(document).ready(function () {

  //propover modal box functionality
  $('.modal-popover-btn').click(function () {

    var currenthref = $(this).attr("href");
    $(".content-section-prompt").each(function (index) {

      var currentId = "#" + $(this).attr('id');

      if (currenthref != currentId) {
        $(this).css('display', 'none');
      }

    });

    $("" + $(this).attr("href")).toggle();
  });

  $('.content-section-prompt .cancel').click(function () {
    $('.content-section-prompt').css('display', 'none');
  });

  $('.numer-only').keypress(function (evt) {

    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31 &&
      (charCode < 48 || charCode > 57))
      return false;
    return true;
  });

  //datepicker to select year only
  $('.general-form-row').datepicker({
    minViewMode: 2,
    format: 'yyyy'
  });

  $('.general-form-row .datepicker').css('display', 'none');
  $('.general-form-row .datepicker').attr('id', 'general-period-datepicker');

  //override default styles
  $('#general-period-datepicker').css('background', 'white');
  $('#general-period-datepicker').css('z-index', '1500');
  $('#general-period-datepicker').css('position', 'fixed');
  $('#general-period-datepicker').css('border', '1px solid gray');

  $('#general-period').change(function () {

    $('.general-form-row .datepicker').toggle();

  });

  // $(".card-header a").click(function(){
  
  //   $(".main-data-section").scrollTop(100);
  // })



});
