/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:lan-network.component.ts **/
/** Description: This file is created to get the ladning page data, filter related data and compare/input my data with drill downs (Chart) **/
/** Created By: 10651577  Created Date: 28/09/2018 **/
/** Update By:  10650919  Update Date:  03/10/2018 **/
/*******************************************************/

import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import {
  FilterDataService
} from '../services/filter-data.service'
import {
  IndustrySizeService
} from '../services/industry-size.service'
import {
  FilterData
} from '../entities/filter-data';
import {
  IsgKpiData
} from '../entities/isg-kpi-data';
import {
  CioheaderdataService
} from '../services/cioheaderdata.service';
import {
  ChartCIOSharedService
} from '../services/chart-cioshared.service';
import {
  EventEmitter
} from 'protractor';
import {
  HeaderCompareScreenDataService
} from '../services/header-compare-screen-data.service';
import {
  CompareComponent
} from '../Compare/compare.component';
import {
  DropDownService
} from '../services/drop-down.service';
import {
  Location
} from '@angular/common';
import {
  Router
} from '@angular/router';
import {
  LanService
} from '../services/network/lan/lan.service'
import {
  MapSourceCodeDataValues
} from '../map-source-code-data-values';
import {
  LANInputMyDataSharedService
} from '../services/network/lan/laninput-my-data-shared.service';

import { negativeConstant } from '../../properties/constant-values-properties';
import { EnterCompareDataTowersService } from '../services/enter-compare-data-towers.service';
import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';
import { GenerateScenarioService } from '../services/generate-scenario.service';
import { UpdateScenarioListNotificationServiceService } from '../services/update-scenario-list-notification-service.service';

declare var $: any;
@Component({
  selector: 'lan',
  templateUrl: './lan-network.component.html',
  styleUrls: ['./lan-network.component.css']
})
export class LanNetworkComponent implements OnInit, OnDestroy {
  showMainFrameData: boolean = false;
  data: any = {};
  private data1: IsgKpiData;
  lanDefinitionData: any;

  public isLineChartDisabled:boolean = false;

  lanData: any;
  private showLANData: boolean = false;
  private conversionCurrency: any = null;
  private mapdata: any; //any is not a good practise,whats the point of using typescript then ?
  private scenarioData: any;

  enterMyData = {
    "availablityPercentage": null,
    "utilizationPercentage": null,
    "staffingmixEmployee": null,
    "staffingmixContract": null,
    "numberOfActiveLANPortsPerFTE": null,
    "annualTCOPerActiveLANPort": null,
    "officeLAN": null,
    "dcLAN": null
  }

  public selectedmydata: any;
  private selectedindustry; //it will be assigned string
  selectedregion; //it will be assigned string
  private selectedsize; //it will be assigned string
  selectedcurrency; //this will be assigned whole object currency

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

  public mainframeData: any;
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
  public dataCio: any;
  currencyCode: string = "USD";
  refactorVal: number = 1;
  showDiv: boolean = false;

  display_costPerUser = 'none';

  public dataSourceCostPerUser: object;
  public currentyear: number;
  public previousYear: number;
  public secondPreviousYear: number;

  //objects to store line chart data
  public annualCostMIPs: any;
  public marketCostMIPs: any;
  public currencyVar: any;
  public currencySymbol: string;

  private sourceMap: Map<string, string>;

  private scaleTitle = "Scale (LAN Active Ports)";

  //equality
  public TCOLanPortEqaulity: boolean = false;
  public lanPortUtilizationEquality: boolean = false;
  public lanPortAvailEquality: boolean = false;
  public LANPerFTEEquality: boolean = false;
  public staffingEmployeeEquality: boolean = false;
  public contractEquality: boolean = false;
  public officeLANEquality: boolean = false;
  public DCLANEquality: boolean = false;

  //variables to check data load status
  public landingPageDataLoaded: boolean = false;
  public scaleDataLoaded: boolean = false;
  public regionFilterLoaded: boolean = false;
  public currencyFilterLoaded: boolean = false;
  public industryDataLoaded: boolean = false;

  public scenarios: any;
  public selectedScenarioList: any[];
  public selectedscenario: any;

  //CRG
  public customReferenceGroupList: any;
  public selectedCRGName: any;
  public CRGNameToCompare: any;
  public selectedcustomRef: any;
  public selectedCRGData: any;


  //negative constant for null values
  NEGATIVE_CONST: number;

  public navigatedFromComparison: boolean = false;
  public navigatedFromInput: boolean = false;
  public selectedScenarioName: any;
  public isCrgSelected : boolean=false;

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


  costPerUserDialog() {
    this.display_costPerUser = 'block';
    this.showDrillDown = true;
  }

  closeCostPerUserModalDialog() {
    this.display_costPerUser = 'none';
    this.showDrillDown = false;
  }

  public updateDrillDown() {
    // For Annual Cost Per Installed TB
    this.dataSourceCostPerUser = {
      chart: {
        decimals: "1",
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
      categories: [{
        category: [{
          label: "" + this.secondPreviousYear
        },
        {
          label: "" + this.previousYear
        },
        {
          label: "" + this.currentyear
        }
        ]
      }],
      dataset: [{
        seriesname: "Annual TCO Cost Per Active Port",
        anchorBgColor: "#03abba",
        "valuePosition": "BELOW",
        "data": this.annualCostMIPs
      },
      {
        seriesname: "Annual Market Price Per Active Port",
        anchorBgColor: "#29497b",
        "valuePosition": "ABOVE",
        "data": this.marketCostMIPs
      }
      ]

    };
  }

  constructor(private service: FilterDataService, private commonService: CioheaderdataService, private compareHeaderDataService: HeaderCompareScreenDataService, private dropDownService: DropDownService, private industrySizeService: IndustrySizeService, location: Location, router: Router, private chartService: ChartCIOSharedService, private lanService: LanService, private lanSharedService: LANInputMyDataSharedService, private genericEnterCompare: EnterCompareDataTowersService, private loginDataBroadcastService: LoginDataBroadcastService,
    private generateScenarioService: GenerateScenarioService, private updateScenarioListNotificationServiceService: UpdateScenarioListNotificationServiceService) {
    let object = this;
    object.industryLoaded = false;
    object.regionLoaded = false;

    router.events.subscribe((val) => {
      if (location.path() == '/kpiMaintainace') {
        this.showHeader = false;
        object.currentURL = '/kpiMaintainace';
      } else {
        this.showHeader = true;
        object.currentURL = location.path();

      }
      //for mainframe
      if (location.path() == '/Mainframe') {
        this.showMainframeHeader = true;
        object.currentURL = '/Mainframe';
      } else {
        this.showMainframeHeader = false;
        object.currentURL = location.path();

      }



    });

    let lanSharedEmitter = object.lanSharedService.getEmitter();
    lanSharedEmitter.on('callFunction', function () {
      object.sourceMap = object.lanSharedService.getData().map;
      object.navigatedFromComparison = true;
      object.toggle();

    });

    lanSharedEmitter.on('newLANScenarioFromInput', function () {
      object.sourceMap = object.lanSharedService.getData().map;
      object.navigatedFromInput = true;
      object.toggle();

    });

    //on save scenario
    object.lanSharedService.getEmitter().on('newLANScenarioSaved', function () {
      object.navigatedFromInput = false;
      //get saved scenario id
      let savedScearioId = object.lanSharedService.getScenarioSelection();

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

    updateScenarioListNotificationServiceService.getEmitter().on('updateLanScenarioListAfterDeletion', function(){
      object.getScenarioDropdown();
    });
	

  }

  toggle() {

    this.showDiv = true;
    this.updateCompareData();
    //  console.log('in toggle', this.selectedcurrency);
    this.compareLanInputData();

  }

  updateScenarioDropdown() {
    //get selected scenario id
    let object = this;

    let selectedScenarioID = object.lanSharedService.getScenarioSelection();
    //object.mainframeSharedService.getData().selectedScenarioId[0];
    object.selectedscenario = object.selectedScenarioName[selectedScenarioID];

  }

  public infinity: number = 1 / 0;

  compareLanInputData() {

    try {
      let object = this;
      let test = new MapSourceCodeDataValues();
      object.scenarioData = object.lanSharedService.getData().comparisionData;;
      object.mapdata = test.mapData(object.scenarioData);

      //get constant value
      object.NEGATIVE_CONST = negativeConstant.NEGATIVE_CONSTANT;

      // console.log(JSON.stringify(this.enterMyData));
      // ENW060 / ( ENW060 + ENW065 )


      if (object.mapdata.ENW060 == this.NEGATIVE_CONST && object.mapdata.ENW065 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixEmployee = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.ENW060 == this.NEGATIVE_CONST) {
        // object.mapdata.ESP020=0;
        this.enterMyData.staffingmixEmployee = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.ENW065 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixEmployee = eval("object.mapdata.ENW060 / (object.mapdata.ENW060 + 0)");

      }
      else {
        this.enterMyData.staffingmixEmployee = eval("object.mapdata.ENW060 / (object.mapdata.ENW060 + object.mapdata.ENW065)");
      }




      let temp1 = Number((this.enterMyData.staffingmixEmployee * 100)).toFixed(1);
      let temp2 = Number((this.lanData.data.StaffingMix.StaffingMixEmployee.Number.value)).toFixed(1);


      if (temp1 == temp2) {
        this.staffingEmployeeEquality = true;

      }

      if (this.enterMyData.staffingmixEmployee == Infinity || this.enterMyData.staffingmixEmployee == 'infinity' || this.enterMyData.staffingmixEmployee == "Infinity" || isNaN(this.enterMyData.staffingmixEmployee)) {
        this.enterMyData.staffingmixEmployee = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.staffingmixEmployee)) {
        this.enterMyData.staffingmixEmployee = this.enterMyData.staffingmixEmployee;
      } else {
        this.enterMyData.staffingmixEmployee = 0;
      }

      // ENW065 / ( ENW060 + ENW065 )

      if (object.mapdata.ENW060 == this.NEGATIVE_CONST && object.mapdata.ENW065 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixContract = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.ENW065 == this.NEGATIVE_CONST) {
        // object.mapdata.ESP020=0;
        this.enterMyData.staffingmixContract = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.ENW060 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixContract = eval("object.mapdata.ENW065 / (object.mapdata.ENW065 + 0)");
      }
      else {
        this.enterMyData.staffingmixContract = eval("object.mapdata.ENW065 / (object.mapdata.ENW060 + object.mapdata.ENW065)");
      }


      let enterContract = (Number(this.enterMyData.staffingmixContract) * 100).toFixed(1);
      let userContract = Number(this.lanData.data.StaffingMix.StaffingMixContractor.Number.value).toFixed(1);


      if (enterContract == userContract) {
        this.contractEquality = true;
      }


      if (this.enterMyData.staffingmixContract == Infinity || this.enterMyData.staffingmixContract == 'infinity' || this.enterMyData.staffingmixContract == "Infinity" || isNaN(this.enterMyData.staffingmixContract)) {
        this.enterMyData.staffingmixContract = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.staffingmixContract)) {
        this.enterMyData.staffingmixContract = this.enterMyData.staffingmixContract;
      } else {
        this.enterMyData.staffingmixContract = 0;
      }

      // NW1010 / NW0010

      this.enterMyData.annualTCOPerActiveLANPort = eval("object.mapdata.NW1010 / object.mapdata.NW0010");


      let temp3 = Math.round(this.enterMyData.annualTCOPerActiveLANPort);
      let temp4 = Math.round(this.lanData.data.AnnualCostPerActiveLANPort.LANCostPerPort.Number.value);

      if (temp3 == temp4) {
        this.TCOLanPortEqaulity = true;
      }
      else {
        this.TCOLanPortEqaulity = false;
      }

      if (this.enterMyData.annualTCOPerActiveLANPort == Infinity || this.enterMyData.annualTCOPerActiveLANPort == 'infinity' || this.enterMyData.annualTCOPerActiveLANPort == "Infinity" || isNaN(this.enterMyData.annualTCOPerActiveLANPort)) {
        this.enterMyData.annualTCOPerActiveLANPort = this.NEGATIVE_CONST;
      }

      // A14120
      this.enterMyData.availablityPercentage = eval("object.mapdata.A14120");

      // A23300
      this.enterMyData.utilizationPercentage = eval("object.mapdata.A23300");

      let enterUtil = Number(this.enterMyData.utilizationPercentage).toFixed(1);
      let userUtil = Number(this.lanData.data.Utilization.LANUtilization.Number.value).toFixed(1);


      //if(this.enterMyData.utilizationPercentage==this.lanData.data.Utilization.LANUtilization.Number.value)
      if (userUtil == enterUtil) {

        this.lanPortUtilizationEquality = true;
      }
      else {
        this.lanPortUtilizationEquality = false;
      }

      let userAvail = Number(this.lanData.data.Availability.LANAvailability.Number.value).toFixed(2);
      let enterAvail = Number(this.enterMyData.availablityPercentage).toFixed(2);


      //if(this.enterMyData.availablityPercentage==this.lanData.data.Availability.LANAvailability.Number.value)
      if (userAvail == enterAvail) {
        this.lanPortAvailEquality = true;
      }
      else {
        this.lanPortAvailEquality = false;
      }

      // NW0010 / ( ENW060 + ENW065 )
      if (object.mapdata.NW0010 == this.NEGATIVE_CONST && object.mapdata.ENW060 == this.NEGATIVE_CONST && object.mapdata.ENW065 == this.NEGATIVE_CONST) {
        this.enterMyData.numberOfActiveLANPortsPerFTE = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.NW0010 == this.NEGATIVE_CONST) {
        this.enterMyData.numberOfActiveLANPortsPerFTE = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.ENW060 == this.NEGATIVE_CONST) {
        this.enterMyData.numberOfActiveLANPortsPerFTE = eval("object.mapdata.NW0010 / (0 + object.mapdata.ENW065)");
      }
      else if (object.mapdata.ENW065 == this.NEGATIVE_CONST) {
        this.enterMyData.numberOfActiveLANPortsPerFTE = eval("object.mapdata.NW0010 / (object.mapdata.ENW060 + 0)");
      }
      else {
        this.enterMyData.numberOfActiveLANPortsPerFTE = eval("object.mapdata.NW0010 / (object.mapdata.ENW060 + object.mapdata.ENW065)");

      }


      let temp5 = Math.round(this.enterMyData.numberOfActiveLANPortsPerFTE);
      let temp6 = Math.round(this.lanData.data.NumberofActiveLANPortsPerFTE.PortsPerLANFTE.Number.value);

      if (temp5 == temp6) {
        this.LANPerFTEEquality = true;
      }
      else {
        this.LANPerFTEEquality = false;
      }

      if (this.enterMyData.numberOfActiveLANPortsPerFTE == Infinity || this.enterMyData.numberOfActiveLANPortsPerFTE == 'infinity' || this.enterMyData.numberOfActiveLANPortsPerFTE == "Infinity" || isNaN(this.enterMyData.numberOfActiveLANPortsPerFTE)) {
        this.enterMyData.numberOfActiveLANPortsPerFTE = this.NEGATIVE_CONST;
      }

      // NW0400
      this.enterMyData.officeLAN = eval("object.mapdata.NW0400");


      let enterOfficeLAN = Number(this.enterMyData.officeLAN).toFixed(1);
      let userOfficeLAN = Number(this.lanData.data.OfficeLANvsDCLAN.LANOffice.LANOffice.value).toFixed(1);

      if (enterOfficeLAN == userOfficeLAN) {
        this.officeLANEquality = true;
      }
      else {
        this.officeLANEquality = false;
      }

      // NW0450
      this.enterMyData.dcLAN = eval("object.mapdata.NW0450");

      let enterDCLAN = Number(this.enterMyData.dcLAN).toFixed(1);
      let userDCLAN = Number(this.lanData.data.OfficeLANvsDCLAN.LANDC.LANDC.value).toFixed(1);

      if (enterDCLAN == userDCLAN) {
        this.DCLANEquality = true;
      }
      else {
        this.DCLANEquality = false;
      }

      // if (this.enterMyData.officeLAN < this.lanData.data.OfficeLANvsDCLAN.LANOffice.LANOffice.value) {
      //   document.getElementById("officveLANSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if (this.enterMyData.dcLAN < this.lanData.data.OfficeLANvsDCLAN.LANDC.LANDC.value) {
      //   document.getElementById("dcLANSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if (this.enterMyData.annualTCOPerActiveLANPort < this.lanData.data.AnnualCostPerActiveLANPort.LANCostPerPort.Number.value) {
      //   document.getElementById("annualTCOCostPerActiveLANPortSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if (this.enterMyData.annualTCOPerActiveLANPort < this.lanData.data.AnnualCostPerActiveLANPort.LANCostPerPort.Number.value) {
      //   document.getElementById("marketPriceLANPortSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if (this.enterMyData.availablityPercentage < this.lanData.data.Availability.LANAvailability.Number.value) {
      //   document.getElementById("availabilityPercentageLANSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if (this.enterMyData.utilizationPercentage < this.lanData.data.Utilization.LANUtilization.Number.value) {
      //   document.getElementById("utilizationPercentageLANSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if (this.enterMyData.numberOfActiveLANPortsPerFTE < this.lanData.data.NumberofActiveLANPortsPerFTE.PortsPerLANFTE.Number.value) {
      //   document.getElementById("numberofActiveLANPortsPerFTESVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if ((this.enterMyData.staffingmixEmployee * 100) < this.lanData.data.StaffingMix.StaffingMixEmployee.Number.value) {
      //   document.getElementById("LANStaffingMixEmployeeSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if ((this.enterMyData.staffingmixContract * 100) < this.lanData.data.StaffingMix.StaffingMixContractor.Number.value) {
      //   document.getElementById("LANStaffingMixContactorSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }
      //   console.log(JSON.stringify(this.enterMyData));
    } catch (error) {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "7",
        "pageName": "Non CIO LAN Tower Landing Screen",
        "errorType": "warn",
        "errorTitle": "Data Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    }

  }

  ngOnInit() {
    let object = this;

    this.currencyVar = require('currency-symbol-map');

    this.currentyear = (new Date()).getFullYear();
    this.previousYear = this.currentyear - 1;
    this.secondPreviousYear = this.currentyear - 2;

    this.industrySizeService.setScaleLabel('<20,000');

    $(".option-menus-collapse").hide();
    $(".search-box").addClass('search-hide');
    this.searchIcon();

    //set page identifier as 7 for LAN
    object.industrySizeService.setPageId(7);
    object.genericEnterCompare.setPopID(7);


    //get CRG dropdown
    object.getCRGDropdown();


    object.lanService.getData().subscribe((allData: any) => {
      object.lanData = allData;


      //this.showLANData = true;

      object.updateLineChartData();
      object.updateDrillDown();

      if (object.lanData != undefined && object.lanData != null) {
        object.landingPageDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.landingPageDataLoaded = false;
        object.showLANData = false;
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

    let valTomakePositive = "0";
    this.makePositiveValue(valTomakePositive);



    object.dropDownService.getIndustry().subscribe((data: any) => {
      object.data.industries = data.industries;
      object.selectedindustry = "Grand Total";
      object.defaultindustry = "Grand Total";
      object.industryLoaded = true;

      if (object.data.industries != undefined && object.data.industries != null) {
        object.industryDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.industryDataLoaded = false;
        object.showLANData = false;
      }

      object.notifyCompareScreen();
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

    object.dropDownService.getRegions().subscribe((data: any) => {
      object.data.region = data.region;

      if (object.data.region != undefined && object.data.region != null) {
        object.regionFilterLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.regionFilterLoaded = false;
        object.showLANData = false;
      }

      object.selectedregion = "Grand Total";
      object.defaultregion = "Grand Total";
      object.regionLoaded = true;
      object.notifyCompareScreen();
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

    object.dropDownService.getCurrency().subscribe((data: any) => {
      object.data.currency = data['currencyExchange'];


      let currency;
      object.data.currency.forEach(element => {
        if (element.value === "USD") {
          currency = element;
        }
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
        object.showLANData = false;
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
    });

    //get scenario dropdown
    object.navigatedFromInput = false;
    object.navigatedFromComparison = false;
    object.getScenarioDropdown();



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
          console.log("scenario data :  ", object.selectedScenarioList);
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



    // get group definition information
    object.industrySizeService.getDefinitionData().subscribe((data: any) => {
      object.lanDefinitionData = data;
      //  console.log('pathik');
      // console.log(object.lanDefinitionData);
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
    });

    //scale service
    object.industrySizeService.getIndustrySize().subscribe((data: any) => {

      object.data.industrySize = data["industrySize"];


      //setting the default Scale in IndustrySizeService
      this.industrySizeService.setScaleLabel(object.data.industrySize[0].key);
      object.industrySizeService.setScaleTitle(object.scaleTitle);
      this.industrySizeService.setInustrySize(object.data.industrySize[0].value);
      object.data.industrySize.forEach(element => { });

      if (object.data.industrySize != undefined && object.data.industrySize != null) {
        object.scaleDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.scaleDataLoaded = false;
        object.showLANData = false;
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
    });


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
        let savedScearioId = object.lanSharedService.getScenarioSelection();
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

  makePositiveValue(val) {
    return Math.abs(val).toFixed(2);
  }

  public getKPIData(filter: string, filterValue: string) {
    let object = this;
    this.service.getFilterData(filter, filterValue).subscribe((data) => {
      this.data1 = data;
      let emitter: EventEmitter = object.commonService.getEventEmitter();
      let sharedData = {
        "cioData": data,
        "selectCurrency": object.selectedcurrency
      };
      object.commonService.setData(sharedData);
      emitter.emit('change');
    },
      (error) => {
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

  //function to update line chart object
  updateLineChartData() {
    try {
      //update line chart objects
      this.annualCostMIPs = this.lanData.drills.AnnualTCOPerActiveLANPortCurrentYear.map(obj => {
        let rObj = {};
        rObj["label"] = obj.label;
        rObj["value"] = Number(obj.value) * this.refactorVal;
        return rObj;
      });

      this.marketCostMIPs = this.lanData.drills.AnnualPricePerActiveLANPortCurrentYear.map(obj => {
        let rObj = {};
        rObj["label"] = obj.label;
        rObj["value"] = Number(obj.value) * this.refactorVal;
        return rObj;
      });

      //change currency symbol
      this.currencySymbol = this.currencyVar(this.currencyCode);

    } catch (error) {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "7",
        "pageName": "Non CIO LAN Tower Landing Screen",
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
    try {

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

    } catch (error) {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "7",
        "pageName": "Non CIO LAN Tower Landing Screen",
        "errorType": "warn",
        "errorTitle": "Data Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
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
    this.selectedItem = newValue; // don't forget to update the model here
    // ... do other stuff here ...
  }

  // filter for scale
  setScale(scale) {

    //reset CRG selection
    this.selectedcustomRef = this.selectedCRGName[0];

    //send updated scale value to industry size service
    this.industrySizeService.setInustrySize(scale.value);
    this.industrySizeService.setScaleLabel(scale.key);
    //call service for filtered data
    this.filterData();

    //make current button active
    this.scaleValue = scale.value;
  }

  filterData() {
    let object = this;
    object.industrySizeService.getMainFrameDataByScale().subscribe((data: any) => {
      object.lanData = data;
      //this.showLANData = true;
      this.isLineChartDisabled=false;
      this.updateLineChartData();
      this.updateDrillDown();
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
      this.currencySymbol = this.currencyVar(this.currencyCode);
    }

    if (this.showDiv == true) {


      this.convertCompareData(this.conversionCurrency, currency.key);
      this.compareLanInputData();

      //   console.log('after conversion previous', this.getCurrency(this.conversionCurrency));
      //  console.log('after coversion selected', currency.key);
      this.conversionCurrency = currency.key;

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
    //setemail
    object.industrySizeService.setUserEmail(object.userdata['userDetails']['emailId']);
    object.sessionId = object.userdata['userDetails']["sessionId"];
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
        "dashboardId": "7",
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
        "dashboardId": "7",
        "scenarioId": []
      }

      object.generateScenarioService.getSavedScenarioDataToPopulate("7", object.sessionId, scenarioID).subscribe((response) => {

        let object = this;

        object.selectedScenarioForComparison = [];

        object.scenarioObj = response;
        //logic to prepare a scenarion object for comparison

        for (let cnt = 0; cnt < object.scenarioObj.LANInput.NA.length; cnt++) {
          let t1: any = {};
          t1.key = object.scenarioObj.LANInput.NA[cnt].src_code;
          // console.log()
          t1.value = object.scenarioObj.LANInput.NA[cnt].src_code_value;
          //once save note functionality done append value of each src code note here
          t1.note = object.scenarioObj.LANInput.NA[cnt].notes;

          t1.value_format = object.scenarioObj.LANInput.NA[cnt].value_format;

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
        object.lanSharedService.setData(sharedData);
        object.lanSharedService.setScenarioSelection(scenarioID);
        let something = object.lanSharedService.getData().currency;

        //get currency data
        object.data.currency.forEach((element) => {

          if (element.key == something) {
            this.selectedcurrency = element;
            this.currencyCode = element.value;
            this.conversionCurrency = element.key;
            this.refactorVal = element.id;
            this.currencySymbol = this.currencyVar(this.currencyCode);
            //this.updateLineChartData();
            //this.updateDrillDown();
          }
        });


        object.toggle();

        let scenarioRegion = object.lanSharedService.getData().region;
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
          "dashboardId": "7",
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

  updateCompareData() {
    let object = this;

    let something = object.lanSharedService.getData().currency;
    let scenarioRegion = object.lanSharedService.getData().region;

    console.log('fetched region: ', scenarioRegion);

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

    object.data.region.forEach((el) => {

      if (el.key == scenarioRegion) {
        this.selectedregion = el;
        console.log('this.selectedregion: ', this.selectedregion);
        this.regionLoaded = true;
      }

      if (object.data.region != null && object.data.region != undefined) {
        object.regionFilterLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.lanData = false;
        object.regionFilterLoaded = false;
      }

    });

    if (object.navigatedFromComparison == true) {
      object.updateScenarioDropdown();
      let refactorValue = object.lanSharedService.getData().refactorVal;

      let comparisionData = object.lanSharedService.getData().comparisionData;

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

  convertCompareData(prevCurrencyKey, currenctCurrencyKey) {
    let object = this;
    let prevCurrencyObject = object.getCurrency(prevCurrencyKey);
    let currenctCurrencyObject = object.getCurrency(currenctCurrencyKey);

    object.convertValue(prevCurrencyObject, currenctCurrencyObject);
    //  console.log('in lan storage', this.conversionCurrency);
  }


  convertValue(currentValue, targetValue) {

    let object = this;
    //  console.log(currentValue, targetValue);

    let comparisionData = object.lanSharedService.getData().comparisionData;
    //  console.log(JSON.stringify(comparisionData));
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
      //  console.log(error);
    }
    //   console.log(JSON.stringify(object.lanSharedService.getData().comparisionData));



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
    this.lanSharedService.getEmitter().removeAllListeners();
    //  console.log(this.lanSharedService.getEmitter().listeners('callFunction'));
  }

  //function to check all relevent data is loaded on page
  isAllReleventDataLoaded() {
    let object = this;

    if (object.landingPageDataLoaded && object.scaleDataLoaded && object.regionFilterLoaded && object.currencyFilterLoaded && object.industryDataLoaded) {
      object.showLANData = true;

      //emit an event to indicate data is loaded
      object.industrySizeService.getEmitter().emit('landingPageDataLoaded');

    }
    else {
      object.showLANData = false;
    }
  }

  //CRG functions

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
        temp.dashboardId = "7";
        temp.updatedBy = null;
        temp.customId = "-9999"; //
        temp.definition = "";
        object.selectedCRGName.push(temp);

        for (let index in object.customReferenceGroupList) {
          let option: any = {};

          if (object.customReferenceGroupList[index].dashboardId == '7') {
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
      object.showDefaultCurrency();

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
          object.lanData = crgData;
          object.landingPageDataLoaded = true;
          //disable line charts
          object.isLineChartDisabled=true;
        }

      });
    }


    // object.getScenarioDataById(this.selectedscenario);

  }

  showDefaultLandingData() {

    let object = this;

    // this is used for all landing page data
    object.lanService.getData().subscribe((allData: any) => {
      object.lanData = allData;


      //this.showLANData = true;

      object.updateLineChartData();
      object.updateDrillDown();

      if (object.lanData != undefined && object.lanData != null) {
        object.landingPageDataLoaded = true;
        // object.isAllReleventDataLoaded();
      }
      else {
        object.landingPageDataLoaded = false;
        object.showLANData = false;
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
        // object.isAllReleventDataLoaded();
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
          // object.isAllReleventDataLoaded();
        }
        else {
          object.currencyFilterLoaded = false;
          object.showLANData = false;
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
        // object.isAllReleventDataLoaded();
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
