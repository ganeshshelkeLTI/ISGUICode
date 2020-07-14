import {
  Component,
  OnInit,
  ElementRef,
  ViewChild, OnDestroy,
  Compiler
} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnterCompareDataTowersService } from '../services/enter-compare-data-towers.service';
import { GenerateScenarioService } from '../services/generate-scenario.service';
import { ApplicationDevelopmentInputMyDataSharedService } from '../services/application-development/application-development-input-my-data-shared.service';
import { CIOGeneralTabCompanyDetailService } from '../services/ciogeneral-tab-company-detail.service';
import { ToastrService } from 'ngx-toastr';
import { MapSourceCodeDataValues } from '../map-source-code-data-values';
import { ApplicationDevelopmentEditAndCompareSharedService } from '../services/application-development/application-development-edit-and-compare-shared.service';
import { getCurrencySymbol } from '@angular/common';
import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';

import { PrivilegesService } from '../services/privileges.service';
import {
  EventEmitter
} from 'events';

import {
  SiblingDataService
} from '../services/sibling-data.service';

import {
  GetScenarioDataService
} from '../services/get-scenario-data.service';

import {
  AdmGeneraltabService
} from '../services/application-development/adm-generaltab.service';

import {
  HeaderCompareEnterDataSharedService
} from '../services/header-compare-enter-data-shared.service';
import { EILSEQ } from 'constants';
import { TextMaskModule } from 'angular2-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
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
  selector: 'app-enter-my-data-application-development',
  templateUrl: './enter-my-data-application-development.component.html',
  styleUrls: ['./enter-my-data-application-development.component.css']
})
export class EnterMyDataApplicationDevelopmentComponent implements OnInit {

  numberMask = numberMask;
  decimalNumberMask = decimalNumberMask;
  private scenarioData: any;
  private mapdata: any;
  errorMessage: string;
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
  private currencyMap: Map<string, string>;
  loginUserId: string = "%27E5E8339B-0620-4377-82FE-0008029EDC53%27";
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
  private sourceCurrencyMap: Map<string, string>;

  confirmBoxResetFlag: boolean = false;
  confirmBoxCloseFlag: boolean = false;
  private showRestBox: boolean;
  public sessionId: string;
  public userdata: any;
  public emailId: any;

  privilegesObject: any;
  public showSelectedOptionFlg: boolean = false;



  myData: any;
  public isISGUser: boolean = true;
  private dropDown: {
    "dropDown": any,
    "src_code": "string;"
  }
  private dropDowns: any[] = [];
  private saveMode: boolean = false;

  //these are used for storing dropdowns
  private yearDropdown: any[] = [];
  private group: any = [];
  private projects: any[] = [];
  private companies: any[] = [];
  private industries: any[] = [];
  private forbesVertical: any[] = [];
  private forbesSubVertical: any[] = [];
  private indexSourceCodeMap: any = {};
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

  //#ADM
  @ViewChild('ADMPer') ADMPerTag: ElementRef;

  //#AD
  @ViewChild('ADPer') ADPerTag: ElementRef;

  //#AM
  @ViewChild('AMPer') AMPerTag: ElementRef;


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
  isFormedFilled: boolean = false;

  scenarioId: string;
  errorMessageFinanceTowerBreakdown: string;
  errorMessageItOperationsHeadcountAndLocation: string;

  //ADM validation fields
  percOnshoreStartegyPlanning: any;
  percOnshoreEffortRequirement: any;
  percOnshoreEffortDesign: any;
  percOnshoreEffortCoding: any;
  percOnshoreEffortTesting: any;
  percOnshoreEffortImplement: any;
  percOnshoreEffortSustain: any;
  percOffshoreStartegyPlanning: any;
  percOffshoreEffortRequirement: any;
  percOffshoreEffortDesign: any;
  percOffshoreEffortCoding: any;
  percOffshoreEffortTesting: any;
  percOffshoreEffortImplement: any;
  percOffshoreEffortSustain: any;

  annualProjectHours: any;
  onShoreEmpProjectHours: any;
  offShoreEmpProjectHours: any;
  onShoreContractorProjectHours: any;
  offShoreContractorProjectHours: any;

  totalProjectsYear: any;
  totalOnBudgetProjects: any;
  totalOnTimeProjects: any;

  public sumOfonShoreOffshoreEfforts: any;
  public sumOfEmpContrProjectHours: any;
  public sumOnTimeBudgetProjects: any;



  //ADM validation variables
  public saasSpend: any;
  public erpSpend: any;
  public cotsSpend: any;
  public bespokeSpend: any;

  public sumOfSaasErpSpend: any;

  //AM validation fields
  public onShoreEmpMaintenance: any;
  public offShoreEmpMaintenance: any;
  public onShoreContractorMaintenance: any;
  public offShoreContractorMaintenance: any;

  public severity1: any;
  public severity2: any;
  public severity3: any;
  public severity4: any;

  public annualOnshoreOffshoreMaintenance: any;
  public sumOnshoreOffshoreMaintenance: any;
  public sumOfSeverity: any;

  public generalVar: boolean = false;
  public generalVar1: boolean = false;

  public emitter = new EventEmitter();

  isResetRequired: boolean = false;

  isBlack: boolean = true;
  isFinanceBreakdownBlack: boolean = true;
  isTowerBreakdownBlack: boolean = true;
  isITSpendBlack: boolean = true;
  isRunBlack: boolean = true;
  isCapitaBlank: boolean = true;

  loggedInUserInfo: any;

  public isInternal: string;
  private hasOnlyCompany: boolean;
  private singleCompany: any;

  appEmpOffshorePerc: number = 0;
  appContraOffshorePerc: number = 0;
  infraEmpOffshorePerc: number = 0;
  infraContraOffshorePerc: number = 0;
  managementEmpOffshorePerc: number = 0;
  managementContraOffshorePerc: number = 0;

  public totalefforts: any;

  //warning message flags
  public isADBlack: boolean = false;
  public ADMWarningMessage: boolean = false;
  public AMWarningMessage: boolean = false;

  public isADEffortsBlack: boolean = false;
  public isADDevHourssBlack: boolean = false;
  public AMHoursWarningMessage: boolean = false;
  public AMDefectsWarningMessage: boolean = false;

  //error messages
  public errorMessageADM: any;
  public errorMessageAD: any;
  public errorMessageAM: any;

  public errorMessageADEfforts: any;
  public errorMessageADDevHours: any;

  //condition fulfillment flags
  public ADConditionsFulfilled: boolean = true;
  public ADMOcnditionsFulfilled: boolean = true;
  public effortCondition: boolean = true;
  public projectHoursCondition: boolean = true;

  public ADEffortsConditionsFulfilled: boolean = true;
  public ADDevHoursConditionsFulfilled: boolean = true;
  public AMHoursConditionsFulfilled: boolean = true;
  public AMDefectsConditionsFulfilled: boolean = true;

  public onShoreEmpCondition: boolean = true;
  public offShoreEmpCondition: boolean = true;
  public onShoreContractorCondition: boolean = true;
  public offShoreContractorCondition: boolean = true;

  public onBudgetCondition: boolean = true;
  public onTimeCondition: boolean = true;

  public onShoreEmpMaintCondition: boolean = true;
  public offShoreEmpMaintCondition: boolean = true;
  public onShoreContractorMaintCondition: boolean = true;
  public offShoreContractorMaintCondition: boolean = true;

  public severityCondition: boolean = true;
  public isADMCostField: boolean = false;

  public errorMessageDefectSeverity: any;

  dropdownvalues: any[] = [];

  public EAD010: number;
  public EAD020: number;
  public EAD030: number;
  public EAM010: number;
  public EAM020: number;
  public EAM030: number;

  isDeleteAllowed: boolean = false;
  confirmBoxDeleteFlag: boolean = false;
  public isCopyEnabled: boolean = false;

  constructor(private generateScenarioService: GenerateScenarioService,
    private genericEnterCompare: EnterCompareDataTowersService,
    private http: HttpClient,
    private toastr: ToastrService,
    private generalTabService: AdmGeneraltabService,
    private applicationDevelopmentEditAndCompareSharedService: ApplicationDevelopmentEditAndCompareSharedService,
    private applicationDevelopmentInputMyDataSharedService: ApplicationDevelopmentInputMyDataSharedService,
    private loginDataBroadcastService: LoginDataBroadcastService,
    private privilegesService: PrivilegesService,
    private siblingData: SiblingDataService,
    private getScenarioDataService: GetScenarioDataService,
    private compiler: Compiler,
    private inputMyDataheaderSharedService: HeaderCompareEnterDataSharedService,
    private ADSharedService: ApplicationDevelopmentInputMyDataSharedService,
    private updateScenarioListNotificationServiceService: UpdateScenarioListNotificationServiceService) {


    let object = this;
    object.indexSrcCodeMap = new Map<string, number>();
    object.dataLoaded = false;
    object.genericEnterCompare.setPopID(12);
    object.errorMessage = "";
    object.errorMessage = "";
    object.isFormValid = true;
    object.disableSaveAndCompare = true;
    object.sourceCurrencyMap = new Map<string, string>();
    object.enableSaveAndCompareButton = true;
    object.selectedScanrio = 0;
    object.dashboardId = "1";
    object.activateShowBox(false);

    object.loggedInUserInfo = JSON.parse(localStorage.getItem('userloginInfo'));

    object.privilegesObject = object.privilegesService.getData();

    object.privilegesService.getEmitter().on('updatePrivileges', function () {
      object.privilegesObject = object.privilegesService.getData();
    });

    object.activateShowBox(false);
    let loginSharedData = object.loginDataBroadcastService.getEmitter();
    loginSharedData.on('setLoginData', function () {
      object.getUserLoginInfo();
    })

    object.inputMyDataheaderSharedService.getEmitter().on('showEnterDataTowerButton', function () {
      object.resetEnterFormTabular();
    });

    object.applicationDevelopmentEditAndCompareSharedService.getEmitter().on('applicationDevelopmentDataChange', function () {
      object.resetEnterFormTabular();

      let scenarioID = object.applicationDevelopmentEditAndCompareSharedService.getData().selectedScanrio;
      if (scenarioID == 0) {
        object.selectedScanrio = 0;
        object.scenarioNameText = "";
        object.resetAll();
      } else {
        object.selectedScanrio = scenarioID;
        object.getScenarioDataById();
      }
    })

    object.emitter.on('calculate', function () {
      if (object.generalVar && object.generalVar1)
        object.calculateGeneralPercentage();
    });

    //update scenariolist after deletion from compare modal
    updateScenarioListNotificationServiceService.getEmitter().on('updateADMScenarioListAfterDeletion', function(){
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

    let object = this;
    this.isDeleteAllowed = false;
    object.isCopyEnabled = false;
    object.dropdownvalues = ["Agile", "Hybrid", "None", "Waterfall", "Other"];
    object.getUserLoginInfo();
    this.siblingData.enterDataHeaderFlagMessage.subscribe(message => this.showSelectedOptionFlg = message);
    //this.getScenarioDataById();
    //);
    let sharedData = this.applicationDevelopmentEditAndCompareSharedService.getData();


    object.applicationDevelopmentEditAndCompareSharedService.getEmitter().on('applicationDevelopmentDataChange', function () {
      let scenarioID = object.applicationDevelopmentEditAndCompareSharedService.getData().selectedScanrio;

      if (scenarioID == 0) {
        object.selectedScanrio = 0;
        object.scenarioNameText = "";
        object.resetAll();
      } else {
        object.selectedScanrio = scenarioID;
        object.getScenarioDataById();
      }


    })
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
    this.validateADMData();
    this.validateADEffortsData();
    this.validateADHoursData();
    this.validateADOtherData();
    this.validateAMHoursData();
    this.validateAMDefectsData();

    this.isFormValid = true;
    //calculations

    this.calculatePercentage();
    this.calculateGeneralPercentage();
    this.isFormedFilled = false;



  }


  //Intercept dropdown changes in general tab
  interceptGeneralTabChanges(srcCode) {
    let object = this;
    object.activateShowBox(true);
    if (srcCode == "TD0110") {
      object.inputData.GENERALINFORMATION.NA[object.indexSrcCodeMap["TD0120"]].src_code_value = null;
      object.inputData.GENERALINFORMATION.NA[object.indexSrcCodeMap["TD0120"]].dropDown = [];

      object.getCountryByRegion(object.indexSrcCodeMap["TD0120"], object.inputData.GENERALINFORMATION.NA[object.indexSrcCodeMap["TD0110"]].src_code_value);
    }
    if (srcCode == "ICE002") {
      let value = object.inputData.GENERALINFORMATION.NA[object.indexSrcCodeMap["ICE002"]].src_code_value;
      
      object.changePlaceHolder(getCurrencySymbol(object.currencyMap[value], "narrow"));
    }
  }



  checkValidation() {
    let data = this.inputData;
    this.activateShowBox(true);
    let length = data.ApplicationDevelopmentInput.NA.length;
    this.errorMessage = "";
    this.isFormValid = true;
    let index = 0;
    let sum: number = 0;
    let value_format;
    let srcCodeValue;

    let requiredFilled = true;
    let arePercentageValid = true;

    while (index < length) {
      srcCodeValue = data.ApplicationDevelopmentInput.NA[index].src_code_value;
      let srcCode = data.ApplicationDevelopmentInput.NA[index].src_code;
      let indicator = data.ApplicationDevelopmentInput.NA[index].indicator;
      value_format = data.ApplicationDevelopmentInput.NA[index].value_format;
      if (value_format == "%" && srcCodeValue > 100) {
        this.isFormValid = false;
        arePercentageValid = false;
        this.errorMessage = "Percentage must be between 0 and 100"
      }
      if (indicator == 'R') {

        if (srcCodeValue == undefined || srcCodeValue == null || srcCodeValue.trim().length == 0) {
          this.isFormValid = false;
          this.errorMessage = "Please enter the required fields";
          requiredFilled = false;
        }
        ;
      }

      index++;
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
    // this.isCopyEnabled = this.isFormValid;

  }


  toggle() {
    this.showDiv = true;
  }


  //function that will populate year dropdown
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
    object.inputData.GENERALINFORMATION.NA[index].dropDown = yearDropDown;
    object.inputData.GENERALINFORMATION.NA[index].src_code_value = new Date().getFullYear();
  }
  //get all country by region
  getCountryByRegion(index, regionId) {
    let object = this;

    object.generalTabService.getCountriesByRegion(regionId).subscribe((response: any) => {
      object.inputData.GENERALINFORMATION.NA[index].dropDown = response.country;

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": this.pageId,
        "pageName": "Non CIO Service Desk Tower Input My Data Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });

  }


  prepareSourceCurrentMap() {

    let object = this;

    let index = 0;
    let length = object.inputData.ApplicationDevelopmentInput.NA.length;


    while (index < length) {
      object.sourceCurrencyMap[object.inputData.ApplicationDevelopmentInput.NA[index].src_code] = object.inputData.ApplicationDevelopmentInput.NA[index].value_format
      index++;
    }
  }

  //it will change placeholder acc to currency selected


  //this functions are made for validations
  OnADDataChangeChnage(event, companyInfo) {
    if (companyInfo.src_code == 'TDB200') {
      event.target.value = companyInfo.src_code_value;
    }


    this.calculatePercentage();
    //this.validateADData();
  }

  //on efforts change in AD
  OnADDataEffortsChnage(event, companyInfo) {
    this.calculatePercentage();
    this.validateADEffortsData();
  }

  //hours change
  OnADHoursChange(event, companyInfo) {
    this.calculatePercentage();
    this.validateADHoursData();
  }

  //others
  OnADOtherDataChange(event, companyInfo) {
    
    this.calculatePercentage();
    this.validateADOtherData();
  }


  //AD and AM cost change
  onADMCostChange(event, companyInfo) {
    let object = this;
    this.calculatePercentage();
    let data = object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentCosts;
    let AMData = object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts;
    // for(let index=0; index < data.length; index++){
    //   if(data[index].src_code_value == null || data[index].src_code_value == undefined || data[index].src_code_value == ''){
    //     data[index].src_code_value = 0;
    //   }
    // }

    // for(let index=0; index < AMData.length; index++){
    //   if(AMData[index].src_code_value == null || AMData[index].src_code_value == undefined || AMData[index].src_code_value == ''){
    //     AMData[index].src_code_value = 0;
    //   }
    // }

    //calculate total of ADM employee, contractors, tools and outsourcing cost and assign it to Annual application and manintenance cost(AMR110=DAD150+DAD155+DAD165+DAD170+DAM150+DAM155+DAM165+DAM170)
    for (let i = 0; i < object.myData.ApplicationDevelopmentandMaintenanceInput.NA.length; i++) {
      if (object.myData.ApplicationDevelopmentandMaintenanceInput.NA[i].src_code == "AMR110") {
        if (data[0].src_code_value == null
          && data[1].src_code_value == null
          && data[2].src_code_value == null
          && data[3].src_code_value == null
          && AMData[0].src_code_value == null
          && AMData[1].src_code_value == null
          && AMData[2].src_code_value == null
          && AMData[3].src_code_value == null) {
          object.myData.ApplicationDevelopmentandMaintenanceInput.NA[i].src_code_value = null
        }
        else {
          var data1;
          var data2;
          var data3;
          var data4;
          var data5;
          var data6;
          var data7;
          var data8;

          if (data[0].src_code_value != null) {
            data1 = object.unmaskComma(data[0].src_code_value);
          }
          else {
            data1 = null;
          }
          if (data[1].src_code_value != null) {
            data2 = object.unmaskComma(data[1].src_code_value);
          }
          else {
            data2 = null;
          }
          if (data[2].src_code_value != null) {
            data3 = object.unmaskComma(data[2].src_code_value);
          }
          else {
            data3 = null;
          }
          if (data[3].src_code_value != null) {
            data4 = object.unmaskComma(data[3].src_code_value);
          }
          else {
            data4 = null;
          }
          if (AMData[0].src_code_value != null) {
            data5 = object.unmaskComma(AMData[0].src_code_value);
          }
          else {
            data5 = null;
          }
          if (AMData[1].src_code_value != null) {
            data6 = object.unmaskComma(AMData[1].src_code_value);
          }
          else {
            data6 = null;
          }
          if (AMData[2].src_code_value != null) {
            data7 = object.unmaskComma(AMData[2].src_code_value);
          }
          else {
            data7 = null;
          }
          if (AMData[3].src_code_value != null) {
            data8 = object.unmaskComma(AMData[3].src_code_value);
          }
          else {
            data8 = null;
          }
          
          object.myData.ApplicationDevelopmentandMaintenanceInput.NA[i].src_code_value = Number(data1) + Number(data2) + Number(data3) + Number(data4) + Number(data5) + Number(data6) + Number(data7) + Number(data8);

          
        }

      }



    }


  }



  onADMFTEChange(event, companyInfo) {
    let object = this;
    this.calculatePercentage();
    let ADFTEData = object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs;
    let AMFTEData = object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs;

    for (let i = 0; i < ADFTEData.length; i++) {
      if (ADFTEData[i].src_code == "EAD010") {
        object.EAD010 = ADFTEData[i].src_code_value;
      }
      if (ADFTEData[i].src_code == "EAD020") {
        object.EAD020 = ADFTEData[i].src_code_value;
      }
      if (ADFTEData[i].src_code == "EAD030") {
        object.EAD030 = ADFTEData[i].src_code_value;
      }
    }

    for (let i = 0; i < AMFTEData.length; i++) {
      if (AMFTEData[i].src_code == "EAM010") {
        object.EAM010 = AMFTEData[i].src_code_value;
      }
      if (AMFTEData[i].src_code == "EAM020") {
        object.EAM020 = AMFTEData[i].src_code_value;
      }
      if (AMFTEData[i].src_code == "EAM030") {
        object.EAM030 = AMFTEData[i].src_code_value;
      }
    }




    for (let i = 0; i < object.myData.ApplicationDevelopmentandMaintenanceInput.NA.length; i++) {
      if (object.myData.ApplicationDevelopmentandMaintenanceInput.NA[i].src_code == "EXA010") {
        if (object.EAD010 == null && object.EAM010 == null) {
          object.myData.ApplicationDevelopmentandMaintenanceInput.NA[i].src_code_value = null;
        } else {
          var data1;
          var data2;
          if (object.EAD010 == null) {
            data1 = null;
          }
          else {
            data1 = object.unmaskComma(object.EAD010);
          }
          if (object.EAM010 == null) {
            data2 = null;
          }
          else {
            data2 = object.unmaskComma(object.EAM010);
          }

          object.myData.ApplicationDevelopmentandMaintenanceInput.NA[i].src_code_value = (Number(data1)) + (Number(data2));
        }

      }
      if (object.myData.ApplicationDevelopmentandMaintenanceInput.NA[i].src_code == "EXA020") {
        if (object.EAD020 == null && object.EAM020 == null) {
          object.myData.ApplicationDevelopmentandMaintenanceInput.NA[i].src_code_value = null;
        } else {
          var data1;
          var data2;
          if (object.EAD020 == null) {
            data1 = null;
          }
          else {
            data1 = object.unmaskComma(object.EAD020);
          }
          if (object.EAM020 == null) {
            data2 = null;
          }
          else {
            data2 = object.unmaskComma(object.EAM020);
          }

          object.myData.ApplicationDevelopmentandMaintenanceInput.NA[i].src_code_value = (Number(data1)) + (Number(data2));
        }
      }
      if (object.myData.ApplicationDevelopmentandMaintenanceInput.NA[i].src_code == "EXA030") {
        if (object.EAD030 == null && object.EAM030 == null) {
          object.myData.ApplicationDevelopmentandMaintenanceInput.NA[i].src_code_value = null;
        } else {

          var data1;
          var data2;

          if (object.EAD030 == null) {
            data1 = null;
          }
          else {
            data1 = object.unmaskComma(object.EAD030);
          }

          if (object.EAM030 == null) {
            data2 = null;
          }
          else {
            data2 = object.unmaskComma(object.EAM030);
          }

          
          object.myData.ApplicationDevelopmentandMaintenanceInput.NA[i].src_code_value = (Number(data1)) + (Number(data2));
        }
      }
    }

  }
  //AM
  OnAMHoursDataChange(event, companyInfo) {
    this.calculatePercentage();
    this.validateAMHoursData();
  }

  OnAMDefectsDataChangeChnage(event, companyInfo) {
    this.calculatePercentage();
    this.validateAMDefectsData();
  }

  onFinanceDataChange(event: any) {

    let object = this;
    object.calculatePercentage();

    // let _self = this;

    //  object.totalannualSpend = object.myData.ApplicationMaintenanceandSupportInput.ITFinancialData[0].src_code_value;

    //   //if nothing is entered in IT financial breakdown, do not call validation on it
    //   //appending dynamic values

    //   let ITOperationsSpendingBreakDown=true;

    //   object.myData.ApplicationMaintenanceandSupportInput.ITFinancialDataBreakdown.forEach(element => {
    //     if(element.src_code_value != null){
    //       ITOperationsSpendingBreakDown=false;
    //     }

    //   });


    //  if(object.totalannualSpend>=0 && ITOperationsSpendingBreakDown!=true)
    //  {
    //   object.validateADMData();
    //  }

  };

  validateFinanceBreakDownOnChange(event: any) {
    this.calculatePercentage();

    this.validateADMData();
  };

  onFinanceBreakTower(event: any) {
    this.calculatePercentage();
  };

  ITspendingTypeChange(event: any) {
    this.calculatePercentage();

  };

  RunChangeTransform(event: any) {
    this.calculatePercentage();

  };

  capitalChange(event: any) {
    this.calculatePercentage();
  };

  OnOutsourcedChanged(event: any) {
    this.calculatePercentage();
    //   this.validateOutsorced();
  }

  onADMDataChange(event: any) {
    this.calculatePercentage();
    //this.validateUsersAndLocations();
    //this.validateTotalHeadcount();
    this.validateADMData();
  }

  validateUsersAndLocationsOnChange(event: any) {
    this.calculatePercentage();
    //this.validateUsersAndLocations();
  };

  OnTotalHeadcountChange(event: any) {
    this.calculatePercentage();
    //this.validateTotalHeadcount();
  }

  ITOperationsHeadcountChange(event: any) {
    this.calculatePercentage();
    //this.validateItOperationsHeadcountAndLocations();
  };

  validateADOtherData() {
    let object = this;


    object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes.forEach(element => {
      if (element.src_code == "ADR300") {
        if (element.src_code_value == null) {
          object.totalProjectsYear = null;
        }
        else {
          object.totalProjectsYear = this.unmaskComma(element.src_code_value);//Number(element.src_code_value);
        }
        
      }
      else if (element.src_code == "P21055") {
        if (element.src_code_value == null) {
          object.totalOnTimeProjects = null;
        }
        else {
          object.totalOnTimeProjects = this.unmaskComma(element.src_code_value); //Number(element.src_code_value);
        }
        
      }
      else if (element.src_code == "P21085") {
        if (element.src_code_value == null) {
          object.totalOnBudgetProjects = null;
        }
        else {
          object.totalOnBudgetProjects = this.unmaskComma(element.src_code_value); //Number(element.src_code_value);
        }
        
      }

    });




    //var hundred = 100;

    if (null == object.totalOnTimeProjects
      && null == object.totalOnBudgetProjects
    ) {
      object.sumOnTimeBudgetProjects = undefined;
    } else {
      object.sumOnTimeBudgetProjects = Number(object.totalOnTimeProjects)
        + Number(object.totalOnBudgetProjects);
    }

    
    //validation rules for on time on budget fields

    //all blank
    if (object.totalOnTimeProjects == null && object.totalProjectsYear == null && object.totalOnBudgetProjects == null) {
      
      object.onTimeCondition = true;
      object.onBudgetCondition = true;
      object.isADBlack = false;
    }
    else if (((Number(object.totalOnTimeProjects) <= Number(object.totalProjectsYear)))
      //&&(object.onTimeCondition==true)

      && Number(object.totalOnTimeProjects) > 0 && object.onBudgetCondition == true) {

      
      object.onTimeCondition = true;


      object.ADConditionsFulfilled = true;
      object.isADBlack = false;


    }

    else if (((Number(object.totalOnTimeProjects) > Number(object.totalProjectsYear)))

      //&&(object.onTimeCondition==false && object.onBudgetCondition==true)
      && Number(object.totalOnTimeProjects) > 0 && object.onBudgetCondition == true) {
      object.isADBlack = false;
      object.isFormValid = false;
      object.onTimeCondition = false;
      
      object.errorMessageAD = "Projects completed on-time cannot exceed the number of completed projects.";
      object.ADConditionsFulfilled = false;
      

    }


    if ((Number((object.totalOnBudgetProjects) <= Number(object.totalProjectsYear)))
      //&&(object.onTimeCondition==false && object.onBudgetCondition==true)
      && Number(object.totalOnBudgetProjects) > 0 && object.onTimeCondition == true) {

      object.onBudgetCondition = true;

      object.ADConditionsFulfilled = true;
      object.isADBlack = false;

    }

    else if (((Number(object.totalOnBudgetProjects) > Number(object.totalProjectsYear))
      //&&(object.onTimeCondition==true && object.onBudgetCondition==false)
      && Number(object.totalOnBudgetProjects) > 0) && object.onTimeCondition == true) {
      object.isADBlack = false;
      object.isFormValid = false;
      object.onBudgetCondition = false;
      object.errorMessageAD = "Projects completed on-budget cannot exceed the number of completed projects.";
      object.ADConditionsFulfilled = false;
    }

    else if (object.onTimeCondition == true && object.onBudgetCondition == true) {
      //validation rules for project hours
      //Onshore employee development hours cannot exceed the number of actual project hours.
      object.ADConditionsFulfilled = true;
      object.isADBlack = false;


    }

    else {
      //blank
      if (Number(object.totalOnBudgetProjects) == 0
        && Number(object.totalOnBudgetProjects) == 0
        && Number(object.totalProjectsYear) == 0) {

        object.onShoreEmpCondition = true;

        object.ADConditionsFulfilled = true;
        object.isADBlack = false;


      }
    }



    //form level validation check
    object.validateEntireForm();



    object.calculatePercentage();
  }

  validateADEffortsData() {
    let object = this;

    object.myData.ApplicationDevelopmentInput.Projecteffortsallocation.forEach(element => {


      if (element.src_code == "P1R250") {
        if (element.src_code_value == null || element.src_code_value == '') {
          object.percOnshoreStartegyPlanning = null;
        }
        else {
          object.percOnshoreStartegyPlanning = object.unmaskComma(element.src_code_value); //Number(element.src_code_value);
        }

        
      }
      else if (element.src_code == "P1R255") {
        if (element.src_code_value == null || element.src_code_value == '') {
          object.percOnshoreEffortRequirement = null;
        }
        else {
          object.percOnshoreEffortRequirement = object.unmaskComma(element.src_code_value);//Number(element.src_code_value);
        }
        
      }
      else if (element.src_code == "P1R260") {
        if (element.src_code_value == null || element.src_code_value == '') {
          object.percOnshoreEffortDesign = null;
        }
        else {
          object.percOnshoreEffortDesign = object.unmaskComma(element.src_code_value);//Number(element.src_code_value);
        }
        
      }
      else if (element.src_code == "P1R265") {
        if (element.src_code_value == null || element.src_code_value == '') {
          object.percOnshoreEffortCoding = null;
        }
        else {
          object.percOnshoreEffortCoding = object.unmaskComma(element.src_code_value);//Number(element.src_code_value);
        }
        
      }
      else if (element.src_code == "P1R270") {
        if (element.src_code_value == null || element.src_code_value == '') {
          object.percOnshoreEffortTesting = null;
        }
        else {
          object.percOnshoreEffortTesting = object.unmaskComma(element.src_code_value); //Number(element.src_code_value);
        }
        
      }
      else if (element.src_code == "P1R275") {
        if (element.src_code_value == null || element.src_code_value == '') {
          object.percOnshoreEffortImplement = null;
        }
        else {
          object.percOnshoreEffortImplement = object.unmaskComma(element.src_code_value);//Number(element.src_code_value);
        }
        
      }
      else if (element.src_code == "P1R280") {
        if (element.src_code_value == null || element.src_code_value == '') {
          object.percOnshoreEffortSustain = null;
        }
        else {
          object.percOnshoreEffortSustain = object.unmaskComma(element.src_code_value); //Number(element.src_code_value);
        }
        
      }
      else if (element.src_code == "P1R251") {
        if (element.src_code_value == null || element.src_code_value == '') {
          object.percOffshoreStartegyPlanning = null;
        }
        else {
          object.percOffshoreStartegyPlanning = object.unmaskComma(element.src_code_value); //Number(element.src_code_value);
        }
        
      }
      else if (element.src_code == "P1R256") {
        if (element.src_code_value == null || element.src_code_value == '') {
          object.percOffshoreEffortRequirement = null;
        }
        else {
          object.percOffshoreEffortRequirement = object.unmaskComma(element.src_code_value); //Number(element.src_code_value);
        }
        
      }
      else if (element.src_code == "P1R261") {
        if (element.src_code_value == null || element.src_code_value == '') {
          object.percOffshoreEffortDesign = null;
        }
        else {
          object.percOffshoreEffortDesign = object.unmaskComma(element.src_code_value);//Number(element.src_code_value);
        }
        
      }
      else if (element.src_code == "P1R266") {
        if (element.src_code_value == null || element.src_code_value == '') {
          object.percOffshoreEffortCoding = null;
        }
        else {
          object.percOffshoreEffortCoding = object.unmaskComma(element.src_code_value); //Number(element.src_code_value);
        }
        
      }
      else if (element.src_code == "P1R271") {
        if (element.src_code_value == null || element.src_code_value == '') {
          object.percOffshoreEffortTesting = null;
        }
        else {
          object.percOffshoreEffortTesting = object.unmaskComma(element.src_code_value); //Number(element.src_code_value);
        }
        
      }
      else if (element.src_code == "P1R276") {
        if (element.src_code_value == null || element.src_code_value == '') {
          object.percOffshoreEffortImplement = null;
        }
        else {
          object.percOffshoreEffortImplement = object.unmaskComma(element.src_code_value); //Number(element.src_code_value);
        }
        
      }
      else if (element.src_code == "P1R281") {
        
        if (element.src_code_value == null || element.src_code_value == '') {
          
          object.percOffshoreEffortSustain = null;
        }
        else {
          object.percOffshoreEffortSustain = object.unmaskComma(element.src_code_value); //Number(element.src_code_value);
          
        }
        
      }


    });

    if (null == object.percOnshoreStartegyPlanning
      && null == object.percOnshoreEffortRequirement
      && null == object.percOnshoreEffortDesign
      && null == object.percOnshoreEffortCoding
      && null == object.percOnshoreEffortTesting
      && null == object.percOnshoreEffortImplement
      && null == object.percOnshoreEffortSustain
      && null == object.percOffshoreStartegyPlanning
      && null == object.percOffshoreEffortRequirement
      && null == object.percOffshoreEffortDesign
      && null == object.percOffshoreEffortCoding
      && null == object.percOffshoreEffortTesting
      && null == object.percOffshoreEffortImplement
      && null == object.percOffshoreEffortSustain
    ) {
      object.sumOfonShoreOffshoreEfforts = undefined;
    } else {
      object.sumOfonShoreOffshoreEfforts = Number(object.percOnshoreStartegyPlanning)
        + Number(object.percOnshoreEffortRequirement)
        + Number(object.percOnshoreEffortDesign)
        + Number(object.percOnshoreEffortCoding)
        + Number(object.percOnshoreEffortTesting)
        + Number(object.percOnshoreEffortImplement)
        + Number(object.percOnshoreEffortSustain)
        + Number(object.percOffshoreStartegyPlanning)
        + Number(object.percOffshoreEffortRequirement)
        + Number(object.percOffshoreEffortDesign)
        + Number(object.percOffshoreEffortCoding)
        + Number(object.percOffshoreEffortTesting)
        + Number(object.percOffshoreEffortImplement)
        + Number(object.percOffshoreEffortSustain);
    }

    object.errorMessageADEfforts = "";

    object.totalefforts = Number(object.sumOfonShoreOffshoreEfforts);
    var hundred = 100;

    
    //if all 0s are entered and sum is not 100
    if ((object.totalefforts.toFixed(6) != hundred.toFixed(6))
      && ((object.percOnshoreEffortRequirement == 0
        && object.percOnshoreEffortDesign == 0
        && object.percOnshoreEffortCoding == 0
        && object.percOnshoreEffortTesting == 0
        && object.percOnshoreEffortImplement == 0
        && object.percOnshoreEffortSustain == 0
        && object.percOffshoreStartegyPlanning == 0
        && object.percOffshoreEffortRequirement == 0
        && object.percOffshoreEffortDesign == 0
        && object.percOffshoreEffortCoding == 0
        && object.percOffshoreEffortTesting == 0
        && object.percOffshoreEffortImplement == 0
        && object.percOffshoreEffortSustain == 0
        && object.percOnshoreStartegyPlanning == 0)
      )) {
      
      object.isADEffortsBlack = false;
      object.isFormValid = false;
      object.errorMessageADEfforts = 'The Annual Project Effort Allocation entries below equal ' + object.totalefforts + '%, all entries must equal 100%. Please revise to continue.';
      //"The sum of percentages for onshore and offshore effort by development activity must equal 100%.";
      object.ADEffortsConditionsFulfilled = false;

    }

    //if sum is matched 

    //if form is partially filled but sum matches, show blue error message
    else if ((object.totalefforts.toFixed(6) == hundred.toFixed(6))
      && ((object.percOnshoreEffortRequirement == null
        || object.percOnshoreEffortDesign == null
        || object.percOnshoreEffortCoding == null
        || object.percOnshoreEffortTesting == null
        || object.percOnshoreEffortImplement == null
        || object.percOnshoreEffortSustain == null
        || object.percOffshoreStartegyPlanning == null
        || object.percOffshoreEffortRequirement == null
        || object.percOffshoreEffortDesign == null
        || object.percOffshoreEffortCoding == null
        || object.percOffshoreEffortTesting == null
        || object.percOffshoreEffortImplement == null
        || object.percOffshoreEffortSustain == null
        || object.percOnshoreStartegyPlanning == null))) {
      
      object.isADEffortsBlack = true;
      object.isFormValid = false;
      object.errorMessageADEfforts = "The entries for Annual Project Effort Allocation must equal 100%, and all cells require a value. If there is no value for a cell, please enter zero to continue.";
      //"The sum of percentages for onshore and offshore effort by development activity must equal 100%.";
      object.ADEffortsConditionsFulfilled = false;
    }
    //in case of efforts sum is equal to 100
    else if ((object.totalefforts.toFixed(6) == hundred.toFixed(6))) {
      object.isADEffortsBlack = false;
      object.ADEffortsConditionsFulfilled = true;


    } else if ((object.totalefforts.toFixed(6) != hundred.toFixed(6))
      && ((object.percOnshoreEffortRequirement == null
        || object.percOnshoreEffortDesign == null
        || object.percOnshoreEffortCoding == null
        || object.percOnshoreEffortTesting == null
        || object.percOnshoreEffortImplement == null
        || object.percOnshoreEffortSustain == null
        || object.percOffshoreStartegyPlanning == null
        || object.percOffshoreEffortRequirement == null
        || object.percOffshoreEffortDesign == null
        || object.percOffshoreEffortCoding == null
        || object.percOffshoreEffortTesting == null
        || object.percOffshoreEffortImplement == null
        || object.percOffshoreEffortSustain == null
        || object.percOnshoreStartegyPlanning == null))
      && object.totalefforts >= 0) {

      object.isADEffortsBlack = true;
      object.isFormValid = false;
      object.errorMessageADEfforts = 'The Annual Project Effort Allocation entries below equal ' + object.totalefforts + '%, all entries must equal 100%. Please revise to continue.';
      //"The sum of percentages for onshore and offshore effort by development activity must equal 100%.";
      object.ADEffortsConditionsFulfilled = false;
      

    } else if ((object.totalefforts.toFixed(6) != hundred.toFixed(6))
      && (
        (object.percOnshoreEffortRequirement == null
          && object.percOnshoreEffortDesign == null
          && object.percOnshoreEffortCoding == null
          && object.percOnshoreEffortTesting == null
          && object.percOnshoreEffortImplement == null
          && object.percOnshoreEffortSustain == null
          && object.percOffshoreStartegyPlanning == null
          && object.percOffshoreEffortRequirement == null
          && object.percOffshoreEffortDesign == null
          && object.percOffshoreEffortCoding == null
          && object.percOffshoreEffortTesting == null
          && object.percOffshoreEffortImplement == null
          && object.percOffshoreEffortSustain == null
          && object.percOnshoreStartegyPlanning == null))) {
      
      object.isADEffortsBlack = false;
      object.ADEffortsConditionsFulfilled = true;
    }
    else if ((object.totalefforts.toFixed(6) != hundred.toFixed(6))
      && ((object.percOnshoreEffortRequirement != null
        && object.percOnshoreEffortDesign != null
        && object.percOnshoreEffortCoding != null
        && object.percOnshoreEffortTesting != null
        && object.percOnshoreEffortImplement != null
        && object.percOnshoreEffortSustain != null
        && object.percOffshoreStartegyPlanning != null
        && object.percOffshoreEffortRequirement != null
        && object.percOffshoreEffortDesign != null
        && object.percOffshoreEffortCoding != null
        && object.percOffshoreEffortTesting != null
        && object.percOffshoreEffortImplement != null
        && object.percOffshoreEffortSustain != null
        && object.percOnshoreStartegyPlanning != null)) && object.totalefforts > 0) {
      
      object.isADEffortsBlack = false;
      object.isFormValid = false;
      object.errorMessageADEfforts = 'The Annual Project Effort Allocation entries below equal ' + object.totalefforts + '%, all entries must equal 100%. Please revise to continue.';
      //"The sum of percentages for onshore and offshore effort by development activity must equal 100%.";
      object.ADEffortsConditionsFulfilled = false;

    }

    object.validateEntireForm();

    object.calculatePercentage();


  }

  validateADHoursData() {
    let object = this;

    object.errorMessageADDevHours = "";

    object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours.forEach(element => {
      if (element.src_code == "P21090") {
        if (element.src_code_value == '' || element.src_code_value == null) {
          object.annualProjectHours = null;
        }
        else {
          object.annualProjectHours = this.unmaskComma(element.src_code_value);//Number(element.src_code_value);
        }
      }
      else if (element.src_code == "P51000") {
        if (element.src_code_value == '' || element.src_code_value == null) {
          object.onShoreEmpProjectHours = null;
        }
        else {
          object.onShoreEmpProjectHours = this.unmaskComma(element.src_code_value);//Number(element.src_code_value);
        }
      }
      else if (element.src_code == "P51005") {
        if (element.src_code_value == '' || element.src_code_value == null) {
          object.offShoreEmpProjectHours = null;
        }
        else {
          object.offShoreEmpProjectHours = this.unmaskComma(element.src_code_value);//Number(element.src_code_value);
        }
      }
      else if (element.src_code == "P51020") {
        if (element.src_code_value == '' || element.src_code_value == null) {
          object.onShoreContractorProjectHours = null;
        }
        else {
          object.onShoreContractorProjectHours = this.unmaskComma(element.src_code_value);//Number(element.src_code_value);
        }
      }
      else if (element.src_code == "P51025") {
        if (element.src_code_value == '' || element.src_code_value == null) {
          object.offShoreContractorProjectHours = null;
        }
        else {
          object.offShoreContractorProjectHours = this.unmaskComma(element.src_code_value); //Number(element.src_code_value);

        }
      }

    });

    

    if (object.onShoreEmpProjectHours == null
      && object.offShoreEmpProjectHours == null
      && object.onShoreContractorProjectHours == null
      && object.offShoreContractorProjectHours == null
      && object.annualProjectHours == null
    ) {
      object.sumOfEmpContrProjectHours = undefined;
    } else {
      object.sumOfEmpContrProjectHours = Number(object.onShoreEmpProjectHours)
        + Number(object.offShoreEmpProjectHours)
        + Number(object.onShoreContractorProjectHours)
        + Number(object.offShoreContractorProjectHours);
    }

    var hundred = 100;

    if (Number(object.onShoreEmpProjectHours).toFixed(6) > Number(object.annualProjectHours).toFixed(6)
      && (object.onShoreEmpCondition == false
        && object.offShoreEmpCondition == false
        && object.onShoreContractorCondition == false
        && object.offShoreContractorCondition == false)) {
      object.isADDevHourssBlack = false;
      object.isFormValid = false;
      object.errorMessageADDevHours = "Onshore employee development hours cannot exceed the number of actual project hours.";
      object.ADDevHoursConditionsFulfilled = false;

    }
    //Offshore employee development hours cannot exceed the number of actual project hours.
    else if ((Number(object.offShoreEmpProjectHours).toFixed(6) <= Number(object.annualProjectHours).toFixed(6))
      && (object.onShoreEmpCondition == false
        && object.offShoreEmpCondition == true
        && object.onShoreContractorCondition == false
        && object.offShoreContractorCondition == false)) {
      object.isADDevHourssBlack = false;
      object.ADDevHoursConditionsFulfilled = true;
      object.offShoreEmpCondition = true;
      //object.offShoreEmpCondition=true;

    }
    else if (Number(object.offShoreEmpProjectHours).toFixed(6) > Number(object.annualProjectHours).toFixed(6)
      && (object.onShoreEmpCondition == false
        && object.offShoreEmpCondition == false
        && object.onShoreContractorCondition == false
        && object.offShoreContractorCondition == false)) {
      object.isADDevHourssBlack = false;
      object.isFormValid = false;
      object.errorMessageADDevHours = "Offshore employee development hours cannot exceed the number of actual project hours.";
      object.ADDevHoursConditionsFulfilled = false;

    }

    //Onshore contractor development hours cannot exceed the number of actual project hours.
    else if ((Number(object.onShoreContractorProjectHours).toFixed(6) <= Number(object.annualProjectHours).toFixed(6))
      && (object.onShoreEmpCondition == false
        && object.offShoreEmpCondition == false
        && object.onShoreContractorCondition == true
        && object.offShoreContractorCondition == false)) {
      //object.isADBlack = false;
      object.onShoreContractorCondition = true;
      object.ADDevHoursConditionsFulfilled = true;
      object.isADDevHourssBlack = false;

    }
    else if (Number(object.onShoreContractorProjectHours).toFixed(6) > Number(object.annualProjectHours).toFixed(6)
      && (object.onShoreEmpCondition == false
        && object.offShoreEmpCondition == false
        && object.onShoreContractorCondition == false
        && object.offShoreContractorCondition == false)) {
      object.isADDevHourssBlack = false;
      object.isFormValid = false;
      object.errorMessageADDevHours = "Onshore contractor development hours cannot exceed the number of actual project hours.";
      object.ADDevHoursConditionsFulfilled = false;

    }

    //offshore contractor development hours cannot exceed the number of actual project hours.
    if ((Number(object.offShoreContractorProjectHours).toFixed(6) <= Number(object.annualProjectHours).toFixed(6))
      && (object.onShoreEmpCondition == false
        && object.offShoreEmpCondition == false
        && object.onShoreContractorCondition == false
        && object.offShoreContractorCondition == true)) {
      //object.isADBlack = false;
      //object.ADConditionsFulfilled = true;
      object.offShoreContractorCondition = true;
      object.ADDevHoursConditionsFulfilled = true;
      object.isADDevHourssBlack = false;

    }

    else if (Number(object.offShoreContractorProjectHours).toFixed(6) > Number(object.annualProjectHours).toFixed(6)
      && (object.onShoreEmpCondition == false
        && object.offShoreEmpCondition == false
        && object.onShoreContractorCondition == false
        && object.offShoreContractorCondition == false)) {
      object.isADDevHourssBlack = false;
      object.isFormValid = false;
      object.errorMessageADDevHours = "Offshore contractor development hours cannot exceed the number of actual project hours.";
      object.ADDevHoursConditionsFulfilled = false;

    }
    else if (
      (Number(object.sumOfEmpContrProjectHours).toFixed(6) == Number(object.annualProjectHours).toFixed(6))
      && Number(object.sumOfEmpContrProjectHours) > 0
      && object.onShoreEmpProjectHours != null
      && object.offShoreEmpProjectHours != null
      && object.onShoreContractorProjectHours != null
      && object.offShoreContractorProjectHours != null
      && object.annualProjectHours != null) {
      object.ADDevHoursConditionsFulfilled = true;
      object.isADDevHourssBlack = false;

    }

    //blank form, no error
    else if (

      object.onShoreEmpProjectHours == null
      && object.offShoreEmpProjectHours == null
      && object.onShoreContractorProjectHours == null
      && object.offShoreContractorProjectHours == null
      && object.annualProjectHours == null
    ) {
      
      object.ADDevHoursConditionsFulfilled = true;
      object.isADDevHourssBlack = false;

    }

    //all o and total entered is different, show red error message
    else if (
      (Number(object.sumOfEmpContrProjectHours).toFixed(6) != Number(object.annualProjectHours).toFixed(6))
      && object.onShoreEmpProjectHours == 0
      && object.offShoreEmpProjectHours == 0
      && object.onShoreContractorProjectHours == 0
      && object.offShoreContractorProjectHours == 0
    ) {
      
      object.ADDevHoursConditionsFulfilled = false;
      object.isADDevHourssBlack = false;
      object.isFormValid = false;
      object.errorMessageADDevHours = "The entries for Annual Onshore and Offshore hours (top four cells) is: " + object.sumOfEmpContrProjectHours + " it must equal the # of Project hours for the year which is: " + object.annualProjectHours;
      //"The sum of development hours for employees and contractors (onshore and offshore) must equal the number of actual project hours.";

    }

    //sum matches but fields are blank
    else if (
      (Number(object.sumOfEmpContrProjectHours).toFixed(6) == Number(object.annualProjectHours).toFixed(6))
      &&
      (object.onShoreEmpProjectHours == null
        || object.offShoreEmpProjectHours == null
        || object.onShoreContractorProjectHours == null
        || object.offShoreContractorProjectHours == null
      )) {
      
      object.ADDevHoursConditionsFulfilled = false;
      object.isADDevHourssBlack = true;
      object.isFormValid = false;
      object.errorMessageADDevHours = "The entries equal the total number of hours for # of Project hours for the year: "+object.annualProjectHours+", however all cells require a value. If there is no value for a cell, please enter zero to continue."
      //"The sum of development hours for employees and contractors (onshore and offshore) must equal the number of actual project hours.";

    }

    //all 0 entered and last cell is blank
    else if (
      object.annualProjectHours == null
      &&
      (object.onShoreEmpProjectHours == 0
        && object.offShoreEmpProjectHours == 0
        && object.onShoreContractorProjectHours == 0
        && object.offShoreContractorProjectHours == 0
      )) {
      
      object.ADDevHoursConditionsFulfilled = false;
      object.isADDevHourssBlack = true;
      object.isFormValid = false;
      object.errorMessageADDevHours = "The entries equal the total number of hours for # of Project hours for the year: "+object.annualProjectHours+", however all cells require a value. If there is no value for a cell, please enter zero to continue."
      //"The sum of development hours for employees and contractors (onshore and offshore) must equal the number of actual project hours.";

    }

    //combination of 0, last cell null and numbers
    else if (
      object.annualProjectHours == null
      && Number(object.sumOfEmpContrProjectHours) > 0
      &&
      (object.onShoreEmpProjectHours == 0
        || object.offShoreEmpProjectHours == 0
        || object.onShoreContractorProjectHours == 0
        || object.offShoreContractorProjectHours == 0
      )) {
      
      object.ADDevHoursConditionsFulfilled = false;
      object.isADDevHourssBlack = true;
      object.isFormValid = false;
      object.errorMessageADDevHours = "The entries for Annual Onshore and Offshore hours (top four cells) is: " + object.sumOfEmpContrProjectHours + " it must equal the # of Project hours for the year which is: " + object.annualProjectHours;
      //"The sum of development hours for employees and contractors (onshore and offshore) must equal the number of actual project hours.";

    }

    //value entered in last cell show warning
    else if (
      (Number(object.sumOfEmpContrProjectHours).toFixed(6) != Number(object.annualProjectHours).toFixed(6))
      && object.onShoreEmpProjectHours == null
      && object.offShoreEmpProjectHours == null
      && object.onShoreContractorProjectHours == null
      && object.offShoreContractorProjectHours == null
    ) {
      
      object.ADDevHoursConditionsFulfilled = false;
      object.isADDevHourssBlack = true;
      object.isFormValid = false;
      object.errorMessageADDevHours = "The entries for Annual Onshore and Offshore hours (top four cells) is: " + object.sumOfEmpContrProjectHours + " it must equal the # of Project hours for the year which is: " + object.annualProjectHours;
      //"The sum of development hours for employees and contractors (onshore and offshore) must equal the number of actual project hours.";

    }

    //if all 4 fields entered and last field is null
    else if (
      (Number(object.sumOfEmpContrProjectHours).toFixed(6) != Number(object.annualProjectHours).toFixed(6))
      && object.onShoreEmpProjectHours != null
      && object.offShoreEmpProjectHours != null
      && object.onShoreContractorProjectHours != null
      && object.offShoreContractorProjectHours != null
      && object.annualProjectHours == null
    ) {
      
      object.ADDevHoursConditionsFulfilled = false;
      object.isADDevHourssBlack = true;
      object.isFormValid = false;
      object.errorMessageADDevHours = "The entries for Annual Onshore and Offshore hours (top four cells) is: " + object.sumOfEmpContrProjectHours + " it must equal the # of Project hours for the year which is: " + object.annualProjectHours;
      //"The sum of development hours for employees and contractors (onshore and offshore) must equal the number of actual project hours.";

    }
    //if form is partially filled and 0 is entered somewhere, show red error message
    else if (
      (Number(object.sumOfEmpContrProjectHours).toFixed(6) != Number(object.annualProjectHours).toFixed(6))
      && object.onShoreEmpProjectHours != null
      && object.offShoreEmpProjectHours != null
      && object.onShoreContractorProjectHours != null
      && object.offShoreContractorProjectHours != null
      && object.annualProjectHours != null
    ) {
      
      object.ADDevHoursConditionsFulfilled = false;
      object.isADDevHourssBlack = false;
      object.isFormValid = false;
      object.errorMessageADDevHours = "The entries for Annual Onshore and Offshore hours (top four cells) is: " + object.sumOfEmpContrProjectHours + " it must equal the # of Project hours for the year which is: " + object.annualProjectHours;
      //"The sum of development hours for employees and contractors (onshore and offshore) must equal the number of actual project hours.";

    }

    //sum of offshore on should be equal to total
    else if ((object.onShoreEmpCondition == true
      && object.offShoreEmpCondition == true
      && object.onShoreContractorCondition == true
      && object.offShoreContractorCondition == true)
      && (
        object.onShoreEmpProjectHours != null
        && object.offShoreEmpProjectHours != null
        && object.onShoreContractorProjectHours != null
        && object.offShoreContractorProjectHours != null
      )
      && (object.annualProjectHours > 0)
      && (Number(object.sumOfEmpContrProjectHours).toFixed(6) != Number(object.annualProjectHours).toFixed(6))
      && Number(object.sumOfEmpContrProjectHours) > 0) {
      
      object.ADDevHoursConditionsFulfilled = false;
      object.isADDevHourssBlack = false;
      object.isFormValid = false;
      object.errorMessageADDevHours = "The entries for Annual Onshore and Offshore hours (top four cells) is: " + object.sumOfEmpContrProjectHours + " it must equal the # of Project hours for the year which is: " + object.annualProjectHours;
      //"The sum of development hours for employees and contractors (onshore and offshore) must equal the number of actual project hours.";

    }
    //sum of offshore on should be equal to total
    else if ((object.onShoreEmpCondition == true
      && object.offShoreEmpCondition == true
      && object.onShoreContractorCondition == true
      && object.offShoreContractorCondition == true)
      && (
        object.onShoreEmpProjectHours == null
        || object.offShoreEmpProjectHours == null
        || object.onShoreContractorProjectHours == null
        || object.offShoreContractorProjectHours == null
      )
      && (Number(object.sumOfEmpContrProjectHours).toFixed(6) != Number(object.annualProjectHours).toFixed(6))
      && Number(object.sumOfEmpContrProjectHours) > 0) {
      
      object.ADDevHoursConditionsFulfilled = false;
      object.isADDevHourssBlack = true;
      object.isFormValid = false;
      object.errorMessageADDevHours = "The entries for Annual Onshore and Offshore hours (top four cells) is: " + object.sumOfEmpContrProjectHours + " it must equal the # of Project hours for the year which is: " + object.annualProjectHours;
      //"The sum of development hours for employees and contractors (onshore and offshore) must equal the number of actual project hours.";

    }
    else if (
      (Number(object.sumOfEmpContrProjectHours).toFixed(6) != Number(object.annualProjectHours).toFixed(6))
      && Number(object.sumOfEmpContrProjectHours) > 0
      && object.onShoreEmpProjectHours != ''
      && object.onShoreEmpProjectHours != null
      && object.offShoreEmpProjectHours != ''
      && object.offShoreEmpProjectHours != null
      && object.onShoreContractorProjectHours != ''
      && object.onShoreContractorProjectHours != null
      && object.offShoreContractorProjectHours != ''
      && object.offShoreContractorProjectHours != null
      && object.annualProjectHours != ''
      && object.annualProjectHours != null) {
      
      object.ADDevHoursConditionsFulfilled = false;
      object.isADDevHourssBlack = false;
      object.isFormValid = false;
      object.errorMessageADDevHours = "The entries for Annual Onshore and Offshore hours (top four cells) is: " + object.sumOfEmpContrProjectHours + " it must equal the # of Project hours for the year which is: " + object.annualProjectHours;
      //"The sum of development hours for employees and contractors (onshore and offshore) must equal the number of actual project hours.";

    }
    else if (Number(object.sumOfEmpContrProjectHours) == 0
      && Number(object.sumOfEmpContrProjectHours) == 0) {
      
      object.ADDevHoursConditionsFulfilled = true;
      object.isADDevHourssBlack = false;
    }
    object.validateEntireForm();

    object.calculatePercentage();
  }


  validateADMData() {



    try {


      //loop through AD data
      this.myData.ApplicationDevelopmentandMaintenanceInput.NA.forEach(element => {


        //AMR455, 460, 465, 470



        if (element.src_code == "AMR455") {
          if (element.src_code_value == null || element.src_code_value == '') {
            this.saasSpend = null;
          }
          else {
            this.saasSpend = this.unmaskComma(element.src_code_value);
          }
        } else if (element.src_code == "AMR460") {
          if (element.src_code_value == null || element.src_code_value == '') {
            this.erpSpend = null;
          }
          else {
            this.erpSpend = this.unmaskComma(element.src_code_value);
          }
        } else if (element.src_code == "AMR465") {
          if (element.src_code_value == null || element.src_code_value == '') {
            this.cotsSpend = null;
          }
          else {
            this.cotsSpend = this.unmaskComma(element.src_code_value);
          }
        }
        else if (element.src_code == "AMR470") {
          if (element.src_code_value == null || element.src_code_value == '') {
            this.bespokeSpend = null;
          }
          else {
            this.bespokeSpend = this.unmaskComma(element.src_code_value);
          }
        }
      });

      this.errorMessageADM = "";


      var totalErpSpend;

      if (null == this.saasSpend &&
        null == this.erpSpend &&
        null == this.cotsSpend &&
        null == this.bespokeSpend) {
        this.sumOfSaasErpSpend = undefined;
        totalErpSpend = null;
      } else {
        this.sumOfSaasErpSpend = Number(this.saasSpend)
          + Number(this.erpSpend)
          + Number(this.cotsSpend)
          + Number(this.bespokeSpend);
        totalErpSpend = Number(this.sumOfSaasErpSpend);
      }


      var hundred = 100;

      
      //if form is blank
      if (((this.saasSpend == null
        && this.erpSpend == null
        && this.cotsSpend == null
        && this.bespokeSpend == null))
      ) {
        
        this.ADMWarningMessage = false;
        this.ADMOcnditionsFulfilled = true;
      }

      //in case sum is 100 but form is partially filled, show warning message
      else if ((totalErpSpend.toFixed(6) == hundred.toFixed(6))
        && ((this.saasSpend == null
          || this.erpSpend == null
          || this.cotsSpend == null
          || this.bespokeSpend == null))) {
        
        this.isFormValid = false;
        this.ADMWarningMessage = true;
        this.ADMOcnditionsFulfilled = false;
        this.errorMessageADM = "The entries for % of spend by application family type equal 100%, however all cells require a value. If there is no value for a cell, please enter zero to continue."
        //"Your entries equal "+totalErpSpend+", it must equal 100."
        //"The sum of percentages for SaaS, On-Premise Enterprise Business Systems, COTS, and Bespoke must equal 100%.";
      }

      //in case sum is 100
      else if (totalErpSpend.toFixed(6) == hundred.toFixed(6)) {
        //condition is valid
        
        this.ADMWarningMessage = false;
        this.ADMOcnditionsFulfilled = true;
      }
      //if values are being entered, show warning message
      else if (((this.saasSpend == ''
        || this.erpSpend == ''
        || this.cotsSpend == ''
        || this.bespokeSpend == '')
        || (this.saasSpend == null
          || this.erpSpend == null
          || this.cotsSpend == null
          || this.bespokeSpend == null))
        && totalErpSpend >= 0) {
        
        this.isFormValid = false;
        this.ADMWarningMessage = true;
        this.ADMOcnditionsFulfilled = false;
        this.errorMessageADM = "The entries for % of spend by application family equal " + totalErpSpend + "%, however all entries must equal 100%. Please revise to continue."
        //"The sum of percentages for SaaS, On-Premise Enterprise Business Systems, COTS, and Bespoke must equal 100%.";
      }

      //if all values are entered and validation is incorrect
      else if (((this.saasSpend
        != ''
        && this.erpSpend != ''
        && this.cotsSpend != ''
        && this.bespokeSpend != '')
        && (this.saasSpend != null
          && this.erpSpend != null
          && this.cotsSpend != null
          && this.bespokeSpend != null))
        && totalErpSpend > 0) {
        
        this.isFormValid = false;
        this.ADMWarningMessage = false;
        this.ADMOcnditionsFulfilled = false;
        this.errorMessageADM = "The entries for % of spend by application family equal " + totalErpSpend + "%, however all entries must equal 100%. Please revise to continue."
        //"The sum of percentages for SaaS, On-Premise Enterprise Business Systems, COTS, and Bespoke must equal 100%.";
      }
      //if all 0 are entered, show error message
      else if (this.saasSpend
        == 0
        && this.erpSpend == 0
        && this.cotsSpend == 0
        && this.bespokeSpend == 0) {
        
        this.isFormValid = false;
        this.ADMWarningMessage = false;
        this.ADMOcnditionsFulfilled = false;
        this.errorMessageADM = "The sum of percentages for SaaS, On-Premise Enterprise Business Systems, COTS, and Bespoke must equal 100%.";
      }

      //form level validation check
      this.validateEntireForm();

      this.calculatePercentage();


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

  validateAMHoursData() {
    let object = this;

    object.myData.ApplicationMaintenanceandSupportInput.applicationmaintenancehours.forEach(element => {
      if (element.src_code == "Q31090") {
        if (element.src_code_value == null || element.src_code_value == '') {
          object.annualOnshoreOffshoreMaintenance = null;
        }
        else {
          object.annualOnshoreOffshoreMaintenance = object.unmaskComma(element.src_code_value); //Number(element.src_code_value);
        }
      }
      else if (element.src_code == "Q31000") {
        if (element.src_code_value == null || element.src_code_value == '') {
          object.onShoreEmpMaintenance = null;
        }
        else {
          object.onShoreEmpMaintenance = object.unmaskComma(element.src_code_value); //Number(element.src_code_value);
        }
      }
      else if (element.src_code == "Q31005") {
        if (element.src_code_value == null || element.src_code_value == '') {
          object.offShoreEmpMaintenance = null;
        }
        else {
          object.offShoreEmpMaintenance = object.unmaskComma(element.src_code_value); //Number(element.src_code_value);
        }
      }
      else if (element.src_code == "Q31020") {
        if (element.src_code_value == null || element.src_code_value == '') {
          object.onShoreContractorMaintenance = null;
        }
        else {
          object.onShoreContractorMaintenance = object.unmaskComma(element.src_code_value); //Number(element.src_code_value);
        }
      }
      else if (element.src_code == "Q31025") {
        if (element.src_code_value == null || element.src_code_value == '') {
          object.offShoreContractorMaintenance = null;
        }
        else {
          object.offShoreContractorMaintenance = object.unmaskComma(element.src_code_value);// Number(element.src_code_value);
        }
      }

    });

    

    var hundred = 100;


    if (null == object.onShoreEmpMaintenance
      && null == object.offShoreEmpMaintenance
      && null == object.onShoreContractorMaintenance
      && null == object.offShoreContractorMaintenance
      && null == object.annualOnshoreOffshoreMaintenance
    ) {
      object.sumOnshoreOffshoreMaintenance = undefined;
    } else {
      object.sumOnshoreOffshoreMaintenance = Number(object.onShoreEmpMaintenance)
        + Number(object.offShoreEmpMaintenance)
        + Number(object.onShoreContractorMaintenance)
        + Number(object.offShoreContractorMaintenance);
    }

    //validation rules for project hours
    //Onshore employee development hours cannot exceed the number of actual project hours.
    if ((Number(object.onShoreEmpMaintenance).toFixed(6) <= Number(object.annualOnshoreOffshoreMaintenance).toFixed(6))
      && (object.onShoreEmpMaintCondition == true
        && object.offShoreEmpMaintCondition == false
        && object.onShoreContractorMaintCondition == false
        && object.offShoreContractorMaintCondition == false)) {

      object.onShoreEmpMaintCondition = true;

      object.AMHoursConditionsFulfilled = true;
      object.AMHoursWarningMessage = false;
    }

    else if (Number(object.onShoreEmpMaintenance).toFixed(6) > Number(object.annualOnshoreOffshoreMaintenance).toFixed(6)
      && (object.onShoreEmpMaintCondition == false
        && object.offShoreEmpMaintCondition == false
        && object.onShoreContractorMaintCondition == false
        && object.offShoreContractorMaintCondition == false)) {
      object.AMHoursWarningMessage = false;
      object.isFormValid = false;
      object.errorMessageAM = "Onshore employee application maintenance hours cannot exceed the total number of application maintenance hours.";
      object.AMHoursConditionsFulfilled = false;

    }
    //Offshore employee development hours cannot exceed the number of actual project hours.
    else if ((Number(object.offShoreEmpMaintenance).toFixed(6) <= Number(object.annualOnshoreOffshoreMaintenance).toFixed(6))
      && (object.onShoreEmpMaintCondition == false
        && object.offShoreEmpMaintCondition == true
        && object.onShoreContractorMaintCondition == false
        && object.offShoreContractorMaintCondition == false)) {
      object.AMHoursWarningMessage = false;
      object.AMHoursConditionsFulfilled = true;
      object.offShoreEmpMaintCondition = true;
      //object.offShoreEmpCondition=true;

    }
    else if ((Number(object.offShoreEmpMaintenance).toFixed(6) > Number(object.annualOnshoreOffshoreMaintenance).toFixed(6))
      && (object.onShoreEmpMaintCondition == false
        && object.offShoreEmpMaintCondition == false
        && object.onShoreContractorMaintCondition == false
        && object.offShoreContractorMaintCondition == false)) {
      object.AMHoursWarningMessage = false;
      object.isFormValid = false;
      object.errorMessageAM = "Offshore employee application maintenance hours cannot exceed the total number of application maintenance hours.";
      object.AMHoursConditionsFulfilled = false;

    }

    //Onshore contractor development hours cannot exceed the number of actual project hours.
    else if ((Number(object.onShoreContractorMaintenance).toFixed(6) <= Number(object.annualOnshoreOffshoreMaintenance).toFixed(6))
      && (object.onShoreEmpMaintCondition == false
        && object.offShoreEmpMaintCondition == false
        && object.onShoreContractorMaintCondition == true
        && object.offShoreContractorMaintCondition == false)) {
      //object.isADBlack = false;
      object.onShoreContractorMaintCondition = true;
      object.AMHoursConditionsFulfilled = true;
      object.AMHoursWarningMessage = false;


    }
    else if ((Number(object.onShoreContractorMaintenance).toFixed(6) > Number(object.annualOnshoreOffshoreMaintenance).toFixed(6))
      && (object.onShoreEmpMaintCondition == false
        && object.offShoreEmpMaintCondition == false
        && object.onShoreContractorMaintCondition == false
        && object.offShoreContractorMaintCondition == false)) {
      object.AMHoursWarningMessage = false;
      object.isFormValid = false;
      object.errorMessageAM = "Onshore contractor application maintenance hours cannot exceed the total number of application maintenance hours.";
      object.AMHoursConditionsFulfilled = false;

    }

    //offshore contractor development hours cannot exceed the number of actual project hours.
    else if ((Number(object.offShoreContractorMaintenance).toFixed(6) <= Number(object.annualOnshoreOffshoreMaintenance).toFixed(6))
      && (object.onShoreEmpMaintCondition == false
        && object.offShoreEmpMaintCondition == false
        && object.onShoreContractorMaintCondition == false
        && object.offShoreContractorMaintCondition == true)) {
      //object.isADBlack = false;
      //object.ADConditionsFulfilled = true;
      object.offShoreContractorMaintCondition = true;
      object.AMHoursConditionsFulfilled = true;
      object.AMHoursWarningMessage = false;


    }
    else if ((Number(object.offShoreContractorMaintenance).toFixed(6) > Number(object.annualOnshoreOffshoreMaintenance).toFixed(6))
      && (object.onShoreEmpMaintCondition == false
        && object.offShoreEmpMaintCondition == false
        && object.onShoreContractorMaintCondition == false
        && object.offShoreContractorMaintCondition == false)) {
      object.AMHoursWarningMessage = false;
      object.isFormValid = false;
      object.errorMessageAM = "Offshore contractor application maintenance hours cannot exceed the total number of application maintenance hours.";
      object.AMHoursConditionsFulfilled = false;

    }
    //sum of offshore on should be equal to total

    //all o entered
    else if (
      Number(object.onShoreEmpMaintenance) == 0
      && Number(object.offShoreEmpMaintenance) == 0
      && Number(object.onShoreContractorMaintenance) == 0
      && Number(object.offShoreContractorMaintenance) == 0

      && Number(object.annualOnshoreOffshoreMaintenance) > 0) {
      
      object.AMHoursConditionsFulfilled = false;
      object.AMHoursWarningMessage = false;
      object.errorMessageAM = "The entries for Application Maintenance Hours for the top four cells is: " + object.sumOnshoreOffshoreMaintenance + " it must equal the value in the Annual Application Maintenance Hours for the year which is: " + object.annualOnshoreOffshoreMaintenance+". Please revise to continue.";

      //"The sum of application maintenance hours for employees (onshore and offshore) and contractors (onshore and offshore) must equal the total number of application maintenance hours.";

    }


    //blue error message
    else if ((object.onShoreEmpMaintCondition == true
      && object.offShoreEmpMaintCondition == true
      && object.onShoreContractorMaintCondition == true
      && object.offShoreContractorMaintCondition == true)
      && (
        object.onShoreEmpMaintenance == null
        || object.offShoreEmpMaintenance == null
        || object.onShoreContractorMaintenance == null
        || object.offShoreContractorMaintenance == null
        || object.annualOnshoreOffshoreMaintenance == null
      )
      && (Number(object.sumOnshoreOffshoreMaintenance).toFixed(6) != Number(object.annualOnshoreOffshoreMaintenance).toFixed(6))
      && Number(object.sumOnshoreOffshoreMaintenance) >= 0) {
      
      object.AMHoursConditionsFulfilled = false;
      object.AMHoursWarningMessage = true;
      object.isFormValid = false;
      object.errorMessageAM = "The entries for Application Maintenance Hours for the top four cells is: " + object.sumOnshoreOffshoreMaintenance + " it must equal the value in the Annual Application Maintenance Hours for the year which is: " + object.annualOnshoreOffshoreMaintenance+". Please revise to continue.";
      //"The sum of application maintenance hours for employees (onshore and offshore) and contractors (onshore and offshore) must equal the total number of application maintenance hours.";
    }
    //blue message when there are either 0 or blank and sum is entered 
    else if ((object.onShoreEmpMaintCondition == true
      && object.offShoreEmpMaintCondition == true
      && object.onShoreContractorMaintCondition == true
      && object.offShoreContractorMaintCondition == true)
      && (
        object.onShoreEmpMaintenance == null
        || object.offShoreEmpMaintenance == null
        || object.onShoreContractorMaintenance == null
        || object.offShoreContractorMaintenance == null
        || object.annualOnshoreOffshoreMaintenance == null
      )
      && (Number(object.sumOnshoreOffshoreMaintenance).toFixed(6) != Number(object.annualOnshoreOffshoreMaintenance).toFixed(6))
      && Number(object.sumOnshoreOffshoreMaintenance) >= 0) {
      
      object.AMHoursConditionsFulfilled = false;
      object.AMHoursWarningMessage = true;
      object.isFormValid = false;
      object.errorMessageAM = "The entries for Application Maintenance Hours for the top four cells is: " + object.sumOnshoreOffshoreMaintenance + " it must equal the value in the Annual Application Maintenance Hours for the year which is: " + object.annualOnshoreOffshoreMaintenance+". Please revise to continue.";
      //"The sum of application maintenance hours for employees (onshore and offshore) and contractors (onshore and offshore) must equal the total number of application maintenance hours.";
    }
    else if ((Number(object.offShoreContractorMaintenance).toFixed(6) > Number(object.annualOnshoreOffshoreMaintenance).toFixed(6))
      && (object.onShoreEmpMaintCondition == false
        && object.offShoreEmpMaintCondition == false
        && object.onShoreContractorMaintCondition == false
        && object.offShoreContractorMaintCondition == false)) {
      object.AMHoursWarningMessage = false;
      object.isFormValid = false;
      object.errorMessageAM = "Offshore contractor application maintenance hours cannot exceed the total number of application maintenance hours.";
      object.AMHoursConditionsFulfilled = false;

    }
    //sum of offshore on should be equal to total
    //blue error message when blank fields are there plus sum is equal
    else if ((object.onShoreEmpMaintCondition == true
      && object.offShoreEmpMaintCondition == true
      && object.onShoreContractorMaintCondition == true
      && object.offShoreContractorMaintCondition == true)
      && (
        object.onShoreEmpMaintenance == null
        || object.offShoreEmpMaintenance == null
        || object.onShoreContractorMaintenance == null
        || object.offShoreContractorMaintenance == null
        || object.annualOnshoreOffshoreMaintenance == null
      )
      && (Number(object.sumOnshoreOffshoreMaintenance).toFixed(6) == Number(object.annualOnshoreOffshoreMaintenance).toFixed(6))
      && Number(object.sumOnshoreOffshoreMaintenance) > 0) {
      
      object.AMHoursConditionsFulfilled = false;
      object.AMHoursWarningMessage = true;
      object.isFormValid = false;
      object.errorMessageAM = "The entries equal the total number of Application Maintenance Hours for the year: "+object.annualOnshoreOffshoreMaintenance+", however all cells require a value. If there is no value for a cell, please enter zero to continue.";
      //"The sum of application maintenance hours for employees (onshore and offshore) and contractors (onshore and offshore) must equal the total number of application maintenance hours.";
    }
    //combination of 0 and blank, blue error message
    else if ((
      object.onShoreEmpMaintenance == null
      || object.offShoreEmpMaintenance == null
      || object.onShoreContractorMaintenance == null
      || object.offShoreContractorMaintenance == null
      || object.annualOnshoreOffshoreMaintenance == null

    )
      && Number(object.sumOnshoreOffshoreMaintenance) >= 0) {
      
      object.AMHoursConditionsFulfilled = false;
      object.AMHoursWarningMessage = true;
      object.isFormValid = false;
      object.errorMessageAM = "The entries for Application Maintenance Hours for the top four cells is: " + object.sumOnshoreOffshoreMaintenance + " it must equal the value in the Annual Application Maintenance Hours for the year which is: " + object.annualOnshoreOffshoreMaintenance+". Please revise to continue.";
      //"The sum of application maintenance hours for employees (onshore and offshore) and contractors (onshore and offshore) must equal the total number of application maintenance hours.";
    }

    //sum of offshore on should be equal to total
    //red message
    else if ((object.onShoreEmpMaintCondition == true
      && object.offShoreEmpMaintCondition == true
      && object.onShoreContractorMaintCondition == true
      && object.offShoreContractorMaintCondition == true)
      && (
        object.onShoreEmpMaintenance != null
        && object.offShoreEmpMaintenance != null
        && object.onShoreContractorMaintenance != null
        && object.offShoreContractorMaintenance != null
        && object.annualOnshoreOffshoreMaintenance != null
      )
      && (Number(object.sumOnshoreOffshoreMaintenance).toFixed(6) != Number(object.annualOnshoreOffshoreMaintenance).toFixed(6))
    ) {
      
      object.AMHoursConditionsFulfilled = false;
      object.AMHoursWarningMessage = false;
      object.isFormValid = false;
      object.errorMessageAM = "The entries for Application Maintenance Hours for the top four cells is: " + object.sumOnshoreOffshoreMaintenance + " it must equal the value in the Annual Application Maintenance Hours for the year which is: " + object.annualOnshoreOffshoreMaintenance+". Please revise to continue.";
      //"The sum of application maintenance hours for employees (onshore and offshore) and contractors (onshore and offshore) must equal the total number of application maintenance hours.";

    }
    else if ((object.onShoreEmpMaintCondition == true
      && object.offShoreEmpMaintCondition == true
      && object.onShoreContractorMaintCondition == true
      && object.offShoreContractorMaintCondition == true)
      && (Number(object.sumOnshoreOffshoreMaintenance).toFixed(6) == Number(object.annualOnshoreOffshoreMaintenance).toFixed(6))
      && Number(object.sumOnshoreOffshoreMaintenance) > 0) {
      object.AMHoursConditionsFulfilled = true;
      object.AMHoursWarningMessage = false;

    }
    else if (
      Number(object.onShoreEmpMaintenance) == 0
      && Number(object.offShoreEmpMaintenance) == 0
      && Number(object.onShoreContractorMaintenance) == 0
      && Number(object.offShoreContractorMaintenance) == 0
      && Number(object.offShoreContractorMaintenance) == 0

      && Number(object.annualOnshoreOffshoreMaintenance) == 0) {
      object.AMHoursConditionsFulfilled = true;
      object.AMHoursWarningMessage = true;

    }


    //form level validation check
    this.validateEntireForm();



    object.calculatePercentage();

  }

  validateAMDefectsData() {
    let object = this; object.myData.ApplicationMaintenanceandSupportInput.Defectseveritytype.forEach(element => {
      if (element.src_code == "Q67070") {
        if (element.src_code_value == null || element.src_code_value == '') {
          object.severity1 = null;
        }
        else {
          object.severity1 = object.unmaskComma(element.src_code_value); //Number(element.src_code_value);
        }
        
      }
      else if (element.src_code == "Q67075") {
        if (element.src_code_value == null || element.src_code_value == '') {
          object.severity2 = null;
        }
        else {
          object.severity2 = object.unmaskComma(element.src_code_value);//Number(element.src_code_value);
        }
        
      }
      else if (element.src_code == "Q67080") {
        if (element.src_code_value == null || element.src_code_value == '') {
          object.severity3 = null;
        }
        else {

          object.severity3 = object.unmaskComma(element.src_code_value); //Number(element.src_code_value);
        }
        
      }

      else if (element.src_code == "Q67085") {
        if (element.src_code_value == null || element.src_code_value == '') {
          object.severity4 = null;
        }
        else {
          object.severity4 = object.unmaskComma(element.src_code_value);//Number(element.src_code_value);
        }
        
      }
    });

    var hundred = 100;

    //severity sum
    if (null == object.severity1
      && null == object.severity2
      && null == object.severity3
      && null == object.severity4
    ) {
      object.sumOfSeverity = undefined;
    } else {
      object.sumOfSeverity = Number(object.severity1)
        + Number(object.severity2)
        + Number(object.severity3)
        + Number(object.severity4);
    }

    //validation for severity

    //if form is blank
    if ((
      (this.severity1 == null
        && this.severity2 == null
        && this.severity3 == null
        && this.severity4 == null))
    ) {
      this.AMDefectsWarningMessage = false;
      this.AMDefectsConditionsFulfilled = true;

    }

    //all 0, show red error
    else if (object.sumOfSeverity == 0
      && (this.severity1 != null
        && this.severity2 != null
        && this.severity3 != null
        && this.severity4 != null)) {
      this.isFormValid = false;
      this.AMDefectsWarningMessage = false;
      this.AMDefectsConditionsFulfilled = false;
      this.errorMessageDefectSeverity = "The entries for Defect Severity by type equals " + object.sumOfSeverity + "%, it must equal 100%. Please revise to continue."

      //"The sum of percentages for defects by severity must equal 100%.";
    }

    //sum 100 but fields blank, show warning
    else if (object.sumOfSeverity.toFixed(6) == hundred.toFixed(6)
      && (this.severity1 == null
        || this.severity2 == null
        || this.severity3 == null
        || this.severity4 == null)) {
      this.isFormValid = false;
      this.AMDefectsWarningMessage = true;
      this.AMDefectsConditionsFulfilled = false;
      this.errorMessageDefectSeverity = "The entries for Defect Severity by type equal 100%, however all cells require a value. If there is no value for a cell, please enter zero to continue.";
      //"The sum of percentages for defects by severity must equal 100%.";
    }
    //in case sum is 100
    else if (object.sumOfSeverity.toFixed(6) == hundred.toFixed(6)) {
      //condition is valid

      this.AMDefectsWarningMessage = false;
      this.AMDefectsConditionsFulfilled = true;

    }
    //if values are being entered, show warning message
    else if ((
      (this.severity1 == null
        || this.severity2 == null
        || this.severity3 == null
        || this.severity4 == null))
      && object.sumOfSeverity >= 0) {
      this.isFormValid = false;
      this.AMDefectsWarningMessage = true;
      this.AMDefectsConditionsFulfilled = false;
      this.errorMessageDefectSeverity = "The entries for Defect Severity by type equals " + object.sumOfSeverity + "%, it must equal 100%. Please revise to continue."
      //"The sum of percentages for defects by severity must equal 100%.";
    }

    //if all values are entered and validation is incorrect
    else if ((this.severity1 != null
      && this.severity2 != null
      && this.severity3 != null
      && this.severity4 != null)
      && object.sumOfSeverity > 0) {
      this.isFormValid = false;
      this.AMDefectsWarningMessage = false;
      this.AMDefectsConditionsFulfilled = false;
      this.errorMessageDefectSeverity = "The entries for Defect Severity by type equals " + object.sumOfSeverity + "%, it must equal 100%. Please revise to continue."
      //"The sum of percentages for defects by severity must equal 100%.";

    }

    this.validateEntireForm();
    this.calculatePercentage();

  }


  validateEntireForm() {
    //form level validation check
    if (this.ADMOcnditionsFulfilled
      && this.ADDevHoursConditionsFulfilled
      && this.ADEffortsConditionsFulfilled
      && this.ADConditionsFulfilled
      && this.AMHoursConditionsFulfilled
      && this.AMDefectsConditionsFulfilled) {
      this.isFormValid = true;
    } else {
      this.isFormValid = false;
    }
  }



  //this will hit service and get all data from service

  //this will hit service and get all data
  getAllTabsData(scenarioId) {
    let object = this;
    object.dashboardId = "12";

    //if scenario is not selected set flag to false else set it to true
    if (scenarioId == 0) {
      object.isDeleteAllowed = false;
    } else {
      object.isDeleteAllowed = true;
    }

    object.generateScenarioService.getScenarioData(object.dashboardId, object.loginUserId, scenarioId).subscribe(data => {
      //object.getDataStatus();

      object.myData = data;

      for (let cnt = 0; cnt < object.myData.ApplicationDevelopmentandMaintenanceInput.NA.length; cnt++) {
        if (object.myData.ApplicationDevelopmentandMaintenanceInput.NA[cnt].src_code == "PR0900") {

          object.myData.ApplicationDevelopmentandMaintenanceInput.NA[cnt].dropDown = this.dropdownvalues;
        }

      }


      //Swapping of AD Input starts

      //swapping applicaion development hours values  
      let adHourTempValues = object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours;
      let adhourtemp1;
      let adhourtemp2;
      let adhourtemp3;
      let adhourtemp4;
      let adhourtemp5;



      for (let adHourObj of adHourTempValues) {
        if (adHourObj.src_code == 'P51000') {
          adhourtemp1 = adHourObj;
        } else if (adHourObj.src_code == 'P51005') {
          adhourtemp2 = adHourObj;
        } else if (adHourObj.src_code == 'P51020') {
          adhourtemp3 = adHourObj;
        } else if (adHourObj.src_code == 'P51025') {
          adhourtemp4 = adHourObj;
        } else if (adHourObj.src_code == 'P21090') {
          adhourtemp5 = adHourObj;
        }

      }

      object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours[0] = adhourtemp1;
      object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours[1] = adhourtemp2;
      object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours[2] = adhourtemp3;
      object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours[3] = adhourtemp4;
      object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours[4] = adhourtemp5;
      //SWapping AD hours ends

      //swapping Application development and maintenance values
      let ADMTempValues = object.myData.ApplicationDevelopmentandMaintenanceInput.NA;
      let temp1;
      let temp2;
      let temp3;
      let temp4;
      let temp5;
      let temp6;
      let temp7;
      let temp8;
      let temp9;
      let temp10;


      for (let admObj of ADMTempValues) {
        if (admObj.src_code == 'AMR110') {
          temp1 = admObj;
        } else if (admObj.src_code == 'EXA010') {
          temp2 = admObj;
        } else if (admObj.src_code == 'EXA020') {
          temp3 = admObj;
        } else if (admObj.src_code == 'EXA030') {
          temp4 = admObj;
        } else if (admObj.src_code == 'AMR300') {
          temp5 = admObj;
        } else if (admObj.src_code == 'PR0900') {
          temp6 = admObj;
        } else if (admObj.src_code == 'AMR455') {
          temp7 = admObj;
        } else if (admObj.src_code == 'AMR460') {
          temp8 = admObj;
        } else if (admObj.src_code == 'AMR465') {
          temp9 = admObj;
        } else if (admObj.src_code == 'AMR470') {
          temp10 = admObj;
        }
      }
      object.myData.ApplicationDevelopmentandMaintenanceInput.NA[0] = temp1;
      object.myData.ApplicationDevelopmentandMaintenanceInput.NA[1] = temp2;
      object.myData.ApplicationDevelopmentandMaintenanceInput.NA[2] = temp3;
      object.myData.ApplicationDevelopmentandMaintenanceInput.NA[3] = temp4;
      object.myData.ApplicationDevelopmentandMaintenanceInput.NA[4] = temp5;
      object.myData.ApplicationDevelopmentandMaintenanceInput.NA[5] = temp6;
      object.myData.ApplicationDevelopmentandMaintenanceInput.NA[6] = temp7;
      object.myData.ApplicationDevelopmentandMaintenanceInput.NA[7] = temp8;
      object.myData.ApplicationDevelopmentandMaintenanceInput.NA[8] = temp9;
      object.myData.ApplicationDevelopmentandMaintenanceInput.NA[9] = temp10;
      //swapping Application development and maintenance values ends

      //swapping Application Development Costs values
      let temp11;
      let temp12;
      let temp13;
      let temp14;
      let ADCostValues = object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentCosts;
      for (let adCost of ADCostValues) {

        if (adCost.src_code == 'DAD150') {
          temp11 = adCost;
        } else if (adCost.src_code == 'DAD155') {
          temp12 = adCost;
        } else if (adCost.src_code == 'DAD170') {
          temp13 = adCost;
        } else if (adCost.src_code == 'DAD165') {
          temp14 = adCost;
        }

      }
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentCosts[0] = temp11;
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentCosts[1] = temp12;
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentCosts[2] = temp13;
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentCosts[3] = temp14;

      //swapping Application Development Costs values ends

      //swapping Application Development FTEs values
      let temp15;
      let temp16;
      let temp17;
      let ADFTEValues = object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs;

      for (let adFTE of ADFTEValues) {
        if (adFTE.src_code == 'EAD010') {
          temp15 = adFTE;
        } else if (adFTE.src_code == 'EAD020') {
          temp16 = adFTE;
        } else if (adFTE.src_code == 'EAD030') {
          temp17 = adFTE;
        }
      }
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs[0] = temp15;
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs[1] = temp16;
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs[2] = temp17;

      //swapping Application Development FTEsends

      //swapping ApplicationDevelopmentVolumes values
      let ADVolumesValues = object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes;
      let temp18;
      let temp19;
      let temp20;
      let temp21;
      let temp22;
      let temp23;

      for (let adVolume of ADVolumesValues) {
        if (adVolume.src_code == 'ADR300') {
          temp18 = adVolume;
        } else if (adVolume.src_code == 'P21055') {
          temp19 = adVolume;
        } else if (adVolume.src_code == 'P21085') {
          temp20 = adVolume;
        } else if (adVolume.src_code == 'P77010') {
          temp21 = adVolume;
        } else if (adVolume.src_code == 'P67085') {
          temp22 = adVolume;
        } else if (adVolume.src_code == 'P77050') {
          temp23 = adVolume;
        }
      }
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes[0] = temp18;
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes[1] = temp19;
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes[2] = temp20;
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes[3] = temp21;
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes[4] = temp22;
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes[5] = temp23;


      //swapping ApplicationDevelopmentVolumes values ends

      //swapping Projecteffortsallocation values 
      let projectEffortsValues = object.myData.ApplicationDevelopmentInput.Projecteffortsallocation;
      let temp24;
      let temp25;
      let temp26;
      let temp27;
      let temp28;
      let temp29;
      let temp30;
      let temp31;
      let temp32;
      let temp33;
      let temp34;
      let temp35;
      let temp36;
      let temp37;

      for (let projectCost of projectEffortsValues) {
        if (projectCost.src_code == 'P1R250') {
          temp24 = projectCost;
        } else if (projectCost.src_code == 'P1R251') {
          temp25 = projectCost;
        } else if (projectCost.src_code == 'P1R255') {
          temp26 = projectCost;
        } else if (projectCost.src_code == 'P1R256') {
          temp27 = projectCost;
        } else if (projectCost.src_code == 'P1R260') {
          temp28 = projectCost;
        } else if (projectCost.src_code == 'P1R261') {
          temp29 = projectCost;
        } else if (projectCost.src_code == 'P1R265') {
          temp30 = projectCost;
        } else if (projectCost.src_code == 'P1R266') {
          temp31 = projectCost;
        } else if (projectCost.src_code == 'P1R270') {
          temp32 = projectCost;
        } else if (projectCost.src_code == 'P1R271') {
          temp33 = projectCost;
        } else if (projectCost.src_code == 'P1R275') {
          temp34 = projectCost;
        } else if (projectCost.src_code == 'P1R276') {
          temp35 = projectCost;
        } else if (projectCost.src_code == 'P1R280') {
          temp36 = projectCost;
        } else if (projectCost.src_code == 'P1R281') {
          temp37 = projectCost;
        }
      }

      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[0] = temp24;
      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[1] = temp25;
      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[2] = temp26;
      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[3] = temp27;
      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[4] = temp28;
      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[5] = temp29;
      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[6] = temp30;
      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[7] = temp31;
      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[8] = temp32;
      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[9] = temp33;
      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[10] = temp34;
      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[11] = temp35;
      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[12] = temp36;
      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[13] = temp37;

      //swapping Projecteffortsallocation values ends

      //Swapping of AD Input Ends

      //Swapping of ApplicationMaintenanceandSupportInput starts
      //swapping AM hours values   
      let temp38;
      let temp39;
      let temp40;
      let temp41;
      let temp42;
      let AMHoursData = object.myData.ApplicationMaintenanceandSupportInput.applicationmaintenancehours;
      for (let amHours of AMHoursData) {

        if (amHours.src_code == 'Q31000') {
          temp38 = amHours;
        } else if (amHours.src_code == 'Q31005') {
          temp39 = amHours;
        } else if (amHours.src_code == 'Q31020') {
          temp40 = amHours;
        } else if (amHours.src_code == 'Q31025') {
          temp41 = amHours;
        } else if (amHours.src_code == 'Q31090') {
          temp42 = amHours;
        }
      }
      object.myData.ApplicationMaintenanceandSupportInput.applicationmaintenancehours[0] = temp38;
      object.myData.ApplicationMaintenanceandSupportInput.applicationmaintenancehours[1] = temp39;
      object.myData.ApplicationMaintenanceandSupportInput.applicationmaintenancehours[2] = temp40;
      object.myData.ApplicationMaintenanceandSupportInput.applicationmaintenancehours[3] = temp41;
      object.myData.ApplicationMaintenanceandSupportInput.applicationmaintenancehours[4] = temp42;
      //SWapping AM hours ends

      ///swapping ApplicationMaintenanceCosts
      let AMCostValues = object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts;
      let temp43;
      let temp44;
      let temp45;
      let temp46;

      for (let amCost of AMCostValues) {
        if (amCost.src_code == 'DAM150') {
          temp43 = amCost;
        } else if (amCost.src_code == 'DAM155') {
          temp44 = amCost;
        } else if (amCost.src_code == 'DAM170') {
          temp45 = amCost;
        } else if (amCost.src_code == 'DAM165') {
          temp46 = amCost;
        }
      }

      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts[0] = temp43;
      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts[1] = temp44;
      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts[2] = temp45;
      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts[3] = temp46;

      //swapping ApplicationMaintenanceCosts ends

      //Swapping ApplicationMaintenanceFTEs 
      let AMFTEValues = object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs;
      let temp47;
      let temp48;
      let temp49;
      for (let amFTE of AMFTEValues) {
        if (amFTE.src_code == 'EAM010') {
          temp47 = amFTE;
        } else if (amFTE.src_code == 'EAM020') {
          temp48 = amFTE;
        } else if (amFTE.src_code == 'EAM030') {
          temp49 = amFTE;
        }
      }
      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs[0] = temp47;;
      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs[1] = temp48;
      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs[2] = temp49;;
      //Swapping ApplicationMaintenanceFTEs ends

      //Swapping Defectseveritytype
      let defectSeverityTypeValues = object.myData.ApplicationMaintenanceandSupportInput.Defectseveritytype;
      let temp50;
      let temp51;
      let temp52;

      let temp53;
      for (let defectSev of defectSeverityTypeValues) {
        if (defectSev.src_code == 'Q67070') {
          temp50 = defectSev;
        } else if (defectSev.src_code == 'Q67075') {
          temp51 = defectSev;
        } else if (defectSev.src_code == 'Q67080') {
          temp52 = defectSev;
        } else if (defectSev.src_code == 'Q67085') {
          temp53 = defectSev;
        }
      }

      object.myData.ApplicationMaintenanceandSupportInput.Defectseveritytype[0] = temp50;
      object.myData.ApplicationMaintenanceandSupportInput.Defectseveritytype[1] = temp51;
      object.myData.ApplicationMaintenanceandSupportInput.Defectseveritytype[2] = temp52;
      object.myData.ApplicationMaintenanceandSupportInput.Defectseveritytype[3] = temp53
      //Swapping Defectseveritytype ends

      //Swapping ApplicationMaintenanceVolumes
      let AMVolumesValues = object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes;
      let temp54;
      let temp55;
      let temp56;
      let temp57;
      let temp58;
      let temp59;
      for (let amVolume of AMVolumesValues) {

        if (amVolume.src_code == 'Q3R010') {
          temp54 = amVolume;
        } else if (amVolume.src_code == 'Q37000') {
          temp55 = amVolume;
        } else if (amVolume.src_code == 'Q67010') {
          temp56 = amVolume;
        } else if (amVolume.src_code == 'Q67110') {
          temp57 = amVolume;
        } else if (amVolume.src_code == 'Q78110') {
          temp58 = amVolume;
        } else if (amVolume.src_code == 'Q78120') {
          temp59 = amVolume;
        }
      }

      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes[0] = temp54;
      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes[1] = temp55;
      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes[2] = temp56;
      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes[3] = temp57;
      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes[4] = temp58;
      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes[5] = temp59;

      //Swapping ApplicationMaintenanceVolumes ends

      //Swapping of ApplicationMaintenanceandSupportInput ends
      

      object.temperoryDisable = false;
      //since the recieved response give currency as 0th element and company as 1st element
      //thats why we are swapping it

      let swapping1 = object.myData.GENERALINFORMATION.NA[0];
      let swapping2 = object.myData.GENERALINFORMATION.NA[1];

      object.myData.GENERALINFORMATION.NA.splice(0, 0, swapping2);
      object.myData.GENERALINFORMATION.NA.splice(1, 0, swapping1);

      object.myData.GENERALINFORMATION.NA.join();

      object.myData.GENERALINFORMATION.NA.splice(0, 2);

      //  let swapping = object.myData.GENERALINFORMATION.NA[0];
      //  object.myData.GENERALINFORMATION.NA[0] = object.myData.GENERALINFORMATION.NA[1];
      //  object.myData.GENERALINFORMATION.NA[1] = swapping;

      // [object.myData.GENERALINFORMATION.NA[0], object.myData.GENERALINFORMATION.NA[1]] = [object.myData.GENERALINFORMATION.NA[1], object.myData.GENERALINFORMATION.NA[0]];


      let index = 0;
      let length = object.myData.GENERALINFORMATION.NA.length;

      while (index < length) {
        let row: any = {};
        row.disabled = false;
        if (object.myData.GENERALINFORMATION.NA[index].src_code == "ICE000") {
          object.myData.GENERALINFORMATION.NA[index].dropDown = [];
          object.indexSourceCodeMap["ICE000"] = index;
          //if selected id is 0,i.e  for new scenario we will disable/enable company and project .
          if (object.selectedScanrio != 0) {
            row.disabled = false;
          } else {

            row.disabled = false;
          }
          //
        }
        if (object.myData.GENERALINFORMATION.NA[index].src_code == "TD0120") {
          object.myData.GENERALINFORMATION.NA[index].dropDown = [];
          // object.getAllCountries(index);
          object.indexSourceCodeMap["TD0120"] = index;
        }

        if (object.myData.GENERALINFORMATION.NA[index].src_code == "ICE007") {
          object.myData.GENERALINFORMATION.NA[index].dropDown = [];
          object.getAllIndustries(index);
          object.indexSourceCodeMap["ICE007"] = index;
          //control will go inside if we click on edit scenario from edit and compare and we are visiting input my data for first time
          if (object.myData.GENERALINFORMATION.NA[index].src_code_value != undefined && object.myData.GENERALINFORMATION.NA[index].src_code_value != null) {
            object.updateIndustryGroup(object.myData.GENERALINFORMATION.NA[index].src_code_value);
          }
        }

        if (object.myData.GENERALINFORMATION.NA[index].src_code == "ICE008") {
          object.myData.GENERALINFORMATION.NA[index].dropDown = [];

          object.indexSourceCodeMap["ICE008"] = index;
        }

        if (object.myData.GENERALINFORMATION.NA[index].src_code == "TDA100") {
          object.myData.GENERALINFORMATION.NA[index].dropDown = [];
          object.getAllForbesVertical(index);
          object.indexSourceCodeMap["TDA100"] = index;
          //control will go inside if we click on edit scenario from edit and compare and we are visiting input my data for first time
          if (object.myData.GENERALINFORMATION.NA[index].src_code_value != undefined && object.myData.GENERALINFORMATION.NA[index].src_code_value != null) {
            object.updateForbesSubVertical(object.myData.GENERALINFORMATION.NA[index].src_code_value);
          }
        }
        if (object.myData.GENERALINFORMATION.NA[index].src_code == "TDA105") {
          object.myData.GENERALINFORMATION.NA[index].dropDown = [];
          // object.getAllForbesVertical(index);
          object.indexSourceCodeMap["TDA105"] = index;
        }

        if (object.myData.GENERALINFORMATION.NA[index].src_code == "ICE002") {
          object.myData.GENERALINFORMATION.NA[index].dropDown = [];
          if (object.myData.GENERALINFORMATION.NA[index].src_code_value != undefined && object.myData.GENERALINFORMATION.NA[index].src_code_value != null) {

            object.getAllReportingCurrency(index, true, object.myData.GENERALINFORMATION.NA[index].src_code_value);

          } else {
            object.getAllReportingCurrency(index, false);

          }
          object.indexSourceCodeMap["ICE002"] = index;
          object.myData.GENERALINFORMATION.NA[index].src_code_value = "FE482E13-D3B6-4208-8C3C-2FD7AFBEBEA1";
          //  row.disabled = false;
        }
        if (object.myData.GENERALINFORMATION.NA[index].src_code == "TD0110") {
          object.myData.GENERALINFORMATION.NA[index].dropDown = [];
          object.getAllRegion(index);
          //the control will go to below if condition ,if we are initialzing component and selecting existing scenario  from edit my scenario from edit my scenario
          //
          if (object.myData.GENERALINFORMATION.NA[index].src_code_value != undefined && object.myData.GENERALINFORMATION.NA[index].src_code_value != null) {
            object.updateCountryDropDown(object.myData.GENERALINFORMATION.NA[index].src_code_value);
          }

          object.indexSourceCodeMap["TD0110"] = index;
        }
        if (object.myData.GENERALINFORMATION.NA[index].src_code == "ICE005") {
          object.myData.GENERALINFORMATION.NA[index].dropDown = object.getDataUsage();

        }
        //populating year drop down
        if (object.myData.GENERALINFORMATION.NA[index].src_code == "TD0100") {

          let yearDropDown = [];

          // for (var x = 1900; x <= 2100; x++) {
          for (var x = 2100; x >= 1900; x--) {
            let year: any = {};
            year.key = x;
            year.value = x;
            yearDropDown.push(year);
          }
          object.myData.GENERALINFORMATION.NA[index].dropDown = yearDropDown;
          object.myData.GENERALINFORMATION.NA[index].src_code_value = new Date().getFullYear();
          object.yearDropdown = yearDropDown;

        }


        object.disabledStatus.push(row);

        index++;
      }

      //AD categories subcategories


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
      $('.modal-select-to-compare-adm').modal('hide');
    }

    //this will reset entered data so that new form will be populated when user clicks on input my data and enter new scenario
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
          if (obj.src_code == 'ICE000') {
            this.scenarioNameText = obj.src_code_value;
          }
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
    if (selectedScanrio == 0) {
      selectedScanrio = null;
    }
    this.enteredDataObj.scenario.dashboardID = 12;
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
        
        this.applicationDevelopmentInputMyDataSharedService.getEmitter().emit('newScenarioOfADSaved');
        this.applicationDevelopmentInputMyDataSharedService.getEmitter().emit('newScenarioOfAMSaved');

        //set saved scenario to service
        // this.applicationDevelopmentInputMyDataSharedService.setScenarioSelection(response.value);
        // //trigger a emitter to let landing page know
        // this.applicationDevelopmentInputMyDataSharedService.getEmitter().emit('newADScenarioSaved');          
        object.isDeleteAllowed = true;
      } else {
        message = "updated";
        object.isResetRequired = false;
        object.getScenariosList(response.value);

      }

      let description = object.scenarioNameText;
      if (description == undefined || description == undefined || description.trim().length == 0) {
        description = response.value + '_Scenario ' + response.value;
      } else {
        description = response.value + '_' + this.scenarioNameText;
      }
      this.toastr.info('Scenario ' + description + " " + message, '', {
        timeOut: 7000,
        positionClass: 'toast-top-center'
      });



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

  //this will get Data Status dropdown
  getDataStatus() {
    let object = this;
    object.generalTabService.getDataStatus().subscribe((response) => {
      let index = 0;
      let length = object.myData.GENERALINFORMATION.NA.length;
      index = 0;
      while (index < length) {
        if (object.myData.GENERALINFORMATION.NA[index].src_code == "ICE009") {
          object.myData.GENERALINFORMATION.NA[index].dropDown = response.dataStatus;
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
            if (obj.src_code == 'ICE000') {
              this.scenarioNameText = obj.src_code_value;
            }
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
      if (selectedScanrio == 0) {
        selectedScanrio = null;
      }

      //preparing request for saving scenario
      this.enteredDataObj.scenario.dashboardID = 12;
      this.enteredDataObj.scenario.userId = "E5E8339B-0620-4377-82FE-0008029EDC53";
      this.enteredDataObj.scenario.projectId = "679D007C-C668-40E1-A60E-06391512F388"; //ISG
      this.enteredDataObj.scenario.clientID = "E5E8339B-0620-4377-82FE-0008029EDC5311";
      this.enteredDataObj.scenario.scenarioID = selectedScanrio;
      this.enteredDataObj.scenario.scenarioName = this.scenarioNameText;

      this.enteredDataObj.kpi_maintenance_data = this.scenarioDataObj;
      this.enteredDataObj.sessionId = object.loggedInUserInfo.userDetails.sessionId;

      this.generateScenarioService.savedNewScenario(this.enteredDataObj).subscribe((response) => {
        let message;

        object.isCopyEnabled = true;
        object.disabledStatus[0].disabled = true;
        object.disabledStatus[1].disabled = true;

        if (selectedScanrio == null) {

          message = "Saved";

          object.isResetRequired = true;

          //updating ScenarioList After Updating
          object.getScenariosList(response.value);
          //set saved scenario to service
          this.applicationDevelopmentInputMyDataSharedService.setScenarioSelection(response.value);
          
          //trigger a emitter to let landing page know
          this.applicationDevelopmentInputMyDataSharedService.getEmitter().emit('newADScenarioSaved');
          this.applicationDevelopmentInputMyDataSharedService.getEmitter().emit('newAMScenarioSaved');
          object.isDeleteAllowed = true;
        } else {
          message = "updated";
          object.isResetRequired = true;
          object.getScenariosList(response.value);
          
          //set saved scenario to service
          this.applicationDevelopmentInputMyDataSharedService.setScenarioSelection(response.value);
          //trigger a emitter to let landing page know
          this.applicationDevelopmentInputMyDataSharedService.getEmitter().emit('newADScenarioSaved');
          this.applicationDevelopmentInputMyDataSharedService.getEmitter().emit('newAMScenarioSaved');
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

        object.resetAll();
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
      this.getScenarioDataService.getEmitter().emit('dataChange');//myData.GENERALINFORMATION.NA[index]
      let currency = this.myData.GENERALINFORMATION.NA[object.indexSourceCodeMap["ICE002"]].src_code_value;
      if (currency == undefined || currency == null || currency.trim().length == 0) {
        currency = "FE482E13-D3B6-4208-8C3C-2FD7AFBEBEA1";//USD key
      }
      let sharedData = { "comparisionData": this.scenarioDataObj, "currency": currency, "map": this.sourceCurrencyMap };

      
      object.applicationDevelopmentInputMyDataSharedService.setData(sharedData);
      if (selectedScanrio != null) {
        this.applicationDevelopmentEditAndCompareSharedService.setScenarioSelection(selectedScanrio);
      }
      
      object.applicationDevelopmentInputMyDataSharedService.getEmitter().emit('navigateToADComponentFromInput');
      object.ADSharedService.getEmitter().emit('navigateToAMComponentFromInput');

      //be cautious

    }

  }

  //as name suggests ,this code will populate general tab
  populateGeneralTab(selectedValues) {
    let object = this;


    //object.myData.GENERALINFORMATION.NA[0].src_code_value
    if (selectedValues.length == 0) {

      object.setDefaultValues();
      return;
    }


    let defaultValue = selectedValues[0];
    let index = 0;
    let length = object.myData.GENERALINFORMATION.NA.length;
    while (index < length) {
      let key = object.myData.GENERALINFORMATION.NA[index].src_code;

      if (key != undefined) { //since undefined break the code
        let value = defaultValue[key];

        if (value != undefined || value != null) {
          object.myData.GENERALINFORMATION.NA[index].src_code_value = value;
          if (key == "TD0110") {
            object.updateCountryDropDown(value);
          }


        } else {
          object.myData.GENERALINFORMATION.NA[index].src_code_value = null;

        }

        if (key == "ICE007") {
          object.updateIndustryGroup(value);
        }
        if (key == "TDA100") {
          object.updateForbesSubVertical(value);
        }
      }
      if (object.myData.GENERALINFORMATION.NA[index].src_code == "TD0100")
        object.myData.GENERALINFORMATION.NA[index].src_code_value = new Date().getFullYear();
      index++;
    }

  }

  //making default values ,this function will erase data of all dropdows except company
  setDefaultValues() {
    let index = 0;
    let object = this;
    let length = object.myData.GENERALINFORMATION.NA.length;

    while (index < length) {

      if (object.myData.GENERALINFORMATION.NA[index].src_code != "ICE001" && object.myData.GENERALINFORMATION.NA[index].src_code != "TD0100")
        object.myData.GENERALINFORMATION.NA[index].src_code_value = null;
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
    let length = object.myData.GENERALINFORMATION.NA.length;
    //need optimization
    while (index < length) {

      if (object.myData.GENERALINFORMATION.NA[index].src_code == "ICE000") {

        if (projects.length == 0 || projects === []) {
          object.myData.GENERALINFORMATION.NA[index].dropDown = [];
          break;
        } else {
          object.myData.GENERALINFORMATION.NA[index].dropDown = object.projects;
          let projectsMap: any = {}

          for (let projectid of projects) {
            projectsMap[projectid] = projectid;
          }


          for (let project of object.myData.GENERALINFORMATION.NA[index].dropDown) {

            if (projectsMap[project.key] != undefined) {

              projectList.push(project);
            }

          }

          object.myData.GENERALINFORMATION.NA[index].dropDown = projectList;

          object.myData.GENERALINFORMATION.NA[index].src_code_value = projectList[0].key;

        }
      }




      index++;
    }
  }

  //below are the functions to populate all dropdowns

  getAllProjects(index) {
    let object = this;

    object.generalTabService.getAllProjects().subscribe((response: any) => {
      // object.myData.GENERALINFORMATION.NA[index].dropDown=response.project;
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
      object.myData.GENERALINFORMATION.NA[index].dropDown = response.client;
      object.companies = response.client;

      if (response.client.length == 1) {

        object.myData.GENERALINFORMATION.NA[index].src_code_value = response.client[0].key;
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
      object.myData.GENERALINFORMATION.NA[index].dropDown = response.currencyExchange;
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
      object.myData.GENERALINFORMATION.NA[index].dropDown = response.industrygroup;
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
      object.myData.GENERALINFORMATION.NA[index].dropDown = response.region;
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
      object.myData.GENERALINFORMATION.NA[index].dropDown = response.country;
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
      object.myData.GENERALINFORMATION.NA[index].dropDown = response.forbesvertical;
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
      object.myData.GENERALINFORMATION.NA[index].dropDown = response.forbesSubvertical;
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
      object.myData.GENERALINFORMATION.NA[index].dropDown = response.industryvertical;
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
    let length = object.myData.GENERALINFORMATION.NA.length;
    object.activateShowBox(false);
    //reseting general tab
    while (index < length) {
      object.myData.GENERALINFORMATION.NA[index].src_code_value = null;
      object.disabledStatus[index].disabled = false;
      if (object.myData.GENERALINFORMATION.NA[index].src_code == "TD0120") {
        //object.myData.GENERALINFORMATION.NA[index].dropDown = object.countries;
        //now we also clean dropdown of country on reset
        object.myData.GENERALINFORMATION.NA[index].dropDown = [];
      }
      
      //       if (object.myData.GENERALINFORMATION.NA[index].src_code == "ICE000"&&object.hasOnlyCompany) {
      //         object.myData.GENERALINFORMATION.NA[index].src_code_value = object.singleProject[0].key;
      //         object.myData.GENERALINFORMATION.NA[index].dropDown=object.singleProject;
      //         object.getCompanyProjects(1,object.companies[0].key);
      
      //         object.disabledStatus[index].disabled = true;
      // }

      if (object.myData.GENERALINFORMATION.NA[index].src_code == "ICE002") {
        object.disabledStatus[index].disabled = false;
        object.myData.GENERALINFORMATION.NA[index].src_code_value = "FE482E13-D3B6-4208-8C3C-2FD7AFBEBEA1"
      }


      if (object.myData.GENERALINFORMATION.NA[index].src_code == "TD0100") {
        object.myData.GENERALINFORMATION.NA[index].src_code_value = 2019;
      }

      if (object.myData.GENERALINFORMATION.NA[index].src_code == "ICE001" && object.hasOnlyCompany) {
        object.myData.GENERALINFORMATION.NA[index].src_code_value = object.companies[0].key;
        object.disabledStatus[index].disabled = true;
      }


      index++;
    }


    //reseting ApplicationDevelopmentandMaintenanceInput
    index = 0;
    length = object.myData.ApplicationDevelopmentandMaintenanceInput.NA.length;
    while (index < length) {
      object.myData.ApplicationDevelopmentandMaintenanceInput.NA[index].src_code_value = null;
      object.myData.ApplicationDevelopmentandMaintenanceInput.NA[index].notes = null;
      if (object.myData.ApplicationDevelopmentandMaintenanceInput.NA[index].value_format != "%" && object.myData.ApplicationDevelopmentandMaintenanceInput.NA[index].value_format != "#") {
        object.myData.ApplicationDevelopmentandMaintenanceInput.NA[index].value_format = "$";
      }
      index++;
    }

    //AD ApplicationDevelopmentCosts
    index = 0;
    length = object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentCosts.length;
    while (index < length) {
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentCosts[index].src_code_value = null;
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentCosts[index].notes = null;
      if (object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentCosts[index].value_format != "%" && object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentCosts[index].value_format != "#") {
        object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentCosts[index].value_format = "$";
      }
      index++;
    }

    //AD ApplicationDevelopmentFTEs
    index = 0;
    length = object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs.length;
    while (index < length) {
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs[index].src_code_value = null;
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs[index].notes = null;
      if (object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs[index].value_format != "%" && object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs[index].value_format != "#") {
        object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs[index].value_format = "$";
      }
      index++;
    }

    //AD Hours
    index = 0;
    length = object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours.length;
    while (index < length) {
      object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours[index].src_code_value = null;
      object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours[index].notes = null;
      if (object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours[index].value_format != "%" && object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours[index].value_format != "#") {
        object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours[index].value_format = "$";
      }
      index++;
    }

    //AD ApplicationDevelopmentVolumes
    index = 0;
    length = object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes.length;
    while (index < length) {
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes[index].src_code_value = null;
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes[index].notes = null;
      if (object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes[index].value_format != "%" && object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes[index].value_format != "#") {
        object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes[index].value_format = "$";
      }
      index++;
    }

    //AD Projecteffortsallocation
    index = 0;
    length = object.myData.ApplicationDevelopmentInput.Projecteffortsallocation.length;
    while (index < length) {
      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[index].src_code_value = null;
      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[index].notes = null;
      if (object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[index].value_format != "%" && object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[index].value_format != "#") {
        object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[index].value_format = "$";
      }
      index++;
    }

    //reseting ...

    //reseting ApplicationMaintenanceandSupportInput Values
    // index = 0;

    // length = object.myData.ApplicationMaintenanceandSupportInput.NA.length;

    // while (index < length) {

    //   object.myData.ApplicationMaintenanceandSupportInput.NA[index].src_code_value = null;
    //   object.myData.ApplicationMaintenanceandSupportInput.NA[index].notes = null;
    //   if (object.myData.ApplicationMaintenanceandSupportInput.NA[index].value_format != "%" && object.myData.ApplicationMaintenanceandSupportInput.NA[index].value_format != "#") {
    //     object.myData.ApplicationMaintenanceandSupportInput.NA[index].value_format = "$";
    //   }
    //   index++;
    // }

    //AM ApplicationMaintenanceCosts
    index = 0;
    length = object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts.length;

    while (index < length) {

      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts[index].src_code_value = null;
      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts[index].notes = null;
      if (object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts[index].value_format != "%" && object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts[index].value_format != "#") {
        object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts[index].value_format = "$";
      }
      index++;
    }

    //AM ApplicationMaintenanceCosts
    index = 0;
    length = object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs.length;

    while (index < length) {

      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs[index].src_code_value = null;
      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs[index].notes = null;
      if (object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs[index].value_format != "%" && object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs[index].value_format != "#") {
        object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs[index].value_format = "$";
      }
      index++;
    }


    //AM hours
    index = 0;
    length = object.myData.ApplicationMaintenanceandSupportInput.applicationmaintenancehours.length;

    while (index < length) {

      object.myData.ApplicationMaintenanceandSupportInput.applicationmaintenancehours[index].src_code_value = null;
      object.myData.ApplicationMaintenanceandSupportInput.applicationmaintenancehours[index].notes = null;
      if (object.myData.ApplicationMaintenanceandSupportInput.applicationmaintenancehours[index].value_format != "%" && object.myData.ApplicationMaintenanceandSupportInput.applicationmaintenancehours[index].value_format != "#") {
        object.myData.ApplicationMaintenanceandSupportInput.applicationmaintenancehours[index].value_format = "$";
      }
      index++;
    }

    //AM ApplicationMaintenanceVolumes
    index = 0;
    length = object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes.length;

    while (index < length) {

      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes[index].src_code_value = null;
      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes[index].notes = null;
      if (object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes[index].value_format != "%" && object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes[index].value_format != "#") {
        object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes[index].value_format = "$";
      }
      index++;
    }


    //AM defects
    index = 0;
    length = object.myData.ApplicationMaintenanceandSupportInput.Defectseveritytype.length;
    
    while (index < length) {

      object.myData.ApplicationMaintenanceandSupportInput.Defectseveritytype[index].src_code_value = null;
      object.myData.ApplicationMaintenanceandSupportInput.Defectseveritytype[index].notes = null;
      if (object.myData.ApplicationMaintenanceandSupportInput.Defectseveritytype[index].value_format != "%" && object.myData.ApplicationMaintenanceandSupportInput.Defectseveritytype[index].value_format != "#") {
        object.myData.ApplicationMaintenanceandSupportInput.Defectseveritytype[index].value_format = "$";
      }
      index++;
    }


    //angular way of doing document.getElementById
    object.ADMPerTag.nativeElement.innerHTML = '0%';
    object.generalPercentTag.nativeElement.innerHTML = '0%';
    object.overAllPercentTag.nativeElement.innerHTML = '0%';
    object.AMPerTag.nativeElement.innerHTML = '0%';
    object.ADPerTag.nativeElement.innerHTML = '0%';

    //form validation
    object.ADMOcnditionsFulfilled = true;
    object.ADDevHoursConditionsFulfilled = true;
    object.ADEffortsConditionsFulfilled = true;
    object.ADConditionsFulfilled = true;
    object.AMHoursConditionsFulfilled = true;
    object.AMDefectsConditionsFulfilled = true;
    object.isFormValid = true;
    object.isDeleteAllowed = false;

  }


  changePlaceHolder(placeHolder) {
    let object = this;
    
    let index = 0;

    //setting Place holder for ApplicationDevelopmentandMaintenanceInput
    length = object.myData.ApplicationDevelopmentandMaintenanceInput.NA.length;
    while (index < length) {
      if (object.myData.ApplicationDevelopmentandMaintenanceInput.NA[index].value_format != "%" && object.myData.ApplicationDevelopmentandMaintenanceInput.NA[index].value_format != "#") {
        object.myData.ApplicationDevelopmentandMaintenanceInput.NA[index].value_format = placeHolder;
      }
      index++;
    }

    
    //setting Place holder for   ApplicationDevelopmentInput tab
    index = 0;
    length = object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentCosts.length;
    while (index < length) {
      if (object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentCosts[index].value_format != "%" && object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentCosts[index].value_format != "#") {
        object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentCosts[index].value_format = placeHolder;
      }
      index++;
    }

    index = 0;
    length = object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs.length;
    while (index < length) {
      if (object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs[index].value_format != "%" && object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs[index].value_format != "#") {
        object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs[index].value_format = placeHolder;
      }
      index++;
    }


    index = 0;
    length = object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours.length;
    while (index < length) {
      if (object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours[index].value_format != "%" && object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours[index].value_format != "#") {
        object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours[index].value_format = placeHolder;
      }
      index++;
    }


    index = 0;
    length = object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes.length;
    while (index < length) {
      if (object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes[index].value_format != "%" && object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes[index].value_format != "#") {
        object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes[index].value_format = placeHolder;
      }
      index++;
    }


    index = 0;
    length = object.myData.ApplicationDevelopmentInput.Projecteffortsallocation.length;
    while (index < length) {
      if (object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[index].value_format != "%" && object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[index].value_format != "#") {
        object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[index].value_format = placeHolder;
      }
      index++;
    }

    //setting place holder ItOperationSpending Values
    index = 0;

    length = object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts.length;
    while (index < length) {
      if (object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts[index].value_format != "%" && object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts[index].value_format != "#") {
        object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts[index].value_format = placeHolder;
      }
      index++;
    }
    //setting place holder ApplicationMaintenanceandSupportInput.NA
    index = 0;
    length = object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs.length;
    while (index < length) {
      if (object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs[index].value_format != "%" && object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs[index].value_format != "#") {
        object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs[index].value_format = placeHolder;
      }
      index++;
    }
    //
    index = 0;

    length = object.myData.ApplicationMaintenanceandSupportInput.applicationmaintenancehours.length;
    while (index < length) {
      if (object.myData.ApplicationMaintenanceandSupportInput.applicationmaintenancehours[index].value_format != "%" && object.myData.ApplicationMaintenanceandSupportInput.applicationmaintenancehours[index].value_format != "#") {
        object.myData.ApplicationMaintenanceandSupportInput.applicationmaintenancehours[index].value_format = placeHolder;
      }
      index++;
    }
    //setting place holderItOperationSpendingOutsourcedCosts
    index = 0;

    length = object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes.length;
    while (index < length) {
      if (object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes[index].value_format != "%" && object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes[index].value_format != "#") {
        object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes[index].value_format = placeHolder;
      }
      index++;
    }
    //resetting ITOperationSpending.ItSpendingType Value
    index = 0;

    length = object.myData.ApplicationMaintenanceandSupportInput.Defectseveritytype.length;
    while (index < length) {
      if (object.myData.ApplicationMaintenanceandSupportInput.Defectseveritytype[index].value_format != "%" && object.myData.ApplicationMaintenanceandSupportInput.Defectseveritytype[index].value_format != "#") {
        object.myData.ApplicationMaintenanceandSupportInput.Defectseveritytype[index].value_format = placeHolder;
      }
      index++;
    }





  }
  //this will populate all the scenarios
  getScenariosList(defaultScarioId) {


    let object = this;
    object.genericEnterCompare.setPopID(12);
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
        for(let obj of object.myData.GENERALINFORMATION.NA){
          if(obj.src_code == 'ICE000'){
            obj.src_code_value = object.scenarioNameText;
          }
        }
      } catch (error) {
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId": this.pageId,
          "pageName": "Non CIO Service Desk Tower Input My Data Screen",
          "errorType": "warn",
          "errorTitle": "Data Error",
          "errorDescription": error.message,
          "errorObject": error
        }

        throw errorObj;
      }

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
      let length = object.myData.GENERALINFORMATION.NA.length;
      //
      //

      while (index < length) {
        if (object.myData.GENERALINFORMATION.NA[index].src_code === "TDA105") {

          if (response.length === 0 || response == []) {
            object.myData.GENERALINFORMATION.NA[index].dropDown = [];
            break;
          }

          object.myData.GENERALINFORMATION.NA[index].dropDown = response.forbesSubvertical;

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
      let length = object.myData.GENERALINFORMATION.NA.length;
      //
      //

      while (index < length) {
        if (object.myData.GENERALINFORMATION.NA[index].src_code === "ICE008") {

          if (response.length === 0 || response == []) {
            object.myData.GENERALINFORMATION.NA[index].dropDown = [];
            break;
          }

          object.myData.GENERALINFORMATION.NA[index].dropDown = response.industrygroup;

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
      let length = object.myData.GENERALINFORMATION.NA.length;
      while (index < length) {
        if (object.myData.GENERALINFORMATION.NA[index].src_code === "TD0120") {

          if (response.length === 0 || response == []) {
            object.myData.GENERALINFORMATION.NA[index].dropDown = [];
            break;
          }

          object.myData.GENERALINFORMATION.NA[index].dropDown = response.country;

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
      object.myData.GENERALINFORMATION.NA[index].dropDown = [];
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
      object.myData.GENERALINFORMATION.NA[index].dropDown = response.project;


      if (response.project.length == 1) {
        object.myData.GENERALINFORMATION.NA[index].src_code_value = response.project[0].key;
        object.myData.GENERALINFORMATION.NA[index].dropDown = response.project;
        object.disabledStatus[index].disabled = true;
        object.hasOnlyOneProject = true;
        object.singleProject = response.project;
      } else {
        object.hasOnlyOneProject = false;
        object.disabledStatus[index].disabled = false;

      }
      //object.myData.GENERALINFORMATION.NA[index].src_code_value=response.project[0].key;

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

    //loop through ADM form controls
    $("#comapny-finance-card input").each(function (index) {

      if ($(this).val() != '' && $(this).val() != null) {
        completedFinanceElement++;
      }

      totalFinanceElements = index + 1;

    });

    calculatedFinancePercentage = completedFinanceElement / totalFinanceElements * 100;

    $('#fiancial-percentage').text(Math.round(calculatedFinancePercentage) + '%');

    // //loop through AD form controls
    $("#headcount-card input").each(function (index) {

      if ($(this).val() != '' && $(this).val() != null) {
        completedHeadElement++;
      }

      totalHeadElements = index + 1;

    });

    calculatedheadcountPercentage = completedHeadElement / totalHeadElements * 100;

    $('#headcount-percentage').text(Math.round(calculatedheadcountPercentage) + '%');

    // //AM

    $("#itspending-card input").each(function (index) {

      if ($(this).val() != '' && $(this).val() != null) {
        completedSpendElements++;
      }

      totalSpendElements = index + 1;

    });

    calculatedITSpendPercentage = completedSpendElements / totalSpendElements * 100;



    $('#itspending-percentage').text(Math.round(calculatedITSpendPercentage) + '%');

    // //overall calculation
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

    //loop through ADM form controls
    $("#comapny-finance-card input").each(function (index) {

      if ($(this).val() != '' && $(this).val() != null) {
        completedFinanceElement++;
      }

      totalFinanceElements = index + 1;

    });

    calculatedFinancePercentage = completedFinanceElement / totalFinanceElements * 100;

    $('#fiancial-percentage').text(Math.round(calculatedFinancePercentage) + '%');

    // //loop through AD form controls
    $("#headcount-card input").each(function (index) {

      if ($(this).val() != '' && $(this).val() != null) {
        completedHeadElement++;
      }

      totalHeadElements = index + 1;

    });

    calculatedheadcountPercentage = completedHeadElement / totalHeadElements * 100;

    $('#headcount-percentage').text(Math.round(calculatedheadcountPercentage) + '%');

    // //AM

    $("#itspending-card input").each(function (index) {

      if ($(this).val() != '' && $(this).val() != null) {
        completedSpendElements++;
      }

      totalSpendElements = index + 1;

    });

    calculatedITSpendPercentage = completedSpendElements / totalSpendElements * 100;



    $('#itspending-percentage').text(Math.round(calculatedITSpendPercentage) + '%');

    // //overall calculation
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
        "dashboardId": "12",
        "pageName": "ADM Dashboard Input My Data Screen",
        "errorType": "warn",
        "errorTitle": "Data Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    }

    object.generateScenarioService.getSavedScenarioDataToPopulate(object.dashboardId, object.loginUserId, object.selectedScanrio).subscribe((response) => {
      object.compiler.clearCache();
      //object.myData = response;
      //object.getDataStatus();
      object.isCopyEnabled = true;

      let index = 0;
      object.temperoryDisable = false;
      let currenyId;
      let length = object.myData.GENERALINFORMATION.NA.length;

      

      // let swapping = response.GENERALINFORMATION.NA[0];
      // response.GENERALINFORMATION.NA[0] = response.GENERALINFORMATION.NA[1];
      // response.GENERALINFORMATION.NA[1] = swapping;

      // let swapping1 = object.myData.GENERALINFORMATION.NA[0];
      //  let swapping2 = object.myData.GENERALINFORMATION.NA[1];

      //  object.myData.GENERALINFORMATION.NA.splice(0,0,swapping2);
      //  object.myData.GENERALINFORMATION.NA.splice(1,0,swapping1);

      //  object.myData.GENERALINFORMATION.NA.join();

      //  object.myData.GENERALINFORMATION.NA.splice(0,2);


      //object.getCompanyProjects(1, response.GENERALINFORMATION.NA[0].src_code_value);


      while (index < length) {
        object.myData.GENERALINFORMATION.NA[index].src_code_value = response.GENERALINFORMATION.NA[index].src_code_value;
        //enabling disabling company and project dropdowns
        // if (index == 0 || index == 1) {
        //   object.disabledStatus[index].disabled = true;
       
        // } else {
        //   object.disabledStatus[index].disabled = false;

        // }
        //getting countries related to that region
        if (object.myData.GENERALINFORMATION.NA[index].src_code == "TD0110") {
          object.updateCountryDropDown(object.myData.GENERALINFORMATION.NA[index].src_code_value);
        }
        if (object.myData.GENERALINFORMATION.NA[index].src_code == "ICE007") {
          object.updateIndustryGroup(object.myData.GENERALINFORMATION.NA[index].src_code_value);
        }
        if (object.myData.GENERALINFORMATION.NA[index].src_code == "TDA100") {
          object.updateForbesSubVertical(object.myData.GENERALINFORMATION.NA[index].src_code_value);
        }
        if (object.myData.GENERALINFORMATION.NA[index].src_code == "ICE002") {
          currenyId = object.myData.GENERALINFORMATION.NA[index].src_code_value
          //changing placeholder acc to currency present in selected scenario

        }
        if (object.myData.GENERALINFORMATION.NA[index].src_code == "ICE000") {
          object.scenarioNameText = object.myData.GENERALINFORMATION.NA[index].src_code_value;
        }
        index++;

      }

      object.myData.ApplicationDevelopmentandMaintenanceInput = response.ApplicationDevelopmentandMaintenanceInput;
      object.myData["ApplicationDevelopmentInput"] = response["ApplicationDevelopmentInput"];
      object.myData.ApplicationMaintenanceandSupportInput = response.ApplicationMaintenanceandSupportInput;
      //Swapping of fields starts
      //Swapping of AD Input starts

      //swapping applicaion development hours values  
      
      let adHourTempValues = object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours;
      let adhourtemp1;
      let adhourtemp2;
      let adhourtemp3;
      let adhourtemp4;
      let adhourtemp5;



      for (let adHourObj of adHourTempValues) {
        if (adHourObj.src_code == 'P51000') {
          adhourtemp1 = adHourObj;
        } else if (adHourObj.src_code == 'P51005') {
          adhourtemp2 = adHourObj;
        } else if (adHourObj.src_code == 'P51020') {
          adhourtemp3 = adHourObj;
        } else if (adHourObj.src_code == 'P51025') {
          adhourtemp4 = adHourObj;
        } else if (adHourObj.src_code == 'P21090') {
          adhourtemp5 = adHourObj;
        }


      }

      object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours[0] = adhourtemp1;
      object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours[1] = adhourtemp2;
      object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours[2] = adhourtemp3;
      object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours[3] = adhourtemp4;
      object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours[4] = adhourtemp5;
      //SWapping AD hours ends

      //swapping Application development and maintenance values
      let ADMTempValues = object.myData.ApplicationDevelopmentandMaintenanceInput.NA;
      let temp1;
      let temp2;
      let temp3;
      let temp4;
      let temp5;
      let temp6;
      let temp7;
      let temp8;
      let temp9;
      let temp10;


      for (let admObj of ADMTempValues) {
        if (admObj.src_code == 'AMR110') {
          temp1 = admObj;
        } else if (admObj.src_code == 'EXA010') {
          temp2 = admObj;
        } else if (admObj.src_code == 'EXA020') {
          temp3 = admObj;
        } else if (admObj.src_code == 'EXA030') {
          temp4 = admObj;
        } else if (admObj.src_code == 'AMR300') {
          temp5 = admObj;
        } else if (admObj.src_code == 'PR0900') {
          temp6 = admObj;
        } else if (admObj.src_code == 'AMR455') {
          temp7 = admObj;
        } else if (admObj.src_code == 'AMR460') {
          temp8 = admObj;
        } else if (admObj.src_code == 'AMR465') {
          temp9 = admObj;
        } else if (admObj.src_code == 'AMR470') {
          temp10 = admObj;
        }
      }
      object.myData.ApplicationDevelopmentandMaintenanceInput.NA[0] = temp1;
      object.myData.ApplicationDevelopmentandMaintenanceInput.NA[1] = temp2;
      object.myData.ApplicationDevelopmentandMaintenanceInput.NA[2] = temp3;
      object.myData.ApplicationDevelopmentandMaintenanceInput.NA[3] = temp4;
      object.myData.ApplicationDevelopmentandMaintenanceInput.NA[4] = temp5;
      object.myData.ApplicationDevelopmentandMaintenanceInput.NA[5] = temp6;
      object.myData.ApplicationDevelopmentandMaintenanceInput.NA[6] = temp7;
      object.myData.ApplicationDevelopmentandMaintenanceInput.NA[7] = temp8;
      object.myData.ApplicationDevelopmentandMaintenanceInput.NA[8] = temp9;
      object.myData.ApplicationDevelopmentandMaintenanceInput.NA[9] = temp10;
      //swapping Application development and maintenance values ends

      //swapping Application Development Costs values
      let temp11;
      let temp12;
      let temp13;
      let temp14;
      let ADCostValues = object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentCosts;
      for (let adCost of ADCostValues) {

        if (adCost.src_code == 'DAD150') {
          temp11 = adCost;
        } else if (adCost.src_code == 'DAD155') {
          temp12 = adCost;
        } else if (adCost.src_code == 'DAD170') {
          temp13 = adCost;
        } else if (adCost.src_code == 'DAD165') {
          temp14 = adCost;
        }

      }
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentCosts[0] = temp11;
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentCosts[1] = temp12;
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentCosts[2] = temp13;
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentCosts[3] = temp14;

      //swapping Application Development Costs values ends

      //swapping Application Development FTEs values
      let temp15;
      let temp16;
      let temp17;
      let ADFTEValues = object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs;

      for (let adFTE of ADFTEValues) {
        if (adFTE.src_code == 'EAD010') {
          temp15 = adFTE;
        } else if (adFTE.src_code == 'EAD020') {
          temp16 = adFTE;
        } else if (adFTE.src_code == 'EAD030') {
          temp17 = adFTE;
        }
      }
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs[0] = temp15;
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs[1] = temp16;
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs[2] = temp17;

      //swapping Application Development FTEsends

      //swapping ApplicationDevelopmentVolumes values
      let ADVolumesValues = object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes;
      let temp18;
      let temp19;
      let temp20;
      let temp21;
      let temp22;
      let temp23;

      for (let adVolume of ADVolumesValues) {
        if (adVolume.src_code == 'ADR300') {
          temp18 = adVolume;
        } else if (adVolume.src_code == 'P21055') {
          temp19 = adVolume;
        } else if (adVolume.src_code == 'P21085') {
          temp20 = adVolume;
        } else if (adVolume.src_code == 'P77010') {
          temp21 = adVolume;
        } else if (adVolume.src_code == 'P67085') {
          temp22 = adVolume;
        } else if (adVolume.src_code == 'P77050') {
          temp23 = adVolume;
        }
      }
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes[0] = temp18;
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes[1] = temp19;
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes[2] = temp20;
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes[3] = temp21;
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes[4] = temp22;
      object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes[5] = temp23;


      //swapping ApplicationDevelopmentVolumes values ends

      //swapping Projecteffortsallocation values 
      let projectEffortsValues = object.myData.ApplicationDevelopmentInput.Projecteffortsallocation;
      let temp24;
      let temp25;
      let temp26;
      let temp27;
      let temp28;
      let temp29;
      let temp30;
      let temp31;
      let temp32;
      let temp33;
      let temp34;
      let temp35;
      let temp36;
      let temp37;

      for (let projectCost of projectEffortsValues) {
        if (projectCost.src_code == 'P1R250') {
          temp24 = projectCost;
        } else if (projectCost.src_code == 'P1R251') {
          temp25 = projectCost;
        } else if (projectCost.src_code == 'P1R255') {
          temp26 = projectCost;
        } else if (projectCost.src_code == 'P1R256') {
          temp27 = projectCost;
        } else if (projectCost.src_code == 'P1R260') {
          temp28 = projectCost;
        } else if (projectCost.src_code == 'P1R261') {
          temp29 = projectCost;
        } else if (projectCost.src_code == 'P1R265') {
          temp30 = projectCost;
        } else if (projectCost.src_code == 'P1R266') {
          temp31 = projectCost;
        } else if (projectCost.src_code == 'P1R270') {
          temp32 = projectCost;
        } else if (projectCost.src_code == 'P1R271') {
          temp33 = projectCost;
        } else if (projectCost.src_code == 'P1R275') {
          temp34 = projectCost;
        } else if (projectCost.src_code == 'P1R276') {
          temp35 = projectCost;
        } else if (projectCost.src_code == 'P1R280') {
          temp36 = projectCost;
        } else if (projectCost.src_code == 'P1R281') {
          temp37 = projectCost;
        }
      }

      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[0] = temp24;
      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[1] = temp25;
      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[2] = temp26;
      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[3] = temp27;
      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[4] = temp28;
      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[5] = temp29;
      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[6] = temp30;
      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[7] = temp31;
      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[8] = temp32;
      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[9] = temp33;
      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[10] = temp34;
      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[11] = temp35;
      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[12] = temp36;
      object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[13] = temp37;

      //swapping Projecteffortsallocation values ends

      //Swapping of AD Input Ends

      //Swapping of ApplicationMaintenanceandSupportInput starts
      //swapping AM hours values   
      let temp38;
      let temp39;
      let temp40;
      let temp41;
      let temp42;
      let AMHoursData = object.myData.ApplicationMaintenanceandSupportInput.applicationmaintenancehours;
      for (let amHours of AMHoursData) {

        if (amHours.src_code == 'Q31000') {
          temp38 = amHours;
        } else if (amHours.src_code == 'Q31005') {
          temp39 = amHours;
        } else if (amHours.src_code == 'Q31020') {
          temp40 = amHours;
        } else if (amHours.src_code == 'Q31025') {
          temp41 = amHours;
        } else if (amHours.src_code == 'Q31090') {
          temp42 = amHours;
        }
      }
      object.myData.ApplicationMaintenanceandSupportInput.applicationmaintenancehours[0] = temp38;
      object.myData.ApplicationMaintenanceandSupportInput.applicationmaintenancehours[1] = temp39;
      object.myData.ApplicationMaintenanceandSupportInput.applicationmaintenancehours[2] = temp40;
      object.myData.ApplicationMaintenanceandSupportInput.applicationmaintenancehours[3] = temp41;
      object.myData.ApplicationMaintenanceandSupportInput.applicationmaintenancehours[4] = temp42;
      //SWapping AM hours ends

      ///swapping ApplicationMaintenanceCosts
      let AMCostValues = object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts;
      let temp43;
      let temp44;
      let temp45;
      let temp46;

      for (let amCost of AMCostValues) {
        if (amCost.src_code == 'DAM150') {
          temp43 = amCost;
        } else if (amCost.src_code == 'DAM155') {
          temp44 = amCost;
        } else if (amCost.src_code == 'DAM170') {
          temp45 = amCost;
        } else if (amCost.src_code == 'DAM165') {
          temp46 = amCost;
        }
      }

      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts[0] = temp43;
      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts[1] = temp44;
      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts[2] = temp45;
      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts[3] = temp46;

      //swapping ApplicationMaintenanceCosts ends

      //Swapping ApplicationMaintenanceFTEs 
      let AMFTEValues = object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs;
      let temp47;
      let temp48;
      let temp49;
      for (let amFTE of AMFTEValues) {
        if (amFTE.src_code == 'EAM010') {
          temp47 = amFTE;
        } else if (amFTE.src_code == 'EAM020') {
          temp48 = amFTE;
        } else if (amFTE.src_code == 'EAM030') {
          temp49 = amFTE;
        }
      }
      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs[0] = temp47;;
      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs[1] = temp48;
      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs[2] = temp49;;
      //Swapping ApplicationMaintenanceFTEs ends

      //Swapping Defectseveritytype
      let defectSeverityTypeValues = object.myData.ApplicationMaintenanceandSupportInput.Defectseveritytype;
      let temp50;
      let temp51;
      let temp52;

      let temp53;
      for (let defectSev of defectSeverityTypeValues) {
        if (defectSev.src_code == 'Q67070') {
          temp50 = defectSev;
        } else if (defectSev.src_code == 'Q67075') {
          temp51 = defectSev;
        } else if (defectSev.src_code == 'Q67080') {
          temp52 = defectSev;
        } else if (defectSev.src_code == 'Q67085') {
          temp53 = defectSev;
        }
      }

      object.myData.ApplicationMaintenanceandSupportInput.Defectseveritytype[0] = temp50;
      object.myData.ApplicationMaintenanceandSupportInput.Defectseveritytype[1] = temp51;
      object.myData.ApplicationMaintenanceandSupportInput.Defectseveritytype[2] = temp52;
      object.myData.ApplicationMaintenanceandSupportInput.Defectseveritytype[3] = temp53
      //Swapping Defectseveritytype ends

      //Swapping ApplicationMaintenanceVolumes
      let AMVolumesValues = object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes;
      let temp54;
      let temp55;
      let temp56;
      let temp57;
      let temp58;
      let temp59;
      for (let amVolume of AMVolumesValues) {

        if (amVolume.src_code == 'Q3R010') {
          temp54 = amVolume;
        } else if (amVolume.src_code == 'Q37000') {
          temp55 = amVolume;
        } else if (amVolume.src_code == 'Q67010') {
          temp56 = amVolume;
        } else if (amVolume.src_code == 'Q67110') {
          temp57 = amVolume;
        } else if (amVolume.src_code == 'Q78110') {
          temp58 = amVolume;
        } else if (amVolume.src_code == 'Q78120') {
          temp59 = amVolume;
        }
      }

      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes[0] = temp54;
      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes[1] = temp55;
      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes[2] = temp56;
      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes[3] = temp57;
      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes[4] = temp58;
      object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes[5] = temp59;

      //Swapping ApplicationMaintenanceVolumes ends

      //Swapping of ApplicationMaintenanceandSupportInput ends
      //Swapping of all fields ends
      //alert(JSON.stringify(object.selectedScanrio));


      // alert('before calling');
      //object.calculatePercentage();

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


      //general section percentage

      for (let element = 0; element < object.myData.GENERALINFORMATION.NA.length; element++) {
        if (object.myData.GENERALINFORMATION.NA[element].src_code_value != null
          || object.myData.GENERALINFORMATION.NA[element].src_code_value != undefined
          || object.myData.GENERALINFORMATION.NA[element].src_code_value != '') {
          completedGeneralElement++;
        }

        totalGeneralElements = element + 1;
      }

      calculatedGeneralPercentage = completedGeneralElement / totalGeneralElements * 100;


      $('#general-percentage').text(Math.round(calculatedGeneralPercentage) + '%');

      //ADM section percentage
      //loop through ADM form controls
      
      for (let element = 0; element < object.myData.ApplicationDevelopmentandMaintenanceInput.NA.length; element++) {
        if (object.myData.ApplicationDevelopmentandMaintenanceInput.NA[element].src_code_value != null
          && object.myData.ApplicationDevelopmentandMaintenanceInput.NA[element].src_code_value != "") {
          completedFinanceElement++;
        }
        else {
          //alert('empty');
        }

        //totalFinanceElements = element + 1;
      }

      totalFinanceElements = 10;
      //alert(completedFinanceElement);

      calculatedFinancePercentage = completedFinanceElement / totalFinanceElements * 100;


      $('#headcount-percentage').text(Math.round(calculatedFinancePercentage) + '%');

      //AD percentage


      for (let element = 0; element < object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentCosts.length; element++) {
        if (object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentCosts[element].src_code_value != null
          && object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentCosts[element].src_code_value != "") {
          completedHeadElement++;
        }

        //totalHeadElements = element + 1;
      }


      for (let element = 0; element < object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs.length; element++) {
        if (object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs[element].src_code_value != ""
          && object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs[element].src_code_value != null) {
          completedHeadElement++;
        }

        //totalHeadElements = element + 1;
      }

      for (let element = 0; element < object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours.length; element++) {
        if (object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours[element].src_code_value != ""
          && object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours[element].src_code_value != null) {
          completedHeadElement++;
        }

        //totalHeadElements = element + 1;
      }

      for (let element = 0; element < object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes.length; element++) {
        if (object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes[element].src_code_value != ""
          && object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes[element].src_code_value != null) {
          completedHeadElement++;
        }

        //totalHeadElements = element + 1;
      }

      for (let element = 0; element < object.myData.ApplicationDevelopmentInput.Projecteffortsallocation.length; element++) {
        if (object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[element].src_code_value != ""
          && object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[element].src_code_value != null) {
          completedHeadElement++;
        }

        //totalHeadElements = element + 1;
      }

      
      // totalHeadElements = parseInt(object.myData.ApplicationDevelopmentInput.Projecteffortsallocation.length)
      // +parseInt(object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes.length)
      // +parseInt(object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours.length)
      // +parseInt(object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs.length)
      // parseInt(object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentCosts.length)

      // alert('totalHeadElements '+totalHeadElements);
      // alert('completedHeadElement '+completedHeadElement);

      totalHeadElements = 32;

      calculatedheadcountPercentage = completedHeadElement / totalHeadElements * 100;

      $('#fiancial-percentage').text(Math.round(calculatedheadcountPercentage) + '%');


      //AM percentage
      
      for (let element = 0; element < object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts.length; element++) {
        //alert(object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts[element].src_code_value);
        if (object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts[element].src_code_value != ""
          && object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts[element].src_code_value != null) {
          completedSpendElements++;
        }
        else {
          //alert('empty value');
        }

        //totalSpendElements = element + 1;
      }


      for (let element = 0; element < object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs.length; element++) {
        if (object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs[element].src_code_value != ""
          && object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs[element].src_code_value != null) {
          completedSpendElements++;
        }
        else {

        }

        //totalSpendElements = element + 1;
      }


      for (let element = 0; element < object.myData.ApplicationMaintenanceandSupportInput.applicationmaintenancehours.length; element++) {
        if (object.myData.ApplicationMaintenanceandSupportInput.applicationmaintenancehours[element].src_code_value != ""
          && object.myData.ApplicationMaintenanceandSupportInput.applicationmaintenancehours[element].src_code_value != null) {
          completedSpendElements++;
        }
        else {

        }

        //totalSpendElements = element + 1;
      }


      for (let element = 0; element < object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes.length; element++) {
        if (object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes[element].src_code_value != ""
          && object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes[element].src_code_value != null) {
          completedSpendElements++;
        }

        //totalSpendElements = element + 1;
      }


      for (let element = 0; element < object.myData.ApplicationMaintenanceandSupportInput.Defectseveritytype.length; element++) {
        if (object.myData.ApplicationMaintenanceandSupportInput.Defectseveritytype[element].src_code_value != ""
          && object.myData.ApplicationMaintenanceandSupportInput.Defectseveritytype[element].src_code_value != null) {
          completedSpendElements++;
        }
        else {

        }

        //totalSpendElements = element + 1;
      }

      totalSpendElements = 22;

      calculatedITSpendPercentage = completedSpendElements / totalSpendElements * 100;


      $('#itspending-percentage').text(Math.round(calculatedITSpendPercentage) + '%');

      // //overall calculation
      overallcompletedElements = completedGeneralElement + completedFinanceElement + completedHeadElement + completedSpendElements;
      overallTotalelements = totalGeneralElements + totalFinanceElements + totalHeadElements + totalSpendElements;
      overallCalculatedpercentage = overallcompletedElements / overallTotalelements * 100;


      $('#overall-percentage').text(Math.round(overallCalculatedpercentage) + '%');

      //object.calculatePercentage();

      object.changePlaceHolder(getCurrencySymbol(object.currencyMap[currenyId], "narrow"));

      // setTimeout(() => {
      //   object.calculatePercentage();
      // }, 5000);

      //object.calculatePercentage();


      object.isDeleteAllowed = true;

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
    let length = object.myData.GENERALINFORMATION.NA.length;

    //reseting general tab
    while (index < length) {
      object.sourceCurrencyMap[object.myData.GENERALINFORMATION.NA[index].src_code] = object.myData.GENERALINFORMATION.NA[index].value_format;

      index++;
    }

    //reseting ApplicationDevelopmentandMaintenanceInput
    index = 0;
    length = object.myData.ApplicationDevelopmentandMaintenanceInput.NA.length;
    while (index < length) {
      object.sourceCurrencyMap[object.myData.ApplicationDevelopmentandMaintenanceInput.NA[index].src_code] = object.myData.ApplicationDevelopmentandMaintenanceInput.NA[index].value_format;
      index++;
    }
    //reseting   ApplicationDevelopmentInput tab
    index = 0;
    length = object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentCosts.length;
    while (index < length) {
      object.sourceCurrencyMap[object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentCosts[index].src_code] = object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentCosts[index].value_format;
      index++;
    }

    //reseting Users&Locations
    index = 0;
    length = object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs.length;
    while (index < length) {
      object.sourceCurrencyMap[object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs[index].src_code] = object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs[index].value_format;
      index++;
    }
    //reseting ...
    index = 0;
    length = object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours.length;
    while (index < length) {
      object.sourceCurrencyMap[object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours[index].src_code] = object.myData.ApplicationDevelopmentInput.Applicationdevelopmenthours[index].value_format;
      index++;
    }


    //reseting HeadcountBreakdown
    index = 0;
    length = object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes.length;
    while (index < length) {
      object.sourceCurrencyMap[object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes[index].src_code] = object.myData.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes[index].value_format;
      index++;
    }


    index = 0;
    length = object.myData.ApplicationDevelopmentInput.Projecteffortsallocation.length;
    while (index < length) {
      object.sourceCurrencyMap[object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[index].src_code] = object.myData.ApplicationDevelopmentInput.Projecteffortsallocation[index].value_format;
      index++;
    }

    //reseting ItOperationSpending Values
    index = 0;

    length = object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts.length;
    while (index < length) {
      object.sourceCurrencyMap[object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts[index].src_code] = object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts[index].value_format;
      index++;
    }
    //resting ApplicationMaintenanceandSupportInput.NA
    index = 0;
    length = object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs.length;
    while (index < length) {
      object.sourceCurrencyMap[object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs[index].src_code] = object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs[index].value_format;
      index++;
    }
    //
    index = 0;

    length = object.myData.ApplicationMaintenanceandSupportInput.applicationmaintenancehours.length;
    while (index < length) {
      object.sourceCurrencyMap[object.myData.ApplicationMaintenanceandSupportInput.applicationmaintenancehours[index].src_code] = object.myData.ApplicationMaintenanceandSupportInput.applicationmaintenancehours[index].value_format;
      index++;
    }
    //reseting ItOperationSpendingOutsourcedCosts
    index = 0;

    length = object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes.length;
    while (index < length) {
      object.sourceCurrencyMap[object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes[index].src_code] = object.myData.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes[index].value_format;
      index++;
    }
    //resetting ITOperationSpending.ItSpendingType Value
    index = 0;

    length = object.myData.ApplicationMaintenanceandSupportInput.Defectseveritytype.length;
    while (index < length) {
      object.sourceCurrencyMap[object.myData.ApplicationMaintenanceandSupportInput.Defectseveritytype[index].src_code] = object.myData.ApplicationMaintenanceandSupportInput.Defectseveritytype[index].value_format;
      index++;
    }

  }



  validateTotEmpNumberThresholds(val, placeholder, event, totalEmp) {

    this.validateNumberThresholds(val, placeholder, event);

    //placeholder
    // if (placeholder == '%') {
    //   event.target.value = event.target.value.toString().replace(/,/g,"");
    //     // if (Number(event.target.value) > 100) {
    //     //   totalEmp.src_code_value = 100;
    //     // }
    // }

  }

  validateNumberUserLocThresholds(val, placeholder, event, userAndLocation) {

    this.validateNumberThresholds(val, placeholder, event);

    //placeholder
    if (placeholder == '%') {
      event.target.value = event.target.value.toString().replace(/,/g, "");
      if (Number(event.target.value) > 100) {
        userAndLocation.src_code_value = 100;
      }
    }

  }

  validateTotalHeadNumberThresholds(val, placeholder, event, totalHeadcount) {


    this.validateNumberThresholds(val, placeholder, event);

    //placeholder
    if (placeholder == '%') {
      event.target.value = event.target.value.toString().replace(/,/g, "");
      if (Number(event.target.value) > 100) {
        totalHeadcount.src_code_value = 100;
      }
    }

  }

  validateNumberHeadcountThresholds(val, placeholder, event, subcatOfHeadcount) {


    this.validateNumberThresholds(val, placeholder, event);

    //placeholder
    if (placeholder == '%') {
      event.target.value = event.target.value.toString().replace(/,/g, "");
      if (Number(event.target.value) > 100) {
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
      event.target.value = event.target.value.toString().replace(/,/g, "");
      if (Number(event.target.value) > 100) {
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
      event.target.value = event.target.value.toString().replace(/,/g, "");
      if (Number(event.target.value) > 100) {
        demographicalBreakdown.src_code_value = 100;
      }
    }

  }

  validateOutsourceNumberThresholds(val, placeholder, event, outsourcedCosts) {

    this.validateNumberThresholds(val, placeholder, event);

    //placeholder
    if (placeholder == '%') {
      event.target.value = event.target.value.toString().replace(/,/g, "");
      if (Number(event.target.value) > 100) {
        outsourcedCosts.src_code_value = 100;
      }
    }

  }

  validateITSpendNumberThresholds(val, placeholder, event, itSpendingType) {

    this.validateNumberThresholds(val, placeholder, event);

    //placeholder
    if (placeholder == '%') {
      event.target.value = event.target.value.toString().replace(/,/g, "");
      if (Number(event.target.value) > 100) {
        itSpendingType.src_code_value = 100;
      }
    }

  }

  validateRunNumberThresholds(val, placeholder, event, itRunvsChangevsTransform) {

    this.validateNumberThresholds(val, placeholder, event);

    //placeholder
    if (placeholder == '%') {
      event.target.value = event.target.value.toString().replace(/,/g, "");
      if (Number(event.target.value) > 100) {
        itRunvsChangevsTransform.src_code_value = 100;
      }
    }

  }


  validateCAPOpNumberThresholds(val, placeholder, event, capitalvsoperational) {
    this.validateNumberThresholds(val, placeholder, event);

    //placeholder
    if (placeholder == '%') {
      event.target.value = event.target.value.toString().replace(/,/g, "");
      if (Number(event.target.value) > 100) {
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
      event.target.value = event.target.value.toString().replace(/,/g, "");
      if (Number(event.target.value) > 100) {
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
      $("#adm-collapse-link1").attr("aria-expanded", true);
      $("#adm-collapse1").addClass("show");
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
      $('.modal-select-to-compare-adm').modal('hide');
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

  //  Track
  customTrackBy(index: number, obj: any): any {
    return index;
  }
  //  Track


  //it will be invoked when you click on any dropdown in general tab
  interceptGeneralTabChange(srcCode) {

    let object = this;
    let inputTags = object.myData.GENERALINFORMATION.NA;
    object.activateShowBox(true);
    if (srcCode == "ICE001") {
      for (let inputTag of inputTags) {
        if (inputTag.src_code == "ICE001") {

          object.setDefaultValues();
          object.myData.GENERALINFORMATION.NA[object.indexSourceCodeMap["ICE000"]].src_code_value = null;
          object.myData.GENERALINFORMATION.NA[object.indexSourceCodeMap["ICE000"]].dropDown = [];
          object.getCompanyData(inputTag.src_code_value);

        }
      }
    }

    if (srcCode == "TD0110") {
      for (let inputTag of inputTags) {
        if (inputTag.src_code == "TD0110") {
          object.myData.GENERALINFORMATION.NA[object.indexSourceCodeMap["TD0120"]].src_code_value = null;
          object.myData.GENERALINFORMATION.NA[object.indexSourceCodeMap["TD0120"]].dropDown = [];
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


          object.myData.GENERALINFORMATION.NA[object.indexSourceCodeMap["ICE008"]].src_code_value = null;
          object.myData.GENERALINFORMATION.NA[object.indexSourceCodeMap["ICE008"]].dropDown = [];
          object.updateIndustryGroup(inputTag.src_code_value);

        }

      }
    }
    if (srcCode == "TDA100") {
      for (let inputTag of inputTags) {
        if (inputTag.src_code == "TDA100") {


          object.myData.GENERALINFORMATION.NA[object.indexSourceCodeMap["TDA105"]].src_code_value = null;
          object.myData.GENERALINFORMATION.NA[object.indexSourceCodeMap["TDA105"]].dropDown = [];
          object.updateForbesSubVertical(inputTag.src_code_value);

        }

      }
    }

    if (srcCode == "ICE002") {
      for (let inputTag of inputTags) {
        if (inputTag.src_code == "ICE002") {



          let value = object.myData.GENERALINFORMATION.NA[object.indexSourceCodeMap["ICE002"]].src_code_value;
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

  //% threshold and -ve value validation
  validateCompFinNumberThresholds(val, placeholder, event, companyFinancialInfo) {


    // if(companyFinancialInfo.src_code != 'TDB200'){
    //   this.validateNumberThresholds(val, placeholder, event);
    // }

    //placeholder
    if (placeholder == '%') {
      //event.target.value = event.target.value.toString().replace(/,/g,"");
      // if (Number(event.target.value) > 100) {
      //   companyFinancialInfo.src_code_value = 100;
      // }
    }


    if (val != null && val != undefined) {
      if (val.split('.').length > 0) {
        var decimalplaces = val.split('.')[1].length;
        var temp1 = val.split('.')[0];
        var temp2 = val.split('.')[1];

        if (decimalplaces > 6) {
          temp2 = temp2.substring(0, 6);
          companyFinancialInfo.src_code_value = temp1 + '.' + temp2;
        }

      }

    }



  }

  unmaskComma(value) {
    let val: any;

    val = (value.toString()).replace(/,/g, "");

    return val;
  }

  //this is to open delete modal
  deleteScenario() {
    let object = this;
    object.confirmBoxDeleteFlag = true;
  }

  deleteConfirmYes(flag){
    let object = this;
    if(flag){
      let userId = object.loggedInUserInfo['userDetails']['emailId'];
      let requestObj = {
        "userId": userId,
        "dashboardID":12,
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
          object.updateScenarioListNotificationServiceService.getEmitter().emit('updateADMScenarioListAfterDeletion');
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
    for(let obj of object.myData.GENERALINFORMATION.NA){
      if(obj.src_code == 'ICE000'){
        obj.src_code_value = '';
      }
    }
  
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

