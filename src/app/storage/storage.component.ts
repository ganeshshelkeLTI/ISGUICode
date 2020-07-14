/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:storage.component.ts **/
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
import { StorageService } from '../services/storage/storage.service'
import { MapSourceCodeDataValues } from '../map-source-code-data-values';
import { StorageInputMyDataSharedService } from '../services/storage/storage-input-my-data-shared.service';
import { StorageEditAndCompareSharedService } from '../services/storage/storage-edit-and-compare-shared.service';
import { negativeConstant } from '../../properties/constant-values-properties';
import { EnterCompareDataTowersService } from '../services/enter-compare-data-towers.service';
import { GenerateScenarioService } from '../services/generate-scenario.service';
import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';
import { CustomRefGroupService } from '../services/custom-ref-group/custom-ref-group.service';
import { UpdateScenarioListNotificationServiceService } from '../services/update-scenario-list-notification-service.service';

declare var $: any;
@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.css']
})
export class StorageComponent implements OnInit, OnDestroy {
  showMainFrameData: boolean = false;

  private mapdata: any; //any is not a good practise,whats the point of using typescript then ?
  private scenarioData: any;

  public isLineChartDisabled:boolean = false;

  enterMyData = {
    "availablityPercentage": null,
    "noOfConfiguredMIPS": null,
    "utilizationPercentage": null,
    "staffingmixEmployee": null,
    "staffingmixContract": null,
    "annualTCOCostPerOSInstance": null,
    "annualTCOCostPerInstalledTB": null,
    "noOfInstalledTBsPerStorageFTE": null,
    "sanPercentage": null,
    "nasPercentage": null,
    "backupandarchivePercentage": null
  }

  //private data: FilterData;
  private data: any = {};
  private data1: IsgKpiData;

  private storageDefinitionData: any;
  private storageData: any;
  showStorageData: boolean = false;

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
  private conversionCurrency: any = null;
  private sourceCurrencyMap: Map<string, string>;

  private scaleTitle = "Scale (Installed TBs)";

  public storageFTEEquality: boolean = false;
  public storageOneEquality: boolean = false;
  public staffingEmployeeEquality: boolean = false;
  public contractEquality: boolean = false;

  //variables to check data load status
  public landingPageDataLoaded: boolean = false;
  public scaleDataLoaded: boolean = false;
  public regionFilterLoaded: boolean = false;
  public currencyFilterLoaded: boolean = false;
  public industryDataLoaded: boolean = false;

  public scenarios: any;
  public selectedScenarioList: any[];

  public navigatedFromComparison: boolean =false;
  public navigatedFromInput: boolean =false;
  public selectedScenarioName: any;
  public selectedscenario: any;

  //negative constant for null values
  NEGATIVE_CONST: number;

  map: Map<string, string> = new Map<string, string>();

  customReferenceGroupList : any;
  selectedCRGName = [];
  selectedcustomRef: any;
  public isCrgSelected : boolean=false;

  //variable for dashboard data

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

  makePositiveValue(val) {
    return Math.abs(val).toFixed(2);
  }

  toggle() {
    this.showDiv = true;
    this.updateCompareData();
    this.compareStorageInputData();
  }

  compareStorageInputData() {

    try {
      let object = this;
      object.staffingEmployeeEquality = false;
      object.contractEquality = false;
      let storageMap = new MapSourceCodeDataValues();
      if (object.storageSharedService.getData().comparisionData == undefined) return;
      object.scenarioData = object.storageSharedService.getData().comparisionData;

      object.mapdata = storageMap.mapData(object.scenarioData);

      //get constant value
      object.NEGATIVE_CONST = negativeConstant.NEGATIVE_CONSTANT;


      // (E34060)
      this.enterMyData.availablityPercentage = eval("object.mapdata.E34060");

      // (E37060)
      this.enterMyData.utilizationPercentage = eval("object.mapdata.E37060");

      // DES100 / ES0010
      this.enterMyData.annualTCOCostPerInstalledTB = eval("object.mapdata.DES100 / object.mapdata.ES0010");

      // this.enterMyData.annualTCOCostPerInstalledTB = 1671;

      let temp1 = Math.round(this.enterMyData.annualTCOCostPerInstalledTB);
      let temp2 = Math.round(this.storageData.data.AnnualCostPerInstalledTB.CostPerTB.Number.value);

      if (temp1 == temp2) {
        this.storageOneEquality = true;
      }

      if (this.enterMyData.annualTCOCostPerInstalledTB == Infinity || this.enterMyData.annualTCOCostPerInstalledTB == 'infinity' || this.enterMyData.annualTCOCostPerInstalledTB == "Infinity" || isNaN(this.enterMyData.annualTCOCostPerInstalledTB)) {
        this.enterMyData.annualTCOCostPerInstalledTB = this.NEGATIVE_CONST;
      }

      // EES010 / ( EES010 + EES020 )
      if (object.mapdata.EES010 == this.NEGATIVE_CONST && object.mapdata.EES020 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixEmployee = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.EES010 == this.NEGATIVE_CONST) {
        // object.mapdata.ESP020=0;
        this.enterMyData.staffingmixEmployee = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.EES020 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixEmployee = eval("object.mapdata.EES010 / (object.mapdata.EES010 + 0)");
      }
      else {
        this.enterMyData.staffingmixEmployee = eval("object.mapdata.EES010 / (object.mapdata.EES010 + object.mapdata.EES020)");
      }



      let temp11 = Number((this.enterMyData.staffingmixEmployee * 100)).toFixed(1);
      let temp22 = Number((this.storageData.data.StaffingMix.StaffingMixEmployee.Number.value)).toFixed(1);
      if (temp11 == temp22) {
        this.staffingEmployeeEquality = true;
      }

      if (this.enterMyData.staffingmixEmployee == Infinity || this.enterMyData.staffingmixEmployee == 'infinity' || this.enterMyData.staffingmixEmployee == "Infinity" || isNaN(this.enterMyData.staffingmixEmployee)) {
        this.enterMyData.staffingmixEmployee = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.staffingmixEmployee)) {
        this.enterMyData.staffingmixEmployee = this.enterMyData.staffingmixEmployee;
      } else {
        this.enterMyData.staffingmixEmployee = 0;
      }

      // EES020 / ( EES010 + EES020 )
      if (object.mapdata.EES010 == this.NEGATIVE_CONST && object.mapdata.EES020 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixContract = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.EES020 == this.NEGATIVE_CONST) {
        // object.mapdata.ESP020=0;
        this.enterMyData.staffingmixContract = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.EES010 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixContract = eval("object.mapdata.EES020 / (0 + object.mapdata.EES020)");
      }
      else {
        this.enterMyData.staffingmixContract = eval("object.mapdata.EES020 / (object.mapdata.EES010 + object.mapdata.EES020)");
      }



      let enterContract = (Number(this.enterMyData.staffingmixContract) * 100).toFixed(1);
      let userContract = Number(this.storageData.data.StaffingMix.StaffingMixContractor.Number.value).toFixed(1);

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

      // ( EES010 + EES020 ) / ES0010
      // this.enterMyData.noOfInstalledTBsPerStorageFTE = eval("object.mapdata.ES0010 / (object.mapdata.EES010 + object.mapdata.EES020)");


      if (object.mapdata.EES010 == 0 && object.mapdata.EES020 == 0) {
        this.enterMyData.noOfInstalledTBsPerStorageFTE = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.ES0010 == this.NEGATIVE_CONST && object.mapdata.EES010 == this.NEGATIVE_CONST && object.mapdata.EES020 == this.NEGATIVE_CONST) {
        this.enterMyData.noOfInstalledTBsPerStorageFTE = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.EES010 == this.NEGATIVE_CONST && object.mapdata.EES020 == this.NEGATIVE_CONST) {
        this.enterMyData.noOfInstalledTBsPerStorageFTE = eval("object.mapdata.ES0010 / 0");
      }
      else if (object.mapdata.ES0010 == this.NEGATIVE_CONST) {
        this.enterMyData.noOfInstalledTBsPerStorageFTE = 0;
      }
      else if (object.mapdata.EES010 == this.NEGATIVE_CONST) {
        this.enterMyData.noOfInstalledTBsPerStorageFTE = eval("object.mapdata.ES0010 / (0 + object.mapdata.EES020)");
      }
      else if (object.mapdata.EES020 == this.NEGATIVE_CONST) {
        this.enterMyData.noOfInstalledTBsPerStorageFTE = eval("object.mapdata.ES0010 / (object.mapdata.EES010 + 0)");
      }
      else {
        // ( EES010 + EES020 ) / ES0010
        this.enterMyData.noOfInstalledTBsPerStorageFTE = eval("object.mapdata.ES0010 / (object.mapdata.EES010 + object.mapdata.EES020)");
      }

      let temp3 = Math.round(this.enterMyData.noOfInstalledTBsPerStorageFTE);
      let temp4 = Math.round(this.storageData.data.NumberofStorageTBsPerFTE.TBsPerFTE.Number.value);

      if (temp3 == temp4) {
        this.storageFTEEquality = true;
      }

      if (this.enterMyData.noOfInstalledTBsPerStorageFTE == Infinity || this.enterMyData.noOfInstalledTBsPerStorageFTE == 'infinity' || this.enterMyData.noOfInstalledTBsPerStorageFTE == "Infinity" || isNaN(this.enterMyData.noOfInstalledTBsPerStorageFTE)) {
        this.enterMyData.noOfInstalledTBsPerStorageFTE = this.NEGATIVE_CONST;
      }

      // this.enterMyData.noOfInstalledTBsPerStorageFTE = 843;

      // ES0750
      this.enterMyData.sanPercentage = eval("object.mapdata.ES0750");

      //ES0755
      this.enterMyData.nasPercentage = eval("object.mapdata.ES0755");

      //ES0760
      this.enterMyData.backupandarchivePercentage = eval("object.mapdata.ES0760");

      // if (this.enterMyData.availablityPercentage<this.storageData.data.Availability.Availability.Number.value) {

      //   document.getElementById("availabilitySVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // } else {

      //   document.getElementById("availabilitySVG").setAttribute('transform', 'rotate(180) rotate(180)');
      // }

      // if (this.enterMyData.utilizationPercentage<this.storageData.data.Utilization.Utilization.Number.value) {

      //   document.getElementById("utilizationSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // } else {

      //   document.getElementById("utilizationSVG").setAttribute('transform', 'rotate(180) rotate(180)');
      // }
      try {
        // if(this.enterMyData.backupandarchivePercentage < this.storageData.data.StoragebyType.Backup.Backup.value) {
        //   document.getElementById("backuparchiveSVG").setAttribute('transform', 'rotate(90) rotate(90)');
        // }

        // if(this.enterMyData.nasPercentage < this.storageData.data.StoragebyType.NAS.NAS.value) {
        //   document.getElementById("nasSVG").setAttribute('transform', 'rotate(90) rotate(90)');
        // }

        // if(this.enterMyData.sanPercentage < this.storageData.data.StoragebyType.SAN.SAN.value) {
        //   document.getElementById("sanSVG").setAttribute('transform', 'rotate(90) rotate(90)');
        // }
      } catch (error) {
        //  console.log(error);
      }
      // if(this.enterMyData.noOfInstalledTBsPerStorageFTE < this.storageData.data.NumberofStorageTBsPerFTE.TBsPerFTE.Number.value) {
      //   document.getElementById("noOfStorageFTESVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // } else {
      //   document.getElementById("noOfStorageFTESVG").setAttribute('transform', 'rotate(180) rotate(180)');
      // }

      // if ((this.enterMyData.staffingmixEmployee*100) < this.storageData.data.StaffingMix.StaffingMixEmployee.Number.value) {
      //   document.getElementById("staffingMixSVGEmployee").setAttribute('transform', 'rotate(90) rotate(90)');
      // } else {
      //   document.getElementById("staffingMixSVGEmployee").setAttribute('transform', 'rotate(180) rotate(180)');
      // }

      // if ((this.enterMyData.staffingmixContract*100) < this.storageData.data.StaffingMix.StaffingMixContractor.Number.value) {
      //   document.getElementById("staffingMixSVGContractor").setAttribute('transform', 'rotate(90) rotate(90)');
      // } else {
      //   document.getElementById("staffingMixSVGContractor").setAttribute('transform', 'rotate(180) rotate(180)');
      // }

      // if(this.enterMyData.annualTCOCostPerInstalledTB < this.storageData.data.AnnualCostPerInstalledTB.CostPerTB.Number.value) {
      //   document.getElementById("annualTCOCostPerInstalledTBSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // } else {
      //   document.getElementById("annualTCOCostPerInstalledTBSVG").setAttribute('transform', 'rotate(180) rotate(180)');
      // }

      // if(this.enterMyData.annualTCOCostPerInstalledTB < this.storageData.data.AnnualCostPerInstalledTB.CostPerTB.Number.value) {
      //   document.getElementById("marketPricePerInstalledTBSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }




    }
    catch (error) {
      //throw custom exception to global error handler
      //create error object
      //  console.log(error);
      let errorObj = {
        "dashboardId": "6",
        "pageName": "Non CIO Storage Tower Screen",
        "errorType": "warn",
        "errorTitle": "Data Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    }
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

    try {

      //For Personnel
      this.dataSource = {
        chart: {
          animation: true,
          startingAngle: "310",
          smartLineAlpha: "100",
          showlegend: "1",
          labelFont: "OpenSansRegular",
          labelFontSize: 12,
          legendItemFontSize: 11,
          showToolTip: false,
          showpercentvalues: "1",
          legendposition: "right",
          usedataplotcolorforlabels: "0",
          showTooltip: "1",
          theme: "fint",
          chartRightMargin: '300px',
          showLabels: false,
          legendIconScale: "2",
          drawCustomLegendIcon: 1,
          clickURLOverridesPlotLinks: 1,
          doughnutRadius: "100"
          // interactiveLegend: "0",
        },
        "events": {
          "legendItemClicked": function (eventObj, dataObj) {
          }
        },
        "data": this.storageData.drills.PersonnelCostAllocation



      };

      //For Hardware
      this.dataSourceHardware = {
        chart: {
          animation: false,
          startingAngle: "45",
          smartLineAlpha: "100",
          showlegend: "1",
          labelFont: "OpenSansRegular",
          labelFontSize: 12,
          legendItemFontSize: 11,
          showToolTip: false,
          showpercentvalues: "1",
          legendposition: "right",
          usedataplotcolorforlabels: "0",
          showTooltip: "1",
          theme: "fint",
          chartRightMargin: '100px',
          showLabels: false,
          drawCustomLegendIcon: 1,
        },
        "events": {
          "legendItemClicked": function (eventObj, dataObj) {
          }
        },
        "data": this.storageData.drills.HardwareCostAllocation
      };

      //For Software
      this.dataSourceSoftware = {
        chart: {
          animation: false,
          startingAngle: "45",
          smartLineAlpha: "100",
          showlegend: "1",
          labelFont: "OpenSansRegular",
          labelFontSize: 12,
          legendItemFontSize: 11,
          showToolTip: false,
          showpercentvalues: "1",
          legendposition: "right",
          usedataplotcolorforlabels: "0",
          showTooltip: "1",
          theme: "fint",
          chartRightMargin: '100px',
          showLabels: false,
          drawCustomLegendIcon: 1,
        },
        "events": {
          "legendItemClicked": function (eventObj, dataObj) {
          }
        },
        "data": this.storageData.drills.SoftwareCostAllocation
      };

      //For Outsourcing
      this.dataSourceOutsourcing = {
        chart: {
          animation: false,
          startingAngle: "45",
          smartLineAlpha: "100",
          showlegend: "1",
          labelFont: "OpenSansRegular",
          labelFontSize: 12,
          legendItemFontSize: 11,
          showToolTip: false,
          showpercentvalues: "1",
          legendposition: "right",
          usedataplotcolorforlabels: "0",
          showTooltip: "1",
          theme: "fint",
          chartRightMargin: '100px',
          showLabels: false,
          drawCustomLegendIcon: 1,
        },
        "events": {
          "legendItemClicked": function (eventObj, dataObj) {
          }
        },
        "data": this.storageData.drills.OutsourcingCostAllocation
      };

      // For Annual Cost Per Installed TB
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
            seriesname: "Annual TCO Cost Per Installed TB",
            anchorBgColor: "#03abba",
            "valuePosition": "ABOVE",
            "data": this.annualCostMIPs
          },
          {
            seriesname: "Annual Market Price Per Installed TB",
            anchorBgColor: "#29497b",
            "valuePosition": "BELOW",
            "data": this.marketCostMIPs
          }
        ]

      };
    }
    catch (error) {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "6",
        "pageName": "Non CIO Storage Tower Screen",
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
    private storageService: StorageService,
    private storageSharedService: StorageInputMyDataSharedService,
    private genericEnterCompare: EnterCompareDataTowersService,
    private generateScenarioService: GenerateScenarioService,
    private loginDataBroadcastService: LoginDataBroadcastService, 
    private crgService: CustomRefGroupService,
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

    let storageSharedEmitter = object.storageSharedService.getEmitter();
    storageSharedEmitter.on('callFunction', function () {
      object.sourceCurrencyMap = object.storageSharedService.getData().map;
      object.navigatedFromComparison = true;
      object.toggle();
    });

    storageSharedEmitter.on('newScenarioFromStorageInput', function () {
      object.sourceCurrencyMap = object.storageSharedService.getData().map;
      object.navigatedFromInput = true;
      object.toggle();
    });
    
    //on save scenario
    object.storageSharedService.getEmitter().on('newStorageScenarioSaved', function () {
      object.navigatedFromInput = false;
      //get saved scenario id
      let savedScearioId = object.storageSharedService.getScenarioSelection();

      if (savedScearioId != null || savedScearioId != undefined) {
        //get dropdown of scenarios
        object.getScenarioDropdown();
      }

    });
    //chane in compare scenario dropdown
    object.commonService.getEventEmitter().on('storagescenariodropdownchange', function () {
      //get selected scenario
      let scenario = object.commonService.getScenario();

      //call method to get scenario
      object.getScenarioDataById(scenario);

    });

    updateScenarioListNotificationServiceService.getEmitter().on('updateStorageScenarioListAfterDeletion', function(){
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


    object.storageService.getData().subscribe((allData: any) => {
      object.storageData = allData;

      if (object.storageData != undefined && object.storageData != null) {
        object.landingPageDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.landingPageDataLoaded = false;
        object.showStorageData = false;
      }

      //this.showStorageData = true;
      object.updateLineChartData();
      object.updateDrillDown();
      object.compareStorageInputData();
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "6",
        "pageName": "Non CIO Storage Tower Screen",
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

      if (object.data.industries != undefined && object.data.industries != null) {
        object.industryDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.industryDataLoaded = false;
        object.showStorageData = false;
      }


      object.notifyCompareScreen();
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "6",
        "pageName": "Non CIO Storage Tower Screen",
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

      if (object.data.region != undefined && object.data.region != null) {
        object.regionFilterLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.regionFilterLoaded = false;
        object.showStorageData = false;
      }


      object.notifyCompareScreen();
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "6",
        "pageName": "Non CIO Storage Tower Screen",
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
        object.showStorageData = false;
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
          "dashboardId": "6",
          "pageName": "Non CIO Storage Tower Screen",
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

    //set page identifier as 6
    object.industrySizeService.setPageId(6);
    object.genericEnterCompare.setPopID(6);
    //scale service
    object.industrySizeService.getIndustrySize().subscribe((data: any) => {

      object.data.industrySize = data["industrySize"];

      if (object.data.industrySize != undefined && object.data.industrySize != null) {
        object.scaleDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.scaleDataLoaded = false;
        object.showStorageData = false;
      }

      //setting the default Scale in IndustrySizeService
      this.industrySizeService.setScaleLabel(object.data.industrySize[0].key);
      object.industrySizeService.setScaleTitle(object.scaleTitle);
      this.industrySizeService.setInustrySize(object.data.industrySize[0].value); object.data.industrySize.forEach(element => {
      });

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "6",
        "pageName": "Non CIO Storage Tower Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });



    object.industrySizeService.getDefinitionData().subscribe((definationData: any) => {
      object.storageDefinitionData = definationData;
      //this.showStorageData = true;
      object.updateLineChartData();
      object.updateDrillDown();
      object.compareStorageInputData();
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "6",
        "pageName": "Non CIO Storage Tower Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })

    //get scenario dropdown
    object.navigatedFromInput = false;
    object.navigatedFromComparison = false;
    object.getScenarioDropdown();
    object.getCRGDropdown();

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

        // object.selectedscenario = object.selectedScenarioName[0];

        if(object.navigatedFromInput == true){
          //if it is navigated from input my data and new scenario is created using save&display functionality it will update list and display the comparision
        let savedScearioId = object.storageSharedService.getScenarioSelection();
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
          "dashboardId": "6",
          "pageName": "Non CIO Storage Tower Screen",
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

      this.annualCostMIPs = this.storageData.drills.AnnualTCOPerInstalledTBCurrentYear.map(obj => {
        let rObj = {};
        rObj["label"] = obj.label;
        rObj["value"] = Number(obj.value) * this.refactorVal;
        return rObj;
      });

      this.marketCostMIPs = this.storageData.drills.AnnualPricePerInstalledTBCurrentYear.map(obj => {
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
        "dashboardId": "6",
        "pageName": "Non CIO Storage Tower Screen",
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
    this.industrySizeService.setInustrySize(scale.value);
    //setting scale label
    this.industrySizeService.setScaleLabel(scale.key);
    //call service for filtered data
    this.filterData();

    //make current button active
    this.scaleValue = scale.value;
  }

  filterData() {
    let object = this;
    object.industrySizeService.getMainFrameDataByScale().subscribe((data: any) => {
      // console.log(JSON.stringify(data));
      object.storageData = data;
      // console.log('updated data: '+JSON.stringify(object.storageData));
      // this.showStorageData = true;
      this.isLineChartDisabled=false;
      this.updateLineChartData();
      this.updateDrillDown();
      object.compareStorageInputData();
    }, (error) => {

      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "6",
        "pageName": "Non CIO Storage Tower Screen",
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
      this.compareStorageInputData();

      // console.log('after conversion previous',this.getCurrency(this.conversionCurrency));
      // console.log('after coversion selected',currency.key);
      this.conversionCurrency = currency.key;

    }
  }

  updateCompareData() {
    let object = this;
    let something = object.storageSharedService.getData().currency;
    let scenarioRegion = object.storageSharedService.getData().region;
    console.log('scenario region: ', scenarioRegion);
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
    // console.log('done');

    //region
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
        object.storageData = false;
        object.regionFilterLoaded = false;
      }

    });

    if (object.navigatedFromComparison == true) {
      object.updateScenarioDropdown();
      let refactorValue = object.storageSharedService.getData().refactorVal;
     
      let comparisionData = object.storageSharedService.getData().comparisionData;
    
        for (let data of comparisionData) {
  
          let key = object.sourceCurrencyMap[data.key];
          if (key != undefined && key != null && key != "#" && key != "%") {
            // data.value = data.value / currentValue.id;
            data.value = data.value * refactorValue;
          }
  
        }
    }

    if(object.navigatedFromInput == true){
      // object.updateScenarioDropdown();
      object.getScenarioDropdown();
    }

  }


  updateScenarioDropdown() {
    //get selected scenario id
    let object = this;

    let selectedScenarioID = object.storageSharedService.getScenarioSelection();
    //object.mainframeSharedService.getData().selectedScenarioId[0];
    object.selectedscenario = object.selectedScenarioName[selectedScenarioID];

  }

  convertCompareData(prevCurrencyKey, currenctCurrencyKey) {
    let object = this;
    let prevCurrencyObject = object.getCurrency(prevCurrencyKey);
    let currenctCurrencyObject = object.getCurrency(currenctCurrencyKey);

    object.convertValue(prevCurrencyObject, currenctCurrencyObject);
    // console.log('in lan storage', this.conversionCurrency);
  }


  convertValue(currentValue, targetValue) {

    let object = this;
    // console.log(currentValue, targetValue);

    let comparisionData = object.storageSharedService.getData().comparisionData;
    // console.log(JSON.stringify(comparisionData));
     //  comparisionData= JSON.stringify(comparisionData);
     object.selectedScenarioForComparison.forEach((element) => {
      //3)this will map src_code and it's value format
      object.map[element.key] = element.value_format;
    });
    object.sourceCurrencyMap = object.map;
    try {
      for (let data of comparisionData) {

        let key = object.sourceCurrencyMap[data.key];
        if (key != undefined && key != null && key != "#" && key != "%") {
          data.value = data.value / currentValue.id;
          data.value = data.value * targetValue.id;
        }

      }
    } catch (error) {
      // console.log(error);
    }
    // console.log(JSON.stringify(object.storageSharedService.getData().comparisionData));



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
  //removing memory leaks to avoid multiple invoking of function
  ngOnDestroy() {
    //emit an event to indicate data is resetted
    this.industrySizeService.getEmitter().emit('landingPageDataReset');
    this.storageSharedService.getEmitter().removeAllListeners();

  }

  //function to check all relevent data is loaded on page
  isAllReleventDataLoaded() {
    let object = this;

    if (object.landingPageDataLoaded && object.scaleDataLoaded && object.regionFilterLoaded && object.currencyFilterLoaded && object.industryDataLoaded) {
      object.showStorageData = true;

      //emit an event to indicate data is loaded
      object.industrySizeService.getEmitter().emit('landingPageDataLoaded');

    }
    else {
      object.showStorageData = false;
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
        "dashboardId": "6",
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
    else if (scenarioID== -9999) {
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
          this.currencySymbol = this.currencyVar(this.currencyCode);
          // this.updateLineChartData();
          // this.updateDrillDown();
        }
      });
      this.setRegion(this.selectedregion);

    }
    else//get comparison data for scenario
    {
      let requestedParam = {
        "userID": object.sessionId,
        "dashboardId": "4",
        "scenarioId": []
      }

      object.generateScenarioService.getSavedScenarioDataToPopulate("6", object.sessionId, scenarioID).subscribe((response) => {

        let object = this;

        object.selectedScenarioForComparison = [];

        object.scenarioObj = response;

        console.log('get scenario by id: ', object.scenarioObj);

        //logic to prepare a scenarion object for comparison

        for (let cnt = 0; cnt < object.scenarioObj.StorageInput.NA.length; cnt++) {
          let t1: any = {};
          t1.key = object.scenarioObj.StorageInput.NA[cnt].src_code;
          // console.log()
          t1.value = object.scenarioObj.StorageInput.NA[cnt].src_code_value;
          //once save note functionality done append value of each src code note here
          t1.note = object.scenarioObj.StorageInput.NA[cnt].notes;
          t1.value_format = object.scenarioObj.StorageInput.NA[cnt].value_format;

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
            console.log('region: ', region);
          }
        }

        if (currency == undefined || currency == null || currency.trim().length == 0) {
          currency = "FE482E13-D3B6-4208-8C3C-2FD7AFBEBEA1";//USD key
        }
        let sharedData = { "comparisionData": object.selectedScenarioForComparison, "currency": currency, "region": region };
        object.storageSharedService.setData(sharedData);
        object.storageSharedService.setScenarioSelection(scenarioID);
        let something = object.storageSharedService.getData().currency;

        //get currency data
        object.data.currency.forEach((element) => {

          if (element.key == something) {
            this.selectedcurrency = element;
            this.currencyCode = element.value;
            this.conversionCurrency = element.key;
            this.refactorVal = element.id;
            this.currencySymbol = this.currencyVar(this.currencyCode);
            // this.updateLineChartData();
            // this.updateDrillDown();
          }
        });


        object.toggle();
        let scenarioRegion = object.storageSharedService.getData().region;
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
      object.showDefaultCurrency();
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

          console.log('crg data: ',crgData);

          if(crgData!=undefined || crgData!=null)
          {
            object.storageData = crgData;
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
    object.storageService.getData().subscribe((allData: any) => {
      object.storageData = allData;

      if (object.storageData != undefined && object.storageData != null) {
        object.landingPageDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.landingPageDataLoaded = false;
        object.storageData = false;
      }

      object.updateLineChartData();
      object.updateDrillDown();
      this.compareStorageInputData();
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

  resetNonCRGFilters(){

    let object = this;

    object.showStorageData = false;
    object.landingPageDataLoaded =false;
    object.scaleDataLoaded = false;
    object.regionFilterLoaded =false;
    object.currencyFilterLoaded =false;

    //scale service
    object.showDefaultScale();

    //Region
    object.showDefaultRegion();
    
    //currency
    object.showDefaultCurrency();
  }

  showDefaultScale()
  {
    let object = this;

    object.industrySizeService.getIndustrySize().subscribe((data: any) => {

      console.log('scale data: ', data);

      object.data.industrySize = data["industrySize"];

      if (object.data.industrySize != undefined && object.data.industrySize != null) {
        object.scaleDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.scaleDataLoaded = false;
        object.showStorageData = false;
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
          object.showStorageData = false;
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
        object.showStorageData = false;
      }

      object.notifyCompareScreen();
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

  getCRGDropdown() {
    //get dropdown of scenarios

    let object = this;

    //wb service to fetch CRG list
    let selectedDashboardId = 6;
    object.crgService.getCustomRefGroupList(selectedDashboardId).subscribe((data: any) => {

      try {

        
        object.customReferenceGroupList = data;

        object.selectedCRGName = [];

        //set default selection
        let temp: any = {};
        temp.UpdatedDate = null;
        temp.createdBy = null;
        temp.createdDate = null;
        temp.customName = "N/A";
        temp.dashboardId = "3";
        temp.updatedBy = null;
        temp.customId = "-9999"; //
        temp.definition="";//

        object.selectedCRGName.push(temp);
        
        for(let crgData of object.customReferenceGroupList){
          object.selectedCRGName.push(crgData);
        }
        object.selectedcustomRef = object.selectedCRGName[0];



      }
      catch (error) {
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId": "2",
          "pageName": "workplace landing",
          "errorType": "warn",
          "errorTitle": "Data Error",
          "errorDescription": error.message,
          "errorObject": error
        }
      }



    });

  }
}