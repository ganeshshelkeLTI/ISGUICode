/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:storage.component.ts **/
/** Description: This file is created to get the Unix tower ladning page data, filter related data and compare/input my data with drill downs (Chart) **/
/** Created By: 10651577  Created Date: 28/09/2018 **/
/** Update By:  10650919  Update Date:  03/10/2018 **/

/*******************************************************/

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
import { MainframeInputmydataSharedService } from '../services/mainframe-inputmydata-shared.service';
import { UnixInputMyDataSharedService } from '../services/servers/unix/unix-input-my-data-shared.service';
import { MapSourceCodeDataValues } from '../map-source-code-data-values';
import { UnixServiceService } from '../services/servers/unix/unix-service.service';
import { negativeConstant } from '../../properties/constant-values-properties';
import { EnterCompareDataTowersService } from '../services/enter-compare-data-towers.service';
import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';
import { GenerateScenarioService } from '../services/generate-scenario.service';
import { CustomRefGroupService } from '../services/custom-ref-group/custom-ref-group.service';
import { UpdateScenarioListNotificationServiceService } from '../services/update-scenario-list-notification-service.service';

declare var $: any;


@Component({
  selector: 'app-unix-servers',
  templateUrl: './unix-servers.component.html',
  styleUrls: ['./unix-servers.component.css'],
  providers: [FilterDataService]
})
export class UnixServersComponent implements OnInit {

  showUnixData: boolean = false;
  private scenarioData: any;
  private mapdata: any;

  //private data: FilterData;
  private data: any = {};
  private data1: IsgKpiData;

  public isLineChartDisabled:boolean = false;

  enterMyData = {
    "averageProvisioningTime": null,
    "annualTCOCostPerCore": null,
    "annualTCOCostPerOSInstance": null,
    "availablityPercentage": null,
    "noOfOSInstancesPerFTE": null,
    "staffingmixEmployee": null,
    "staffingmixContract": null
  }

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
  private unixDefinitionData: any;
  route: string;
  //  @ViewChild(CompareGridComponent) compareGridFlg;

  showCompareGridChild: boolean = false;
  showCompareScreen: string = 'none';
  showCompareGridScreen: string = 'none';
  private selectedIndustry: string;
  resizePopup: string = "minimize";

  public unixServerData: any;
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

  display_costPerInstance = 'none';
  display_costPerCore = 'none';
  public currentyear: number;
  public previousYear: number;
  public secondPreviousYear: number;
  public dataSourceCostPerInstance: Object;
  public dataSourceCostPerCore: Object;

  //line chart objects
  public OSInstanceData: any;
  public OSInstanceMarketRateData: any;
  public OSCoreData: any;
  public OSCoreMarketRateData: any;
  public currencyVar: any;
  public currencySymbol: string;
  private conversionCurrency: any = null;
  private sourceMap: Map<string, string>;

  public scaleTitle = "Scale (Logical Servers / Processor Cores)";

  //equality variables
  isAverageTimeEqual: boolean = false;
  isAvailabilityPerEqual: boolean = false;
  isAnnualTCOCostPerCoreEqual: boolean = false;
  isStaffingMixEmpEqual: boolean = false;
  isStaffingMixContrEqual: boolean = false;
  isannualCostPerOSInstanceEqual: boolean = false;
  isOSPerFTEEqual: boolean = false;

  //variables to check data load status
  public landingPageDataLoaded: boolean = false;
  public scaleDataLoaded: boolean = false;
  public regionFilterLoaded: boolean = false;
  public currencyFilterLoaded: boolean = false;
  public industryDataLoaded: boolean = false;

  public scenarios: any;
  public selectedScenarioList: any[];

  public navigatedFromComparison: boolean =false;
  public navigatedFromInput: boolean=false;
  public selectedScenarioName: any;
  public selectedscenario: any;

   //CRG
   public customReferenceGroupList: any;
   public selectedCRGName: any;
   public CRGNameToCompare: any;
   public selectedcustomRef: any;
   public selectedCRGData: any;

   public pageId: any;
   public isCrgSelected : boolean=false;
  //negative constant for null values
  NEGATIVE_CONST: number;

  map: Map<string, string> = new Map<string, string>();

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

  toggle() {
    this.showDiv = true;
    this.updateCompareData();
    this.compareUnixInputData();
  }

  public infinity: number = 1 / 0;

  compareUnixInputData() {

    try {
      let object = this;
      let test = new MapSourceCodeDataValues();
      object.scenarioData = object.unixSharedService.getData().comparisionData;
      object.mapdata = test.mapData(object.scenarioData);


      //get constant value
      object.NEGATIVE_CONST = negativeConstant.NEGATIVE_CONSTANT;


      // (DA2005)
      this.enterMyData.averageProvisioningTime = eval("object.mapdata.DA2005");
      if (Number(object.enterMyData.averageProvisioningTime).toFixed(1) == Number(object.unixServerData.data.ProvisioningTime.ProvisioningTime.Number.value).toFixed(1)) {
        object.isAverageTimeEqual = true;
      } else {
        object.isAverageTimeEqual = false;
      }

      // (DA4000)
      this.enterMyData.availablityPercentage = eval("object.mapdata.DA4000");
      if (Number(object.enterMyData.availablityPercentage).toFixed(2) == Number(object.unixServerData.data.Availability.Availability.Number.value).toFixed(2)) {
        object.isAvailabilityPerEqual = true;
      } else {
        object.isAvailabilityPerEqual = false;
      }

      // (DSP100) / (SP0155)
      this.enterMyData.annualTCOCostPerCore = eval("object.mapdata.DSP100 / object.mapdata.SP0155");
      if (Math.round(object.enterMyData.annualTCOCostPerCore) == Math.round(Number(object.unixServerData.data.AnnualCostPerCore.CostPerCore.Number.value) * object.refactorVal)) {
        object.isAnnualTCOCostPerCoreEqual = true;
      } else {
        object.isAnnualTCOCostPerCoreEqual = false;
      }

      if (this.enterMyData.annualTCOCostPerCore == Infinity || this.enterMyData.annualTCOCostPerCore == 'infinity' || this.enterMyData.annualTCOCostPerCore == "Infinity" || isNaN(this.enterMyData.annualTCOCostPerCore)) {
        this.enterMyData.annualTCOCostPerCore = this.NEGATIVE_CONST;
      }

      // ESP010 / ( ESP010 + ESP020 )
      //condition to handle null value. null value is represented by negative constant.   
      if (object.mapdata.ESP020 == this.NEGATIVE_CONST && object.mapdata.ESP010 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixEmployee = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.ESP020 == this.NEGATIVE_CONST) {
        // object.mapdata.ESP020=0;
        this.enterMyData.staffingmixEmployee = eval("object.mapdata.ESP010 / (object.mapdata.ESP010 + 0)");
      }
      else if (object.mapdata.ESP010 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixEmployee = eval("object.mapdata.ESP010 / (0+object.mapdata.ESP020)");

      }
      else {
        this.enterMyData.staffingmixEmployee = eval("object.mapdata.ESP010 / (object.mapdata.ESP010 + object.mapdata.ESP020)");
      }

      // this.enterMyData.staffingmixEmployee = eval("object.mapdata.ESP010 / (object.mapdata.ESP010 + object.mapdata.ESP020)");
      if (Number(object.enterMyData.staffingmixEmployee * 100).toFixed(1) == Number(object.unixServerData.data.StaffingMix.StaffingMixEmployee.Number.value).toFixed(1)) {
        object.isStaffingMixEmpEqual = true;
      } else {
        object.isStaffingMixEmpEqual = false;
      }

      if (this.enterMyData.staffingmixEmployee == Infinity || this.enterMyData.staffingmixEmployee == 'infinity' || this.enterMyData.staffingmixEmployee == "Infinity" || isNaN(this.enterMyData.staffingmixEmployee)) {
        this.enterMyData.staffingmixEmployee = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.staffingmixEmployee)) {
        this.enterMyData.staffingmixEmployee = this.enterMyData.staffingmixEmployee;
      } else {
        this.enterMyData.staffingmixEmployee = 0;
      }

      // ESP020 / ( ESP010 + ESP020 )

      if (object.mapdata.ESP020 == this.NEGATIVE_CONST && object.mapdata.ESP010 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixContract = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.ESP010 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixContract = eval("object.mapdata.ESP020 / (0 + object.mapdata.ESP020)");
      }
      else if (object.mapdata.ESP020 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixContract = eval("object.mapdata.ESP020 / (object.mapdata.ESP010 + 0)");
      }
      else {
        this.enterMyData.staffingmixContract = eval("object.mapdata.ESP020 / (object.mapdata.ESP010 + object.mapdata.ESP020)");
      }
      //this.enterMyData.staffingmixContract = eval("object.mapdata.ESP020 / (object.mapdata.ESP010 + object.mapdata.ESP020)");
      if (Number(object.enterMyData.staffingmixContract * 100).toFixed(1) == Number(object.unixServerData.data.StaffingMix.StaffingMixContractor.Number.value).toFixed(1)) {
        object.isStaffingMixContrEqual = true;
      } else {
        object.isStaffingMixContrEqual = false;
      }

      if (this.enterMyData.staffingmixContract == Infinity || this.enterMyData.staffingmixContract == 'infinity' || this.enterMyData.staffingmixContract == "Infinity" || isNaN(this.enterMyData.staffingmixContract)) {
        this.enterMyData.staffingmixContract = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.staffingmixContract)) {
        this.enterMyData.staffingmixContract = this.enterMyData.staffingmixContract;
      } else {
        this.enterMyData.staffingmixContract = 0;
      }
      // DSP100 / SP0110
      this.enterMyData.annualTCOCostPerOSInstance = eval("object.mapdata.DSP100 / object.mapdata.SP0110");
      if (Math.round(object.enterMyData.annualTCOCostPerOSInstance) == Math.round(Number(object.unixServerData.data.AnnualCostPerOSInstance.CostPerServer.NumberCY.value) * object.refactorVal)) {
        object.isannualCostPerOSInstanceEqual = true;
      } else {
        object.isannualCostPerOSInstanceEqual = false;
      }

      if (this.enterMyData.annualTCOCostPerOSInstance == Infinity || this.enterMyData.annualTCOCostPerOSInstance == 'infinity' || this.enterMyData.annualTCOCostPerOSInstance == "Infinity" || isNaN(this.enterMyData.annualTCOCostPerOSInstance)) {
        this.enterMyData.annualTCOCostPerOSInstance = this.NEGATIVE_CONST;
      }

      // (ESP010 + ESP020) / SP0110
      if (object.mapdata.SP0110 == this.NEGATIVE_CONST && object.mapdata.ESP010 == this.NEGATIVE_CONST && object.mapdata.ESP020 == this.NEGATIVE_CONST) {
        this.enterMyData.noOfOSInstancesPerFTE = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.SP0110 == this.NEGATIVE_CONST) {
        this.enterMyData.noOfOSInstancesPerFTE = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.ESP010 == this.NEGATIVE_CONST) {
        this.enterMyData.noOfOSInstancesPerFTE = eval("object.mapdata.SP0110 / (0 + object.mapdata.ESP020)");
      }
      else if (object.mapdata.ESP020 == this.NEGATIVE_CONST) {
        this.enterMyData.noOfOSInstancesPerFTE = eval("object.mapdata.SP0110 / (object.mapdata.ESP010 + 0)");
      }
      else {
        this.enterMyData.noOfOSInstancesPerFTE = eval("object.mapdata.SP0110 / (object.mapdata.ESP010 + object.mapdata.ESP020)");

      }
      //this.enterMyData.noOfOSInstancesPerFTE = eval("object.mapdata.SP0110 / (object.mapdata.ESP010 + object.mapdata.ESP020)");
      if (Math.round(object.enterMyData.noOfOSInstancesPerFTE) == Math.round(object.unixServerData.data.NumberofOSInstancesPerFTE.ServersPerFTE.Number.value)) {
        object.isOSPerFTEEqual = true;
      } else {
        object.isOSPerFTEEqual = false;
      }

      if (this.enterMyData.noOfOSInstancesPerFTE == Infinity || this.enterMyData.noOfOSInstancesPerFTE == 'infinity' || this.enterMyData.noOfOSInstancesPerFTE == "Infinity" || isNaN(this.enterMyData.noOfOSInstancesPerFTE)) {
        this.enterMyData.noOfOSInstancesPerFTE = this.NEGATIVE_CONST;
      }


      // if (this.enterMyData.annualTCOCostPerCore < this.unixServerData.data.AnnualCostPerCore.CostPerCore.Number.value) {
      //   document.getElementById("annualTCOcostPerCoreSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if (this.enterMyData.annualTCOCostPerOSInstance < this.unixServerData.data.AnnualCostPerOSInstance.CostPerServer.NumberCY.value) {
      //   document.getElementById("annualTCOcostPerOSInstanceSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if (this.enterMyData.averageProvisioningTime < this.unixServerData.data.ProvisioningTime.ProvisioningTime.Number.value) {
      //   document.getElementById("avgProvisioningTimeSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if (this.enterMyData.availablityPercentage < this.unixServerData.data.Availability.Availability.Number.value) {
      //   document.getElementById("unixAvailabilitySVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if (this.enterMyData.noOfOSInstancesPerFTE < this.unixServerData.data.NumberofOSInstancesPerFTE.ServersPerFTE.Number.value) {
      //   document.getElementById("noOfOSInstancesPerFTESVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if ((this.enterMyData.staffingmixEmployee*100) < this.unixServerData.data.StaffingMix.StaffingMixEmployee.Number.value) {
      //   document.getElementById("unixStaffingmixEmployeeSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if ((this.enterMyData.staffingmixContract*100) < this.unixServerData.data.StaffingMix.StaffingMixContractor.Number.value) {
      //   document.getElementById("unixStaffingmixContractSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // try{
      //   if (this.enterMyData.staffingmixEmployee < this.unixServerData.data.StaffingMix.HighLevel.StaffingMixContractor_Number.value) {
      //     document.getElementById("staffingMixSVGEmployee").setAttribute('transform', 'rotate(90) rotate(90)');
      //   }
      // }catch(error){
      //   console.log(error);
      // }
      // try{
      //   if (this.enterMyData.staffingmixContract < this.unixServerData.data.StaffingMix.HighLevel.StaffingMixContractor_number.value) {
      //     document.getElementById("staffingMixSVGContractor").setAttribute('transform', 'rotate(90) rotate(90)');
      //   }
      // }catch(error){
      //   console.log(error);
      // }
    }
    catch (error) {
      //  console.log(error);
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "5",
        "pageName": "Non CIO Unix Tower Screen",
        "errorType": "warn",
        "errorTitle": "Data Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    }

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
        "data": this.unixServerData.drills.PersonnelCostAllocation

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
        "data": this.unixServerData.drills.HardwareCostAllocation
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
        "data": this.unixServerData.drills.SoftwareCostAllocation
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
        "data": this.unixServerData.drills.OutsourcingCostAllocation
      };


      //annual cost per OS instance
      this.dataSourceCostPerInstance = {
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
            seriesname: "Annual TCO Cost Per OS Instance",
            anchorBgColor: "#03abba",
            "valuePosition": "ABOVE",
            "data": this.OSInstanceData
          },
          {
            seriesname: "Annual Market Price Per OS Instance",
            anchorBgColor: "#29497b",
            "valuePosition": "BELOW",
            "data": this.OSInstanceMarketRateData
          }
        ]

      };

      //annual cost per OS Core
      this.dataSourceCostPerCore = {
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
            seriesname: "Annual TCO Cost Per Core",
            anchorBgColor: "#03abba",
            "data": this.OSCoreData
          },
          {
            seriesname: "Annual Market Price Per Core",
            anchorBgColor: "#29497b",
            "data": this.OSCoreMarketRateData
          }
        ]

      };
    }
    catch (error) {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "5",
        "pageName": "Non CIO Unix Tower Screen",
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
    location: Location, router: Router,
    private chartService: ChartCIOSharedService,
    private unixLandingService: UnixServiceService,
    private unixSharedService: UnixInputMyDataSharedService,
    private genericEnterCompare: EnterCompareDataTowersService,
    private loginDataBroadcastService: LoginDataBroadcastService,
    private generateScenarioService: GenerateScenarioService,
    private updateScenarioListNotificationServiceService: UpdateScenarioListNotificationServiceService,
    private customRefGroupService: CustomRefGroupService) {
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

    let unixSharedEmitter = object.unixSharedService.getEmitter();
    unixSharedEmitter.on('callFunction', function () {
      object.sourceMap = object.unixSharedService.getData().map;
      object.navigatedFromComparison = true;
      //  console.log(object.sourceMap);
      object.toggle();
    });
    
    unixSharedEmitter.on('newScenarioFromUnixInput', function () {
      object.sourceMap = object.unixSharedService.getData().map;
      object.navigatedFromInput = true;
      //  console.log(object.sourceMap);
      object.toggle();
    });

    //on save scenario
    object.unixSharedService.getEmitter().on('newUnixScenarioSaved', function () {
      object.navigatedFromInput = false;
      //get saved scenario id
      let savedScearioId = object.unixSharedService.getScenarioSelection();

      if (savedScearioId != null || savedScearioId != undefined) {
        //get dropdown of scenarios
        object.getScenarioDropdown();
      }

    });
    //chane in compare scenario dropdown
    object.commonService.getEventEmitter().on('serverscenariodropdownchange', function () {
      //get selected scenario
      let scenario = object.commonService.getScenario();

      //call method to get scenario
      object.getScenarioDataById(scenario);

    });

    updateScenarioListNotificationServiceService.getEmitter().on('updateUnixScenarioListAfterDeletion', function(){
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



    //set page identifier as 5 for unix
    object.industrySizeService.setPageId(5);
    object.genericEnterCompare.setPopID(5);

    object.unixLandingService.getData().subscribe((unixServerData: any) => {
      object.unixServerData = unixServerData;

      if (object.unixServerData != undefined && object.unixServerData != null) {
        object.landingPageDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.landingPageDataLoaded = false;
        object.showUnixData = false;
      }

      this.updateLineChartData();
      object.updateDrillDown();
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "5",
        "pageName": "Non CIO Unix Tower Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });

    // get group definition information
    object.industrySizeService.getDefinitionData().subscribe((data: any) => {
      object.unixDefinitionData = data;
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "8",
        "pageName": "Non CIO WAN Tower Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
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

      if (object.data.industries != undefined && object.data.industries != null) {
        object.industryDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.industryDataLoaded = false;
        object.showUnixData = false;
      }

      object.notifyCompareScreen();
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "5",
        "pageName": "Non CIO Unix Tower Screen",
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
        object.showUnixData = false;
      }

      object.notifyCompareScreen();
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "5",
        "pageName": "Non CIO Unix Tower Screen",
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

      if (object.data.currency != undefined && object.data.currency != null) {
        object.currencyFilterLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.currencyFilterLoaded = false;
        object.showUnixData = false;
      }

      object.selectedcurrency = currency;
      object.defaultcurrency = object.selectedcurrency;
      //set updated currency to industry size service
      this.industrySizeService.setCurrencyObject(currency);

      object.commonService.setData(object.selectedcurrency);
      object.commonService.getEvent().emit('change');
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "5",
        "pageName": "Non CIO Unix Tower Screen",
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

      if (object.data.industrySize != undefined && object.data.industrySize != null) {
        object.scaleDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.scaleDataLoaded = false;
        object.showUnixData = false;
      }
      //setting the default Scale in IndustrySizeService
      this.industrySizeService.setScaleLabel(object.data.industrySize[0].key);
      object.industrySizeService.setScaleTitle(object.scaleTitle);
      this.industrySizeService.setInustrySize(object.data.industrySize[0].value);
      object.data.industrySize.forEach(element => {
      });

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "5",
        "pageName": "Non CIO Unix Tower Screen",
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

       //get custom reference group dropdown
       object.getCRGDropdown();


    let valTomakePositive = "0";
    this.makePositiveValue(valTomakePositive);

    //get custom reference group dropdown
    object.getCRGDropdown();

    object.compareUnixInputData();
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
        let savedScearioId = object.unixSharedService.getScenarioSelection();
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
      let sharedData = { "cioData": data, "selectCurrency": object.selectedcurrency };

      object.commonService.setData(sharedData);
      emitter.emit('change');
    },
      (error) => {
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId": "5",
          "pageName": "Non CIO Unix Tower Screen",
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
    // alert('inside');
    let object = this;
    object.industrySizeService.getMainFrameDataByScale().subscribe((data: any) => {

      object.unixServerData = data;
      // alert(JSON.stringify(object.unixServerData.data.TotalServerCostAllocation));
      //.TotalServerCostAllocation.CostAllocationEmp.Number.value);
      this.isLineChartDisabled=false;
      this.updateLineChartData();
      this.updateDrillDown();
    },
      (error) => {
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId": "5",
          "pageName": "Non CIO Unix Tower Screen",
          "errorType": "fatal",
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
      this.compareUnixInputData();

      //    console.log('after conversion previous',this.getCurrency(this.conversionCurrency));
      //    console.log('after coversion selected',currency.key);
      this.conversionCurrency = currency.key;

    }
  }
  updateLineChartData() {

    try {
      //update line chart objects

      this.OSInstanceData = this.unixServerData.drills.AnnualTCOPerOSInstanceCurrentYear.map(obj => {
        let rObj = {};
        rObj["label"] = obj.label;
        rObj["value"] = Number(obj.value) * this.refactorVal;
        return rObj;
      });

      this.OSInstanceMarketRateData = this.unixServerData.drills.AnnualPricePerOSInstanceCurrentYear.map(obj => {
        let rObj = {};
        rObj["label"] = obj.label;
        rObj["value"] = Number(obj.value) * this.refactorVal;
        return rObj;
      });

      this.OSCoreData = this.unixServerData.drills.AnnualTCOPerCoreCurrentYear.map(obj => {
        let rObj = {};
        rObj["label"] = obj.label;
        rObj["value"] = Number(obj.value) * this.refactorVal;
        return rObj;
      });

      this.OSCoreMarketRateData = this.unixServerData.drills.AnnualPricePerCoreCurrentYear.map(obj => {
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
        "dashboardId": "5",
        "pageName": "Non CIO Unix Tower Screen",
        "errorType": "warn",
        "errorTitle": "Data Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
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



  updateCompareData() {
    let object = this;
    let something = object.unixSharedService.getData().currency;
    let scenarioRegion = object.unixSharedService.getData().region;
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
        object.unixServerData = false;
        object.regionFilterLoaded = false;
      }

    });

    if (object.navigatedFromComparison == true) {
      object.updateScenarioDropdown();
      let refactorValue = object.unixSharedService.getData().refactorVal;
     
      let comparisionData = object.unixSharedService.getData().comparisionData;
    
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
      object.getScenarioDropdown();
      
    }


  }


  updateScenarioDropdown() {
    //get selected scenario id
    let object = this;

    let selectedScenarioID = object.unixSharedService.getScenarioSelection();
    //object.mainframeSharedService.getData().selectedScenarioId[0];
    object.selectedscenario = object.selectedScenarioName[selectedScenarioID];

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

    let comparisionData = object.unixSharedService.getData().comparisionData;
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
      // console.log(error);
    }
    // console.log(JSON.stringify(object.unixSharedService.getData().comparisionData));



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
    this.unixSharedService.getEmitter().removeAllListeners();
  }


  //function to check all relevent data is loaded on page
  isAllReleventDataLoaded() {
    let object = this;

    if (object.landingPageDataLoaded && object.scaleDataLoaded && object.regionFilterLoaded && object.currencyFilterLoaded && object.industryDataLoaded) {
      object.showUnixData = true;

      //emit an event to indicate data is loaded
      object.industrySizeService.getEmitter().emit('landingPageDataLoaded');

    }
    else {
      object.showUnixData = false;
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
        "dashboardId": "4",
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
          this.updateLineChartData();
          this.updateDrillDown();
        }
      });
      this.setRegion(this.selectedregion);

    }
    else//get comparison data for scenario
    {
      let requestedParam = {
        "userID": object.sessionId,
        "dashboardId": "5",
        "scenarioId": []
      }

      object.generateScenarioService.getSavedScenarioDataToPopulate("5", object.sessionId, scenarioID).subscribe((response) => {

        let object = this;

        object.selectedScenarioForComparison = [];

        object.scenarioObj = response;

        console.log('get scenario by id: ', object.scenarioObj);

        //logic to prepare a scenarion object for comparison

        for (let cnt = 0; cnt < object.scenarioObj.UnixServersInput.NA.length; cnt++) {
          let t1: any = {};
          t1.key = object.scenarioObj.UnixServersInput.NA[cnt].src_code;
          // console.log()
          t1.value = object.scenarioObj.UnixServersInput.NA[cnt].src_code_value;
          //once save note functionality done append value of each src code note here
          t1.note = object.scenarioObj.UnixServersInput.NA[cnt].notes;

          t1.value_format = object.scenarioObj.UnixServersInput.NA[cnt].value_format;

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
        object.unixSharedService.setData(sharedData);
        object.unixSharedService.setScenarioSelection(scenarioID);
        let something = object.unixSharedService.getData().currency;

        object.toggle();
        //get currency data
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

        let scenarioRegion = object.unixSharedService.getData().region;
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

  getCRGDropdown() {
    //get dropdown of scenarios

    let object = this;

    object.pageId = this.industrySizeService.getPageId();
    //wb service to fetch CRG list

    object.industrySizeService.getCustomRefereneGroupList().subscribe((data: any) => {

      try {

        
        object.customReferenceGroupList = data;

        console.log('object.customReferenceGroupList: ', object.customReferenceGroupList);

        object.selectedCRGName = [];

        //set default selection
        let temp: any = {};
        temp.UpdatedDate = null;
        temp.createdBy = null;
        temp.createdDate = null;
        temp.customName = "N/A";
        temp.dashboardId = object.pageId;
        temp.updatedBy = null;
        temp.customId = "-9999"; //
        temp.definition="";//
        object.selectedCRGName.push(temp);

        for (let index in object.customReferenceGroupList) {
          let option: any = {};

            option.UpdatedDate = object.customReferenceGroupList[index].UpdatedDate;
            option.createdBy = object.customReferenceGroupList[index].createdBy;
            option.createdDate = object.customReferenceGroupList[index].createdDate;
            option.customName = object.customReferenceGroupList[index].customName;
            option.dashboardId = object.customReferenceGroupList[index].dashboardId;
            option.updatedBy = object.customReferenceGroupList[index].updatedBy;
            option.customId = object.customReferenceGroupList[index].customId;
            option.definition = object.customReferenceGroupList[index].definition;
  
            console.log('option: ',option);
  
            object.selectedCRGName.push(option);
  
            console.log('object.selectedCRGName: ',object.selectedCRGName);
          
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
            object.unixServerData = crgData;
            object.landingPageDataLoaded=true;
            object.isAllReleventDataLoaded();
            //disable line charts
            object.isLineChartDisabled=true;

          }

        });
    }
    

    
    object.selectedCRGData = ''
    object.unixServerData = object.selectedCRGData;
  }

  showDefaultLandingData() {

    let object = this;

    // this is used for all landing page data
    object.unixLandingService.getData().subscribe((allData: any) => {
      object.unixServerData = allData;

      if (object.unixServerData != undefined && object.unixServerData != null) {
        object.landingPageDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.landingPageDataLoaded = false;
        object.showUnixData = false;
      }

      object.updateLineChartData();
      object.updateDrillDown();
      this.compareUnixInputData();
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "5",
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

    object.showUnixData = false;
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
        object.showUnixData = false;
      }

      object.scaleValue = "Small";

      console.log('object.data.industrySize[0].key: ',object.data.industrySize[0].key);
      console.log('object.scaleTitle: ',object.scaleTitle);

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
          object.showUnixData = false;
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
        object.showUnixData = false;
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


}
