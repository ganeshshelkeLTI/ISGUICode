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

import { ApplicationMaintenanceService } from '../services/application-maintenance/application-maintenance.service';

import { MapSourceCodeDataValues } from '../map-source-code-data-values';
import { ServiceDeskInputMyDataSharedService } from '../services/servicedesk/service-desk-input-my-data-shared.service';
import { EnterCompareDataTowersService } from '../services/enter-compare-data-towers.service';

import { negativeConstant } from '../../properties/constant-values-properties';
import { ApplicationDevelopmentInputMyDataSharedService } from '../services/application-development/application-development-input-my-data-shared.service';
import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';
import { GenerateScenarioService } from '../services/generate-scenario.service';
import { UpdateScenarioListNotificationServiceService } from '../services/update-scenario-list-notification-service.service';

declare var $: any;

@Component({
  selector: 'application-maintenance',
  templateUrl: './application-maintenance.component.html',
  styleUrls: ['./application-maintenance.component.css']
})
export class ApplicationMaintenanceComponent implements OnInit {

  showApplicationMaintenanceData: boolean = false;
  public applicationMaintenanceData: any;

  private mapdata: any;
  private scenarioData: any;

  enterMyData = {
    "staffingmixEmployee": null,
    "staffingmixContract": null,
    "offshore": null,
    "FTEEmployee": null,
    "FTEContractor": null,
    "averageProjectSize": null,
    "onTimeDelivery": null,
    "onBudgetDelivery": null,
    "agile": null,
    "waterfall": null,
    "sdlchybrid": null,
    "sdlcothers": null,
    "sdlcnone": null,
    "costperhour": null,
    "priceperhour": null,
    "costAllocationPersonnel": null,
    "costAllocationOutsource": null,
    "costAllocationTools": null,
    "saas": null,
    "erp": null,
    "cots": null,
    "bespoke": null,
    "buildTime": null,
    "automatedTesting": null,
    "managedServices": null,
    "ADMADManagedServices": null,
    "ADMAMManagedServices": null,
    "ADMADMEmployeeStaffMix": null,
    "ADMAMMEmployeeStaffMix": null,
    "ADMADMContractStaffMix": null,
    "ADMAMMContractStaffMix": null,
    "applicationReleaseRate": null,
    "severity1Defect": null,
    "severity2Defect": null,
    "severity3Defect": null,
    "severity4Defect": null,
    "costPerSupportContact": null,
    "defectCloseRate": null,
    "defectsReportedApplication": null,
    "defectsClosedApplication": null,
    "requestedEnhancements": null,
    "completdEnhancements": null,
    "applicationDevCost": null,
    "applicationMaintenanceCost": null
  }

  


  currencyCode: string = "USD";
  refactorVal: number = 1;


  //private data: FilterData;
  private data: any = {};
  private data1: IsgKpiData;
  private ADMefinitionData: any;

  private selectedindustry;//it will be assigned string
  private selectedregion;//it will be assigned string
  private selectedsize;//it will be assigned string
  private selectedcurrency;//this will be assigned whole object currency
  public selectedsizes: any;

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
  public scenarioListLoaded: boolean = false;
  public CRGListLoaded: boolean = false;


  public AMDefinitionData: any;
  public selectedIndustries: any;

  public NEGATIVE_CONST: number;
  public navigatedFromComparison: boolean = false;
  public navigatedFromInput: boolean = false;

  public scenarios: any;
  public selectedScenarioName: any;
  public selectedscenario: any;

  //equality
  public personnelEquality: boolean = false;
  public softwareEquality: boolean = false;
  public outSourceEquality: boolean = false;
  public costPerEmplyeeEquality: boolean = false;
  public costPerContractorEquality: boolean = false;
  public avgProjectSizeEquality: boolean = false;
  public offshoreEquality: boolean = false;
  public staffingMixEmployeeEquality: boolean = false;
  public staffingMixContractorEquality: boolean = false;
  public onTimeDeliveryEquality: boolean = false;
  public onBudgetDeliveryEquality: boolean = false;
  public devMethodWaterfallEquality: boolean = false;
  public devMethodAgileEquality: boolean = false;
  public devMethodHybridEquality: boolean = false;
  public devMethodNoneEquality: boolean = false;
  public devMethodOtherEquality: boolean = false;
  public sdlcDesignEquality: boolean = false;
  public sdlcTestEquality: boolean = false;
  public sdlcAnalysisEquality: boolean = false;
  public sdlcRepEquality: boolean = false;
  public sdlcDevEquality: boolean = false;
  public sdlcFeasibilityEquality: boolean = false;
  public sdlcPMEquality: boolean = false;
  public sdlcNPEquality: boolean = false;
  public pricePerHourEquality: boolean = false;
  public costPerHourEquality: boolean = false;
  public toolsEquality: boolean = false;
  public saasEquality: boolean = false;
  public erpEquality: boolean = false;
  public cotsEquality: boolean = false;
  public bespokeEquality: boolean = false;
  public buildTimeEquality: boolean = false;
  public automatedtestingEquality: boolean = false;
  public managedServiceEquality: boolean = false;
  public ADMADManagedEquality: boolean = false;
  public ADMAMManagedEquality: boolean = false;
  public ADMADEmployeeEquality: boolean = false;
  public ADMAMEmployeeEquality: boolean = false;
  public ADMADContractEquality: boolean = false;
  public ADMAMContractEquality: boolean = false;
  public appReleaseRateEquality: boolean = false;
  public severity1Equality: boolean = false;
  public severity2Equality: boolean = false;
  public severity3Equality: boolean = false;
  public severity4Equality: boolean = false;
  public costPerSupportEquality: boolean = false;
  public defectCloseRateEquality: boolean = false;
  public defectsReportedApplicationEquality: boolean = false;
  public defectsClosedApplicationEquality: boolean = false;
  public requestedEnhancementsEquality: boolean = false;
  public completedEnhancementsEquality: boolean = false;

  //CRG
  public customReferenceGroupList: any;
  public selectedCRGName: any;
  public CRGNameToCompare: any;
  public selectedcustomRef: any;
  public selectedCRGData: any;
  public allCurrencies: any;

  map: Map<string, string> = new Map<string, string>();

  
  public adCostEquality:boolean = false;
  public amCostEquality:boolean  = false;

  constructor(private service: FilterDataService,
    private commonService: CioheaderdataService,
    private compareHeaderDataService: HeaderCompareScreenDataService,
    private dropDownService: DropDownService,
    private industrySizeService: IndustrySizeService,
    location: Location,
    router: Router,
    private servicedeskSharedService: ServiceDeskInputMyDataSharedService,
    private genericEnterCompare: EnterCompareDataTowersService,
    private ADSharedService: ApplicationDevelopmentInputMyDataSharedService,
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

    object.ADSharedService.getEmitter().on('navigateToAMComponent', function () {
      object.sourceMap = object.ADSharedService.getData().map;
      object.navigatedFromComparison = true;
      object.toggle();
    });

    object.ADSharedService.getEmitter().on('navigateToAMComponentFromInput', function () {
      object.sourceMap = object.ADSharedService.getData().map;
      object.navigatedFromInput = true;
      object.toggle();
    });


    //on save scenario
    object.ADSharedService.getEmitter().on('newAMScenarioSaved', function () {
      //get saved scenario id
      let savedScearioId = object.ADSharedService.getScenarioSelection();

      if (savedScearioId != null || savedScearioId != undefined) {
        //get dropdown of scenarios


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
              if(savedScearioId ==index)
              {
                object.selectedscenario = option;
              }

              //
            }

           // object.selectedscenario = object.selectedScenarioName[Number(savedScearioId)];

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

    });
    //chane in compare scenario dropdown
    object.commonService.getEventEmitter().on("amscenariochange", function () {
      //get selected scenario
      let scenario = object.commonService.getScenario();
      //call method to get scenario
      object.getScenarioDataById(scenario);

    });

    object.ADSharedService.getEmitter().on('newScenarioOfAMSaved', function(){
      object.getScenarioDropdown();
    });

    updateScenarioListNotificationServiceService.getEmitter().on('updateADMScenarioListAfterDeletion', function(){
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
    object.industrySizeService.setPageId(13);
    // this is used for all landing page data
    object.industrySizeService.getAMLandingData().subscribe((allData: any) => {
      object.applicationMaintenanceData = allData;
      if (object.applicationMaintenanceData != undefined && object.applicationMaintenanceData != null) {
        object.landingPageDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.landingPageDataLoaded = false;
        object.showApplicationMaintenanceData = false;
      }

      object.updateDrillDown();
      this.compareServicedeskInputData();
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "13",
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
      object.ADMefinitionData = data;
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "13",
        "pageName": "Non CIO Service Desk Tower Landing Screen",
        "errorType": "Fatal",
        "errorTitle": "web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });

    // get group definition information
    object.industrySizeService.getDefinitionDataWithoutIndustrySize().subscribe((data: any) => {
      object.AMDefinitionData = data;

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "12",
        "pageName": "Non CIO Service Desk Tower Landing Screen",
        "errorType": "Fatal",
        "errorTitle": "web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });

    //industry
    object.dropDownService.getIndustry().subscribe((data: any) => {
      object.data = {
        industries: []
      };
      
      for(let indObj of data.industries){
        if(indObj.key != "C946BACA-444F-4E5D-8FB9-94BF3457C6B8"){
          object.data.industries.push(indObj);
        }
      }
      // object.data.industries = data.industries;
      // object.selectedindustry="Grand Total";
      // object.defaultindustry="Grand Total";

      object.selectedIndustries = [];

      //set default selection
      let temp: any = {};

      temp.id = "";
      temp.key = "Grand Total";
      temp.value = "All Industries";
      object.selectedIndustries.push(temp);

      //let scanrioId = 0;
      for (let index in object.data.industries) {
        let option: any = {};

        option.id = object.data.industries[index].id;
        option.key = object.data.industries[index].key;
        option.value = object.data.industries[index].value;
        object.selectedIndustries.push(option);


      }


      object.selectedindustry = object.selectedIndustries[0];

      object.selectedindustry = object.selectedIndustries[0];
      if (object.data.industries != undefined && object.data.industries != null) {
        object.industryDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.industryDataLoaded = false;
        object.showApplicationMaintenanceData = false;
      }


    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "12",
        "pageName": "Non CIO Service Desk Tower Landing Screen",
        "errorType": "Fatal",
        "errorTitle": "web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })

    //revenue
    object.dropDownService.getRevenue().subscribe((data: any) => {
      object.data.revenue = data.revenue;
      // object.defaultsize = "All Sizes";


      object.selectedsizes = [];


      //set default selection
      let temp1: any = {};

      temp1.id = "";
      temp1.key = "Grand Total";
      temp1.value = "All Sizes";
      object.selectedsizes.push(temp1);

      for (let index in object.data.revenue) {
        let option: any = {};

        option.id = object.data.revenue[index].id;
        option.key = object.data.revenue[index].key;
        option.value = object.data.revenue[index].value;
        object.selectedsizes.push(option);


      }

      object.selectedsize = object.selectedsizes[0];
      if (object.data.revenue != undefined && object.data.revenue != null) {
        object.scaleDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.scaleDataLoaded = false;
        object.showApplicationMaintenanceData = false;
      }
      //  object.selectedsize = object.selectedsizes[0];
      // object.selectedsize = "Grand Total";
      // object.defaultsize = "Grand Total";

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "12",
        "pageName": "Header Filters",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })

    


    let valTomakePositive = "0";
    this.makePositiveValue(valTomakePositive);

    object.showApplicationMaintenanceData = true;
    //get scenario dropdown
    object.navigatedFromInput = false;
    object.navigatedFromComparison = false;
    object.getScenarioDropdown();

    //crg dropdown
    object.getCRGDropdown();


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
          "dashboardId": "13",
          "pageName": "Non CIO Service Desk Tower Landing Screen",
          "errorType": "error",
          "errorTitle": "Data Error",
          "errorDescription": error.message,
          "errorObject": error
        }

        throw errorObj;
      })
    this.compareServicedeskInputData();
    //this.showUnixData=true;

  }

  makePositiveValue(val) {
    return Math.abs(val).toFixed(2);
  }

  toggle() {
    // this.showDiv = !this.showDiv;
    this.showDiv = true;
    this.updateCompareData();
    this.compareServicedeskInputData();
  }

  costPerHourDialog() {
    this.display_costPerInstance = 'block';
    //this.showDrillDown = true;
  }


  nonEditableElm = ["AMR455","AMR460","AMR465","AMR470", "Q67070","Q67075","Q67080","Q67085"];

	replaceNullValue(sampleObj: any) {
		let obj = {};

		var requestedArrayObj = Object.keys(sampleObj).map(key => ({ key: key, value: sampleObj[key] }));

		requestedArrayObj.forEach(element => {
			if (this.nonEditableElm.includes(element.key)) {
				//do nothing
			} else if (element.value == this.NEGATIVE_CONST) {
				element.value = 0;
			}
		});


		for (let element of requestedArrayObj) {
			obj[element.key] = element.value;
		}
		return obj;

	}


  compareServicedeskInputData() {


    try {

      let object = this;

      object.personnelEquality=false;
  object.softwareEquality=false;
  object.outSourceEquality=false;
  object.costPerEmplyeeEquality=false;
  object.costPerContractorEquality=false;
  object.avgProjectSizeEquality=false;
  object.offshoreEquality=false;
  object.staffingMixEmployeeEquality=false;
  object.staffingMixContractorEquality=false;
  object.onTimeDeliveryEquality=false;
  object.onBudgetDeliveryEquality=false;
  object.pricePerHourEquality=false;
  object.costPerHourEquality=false;
  object.toolsEquality=false;
  object.saasEquality=false;
  object.erpEquality=false;
  object.cotsEquality=false;
  object.bespokeEquality=false;
  object.buildTimeEquality=false;
  object.automatedtestingEquality=false;
  object.managedServiceEquality=false;
  object.ADMADManagedEquality=false;
  object.ADMAMManagedEquality=false;
  object.ADMADEmployeeEquality=false;
  object.ADMAMEmployeeEquality=false;
  object.ADMADContractEquality=false;
  object.ADMAMContractEquality=false;
  object.appReleaseRateEquality=false;
  object.severity1Equality=false;
  object.severity2Equality=false;
  object.severity3Equality=false;
  object.severity4Equality=false;
  object.costPerSupportEquality=false;
  object.defectCloseRateEquality=false;
  object.defectsReportedApplicationEquality=false;
  object.defectsClosedApplicationEquality=false;
  object.requestedEnhancementsEquality=false;
  object.completedEnhancementsEquality=false;
  object.adCostEquality= false;
  object.amCostEquality = false;


      let storageMap = new MapSourceCodeDataValues();
      

      object.NEGATIVE_CONST = negativeConstant.NEGATIVE_CONSTANT;
      object.scenarioData = object.ADSharedService.getData().comparisionData;

      let mapdata1 = storageMap.mapData(object.scenarioData);

      object.mapdata = object.replaceNullValue(mapdata1);

      

      console.log('object.mapdata.DAD150: ',object.mapdata.DAD150);
      console.log('object.mapdata.DAD155: ',object.mapdata.DAD155);
      console.log('object.mapdata.DAD165: ',object.mapdata.DAD165);
      console.log('object.mapdata.DAD170: ',object.mapdata.DAD170);
      console.log('object.mapdata.DAM150: ',object.mapdata.DAM150);
      console.log('object.mapdata.DAM155: ',object.mapdata.DAM155);
      console.log('object.mapdata.DAM165: ',object.mapdata.DAM165);
      console.log('object.mapdata.DAM170: ',object.mapdata.DAM170);

      ///AD cost allocation 
      //( DAD150 + DAD155 + DAD165 + DAD170 ) / ( DAD150 + DAD155 + DAD165 + DAD170 + DAM150 + DAM155 + DAM165 + DAM170 )
      if(mapdata1.DAD150 == this.NEGATIVE_CONST
        && mapdata1.DAD155 == this.NEGATIVE_CONST
        && mapdata1.DAD165 == this.NEGATIVE_CONST
        && mapdata1.DAD170 == this.NEGATIVE_CONST
        && mapdata1.DAM150 == this.NEGATIVE_CONST
        && mapdata1.DAM155 == this.NEGATIVE_CONST
        && mapdata1.DAM165 == this.NEGATIVE_CONST
        && mapdata1.DAM170 == this.NEGATIVE_CONST){
          object.enterMyData.applicationDevCost = this.NEGATIVE_CONST;
        }
        /*else if(object.mapdata.DAD150 == this.NEGATIVE_CONST)
        {
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAD150 + object.mapdata.DAD155  + object.mapdata.DAD165 + object.mapdata.DAD170) / (0 + object.mapdata.DAD155  + object.mapdata.DAD165 + object.mapdata.DAD170 + object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170) )") * 100);
        }
        else if(object.mapdata.DAD155 == this.NEGATIVE_CONST)
        {
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAD150 + object.mapdata.DAD155  + object.mapdata.DAD165 + object.mapdata.DAD170) / (object.mapdata.DAD150 + 0 + object.mapdata.DAD165 + object.mapdata.DAD170 + object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170) )") * 100);
        }
        else if(object.mapdata.DAD165 == this.NEGATIVE_CONST)
        {
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAD150 + object.mapdata.DAD155  + object.mapdata.DAD165 + object.mapdata.DAD170) / (object.mapdata.DAD150 + object.mapdata.DAD155 + 0 + object.mapdata.DAD170 + object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170) )") * 100);
        }
        else if(object.mapdata.DAD170 == this.NEGATIVE_CONST)
        {
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAD150 + object.mapdata.DAD155  + object.mapdata.DAD165 + object.mapdata.DAD170) / (object.mapdata.DAD150 + object.mapdata.DAD155 + object.mapdata.DAD165 + 0 + object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170) )") * 100);
        }
        else if(object.mapdata.DAM150 == this.NEGATIVE_CONST)
        {
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAD150 + object.mapdata.DAD155  + object.mapdata.DAD165 + object.mapdata.DAD170) / (object.mapdata.DAD150 + object.mapdata.DAD155  + object.mapdata.DAD165 + object.mapdata.DAD170 + 0 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170) )") * 100);
        }
        else if(object.mapdata.DAM155 == this.NEGATIVE_CONST)
        {
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAD150 + object.mapdata.DAD155  + object.mapdata.DAD165 + object.mapdata.DAD170) / (object.mapdata.DAD150 + object.mapdata.DAD155 + object.mapdata.DAD165 + object.mapdata.DAD170 + object.mapdata.DAM150 + 0 + object.mapdata.DAM165 + object.mapdata.DAM170) )") * 100);
        }
        else if(object.mapdata.DAM165 == this.NEGATIVE_CONST)
        {
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAD150 + object.mapdata.DAD155  + object.mapdata.DAD165 + object.mapdata.DAD170) / (object.mapdata.DAD150 + object.mapdata.DAD155 + object.mapdata.DAD165 + object.mapdata.DAD170 + object.mapdata.DAM150 + object.mapdata.DAM155  + 0 + object.mapdata.DAM170) )") * 100);
        }
        else if(object.mapdata.DAM170 == this.NEGATIVE_CONST)
        {
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAD150 + object.mapdata.DAD155  + object.mapdata.DAD165 + object.mapdata.DAD170) / (object.mapdata.DAD150 + object.mapdata.DAD155 + object.mapdata.DAD165 + object.mapdata.DAD170 + object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + 0) )") * 100);
        }*/
        else{
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAD150 + object.mapdata.DAD155  + object.mapdata.DAD165 + object.mapdata.DAD170) / (object.mapdata.DAD150 + object.mapdata.DAD155  + object.mapdata.DAD165 + object.mapdata.DAD170 + object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170) )") * 100);
          object.enterMyData.applicationDevCost = Number.isNaN(object.enterMyData.applicationDevCost) ? object.NEGATIVE_CONST : object.enterMyData.applicationDevCost;
      }


      //object.enterMyData.applicationDevCost = Number.isNaN(object.enterMyData.applicationDevCost) ? object.NEGATIVE_CONST : object.enterMyData.applicationDevCost;
      
      let tempADCost = Number((object.enterMyData.applicationDevCost)).toFixed(1);
      let tempADCompareCost = Number(object.applicationMaintenanceData.data.ApplicationDevelopmentandMaintenanceCostAllocation.Development.Cost.value).toFixed(1);
      if(tempADCost == tempADCompareCost){
        object.adCostEquality = true;
      }

      //AM cost allocation
      //( DAM150 + DAM155 + DAM165 + DAM170 ) / ( DAD150 + DAD155 + DAD165 + DAD170 + DAM150 + DAM155 + DAM165 + DAM170 )
      if(mapdata1.DAD150 == this.NEGATIVE_CONST
        && mapdata1.DAD155 == this.NEGATIVE_CONST
        && mapdata1.DAD165 == this.NEGATIVE_CONST
        && mapdata1.DAD170 == this.NEGATIVE_CONST
        && mapdata1.DAM150 == this.NEGATIVE_CONST
        && mapdata1.DAM155 == this.NEGATIVE_CONST
        && mapdata1.DAM165 == this.NEGATIVE_CONST
        && mapdata1.DAM170 == this.NEGATIVE_CONST){
          object.enterMyData.applicationMaintenanceCost = this.NEGATIVE_CONST;
        }
        /*else if(object.mapdata.DAD150 == this.NEGATIVE_CONST)
        {
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170) / (0 + object.mapdata.DAD155  + object.mapdata.DAD165 + object.mapdata.DAD170 + object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170) )") * 100);
        }
        else if(object.mapdata.DAD155 == this.NEGATIVE_CONST)
        {
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170) / (object.mapdata.DAD150 + 0 + object.mapdata.DAD165 + object.mapdata.DAD170 + object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170) )") * 100);
        }
        else if(object.mapdata.DAD165 == this.NEGATIVE_CONST)
        {
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170) / (object.mapdata.DAD150 + object.mapdata.DAD155 + 0 + object.mapdata.DAD170 + object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170) )") * 100);
        }
        else if(object.mapdata.DAD170 == this.NEGATIVE_CONST)
        {
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170) / (object.mapdata.DAD150 + object.mapdata.DAD155 + object.mapdata.DAD165 + 0 + object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170) )") * 100);
        }
        else if(object.mapdata.DAM150 == this.NEGATIVE_CONST)
        {
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170) / (object.mapdata.DAD150 + object.mapdata.DAD155  + object.mapdata.DAD165 + object.mapdata.DAD170 + 0 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170) )") * 100);
        }
        else if(object.mapdata.DAM155 == this.NEGATIVE_CONST)
        {
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170) / (object.mapdata.DAD150 + object.mapdata.DAD155 + object.mapdata.DAD165 + object.mapdata.DAD170 + object.mapdata.DAM150 + 0 + object.mapdata.DAM165 + object.mapdata.DAM170) )") * 100);
        }
        else if(object.mapdata.DAM165 == this.NEGATIVE_CONST)
        {
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170) / (object.mapdata.DAD150 + object.mapdata.DAD155 + object.mapdata.DAD165 + object.mapdata.DAD170 + object.mapdata.DAM150 + object.mapdata.DAM155  + 0 + object.mapdata.DAM170) )") * 100);
        }
        else if(object.mapdata.DAM170 == this.NEGATIVE_CONST)
        {
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170) / (object.mapdata.DAD150 + object.mapdata.DAD155 + object.mapdata.DAD165 + object.mapdata.DAD170 + object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + 0) )") * 100);
        }*/
        else{
          object.enterMyData.applicationMaintenanceCost = (eval("((object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170) / (object.mapdata.DAD150 + object.mapdata.DAD155  + object.mapdata.DAD165 + object.mapdata.DAD170 + object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170) )") * 100);
          object.enterMyData.applicationMaintenanceCost = Number.isNaN(object.enterMyData.applicationMaintenanceCost) ? object.NEGATIVE_CONST : object.enterMyData.applicationMaintenanceCost;
      }

      //object.enterMyData.applicationMaintenanceCost = Number.isNaN(object.enterMyData.applicationMaintenanceCost) ? object.NEGATIVE_CONST : object.enterMyData.applicationMaintenanceCost;
      
      let tempAMCost = Number((object.enterMyData.applicationMaintenanceCost)).toFixed(1);
      let tempAMCompareCost = Number(object.applicationMaintenanceData.data.ApplicationDevelopmentandMaintenanceCostAllocation.Maintenance.Cost.value).toFixed(1);
      if(tempAMCost == tempAMCompareCost){
        object.amCostEquality = true;
      }


      
      //ADM cost allocation
      //saas
      //AMR455

      if (mapdata1.AMR455 == object.NEGATIVE_CONST) {
        object.enterMyData.saas = this.NEGATIVE_CONST;
      }
      else {
        object.enterMyData.saas = (eval("(object.mapdata.AMR455)"));
        object.enterMyData.saas = Number.isNaN(object.enterMyData.saas) ? object.NEGATIVE_CONST : object.enterMyData.saas;
      }

      //object.enterMyData.saas = Number.isNaN(object.enterMyData.saas) ? object.NEGATIVE_CONST : object.enterMyData.saas;

      let temp56 = Number((object.enterMyData.saas)).toFixed(1);
      let temp57 = Number(object.applicationMaintenanceData.data.ApplicationDevelopmentandMaintenanceCostAllocation.SaaS.SaaS.value).toFixed(1);

      if (temp56 == temp57) {
        this.saasEquality = true;
      }

      // this.enterMyData.staffingmixEmployee = 0.6322;

      if (this.enterMyData.saas == Infinity || this.enterMyData.saas == 'infinity' || this.enterMyData.saas == "Infinity" || isNaN(this.enterMyData.saas)) {
        this.enterMyData.saas = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.saas)) {
        this.enterMyData.saas = this.enterMyData.saas;
      } else {
        this.enterMyData.saas = 0;
      }

      console.log('SAAS: ', this.enterMyData.saas);

      //erp
      //AMR460

      if (mapdata1.AMR460 == object.NEGATIVE_CONST) {
        object.enterMyData.erp = this.NEGATIVE_CONST;
      }
      else {
        object.enterMyData.erp = (eval("(object.mapdata.AMR460)"));
        object.enterMyData.erp = Number.isNaN(object.enterMyData.erp) ? object.NEGATIVE_CONST : object.enterMyData.erp;
      }

      

      let temp60 = Number((object.enterMyData.erp)).toFixed(1);
      let temp61 = Number(object.applicationMaintenanceData.data.ApplicationDevelopmentandMaintenanceCostAllocation.OnPremiseBusinessSystem.OnPremiseBusinessSystem.value).toFixed(1);

      if (temp60 == temp61) {
        this.erpEquality = true;
      }


      if (this.enterMyData.erp == Infinity || this.enterMyData.erp == 'infinity' || this.enterMyData.erp == "Infinity" || isNaN(this.enterMyData.erp)) {
        this.enterMyData.erp = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.erp)) {
        this.enterMyData.erp = this.enterMyData.erp;
      } else {
        this.enterMyData.erp = 0;
      }

      //cots
      //AMR465

      if (mapdata1.AMR465 == object.NEGATIVE_CONST) {
        object.enterMyData.cots = this.NEGATIVE_CONST;
      }
      else {
        object.enterMyData.cots = (eval("(object.mapdata.AMR465)"));
        object.enterMyData.cots = Number.isNaN(object.enterMyData.cots) ? object.NEGATIVE_CONST : object.enterMyData.cots;
      }

      let temp58 = Number((object.enterMyData.cots)).toFixed(1);
      let temp59 = Number(object.applicationMaintenanceData.data.ApplicationDevelopmentandMaintenanceCostAllocation.COTS.COTS.value).toFixed(1);

      if (temp58 == temp59) {
        this.cotsEquality = true;
      }

      // this.enterMyData.staffingmixEmployee = 0.6322;

      if (this.enterMyData.cots == Infinity || this.enterMyData.cots == 'infinity' || this.enterMyData.cots == "Infinity" || isNaN(this.enterMyData.cots)) {
        this.enterMyData.cots = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.cots)) {
        this.enterMyData.cots = this.enterMyData.cots;
      } else {
        this.enterMyData.cots = 0;
      }

      //bespoke
      //AMR470

      if (mapdata1.AMR470 == object.NEGATIVE_CONST) {
        object.enterMyData.bespoke = this.NEGATIVE_CONST;
      }
      else {
        object.enterMyData.bespoke = (eval("(object.mapdata.AMR470)"));
        object.enterMyData.bespoke = Number.isNaN(object.enterMyData.bespoke) ? object.NEGATIVE_CONST : object.enterMyData.bespoke;
      }

      let temp62 = Number((object.enterMyData.bespoke)).toFixed(1);
      let temp63 = Number(object.applicationMaintenanceData.data.ApplicationDevelopmentandMaintenanceCostAllocation.Bespoke.Bespoke.value).toFixed(1);

      if (temp62 == temp63) {
        this.bespokeEquality = true;
      }

      if (this.enterMyData.bespoke == Infinity || this.enterMyData.bespoke == 'infinity' || this.enterMyData.bespoke == "Infinity" || isNaN(this.enterMyData.bespoke)) {
        this.enterMyData.bespoke = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.bespoke)) {
        this.enterMyData.bespoke = this.enterMyData.bespoke;
      } else {
        this.enterMyData.bespoke = 0;
      }

      console.log('bespoke over');

      //AM cost allocation
      //personnel
      //( DAM150 + DAM155 ) / ( DAM150 + DAM155 + DAM165 + DAM170 )


      if (mapdata1.DAM150 == this.NEGATIVE_CONST
        && mapdata1.DAM155 == this.NEGATIVE_CONST
        && mapdata1.DAM165 == this.NEGATIVE_CONST
        && mapdata1.DAM170 == this.NEGATIVE_CONST) {
        object.enterMyData.costAllocationPersonnel = this.NEGATIVE_CONST;
      }
      /*else if(object.mapdata.DAM150 == this.NEGATIVE_CONST)
        {
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAM150 + object.mapdata.DAM155) / (0 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170) )") * 100);
        }
        else if(object.mapdata.DAM155 == this.NEGATIVE_CONST)
        {
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAM150 + object.mapdata.DAM155) / (object.mapdata.DAM150 + 0 + object.mapdata.DAM165 + object.mapdata.DAM170) )") * 100);
        }
        else if(object.mapdata.DAM165 == this.NEGATIVE_CONST)
        {
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAM150 + object.mapdata.DAM155) / (object.mapdata.DAM150 + object.mapdata.DAM155  + 0 + object.mapdata.DAM170) )") * 100);
        }
        else if(object.mapdata.DAM170 == this.NEGATIVE_CONST)
        {
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAM150 + object.mapdata.DAM155) / (object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + 0) )") * 100);
        }*/
      else {
        object.enterMyData.costAllocationPersonnel = (eval("(object.mapdata.DAM150 + object.mapdata.DAM155) / (object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170 )") * 100);
        object.enterMyData.costAllocationPersonnel = Number.isNaN(object.enterMyData.costAllocationPersonnel) ? object.NEGATIVE_CONST : object.enterMyData.costAllocationPersonnel;  
      }

      
      console.log(object.enterMyData.costAllocationPersonnel);
      
      let temp50 = Number((object.enterMyData.costAllocationPersonnel)).toFixed(1);
      let temp51 = Number(object.applicationMaintenanceData.data.ApplicationMaintenanceCostAllocation.CostAllocationEmp.Number.value).toFixed(1);

      if (temp50 == temp51) {
        this.personnelEquality = true;
      }

      // this.enterMyData.staffingmixEmployee = 0.6322;

      if (this.enterMyData.costAllocationPersonnel == Infinity 
        || this.enterMyData.costAllocationPersonnel == 'infinity' 
        || this.enterMyData.costAllocationPersonnel == "Infinity" 
        || isNaN(this.enterMyData.costAllocationPersonnel)) {
        this.enterMyData.costAllocationPersonnel = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.costAllocationPersonnel)) {
        this.enterMyData.costAllocationPersonnel = this.enterMyData.costAllocationPersonnel;
      } else {
        this.enterMyData.costAllocationPersonnel = 0;
      }


      //outsourcing
      //( DAM170 ) / ( DAM150 + DAM155 + DAM165 + DAM170 )


      if (mapdata1.DAM150 == this.NEGATIVE_CONST
        && mapdata1.DAM155 == this.NEGATIVE_CONST
        && mapdata1.DAM165 == this.NEGATIVE_CONST
        && mapdata1.DAM170 == this.NEGATIVE_CONST) {
        object.enterMyData.costAllocationOutsource = this.NEGATIVE_CONST;
      }
      /*else if(object.mapdata.DAM150 == this.NEGATIVE_CONST)
        {
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAM170) / (0 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170) )") * 100);
        }
        else if(object.mapdata.DAM155 == this.NEGATIVE_CONST)
        {
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAM170) / (object.mapdata.DAM150 + 0 + object.mapdata.DAM165 + object.mapdata.DAM170) )") * 100);
        }
        else if(object.mapdata.DAM165 == this.NEGATIVE_CONST)
        {
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAM170) / (object.mapdata.DAM150 + object.mapdata.DAM155  + 0 + object.mapdata.DAM170) )") * 100);
        }
        else if(object.mapdata.DAM170 == this.NEGATIVE_CONST)
        {
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAM170) / (object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + 0) )") * 100);
        }
      */
      else {
        object.enterMyData.costAllocationOutsource = (eval("((object.mapdata.DAM170) / (object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170) )") * 100);
        object.enterMyData.costAllocationOutsource = Number.isNaN(object.enterMyData.costAllocationOutsource) ? object.NEGATIVE_CONST : object.enterMyData.costAllocationOutsource;  
      }

      

      let temp52 = Number((object.enterMyData.costAllocationOutsource)).toFixed(1);
      let temp53 = Number(object.applicationMaintenanceData.data.ApplicationMaintenanceCostAllocation.CostAllocationOS.Number.value).toFixed(1);

      if (temp52 == temp53) {
        this.outSourceEquality = true;
      }

      // this.enterMyData.staffingmixEmployee = 0.6322;

      if (this.enterMyData.costAllocationOutsource == Infinity 
        || this.enterMyData.costAllocationOutsource == 'infinity' 
        || this.enterMyData.costAllocationOutsource == "Infinity" 
        || isNaN(this.enterMyData.costAllocationOutsource)) {
        this.enterMyData.costAllocationOutsource = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.costAllocationOutsource)) {
        this.enterMyData.costAllocationOutsource = this.enterMyData.costAllocationOutsource;
      } else {
        this.enterMyData.costAllocationOutsource = 0;
      }

      //tools
      //( DAM165 ) / ( DAM150 + DAM155 + DAM165 + DAM170 )

      if (mapdata1.DAM150 == this.NEGATIVE_CONST
        && mapdata1.DAM155 == this.NEGATIVE_CONST
        && mapdata1.DAM165 == this.NEGATIVE_CONST
        && mapdata1.DAM170 == this.NEGATIVE_CONST) {
        object.enterMyData.costAllocationTools = this.NEGATIVE_CONST;
      }
      /*else if(object.mapdata.DAM150 == this.NEGATIVE_CONST)
        {
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAM165) / (0 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170) )") * 100);
        }
        else if(object.mapdata.DAM155 == this.NEGATIVE_CONST)
        {
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAM165) / (object.mapdata.DAM150 + 0 + object.mapdata.DAM165 + object.mapdata.DAM170) )") * 100);
        }
        else if(object.mapdata.DAM165 == this.NEGATIVE_CONST)
        {
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAM165) / (object.mapdata.DAM150 + object.mapdata.DAM155  + 0 + object.mapdata.DAM170) )") * 100);
        }
        else if(object.mapdata.DAM170 == this.NEGATIVE_CONST)
        {
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAM165) / (object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + 0) )") * 100);
        }
      */
      else {
        object.enterMyData.costAllocationTools = (eval("((object.mapdata.DAM165) / (object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170) )") * 100);
        object.enterMyData.costAllocationTools = Number.isNaN(object.enterMyData.costAllocationTools) ? object.NEGATIVE_CONST : object.enterMyData.costAllocationTools;   
      }

     

      let temp54 = Number((object.enterMyData.costAllocationTools)).toFixed(1);
      let temp55 = Number(object.applicationMaintenanceData.data.ApplicationMaintenanceCostAllocation.CostAllocationSW.Number.value).toFixed(1);

      if (temp54 == temp55) {
        this.toolsEquality = true;
      }

      // this.enterMyData.staffingmixEmployee = 0.6322;

      if (this.enterMyData.costAllocationTools == Infinity 
        || this.enterMyData.costAllocationTools == 'infinity' 
        || this.enterMyData.costAllocationTools == "Infinity" 
        || isNaN(this.enterMyData.costAllocationTools)) {
        this.enterMyData.costAllocationTools = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.costAllocationTools)) {
        this.enterMyData.costAllocationTools = this.enterMyData.costAllocationTools;
      } else {
        this.enterMyData.costAllocationTools = 0;
      }


      //annual cost FTE employee
      //DAM150 / EAM010

      if (mapdata1.DAM150 == this.NEGATIVE_CONST 
        && mapdata1.EAM010 == this.NEGATIVE_CONST) {
        this.enterMyData.FTEEmployee = this.NEGATIVE_CONST;
      }
      /*else if (object.mapdata.DAM150 == this.NEGATIVE_CONST) {
        this.enterMyData.FTEEmployee = 0;
      }
      else if (object.mapdata.EAM010 == this.NEGATIVE_CONST) {
        this.enterMyData.FTEEmployee = this.NEGATIVE_CONST;
      }*/
      else {
        this.enterMyData.FTEEmployee = eval("(object.mapdata.DAM150) / (object.mapdata.EAM010)");
        object.enterMyData.FTEEmployee = Number.isNaN(object.enterMyData.FTEEmployee) ? object.NEGATIVE_CONST : object.enterMyData.FTEEmployee;
      }

      

      console.log('FTE employee 1: ',this.enterMyData.FTEEmployee);

      let temp15 = Math.round((this.enterMyData.FTEEmployee));
      let temp16 = Math.round((this.applicationMaintenanceData.data.AnnualCostPerApplicationMaintenanceFTE.CostPerEmployee.Number.value));

      if (temp15 == temp16) {
        this.costPerEmplyeeEquality = true;
      }

      console.log('FTE employee equality: ',this.costPerEmplyeeEquality);

      // this.enterMyData.staffingmixEmployee = 0.6322;

      if (this.enterMyData.FTEEmployee == Infinity 
        || this.enterMyData.FTEEmployee == 'infinity' 
        || this.enterMyData.FTEEmployee == "Infinity" 
        || isNaN(this.enterMyData.FTEEmployee)) {
        this.enterMyData.FTEEmployee = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.FTEEmployee)) {
        this.enterMyData.FTEEmployee = this.enterMyData.FTEEmployee;
      } else {
        this.enterMyData.FTEEmployee = 0;
      }

      console.log('FTE employee: ',this.enterMyData.FTEEmployee);

      //annual cost FTE contractor
      //DAM155 / EAM020

      if (mapdata1.DAM155 == this.NEGATIVE_CONST 
        && mapdata1.EAM020 == this.NEGATIVE_CONST) {
        this.enterMyData.FTEContractor = this.NEGATIVE_CONST;
      }
      /*else if (object.mapdata.DAM155 == this.NEGATIVE_CONST) {
        this.enterMyData.FTEContractor = 0;
      }
      else if (object.mapdata.DAM155 == this.NEGATIVE_CONST) {
        this.enterMyData.FTEContractor = this.NEGATIVE_CONST;
      }*/
      else {
        this.enterMyData.FTEContractor = eval("(object.mapdata.DAM155) / (object.mapdata.EAM020)");
        object.enterMyData.FTEContractor = Number.isNaN(object.enterMyData.FTEContractor) ? object.NEGATIVE_CONST : object.enterMyData.FTEContractor;      
      }


      let temp17 = Math.round((this.enterMyData.FTEContractor));
      let temp18 = Math.round((this.applicationMaintenanceData.data.AnnualCostPerApplicationMaintenanceFTE.CostPerContractor.Number.value));

      if (temp17 == temp18) {
        this.costPerContractorEquality = true;
      }


      // this.enterMyData.staffingmixEmployee = 0.6322;

      if (this.enterMyData.FTEContractor == Infinity 
        || this.enterMyData.FTEContractor == 'infinity' 
        || this.enterMyData.FTEContractor == "Infinity" 
        || isNaN(this.enterMyData.FTEContractor)) {
        this.enterMyData.FTEContractor = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.FTEContractor)) {
        this.enterMyData.FTEContractor = this.enterMyData.FTEContractor;
      } else {
        this.enterMyData.FTEContractor = 0;
      }

      //AM cost per hour worked
      // ( DAM150 + DAM155 + DAM170) / Q31090


      if (mapdata1.DAM150 == this.NEGATIVE_CONST 
        && mapdata1.DAM155 == this.NEGATIVE_CONST 
        && mapdata1.DAM170 == this.NEGATIVE_CONST 
        && mapdata1.Q31090 == this.NEGATIVE_CONST) {
        this.enterMyData.costperhour = this.NEGATIVE_CONST;
      }
      /*else if(object.mapdata.Q31090 == this.NEGATIVE_CONST){
        this.enterMyData.costperhour = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.DAM150 != this.NEGATIVE_CONST && object.mapdata.DAM155 == this.NEGATIVE_CONST && object.mapdata.DAM170 == this.NEGATIVE_CONST) {
        this.enterMyData.costperhour = eval("(object.mapdata.DAM150) / (object.mapdata.Q31090)");
      }
      else if (object.mapdata.DAM150 == this.NEGATIVE_CONST && object.mapdata.DAM155 != this.NEGATIVE_CONST && object.mapdata.DAM170 == this.NEGATIVE_CONST) {
        this.enterMyData.costperhour = eval("(object.mapdata.DAM155) / (object.mapdata.Q31090)");
      }
      else if (object.mapdata.DAM150 == this.NEGATIVE_CONST && object.mapdata.DAM155 == this.NEGATIVE_CONST && object.mapdata.DAM170 != this.NEGATIVE_CONST) {
        this.enterMyData.costperhour = eval("(object.mapdata.DAM170) / (object.mapdata.Q31090)");
      }
      else if (object.mapdata.DAM150 == this.NEGATIVE_CONST && object.mapdata.DAM155 != this.NEGATIVE_CONST && object.mapdata.DAM170 != this.NEGATIVE_CONST) {
        this.enterMyData.costperhour = eval("(object.mapdata.DAM155 + object.mapdata.DAM170) / (object.mapdata.Q31090)");
      }
      else if (object.mapdata.DAM150 != this.NEGATIVE_CONST && object.mapdata.DAM155 != this.NEGATIVE_CONST && object.mapdata.DAM170 == this.NEGATIVE_CONST) {
        this.enterMyData.costperhour = eval("(object.mapdata.DAM150 + object.mapdata.DAM155) / (object.mapdata.Q31090)");
      }
      else if (object.mapdata.DAM150 != this.NEGATIVE_CONST && object.mapdata.DAM155 == this.NEGATIVE_CONST && object.mapdata.DAM170 != this.NEGATIVE_CONST) {
        this.enterMyData.costperhour = eval("(object.mapdata.DAM150 + object.mapdata.DAM170) / (object.mapdata.Q31090)");
      }*/
      else {
        this.enterMyData.costperhour = eval("(object.mapdata.DAM150 + object.mapdata.DAM155 + object.mapdata.DAM170) / (object.mapdata.Q31090)");
        object.enterMyData.costperhour = Number.isNaN(object.enterMyData.costperhour) ? object.NEGATIVE_CONST : object.enterMyData.costperhour;      
      }


      let temp36 = Math.round(this.enterMyData.costperhour);
      let temp37 = Math.round(Number(object.applicationMaintenanceData.data.CostPerHourWorked.CostPerHour.NumberCY.value));


      if (temp36 == temp37) {
        this.costPerHourEquality = true;
      }

      if (this.enterMyData.costperhour == Infinity 
        || this.enterMyData.costperhour == 'infinity' 
        || this.enterMyData.costperhour == "Infinity" 
        || isNaN(this.enterMyData.costperhour)) {
        this.enterMyData.costperhour = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.costperhour)) {
        this.enterMyData.costperhour = this.enterMyData.costperhour;
      } else {
        this.enterMyData.costperhour = 0;
      }

      // //price per hour worked
      // // ( DAM150 + DAM155 + DAM170) / Q31090


      if (mapdata1.DAM150 == this.NEGATIVE_CONST
        && mapdata1.DAM155 == this.NEGATIVE_CONST
        && mapdata1.DAM170 == this.NEGATIVE_CONST
        && mapdata1.Q31090 == this.NEGATIVE_CONST) {
        this.enterMyData.priceperhour = this.NEGATIVE_CONST;
      }
      /*else if (object.mapdata.DAM150 == this.NEGATIVE_CONST) {
        this.enterMyData.priceperhour = eval("(object.mapdata.DAM155) / (object.mapdata.Q31090)");
      }
      else if (object.mapdata.DAM155 == this.NEGATIVE_CONST) {
        this.enterMyData.priceperhour = eval("(object.mapdata.DAM150) / (object.mapdata.Q31090)");
      }
      else if (object.mapdata.P21090 == this.NEGATIVE_CONST) {
        this.enterMyData.priceperhour = this.NEGATIVE_CONST;
      }*/
      else {
        this.enterMyData.priceperhour = eval("(object.mapdata.DAM150 + object.mapdata.DAM155 + object.mapdata.DAM170) / (object.mapdata.Q31090)");
        object.enterMyData.priceperhour = Number.isNaN(object.enterMyData.priceperhour) ? object.NEGATIVE_CONST : object.enterMyData.priceperhour;      
      }

     
      let temp38 = Math.round(this.enterMyData.priceperhour);
      let temp39 = Math.round(Number(object.applicationMaintenanceData.data.CostPerHourWorked.PricePerHour.NumberCY.value));


      if (temp38 == temp39) {
        this.pricePerHourEquality = true;
      }

      if (this.enterMyData.priceperhour == Infinity
        || this.enterMyData.priceperhour == 'infinity'
        || this.enterMyData.priceperhour == "Infinity"
        || isNaN(this.enterMyData.priceperhour)) {
        this.enterMyData.priceperhour = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.priceperhour)) {
        this.enterMyData.priceperhour = this.enterMyData.priceperhour;
      } else {
        this.enterMyData.priceperhour = 0;
      }

//cost per support contact
// (( ( DAM150 + DAM155 ) / Q31090 ) * Q3R010) / Q37000
      //( ( DAM150 / EAM010 ) / Q31090 ) * Q3R010 / Q37000
      //let calc = eval("((object.mapdata.DAM150)/Q31090) + object.mapdata.DAM155) * (object.mapdata.Q3R010/object.mapdata.Q37000))");

      if (mapdata1.DAM150 == object.NEGATIVE_CONST
        && mapdata1.DAM155 == object.NEGATIVE_CONST
        && mapdata1.DAM170 == object.NEGATIVE_CONST
        && mapdata1.Q31090 == object.NEGATIVE_CONST
        && mapdata1.Q3R010 == object.NEGATIVE_CONST
        && mapdata1.Q37000 == object.NEGATIVE_CONST) {
        object.enterMyData.costPerSupportContact = object.NEGATIVE_CONST;
      }
      else {
        object.enterMyData.costPerSupportContact = eval("((((object.mapdata.DAM150 + object.mapdata.DAM155 + object.mapdata.DAM170) /object.mapdata.Q31090 )* object.mapdata.Q3R010)/object.mapdata.Q37000)");
        object.enterMyData.costPerSupportContact = Number.isNaN(object.enterMyData.costPerSupportContact) ? this.NEGATIVE_CONST : object.enterMyData.costPerSupportContact;
      }

      

      let temp40 = Math.round(object.enterMyData.costPerSupportContact);
      let temp41 = Math.round(Number(object.applicationMaintenanceData.data.CostPerSupportContact.CostPerContact.Number.value));


      if (temp40 == temp41) {
        object.costPerSupportEquality = true;
      }

      if (object.enterMyData.costPerSupportContact == Infinity
        || object.enterMyData.costPerSupportContact == 'infinity'
        || object.enterMyData.costPerSupportContact == "Infinity"
        || isNaN(object.enterMyData.costPerSupportContact)) {
        object.enterMyData.costPerSupportContact = object.NEGATIVE_CONST;
      } else if (Number(object.enterMyData.costPerSupportContact)) {
        object.enterMyData.costPerSupportContact = object.enterMyData.costPerSupportContact;
      } else {
        object.enterMyData.costPerSupportContact = 0;
      }

 // //offshore
      // //( Q31005 + Q31025 ) / Q31090

      if (mapdata1.Q31005 == this.NEGATIVE_CONST
        && mapdata1.Q31025 == this.NEGATIVE_CONST
        && mapdata1.Q31090 == this.NEGATIVE_CONST) {
        this.enterMyData.offshore = this.NEGATIVE_CONST;
      }
      /*else if (object.mapdata.Q31005 == this.NEGATIVE_CONST) {
        this.enterMyData.offshore = eval("(0 + object.mapdata.Q31025) / (object.mapdata.Q31090)");
      }
      else if (object.mapdata.Q31025 == this.NEGATIVE_CONST) {
        this.enterMyData.offshore = eval("(0 + object.mapdata.Q31005) / (object.mapdata.Q31090)");
      }
      else if (object.mapdata.Q31090 == this.NEGATIVE_CONST) {
        this.enterMyData.offshore = this.NEGATIVE_CONST;
      }*/
      else {
        this.enterMyData.offshore = eval("(object.mapdata.Q31005 + object.mapdata.Q31025) / (object.mapdata.Q31090)");
        object.enterMyData.offshore = Number.isNaN(object.enterMyData.offshore) ? this.NEGATIVE_CONST : object.enterMyData.offshore;
      }

      

      let temp93 = Number((this.enterMyData.offshore * 100)).toFixed(1);
      let temp94 = Number((this.applicationMaintenanceData.data.Offshore.Offshore.Number.value)).toFixed(1);

      if (temp93 == temp94) {
        this.offshoreEquality = true;
      }

      if (this.enterMyData.offshore == Infinity
        || this.enterMyData.offshore == 'infinity'
        || this.enterMyData.offshore == "Infinity"
        || isNaN(this.enterMyData.offshore)) {
        this.enterMyData.offshore = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.offshore)) {
        this.enterMyData.offshore = this.enterMyData.offshore;
      } else {
        this.enterMyData.offshore = 0;
      }

      //staffing mix
      // staffing mix employee
      //EAM010 / ( EAM010 + EAM020 + EAM030 )

      if (mapdata1.EAM010 == this.NEGATIVE_CONST
        && mapdata1.EAM020 == this.NEGATIVE_CONST
        && mapdata1.EAM030 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixEmployee = this.NEGATIVE_CONST;
      }
      /*else if (object.mapdata.EAM010 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixEmployee = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.EAM020 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixEmployee = eval("object.mapdata.EAM010 / (object.mapdata.EAM010 +object.mapdata.EAM030 + 0)");
      }
      else if (object.mapdata.EAM030 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixEmployee = eval("object.mapdata.EAM010 / (object.mapdata.EAM010 +object.mapdata.EAM020 + 0)");
      }*/
      else {
        this.enterMyData.staffingmixEmployee = eval("object.mapdata.EAM010 / (object.mapdata.EAM010 + object.mapdata.EAM020 + object.mapdata.EAM030)");
        object.enterMyData.staffingmixEmployee = Number.isNaN(object.enterMyData.staffingmixEmployee) ? this.NEGATIVE_CONST : object.enterMyData.staffingmixEmployee;
      }

      

      let temp100 = Number((this.enterMyData.staffingmixEmployee * 100)).toFixed(1);
      let temp101 = Number((this.applicationMaintenanceData.data.StaffingMix.StaffingMixEmployee.Number.value)).toFixed(1);

      if (temp100 == temp101) {
        this.staffingMixEmployeeEquality = true;
      }

      // this.enterMyData.staffingmixEmployee = 0.6322;

      if (this.enterMyData.staffingmixEmployee == Infinity 
        || this.enterMyData.staffingmixEmployee == 'infinity' 
        || this.enterMyData.staffingmixEmployee == "Infinity" 
        || isNaN(this.enterMyData.staffingmixEmployee)) {
        this.enterMyData.staffingmixEmployee = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.staffingmixEmployee)) {
        this.enterMyData.staffingmixEmployee = this.enterMyData.staffingmixEmployee;
      } else {
        this.enterMyData.staffingmixEmployee = 0;
      }

      //contractor
      // EAD020 / (EAD010+EAD020)
      //EAM020 / ( EAM010 + EAM020 + EAM030 )

      //in case of null or empty value
      if (mapdata1.EAM010 == this.NEGATIVE_CONST
        && mapdata1.EAM020 == this.NEGATIVE_CONST
        && mapdata1.EAM030 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixContract = this.NEGATIVE_CONST;
      }
     /* else if (object.mapdata.EAM020 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixContract = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.EAM010 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixContract = eval("object.mapdata.EAM020 / (object.mapdata.EAM020 +object.mapdata.EAM030 + 0)");
      }
      else if (object.mapdata.EAM030 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixContract = eval("object.mapdata.EAM020 / (object.mapdata.EAM010 +object.mapdata.EAM020 + 0)");
      }*/
      else {
        this.enterMyData.staffingmixContract = eval("object.mapdata.EAM020 / (object.mapdata.EAM010 + object.mapdata.EAM020 + object.mapdata.EAM030)");
        object.enterMyData.staffingmixContract = Number.isNaN(object.enterMyData.staffingmixContract) ? this.NEGATIVE_CONST : object.enterMyData.staffingmixContract;
      }

      

      let enterContract = (Number(this.enterMyData.staffingmixContract) * 100).toFixed(1);
      let userContract = Number(this.applicationMaintenanceData.data.StaffingMix.StaffingMixContractor.Number.value).toFixed(1);

      if (enterContract == userContract) {
        this.staffingMixContractorEquality = true;
      }

      // this.enterMyData.staffingmixContract = 0.3678;

      if (this.enterMyData.staffingmixContract == Infinity 
        || this.enterMyData.staffingmixContract == 'infinity' 
        || this.enterMyData.staffingmixContract == "Infinity" 
        || isNaN(this.enterMyData.staffingmixContract)) {
        this.enterMyData.staffingmixContract = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.staffingmixContract)) {
        this.enterMyData.staffingmixContract = this.enterMyData.staffingmixContract;
      } else {
        this.enterMyData.staffingmixContract = 0;
      }

      //staffing mix managed services
      //EAM030 / ( EAM010 + EAM020 + EAM030 )


      if (mapdata1.EAM010 == this.NEGATIVE_CONST
        && mapdata1.EAM020 == this.NEGATIVE_CONST
        && mapdata1.EAM030 == this.NEGATIVE_CONST) {
        this.enterMyData.managedServices = this.NEGATIVE_CONST;
      }
      /*else if (object.mapdata.EAM030 == this.NEGATIVE_CONST) {
        this.enterMyData.managedServices = this.NEGATIVE_CONST;
      }
      else if (object.mapdata.EAM010 == this.NEGATIVE_CONST) {
        this.enterMyData.managedServices = eval("object.mapdata.EAM030 / (object.mapdata.EAM020 +object.mapdata.EAM030 + 0)");
      }
      else if (object.mapdata.EAM020 == this.NEGATIVE_CONST) {
        this.enterMyData.managedServices = eval("object.mapdata.EAM030 / (object.mapdata.EAM010 +object.mapdata.EAM030 + 0)");
      }*/
      else {
        this.enterMyData.managedServices = eval("object.mapdata.EAM030 / (object.mapdata.EAM010 + object.mapdata.EAM020 + object.mapdata.EAM030)");
        object.enterMyData.managedServices = Number.isNaN(object.enterMyData.managedServices) ? this.NEGATIVE_CONST : object.enterMyData.managedServices;
      }

      

      let temp68 = Number((this.enterMyData.managedServices * 100)).toFixed(1);
      let temp69 = Number((this.applicationMaintenanceData.data.StaffingMix.StaffingMixManagedServices.Number.value)).toFixed(1);

      if (temp68 == temp69) {
        this.managedServiceEquality = true;
      }

      // this.enterMyData.managedServices = 0.6322;

      if (this.enterMyData.managedServices == Infinity 
        || this.enterMyData.managedServices == 'infinity' 
        || this.enterMyData.managedServices == "Infinity" 
        || isNaN(this.enterMyData.managedServices)) {
        this.enterMyData.managedServices = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.managedServices)) {
        this.enterMyData.managedServices = this.enterMyData.managedServices;
      } else {
        this.enterMyData.managedServices = 0;
      }

      //enhancements completed
      //Q78120 / AMR300

      if (mapdata1.Q78120 == this.NEGATIVE_CONST
        && mapdata1.AMR300 == this.NEGATIVE_CONST) {
        this.enterMyData.completdEnhancements = this.NEGATIVE_CONST;
      }
      else {
        this.enterMyData.completdEnhancements = eval("(object.mapdata.Q78120) / (object.mapdata.AMR300)");
        object.enterMyData.completdEnhancements = Number.isNaN(object.enterMyData.completdEnhancements) ? this.NEGATIVE_CONST : object.enterMyData.completdEnhancements;
      }

      

      let temp90 = (Number(this.enterMyData.completdEnhancements)).toFixed(1);
      let temp91 = (Number(object.applicationMaintenanceData.data.EnhancementsPerApplication.EnhancementsCompletedPerApplication.Number.value)).toFixed(1);


      if (temp90 == temp91) {
        this.completedEnhancementsEquality = true;
      }

      if (this.enterMyData.completdEnhancements == Infinity
        || this.enterMyData.completdEnhancements == 'infinity'
        || this.enterMyData.completdEnhancements == "Infinity"
        || isNaN(this.enterMyData.completdEnhancements)) {
        this.enterMyData.completdEnhancements = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.completdEnhancements)) {
        this.enterMyData.completdEnhancements = this.enterMyData.completdEnhancements;
      } else {
        this.enterMyData.completdEnhancements = 0;
      }

      //application defect severity
      //severity1
      //Q67070

      if (mapdata1.Q67070 == object.NEGATIVE_CONST) {
        object.enterMyData.severity1Defect = this.NEGATIVE_CONST;
      }
      else {
        object.enterMyData.severity1Defect = (eval("(object.mapdata.Q67070)"));
        object.enterMyData.severity1Defect = Number.isNaN(object.enterMyData.severity1Defect) ? object.NEGATIVE_CONST : object.enterMyData.severity1Defect;
      }

      let temp6 = Number((object.enterMyData.severity1Defect)).toFixed(1);
      let temp7 = Number(object.applicationMaintenanceData.data.ApplicationDefectSeverity.S1Defect.S1Defect.value).toFixed(1);

      if (temp6 == temp7) {
        this.severity1Equality = true;
      }

      // this.enterMyData.staffingmixEmployee = 0.6322;

      if (this.enterMyData.severity1Defect == Infinity || this.enterMyData.severity1Defect == 'infinity' || this.enterMyData.severity1Defect == "Infinity" || isNaN(this.enterMyData.severity1Defect)) {
        this.enterMyData.severity1Defect = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.severity1Defect)) {
        this.enterMyData.severity1Defect = this.enterMyData.severity1Defect;
      } else {
        this.enterMyData.severity1Defect = 0;
      }

      //severity2
      //Q67075

      if (mapdata1.Q67075 == object.NEGATIVE_CONST) {
        object.enterMyData.severity2Defect = this.NEGATIVE_CONST;
      }
      else {
        object.enterMyData.severity2Defect = (eval("(object.mapdata.Q67075)"));
        object.enterMyData.severity2Defect = Number.isNaN(object.enterMyData.severity2Defect) ? object.NEGATIVE_CONST : object.enterMyData.severity2Defect;
      }

      let temp8 = Number((object.enterMyData.severity2Defect)).toFixed(1);
      let temp9 = Number(object.applicationMaintenanceData.data.ApplicationDefectSeverity.S2Defect.S2Defect.value).toFixed(1);

      if (temp8 == temp9) {
        this.severity2Equality = true;
      }


      if (this.enterMyData.severity2Defect == Infinity 
        || this.enterMyData.severity2Defect == 'infinity' 
        || this.enterMyData.severity2Defect == "Infinity" 
        || isNaN(this.enterMyData.severity2Defect)) {
        this.enterMyData.severity2Defect = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.severity2Defect)) {
        this.enterMyData.severity2Defect = this.enterMyData.severity2Defect;
      } else {
        this.enterMyData.severity2Defect = 0;
      }

      //severity3
      //Q67080

      if (mapdata1.Q67080 == object.NEGATIVE_CONST) {
        object.enterMyData.severity3Defect = this.NEGATIVE_CONST;
      }
      else {
        object.enterMyData.severity3Defect = (eval("(object.mapdata.Q67080)"));
        object.enterMyData.severity3Defect = Number.isNaN(object.enterMyData.severity3Defect) ? object.NEGATIVE_CONST : object.enterMyData.severity3Defect;
      }

      let temp10 = Number((object.enterMyData.severity3Defect)).toFixed(1);
      let temp11 = Number(object.applicationMaintenanceData.data.ApplicationDefectSeverity.S3Defect.S3Defect.value).toFixed(1);

      if (temp10 == temp11) {
        this.severity3Equality = true;
      }

      // this.enterMyData.staffingmixEmployee = 0.6322;

      if (this.enterMyData.severity3Defect == Infinity 
        || this.enterMyData.severity3Defect == 'infinity' 
        || this.enterMyData.severity3Defect == "Infinity" 
        || isNaN(this.enterMyData.severity3Defect)) {
        this.enterMyData.severity3Defect = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.severity3Defect)) {
        this.enterMyData.severity3Defect = this.enterMyData.severity3Defect;
      } else {
        this.enterMyData.severity3Defect = 0;
      }


      //severity4
      //Q67085

      if (mapdata1.Q67085 == object.NEGATIVE_CONST) {
        object.enterMyData.severity4Defect = this.NEGATIVE_CONST;
      }
      else {
        object.enterMyData.severity4Defect = (eval("(object.mapdata.Q67085)"));
        object.enterMyData.severity4Defect = Number.isNaN(object.enterMyData.severity4Defect) ? object.NEGATIVE_CONST : object.enterMyData.severity4Defect;
      }

      let temp12 = Number((object.enterMyData.severity4Defect)).toFixed(1);
      let temp13 = Number(object.applicationMaintenanceData.data.ApplicationDefectSeverity.S4Defect.S4Defect.value).toFixed(1);

      if (temp12 == temp13) {
        this.severity4Equality = true;
      }

      if (this.enterMyData.severity4Defect == Infinity 
        || this.enterMyData.severity4Defect == 'infinity' 
        || this.enterMyData.severity4Defect == "Infinity" 
        || isNaN(this.enterMyData.severity4Defect)) {
        this.enterMyData.severity4Defect = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.severity4Defect)) {
        this.enterMyData.severity4Defect = this.enterMyData.severity4Defect;
      } else {
        this.enterMyData.severity4Defect = 0;
      }

      
      
      
      //defect close rate
      //Q67110 / Q67010

      if (mapdata1.Q67110 == object.NEGATIVE_CONST
        && mapdata1.Q67010 == object.NEGATIVE_CONST) {
        object.enterMyData.defectCloseRate = object.NEGATIVE_CONST;
      } else {
        object.enterMyData.defectCloseRate = eval("(object.mapdata.Q67110/object.mapdata.Q67010)");
        object.enterMyData.defectCloseRate = Number.isNaN(object.enterMyData.defectCloseRate) ? object.NEGATIVE_CONST : object.enterMyData.defectCloseRate;
      }

      

      let temp42 = Math.round(Number(object.enterMyData.defectCloseRate * 100));
      let temp43 = Math.round(Number(object.applicationMaintenanceData.data.DefectCloseRate.DefectCloseRate.Number.value));


      if (temp42 == temp43) {
        object.defectCloseRateEquality = true;
      }

      if (object.enterMyData.defectCloseRate == Infinity
        || object.enterMyData.defectCloseRate == 'infinity'
        || object.enterMyData.defectCloseRate == "Infinity"
        || isNaN(object.enterMyData.defectCloseRate)) {
        object.enterMyData.defectCloseRate = object.NEGATIVE_CONST;
      } else if (Number(object.enterMyData.defectCloseRate)) {
        object.enterMyData.defectCloseRate = object.enterMyData.defectCloseRate;
      } else {
        object.enterMyData.costPerSupportContact = 0;
      }

      //defects per application
      // Q67010 / AMR300


      if (mapdata1.Q67010 == this.NEGATIVE_CONST
        && mapdata1.AMR300 == this.NEGATIVE_CONST) {
        this.enterMyData.defectsReportedApplication = this.NEGATIVE_CONST;
      }
      else {
        this.enterMyData.defectsReportedApplication = eval("(object.mapdata.Q67010) / (object.mapdata.AMR300)");
        object.enterMyData.defectsReportedApplication = Number.isNaN(object.enterMyData.defectsReportedApplication) ? object.NEGATIVE_CONST : object.enterMyData.defectsReportedApplication;
      }

      

      let temp44 = (Number(this.enterMyData.defectsReportedApplication)).toFixed(1);
      let temp45 = (Number(object.applicationMaintenanceData.data.DefectsperApplication.DefectsReportedPerApplication.Number.value)).toFixed(1);


      if (temp44 == temp45) {
        this.defectsReportedApplicationEquality = true;
      }

      if (this.enterMyData.defectsReportedApplication == Infinity 
        || this.enterMyData.defectsReportedApplication == 'infinity' 
        || this.enterMyData.defectsReportedApplication == "Infinity" 
        || isNaN(this.enterMyData.defectsReportedApplication)) {
        this.enterMyData.defectsReportedApplication = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.defectsReportedApplication)) {
        this.enterMyData.defectsReportedApplication = this.enterMyData.defectsReportedApplication;
      } else {
        this.enterMyData.defectsReportedApplication = 0;
      }

      // defects closed per application
      // Q67110 / AMR300


      if (mapdata1.Q67110 == this.NEGATIVE_CONST
        && mapdata1.AMR300 == this.NEGATIVE_CONST) {
        this.enterMyData.defectsClosedApplication = this.NEGATIVE_CONST;
      }
      else {
        this.enterMyData.defectsClosedApplication = eval("(object.mapdata.Q67110) / (object.mapdata.AMR300)");
        object.enterMyData.defectsClosedApplication = Number.isNaN(object.enterMyData.defectsClosedApplication) ? object.NEGATIVE_CONST : object.enterMyData.defectsClosedApplication;
      }

      

      let temp46 = (Number(this.enterMyData.defectsClosedApplication)).toFixed(1);
      let temp47 = (Number(object.applicationMaintenanceData.data.DefectsperApplication.DefectsClosedPerApplication.Number.value)).toFixed(1);


      if (temp46 == temp47) {
        this.defectsClosedApplicationEquality = true;
      }

      if (this.enterMyData.defectsClosedApplication == Infinity
        || this.enterMyData.defectsClosedApplication == 'infinity'
        || this.enterMyData.defectsClosedApplication == "Infinity"
        || isNaN(this.enterMyData.defectsClosedApplication)) {
        this.enterMyData.defectsClosedApplication = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.defectsClosedApplication)) {
        this.enterMyData.defectsClosedApplication = this.enterMyData.defectsClosedApplication;
      } else {
        this.enterMyData.defectsClosedApplication = 0;
      }

      //enhancements per application
      //requested
      //Q78110 / AMR300

      if (mapdata1.Q78110 == this.NEGATIVE_CONST
        && mapdata1.AMR300 == this.NEGATIVE_CONST) {
        this.enterMyData.requestedEnhancements = this.NEGATIVE_CONST;
      }
      else {
        this.enterMyData.requestedEnhancements = eval("(object.mapdata.Q78110) / (object.mapdata.AMR300)");
        object.enterMyData.requestedEnhancements = Number.isNaN(object.enterMyData.requestedEnhancements) ? object.NEGATIVE_CONST : object.enterMyData.requestedEnhancements;
      }

      

      let temp48 = (Number(this.enterMyData.requestedEnhancements)).toFixed(1);
      let temp49 = (Number(object.applicationMaintenanceData.data.EnhancementsPerApplication.EnhancementRequestsPerApplication.Number.value)).toFixed(1);


      if (temp48 == temp49) {
        this.requestedEnhancementsEquality = true;
      }

      if (this.enterMyData.requestedEnhancements == Infinity
        || this.enterMyData.requestedEnhancements == 'infinity'
        || this.enterMyData.requestedEnhancements == "Infinity"
        || isNaN(this.enterMyData.requestedEnhancements)) {
        this.enterMyData.requestedEnhancements = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.requestedEnhancements)) {
        this.enterMyData.requestedEnhancements = this.enterMyData.requestedEnhancements;
      } else {
        this.enterMyData.requestedEnhancements = 0;
      }

          
      if (mapdata1.EAD020 == this.NEGATIVE_CONST
        && mapdata1.EAM020 == this.NEGATIVE_CONST) {
        this.enterMyData.ADMADMContractStaffMix = this.NEGATIVE_CONST;
      }
      else {
        this.enterMyData.ADMADMContractStaffMix = eval("object.mapdata.EAD020 / (object.mapdata.EAD020 + object.mapdata.EAM020)");
        object.enterMyData.ADMADMContractStaffMix = Number.isNaN(object.enterMyData.ADMADMContractStaffMix) ? object.NEGATIVE_CONST : object.enterMyData.ADMADMContractStaffMix;
      }

      

      
      let temp80 = Number((this.enterMyData.ADMADMContractStaffMix * 100)).toFixed(1);
      let temp81 = Number((this.applicationMaintenanceData.data.ApplicationDevelopmentAndMaintenanceStaffingMixContractor.AD.Contractor.value)).toFixed(1);



      if (temp80 == temp81) {
        this.ADMADContractEquality = true;
      }

     console.log('this.ADMADContractEquality: ',this.ADMADContractEquality);

      // this.enterMyData.managedServices = 0.6322;

      if (this.enterMyData.ADMADMContractStaffMix == Infinity
        || this.enterMyData.ADMADMContractStaffMix == 'infinity'
        || this.enterMyData.ADMADMContractStaffMix == "Infinity"
        || isNaN(this.enterMyData.ADMADMContractStaffMix)) {
        this.enterMyData.ADMADMContractStaffMix = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.ADMADMContractStaffMix)) {
        this.enterMyData.ADMADMContractStaffMix = this.enterMyData.ADMADMContractStaffMix;
      } else {
        this.enterMyData.ADMADMContractStaffMix = 0;
      }

      console.log('AD contractor staffing mix: ',this.enterMyData.ADMADMContractStaffMix);

      //staffing mix ADM AM contract
      //EAM020 / ( EAD020 + EAM020 )

      if (mapdata1.EAD020 == this.NEGATIVE_CONST
        && mapdata1.EAM020 == this.NEGATIVE_CONST) {
        this.enterMyData.ADMAMMContractStaffMix = this.NEGATIVE_CONST;
      }
      else {
        this.enterMyData.ADMAMMContractStaffMix = eval("object.mapdata.EAM020 / (object.mapdata.EAD020 + object.mapdata.EAM020)");
        object.enterMyData.ADMAMMContractStaffMix = Number.isNaN(object.enterMyData.ADMAMMContractStaffMix) ? object.NEGATIVE_CONST : object.enterMyData.ADMAMMContractStaffMix;
      }

      

      let temp82 = Number((this.enterMyData.ADMAMMContractStaffMix * 100)).toFixed(1);
      let temp83 = Number((this.applicationMaintenanceData.data.ApplicationDevelopmentAndMaintenanceStaffingMixContractor.AM.Contractor.value)).toFixed(1);

      if (temp82 == temp83) {
        this.ADMAMContractEquality = true;
      }

      // this.enterMyData.managedServices = 0.6322;

      if (this.enterMyData.ADMAMMContractStaffMix == Infinity
        || this.enterMyData.ADMAMMContractStaffMix == 'infinity'
        || this.enterMyData.ADMAMMContractStaffMix == "Infinity"
        || isNaN(this.enterMyData.ADMAMMContractStaffMix)) {
        this.enterMyData.ADMAMMContractStaffMix = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.ADMAMMContractStaffMix)) {
        this.enterMyData.ADMAMMContractStaffMix = this.enterMyData.ADMAMMContractStaffMix;
      } else {
        this.enterMyData.ADMAMMContractStaffMix = 0;
      }

      console.log('AM contractor staffing mix: ',this.enterMyData.ADMAMMContractStaffMix);
      console.log('staffing mix over');

      console.log('object.mapdata.EAD030: ',object.mapdata.EAD030);
      console.log('object.mapdata.EAM030: ',object.mapdata.EAM030);


//staffing mix ADM AD contractor fte
      //EAD020 / ( EAD020 + EAM020 )


      //staffing mix ADM AD employee fte
      //EAD010 / ( EAD010 + EAM010 )

      console.log('object.mapdata.EAD010: ',object.mapdata.EAD010);
      console.log('object.mapdata.EAM010: ',object.mapdata.EAM010);



      if (mapdata1.EAD010 == this.NEGATIVE_CONST
        && mapdata1.EAM010 == this.NEGATIVE_CONST) {
        this.enterMyData.ADMADMEmployeeStaffMix = this.NEGATIVE_CONST;
      }
      else {
        this.enterMyData.ADMADMEmployeeStaffMix = eval("object.mapdata.EAD010 / (object.mapdata.EAD010 + object.mapdata.EAM010)");
        object.enterMyData.ADMADMEmployeeStaffMix = Number.isNaN(object.enterMyData.ADMADMEmployeeStaffMix) ? object.NEGATIVE_CONST : object.enterMyData.ADMADMEmployeeStaffMix;
      }

      

      console.log('this.enterMyData.ADMADMEmployeeStaffMix: ',this.enterMyData.ADMADMEmployeeStaffMix);

      console.log('landing page AD employee: ',this.applicationMaintenanceData.data.ApplicationDevelopmentAndMaintenanceStaffingMixEmployee.AD.Employee.value);

      let temp76 = Number((this.enterMyData.ADMADMEmployeeStaffMix * 100)).toFixed(1);
      let temp77 = Number((this.applicationMaintenanceData.data.ApplicationDevelopmentAndMaintenanceStaffingMixEmployee.AD.Employee.value)).toFixed(1);

      if (temp76 == temp77) {
        this.ADMADEmployeeEquality = true;
      }

      // this.enterMyData.managedServices = 0.6322;

      if (this.enterMyData.ADMADMEmployeeStaffMix == Infinity
        || this.enterMyData.ADMADMEmployeeStaffMix == 'infinity'
        || this.enterMyData.ADMADMEmployeeStaffMix == "Infinity"
        || isNaN(this.enterMyData.ADMADMEmployeeStaffMix)) {
        this.enterMyData.ADMADMEmployeeStaffMix = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.ADMADMEmployeeStaffMix)) {
        this.enterMyData.ADMADMEmployeeStaffMix = this.enterMyData.ADMADMEmployeeStaffMix;
      } else {
        this.enterMyData.ADMADMEmployeeStaffMix = 0;
      }

      console.log('AD employee staffing mix: ',this.enterMyData.ADMADMEmployeeStaffMix);

      //staffing mix ADM AM employee
      //EAM010 / ( EAD010 + EAM010 )


      if (mapdata1.EAM010 == this.NEGATIVE_CONST
        && mapdata1.EAD010 == this.NEGATIVE_CONST) {
        this.enterMyData.ADMAMMEmployeeStaffMix = this.NEGATIVE_CONST;
      }
      else {
        this.enterMyData.ADMAMMEmployeeStaffMix = eval("object.mapdata.EAM010 / (object.mapdata.EAD010 + object.mapdata.EAM010)");
        object.enterMyData.ADMAMMEmployeeStaffMix = Number.isNaN(object.enterMyData.ADMAMMEmployeeStaffMix) ? object.NEGATIVE_CONST : object.enterMyData.ADMAMMEmployeeStaffMix;
      }

      

      console.log('this.enterMyData.ADMAMMEmployeeStaffMix: ',this.enterMyData.ADMAMMEmployeeStaffMix);
      //applicationMaintenanceData.data.ApplicationDevelopmentAndMaintenanceStaffingMixEmployee.AM.Employee.value
      console.log('AM employee landing: ',object.applicationMaintenanceData.data.ApplicationDevelopmentAndMaintenanceStaffingMixEmployee.AM.Employee.value);
      let temp78 = Number((this.enterMyData.ADMAMMEmployeeStaffMix * 100)).toFixed(1);
      console.log('1: ',temp78);
      let temp79 = Number((object.applicationMaintenanceData.data.ApplicationDevelopmentAndMaintenanceStaffingMixEmployee.AM.Employee.value)).toFixed(1);
      console.log('2');

      if (temp78 == temp79) {
        this.ADMAMEmployeeEquality = true;
      }

      console.log('this.ADMAMEmployeeEquality: ',this.ADMAMEmployeeEquality);

      // this.enterMyData.managedServices = 0.6322;

      if (this.enterMyData.ADMAMMEmployeeStaffMix == Infinity
        || this.enterMyData.ADMAMMEmployeeStaffMix == 'infinity'
        || this.enterMyData.ADMAMMEmployeeStaffMix == "Infinity"
        || isNaN(this.enterMyData.ADMAMMEmployeeStaffMix)) {
        this.enterMyData.ADMAMMEmployeeStaffMix = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.ADMAMMEmployeeStaffMix)) {
        this.enterMyData.ADMAMMEmployeeStaffMix = this.enterMyData.ADMAMMEmployeeStaffMix;
      } else {
        this.enterMyData.ADMAMMEmployeeStaffMix = 0;
      }

      console.log('AM employee staffing mix: ',this.enterMyData.ADMAMMEmployeeStaffMix);

       //staffing mix ADM AD managed services
      //EAD030 / ( EAD030 + EAM030 )

      console.log('object.mapdata.EAD030: ',object.mapdata.EAD030);
      console.log('object.mapdata.EAM030: ',object.mapdata.EAM030);



      if (mapdata1.EAD030 == this.NEGATIVE_CONST
        && mapdata1.EAM030 == this.NEGATIVE_CONST) {
        this.enterMyData.ADMADManagedServices = this.NEGATIVE_CONST;
      }
      else {
        this.enterMyData.ADMADManagedServices = eval("object.mapdata.EAD030 / (object.mapdata.EAD030 + object.mapdata.EAM030)");
        object.enterMyData.ADMADManagedServices = Number.isNaN(object.enterMyData.ADMADManagedServices) ? object.NEGATIVE_CONST : object.enterMyData.ADMADManagedServices;
      }

      

      console.log('this.enterMyData.ADMADManagedServices: ',this.enterMyData.ADMADManagedServices);

      console.log('landing page AD managed: ',object.applicationMaintenanceData.data.ApplicationDevelopmentAndMaintenanceStaffingMixManagedServices);

      //applicationMaintenanceData.data.ApplicationDevelopmentAndMaintenanceStaffingMixManagedServices.AD.Services.value

      let temp70 = Number((this.enterMyData.ADMADManagedServices * 100)).toFixed(1);
      console.log('3');
      let temp71 = Number((object.applicationMaintenanceData.data.ApplicationDevelopmentAndMaintenanceStaffingMixManagedServices.AD.Services.value)).toFixed(1);
      console.log('4');

      if (temp70 == temp71) {
        this.ADMADManagedEquality = true;
      }

      console.log('AD managed services equality: ',this.ADMADManagedEquality);

      // this.enterMyData.managedServices = 0.6322;

      if (this.enterMyData.ADMADManagedServices == Infinity 
        || this.enterMyData.ADMADManagedServices == 'infinity' 
        || this.enterMyData.ADMADManagedServices == "Infinity" 
        || isNaN(this.enterMyData.ADMADManagedServices)) {
        this.enterMyData.ADMADManagedServices = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.ADMADManagedServices)) {
        this.enterMyData.ADMADManagedServices = this.enterMyData.ADMADManagedServices;
      } else {
        this.enterMyData.ADMADManagedServices = 0;
      }

      console.log('AM managed services: ',this.enterMyData.ADMADManagedServices);

      
      //staffing mix ADM AM managed services
      //EAM030 / ( EAD030 + EAM030 )

      if (mapdata1.EAD030 == this.NEGATIVE_CONST
        && mapdata1.EAM030 == this.NEGATIVE_CONST) {
        this.enterMyData.ADMAMManagedServices = this.NEGATIVE_CONST;
      }
      else {
        this.enterMyData.ADMAMManagedServices = eval("object.mapdata.EAM030 / (object.mapdata.EAD030 + object.mapdata.EAM030)");
        object.enterMyData.ADMAMManagedServices = Number.isNaN(object.enterMyData.ADMAMManagedServices) ? object.NEGATIVE_CONST : object.enterMyData.ADMAMManagedServices;
      }

      

      let temp72 = Number((this.enterMyData.ADMAMManagedServices * 100)).toFixed(1);
      let temp73 = Number((this.applicationMaintenanceData.data.ApplicationDevelopmentAndMaintenanceStaffingMixManagedServices.AM.Services.value)).toFixed(1);

      if (temp72 == temp73) {
        this.ADMAMManagedEquality = true;
      }

      // this.enterMyData.managedServices = 0.6322;

      if (this.enterMyData.ADMAMManagedServices == Infinity
        || this.enterMyData.ADMAMManagedServices == 'infinity'
        || this.enterMyData.ADMAMManagedServices == "Infinity"
        || isNaN(this.enterMyData.ADMAMManagedServices)) {
        this.enterMyData.ADMAMManagedServices = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.ADMAMManagedServices)) {
        this.enterMyData.ADMAMManagedServices = this.enterMyData.ADMAMManagedServices;
      } else {
        this.enterMyData.ADMAMManagedServices = 0;
      }

      console.log('AM managed services: ',this.enterMyData.ADMAMManagedServices);

     
  

    }
    catch (error) {
      //  console.log(error);
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "13",
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
        "dashboardId": "13",
        "pageName": "Non CIO Service Desk Tower Landing Screen",
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

    //reset CRG
    //reset CRG selection
    this.selectedcustomRef = this.selectedCRGName[0];


    if (filter === "industry") {

      //get landing data for selected industry
      if (object.selectedindustry.value == "All Industries") {
        object.industrySizeService.setAMFilters('Global', 'Grand Total');
      }
      else {
        object.industrySizeService.setAMFilters('Industry', object.selectedindustry.value);
        object.selectedsize = object.selectedsizes[0];
      }

      //call web service
      object.industrySizeService.getAMFilteredLandingData().subscribe((allData: any) => {
        object.applicationMaintenanceData = allData;
        object.compareServicedeskInputData();
      }, (error) => {
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId": "12",
          "pageName": "Non CIO Service Desk Tower Landing Screen",
          "errorType": "Fatal",
          "errorTitle": "web Service Error",
          "errorDescription": error.message,
          "errorObject": error
        }

        throw errorObj;
      })

    }

    if (filter === "size") {

      //get landing data for selected industry
      if (object.selectedsize.value == "All Sizes") {
        object.industrySizeService.setAMFilters('Global', 'Grand Total');
      }
      else {
        object.industrySizeService.setAMFilters('size', object.selectedsize.value);
        object.selectedindustry = object.selectedIndustries[0];
      }

      //call web service
      object.industrySizeService.getAMFilteredLandingData().subscribe((allData: any) => {
        object.applicationMaintenanceData = allData;
        object.compareServicedeskInputData();
      }, (error) => {
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId": "12",
          "pageName": "Non CIO Service Desk Tower Landing Screen",
          "errorType": "Fatal",
          "errorTitle": "web Service Error",
          "errorDescription": error.message,
          "errorObject": error
        }

        throw errorObj;
      })

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
      object.applicationMaintenanceData = data;
      // this.updateLineChartData();
      this.updateDrillDown();
      this.compareServicedeskInputData();
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "13",
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
    }
    if (region == "Europe EMEA" || region == "Europe (EMEA)") {
      region = "Europe, Middle East, and Africa";
    }
    this.industrySizeService.setRegionValue(region);
    // this.updateLineChartData();
    this.filterData();
  }

  //set currency on change
  setCurrency(currency) {
    
    this.currencyCode=currency.value;
    this.refactorVal=currency.id;
    //set updated currency to industry size service
    this.industrySizeService.setCurrencyObject(currency);
    //this.updateLineChartData();
    //this.updateDrillDown();

    //change currency symbol
    this.currencySymbol = this.currencyVar(this.currencyCode);
    if(this.showDiv==true){


      this.convertCompareData(this.conversionCurrency,currency.key);
      this.compareServicedeskInputData();

      this.conversionCurrency=currency.key;

    }
  }
  updateCompareData() {
    let object = this;
    let something = object.ADSharedService.getData().currency;
    object.allCurrencies.forEach((element) => {

      if (element.key == something) {
        this.selectedcurrency = element;
        this.currencyCode = element.value;
        this.conversionCurrency = element.key;
        this.refactorVal = element.id;
        this.currencySymbol = this.currencyVar(this.currencyCode);
        //this.updateLineChartData();
        // this.updateDrillDown();
      }
    });

    if(object.navigatedFromComparison==true)
    {
      object.updateScenarioDropdown();
      let refactorValue = object.ADSharedService.getData().refactorVal;
     
      let comparisionData = object.ADSharedService.getData().comparisionData;
    
        for (let data of comparisionData) {
  
          let key = object.sourceMap[data.key];
          if (key != undefined && key != null && key != "#" && key != "%") {
            // data.value = data.value / currentValue.id;
            data.value = data.value * refactorValue;
          }
  
        }
    }

    if(object.navigatedFromInput==true) 
    {
      object.updateScenarioDropdown();
      
    }
  }

  updateScenarioDropdown() {
    //get selected scenario id
    let object = this;

    let selectedScenarioID = object.ADSharedService.getScenarioSelection();
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

    let comparisionData = object.ADSharedService.getData().comparisionData;
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
      //   console.log(error);
    }
    // console.log(JSON.stringify(object.servicedeskSharedService.getData().comparisionData));



  }


  getCurrency(currencyKey) {
    let object = this;
    let currencyObject = null;
    object.allCurrencies.forEach((element) => {
      if (element.key == currencyKey) {
        currencyObject = element;
      }
    });
    return currencyObject;
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
    // //this is done becuz when i reset form,i will lose selectedScenrio Id
    let scenarioID = selectedscenario.id;

    // //this means that there is no present or this function is first hit to server
    try {
      //   object.resetAll();
    } catch (error) {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "12",
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

      object.selectedindustry = object.selectedIndustries[0];
      object.selectedsize = object.selectedsizes[0];
      //default currency
      let currency = "FE482E13-D3B6-4208-8C3C-2FD7AFBEBEA1";//USD key
      //get currency data
      object.allCurrencies.forEach((element) => {

        if (element.key == currency) {
          this.selectedcurrency = element;
          this.currencyCode = element.value;
          this.conversionCurrency = element.key;
          this.refactorVal = element.id;
          // this.currencySymbol = this.currencyVar(this.currencyCode);
          // this.updateLineChartData();
          this.updateDrillDown();
        }
      });


    }
    else//get comparison data for scenario
    {
      let requestedParam = {
        "userID": object.sessionId,
        "dashboardId": "12",
        "scenarioId": []
      }
      //restting insdustry and revenue dropdown
      object.selectedindustry = object.selectedIndustries[0];
      object.selectedsize = object.selectedsizes[0];

      object.generateScenarioService.getSavedScenarioDataToPopulate("12", object.sessionId, scenarioID).subscribe((response) => {

        let object = this;

        object.selectedScenarioForComparison = [];

        object.scenarioObj = response;



        // logic to prepare a scenarion object for comparison

        for (let cnt = 0; cnt < object.scenarioObj.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes.length; cnt++) {
          let t1: any = {};
          t1.key = object.scenarioObj.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes[cnt].src_code;
          // console.log()
          t1.value = object.scenarioObj.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes[cnt].src_code_value;
          //once save note functionality done append value of each src code note here
          t1.note = object.scenarioObj.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes[cnt].notes;

          t1.value_format = object.scenarioObj.ApplicationDevelopmentInput.ApplicationDevelopmentVolumes[cnt].value_format;
          object.selectedScenarioForComparison.push(t1);
        }

        for (let cnt = 0; cnt < object.scenarioObj.ApplicationDevelopmentInput.ApplicationDevelopmentCosts.length; cnt++) {
          let t1: any = {};
          t1.key = object.scenarioObj.ApplicationDevelopmentInput.ApplicationDevelopmentCosts[cnt].src_code;
          // console.log()
          t1.value = object.scenarioObj.ApplicationDevelopmentInput.ApplicationDevelopmentCosts[cnt].src_code_value;
          //once save note functionality done append value of each src code note here
          t1.note = object.scenarioObj.ApplicationDevelopmentInput.ApplicationDevelopmentCosts[cnt].notes;

          t1.value_format = object.scenarioObj.ApplicationDevelopmentInput.ApplicationDevelopmentCosts[cnt].value_format;
          object.selectedScenarioForComparison.push(t1);
        }

        for (let cnt = 0; cnt < object.scenarioObj.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs.length; cnt++) {
          let t1: any = {};
          t1.key = object.scenarioObj.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs[cnt].src_code;
          // console.log()
          t1.value = object.scenarioObj.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs[cnt].src_code_value;
          //once save note functionality done append value of each src code note here
          t1.note = object.scenarioObj.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs[cnt].notes;

          t1.value_format = object.scenarioObj.ApplicationDevelopmentInput.ApplicationDevelopmentFTEs[cnt].value_format;
          object.selectedScenarioForComparison.push(t1);
        }


        for (let cnt = 0; cnt < object.scenarioObj.ApplicationDevelopmentInput.Projecteffortsallocation.length; cnt++) {
          let t1: any = {};
          t1.key = object.scenarioObj.ApplicationDevelopmentInput.Projecteffortsallocation[cnt].src_code;
          // console.log()
          t1.value = object.scenarioObj.ApplicationDevelopmentInput.Projecteffortsallocation[cnt].src_code_value;
          //once save note functionality done append value of each src code note here
          t1.note = object.scenarioObj.ApplicationDevelopmentInput.Projecteffortsallocation[cnt].notes;
          t1.value_format = object.scenarioObj.ApplicationDevelopmentInput.Projecteffortsallocation[cnt].value_format;

          object.selectedScenarioForComparison.push(t1);
        }

        for (let cnt = 0; cnt < object.scenarioObj.ApplicationDevelopmentInput.Applicationdevelopmenthours.length; cnt++) {
          let t1: any = {};
          t1.key = object.scenarioObj.ApplicationDevelopmentInput.Applicationdevelopmenthours[cnt].src_code;
          // console.log()
          t1.value = object.scenarioObj.ApplicationDevelopmentInput.Applicationdevelopmenthours[cnt].src_code_value;
          //once save note functionality done append value of each src code note here
          t1.note = object.scenarioObj.ApplicationDevelopmentInput.Applicationdevelopmenthours[cnt].notes;
          t1.value_format = object.scenarioObj.ApplicationDevelopmentInput.Applicationdevelopmenthours[cnt].value_format;

          object.selectedScenarioForComparison.push(t1);
        }

        for (let cnt = 0; cnt < object.scenarioObj.ApplicationDevelopmentandMaintenanceInput.NA.length; cnt++) {
          let t1: any = {};
          t1.key = object.scenarioObj.ApplicationDevelopmentandMaintenanceInput.NA[cnt].src_code;

          t1.value = object.scenarioObj.ApplicationDevelopmentandMaintenanceInput.NA[cnt].src_code_value;

          t1.note = object.scenarioObj.ApplicationDevelopmentandMaintenanceInput.NA[cnt].notes;

          t1.value_format = object.scenarioObj.ApplicationDevelopmentandMaintenanceInput.NA[cnt].value_format;

          object.selectedScenarioForComparison.push(t1);
        }

        for (let cnt = 0; cnt < object.scenarioObj.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts.length; cnt++) {
          let t1: any = {};
          t1.key = object.scenarioObj.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts[cnt].src_code;
          // console.log()
          t1.value = object.scenarioObj.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts[cnt].src_code_value;
          //once save note functionality done append value of each src code note here
          t1.note = object.scenarioObj.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts[cnt].notes;
          t1.value_format = object.scenarioObj.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceCosts[cnt].value_format;

          object.selectedScenarioForComparison.push(t1);
        }

        for (let cnt = 0; cnt < object.scenarioObj.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs.length; cnt++) {
          let t1: any = {};
          t1.key = object.scenarioObj.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs[cnt].src_code;
          // console.log()
          t1.value = object.scenarioObj.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs[cnt].src_code_value;
          //once save note functionality done append value of each src code note here
          t1.note = object.scenarioObj.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs[cnt].notes;
          t1.value_format = object.scenarioObj.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceFTEs[cnt].value_format;

          object.selectedScenarioForComparison.push(t1);
        }

        for (let cnt = 0; cnt < object.scenarioObj.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes.length; cnt++) {
          let t1: any = {};
          t1.key = object.scenarioObj.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes[cnt].src_code;
          // console.log()
          t1.value = object.scenarioObj.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes[cnt].src_code_value;
          //once save note functionality done append value of each src code note here
          t1.note = object.scenarioObj.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes[cnt].notes;
          t1.value_format = object.scenarioObj.ApplicationMaintenanceandSupportInput.ApplicationMaintenanceVolumes[cnt].value_format;

          object.selectedScenarioForComparison.push(t1);
        }

        for (let cnt = 0; cnt < object.scenarioObj.ApplicationMaintenanceandSupportInput.applicationmaintenancehours.length; cnt++) {
          let t1: any = {};
          t1.key = object.scenarioObj.ApplicationMaintenanceandSupportInput.applicationmaintenancehours[cnt].src_code;
          // console.log()
          t1.value = object.scenarioObj.ApplicationMaintenanceandSupportInput.applicationmaintenancehours[cnt].src_code_value;
          //once save note functionality done append value of each src code note here
          t1.note = object.scenarioObj.ApplicationMaintenanceandSupportInput.applicationmaintenancehours[cnt].notes;
          t1.value_format = object.scenarioObj.ApplicationMaintenanceandSupportInput.applicationmaintenancehours[cnt].value_format;

          object.selectedScenarioForComparison.push(t1);
        }

        for (let cnt = 0; cnt < object.scenarioObj.ApplicationMaintenanceandSupportInput.Defectseveritytype.length; cnt++) {
          let t1: any = {};
          t1.key = object.scenarioObj.ApplicationMaintenanceandSupportInput.Defectseveritytype[cnt].src_code;
          // console.log()
          t1.value = object.scenarioObj.ApplicationMaintenanceandSupportInput.Defectseveritytype[cnt].src_code_value;
          //once save note functionality done append value of each src code note here
          t1.note = object.scenarioObj.ApplicationMaintenanceandSupportInput.Defectseveritytype[cnt].notes;
          t1.value_format = object.scenarioObj.ApplicationMaintenanceandSupportInput.Defectseveritytype[cnt].value_format;

          object.selectedScenarioForComparison.push(t1);
        }
        let currency: any;
        let region: any;

        for (let cnt = 0; cnt < object.scenarioObj.GENERALINFORMATION.NA.length; cnt++) {
          //currency
          if (object.scenarioObj.GENERALINFORMATION.NA[cnt].src_code == 'ICE002') {
            currency = object.scenarioObj.GENERALINFORMATION.NA[cnt].src_code_value;
          }
          //region
          if (object.scenarioObj.GENERALINFORMATION.NA[cnt].src_code == 'TD0110') {
            region = object.scenarioObj.GENERALINFORMATION.NA[cnt].src_code_value;
          }
        }

        if (currency == undefined || currency == null || currency.trim().length == 0) {
          currency = "FE482E13-D3B6-4208-8C3C-2FD7AFBEBEA1";//USD key
        }
        let sharedData = { "comparisionData": object.selectedScenarioForComparison, "currency": currency, "region": region };

        console.log('sharedData: ',sharedData);

        object.ADSharedService.setData(sharedData);
        object.ADSharedService.setScenarioSelection(scenarioID);
        let something = object.ADSharedService.getData().currency;

        

        //get currency data
        object.allCurrencies.forEach((element) => {

          if (element.key == something) {
            this.selectedcurrency = element;
            this.currencyCode = element.value;
            this.conversionCurrency = element.key;
            this.refactorVal = element.id;
            // this.updateLineChartData();
            this.updateDrillDown();
            //change currency symbol
            this.currencySymbol = this.currencyVar(this.currencyCode);

          }
        });

        this.toggle();



      }, (error) => {
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId": "12",
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



  //removing memory leaks
  ngOnDestroy() {
    //emit an event to indicate data is resetted
    this.industrySizeService.getEmitter().emit('landingPageDataReset');

    this.ADSharedService.getEmitter().removeAllListeners();
  }

  //function to check all relevent data is loaded on page
  isAllReleventDataLoaded() {
    let object = this;

    // if (object.landingPageDataLoaded && object.industryDataLoaded && object.currencyFilterLoaded && object.scaleDataLoaded) {
      object.showApplicationMaintenanceData = true;
      if (object.landingPageDataLoaded && 
        object.industryDataLoaded && 
        object.currencyFilterLoaded && 
        object.scaleDataLoaded &&
        object.scenarioListLoaded &&
        object.CRGListLoaded) {
      object.industrySizeService.getEmitter().emit('landingPageDataLoaded');
      }
    // }
    // else {
    //   object.showApplicationMaintenanceData = false;
    // }

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

        object.selectedscenario = object.selectedScenarioName[0];
        object.scenarioListLoaded =true;
        object.isAllReleventDataLoaded();
        object.getScenarioDataById(object.selectedscenario);



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

  //crg functions
  getCRGDropdown() {
    //get dropdown of scenarios

    let object = this;

    // console.log(object.industrySizeService.getPageId());


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
        temp.dashboardId = "13";
        temp.updatedBy = null;
        temp.customId = "-9999"; //
        temp.definition = "";
        object.selectedCRGName.push(temp);

        for (let index in object.customReferenceGroupList) {
          let option: any = {};

          if (object.customReferenceGroupList[index].dashboardId == '13') {
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
        object.CRGListLoaded =true;
        object.isAllReleventDataLoaded();


        object.getcurrencyDropdown();


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

  getcurrencyDropdown()
  {
    let object =this;

    //currency
    object.dropDownService.getCurrency().subscribe((data: any) => {
      object.allCurrencies = data['currencyExchange'];
      if (object.allCurrencies != undefined && object.allCurrencies != null) {
        object.currencyFilterLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.currencyFilterLoaded = false;
        object.showApplicationMaintenanceData = false;
      }
      let currency;
      object.allCurrencies.forEach(element => {
        if (element.value === "USD") {
          currency = element;
        }


      }, (error) => {
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId": "12",
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

      if (object.allCurrencies != undefined && object.allCurrencies != null) {
        object.currencyFilterLoaded = true;
        //object.isAllReleventDataLoaded();
      }
      else {
        object.currencyFilterLoaded = false;
        object.showApplicationMaintenanceData = false;
      }

      //change currency symbol
      this.currencySymbol = this.currencyVar(this.currencyCode);

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
    }
    else {
      //set custom reference group in service
      object.industrySizeService.setCRGId(selectedcustomRef.customId);
      object.resetNonCRGFilters();
      //web service to fetch CRG data
      object.industrySizeService.fetchCRGData().subscribe((crgData: any) => {

        if (crgData != undefined || crgData != null) {
          object.applicationMaintenanceData = crgData;
          object.compareServicedeskInputData();
          object.landingPageDataLoaded = true;
          object.isAllReleventDataLoaded();
        }

      });
    }

  }

  showDefaultLandingData() {

    let object = this;

    // this is used for all landing page data
    object.industrySizeService.getAMLandingData().subscribe((allData: any) => {
      object.applicationMaintenanceData = allData;
      if (object.applicationMaintenanceData != undefined && object.applicationMaintenanceData != null) {
        object.landingPageDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.landingPageDataLoaded = false;
        object.showApplicationMaintenanceData = false;
      }
      object.updateDrillDown();
      this.compareServicedeskInputData();

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "13",
        "pageName": "Non CIO Service Desk Tower Landing Screen",
        "errorType": "Fatal",
        "errorTitle": "web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });



  }

  resetNonCRGFilters() {

    let object = this;

    //object.show = false;
    //object.landingPageDataLoaded =false;
    object.currencyFilterLoaded = false;
    object.landingPageDataLoaded = false;
    object.showApplicationMaintenanceData = false;
    object.regionFilterLoaded = false;
    object.industryDataLoaded = false;

    //currency
    // object.showDefaultCurrency();

    //industry
    object.showDefaultIndustry();

    //revenue
    object.showDefaultRevenue();
  }

  showDefaultCurrency() {
    let object = this;

    object.dropDownService.getCurrency().subscribe((data: any) => {
      object.allCurrencies = data['currencyExchange'];

      let currency;

      object.allCurrencies.forEach(element => {

        if (element.value === "USD") {
          currency = element;
        }

        if (object.allCurrencies != undefined && object.allCurrencies != null) {
          object.currencyFilterLoaded = true;
          object.isAllReleventDataLoaded();
        }
        else {
          object.currencyFilterLoaded = false;
          //object.showServiceDeskData = false;
        }

      });

      object.selectedcurrency = currency;
      object.defaultcurrency = object.selectedcurrency;

      //set updated currency to industry size service
      this.industrySizeService.setCurrencyObject(currency);
      object.setCurrency(object.selectedcurrency);
      object.commonService.setData(object.selectedcurrency);
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

  showDefaultIndustry() {

    let object = this;

    object.dropDownService.getIndustry().subscribe((data: any) => {
      object.data = {
        industries: []
      };
      
      for(let indObj of data.industries){
        if(indObj.key != "C946BACA-444F-4E5D-8FB9-94BF3457C6B8"){
          object.data.industries.push(indObj);
        }
      }
      // object.data.industries = data.industries;
      // object.selectedindustry="Grand Total";
      // object.defaultindustry="Grand Total";

      object.selectedIndustries = [];

      //set default selection
      let temp: any = {};

      temp.id = "";
      temp.key = "Grand Total";
      temp.value = "All Industries";
      object.selectedIndustries.push(temp);

      //let scanrioId = 0;
      for (let index in object.data.industries) {
        let option: any = {};

        option.id = object.data.industries[index].id;
        option.key = object.data.industries[index].key;
        option.value = object.data.industries[index].value;
        object.selectedIndustries.push(option);


      }


      object.selectedindustry = object.selectedIndustries[0];

      object.selectedindustry = object.selectedIndustries[0];
      if (object.data.industries != undefined && object.data.industries != null) {
        object.industryDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.industryDataLoaded = false;
        object.showApplicationMaintenanceData = false;
      }


    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "12",
        "pageName": "Non CIO Service Desk Tower Landing Screen",
        "errorType": "Fatal",
        "errorTitle": "web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })
  }

  showDefaultRevenue() {
    let object = this;
    object.dropDownService.getRevenue().subscribe((data: any) => {
      object.data.revenue = data.revenue;
      // object.defaultsize = "All Sizes";


      object.selectedsizes = [];


      //set default selection
      let temp1: any = {};

      temp1.id = "";
      temp1.key = "Grand Total";
      temp1.value = "All Sizes";
      object.selectedsizes.push(temp1);

      for (let index in object.data.revenue) {
        let option: any = {};

        option.id = object.data.revenue[index].id;
        option.key = object.data.revenue[index].key;
        option.value = object.data.revenue[index].value;
        object.selectedsizes.push(option);


      }

      object.selectedsize = object.selectedsizes[0];
      if (object.data.revenue != undefined && object.data.revenue != null) {
        object.scaleDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.scaleDataLoaded = false;
        object.showApplicationMaintenanceData = false;
      }
      //  object.selectedsize = object.selectedsizes[0];
      // object.selectedsize = "Grand Total";
      // object.defaultsize = "Grand Total";

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "12",
        "pageName": "Header Filters",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })
  }

}
