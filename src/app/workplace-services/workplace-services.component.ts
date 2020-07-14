/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:workplace-server.component.ts **/
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
import { WorkplaceService } from '../services/workplace/workplace.service';
import { WorkplaceInputMyDataSharedService } from '../services/workplace/workplace-input-my-data-shared.service';
import { MapSourceCodeDataValues } from '../map-source-code-data-values';

import { negativeConstant } from '../../properties/constant-values-properties';

import { EnterCompareDataTowersService } from '../services/enter-compare-data-towers.service';
import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';
import { GenerateScenarioService } from '../services/generate-scenario.service';
import { CustomRefGroupService } from '../services/custom-ref-group/custom-ref-group.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
//import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { UpdateScenarioListNotificationServiceService } from '../services/update-scenario-list-notification-service.service';

declare var $: any;

@Component({
  selector: 'app-workplace-services',
  templateUrl: './workplace-services.component.html',
  styleUrls: ['./workplace-services.component.css'],
  providers: [FilterDataService]
})
export class WorkplaceServicesComponent implements OnInit, OnDestroy {

  private mapdata: any; //any is not a good practise,whats the point of using typescript then ?
  private scenarioData: any;
  workplaceDefinitionData: any;

  public isLineChartDisabled:boolean = false;

  showWorkPlaceData: boolean = false;

  //private data: FilterData;
  data: any = {};
  private data1: IsgKpiData;

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
  private conversionCurrency: any = null;
  private sourceMap: Map<string, string>;
  private scaleTitle = "Scale (Workplace Services Devices)";
  //  @ViewChild(CompareGridComponent) compareGridFlg;

  enterMyData = {

    "annualTCOPerWorkplaceDevices": null,
    "annualTCOPerWorkplaceUser": null,
    "annualEmailTCOPerMailbox": null,
    "noOfDevicesPerFTE": null,
    "staffingmixEmployee": null,
    "staffingmixContract": null,
    "pcdeploytime": null,
    "pcrefreshrate": null,
    "priority1": null,
    "priority2": null,
    "priority3": null,

  }

  showCompareGridChild: boolean = false;
  showCompareScreen: string = 'none';
  showCompareGridScreen: string = 'none';
  private selectedIndustry: string;
  resizePopup: string = "minimize";

  //line chart objects
  public workplaceTCOTicket: any;
  public workplacePriceTicket: any;
  public workplaceTCOUser: any;
  public workplacePriceUser: any;
  public workplaceServiceMailbox: any;
  public currencyVar: any;
  public currencySymbol: string;

  public workPlaceData: any;
  public scaleValue = "Small";

  public definitionData: any;

  display_personnel = 'none';
  display_hardware = 'none';
  display_software = 'none';
  display_outsourcing = 'none';
  showDrillDown: boolean = false;
  dataSource: Object;
  dataSourceHardware: Object;
  dataSourceSoftware: Object;
  dataSourceOutsourcing: object;
  dataSourceMailbox: Object;
  public dataCio: any;
  currencyCode: string = "USD";
  refactorVal: number = 1;
  showDiv: boolean = false;

  display_costPerUser = 'none';

  public dataSourceCostPerDevice: object;
  public dataSourcePerUser: Object;
  public currentyear: number;
  public previousYear: number;
  public secondPreviousYear: number;

  display_costPerInstance = 'none';
  display_costPerCore = 'none';
  display_costPerMailbox = 'none'

  //objects to store line chart data
  public annualCostMIPs: any;
  public marketCostMIPs: any;

  //equality
  public TCOPerWorkplaceDevicesEquality: boolean = false;
  public TCOPerWorkplaceUserEquality: boolean = false;
  public mailBoxEquality: boolean = false;
  public noOfDevicesFTEEquality: boolean = false;
  public staffingEmpEquality: boolean = false;
  public staffingContractEquality: boolean = false;
  public PCDeploymentTimeEquality: boolean = false;
  public PCRefreshTimeTimeEquality: boolean = false;

  //variables to check data load status
  public landingPageDataLoaded: boolean = false;
  public scaleDataLoaded: boolean = false;
  public regionFilterLoaded: boolean = false;
  public currencyFilterLoaded: boolean = false;
  public industryDataLoaded: boolean = false;

  public scenarios: any;
  public selectedScenarioName: any;
  public selectedscenario: any;
  public selectedScenarioList: any[];

  public navigatedFromComparison: boolean=false;
  public navigatedFromInput : boolean=false;

  customReferenceGroupList : any;
  selectedCRGName = [];
  selectedcustomRef: any;

  public isCrgSelected : boolean=false;

  NEGATIVE_CONST: number;

  map: Map<string, string> = new Map<string, string>();

  //bar chart
  public marketIncidentDataMaxValue;
  public scenarioIncidentDataMaxValue;
  public maxBarValue = 10;

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{ gridLines: {
      display:false
  }
      
    }], yAxes: [{
      ticks: {
        min: 0,
        maxTicksLimit: 5

      },
      gridLines: {
        display:false
      },
      display: false
    }] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    },
    events: [],
    animation: {
      onComplete: function () {
          var chartInstance = this.chart,
          ctx = chartInstance.ctx;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';


          this.data.datasets.forEach(function (dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function (bar, index) {
                  var data = dataset.data[index];
                  //console.log('Bar data: ', bar);
                 if(Number(bar._model.y)<=10)
                 {
                  // bar._model.y=25;
                  // ctx.fillText(data, bar._model.x, bar._model.y - 1);
                  
                  
                 }
                 else
                 {   
                   ctx.fillText(data, bar._model.x, bar._model.y - 1);
                  
                 }
                
                
              });
          });
      }
  },
  legend: {
    labels: {
      boxWidth: 0
    },
    
    
  }
  };
  public barChartLabels: Label[] = ['Priority 1', 'Priority 2', 'Priority 3'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
 // public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [];
  
  public chartColors: Array<any> = [
    { // first color
      backgroundColor: '#81cee3',
      borderColor: '#81cee3',
      pointBackgroundColor: '#81cee3',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#81cee3'
    },
    { // second color
      backgroundColor: 'rgb(41, 73, 123)',
      borderColor: 'rgb(41, 73, 123)',
      pointBackgroundColor: 'rgb(41, 73, 123)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(41, 73, 123)'
    }];


  // public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
  //   console.log(event, active);
  // }

  public incidentResponseTimeBarChartColors: Array<any> = [
    { // first color
      backgroundColor: '#81cee3',
      borderColor: '#81cee3',
       pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#81cee3'
    },
    { // second color
      backgroundColor: 'rgb(41, 73, 123)',
      borderColor: 'rgb(41, 73, 123)',
      pointBackgroundColor: 'rgb(41, 73, 123)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(41, 73, 123)'
    }];

  public enterMyDataBarChart: any;


  //scenario data bar chart
  

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

  costPerMailboxDialog() {
    this.display_costPerMailbox = 'block';
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
    this.display_costPerMailbox = 'none';
  }

  toggle() {
    this.showDiv = true;
    this.updateCompareData();
    this.compareWorkplaceInputData();
  }


  costPerUserDialog() {
    this.display_costPerUser = 'block';
  }

  closeCostPerUserModalDialog() {
    this.display_costPerUser = 'none';
  }

  public updateDrillDown() {

    try {

      this.dataSourceCostPerDevice = {
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
            seriesname: "Annual TCO Cost Per Workplace Services Device",
            anchorBgColor: "#03abba",
            "valuePosition": "ABOVE",
            "data": this.workplaceTCOTicket
          },
          {
            seriesname: "Annual Market Price Per Workplace Services Device",
            anchorBgColor: "#29497b",
            "valuePosition": "BELOW",
            "data": this.workplacePriceTicket
          }
        ]

      };

      this.dataSourcePerUser = {
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
            seriesname: "Annual TCO Per Workplace Services User",
            anchorBgColor: "#03abba",
            "valuePosition": "ABOVE",
            "data": this.workplaceTCOUser
          },
          {
            seriesname: "Annual Market Price Per Workplace Services User",
            anchorBgColor: "#29497b",
            "valuePosition": "BELOW",
            "data": this.workplacePriceUser
          }
        ]
      };

      this.dataSourceMailbox = {
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
              }
            ]
          }
        ],
        dataset: [
          {
            seriesname: "Annual Email Cost Per Workplace Services Mailbox",
            anchorBgColor: "#03abba",
            // "valuePosition": "ABOVE",
            "data": this.workplaceServiceMailbox
          }

        ]
      };
    }
    catch (error) {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "10",
        "pageName": "Non CIO Workplace Tower Screen",
        "errorType": "warn",
        "errorTitle": "Data Error",
        "errorDescription": error.message,
        "errorObject": error
      }


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
    private workplaceLanding: WorkplaceService,
    private workplaceSharedService: WorkplaceInputMyDataSharedService,
    private genericEnterCompare: EnterCompareDataTowersService,
    private loginDataBroadcastService: LoginDataBroadcastService,
    private generateScenarioService: GenerateScenarioService,
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

    let workplaceSharedEmitter = object.workplaceSharedService.getEmitter();
    workplaceSharedEmitter.on('callFunction', function () {
      object.sourceMap = object.workplaceSharedService.getData().map;
      object.navigatedFromComparison = true;
      // console.log(object.sourceMap);
      object.toggle();
    });

    workplaceSharedEmitter.on('newWorkplaceScenarioFromInput', function () {
      object.sourceMap = object.workplaceSharedService.getData().map;
      object.navigatedFromInput = true;
      // console.log(object.sourceMap);
      object.toggle();
    });


    //on save scenario
    object.workplaceSharedService.getEmitter().on('newWorkplaceScenarioSaved', function () {
      object.navigatedFromInput = false;
      //get saved scenario id
      let savedScearioId = object.workplaceSharedService.getScenarioSelection();

      if (savedScearioId != null || savedScearioId != undefined) {
        //get dropdown of scenarios


        object.genericEnterCompare.getScanrioData().subscribe(function (response) {

          try {
            object.scenarios = response;
            console.log('scenario list: ', object.scenarios);
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

            object.selectedscenario = object.selectedScenarioName[0];


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
        object.getScenarioDropdown();
      }

    });
    //chane in compare scenario dropdown
    object.commonService.getEventEmitter().on('workplacescenariodropdownchange', function () {
      //get selected scenario
      let scenario = object.commonService.getScenario();

      //call method to get scenario
      object.getScenarioDataById(scenario);

    });

    updateScenarioListNotificationServiceService.getEmitter().on('updateWorkplaceScenarioListAfterDeletion', function(){
      object.getScenarioDropdown();
    });
  }

  ngOnInit() {

    let object = this;
    //setting initial label
    this.currencyVar = require('currency-symbol-map');

    this.currentyear = (new Date()).getFullYear();
    this.previousYear = this.currentyear - 1;
    this.secondPreviousYear = this.currentyear - 2;

    $(".option-menus-collapse").hide();
    $(".search-box").addClass('search-hide');
    this.searchIcon();

    object.workplaceLanding.getData().subscribe((allData: any) => {
      object.workPlaceData = allData;

     

      if (object.workPlaceData != undefined && object.workPlaceData != null) {
         //prepare bar chart data
        object.prepareIncidentBarChartData();
        object.landingPageDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.landingPageDataLoaded = false;
        object.showWorkPlaceData = false;
      }
      //this.showWorkPlaceData = true;

      this.updateLineChartData();

      object.updateDrillDown();
      this.compareWorkplaceInputData();



    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "10",
        "pageName": "Non CIO Workplace Tower Screen",
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
        object.showWorkPlaceData = false;
      }


    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "10",
        "pageName": "Non CIO Workplace Tower Screen",
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
        object.showWorkPlaceData = false;
      }

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "10",
        "pageName": "Non CIO Workplace Tower Screen",
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
        object.showWorkPlaceData = false;
      }

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

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "10",
        "pageName": "Non CIO Workplace Tower Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });

    //set page identifier as 10 for workplace tower
    object.industrySizeService.setPageId(10);
    object.genericEnterCompare.setPopID(10);

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
        object.showWorkPlaceData = false;
      }

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "10",
        "pageName": "Non CIO Workplace Tower Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });

    // get group definition information
    object.industrySizeService.getDefinitionData().subscribe((data: any) => {
      object.workplaceDefinitionData = data;
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "10",
        "pageName": "Non CIO Workplace Tower Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });

    //get scenario dropdown
    object.navigatedFromInput=false;
    object.navigatedFromComparison = false;
    object.getScenarioDropdown();

    object.getCRGDropdown();

    let valTomakePositive = "0";
    this.makePositiveValue(valTomakePositive);

    // get group definition information
    object.industrySizeService.getDefinitionData().subscribe((data: any) => {
      object.definitionData = data;
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "10",
        "pageName": "Non CIO Workplace Tower Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });

    this.compareWorkplaceInputData();

  }

  

  prepareIncidentBarChartData()
  {
    let object =this;

    //alert(JSON.stringify(object.barChartOptions.scales.yAxes[0].ticks.stepSize));

    object.barChartData = [];
    

    let tempDataObj = { data: [], label : ""};
    let tempDataObj1 = {data:[], label : ""};

    console.log('P1 data: ',object.workPlaceData.data.IncidentResponseTime.WorkplaceServices.P1.value);
    console.log('P2 data: ',object.workPlaceData.data.IncidentResponseTime.WorkplaceServices.P2.value);
    console.log('P3 data: ',object.workPlaceData.data.IncidentResponseTime.WorkplaceServices.P3.value);

    tempDataObj.data.push(Number(object.workPlaceData.data.IncidentResponseTime.WorkplaceServices.P1.value).toFixed(1));  
    tempDataObj.data.push(Number(object.workPlaceData.data.IncidentResponseTime.WorkplaceServices.P2.value).toFixed(1));  
    tempDataObj.data.push(Number(object.workPlaceData.data.IncidentResponseTime.WorkplaceServices.P3.value).toFixed(1));  

    object.barChartData.push(tempDataObj);

    object.marketIncidentDataMaxValue = object.calculateBarChartMaxValue(object.workPlaceData.data.IncidentResponseTime.WorkplaceServices.P1.value, object.workPlaceData.data.IncidentResponseTime.WorkplaceServices.P2.value, object.workPlaceData.data.IncidentResponseTime.WorkplaceServices.P3.value);
   
    //object.barChartOptions.scales.yAxes[0].ticks.max = maxDataValue;
    console.log('object.barChartOptions.scales.yAxes[0].ticks.stepSize: ',object.barChartOptions.scales.yAxes[0].ticks.stepSize);
    

   // object.barChartData[0].data[1] = object.workPlaceData.data.IncidentResponseTime.WorkplaceServices.P2.value;
    //object.barChartData[0].data[2] = object.workPlaceData.data.IncidentResponseTime.WorkplaceServices.P3.value;

    //scenario bar chart
    console.log('enter my data bar chart: ', object.enterMyData);

    if((object.enterMyData!=null || object.enterMyData!= undefined) && object.showDiv==true)
    {
      if(object.enterMyData.priority1 >= 0){
        tempDataObj1.data.push(Number(object.enterMyData.priority1).toFixed(1));  
        //object.barChartData[1].data[0] =  object.enterMyData.priority1;
      }
      if(object.enterMyData.priority2 >= 0){
        tempDataObj1.data.push(Number(object.enterMyData.priority2).toFixed(1));  
        //object.barChartData[1].data[1] =  object.enterMyData.priority2;
      }
      if(object.enterMyData.priority3 >= 0){
        tempDataObj1.data.push(Number(object.enterMyData.priority3).toFixed(1));  
        //object.barChartData[1].data[2] =  object.enterMyData.priority3;
      }   
     
      object.barChartData.push(tempDataObj1);

      object.scenarioIncidentDataMaxValue = object.calculateBarChartMaxValue(object.enterMyData.priority1, object.enterMyData.priority2, object.enterMyData.priority3);

     

    }

   
      if((object.enterMyData!=null || object.enterMyData!= undefined) && object.showDiv==true &&
      object.scenarioIncidentDataMaxValue > object.marketIncidentDataMaxValue)
      {
        object.maxBarValue = Math.round(object.scenarioIncidentDataMaxValue)+5;
        //object.calculateScenarioStepSize(object.scenarioIncidentDataMaxValue);
      }
      else 
      {
        object.maxBarValue = Math.round(object.marketIncidentDataMaxValue)+5;
        //object.calculateScenarioStepSize(object.marketIncidentDataMaxValue);
      }
    


    console.log('bar chart data: ', object.barChartData);


  }

  calculateScenarioStepSize(maxDataValue)
  {
    let object = this;

    if(maxDataValue>100)
    {
      //object.barChartOptions.scales.yAxes[0].ticks.stepSize = 50;

      

    }

   // object.barChartOptions.scales.yAxes[0].ticks.max = Math.round(maxDataValue)+5;

    //alert(object.barChartOptions.scales.yAxes[0].ticks.max);
    // if(maxDataValue > 100)
    // {
    //   object.barChartOptions.scales.yAxes[0].ticks.stepSize =maxDataValue/5;
    //   object.barChartOptions.scales.yAxes[0].ticks.max = maxDataValue; 
    //   console.log('maxDataValue > 100: ', object.barChartOptions.scales.yAxes[0].ticks.max);
    // }
    // else if(maxDataValue > 50)
    // {
    //   object.barChartOptions.scales.yAxes[0].ticks.stepSize =10;
    //   console.log('maxDataValue > 50: ', object.barChartOptions.scales.yAxes[0].ticks.stepSize);
    // }
    // else if(maxDataValue > 10)
    // {
    //   object.barChartOptions.scales.yAxes[0].ticks.stepSize =5;
    //   console.log('maxDataValue > 10: ', object.barChartOptions.scales.yAxes[0].ticks.stepSize);
    // }
    // else
    // {
    //   object.barChartOptions.scales.yAxes[0].ticks.stepSize = 1;
    //   console.log('maxDataValue < 10: ', object.barChartOptions.scales.yAxes[0].ticks.stepSize);
    // }
  }

  calculateBarChartMaxValue( p1, p2, p3)
  {
    let object = this;

    let maxDataValue = p1;
    
    if(maxDataValue < p2)
    {
      maxDataValue = p2;
    }
    
    if(maxDataValue < p3)
    {
      maxDataValue = p3
    }
    
    //limit the stepsize of bar
    console.log('maxDataValue: ',maxDataValue);

   
   
    return maxDataValue;
  }

  // prepareIncidentBarChartData()
  // {
  //   let object = this;

  //   object.incidentResponseTimeBarChartData = [];

  //   let tempDataObj = { data: [], label: 'Market Data' };
  //   let tempDataObj1 = {data:[], label: 'Scenario Data'};

  //   console.log('object.workPlaceData.data.IncidentResponseTime.WorkplaceServices.P1.value: ',object.workPlaceData.data.IncidentResponseTime.WorkplaceServices.P1.value);

  //       //insert market data
  //       tempDataObj.data.push((Number(object.workPlaceData.data.IncidentResponseTime.WorkplaceServices.P1.value))); 
  //       tempDataObj.data.push((Number(object.workPlaceData.data.IncidentResponseTime.WorkplaceServices.P2.value))); 
  //       tempDataObj.data.push((Number(object.workPlaceData.data.IncidentResponseTime.WorkplaceServices.P3.value))); 
       
  //       object.incidentResponseTimeBarChartData.push(tempDataObj);

  //       console.log('object.workPlaceData.data.IncidentResponseTime.WorkplaceServices.P1.value: ',object.incidentResponseTimeBarChartData[0].data[1]);
        
  //       // if(object.enterMyDataBarChart != undefined || object.enterMyDataBarChart != null){
  //       //   if(object.enterMyDataBarChart.Data.BusinessModelInnovation.length > 0 && (object.enterMyDataBarChart.Data.BusinessModelInnovation != undefined || object.enterMyDataBarChart.Data.BusinessModelInnovation != null)){
  //       //     object.businessInnovationChartData.push(tempDataObj1);
  //       //   }
  //       // }
    
  //       // console.log('object.topTenChartData: ', tempDataObj);
  //       // console.log("businessInnovation",tempDataObj1)
        
      

  // }


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
        let savedScearioId = object.workplaceSharedService.getScenarioSelection();
       // object.selectedscenario = object.selectedScenarioName[Number(savedScearioId)];
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
          "dashboardId": "10",
          "pageName": "Non CIO Workplace Tower Screen",
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
      this.workplaceTCOTicket = this.workPlaceData.drills.AnnualTCOPerWorkplaceServicesTicketCurrentYear.map(obj => {
        let rObj = {};
        rObj["label"] = obj.label;
        rObj["value"] = Number(obj.value) * this.refactorVal;
        return rObj;
      });

      this.workplacePriceTicket = this.workPlaceData.drills.AnnualPricePerWorkplaceServicesTicketCurrentYear.map(obj => {
        let rObj = {};
        rObj["label"] = obj.label;
        rObj["value"] = Number(obj.value) * this.refactorVal;
        return rObj;
      });

      this.workplaceTCOUser = this.workPlaceData.drills.AnnualTCOPerWorkplaceServicesUserCurrentYear.map(obj => {
        let rObj = {};
        rObj["label"] = obj.label;
        rObj["value"] = Number(obj.value) * this.refactorVal;
        return rObj;
      });

      this.workplacePriceUser = this.workPlaceData.drills.AnnualPricePerWorkplaceServicesUserCurrentYear.map(obj => {
        let rObj = {};
        rObj["label"] = obj.label;
        rObj["value"] = Number(obj.value) * this.refactorVal;
        return rObj;
      });

      this.workplaceServiceMailbox = this.workPlaceData.drills.AnnualEmailTCOPerMailboxCurrentYear.map(obj => {
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
        "dashboardId": "10",
        "pageName": "Non CIO Workplace Tower Screen",
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
    //setting label for scale
    this.industrySizeService.setScaleLabel(scale.key);
    //call service for filtered data
    this.filterData();

    //make current button active
    this.scaleValue = scale.value;

  }

  filterData() {
    let object = this;
    object.industrySizeService.getMainFrameDataByScale().subscribe((data: any) => {
      object.workPlaceData = data;
      console.log('filtered data: ', object.workPlaceData);
      //this.showWorkPlaceData = true;
      this.prepareIncidentBarChartData();
      this.isLineChartDisabled=false;
      this.updateLineChartData();
      this.updateDrillDown();
      this.compareWorkplaceInputData();
     
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "10",
        "pageName": "Non CIO Workplace Tower Screen",
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
      this.compareWorkplaceInputData();

      // console.log('after conversion previous',this.getCurrency(this.conversionCurrency));
      // console.log('after coversion selected',currency.key);
      this.conversionCurrency = currency.key;

    }
  }

  compareWorkplaceInputData() {

    try {
      let object = this;
      let test = new MapSourceCodeDataValues();
      object.scenarioData = object.workplaceSharedService.getData().comparisionData;
      object.mapdata = test.mapData(object.scenarioData);

      object.NEGATIVE_CONST = negativeConstant.NEGATIVE_CONSTANT;

      this.enterMyData.pcdeploytime = object.mapdata.K14110;

      let userPCDeploymentTime = Number(this.workPlaceData.data.AverageDeploymentTimeindays.WorkplaceServicesDeployTime.Mean.value).toFixed(1);
      let enterPCDeploymentTime = Number(this.enterMyData.pcdeploytime).toFixed(1);

      if (userPCDeploymentTime == enterPCDeploymentTime) {
        this.PCDeploymentTimeEquality = true;
      }
      else {
        this.PCDeploymentTimeEquality = false;
      }
      // alert(this.enterMyData.pcdeploytime);

      this.enterMyData.pcrefreshrate = object.mapdata.G15011;
      let userPCRefreshTime = Number(this.workPlaceData.data.RefreshRateinYears.WorkplaceServicesRefreshRate.Mean.value).toFixed(1);
      let enterPCRefreshTime = Number(this.enterMyData.pcrefreshrate).toFixed(1);

      if (userPCRefreshTime == enterPCRefreshTime) {
        this.PCRefreshTimeTimeEquality = true;
      }
      else {
        this.PCRefreshTimeTimeEquality = false;
      }

      this.enterMyData.priority1 = object.mapdata.C54721;
      this.enterMyData.priority2 = object.mapdata.C54731;
      this.enterMyData.priority3 = object.mapdata.C54741;

      // DT0200 / BC1090
      if (object.mapdata.DT0200 == negativeConstant.NEGATIVE_CONSTANT && object.mapdata.BC1090 == negativeConstant.NEGATIVE_CONSTANT) {
        this.enterMyData.annualEmailTCOPerMailbox = object.NEGATIVE_CONST;
      } else if (object.mapdata.DT0200 == 0 && object.mapdata.BC1090 == 0) {
        this.enterMyData.annualEmailTCOPerMailbox = 0;
      } else {
        this.enterMyData.annualEmailTCOPerMailbox = eval("object.mapdata.DT0200 / object.mapdata.BC1090");
      }

      let userEmailTCOPerMailbox = (Number(this.workPlaceData.data.AnnualCostPerMailbox.CostPerDevice.MailboxCY.value) * this.refactorVal).toFixed(1);
      let enterEmailTCOPerMailbox = Number(this.enterMyData.annualEmailTCOPerMailbox).toFixed(1);

      if (userEmailTCOPerMailbox == enterEmailTCOPerMailbox) {
        this.mailBoxEquality = true;
      }
      else {
        this.mailBoxEquality = false;
      }

      if (Number(this.enterMyData.annualEmailTCOPerMailbox)) {
        this.enterMyData.annualEmailTCOPerMailbox = this.enterMyData.annualEmailTCOPerMailbox;
      } else {
        this.enterMyData.annualEmailTCOPerMailbox = 0;
      }

      if (this.enterMyData.annualEmailTCOPerMailbox == Infinity || this.enterMyData.annualEmailTCOPerMailbox == 'Infinity') {
        this.enterMyData.annualEmailTCOPerMailbox = 0;
      }

      // DDT000 / DT0075
      this.enterMyData.annualTCOPerWorkplaceDevices = eval("object.mapdata.DDT000 / object.mapdata.DT0075");

      if (object.mapdata.DDT000 == 0 && object.mapdata.DT0075 == 0) {
        this.enterMyData.annualTCOPerWorkplaceDevices = 0;
      } else {
        this.enterMyData.annualTCOPerWorkplaceDevices = eval("object.mapdata.DDT000 / object.mapdata.DT0075");
      }

      if (this.enterMyData.annualTCOPerWorkplaceDevices == Infinity || this.enterMyData.annualTCOPerWorkplaceDevices == 'Infinity') {
        this.enterMyData.annualTCOPerWorkplaceDevices = 0;
      }

      let userTCOPerWorkplaceDevices = Math.round(Number(this.workPlaceData.data.AnnualCostPerWorkplaceServicesDevice.CostPerDevice.NumberCY.value) * this.refactorVal);
      let enterTCOPerWorkplaceDevices = Math.round(this.enterMyData.annualTCOPerWorkplaceDevices);

      if (userTCOPerWorkplaceDevices == enterTCOPerWorkplaceDevices) {
        this.TCOPerWorkplaceDevicesEquality = true;
      }
      else {
        this.TCOPerWorkplaceDevicesEquality = false;
      }

      // EDT010 / (EDT010 + EDT020)
      if (object.mapdata.EDT010 == this.NEGATIVE_CONST && object.mapdata.EDT020 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixEmployee = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.EDT010 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixEmployee = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.EDT020 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixEmployee = eval("object.mapdata.EDT010 / (object.mapdata.EDT010 + 0)");
      }
      else {
        this.enterMyData.staffingmixEmployee = eval("object.mapdata.EDT010 / (object.mapdata.EDT010 + object.mapdata.EDT020)");
      }

      let userStaffingEmployee = Number(this.workPlaceData.data.StaffingMix.StaffingMixEmployee.Number.value).toFixed(1);
      let enterStaffingEmployee = (Number(this.enterMyData.staffingmixEmployee) * 100).toFixed(1);


      if (userStaffingEmployee == enterStaffingEmployee) {
        this.staffingEmpEquality = true;
      }
      else {
        this.staffingEmpEquality = false;
      }

      if (this.enterMyData.staffingmixEmployee == Infinity || this.enterMyData.staffingmixEmployee == 'infinity' || this.enterMyData.staffingmixEmployee == "Infinity" || isNaN(this.enterMyData.staffingmixEmployee)) {
        this.enterMyData.staffingmixEmployee = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.staffingmixEmployee)) {
        this.enterMyData.staffingmixEmployee = this.enterMyData.staffingmixEmployee;
      } else {
        this.enterMyData.staffingmixEmployee = 0;
      }

      // EDT020 / (EDT010 + EDT020)
      //in case of null or empty value
      if (object.mapdata.EDT010 == this.NEGATIVE_CONST && object.mapdata.EDT020 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixContract = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.EDT020 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixContract = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.EDT010 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixContract = eval("object.mapdata.EDT020 / (0+object.mapdata.EDT020)");
      }
      else {
        this.enterMyData.staffingmixContract = eval("object.mapdata.EDT020 / (object.mapdata.EDT020 + object.mapdata.EDT010)");
      }

      let userStaffingContract = Number(this.workPlaceData.data.StaffingMix.StaffingMixContractor.Number.value).toFixed(1);
      let enterStaffingContract = (Number(this.enterMyData.staffingmixContract) * 100).toFixed(1);


      if (userStaffingContract == enterStaffingContract) {
        this.staffingContractEquality = true;
      }
      else {
        this.staffingContractEquality = false;
      }


      if (this.enterMyData.staffingmixContract == Infinity || this.enterMyData.staffingmixContract == 'infinity' || this.enterMyData.staffingmixContract == "Infinity" || isNaN(this.enterMyData.staffingmixContract)) {
        this.enterMyData.staffingmixContract = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.staffingmixContract)) {
        this.enterMyData.staffingmixContract = this.enterMyData.staffingmixContract;
      } else {
        this.enterMyData.staffingmixContract = 0;
      }

      // DDT000 / DT0010
      this.enterMyData.annualTCOPerWorkplaceUser = eval("object.mapdata.DDT000 / object.mapdata.DT0010");

      if (object.mapdata.DDT000 == 0 && object.mapdata.DT0010 == 0) {
        this.enterMyData.annualTCOPerWorkplaceUser = 0;
      } else {
        this.enterMyData.annualTCOPerWorkplaceUser = eval("object.mapdata.DDT000 / object.mapdata.DT0010");
      }

      let userannualTCOPerWorkplaceUser = Math.round(Number(this.workPlaceData.data.AnnualCostPerWorkplaceServicesUser.CostPerUser.NumberCY.value) * this.refactorVal);
      let enterannualTCOPerWorkplaceUser = Math.round(this.enterMyData.annualTCOPerWorkplaceUser);

      if (userannualTCOPerWorkplaceUser == enterannualTCOPerWorkplaceUser) {
        this.TCOPerWorkplaceUserEquality = true;
      }
      else {
        this.TCOPerWorkplaceUserEquality = false;
      }

      if (this.enterMyData.annualTCOPerWorkplaceUser == Infinity || this.enterMyData.annualTCOPerWorkplaceUser == 'Infinity') {
        this.enterMyData.annualTCOPerWorkplaceUser = 0;
      }

      // DT0075 / (EDT010 + EDT020)
      //in case of null or empty value
      if (object.mapdata.DT0075 == this.NEGATIVE_CONST && object.mapdata.EDT010 == this.NEGATIVE_CONST && object.mapdata.EDT020 == this.NEGATIVE_CONST) {
        this.enterMyData.noOfDevicesPerFTE = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.DT0075 == this.NEGATIVE_CONST) {
        this.enterMyData.noOfDevicesPerFTE = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.EDT010 == this.NEGATIVE_CONST) {
        this.enterMyData.noOfDevicesPerFTE = eval("object.mapdata.DT0075 / (0 + object.mapdata.EDT020)");
      }
      else if (object.mapdata.EDT020 == this.NEGATIVE_CONST) {
        this.enterMyData.noOfDevicesPerFTE = eval("object.mapdata.DT0075 / (object.mapdata.EDT010 + 0)");
      }
      else {
        this.enterMyData.noOfDevicesPerFTE = eval("object.mapdata.DT0075 / (object.mapdata.EDT010 + object.mapdata.EDT020)");
      }

      let userNoOfDevicesPerFTE = Math.round(this.workPlaceData.data.NumberofDevicesPerFTE.DevicesPerFTE.Number.value);
      let enterNoOfDevicesPerFTE = Math.round(this.enterMyData.noOfDevicesPerFTE);

      if (userNoOfDevicesPerFTE == enterNoOfDevicesPerFTE) {
        this.noOfDevicesFTEEquality = true;
      }
      else {
        this.noOfDevicesFTEEquality = false;
      }


      if (this.enterMyData.noOfDevicesPerFTE == Infinity || this.enterMyData.noOfDevicesPerFTE == '' || this.enterMyData.noOfDevicesPerFTE == 'Infinity' || this.enterMyData.noOfDevicesPerFTE == 'infinity') {
        this.enterMyData.noOfDevicesPerFTE = 0;
      } else if (Number(this.enterMyData.noOfDevicesPerFTE)) {
        this.enterMyData.noOfDevicesPerFTE = this.enterMyData.noOfDevicesPerFTE;
      } else {
        this.enterMyData.noOfDevicesPerFTE = 0;
      }

      //update bar chart
      object.prepareIncidentBarChartData();

      // alert(this.enterMyData.noOfDevicesPerFTE);

      // if (this.enterMyData.annualTCOPerWorkplaceDevices < this.workPlaceData.data.AnnualCostPerWorkplaceServicesDevice.CostPerDevice.NumberCY.value) {
      //   document.getElementById("workplaceAnnualTCOcostPerDeviceSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if (this.enterMyData.annualTCOPerWorkplaceDevices < this.workPlaceData.data.AnnualCostPerWorkplaceServicesDevice.CostPerDevice.NumberCY.value) {
      //   document.getElementById("workplaceMarketProcePerDeviceSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if (this.enterMyData.annualTCOPerWorkplaceUser < this.workPlaceData.data.AnnualCostPerWorkplaceServicesUser.CostPerUser.NumberCY.value) {
      //   document.getElementById("workplaceAnnualTCOcostPerUserSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if (this.enterMyData.annualTCOPerWorkplaceUser < this.workPlaceData.data.AnnualCostPerWorkplaceServicesUser.CostPerUser.NumberCY.value) {
      //   document.getElementById("wpmarketPlaceSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if (this.enterMyData.annualEmailTCOPerMailbox < this.workPlaceData.data.AnnualCostPerMailbox.CostPerDevice.MailboxCY.value) {
      //   document.getElementById("workplaceAnnualEmailTCOPerMailboxSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }
      // try{
      //   if (this.enterMyData.noOfDevicesPerFTE < this.workPlaceData.data.NumberofDevicesPerFTE.DevicesPerFTE.Number.value) {
      //     document.getElementById("workplacenoOfOSInstancesPerFTESVG").setAttribute('transform', 'rotate(90) rotate(90)');
      //   }
      // }catch(error){
      //   console.log(error);
      // }
      // if ((this.enterMyData.staffingmixEmployee*100) < this.workPlaceData.data.StaffingMix.StaffingMixEmployee.Number.value) {
      //   document.getElementById("workplaceStaffingmixEmployeeSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }

      // if ((this.enterMyData.staffingmixContract*100) < this.workPlaceData.data.StaffingMix.StaffingMixContractor.Number.value) {
      //   document.getElementById("workplaceStaffingmixContractSVG").setAttribute('transform', 'rotate(90) rotate(90)');
      // }
    }
    catch (error) {
      // console.log('workplace');
      console.log(error);
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "10",
        "pageName": "Non CIO Workplace Tower Screen",
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
    let something = object.workplaceSharedService.getData().currency;
    let scenarioRegion = object.workplaceSharedService.getData().region;
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
        console.log('this.selectedregion: ', this.selectedregion);
        this.regionLoaded = true;
      }

      if (object.data.region != null && object.data.region != undefined) {
        object.regionFilterLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.workPlaceData = false;
        object.regionFilterLoaded = false;
      }

    });

    if (object.navigatedFromComparison == true) {
      object.updateScenarioDropdown();
      let refactorValue = object.workplaceSharedService.getData().refactorVal;
     
      let comparisionData = object.workplaceSharedService.getData().comparisionData;
    
        for (let data of comparisionData) {
  
          let key = object.sourceMap[data.key];
          if (key != undefined && key != null && key != "#" && key != "%") {
            // data.value = data.value / currentValue.id;
            data.value = data.value * refactorValue;
          }
  
        }
    }

    if(object.navigatedFromInput ==true){
      // object.updateScenarioDropdown();
      object.getScenarioDropdown();
      
    }

  }

  updateScenarioDropdown() {
    //get selected scenario id
    let object = this;

    let selectedScenarioID = object.workplaceSharedService.getScenarioSelection();
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

    let comparisionData = object.workplaceSharedService.getData().comparisionData;
    // console.log(JSON.stringify(comparisionData));
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
      //console.log(error);
    }
    // console.log(JSON.stringify(object.workplaceSharedService.getData().comparisionData));



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
  //this is done so as to remove memory leaks
  ngOnDestroy() {
    //emit an event to indicate data is resetted
    this.industrySizeService.getEmitter().emit('landingPageDataReset');
    this.workplaceSharedService.getEmitter().removeAllListeners();
  }

  //function to check all relevent data is loaded on page
  isAllReleventDataLoaded() {
    let object = this;

    if (object.landingPageDataLoaded && object.scaleDataLoaded && object.regionFilterLoaded && object.currencyFilterLoaded && object.industryDataLoaded) {
      object.showWorkPlaceData = true;

      //emit an event to indicate data is loaded
      object.industrySizeService.getEmitter().emit('landingPageDataLoaded');

    }
    else {
      object.showWorkPlaceData = false;
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
        "dashboardId": "10",
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
          this.currencySymbol = this.currencyVar(this.currencyCode);
          // this.updateLineChartData();
          // this.updateDrillDown();
        }
      });
      this.setRegion(this.selectedregion);

      object.prepareIncidentBarChartData();

    }
    else//get comparison data for scenario
    {
      let requestedParam = {
        "userID": object.sessionId,
        "dashboardId": "3",
        "scenarioId": []
      }

      object.generateScenarioService.getSavedScenarioDataToPopulate("10", object.sessionId, scenarioID).subscribe((response) => {

        let object = this;

        object.selectedScenarioForComparison = [];

        object.scenarioObj = response;

        console.log('get scenario by id: ', object.scenarioObj);

        //logic to prepare a scenarion object for comparison

        for (let cnt = 0; cnt < object.scenarioObj.WorkplaceServicesInput.NA.length; cnt++) {
          let t1: any = {};
          t1.key = object.scenarioObj.WorkplaceServicesInput.NA[cnt].src_code;
          // console.log()
          t1.value = object.scenarioObj.WorkplaceServicesInput.NA[cnt].src_code_value;
          //once save note functionality done append value of each src code note here
          t1.note = object.scenarioObj.WorkplaceServicesInput.NA[cnt].notes;

          t1.value_format = object.scenarioObj.WorkplaceServicesInput.NA[cnt].value_format;

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
        object.workplaceSharedService.setData(sharedData);
        object.workplaceSharedService.setScenarioSelection(scenarioID);
        let something = object.workplaceSharedService.getData().currency;

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


        let scenarioRegion = object.workplaceSharedService.getData().region;
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
      //enable line charts
      object.isLineChartDisabled=false;
      // object.showDefaultCurrency();
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
            object.workPlaceData = crgData;
            object.landingPageDataLoaded=true;
            object.prepareIncidentBarChartData();
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
    object.workplaceLanding.getData().subscribe((allData: any) => {
      object.workPlaceData = allData;

      if (object.workPlaceData != undefined && object.workPlaceData != null) {
        object.landingPageDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.landingPageDataLoaded = false;
        object.showWorkPlaceData = false;
      }

      object.prepareIncidentBarChartData();
      object.updateLineChartData();
      object.updateDrillDown();
      this.compareWorkplaceInputData();
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

    object.showWorkPlaceData = false;
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

      console.log('scale data: ', data);

      object.data.industrySize = data["industrySize"];

      if (object.data.industrySize != undefined && object.data.industrySize != null) {
        object.scaleDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.scaleDataLoaded = false;
        object.showWorkPlaceData = false;
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
          object.showWorkPlaceData = false;
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
        object.showWorkPlaceData = false;
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
    let selectedDashboardId = 10;
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
        temp.customId = "-9999"; 
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
