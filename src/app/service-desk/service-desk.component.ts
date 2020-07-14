/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:service-desk.component.ts **/
/** Description: This file is created to get the ladning page data, filter related data and compare/input my data with drill downs (Chart) **/
/** Created By: 10651577  Created Date: 28/09/2018 **/
/** Update By:  10650919  Update Date:  03/10/2018 **/
/*******************************************************/

import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
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

import { ServicedeskService } from '../services/servicedesk/servicedesk.service';

import { MapSourceCodeDataValues } from '../map-source-code-data-values';
import { ServiceDeskInputMyDataSharedService } from '../services/servicedesk/service-desk-input-my-data-shared.service';
import { ServiceDeskEditAndCompareSharedService } from '../services/servicedesk/service-desk-edit-and-compare-shared.service';

import { negativeConstant } from '../../properties/constant-values-properties';

import { EnterCompareDataTowersService } from '../services/enter-compare-data-towers.service';
import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';
import { GenerateScenarioService } from '../services/generate-scenario.service';
import { UpdateScenarioListNotificationServiceService } from '../services/update-scenario-list-notification-service.service';


declare var $: any;

@Component({
  selector: 'app-service-desk',
  templateUrl: './service-desk.component.html',
  styleUrls: ['./service-desk.component.css'],
  providers: [FilterDataService]
})
export class ServiceDeskComponent implements OnInit, OnDestroy {

  showServiceDeskData: boolean = false;
  public servicedeskData: any;

  public isLineChartDisabled:boolean = false;

  private mapdata: any;
  private scenarioData: any;

  enterMyData = {
    "availablityPercentage": null,
    "noOfConfiguredMIPS": null,
    "utilizationPercentage": null,
    "staffingmixEmployee": null,
    "staffingmixContract": null,
    "annualTCOCostPerServiceDeskUser": null,
    "noOfTicketsPerUser": null,
    "firstcallResolution": null,
    "averageHandletime": null,
    "averagespeedtoAnswer": null,
    "noOfTicketsPerFTE": null,
    "annualTCOPerServiceDeskTicketOwnership": null,
    "annualTCOPerServiceDeskTicketPrice": null
  }

  currencyCode: string = "USD";
  refactorVal: number = 1;


  //private data: FilterData;
  private data: any = {};
  private data1: IsgKpiData;
  private servicedeskDefinitionData: any;

  private selectedindustry;//it will be assigned string
  private selectedregion;//it will be assigned string
  private selectedsize;//it will be assigned string
  private selectedcurrency;//this will be assigned whole object currency

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
  private conversionCurrency: any = null;
  //  @ViewChild(CompareGridComponent) compareGridFlg;

  showCompareGridChild: boolean = false;

  showDiv: boolean = false;

  singleValueDonut: boolean = false;

  showCompareScreen: string = 'none';
  showCompareGridScreen: string = 'none';

  private selectedIndustry: string;

  resizePopup: string = "minimize";

  //line chart objects
  public servicedeskUserOwnership: any;
  public servicedeskUserMarketPrice: any;
  public OSCoreDataTicket: any;
  public OSCoreMarketRateDataTicket: any;
  public currencyVar: any;
  public currencySymbol: string;

  private scaleTitle = "Scale (Users)";

  public ticketEquality: boolean = false;
  public sdEquatyEquality: boolean = false;
  public staffingEmployeeEquality: boolean = false;
  public contractEquality: boolean = false;
  public TCOUserEauality: boolean = false;
  public TCOTicketEauality: boolean = false;

  //variables to check data load status
  public landingPageDataLoaded: boolean = false;
  public scaleDataLoaded: boolean = false;
  public regionFilterLoaded: boolean = false;
  public currencyFilterLoaded: boolean = false;
  public industryDataLoaded: boolean = false;

  //CRG
  public customReferenceGroupList: any;
  public selectedCRGName: any;
  public CRGNameToCompare: any;
  public selectedcustomRef: any;
  public selectedCRGData: any;

  public isCrgSelected : boolean=false;

  map: Map<string, string> = new Map<string, string>();
  NEGATIVE_CONST: number;

  makePositiveValue(val) {
    return Math.abs(val).toFixed(2);
  }

  toggle() {
    // this.showDiv = !this.showDiv;
    this.showDiv = true;
    this.updateCompareData();
    this.compareServicedeskInputData();
  }

  compareServicedeskInputData() {

    try {

      let object = this;
      object.ticketEquality = false;
      object.sdEquatyEquality = false;
      object.staffingEmployeeEquality = false;
      object.contractEquality = false;
      object.TCOUserEauality = false;
      object.TCOTicketEauality = false;
      let storageMap = new MapSourceCodeDataValues();
      object.scenarioData = object.servicedeskSharedService.getData().comparisionData;
     
      object.mapdata = storageMap.mapData(object.scenarioData);

      object.NEGATIVE_CONST = negativeConstant.NEGATIVE_CONSTANT;

      // ESD010 / (ESD010+ESD020)
      if (object.mapdata.ESD010 == this.NEGATIVE_CONST && object.mapdata.ESD020 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixEmployee = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.ESD010 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixEmployee = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.ESD020 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixEmployee = eval("object.mapdata.ESD010 / (object.mapdata.ESD010 + 0)");
      }
      else {
        this.enterMyData.staffingmixEmployee = eval("object.mapdata.ESD010 / (object.mapdata.ESD010 + object.mapdata.ESD020)");
      }

      let temp10 = Number((this.enterMyData.staffingmixEmployee * 100)).toFixed(1);
      let temp20 = Number((this.servicedeskData.data.StaffingMix.StaffingMixEmployee.Number.value)).toFixed(1);

      if (temp10 == temp20) {
        this.staffingEmployeeEquality = true;
      }

      // this.enterMyData.staffingmixEmployee = 0.6322;

      if (this.enterMyData.staffingmixEmployee == Infinity || this.enterMyData.staffingmixEmployee == 'infinity' || this.enterMyData.staffingmixEmployee == "Infinity" || isNaN(this.enterMyData.staffingmixEmployee)) {
        this.enterMyData.staffingmixEmployee = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.staffingmixEmployee)) {
        this.enterMyData.staffingmixEmployee = this.enterMyData.staffingmixEmployee;
      } else {
        this.enterMyData.staffingmixEmployee = 0;
      }

      // ESD020 / (ESD010+ESD020)
      //in case of null or empty value
      if (object.mapdata.ESD010 == this.NEGATIVE_CONST && object.mapdata.ESD020 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixContract = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.ESD020 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixContract = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.ESD010 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixContract = eval("object.mapdata.ESD020 / (0+object.mapdata.ESD020)");
      }
      else {
        this.enterMyData.staffingmixContract = eval("object.mapdata.ESD020 / (object.mapdata.ESD010 + object.mapdata.ESD020)");
      }

      let enterContract = (Number(this.enterMyData.staffingmixContract) * 100).toFixed(1);
      let userContract = Number(this.servicedeskData.data.StaffingMix.StaffingMixContractor.Number.value).toFixed(1);

      if (enterContract == userContract) {
        this.contractEquality = true;
      }

      // this.enterMyData.staffingmixContract = 0.3678;

      if (this.enterMyData.staffingmixContract == Infinity || this.enterMyData.staffingmixContract == 'infinity' || this.enterMyData.staffingmixContract == "Infinity" || isNaN(this.enterMyData.staffingmixContract)) {
        this.enterMyData.staffingmixContract = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.staffingmixContract)) {
        this.enterMyData.staffingmixContract = this.enterMyData.staffingmixContract;
      } else {
        this.enterMyData.staffingmixContract = 0;
      }

      // DSD000 / SD0030
      this.enterMyData.annualTCOCostPerServiceDeskUser = eval("object.mapdata.DSD000 / object.mapdata.SD0030");

      if (object.mapdata.DSD000 == 0 && object.mapdata.SD0030 == 0) {
        this.enterMyData.annualTCOCostPerServiceDeskUser = 0;
      } else {
        this.enterMyData.annualTCOCostPerServiceDeskUser = eval("object.mapdata.DSD000 / object.mapdata.SD0030");
      }

      let temp33 = Math.round(this.enterMyData.annualTCOCostPerServiceDeskUser);
      let temp44 = Math.round(this.servicedeskData.data.AnnualCostPerServiceDeskUser.CostPerUser.NumberCY.value);

      if (temp33 == temp44) {
        this.TCOUserEauality = true;
      }

      if (Number(this.enterMyData.annualTCOCostPerServiceDeskUser)) {
        this.enterMyData.annualTCOCostPerServiceDeskUser = this.enterMyData.annualTCOCostPerServiceDeskUser;
      } else {
        this.enterMyData.annualTCOCostPerServiceDeskUser = 0;
      }

      if (this.enterMyData.annualTCOCostPerServiceDeskUser == Infinity || this.enterMyData.annualTCOCostPerServiceDeskUser == 'Infinity') {
        this.enterMyData.annualTCOCostPerServiceDeskUser = 0;
      }

      // C34755
      this.enterMyData.firstcallResolution = eval("object.mapdata.C34755");

      // C37600
      this.enterMyData.averageHandletime = eval("object.mapdata.C37600");

      // SD0630
      this.enterMyData.averagespeedtoAnswer = eval("object.mapdata.SD0630");

      // SD0015 / (ESD010+ESD020)
      //in case of null or empty value
      if (object.mapdata.SD0015 == this.NEGATIVE_CONST && object.mapdata.ESD010 == this.NEGATIVE_CONST && object.mapdata.ESD020 == this.NEGATIVE_CONST) {
        this.enterMyData.noOfTicketsPerFTE = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.SD0015 == this.NEGATIVE_CONST) {
        this.enterMyData.noOfTicketsPerFTE = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.ESD010 == this.NEGATIVE_CONST) {
        this.enterMyData.noOfTicketsPerFTE = eval("object.mapdata.SD0015 / (0 + object.mapdata.ESD020)");
      }
      else if (object.mapdata.ESD020 == this.NEGATIVE_CONST) {
        this.enterMyData.noOfTicketsPerFTE = eval("object.mapdata.SD0015 / (object.mapdata.ESD010 + 0)");
      }
      else {
        this.enterMyData.noOfTicketsPerFTE = eval("object.mapdata.SD0015 / (object.mapdata.ESD010 + object.mapdata.ESD020)");
      }

      // this.enterMyData.noOfTicketsPerFTE = 496;

      let temp55 = Math.round(this.enterMyData.noOfTicketsPerFTE);
      let temp66 = Math.round(this.servicedeskData.data.NumberofTicketsPerFTE.TicketsPerFTE.Number.value);

      if (temp55 == temp66) {
        this.sdEquatyEquality = true;
      }

      if (this.enterMyData.noOfTicketsPerFTE == Infinity || this.enterMyData.noOfTicketsPerFTE == 'Infinity') {
        this.enterMyData.noOfTicketsPerFTE = 0;
      }

      if (Number(this.enterMyData.noOfTicketsPerFTE)) {
        this.enterMyData.noOfTicketsPerFTE = this.enterMyData.noOfTicketsPerFTE;
      } else {
        this.enterMyData.noOfTicketsPerFTE = 0;
      }

      // SD0015 / SD0030
      this.enterMyData.noOfTicketsPerUser = eval("object.mapdata.SD0015 / object.mapdata.SD0030");

      if (object.mapdata.SD0015 == 0 && object.mapdata.SD0030 == 0) {
        this.enterMyData.noOfTicketsPerUser = 0;
      } else {
        this.enterMyData.noOfTicketsPerUser = eval("object.mapdata.SD0015 / object.mapdata.SD0030");
      }

      let enteredData = Number(this.enterMyData.noOfTicketsPerUser).toFixed(1);
      let alreadyData = Number(this.servicedeskData.data.NumberofTicketsPerUser.TicketsPerUser.Number.value).toFixed(1);

      if (enteredData == alreadyData) {
        this.ticketEquality = true;
      }

      if (Number(this.enterMyData.noOfTicketsPerUser)) {
        this.enterMyData.noOfTicketsPerUser = this.enterMyData.noOfTicketsPerUser;
      } else {
        this.enterMyData.noOfTicketsPerUser = 0;
      }

      if (this.enterMyData.noOfTicketsPerUser == Infinity || this.enterMyData.noOfTicketsPerUser == 'Infinity') {
        this.enterMyData.noOfTicketsPerUser = 0;
      }

      // DSD000 / SD0015
      this.enterMyData.annualTCOPerServiceDeskTicketOwnership = eval("object.mapdata.DSD000 / (object.mapdata.SD0015*12)");

      if (object.mapdata.DSD000 == 0 && object.mapdata.SD0015 == 0) {
        this.enterMyData.annualTCOPerServiceDeskTicketOwnership = 0;
      } else {
        this.enterMyData.annualTCOPerServiceDeskTicketOwnership = eval("object.mapdata.DSD000 / (object.mapdata.SD0015*12)");
      }

      // this.enterMyData.annualTCOPerServiceDeskTicketOwnership = 54.2;

      let temp335 = (Number(this.enterMyData.annualTCOPerServiceDeskTicketOwnership)).toFixed(1);
      let temp445 = (Number(this.servicedeskData.data.AnnualCostPerServiceDeskTicket.CostPerTicket.NumberCY.value)).toFixed(1);

      if (temp335 == temp445) {
        this.TCOTicketEauality = true;
      }

      if (Number(this.enterMyData.annualTCOPerServiceDeskTicketOwnership)) {
        this.enterMyData.annualTCOPerServiceDeskTicketOwnership = this.enterMyData.annualTCOPerServiceDeskTicketOwnership;
      } else {
        this.enterMyData.annualTCOPerServiceDeskTicketOwnership = 0;
      }

      if (this.enterMyData.annualTCOPerServiceDeskTicketOwnership == Infinity || this.enterMyData.annualTCOPerServiceDeskTicketOwnership == 'Infinity') {
        this.enterMyData.annualTCOPerServiceDeskTicketOwnership = 0;
      }

      // if(this.enterMyData.annualTCOPerServiceDeskTicketOwnership < this.servicedeskData.data.AnnualCostPerServiceDeskTicket.CostPerTicket.NumberCY.value) {
      //   document.getElementById("annualTCOCostPerInstalledTBSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if(this.enterMyData.annualTCOPerServiceDeskTicketOwnership < this.servicedeskData.data.AnnualCostPerServiceDeskTicket.CostPerTicket.NumberCY.value) {
      //   document.getElementById("sdmarketplacePerInstalledTBSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if(this.enterMyData.noOfTicketsPerUser < this.servicedeskData.data.NumberofTicketsPerUser.TicketsPerUser.Number.value) {
      //   document.getElementById("noOfTicketsPerUserSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if(this.enterMyData.noOfTicketsPerFTE < this.servicedeskData.data.NumberofTicketsPerFTE.TicketsPerFTE.Number.value) {
      //   document.getElementById("noOfTicketsPerFTESVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if(this.enterMyData.averagespeedtoAnswer < this.servicedeskData.data.AverageSpeedtoAnswerinseconds.ServiceDeskASA.Mean.value) {
      //   document.getElementById("speedtoanswerSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if(this.enterMyData.averageHandletime < this.servicedeskData.data.AverageHandleTimeinminutes.ServiceDeskAHA.Mean.value) {
      //   document.getElementById("averageHandletimeSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if(this.enterMyData.firstcallResolution < this.servicedeskData.data.FirstCallResolution.ServiceDeskFCR.Mean.value) {
      //   document.getElementById("firstcallresolutionSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if(this.enterMyData.annualTCOCostPerServiceDeskUser < this.servicedeskData.data.AnnualCostPerServiceDeskUser.CostPerUser.NumberCY.value) {
      //   document.getElementById("annualTCOCostPerServiceDeskUserSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if(this.enterMyData.annualTCOCostPerServiceDeskUser < this.servicedeskData.data.AnnualCostPerServiceDeskUser.CostPerUser.NumberCY.value) {
      //   document.getElementById("marketPriceServiceDeskUserSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if ((this.enterMyData.staffingmixEmployee*100) < this.servicedeskData.data.StaffingMix.StaffingMixEmployee.Number.value) {
      //   document.getElementById("staffingMixSVGEmployee").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if ((this.enterMyData.staffingmixContract*100) < this.servicedeskData.data.StaffingMix.StaffingMixContractor.Number.value) {
      //   document.getElementById("staffingMixSVGContractor").setAttribute('transform', 'rotate(90) rotate(90)');
      // }
    }
    catch (error) {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "11",
        "pageName": "Non CIO Service Desk Tower Landing Screen",
        "errorType": "warn",
        "errorTitle": "Data Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    }
  }

  public scaleValue = "Small";

  display_personnel = 'none';
  display_hardware = 'none';
  display_software = 'none';
  display_outsourcing = 'none';
  showDrillDown: boolean = false;
  dataSource: Object;
  dataSourceHardware: Object;
  dataSourceSoftware: Object;
  dataSourceOutsourcing: object;

  display_costPerInstance = 'none';
  display_costPerCore = 'none';
  public currentyear: number;
  public previousYear: number;
  public secondPreviousYear: number;
  public dataSourceCostPerUser: Object;
  public dataSourceTicket: Object;
  private sourceMap: Map<string, string>;

  public scenarios: any;
  public selectedScenarioList: any[];

  public navigatedFromComparison: boolean=false;
  public navigatedFromInput: boolean=false;
  public selectedScenarioName: any;
  public selectedscenario: any;

  costPerInstanceDialog() {
    this.display_costPerInstance = 'block';
    this.showDrillDown = true;
  }

  closeCostPerInstanceModalDialog() {
    this.display_costPerInstance = 'none';
    this.showDrillDown = false;
  }

  costPerCoreDialog() {
    this.display_costPerCore = 'block';
    this.showDrillDown = true;
  }

  closeCostPerCoreModalDialog() {
    this.display_costPerCore = 'none';
    this.showDrillDown = false;
  }

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

  public updateDrillDown() {

    try {
      //annual cost per OS instance
      this.dataSourceCostPerUser = {
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
            seriesname: "Annual TCO Cost Per Service Desk User",
            anchorBgColor: "#03abba",
            "valuePosition": "ABOVE",
            "data": this.servicedeskUserOwnership
          },
          {
            seriesname: "Annual Market Price Per Service Desk User",
            anchorBgColor: "#29497b",
            "valuePosition": "BELOW",
            "data": this.servicedeskUserMarketPrice
          }
        ]

      };

      this.dataSourceTicket = {
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
            seriesname: "TCO Cost Per Ticket",
            anchorBgColor: "#03abba",
            "valuePosition": "ABOVE",
            "data": this.OSCoreDataTicket
          },
          {
            seriesname: "Market Price Per Ticket",
            anchorBgColor: "#29497b",
            "valuePosition": "ABOVE",
            "data": this.OSCoreMarketRateDataTicket
          }
        ]
      };
    }
    catch (error) {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "11",
        "pageName": "Non CIO Service Desk Tower Landing Screen",
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
    private ServicedeskLanding: ServicedeskService,
    private servicedeskSharedService: ServiceDeskInputMyDataSharedService,
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
    let storageSharedEmitter = object.servicedeskSharedService.getEmitter();
    storageSharedEmitter.on('callFunction', function () {
      object.sourceMap = object.servicedeskSharedService.getData().map;
      object.navigatedFromComparison = true;
      
      object.toggle();
    });

    storageSharedEmitter.on('newStorageScenarioFromInput', function () {
      object.sourceMap = object.servicedeskSharedService.getData().map;
      object.navigatedFromInput = true;
      object.toggle();
    });


    //on save scenario
    object.servicedeskSharedService.getEmitter().on('newServicedeskScenarioSaved', function () {

      //we need to update list only when new scenario created so to differenciate between save and save&display we are using this flag
      //so when user selects save button this flag will set to false
      object.navigatedFromInput = false;
      //get saved scenario id
      let savedScearioId = object.servicedeskSharedService.getScenarioSelection();

      if (savedScearioId != null || savedScearioId != undefined) {
        object.getScenarioDropdown();
      }

    });
    //chane in compare scenario dropdown
    object.commonService.getEventEmitter().on('servicedeskscenariodropdownchange', function () {
      //get selected scenario
      let scenario = object.commonService.getScenario();

      //call method to get scenario
      object.getScenarioDataById(scenario);

    });

    updateScenarioListNotificationServiceService.getEmitter().on('updateServiceDeskScenarioListAfterDeletion', function(){
      object.getScenarioDropdown();
    });

  }

  ngOnInit() {
    let object = this;
    this.currencyVar = require('currency-symbol-map');
    this.currentyear = (new Date()).getFullYear();
    this.previousYear = this.currentyear - 1;
    this.secondPreviousYear = this.currentyear - 2;

    //set page identifier
    object.industrySizeService.setPageId(11);
    object.genericEnterCompare.setPopID(11);
    // this is used for all landing page data
    object.ServicedeskLanding.getData().subscribe((allData: any) => {
      object.servicedeskData = allData;

      if (object.servicedeskData != undefined && object.servicedeskData != null) {
        object.landingPageDataLoaded = true;

        object.isAllReleventDataLoaded();
      }
      else {
        object.landingPageDataLoaded = false;

        object.showServiceDeskData = false;
      }

      //this.showServiceDeskData = true;
      this.updateLineChartData();
      object.updateDrillDown();
      this.compareServicedeskInputData();
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "11",
        "pageName": "Non CIO Service Desk Tower Landing Screen",
        "errorType": "Fatal",
        "errorTitle": "web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })


    // get group definition information
    object.industrySizeService.getDefinitionData().subscribe((data: any) => {
      object.servicedeskDefinitionData = data;
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "11",
        "pageName": "Non CIO Service Desk Tower Landing Screen",
        "errorType": "Fatal",
        "errorTitle": "web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });


    object.dropDownService.getIndustry().subscribe((data: any) => {
      object.data.industries = data.industries;
      object.selectedindustry = "Grand Total";
      object.defaultindustry = "Grand Total";
      object.industryLoaded = true;
      // object.notifyCompareScreen();

      if (object.data.industries != undefined && object.data.industries != null) {
        object.industryDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.industryDataLoaded = false;
        object.showServiceDeskData = false;
      }

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "11",
        "pageName": "Non CIO Service Desk Tower Landing Screen",
        "errorType": "Fatal",
        "errorTitle": "web Service Error",
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
      // object.notifyCompareScreen();

      if (object.data.region != undefined && object.data.region != null) {
        object.regionFilterLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.regionFilterLoaded = false;
        object.showServiceDeskData = false;
      }

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "11",
        "pageName": "Non CIO Service Desk Tower Landing Screen",
        "errorType": "Fatal",
        "errorTitle": "web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })

    object.dropDownService.getCurrency().subscribe((data: any) => {
      object.data.currency = data['currencyExchange'];
      let currency;
      object.data.currency.forEach(element => {
        if (element.value === "USD") {
          currency = element;
        }


      }, (error) => {
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId": "11",
          "pageName": "Non CIO Service Desk Tower Landing Screen",
          "errorType": "Fatal",
          "errorTitle": "web Service Error",
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

      if (object.data.currency != undefined && object.data.currency != null) {
        object.currencyFilterLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.currencyFilterLoaded = false;
        object.showServiceDeskData = false;
      }

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
          
          //
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


    //scale service
    object.industrySizeService.getIndustrySize().subscribe((data: any) => {

      object.data.industrySize = data["industrySize"];
      //setting the default Scale in IndustrySizeService
      this.industrySizeService.setScaleLabel(object.data.industrySize[0].key);
      object.industrySizeService.setScaleTitle(object.scaleTitle);
      this.industrySizeService.setInustrySize(object.data.industrySize[0].value);
      object.data.industrySize.forEach(element => {
      });

      if (object.data.industrySize != undefined && object.data.industrySize != null) {
        object.scaleDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.scaleDataLoaded = false;
        object.showServiceDeskData = false;
      }

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "11",
        "pageName": "Non CIO Service Desk Tower Landing Screen",
        "errorType": "Fatal",
        "errorTitle": "web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });

    //get scenario dropdown
    object.navigatedFromInput = false;
    object.navigatedFromComparison = false;
    object.getScenarioDropdown();

    //set page identifier
    object.industrySizeService.setPageId(11);
    object.genericEnterCompare.setPopID(11);

    object.getCRGDropdown();
    


    //for implementing single-valued donut chart
    if ((this.servicedeskData.drills.hardware).length == 1) {
      this.singleValueDonut = true;
    }

    //get custom reference group dropdown
    


    let valTomakePositive = "0";
    this.makePositiveValue(valTomakePositive);

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

      
        if(object.navigatedFromInput == true){
            //if it is navigated from input my data and new scenario is created using save&display functionality it will update list and display the comparision
          let savedScearioId = object.servicedeskSharedService.getScenarioSelection();
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
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId": "11",
          "pageName": "Non CIO Service Desk Tower Landing Screen",
          "errorType": "error",
          "errorTitle": "Data Error",
          "errorDescription": error.message,
          "errorObject": error
        }

        throw errorObj;
      })

    //this.showUnixData=true;

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

  // filter for scale
  setScale(scale) {

      //reset CRG selection
      this.selectedcustomRef = this.selectedCRGName[0];

    //send updated scale value to industry size service

    this.industrySizeService.setInustrySize(scale.value);
    //setting label for scale
    this.industrySizeService.setScaleLabel(scale.key);

    this.updateDrillDown();

    //call service for filtered data
    this.filterData();

    //make current button active
    this.scaleValue = scale.value;
  }

  filterData() {
    let object = this;
    object.industrySizeService.getMainFrameDataByScale().subscribe((data: any) => {
      object.servicedeskData = data;
      // this.showServiceDeskData = true;
      this.isLineChartDisabled=false;
      this.updateLineChartData();
      this.updateDrillDown();
      this.compareServicedeskInputData();
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "11",
        "pageName": "Non CIO Service Desk Tower Landing Screen",
        "errorType": "Fatal",
        "errorTitle": "web Service Error",
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
    this.updateLineChartData();
    this.filterData();
  }

  //set currency on change
  setCurrency(currency) {
    this.currencyCode = currency.value;
    this.refactorVal = currency.id;
    //set updated currency to industry size service
    this.industrySizeService.setCurrencyObject(currency);
    if(this.selectedcustomRef.customId != '-9999')
    {
      this.currencySymbol = this.currencyVar(this.currencyCode);
    }
    else
    {

    this.updateLineChartData();
    this.updateDrillDown();

    }
    
    if (this.showDiv == true) {
      
      this.convertCompareData(this.conversionCurrency, currency.key);
      this.compareServicedeskInputData();

      this.conversionCurrency = currency.key;

    }
  }

  updateLineChartData() {


    try {
      this.servicedeskUserOwnership = this.servicedeskData.drills.AnnualTCOPerServiceDeskUserCurrentYear.map(obj => {
        let rObj = {};
        rObj["label"] = obj.label;
        rObj["value"] = Number(obj.value) * this.refactorVal;
        return rObj;
      });

      this.servicedeskUserMarketPrice = this.servicedeskData.drills.AnnualPricePerServiceDeskUserCurrentYear.map(obj => {
        let rObj = {};
        rObj["label"] = obj.label;
        rObj["value"] = Number(obj.value) * this.refactorVal;
        return rObj;
      });

      this.OSCoreDataTicket = this.servicedeskData.drills.AnnualTCOPerServiceDeskTicketCurrentYear.map(obj => {
        let rObj = {};
        rObj["label"] = obj.label;
        rObj["value"] = Number(obj.value) * this.refactorVal;
        return rObj;
      });

      this.OSCoreMarketRateDataTicket = this.servicedeskData.drills.AnnualPricePerServiceDeskTicketCurrentYear.map(obj => {
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
        "dashboardId": "11",
        "pageName": "Non CIO Service Desk Tower Landing Screen",
        "errorType": "warn",
        "errorTitle": "Data Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    }

  }

  updateCompareData() {
    let object = this;
    let something = object.servicedeskSharedService.getData().currency;
    let scenarioRegion = object.servicedeskSharedService.getData().region;
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
        object.servicedeskData = false;
        object.regionFilterLoaded = false;
      }

    });

    if (object.navigatedFromComparison == true) {
      object.updateScenarioDropdown();
      let refactorValue = object.servicedeskSharedService.getData().refactorVal;
     
      let comparisionData = object.servicedeskSharedService.getData().comparisionData;
    
        for (let data of comparisionData) {
  
          let key = object.sourceMap[data.key];
          if (key != undefined && key != null && key != "#" && key != "%") {
            // data.value = data.value / currentValue.id;
            data.value = data.value * refactorValue;
          }
  
        }
      
    }

    if(object.navigatedFromInput == true){
      // object.updateScenarioDropdown();
      // object.updateDropDownOnSaveDisplay()
      object.getScenarioDropdown();
      
    }

  }

  updateScenarioDropdown() {
    //get selected scenario id
    let object = this;

    let selectedScenarioID = object.servicedeskSharedService.getScenarioSelection();
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
    

    let comparisionData = object.servicedeskSharedService.getData().comparisionData;
    
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
  //removing memory leaks
  ngOnDestroy() {
    //emit an event to indicate data is resetted
    this.industrySizeService.getEmitter().emit('landingPageDataReset');
    
    this.servicedeskSharedService.getEmitter().removeAllListeners();
  }

  //function to check all relevent data is loaded on page
  isAllReleventDataLoaded() {
    let object = this;


    // if (object.landingPageDataLoaded && object.scaleDataLoaded && object.regionFilterLoaded && object.currencyFilterLoaded && object.industryDataLoaded) {
      object.showServiceDeskData = true;


      //emit an event to indicate data is loaded
      object.industrySizeService.getEmitter().emit('landingPageDataLoaded');

    // }
    // else {
    //   object.showServiceDeskData = false;
    // }
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
        "dashboardId": "11",
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
          //this.updateLineChartData();
          this.updateDrillDown();
          this.currencySymbol = this.currencyVar(this.currencyCode);
        }
      });

      this.setRegion(this.selectedregion);


    }
    else//get comparison data for scenario
    {
      let requestedParam = {
        "userID": object.sessionId,
        "dashboardId": "11",
        "scenarioId": []
      }

      object.generateScenarioService.getSavedScenarioDataToPopulate("11", object.sessionId, scenarioID).subscribe((response) => {

        let object = this;

        object.selectedScenarioForComparison = [];

        object.scenarioObj = response;

        
        //logic to prepare a scenarion object for comparison

        for (let cnt = 0; cnt < object.scenarioObj.ServiceDeskInput.NA.length; cnt++) {
          let t1: any = {};
          t1.key = object.scenarioObj.ServiceDeskInput.NA[cnt].src_code;
          
          t1.value = object.scenarioObj.ServiceDeskInput.NA[cnt].src_code_value;
          //once save note functionality done append value of each src code note here
          t1.note = object.scenarioObj.ServiceDeskInput.NA[cnt].notes;
          t1.value_format = object.scenarioObj.ServiceDeskInput.NA[cnt].value_format;

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
        object.servicedeskSharedService.setData(sharedData);
        object.servicedeskSharedService.setScenarioSelection(scenarioID);
        let something = object.servicedeskSharedService.getData().currency;

        //get currency data
        object.data.currency.forEach((element) => {

          if (element.key == something) {
            this.selectedcurrency = element;
            this.currencyCode = element.value;
            this.conversionCurrency = element.key;
            this.refactorVal = element.id;
            ////this.updateLineChartData();
            this.updateDrillDown();
            this.currencySymbol = this.currencyVar(this.currencyCode);
          }
        });


        let scenarioRegion = object.servicedeskSharedService.getData().region;
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
          "dashboardId": "3",
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

  //get saved scenario data of selected Scanrio Id
  public selectedsceanrio: any;
  public sessionId: any;
  public userdata: any;
  public selectedScenarioForComparison: any = [];
  public scenarioObj: any;

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

    console.log('inside cgr function: ')    
    console.log(object.industrySizeService.getPageId());

    //wb service to fetch CRG list
    object.industrySizeService.setPageId(11);
    object.genericEnterCompare.setPopID(11);
    object.industrySizeService.getCustomRefereneGroupList().subscribe((data: any) => {

      try {

        
        console.log('CRG list: ',data);
        
        object.customReferenceGroupList = data;

      
        object.selectedCRGName = [];

        //set default selection
        let temp: any = {};
        temp.UpdatedDate = null;
        temp.createdBy = null;
        temp.createdDate = null;
        temp.customName = "N/A";
        temp.dashboardId = "11";
        temp.updatedBy = null;
        temp.customId = "-9999"; //
        temp.definition ="";
        object.selectedCRGName.push(temp);

        for (let index in object.customReferenceGroupList) {
          let option: any = {};

          if(object.customReferenceGroupList[index].dashboardId=='11')
          {
            option.UpdatedDate = object.customReferenceGroupList[index].UpdatedDate;
            option.createdBy = object.customReferenceGroupList[index].createdBy;
            option.createdDate = object.customReferenceGroupList[index].createdDate;
            option.customName = object.customReferenceGroupList[index].customName;
            option.dashboardId = object.customReferenceGroupList[index].dashboardId;
            option.updatedBy = object.customReferenceGroupList[index].updatedBy;
            option.customId = object.customReferenceGroupList[index].customId;
            option.definition =object.customReferenceGroupList[index].definition;
  
         
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


    if(object.showDiv==false) //in case compare scnarion is enabled, dont reset
    {
        //reset other filters
        object.resetNonCRGFilters();

    }

    

    //when selected N/A
    if (selectedcustomRef.customId == '-9999') {
      object.showDefaultLandingData();
      //enable line charts
      object.isLineChartDisabled=false;
    }
    else
    {
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

          
          if(crgData!=undefined || crgData!=null)
          {
            object.servicedeskData = crgData;
            object.landingPageDataLoaded=true;
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
    object.ServicedeskLanding.getData().subscribe((allData: any) => {
      object.servicedeskData = allData;

      if (object.servicedeskData != undefined && object.servicedeskData != null) {
        object.landingPageDataLoaded = true;

        object.isAllReleventDataLoaded();
      }
      else {
        object.landingPageDataLoaded = false;

        object.showServiceDeskData = false;
      }

      //this.showServiceDeskData = true;
      this.updateLineChartData();
      object.updateDrillDown();
      this.compareServicedeskInputData();
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "11",
        "pageName": "Non CIO Service Desk Tower Landing Screen",
        "errorType": "Fatal",
        "errorTitle": "web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })

    
  }

  resetNonCRGFilters(){

    let object = this;

    object.showServiceDeskData = false;
    object.landingPageDataLoaded =false;
    object.scaleDataLoaded = false;
    object.regionFilterLoaded =false;
    object.currencyFilterLoaded =false;

    //scale service
    object.showDefaultScale();

    //Region
    object.showDefaultRegion();
    
    //currency
    // object.showDefaultCurrency();
  }

  showDefaultScale()
  {
    let object = this;

    object.industrySizeService.getIndustrySize().subscribe((data: any) => {

      
      object.data.industrySize = data["industrySize"];

      if (object.data.industrySize != undefined && object.data.industrySize != null) {
        object.scaleDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.scaleDataLoaded = false;
        object.showServiceDeskData = false;
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

  showDefaultCurrency()
  {
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
          object.showServiceDeskData = false;
        }
  
      });
  
      object.selectedcurrency = currency;
  
      console.log('selected currency on CRG reset: ',object.selectedcurrency);
  
      object.currencySymbol  = object.currencyVar('USD');
  
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

  showDefaultRegion()
  {
    let object =this;

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
        object.showServiceDeskData = false;
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