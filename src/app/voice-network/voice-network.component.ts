/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:voice-network.component.ts **/
/** Description: This file is created to get the ladning page data, filter related data and compare/input my data with drill downs (Chart) **/
/** Created By: 10651577  Created Date: 28/09/2018 **/
/** Update By:  10650919  Update Date:  03/10/2018 **/
/*******************************************************/

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FilterDataService } from '../services/filter-data.service'
import { IndustrySizeService } from '../services/industry-size.service'
import { FilterData } from '../entities/filter-data';
import { IsgKpiData } from '../entities/isg-kpi-data';
import { CioheaderdataService } from '../services/cioheaderdata.service';
import { ChartCIOSharedService } from '../services/chart-cioshared.service';
import { EventEmitter } from 'protractor';
import { HeaderCompareScreenDataService } from '../services/header-compare-screen-data.service';
import { CompareComponent } from '../Compare/compare.component';
import { DropDownService } from '../services/drop-down.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { VoiceService } from '../services/network/voice/voice.service';

import { MapSourceCodeDataValues } from '../map-source-code-data-values';

import { VoiceInputMydataSharedService } from '../services/network/voice/voice-input-mydata-shared.service';

import { negativeConstant } from '../../properties/constant-values-properties';
import { EnterCompareDataTowersService } from '../services/enter-compare-data-towers.service';
import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';
import { GenerateScenarioService } from '../services/generate-scenario.service';
import { UpdateScenarioListNotificationServiceService } from '../services/update-scenario-list-notification-service.service';

declare var $: any;
@Component({
  selector: 'app-voice-network',
  templateUrl: './voice-network.component.html',
  styleUrls: ['./voice-network.component.css']
})
export class VoiceNetworkComponent implements OnInit, OnDestroy {
  showMainFrameData: boolean = false;

  public isLineChartDisabled:boolean = false;

  public selectedmydata: any;
  public setMyData: any;
  //private data: FilterData;
  data: any = {};
  private data1: IsgKpiData;
  voiceDefinitionData: any;

  voiceData: any;
  private showVoiceData: boolean = false;

  private mapdata: any; //any is not a good practise,whats the point of using typescript then ?
  private scenarioData: any;

  enterMyData = {
    "availablityPercentage": null,
    "provisingTime": null,
    "staffingmixEmployee": null,
    "staffingmixContract": null,
    "noOfVoicehandsetFTE": null,
    "annualTCOPerActiveVoicePort": null,
    // this 2 are not in KPIs list
    "PBXHandset": null,
    "VoIPHandset": null
  }

  private selectedindustry;//it will be assigned string
  selectedregion;//it will be assigned string
  private selectedsize;//it will be assigned string
  selectedcurrency;//this will be assigned whole object currency

  private defaultindustry;
  private defaultregion;
  private defaultsize;
  private defaultcurrency;
  private compareComponent: CompareComponent

  //industry size
  private smallSize;
  private mediumSize;
  private largeSize;
  private extraLargeSize;
  private selectedIndustrySize;

  private industryLoaded: boolean;
  private regionLoaded: boolean;
  private showEnteredDataflag: boolean = false;
  private showHeader: boolean = true;
  public showEnterDataFlg: boolean = false;
  private showMainframeHeader: boolean = false;
  private currentURL: string = '';
  route: string;
  //  @ViewChild(CompareGridComponent) compareGridFlg;

  showCompareGridChild: boolean = false;
  showCompareScreen: string = 'none';
  showCompareGridScreen: string = 'none';
  private selectedIndustry: string;
  resizePopup: string = "minimize";

  public scaleValue = "Small";

  display_personnel = 'none';
  display_hardware = 'none';
  display_software = 'none';
  display_outsourcing = 'none';
  showDrillDown: boolean = false;
  dataSource: Object;
  currencyCode: string = "USD";
  refactorVal: number = 1;
  showDiv: boolean = false;

  display_costPerActivePort = 'none';

  public dataSourceCostPerActivePort: object;
  public currentyear: number;
  public previousYear: number;
  public secondPreviousYear: number;
  private conversionCurrency: any = null;
  //objects to store line chart data
  public annualTCOPerVoiceHandset: any;
  public annualPricePerVoiceHandset: any;
  public currencyVar: any;
  public currencySymbol: string;
  private sourceMap: Map<string, string>;
  private scaleTitle = "Scale (Voice Handsets)";


  //equality
  public costPerHandsetEquality: boolean = false;
  public provisionTimeEquality: boolean = false;
  public voiceAvailabilityEquality: boolean = false;
  public handsetsPerVoiceEquality: boolean = false;
  public saffingmixEmpEquality: boolean = false;
  public saffingmixContractEquality: boolean = false;
  public PBXEquality: boolean = false;
  public VOIPEquality: boolean = false;

  //variables to check data load status
  public landingPageDataLoaded: boolean = false;
  public scaleDataLoaded: boolean = false;
  public regionFilterLoaded: boolean = false;
  public currencyFilterLoaded: boolean = false;
  public industryDataLoaded: boolean = false;

  public scenarios: any;
  public selectedScenarioList: any[];
  public selectedscenario: any;

  //get saved scenario data of selected Scanrio Id
  public selectedsceanrio: any;
  public sessionId: any;
  public userdata: any;
  public selectedScenarioForComparison: any = [];
  public scenarioObj: any;

  public navigatedFromComparison: boolean = false;
  public navigatedFromInput: boolean = false;

  public selectedScenarioName: any;

  //CRG
  public customReferenceGroupList: any;
  public selectedCRGName: any;
  public CRGNameToCompare: any;
  public selectedcustomRef: any;
  public selectedCRGData: any;

  public isCrgSelected : boolean=false;

  NEGATIVE_CONST: number;
  map: Map<string, string> = new Map<string, string>();

  openModalDialog() {
    this.display_personnel = 'block';
    this.showDrillDown = true;
  }

  hardwareModalDialog() {
    this.display_hardware = 'block';
    this.showDrillDown = true;
  }

  softwareModalDialog() {
    this.display_software = 'block';
    this.showDrillDown = true;
  }

  outsourcingModalDialog() {
    this.display_outsourcing = 'block';
    this.showDrillDown = true;
  }

  closeModalDialog() {
    this.display_personnel = 'none';
    this.display_hardware = 'none';
    this.display_software = 'none';
    this.display_outsourcing = 'none';
    this.showDrillDown = false;
  }

  toggle() {
    // this.showDiv = !this.showDiv;
    this.showDiv = true;
    this.updateCompareData();
    this.compareVoiceInputData();
  }

  makePositiveValue(val) {
    return Math.abs(val).toFixed(2);
  }


  public infinity: number = 1 / 0;

  compareVoiceInputData() {

    try {
      let object = this;
      let test = new MapSourceCodeDataValues();
      object.scenarioData = object.voiceSharedService.getData().comparisionData;
      object.mapdata = test.mapData(object.scenarioData);

      object.NEGATIVE_CONST = negativeConstant.NEGATIVE_CONSTANT;

      // ENW100 / ( ENW100 + ENW105 )
      if (object.mapdata.ENW100 == this.NEGATIVE_CONST && object.mapdata.ENW105 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixEmployee = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.ENW100 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixEmployee = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.ENW105 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixEmployee = eval("object.mapdata.ENW100 / (object.mapdata.ENW100 + 0)");
      }
      else {
        this.enterMyData.staffingmixEmployee = eval("object.mapdata.ENW100 / (object.mapdata.ENW100 + object.mapdata.ENW105)");
      }

      let enterStaffEmp = (Number(this.enterMyData.staffingmixEmployee) * 100).toFixed(1);
      let userStaffEmp = Number(this.voiceData.data.StaffingMix.StaffingMixEmployee.Number.value).toFixed(1);

      if (enterStaffEmp == userStaffEmp) {
        this.saffingmixEmpEquality = true;
      }
      else {
        this.saffingmixEmpEquality = false;
      }

      if (this.enterMyData.staffingmixEmployee == Infinity || this.enterMyData.staffingmixEmployee == 'infinity' || this.enterMyData.staffingmixEmployee == "Infinity" || isNaN(this.enterMyData.staffingmixEmployee)) {
        this.enterMyData.staffingmixEmployee = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.staffingmixEmployee)) {
        this.enterMyData.staffingmixEmployee = this.enterMyData.staffingmixEmployee;
      } else {
        this.enterMyData.staffingmixEmployee = 0;
      }

      // ENW105 / ( ENW100 + ENW105 )
      //in case of null or empty value
      if (object.mapdata.ENW100 == this.NEGATIVE_CONST && object.mapdata.ENW105 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixContract = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.ENW105 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixContract = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.ENW100 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixContract = eval("object.mapdata.ENW105 / (0+object.mapdata.ENW105)");
      }
      else {
        this.enterMyData.staffingmixContract = eval("object.mapdata.ENW105 / (object.mapdata.ENW100 + object.mapdata.ENW105)");
      }

      let enterStaffContract = (Number(this.enterMyData.staffingmixContract) * 100).toFixed(1);
      let userStaffContract = Number(this.voiceData.data.StaffingMix.StaffingMixContractor.Number.value).toFixed(1);


      if (enterStaffContract == userStaffContract) {
        this.saffingmixContractEquality = true;
      }
      else {
        this.saffingmixContractEquality = false;
      }

      if (this.enterMyData.staffingmixContract == Infinity || this.enterMyData.staffingmixContract == 'infinity' || this.enterMyData.staffingmixContract == "Infinity" || isNaN(this.enterMyData.staffingmixContract)) {
        this.enterMyData.staffingmixContract = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.staffingmixContract)) {
        this.enterMyData.staffingmixContract = this.enterMyData.staffingmixContract;
      } else {
        this.enterMyData.staffingmixContract = 0;
      }

      // NW1030 / NW0040
      this.enterMyData.annualTCOPerActiveVoicePort = eval("object.mapdata.NW1030 / object.mapdata.NW0040");

      if (object.mapdata.NW1030 == 0 && object.mapdata.NW0040 == 0) {
        this.enterMyData.annualTCOPerActiveVoicePort = 0;
      } else {
        this.enterMyData.annualTCOPerActiveVoicePort = eval("object.mapdata.NW1030 / object.mapdata.NW0040");
      }

      let enterTCOPerActivity = Math.round(this.enterMyData.annualTCOPerActiveVoicePort);
      let userTCOPerActivity = Math.round((this.voiceData.data.AnnualCostPerVoiceHandset.VoiceCostPerHandset.Number.value) * this.refactorVal);

      if (enterTCOPerActivity == userTCOPerActivity) {
        this.costPerHandsetEquality = true;
      }
      else {
        this.costPerHandsetEquality = false;
      }

      if (this.enterMyData.annualTCOPerActiveVoicePort == Infinity || this.enterMyData.annualTCOPerActiveVoicePort == 'infinity' || this.enterMyData.annualTCOPerActiveVoicePort == "Infinity") {
        this.enterMyData.annualTCOPerActiveVoicePort = 0;
      }

      // V14120
      this.enterMyData.availablityPercentage = eval("object.mapdata.V14120");


      let enterVoiceAvail = Number(this.enterMyData.availablityPercentage).toFixed(2);
      let userVoiceAvail = Number(this.voiceData.data.Availability.VoiceAvailability.Number.value).toFixed(2);

      if (enterVoiceAvail == userVoiceAvail) {
        this.voiceAvailabilityEquality = true;
      }
      else {
        this.voiceAvailabilityEquality = false;
      }

      // VB4200
      this.enterMyData.provisingTime = eval("object.mapdata.VB4200");

      let enterProvTime = Number(this.enterMyData.provisingTime).toFixed(1);
      let userProvTime = Number(this.voiceData.data.ProvisioningTime.VoiceProvisioning.Number.value).toFixed(1);

      if (enterProvTime == userProvTime) {
        this.provisionTimeEquality = true;
      }
      else {
        this.provisionTimeEquality = false;
      }

      // NW0040 / ( ENW100 + ENW105 )
      if (object.mapdata.NW0040 == this.NEGATIVE_CONST && object.mapdata.ENW100 == this.NEGATIVE_CONST && object.mapdata.ENW105 == this.NEGATIVE_CONST) {
        this.enterMyData.noOfVoicehandsetFTE = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.NW0040 == this.NEGATIVE_CONST) {
        this.enterMyData.noOfVoicehandsetFTE = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.ENW100 == this.NEGATIVE_CONST) {
        this.enterMyData.noOfVoicehandsetFTE = eval("object.mapdata.NW0040 / (0 + object.mapdata.ENW105)");
      }
      else if (object.mapdata.ENW105 == this.NEGATIVE_CONST) {
        this.enterMyData.noOfVoicehandsetFTE = eval("object.mapdata.NW0040 / (object.mapdata.ENW100 + 0)");
      }
      else {
        this.enterMyData.noOfVoicehandsetFTE = eval("object.mapdata.NW0040 / (object.mapdata.ENW100 + object.mapdata.ENW105)");
      }

      let enterHandsetsPerVoiceFTE = Math.round(this.enterMyData.noOfVoicehandsetFTE);
      let userHandsetsPerVoiceFTE = Math.round(this.voiceData.data.NumberofVoiceHandsetsPerFTE.HandsetsPerVoiceFTE.Number.value);

      if (enterHandsetsPerVoiceFTE == userHandsetsPerVoiceFTE) {
        this.handsetsPerVoiceEquality = true;
      }
      else {
        this.handsetsPerVoiceEquality = false;
      }

      if (this.enterMyData.noOfVoicehandsetFTE == Infinity || this.enterMyData.noOfVoicehandsetFTE == 'infinity' || this.enterMyData.noOfVoicehandsetFTE == "Infinity") {
        this.enterMyData.noOfVoicehandsetFTE = 0;
      }

      // NW0600
      this.enterMyData.PBXHandset = eval("object.mapdata.NW0600");

      let enterPBX = Number(this.enterMyData.PBXHandset).toFixed(1);
      let userPBX = Number(this.voiceData.data.TraditionalPBXvsVoIP.VoicePBX.VoicePBX.value).toFixed(1);

      if (enterPBX == userPBX) {
        this.PBXEquality = true;
      }
      else {
        this.PBXEquality = false;
      }

      // NW0650
      this.enterMyData.VoIPHandset = eval("object.mapdata.NW0650");


      let enterVOIP = Number(this.enterMyData.VoIPHandset).toFixed(1);
      let userVOIP = Number(this.voiceData.data.TraditionalPBXvsVoIP.VoiceVoIP.VoiceVoIP.value).toFixed(1);

      if (enterVOIP == userVOIP) {
        this.VOIPEquality = true;
      }
      else {
        this.VOIPEquality = false;
      }


      // if(this.enterMyData.PBXHandset < this.voiceData.data.TraditionalPBXvsVoIP.VoicePBX.VoicePBX.value) {
      //   document.getElementById("PBXHandsetSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if(this.enterMyData.VoIPHandset < this.voiceData.data.TraditionalPBXvsVoIP.VoiceVoIP.VoiceVoIP.value) {
      //   document.getElementById("VoIPHandsetSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if(this.enterMyData.annualTCOPerActiveVoicePort < this.voiceData.data.AnnualCostPerVoiceHandset.VoiceCostPerHandset.Number.value) {
      //   document.getElementById("annualTCOCostPerActiveVoicePortSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if(this.enterMyData.availablityPercentage < this.voiceData.data.Availability.VoiceAvailability.Number.value) {
      //   document.getElementById("availabilitySVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if(this.enterMyData.provisingTime < this.voiceData.data.ProvisioningTime.VoiceProvisioning.Number.value) {
      //   document.getElementById("provisiningTimeSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if(this.enterMyData.noOfVoicehandsetFTE < this.voiceData.data.NumberofVoiceHandsetsPerFTE.HandsetsPerVoiceFTE.Number.value) {
      //   document.getElementById("noOfVoicehandsetFTESVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if((this.enterMyData.staffingmixEmployee*100) < this.voiceData.data.StaffingMix.StaffingMixEmployee.Number.value) {
      //   document.getElementById("staffingMixSVGEmployee").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if((this.enterMyData.staffingmixContract*100) < this.voiceData.data.StaffingMix.StaffingMixContractor.Number.value) {
      //   document.getElementById("staffingMixSVGContractor").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

    }
    catch (error) {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "9",
        "pageName": "Non CIO Voice Tower Screen",
        "errorType": "warn",
        "errorTitle": "Data Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    }
  }

  costPerActivePortDialog() {
    this.display_costPerActivePort = 'block';
    this.showDrillDown = true;
  }

  closeCostPerActivePortModalDialog() {
    this.display_costPerActivePort = 'none';
    this.showDrillDown = false;
  }

  public updateDrillDown() {

    try {
      // For Annual Cost Per Installed TB
      this.dataSourceCostPerActivePort = {
        chart: {
          animation: false,
          smartLineAlpha: "100",
          showlegend: "1",
          labelFont: "OpenSansRegular",
          labelFontSize: 16,
          legendItemFontSize: 16,
          showToolTip: false,
          legendposition: "bottom",
          usedataplotcolorforlabels: "0",
          showTooltip: "1",
          theme: "fint",
          lineThickness: "3",
          formatNumberScale: 0,
          // anchorBgColor: "#03abba, #29497b",
          showHoverEffect: 0, // disable zoom on mouse over
          interactiveLegend: 0, // disable hide of line
          divLineDashed: 0, // change chart background dot line to stright line
          legendItemFontColor: "#75787b",
          palettecolors: "#03abba, #29497b",
          numberprefix: this.currencySymbol
        },
        categories: [
          {
            category: [
              {
                label: "" + this.secondPreviousYear
              },
              {
                label: "" + this.previousYear
              },
              {
                label: "" + this.currentyear
              }
            ]
          }
        ],
        dataset: [
          {
            seriesname: "Annual TCO Cost Per Handset",
            anchorBgColor: "#03abba",
            "valuePosition": "BELOW",
            "data": this.annualTCOPerVoiceHandset
          },
          {
            seriesname: "Annual Market Price Per Handset",
            anchorBgColor: "#29497b",
            "valuePosition": "ABOVE",
            "data": this.annualPricePerVoiceHandset
          }
        ]

      };
    }
    catch (error) {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "9",
        "pageName": "Non CIO Voice Tower Screen",
        "errorType": "warn",
        "errorTitle": "Data Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    }
  }



  constructor(private service: FilterDataService,
    private commonService: CioheaderdataService,
    private compareHeaderDataService: HeaderCompareScreenDataService,
    private dropDownService: DropDownService,
    private industrySizeService: IndustrySizeService,
    location: Location,
    router: Router,
    private chartService: ChartCIOSharedService,
    private voiceService: VoiceService,
    private voiceSharedService: VoiceInputMydataSharedService,
    private genericEnterCompare: EnterCompareDataTowersService,
    private loginDataBroadcastService: LoginDataBroadcastService,
    private generateScenarioService: GenerateScenarioService,
    private updateScenarioListNotificationServiceService: UpdateScenarioListNotificationServiceService) {
    let object = this;
    object.industryLoaded = false;
    object.regionLoaded = false;

    router.events.subscribe((val) => {
      if (location.path() == '/kpiMaintainace') {
        this.showHeader = false;
        object.currentURL = '/kpiMaintainace';
      }
      else {
        this.showHeader = true;
        object.currentURL = location.path();

      }
      //for mainframe
      if (location.path() == '/Mainframe') {
        this.showMainframeHeader = true;
        object.currentURL = '/Mainframe';
      }
      else {
        this.showMainframeHeader = false;
        object.currentURL = location.path();

      }

    });

    let voiceSharedEmitter = object.voiceSharedService.getEmitter();
    voiceSharedEmitter.on('callFunction', function () {
      object.sourceMap = object.voiceSharedService.getData().map;
      object.navigatedFromComparison = true;

      object.toggle();

    });

    voiceSharedEmitter.on('newVoiceScenarioFromInput', function () {
      object.sourceMap = object.voiceSharedService.getData().map;
      object.navigatedFromInput = true;

      object.toggle();

    });

    //on save scenario
    object.voiceSharedService.getEmitter().on('newVoiceScenarioSaved', function () {
      object.navigatedFromInput = false;
      //get saved scenario id
      let savedScearioId = object.voiceSharedService.getScenarioSelection();

      if (savedScearioId != null || savedScearioId != undefined) {
        //get dropdown of scenarios
        object.getScenarioDropdown();

      }

    });
    //chane in compare scenario dropdown
    object.commonService.getEventEmitter().on('networkscenariodropdownchange', function () {
      //get selected scenario
      let scenario = object.commonService.getScenario();

      //call method to get scenario
      object.getScenarioDataById(scenario);

    });

    updateScenarioListNotificationServiceService.getEmitter().on('updateVoiceScenarioListAfterDeletion', function(){
      object.getScenarioDropdown();
    });


  }


  ngOnInit() {
    let object = this;

    this.currencyVar = require('currency-symbol-map');

    this.currentyear = (new Date()).getFullYear();
    this.previousYear = this.currentyear - 1;
    this.secondPreviousYear = this.currentyear - 2;

    $(".option-menus-collapse").hide();
    $(".search-box").addClass('search-hide');
    this.searchIcon();

    object.voiceService.getData().subscribe((allData: any) => {
      object.voiceData = allData;

      if (object.voiceData != undefined && object.voiceData != null) {
        object.landingPageDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.landingPageDataLoaded = false;
        object.showVoiceData = false;
      }

      // this.showVoiceData = true;
      object.updateLineChartData();
      object.updateDrillDown();
      this.compareVoiceInputData();


    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "9",
        "pageName": "Non CIO Voice Tower Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })


    object.dropDownService.getIndustry().subscribe((data: any) => {
      object.data.industries = data.industries;
      object.selectedindustry = "Grand Total";
      object.defaultindustry = "Grand Total";
      object.industryLoaded = true;
      object.notifyCompareScreen();

      if (object.data.industries != undefined && object.data.industries != null) {
        object.industryDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.industryDataLoaded = false;
        object.showVoiceData = false;
      }

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "9",
        "pageName": "Non CIO Voice Tower Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })

    object.dropDownService.getRegions().subscribe((data: any) => {
      object.data.region = data.region;
      object.selectedregion = "Grand Total";
      object.defaultregion = "Grand Total";
      object.regionLoaded = true;
      object.notifyCompareScreen();

      if (object.data.region != undefined && object.data.region != null) {
        object.regionFilterLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.regionFilterLoaded = false;
        object.showVoiceData = false;
      }

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "9",
        "pageName": "Non CIO Voice Tower Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })

    object.dropDownService.getCurrency().subscribe((data: any) => {
      object.data.currency = data['currencyExchange'];

      if (object.data.currency != undefined && object.data.currency != null) {
        object.currencyFilterLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.currencyFilterLoaded = false;
        object.showVoiceData = false;
      }
      let currency;
      object.data.currency.forEach(element => {
        if (element.value === "USD") {
          currency = element;
        }



      }, (error) => {
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId": "9",
          "pageName": "Non CIO Voice Tower Screen",
          "errorType": "Fatal",
          "errorTitle": "Web Service Error",
          "errorDescription": error.message,
          "errorObject": error
        }

        throw errorObj;
      });

      object.selectedcurrency = currency;
      object.defaultcurrency = object.selectedcurrency;
      //set updated currency to industry size service
      this.industrySizeService.setCurrencyObject(currency);

      object.commonService.setData(object.selectedcurrency);
      object.commonService.getEvent().emit('change');
    });

    //List of Scenarios for dropdown
    object.genericEnterCompare.getScanrioData().subscribe(function (response) {

      try {
        object.scenarios = response;
        object.selectedScenarioList = [];

        let scanrioId = 0;
        for (let index in object.scenarios) {
          let option: any = {};

          option.label = index + '_' + object.scenarios[index];
          option.name = object.scenarios[index];
          option.value = false;
          option.id = index; //
          object.selectedScenarioList.push(option);
        }
      }
      catch (error) {
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId": this.pageId,
          "pageName": "Non CIO Compare Screen",
          "errorType": "warn",
          "errorTitle": "Data Error",
          "errorDescription": error.message,
          "errorObject": error
        }

        throw errorObj;
      }
    })


    //set page identifier as 9
    object.industrySizeService.setPageId(9);
    object.genericEnterCompare.setPopID(9);

    //scale service
    object.industrySizeService.getIndustrySize().subscribe((data: any) => {

      object.data.industrySize = data["industrySize"];
      //setting the default Scale in IndustrySizeService
      this.industrySizeService.setScaleLabel(object.data.industrySize[0].key);
      this.industrySizeService.setInustrySize(object.data.industrySize[0].value);
      object.industrySizeService.setScaleTitle(object.scaleTitle);
      object.data.industrySize.forEach(element => {
      });

      if (object.data.industrySize != undefined && object.data.industrySize != null) {
        object.scaleDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.scaleDataLoaded = false;
        object.showVoiceData = false;
      }

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "9",
        "pageName": "Non CIO Voice Tower Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });

    // get group definition information
    object.industrySizeService.getDefinitionData().subscribe((data: any) => {
      object.voiceDefinitionData = data;
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "9",
        "pageName": "Non CIO Voice Tower Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });



    let valTomakePositive = "0";
    this.makePositiveValue(valTomakePositive);

    //get scenario dropdown
    object.navigatedFromInput = false;
    object.navigatedFromComparison = false;
    object.getScenarioDropdown();

    object.getCRGDropdown();


  }

  getScenarioDropdown() {
    //get dropdown of scenarios

    let object = this;

    object.genericEnterCompare.getScanrioData().subscribe(function (response) {

      try {
        object.scenarios = response;
        object.selectedScenarioName = [];

        //set default selection
        let temp: any = {};

        temp.label = "N/A";
        temp.name = "N/A";
        temp.value = false;
        temp.id = "-9999"; //
        object.selectedScenarioName.push(temp);

        let scanrioId = 0;
        for (let index in object.scenarios) {
          let option: any = {};

          option.label = index + '_' + object.scenarios[index];
          option.name = object.scenarios[index];
          option.value = false;
          option.id = index; //
          object.selectedScenarioName.push(option);

          //
        }

        // object.selectedscenario = object.selectedScenarioName[0];
        if(object.navigatedFromInput == true){
          //if it is navigated from input my data and new scenario is created using save&display functionality it will update list and display the comparision
        let savedScearioId = object.voiceSharedService.getScenarioSelection();
        //object.selectedscenario = object.selectedScenarioName[Number(savedScearioId)];
        for (let index in object.scenarios) {
          let option: any = {};

          option.label = index + '_' + object.scenarios[index];
          option.name = object.scenarios[index];
          option.value = false;
          option.id = index; //
          object.selectedScenarioName.push(option);

          //
          if(savedScearioId==index)
          {
            object.selectedscenario = option;
          }
        }
        object.getScenarioDataById(object.selectedscenario);
      }else{
          //if it is navigated from input my data and new scenario is created using save functionality it will update list only and set scenario to NA
        object.selectedscenario = object.selectedScenarioName[0];
        object.getScenarioDataById(object.selectedscenario);
      
      }



      }
      catch (error) {
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId": this.pageId,
          "pageName": "Non CIO Compare Screen",
          "errorType": "warn",
          "errorTitle": "Data Error",
          "errorDescription": error.message,
          "errorObject": error
        }

        throw errorObj;
      }
    })
  }

  public getKPIData(filter: string, filterValue: string) {
    let object = this;
    this.service.getFilterData(filter, filterValue).subscribe((data) => {
      this.data1 = data;


      let emitter: EventEmitter = object.commonService.getEventEmitter();
      let sharedData = { "cioData": data, "selectCurrency": object.selectedcurrency };
      object.commonService.setData(sharedData);
      emitter.emit('change');
    },
      (error) => {

      })
  }

  //function to update line chart object
  updateLineChartData() {
    try {
      //update line chart objects

      this.annualTCOPerVoiceHandset = this.voiceData.drills.AnnualTCOPerVoiceHandsetCurrentYear.map(obj => {
        let rObj = {};
        rObj["label"] = obj.label;
        rObj["value"] = Number(obj.value) * this.refactorVal;
        return rObj;
      });

      this.annualPricePerVoiceHandset = this.voiceData.drills.AnnualPricePerVoiceHandsetCurrentYear.map(obj => {
        let rObj = {};
        rObj["label"] = obj.label;
        rObj["value"] = Number(obj.value) * this.refactorVal;
        return rObj;
      });

      //change currency symbol
      this.currencySymbol = this.currencyVar(this.currencyCode);
    }
    catch (error) {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "9",
        "pageName": "Non CIO Voice Tower Screen",
        "errorType": "warn",
        "errorTitle": "Data Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    }
  }

  //this will be invoked when we change value of drop down
  public getFilterData(filter: string) {

    let object = this;

    if (filter === "region") {
      if (this.selectedregion == "Total") {
        this.getKPIData("Total", "Grand Total");
      } else {
        this.getKPIData("Region", object.selectedregion)
      }
      this.selectedindustry = this.defaultindustry;
      this.selectedsize = this.defaultsize;
      // this.selectedcurrency = this.defaultcurrency;
      return;
    }
    if (filter === "currency") {
      object.commonService.setData(this.selectedcurrency);
      object.commonService.getEvent().emit('change');
      return;
    }
  }

  ShowCompareModel() {
    this.showCompareScreen = 'block';
    let object = this;
    object.compareComponent.close();

  }
  HideCompareModel() {
    this.showCompareScreen = 'none';
  }

  ShowCompareGridModel() {
    //this.showCompareGridScreen = 'block';
  }
  HideCompareGridModel() {
    //this.showCompareGridScreen = 'none';
  }

  receiveMessage($event) {
    this.resizePopup = $event;
  }
  receiveFlagEvent($event) {
    this.showCompareGridChild = $event;
  }
  public myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }

  resetIndustry() {
    this.selectedIndustry = this.data.industries[0].value;
  }

  setCompareComponent(reference) {
    let object = this;
    object.compareComponent = reference;
  }

  //this function will notify compareScreen to update itself with the current data
  notifyCompareScreen() {
    let object = this;
    if (object.industryLoaded && object.regionLoaded) {
      object.compareHeaderDataService.setData(object.data);
      let emitter = this.compareHeaderDataService.getEmitter();
      emitter.emit('dataChange');
    }
  }

  showEnterDataPopup() {
    this.showEnterDataFlg = true;
  }

  public openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }

  public closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  showEnterData() {
    this.showEnteredDataflag = true;
  }

  mobileView() {
    $(".option-menus-collapse").addClass('search-hide');
    $(".search-box").addClass('search-hide');
  }

  searchIcon() {
    $(".search-box").toggle();
  }

  toggleMenu() {
    $('.firstline-menus-collapse').toggleClass('open')
  }

  private selectedItem = 'dashboard';

  //toggle dashboard and mainframe menu
  toggleDashboard(event, newValue) {
    this.selectedItem = newValue;  // don't forget to update the model here
    // ... do other stuff here ...
  }

  // filter for scale
  setScale(scale) {

    //reset CRG selection
    this.selectedcustomRef = this.selectedCRGName[0];


    //send updated scale value to industry size service
    //send updated scale value to industry size service
    this.industrySizeService.setInustrySize(scale.value);
    this.industrySizeService.setScaleLabel(scale.key);
    //call service for filtered data
    //call service for filtered data
    this.filterData();

    //make current button active
    this.scaleValue = scale.value;

  }

  filterData() {
    let object = this;
    object.industrySizeService.getMainFrameDataByScale().subscribe((data: any) => {

      object.voiceData = data;
      // this.showVoiceData = true;
      // this.updateLineChartData();
      this.isLineChartDisabled=false;
      this.updateDrillDown();
      this.compareVoiceInputData();
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "9",
        "pageName": "Non CIO Voice Tower Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });

  }

  //region change
  setRegion(region) {

    //reset CRG selection
    this.selectedcustomRef = this.selectedCRGName[0];


    if (region == "Total" || region == "Grand Total") {
      region = "Global";
      this.industrySizeService.setRegionValue(region);
    }
    else if (region.value == "Europe EMEA" || region.value == "Europe (EMEA)") {
      region.value = "Europe, Middle East, and Africa";
      this.industrySizeService.setRegionValue(region.value);
    }
    else {
      this.industrySizeService.setRegionValue(region.value);
    }
    this.filterData();
  }

  //set currency on change
  setCurrency(currency) {
    this.currencyCode = currency.value;
    this.refactorVal = currency.id;
    //set updated currency to industry size service
    this.industrySizeService.setCurrencyObject(currency);
    if (this.selectedcustomRef.customId != '-9999') {
      this.currencySymbol = this.currencyVar(this.currencyCode);
    }
    else {

      this.updateLineChartData();
      this.updateDrillDown();

    }
    if (this.showDiv == true) {


      this.convertCompareData(this.conversionCurrency, currency.key);
      this.compareVoiceInputData();

      this.conversionCurrency = currency.key;

    }
  }


  updateCompareData() {
    let object = this;
    let something = object.voiceSharedService.getData().currency;
    let scenarioRegion = object.voiceSharedService.getData().region;
    object.data.currency.forEach((element) => {

      if (element.key == something) {
        this.selectedcurrency = element;
        this.currencyCode = element.value;
        this.conversionCurrency = element.key;
        this.refactorVal = element.id;
        this.updateLineChartData();
        this.updateDrillDown();
      }
    });

    //region
    object.data.region.forEach((el) => {

      if (el.key == scenarioRegion) {
        this.selectedregion = el;
        this.regionLoaded = true;
      }

      if (object.data.region != null && object.data.region != undefined) {
        object.regionFilterLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.voiceData = false;
        object.regionFilterLoaded = false;
      }

    });

    if (object.navigatedFromComparison == true) {
      object.updateScenarioDropdown();
      let refactorValue = object.voiceSharedService.getData().refactorVal;

      let comparisionData = object.voiceSharedService.getData().comparisionData;

      for (let data of comparisionData) {

        let key = object.sourceMap[data.key];
        if (key != undefined && key != null && key != "#" && key != "%") {
          // data.value = data.value / currentValue.id;
          data.value = data.value * refactorValue;
        }

      }
    }

    if (object.navigatedFromInput == true) {
      // object.updateScenarioDropdown();
      object.getScenarioDropdown();
    }


  }

  updateScenarioDropdown() {
    //get selected scenario id
    let object = this;

    let selectedScenarioID = object.voiceSharedService.getScenarioSelection();
    //object.mainframeSharedService.getData().selectedScenarioId[0];
    object.selectedscenario = object.selectedScenarioName[selectedScenarioID];

  }

  convertCompareData(prevCurrencyKey, currenctCurrencyKey) {
    let object = this;
    let prevCurrencyObject = object.getCurrency(prevCurrencyKey);
    let currenctCurrencyObject = object.getCurrency(currenctCurrencyKey);

    object.convertValue(prevCurrencyObject, currenctCurrencyObject);
  }


  convertValue(currentValue, targetValue) {

    let object = this;

    let comparisionData = object.voiceSharedService.getData().comparisionData;
    object.selectedScenarioForComparison.forEach((element) => {
      //3)this will map src_code and it's value format
      object.map[element.key] = element.value_format;
    });
    object.sourceMap = object.map;

    try {
      for (let data of comparisionData) {

        let key = object.sourceMap[data.key];
        if (key != undefined && key != null && key != "#" && key != "%") {
          data.value = data.value / currentValue.id;
          data.value = data.value * targetValue.id;
        }

      }
    } catch (error) {
    }



  }


  getCurrency(currencyKey) {
    let object = this;
    let currencyObject = null;
    object.data.currency.forEach((element) => {
      if (element.key == currencyKey) {
        currencyObject = element;
      }
    });
    return currencyObject;
  }

  ngOnDestroy() {

    //emit an event to indicate data is resetted
    this.industrySizeService.getEmitter().emit('landingPageDataReset');
    this.voiceSharedService.getEmitter().removeAllListeners();

  }

  //function to check all relevent data is loaded on page
  isAllReleventDataLoaded() {
    let object = this;

    if (object.landingPageDataLoaded && object.scaleDataLoaded && object.regionFilterLoaded && object.currencyFilterLoaded && object.industryDataLoaded) {
      object.showVoiceData = true;

      //emit an event to indicate data is loaded
      object.industrySizeService.getEmitter().emit('landingPageDataLoaded');

    }
    else {
      object.showVoiceData = false;
    }
  }

  getScenarioDataById(selectedscenario) {
    let object = this;
    object.navigatedFromInput = false;
    // //this is done becuz when i reset form,i will lose selectedScenrio Id
    let scenarioID = selectedscenario.id;

    // //this means that there is no present or this function is first hit to server
    try {
      //   object.resetAll();
    } catch (error) {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "9",
        "pageName": "Non CIO Mainframe Tower Input My Data Screen",
        "errorType": "warn",
        "errorTitle": "Data Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    }
    //object.selectedScanrio = scenarioID;//after reset again reseting selectedScenario


    if (scenarioID == 0) {
      //object.scenarioNameText="";
      return;
    }
    else if (scenarioID == -9999) {
      //if dummy scenario is selected hide the comparison section
      this.showDiv = false;
      this.selectedregion = "Grand Total";
      this.defaultregion = "Grand Total";
      this.selectedscenario = "N/A";

      //default currency
      let currency = "FE482E13-D3B6-4208-8C3C-2FD7AFBEBEA1";//USD key
      //get currency data
      object.data.currency.forEach((element) => {

        if (element.key == currency) {
          this.selectedcurrency = element;
          this.currencyCode = element.value;
          this.conversionCurrency = element.key;
          this.refactorVal = element.id;
          //change currency symbol
          this.currencySymbol = this.currencyVar(this.currencyCode);
          //this.updateLineChartData();
          //this.updateDrillDown();
        }
      });
      this.setRegion(this.selectedregion);

    }
    else//get comparison data for scenario
    {
      let requestedParam = {
        "userID": object.sessionId,
        "dashboardId": "9",
        "scenarioId": []
      }

      object.generateScenarioService.getSavedScenarioDataToPopulate("9", object.sessionId, scenarioID).subscribe((response) => {

        let object = this;

        object.selectedScenarioForComparison = [];

        object.scenarioObj = response;


        //logic to prepare a scenarion object for comparison

        for (let cnt = 0; cnt < object.scenarioObj.VoiceInput.NA.length; cnt++) {
          let t1: any = {};
          t1.key = object.scenarioObj.VoiceInput.NA[cnt].src_code;
          t1.value = object.scenarioObj.VoiceInput.NA[cnt].src_code_value;
          //once save note functionality done append value of each src code note here
          t1.note = object.scenarioObj.VoiceInput.NA[cnt].notes;

          t1.value_format = object.scenarioObj.VoiceInput.NA[cnt].value_format;

          object.selectedScenarioForComparison.push(t1);
        }

        let currency: any;
        let region: any;

        for (let cnt = 0; cnt < object.scenarioObj.GeneralInformation.NA.length; cnt++) {
          //currency
          if (object.scenarioObj.GeneralInformation.NA[cnt].src_code == 'ICE002') {
            currency = object.scenarioObj.GeneralInformation.NA[cnt].src_code_value;
          }
          //region
          if (object.scenarioObj.GeneralInformation.NA[cnt].src_code == 'TD0110') {
            region = object.scenarioObj.GeneralInformation.NA[cnt].src_code_value;
          }
        }

        if (currency == undefined || currency == null || currency.trim().length == 0) {
          currency = "FE482E13-D3B6-4208-8C3C-2FD7AFBEBEA1";//USD key
        }
        let sharedData = { "comparisionData": object.selectedScenarioForComparison, "currency": currency, "region": region };
        object.voiceSharedService.setData(sharedData);
        object.voiceSharedService.setScenarioSelection(scenarioID);
        let something = object.voiceSharedService.getData().currency;

        //get currency data
        object.data.currency.forEach((element) => {

          if (element.key == something) {
            this.selectedcurrency = element;
            this.currencyCode = element.value;
            this.conversionCurrency = element.key;
            this.refactorVal = element.id;
            //change currency symbol
            this.currencySymbol = this.currencyVar(this.currencyCode);
            //this.updateLineChartData();
            // this.updateDrillDown();
          }
        });


     
        let scenarioRegion = object.voiceSharedService.getData().region;
        object.toggle();

        if(this.isCrgSelected==false){
          object.data.region.forEach((element)=>{
            if (element.key == scenarioRegion) {
              this.selectedregion = element;
              console.log("selectedRegion", object.selectedregion);
              object.setRegion(object.selectedregion);
            }
          })
          // this.showDefaultScale();
        }

      }, (error) => {
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId": "9",
          "pageName": "Non CIO Mainframe Tower Input My Data Screen",
          "errorType": "Fatal",
          "errorTitle": "Web Service Error",
          "errorDescription": error.message,
          "errorObject": error
        }

        throw errorObj;
      })
    }
  }

  getUserLoginInfo() {
    let object = this;
    object.userdata = object.loginDataBroadcastService.get('userloginInfo');
    //object.emailId = _self.userdata['userDetails']['emailId'];
    object.industrySizeService.setUserEmail(object.userdata['userDetails']['emailId']);
    object.sessionId = object.userdata['userDetails']["sessionId"];
  }

  getCRGDropdown() {
    //get dropdown of scenarios

    let object = this;

    object.industrySizeService.getCustomRefereneGroupList().subscribe((data: any) => {

      try {



        object.customReferenceGroupList = data;


        object.selectedCRGName = [];

        //set default selection
        let temp: any = {};
        temp.UpdatedDate = null;
        temp.createdBy = null;
        temp.createdDate = null;
        temp.customName = "N/A";
        temp.dashboardId = "9";
        temp.updatedBy = null;
        temp.customId = "-9999"; //
        temp.definition = "";

        object.selectedCRGName.push(temp);

        for (let index in object.customReferenceGroupList) {
          let option: any = {};

          if (object.customReferenceGroupList[index].dashboardId == '9') {
            option.UpdatedDate = object.customReferenceGroupList[index].UpdatedDate;
            option.createdBy = object.customReferenceGroupList[index].createdBy;
            option.createdDate = object.customReferenceGroupList[index].createdDate;
            option.customName = object.customReferenceGroupList[index].customName;
            option.dashboardId = object.customReferenceGroupList[index].dashboardId;
            option.updatedBy = object.customReferenceGroupList[index].updatedBy;
            option.customId = object.customReferenceGroupList[index].customId;
            option.definition = object.customReferenceGroupList[index].definition;


            object.selectedCRGName.push(option);



          }

        }

        object.selectedcustomRef = object.selectedCRGName[0];



      }
      catch (error) {
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId": "2",
          "pageName": "Non CIO Compare Screen",
          "errorType": "warn",
          "errorTitle": "Data Error",
          "errorDescription": error.message,
          "errorObject": error
        }
      }



    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "3",
        "pageName": "Non CIO Windows Tower Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });



  }

  getScenarioDataByCustomRef(selectedcustomRef) {

    //get crg data by id

    let object = this;


    if (object.showDiv == false) //in case compare scnarion is enabled, dont reset
    {
      //reset other filters
      object.resetNonCRGFilters();

    }



    //when selected N/A
    if (selectedcustomRef.customId == '-9999') {
      object.showDefaultLandingData();
      // object.showDefaultCurrency();
      //enable line charts
      object.isLineChartDisabled=false;
    }
    else {
      //set custom reference group in service
      object.industrySizeService.setCRGId(selectedcustomRef.customId);
      this.selectedindustry = this.defaultindustry;
      this.selectedsize = this.defaultsize;
      // this.setScale(this.selectedsize);
      this.selectedregion="Grand Total";
      this.showDefaultScale();
      this.isCrgSelected=true;
      //web service to fetch CRG data
      object.industrySizeService.fetchCRGData().subscribe((crgData: any) => {


        if (crgData != undefined || crgData != null) {
          object.voiceData = crgData;
          object.landingPageDataLoaded = true;
          object.isAllReleventDataLoaded();
          //disable line charts
          object.isLineChartDisabled=true;
        }

      });
    }


  }

  showDefaultLandingData() {

    let object = this;

    // this is used for all landing page data
    object.voiceService.getData().subscribe((allData: any) => {
      object.voiceData = allData;


      //this.showLANData = true;

      object.updateLineChartData();
      object.updateDrillDown();

      if (object.voiceData != undefined && object.voiceData != null) {
        object.landingPageDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.landingPageDataLoaded = false;
        object.showVoiceData = false;
      }

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "7",
        "pageName": "Non CIO LAN Tower Landing Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })


  }

  resetNonCRGFilters() {

    let object = this;

    //object.show = false;
    object.landingPageDataLoaded = false;
    object.scaleDataLoaded = false;
    object.regionFilterLoaded = false;
    object.currencyFilterLoaded = false;

    //scale service
    object.showDefaultScale();

    //Region
    object.showDefaultRegion();

    //currency
    // object.showDefaultCurrency();
  }

  showDefaultScale() {
    let object = this;

    object.industrySizeService.getIndustrySize().subscribe((data: any) => {


      object.data.industrySize = data["industrySize"];

      if (object.data.industrySize != undefined && object.data.industrySize != null) {
        object.scaleDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.scaleDataLoaded = false;
        //object.showServiceDeskData = false;
      }

      object.scaleValue = "Small";


      //setting the default Scale in IndustrySizeService
      this.industrySizeService.setScaleLabel(object.data.industrySize[0].key);
      object.industrySizeService.setScaleTitle(object.scaleTitle);


    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "3",
        "pageName": "Non CIO Windows Tower Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });

  }

  showDefaultCurrency() {
    let object = this;

    object.dropDownService.getCurrency().subscribe((data: any) => {
      object.data.currency = data['currencyExchange'];

      let currency;

      object.data.currency.forEach(element => {

        if (element.value === "USD") {
          currency = element;

        }

        if (object.data.currency != undefined && object.data.currency != null) {
          object.currencyFilterLoaded = true;
          object.isAllReleventDataLoaded();
        }
        else {
          object.currencyFilterLoaded = false;
          object.showVoiceData = false;
        }

      });

      object.selectedcurrency = currency;

      object.currencySymbol = object.currencyVar('USD');

      object.defaultcurrency = object.selectedcurrency;

      //set updated currency to industry size service
      this.industrySizeService.setCurrencyObject(currency);

      object.commonService.setData(object.selectedcurrency);

      object.setCurrency(object.selectedcurrency);

      object.commonService.getEvent().emit('change');

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "3",
        "pageName": "Non CIO Windows Tower Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });

  }

  showDefaultRegion() {
    let object = this;

    object.dropDownService.getRegions().subscribe((data: any) => {
      object.data.region = data.region;
      object.selectedregion = "Grand Total";
      object.defaultregion = "Grand Total";
      object.regionLoaded = true;

      if (object.data.region != undefined && object.data.region != null) {
        object.regionFilterLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.regionFilterLoaded = false;
        //object.showServiceDeskData = false;
      }

      //object.notifyCompareScreen();
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "3",
        "pageName": "Non CIO Windows Tower Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })


  }


}
