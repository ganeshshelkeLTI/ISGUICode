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

import { ApplicationDevelopmentService } from '../services/application-development/application-development.service';

import { MapSourceCodeDataValues } from '../map-source-code-data-values';
import { ApplicationDevelopmentInputMyDataSharedService } from '../services/application-development/application-development-input-my-data-shared.service';
import { ApplicationDevelopmentEditAndCompareSharedService } from '../services/application-development/application-development-edit-and-compare-shared.service';
import { EnterCompareDataTowersService } from '../services/enter-compare-data-towers.service';
import { GenerateScenarioService } from '../services/generate-scenario.service';
import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';

import { negativeConstant } from '../../properties/constant-values-properties';
import { UpdateScenarioListNotificationServiceService } from '../services/update-scenario-list-notification-service.service';

declare var $: any;


@Component({
  selector: 'application-development',
  templateUrl: './application-development.component.html',
  styleUrls: ['./application-development.component.css']
})

export class ApplicationDevelopmentComponent implements OnInit {


  showApplicationDevelopmentData: boolean = false;
  public applicationDevelopmentData: any;

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
    "onshorePlanningEffort": null,
    "onshoreRequirementEffort": null,
    "onshoreDesignEffort": null,
    "onshoreCodingEffort": null,
    "onshoreTestingEffort": null,
    "onshoreImplementEffort": null,
    "onshoreSustainEffort": null,
    "offshorePlanningEffort": null,
    "offshoreRequirementEffort": null,
    "offshoreDesignEffort": null,
    "offshoreCodingEffort": null,
    "offshoreTestingEffort": null,
    "offshoreImplementEffort": null,
    "offshoreSustainEffort": null,
    "applicationDevCost": null,
    "applicationMaintenanceCost": null
  }

  currencyCode: string = "USD";
  refactorVal: number = 1;


  //private data: FilterData;
  private data: any = {};
  private data1: IsgKpiData;
  private ADDefinitionData: any;

  private selectedindustry;//it will be assigned string
  private selectedregion;//it will be assigned string
  private selectedsize;//it will be assigned string
  private selectedcurrency;//this will be assigned whole object currency

  private defaultindustry;
  private defaultregion;
  private defaultsize;
  private defaultcurrency;
  private compareComponent: CompareComponent

  public scenarios: any;
  public selectedScenarioName: any;
  public selectedscenario: any=[];

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
  public onshorePlanningEffortEquality: boolean = false;
  public onshoreRequirementEffortEquality: boolean = false;
  public onshoreDesignEffortEquality: boolean = false;
  public onshoreCodingEffortEquality: boolean = false;
  public onshoreTestingEffortEquality: boolean = false;
  public onshoreImplementEffortEquality: boolean = false;
  public onshoreSustainEffortEquality: boolean = false;
  public offshorePlanningEffortEquality: boolean = false;
  public offshoreRequirementEffortEquality: boolean = false;
  public offshoreDesignEffortEquality: boolean = false;
  public offshoreCodingEffortEquality: boolean = false;
  public offshoreTestingEffortEquality: boolean = false;
  public offshoreImplementEffortEquality: boolean = false;
  public offshoreSustainEffortEquality: boolean = false;

  //variables to check data load status
  public landingPageDataLoaded: boolean = false;
  public revenueFilterLoaded: boolean = false;
  public regionFilterLoaded: boolean = false;
  public currencyFilterLoaded: boolean = false;
  public industryDataLoaded: boolean = false;
  public scenarioListLoaded: boolean = false;
  public CRGListLoaded: boolean = false;

  public navigatedFromComparison:boolean=false;
  public navigatedFromInput:boolean=false;

  public selectedIndustries:any;
  public selectedsizes:any;
  public allCurrencies:any;

    //CRG
    public customReferenceGroupList: any;
    public selectedCRGName: any;
    public CRGNameToCompare: any;
    public selectedcustomRef: any;
    public selectedCRGData: any;
  

  NEGATIVE_CONST: number;
  map: Map<string, string> = new Map<string, string>();

  public adCostEquality:boolean = false;
  public amCostEquality:boolean  = false;


  constructor(private service: FilterDataService,
    private commonService: CioheaderdataService,
    private compareHeaderDataService: HeaderCompareScreenDataService,
    private dropDownService: DropDownService,
    private industrySizeService: IndustrySizeService,
    location: Location, router: Router,
    private applicationDevelopmentLanding: ApplicationDevelopmentService,
    private ADSharedService: ApplicationDevelopmentInputMyDataSharedService,
    private genericEnterCompare: EnterCompareDataTowersService,
    private generateScenarioService: GenerateScenarioService,
    private loginDataBroadcastService: LoginDataBroadcastService,
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

    

    //let storageSharedEmitter = object.ADSharedService.getEmitter();
    object.ADSharedService.getEmitter().on('navigateToADComponent', function () {
      object.sourceMap = object.ADSharedService.getData().map;
      object.navigatedFromComparison = true;
      object.toggle();
    });

    object.ADSharedService.getEmitter().on('navigateToADComponentFromInput', function () {
      object.sourceMap = object.ADSharedService.getData().map;
      object.navigatedFromInput =true;
      object.toggle();
    });

    //on save scenario
    object.ADSharedService.getEmitter().on('newADScenarioSaved', function () {
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

            //object.selectedscenario = object.selectedScenarioName[Number(savedScearioId)];


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

    object.commonService.getEventEmitter().on("scenariochange", function () {
      //get selected scenario
      let scenario = object.commonService.getScenario();
      //call method to get scenario
      object.getScenarioDataById(scenario);

    });

  //update sceanrio list when new scenario created
  object.ADSharedService.getEmitter().on('newScenarioOfADSaved', function(){
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
    object.industrySizeService.setPageId(12);
    // this is used for all landing page data
    //object.applicationDevelopmentData = {"annualCostPerContracted":{"info":"Measures the annual cost per application development contractor (represented as a full-time equivalent).","lower":"137904.0","mean":null,"upper":"206856.0","number":"172380.0"},"annualCostPerEmp":{"info":"Measures the annual cost per application development employee (represented as a full-time equivalent).","lower":"106080.0","mean":"132600.0","upper":"159120.0","number":null},"bespoke":{"info":"Measures the percentage of application development and maintenance spend for Bespoke software.  Include development and maintenance personnel, development tools, and outsourced services allocated to Bespoke software products.","value":"18.5"},"saas":{"info":"Measures the percentage of application development and maintenance spend for Software as a Service.  Include development and maintenance personnel, development tools, and outsourced services allocated to Software as a Service products.","value":"28.5"},"erp":{"info":"Measures the percentage of application development and maintenance spend for Enterprise Resource Planning software.  Include development and maintenance personnel, development tools, and outsourced services allocated to Enterprise Resource Planning software products.","value":"34.0"},"cots":{"info":"Measures the percentage of application development and maintenance spend for Commercial of the Shelf software.  Include development and maintenance personnel, development tools, and outsourced services allocated to Commercial of the Shelf software products.","value":"19.0"},"noOfReleasePerApp":{"info":"Measure the application release rate, calculated as the number of annual application releases divided by the total applications supported.","appReleaseNumber":"6.7","appReleaseLower":"9.3","appReleaseUpper":"5.1"},"automatedTesting":{"info":"Measures the percentage of application development testing and quality assurance that is performed through automated processes.","lower":"57.8","mean":null,"upper":"86.8","number":"72.3"},"averageBuildingTime":{"info":"Measures the average time to run the build process (fetching code, compiling code, running automated unit tests, linking libraries/code/files, producing/storing build logs etc.), in hours.","lower":"2.7","mean":null,"upper":"4.1","number":"3.4"},"developmentMethodoloy":{"agile":"39.9","hybrid":"28.3","none":"1.6","waterfall":"18.6","other":"11.6","info":"Measures the percentage of projects adhering to an Agile development methodology."},"offShore":{"info":"Measures the percentage of offshore resources leveraged to provide application development services.","lower":"47.8","mean":null,"upper":"71.8","number":"59.8"},"onBudget":{"info":"Measures the number of development projects completed on-budget as a percentage of the number of completed development projects.","lower":"82.6","mean":null,"upper":"91.2","number":"86.9"},"oneTimeDelivery":{"info":"Measures the number of development projects completed on-time as a percentage of the number of completed development projects.","lower":"71.6","mean":null,"upper":"79.2","number":"75.4"},"costAllocation":{"info":"Measures the cost allocation for personnel (including employees and contractors, but excluding managed service contracts).","personnelCostAllo":"65.8","outSourcingCostAllo":"27.3","toolsCostAllo":"6.9"},"contractor":{"info":"Measures the percent allocation for contracted full-time equivalent personnel (temporary workers who are not employed directly by the organization, but who are paid instead on a time and materials basis - examples are external consultants or freelance contractors).","lower":"21.0","mean":null,"upper":"34.0","number":"27.5"},"managedServices":{"info":"Measures the percent allocation for managed services full-time equivalent personnel (headcount assumed to be included within an outsourced/managed services agreement).","lower":"14.0","mean":"18.3","upper":"22.6","number":null},"employeeFTE":{"info":"Measures the percent allocation for employed full-time equivalent personnel (personnel directly employed by the organization - costs include salary, pension, benefits, bonuses, and other employee compensation).","lower":"43.4","mean":null,"upper":"65.0","number":"54.2"},"staffingMixADM":{"info":"Measures the percent allocation for application development managed services full-time equivalent personnel (headcount assumed to be included within an outsourced/managed services agreement).","adEmployee":"55.0","amEmployee":"45.0","adContarctor":"68.0","amContractor":"32.0","adServices":"61.0","amServices":"39.0"},"projectCostAllocationOnshore":{"info":"Measures the percentage of hours spent in the Coding phase (detailed programming design, build, unit and integration testing activity) for onshore resources.","onStrategyPlanning":"5.0","onshoreRequirement":"5.5","onshoreDesign":"8.5","onshoreCoding":"24.9","onshoreTesting":"4.8","onshoreImplement":"6.8","onshoreSustain":"4.5"},"projectCostAllocationOffshore":{"info":"Measures the percentage of hours spent in the Coding phase (detailed programming design, build, unit and integration testing activity) for offshore resources.","offStrategyPlanning":"3.4","offshoreRequirement":"3.6","offshoreDesign":"5.6","offshoreCoding":"16.6","offshoreTesting":"3.2","offshoreImplement":"4.6","offshoreSustain":"3.0"},"tcoPerHourWorked":{"info":"Measures the annual application development personnel costs per application development hour worked.","costPerHourNumber":"110.0","costPerHourLower":"88.0","costPerHourUpper":"132.0"},"pricePerHoursWorked":{"info":"Measures the annual application development personnel price per application development hour worked.","pricePerHoursNumber":"143.0","pricePerHoursLower":"114.0","pricePerHoursUpper":"172.0"},"charts":{"":[{"label":"Annual Cost Per Contracted FTE (Lower)","value":"137904.0"},{"label":"Annual Cost Per Contracted FTE (Mean)","value":"172380.0"},{"label":"Annual Cost Per Contracted FTE (Upper)","value":"206856.0"},{"label":"Annual Cost Per Employed FTE (Lower)","value":"106080.0"},{"label":"Annual Cost Per Employed FTE (Mean)","value":"132600.0"},{"label":"Annual Cost Per Employed FTE (Upper)","value":"159120.0"},{"label":"Bespoke %","value":"18.5"},{"label":"COTS %","value":"19.0"},{"label":"Application Development Cost %","value":"46.2"},{"label":"ERP %","value":"34.0"},{"label":"Application Maintenance Cost %","value":"53.8"},{"label":"SaaS %","value":"28.5"},{"label":"Application Development Contractor FTE %","value":"68.0"},{"label":"Application Development Employee FTE %","value":"55.0"},{"label":"Application Development Managed Services FTE %","value":"61.0"},{"label":"Application Maintenance Contractor FTE %","value":"32.0"},{"label":"Application Maintenance Employee FTE %","value":"45.0"},{"label":"Application Maintenance Managed Services FTE %","value":"39.0"},{"label":"Personnel Cost Allocation %","value":"65.8"},{"label":"Outsourcing Cost Allocation %","value":"27.3"},{"label":"Tools Cost Allocation %","value":"6.9"},{"label":"Number of Releases Per Application","value":"9.3"},{"label":"Number of Releases Per Application","value":"6.7"},{"label":"Number of Releases Per Application","value":"5.1"},{"label":"Automated Testing % (Lower)","value":"57.8"},{"label":"Automated Testing % (Mean)","value":"72.3"},{"label":"Automated Testing % (Upper)","value":"86.8"},{"label":"Average Build Time (Lower)","value":"2.7"},{"label":"Average Build Time (Mean)","value":"3.4"},{"label":"Average Build Time (Upper)","value":"4.1"},{"label":"TCO Per Hour Worked - Current Year (Lower)","value":"88.0"},{"label":"TCO Per Hour Worked - Current Year","value":"110.0"},{"label":"TCO Per Hour Worked - Current Year (Upper)","value":"132.0"},{"label":"Price Per Hour Worked - Current Year (Lower)","value":"114.0"},{"label":"Price Per Hour Worked - Current Year","value":"143.0"},{"label":"Price Per Hour Worked - Current Year (Upper)","value":"172.0"},{"label":"Development Methodology % Agile","value":"39.9"},{"label":"Development Methodology % Hybrid","value":"28.3"},{"label":"Development Methodology % None","value":"1.6"},{"label":"Development Methodology % Other","value":"11.6"},{"label":"Development Methodology % Waterfall","value":"18.6"},{"label":"Offshore % (Lower)","value":"47.8"},{"label":"Offshore % (Mean)","value":"59.8"},{"label":"Offshore % (Upper)","value":"71.8"},{"label":"On-Budget % (Lower)","value":"82.6"},{"label":"On-Budget % (Mean)","value":"86.9"},{"label":"On-Budget % (Upper)","value":"91.2"},{"label":"On-Time Delivery % (Lower)","value":"71.6"},{"label":"On-Time Delivery % (Mean)","value":"75.4"},{"label":"On-Time Delivery % (Upper)","value":"79.2"},{"label":"Offshore Coding % Effort","value":"16.6"},{"label":"Offshore Design % Effort","value":"5.6"},{"label":"Offshore Implement % Effort","value":"4.6"},{"label":"Offshore Requirements % Effort","value":"3.6"},{"label":"Offshore Strategy and Planning % Effort","value":"3.4"},{"label":"Offshore Sustain % Effort","value":"3.0"},{"label":"Offshore Testing % Effort","value":"3.2"},{"label":"Onshore Coding % Effort","value":"24.9"},{"label":"Onshore Design % Effort","value":"8.5"},{"label":"Onshore Implement % Effort","value":"6.8"},{"label":"Onshore Requirements % Effort","value":"5.5"},{"label":"Onshore Strategy and Planning % Effort","value":"5.0"},{"label":"Onshore Sustain % Effort","value":"4.5"},{"label":"Onshore Testing % Effort","value":"4.8"},{"label":"Contractor FTE % (Lower)","value":"21.0"},{"label":"Contractor FTE % (Mean)","value":"27.5"},{"label":"Contractor FTE % (Upper)","value":"34.0"},{"label":"Employee FTE % (Lower)","value":"43.4"},{"label":"Employee FTE % (Mean)","value":"54.2"},{"label":"Employee FTE % (Upper)","value":"65.0"},{"label":"Managed Services FTE % (Lower)","value":"14.0"},{"label":"Managed Services FTE % (Mean)","value":"18.3"},{"label":"Managed Services FTE % (Upper)","value":"22.6"}],"TCOPerHourWorkedCurrentYear":[{"label":"Annual Offshore Contractor Cost per Hour Worked","value":"40.0"},{"label":"Annual Offshore Employed Cost per Hour Worked","value":"33.0"},{"label":"Annual Onshore Contractor Cost per Hour Worked","value":"173.0"},{"label":"Annual Onshore Employed Cost per Hour Worked","value":"139.0"}],"PricePerHourWorkedCurrentYear":[{"label":"Annual Offshore FTP Price per Hour Worked","value":"40.0"},{"label":"Annual Offshore T&M Price per Hour Worked","value":"48.0"},{"label":"Annual Onshore FTP Price per Hour Worked","value":"167.0"},{"label":"Annual Onshore T&M Price per Hour Worked","value":"208.0"}]},"tower":{"key":"1","value":"CIO DASHBOARD","id":""}};

    //landing page data load
    object.applicationDevelopmentLanding.getData().subscribe((allData: any) => {
      object.applicationDevelopmentData = allData;
      if(object.applicationDevelopmentData!=undefined && object.applicationDevelopmentData!=null)
      {
        object.landingPageDataLoaded=true;
        object.isAllReleventDataLoaded();
      }
      else
      {
        object.landingPageDataLoaded=false;
        object.showApplicationDevelopmentData=false;
      }
     
      object.updateDrillDown();
      this.compareServicedeskInputData();

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


    // get group definition information
    object.industrySizeService.getDefinitionDataWithoutIndustrySize().subscribe((data: any) => {
      object.ADDefinitionData = data;
      console.log("ADdefinitaion==>> ", object.ADDefinitionData);
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

      object.selectedIndustries=[];

      //set default selection
      let temp: any ={}; 

      temp.id = "";
      temp.key="Grand Total";
      temp.value = "All Industries";
      object.selectedIndustries.push(temp);

      //let scanrioId = 0;
      for (let index in object.data.industries) {
        let option: any = {};
      
        option.id = object.data.industries[index].id;
        option.key= object.data.industries[index].key;
        option.value = object.data.industries[index].value;
        object.selectedIndustries.push(option);
        
        
     }

      object.selectedindustry = object.selectedIndustries[0];
      if (object.data.industries != undefined && object.data.industries != null) {
        object.industryDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.industryDataLoaded = false;
        object.showApplicationDevelopmentData = false;
      }

      
    },(error)=>{
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

      object.selectedsizes=[];


      //set default selection
      let temp1: any ={}; 

      temp1.id = "";
      temp1.key="Grand Total";
      temp1.value = "All Sizes";
      object.selectedsizes.push(temp1);

      for (let index in object.data.revenue) {
        let option: any = {};
      
        option.id = object.data.revenue[index].id;
        option.key= object.data.revenue[index].key;
        option.value = object.data.revenue[index].value;
        object.selectedsizes.push(option);
        
        
     }

     object.selectedsize = object.selectedsizes[0];
     object.revenueFilterLoaded = true;
     object.isAllReleventDataLoaded();
     
     object.selectedindustry = object.selectedIndustries[0];
    //  if ( object.data.revenue != undefined &&  object.data.revenue != null) {
       
    //  }
    //  else {
    //    object.revenueFilterLoaded = false;
    //    object.showApplicationDevelopmentData = false;
    //  }
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

    // object.showApplicationDevelopmentData = true;
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
          "dashboardId": "12",
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
    this.showDiv = true;
    this.updateCompareData();
    this.compareServicedeskInputData();
  }

  compareServicedeskInputData() {

    try {
      let object = this;

      object.personnelEquality = false;
      object.softwareEquality =false;
      object.outSourceEquality =false;
      object.costPerEmplyeeEquality =false;
      object.costPerContractorEquality =false;
      object.offshoreEquality =false;
      object.staffingMixEmployeeEquality =false;
      object.staffingMixContractorEquality =false;
      object.onTimeDeliveryEquality =false;
      object.onBudgetDeliveryEquality =false;
      object.pricePerHourEquality =false;
      object.costPerHourEquality =false;
      object.toolsEquality =false;
      object.saasEquality =false;
      object.erpEquality =false;
      object.cotsEquality =false;
      object.bespokeEquality =false;
      object.buildTimeEquality =false;
      object.automatedtestingEquality =false;
      object.managedServiceEquality =false;
      object.ADMADManagedEquality =false;
      object.ADMAMManagedEquality =false;
      object.ADMADEmployeeEquality =false;
      object.ADMAMEmployeeEquality =false;
      object.ADMADContractEquality =false;
      object.ADMAMContractEquality =false;
      object.appReleaseRateEquality =false;
      object.onshorePlanningEffortEquality =false;
      object.onshoreRequirementEffortEquality =false;
      object.onshoreDesignEffortEquality =false;
      object.onshoreCodingEffortEquality =false;
      object.onshoreTestingEffortEquality =false;
      object.onshoreImplementEffortEquality =false;
      object.onshoreSustainEffortEquality =false;
      object.offshorePlanningEffortEquality =false;
      object.offshoreRequirementEffortEquality =false;
      object.offshoreDesignEffortEquality =false;
      object.offshoreCodingEffortEquality =false;
      object.offshoreTestingEffortEquality =false;
      object.offshoreImplementEffortEquality =false;
     object.offshoreSustainEffortEquality =false;
     object.adCostEquality = false;
     object.amCostEquality = false;
   
         let storageMap = new MapSourceCodeDataValues();
         
         object.NEGATIVE_CONST = negativeConstant.NEGATIVE_CONSTANT;
         object.scenarioData = object.ADSharedService.getData().comparisionData;
         let mapdata1 = storageMap.mapData(object.scenarioData);
         object.mapdata = object.replaceNullValue(mapdata1);
         console.log(object.mapdata);
         console.log("mapdata1",mapdata1);

      if(mapdata1.PR0900 == this.NEGATIVE_CONST){
        object.enterMyData.agile = "No";
        object.enterMyData.waterfall = "No";
        object.enterMyData.sdlchybrid = "No";
        object.enterMyData.sdlcnone = "No";
        object.enterMyData.sdlcothers = "No";
      }else{

        if(object.mapdata.PR0900 == "Hybrid"){
          object.enterMyData.sdlchybrid = "Yes";
          object.enterMyData.agile = "No";
          object.enterMyData.waterfall = "No";
          object.enterMyData.sdlcnone = "No";
          object.enterMyData.sdlcothers = "No";
        }else if(object.mapdata.PR0900 == "None"){
          object.enterMyData.sdlcnone = "Yes";
          object.enterMyData.agile = "No";
          object.enterMyData.waterfall = "No";
          object.enterMyData.sdlchybrid = "No";
          object.enterMyData.sdlcothers = "No";
        }else if(object.mapdata.PR0900 == "Agile"){
          object.enterMyData.agile = "Yes";
          object.enterMyData.waterfall = "No";
          object.enterMyData.sdlchybrid = "No";
          object.enterMyData.sdlcnone = "No";
          object.enterMyData.sdlcothers = "No";
        }else if(object.mapdata.PR0900 == "Waterfall"){
          object.enterMyData.waterfall = "Yes";
          object.enterMyData.agile = "No";
          object.enterMyData.sdlchybrid = "No";
          object.enterMyData.sdlcnone = "No";
          object.enterMyData.sdlcothers = "No";
        }else if(object.mapdata.PR0900 == "Other"){
          object.enterMyData.sdlcothers = "Yes";
          object.enterMyData.agile = "No";
          object.enterMyData.waterfall = "No";
          object.enterMyData.sdlchybrid = "No";
          object.enterMyData.sdlcnone = "No";
        }

      }

      //AD cost allocation
      //personnel
      //( DAD150 + DAD155 ) / ( DAD150 + DAD155 + DAD165 + DAD170 )

      if (mapdata1.DAD150 == this.NEGATIVE_CONST
        && mapdata1.DAD155 == this.NEGATIVE_CONST
        && mapdata1.DAD165 == this.NEGATIVE_CONST
        && mapdata1.DAD170 == this.NEGATIVE_CONST) {
        object.enterMyData.costAllocationPersonnel = this.NEGATIVE_CONST;
      }
      else {
        object.enterMyData.costAllocationPersonnel = (eval("((object.mapdata.DAD150 + object.mapdata.DAD155) / (object.mapdata.DAD150 + object.mapdata.DAD155  + object.mapdata.DAD165 + object.mapdata.DAD170) )") * 100);
        object.enterMyData.costAllocationPersonnel = Number.isNaN(object.enterMyData.costAllocationPersonnel) ? object.NEGATIVE_CONST : object.enterMyData.costAllocationPersonnel;
      }

      let temp50 = Number((object.enterMyData.costAllocationPersonnel)).toFixed(1);
      let temp51 = Number(object.applicationDevelopmentData.costAllocation.personnelCostAllo).toFixed(1);

      if (temp50 == temp51) {
        this.personnelEquality = true;
      }

      // this.enterMyData.staffingmixEmployee = 0.6322;

      if (this.enterMyData.costAllocationPersonnel == Infinity || this.enterMyData.costAllocationPersonnel == 'infinity' || this.enterMyData.staffingmixEmployee == "Infinity" || isNaN(this.enterMyData.staffingmixEmployee)) {
        this.enterMyData.costAllocationPersonnel = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.costAllocationPersonnel)) {
        this.enterMyData.costAllocationPersonnel = this.enterMyData.costAllocationPersonnel;
      } else {
        this.enterMyData.costAllocationPersonnel = 0;
      }


      //outsourcing
      //( DAD170 ) / ( DAD150 + DAD155 + DAD165 + DAD170 )


      if (mapdata1.DAD150 == this.NEGATIVE_CONST
        && mapdata1.DAD155 == this.NEGATIVE_CONST
        && mapdata1.DAD165 == this.NEGATIVE_CONST
        && mapdata1.DAD170 == this.NEGATIVE_CONST) {
        object.enterMyData.costAllocationOutsource = this.NEGATIVE_CONST;
      }
      else {
        object.enterMyData.costAllocationOutsource = (eval("((object.mapdata.DAD170) / (object.mapdata.DAD150 + object.mapdata.DAD155  + object.mapdata.DAD165 + object.mapdata.DAD170) )") * 100);
        object.enterMyData.costAllocationOutsource = Number.isNaN(object.enterMyData.costAllocationOutsource) ? object.NEGATIVE_CONST : object.enterMyData.costAllocationOutsource;
      }

      let temp52 = Number((object.enterMyData.costAllocationOutsource)).toFixed(1);
      let temp53 = Number(object.applicationDevelopmentData.costAllocation.outSourcingCostAllo).toFixed(1);

      if (temp52 == temp53) {
        this.outSourceEquality = true;
      }

      // this.enterMyData.staffingmixEmployee = 0.6322;

      if (this.enterMyData.costAllocationOutsource == Infinity || this.enterMyData.costAllocationOutsource == 'infinity' || this.enterMyData.costAllocationOutsource == "Infinity" || isNaN(this.enterMyData.costAllocationOutsource)) {
        this.enterMyData.costAllocationOutsource = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.costAllocationOutsource)) {
        this.enterMyData.costAllocationOutsource = this.enterMyData.costAllocationOutsource;
      } else {
        this.enterMyData.costAllocationOutsource = 0;
      }

      //tools
      //( DAD165 ) / ( DAD150 + DAD155 + DAD165 + DAD170 )

      if (mapdata1.DAD150 == this.NEGATIVE_CONST
        && mapdata1.DAD155 == this.NEGATIVE_CONST
        && mapdata1.DAD165 == this.NEGATIVE_CONST
        && mapdata1.DAD170 == this.NEGATIVE_CONST) {
        object.enterMyData.costAllocationTools = this.NEGATIVE_CONST;
      }
      else {
        object.enterMyData.costAllocationTools = (eval("((object.mapdata.DAD165) / (object.mapdata.DAD150 + object.mapdata.DAD155  + object.mapdata.DAD165 + object.mapdata.DAD170) )") * 100);
        object.enterMyData.costAllocationTools = Number.isNaN(object.enterMyData.costAllocationTools) ? object.NEGATIVE_CONST : object.enterMyData.costAllocationTools;
      }

      let temp54 = Number((object.enterMyData.costAllocationTools)).toFixed(1);
      let temp55 = Number(object.applicationDevelopmentData.costAllocation.toolsCostAllo).toFixed(1);

      if (temp54 == temp55) {
        this.toolsEquality = true;
      }

      // this.enterMyData.staffingmixEmployee = 0.6322;

      if (this.enterMyData.costAllocationTools == Infinity || this.enterMyData.costAllocationTools == 'infinity' || this.enterMyData.costAllocationTools == "Infinity" || isNaN(this.enterMyData.costAllocationTools)) {
        this.enterMyData.costAllocationTools = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.costAllocationTools)) {
        this.enterMyData.costAllocationTools = this.enterMyData.costAllocationTools;
      } else {
        this.enterMyData.costAllocationTools = 0;
      }


      //ADM cost allocation
      //saas
      //AMR455

      if (object.mapdata.AMR455 == object.NEGATIVE_CONST) {
        object.enterMyData.saas = this.NEGATIVE_CONST;
      }
      else {
        object.enterMyData.saas = (eval("(object.mapdata.AMR455)"));
        object.enterMyData.saas = Number.isNaN(object.enterMyData.saas) ? object.NEGATIVE_CONST : object.enterMyData.saas;
      }

      let temp56 = Number((object.enterMyData.saas)).toFixed(1);
      let temp57 = Number(object.applicationDevelopmentData.saas.value).toFixed(1);

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

      //erp
      //AMR460

      if (object.mapdata.AMR460 == object.NEGATIVE_CONST) {
        object.enterMyData.erp = this.NEGATIVE_CONST;
      }
      else {
        object.enterMyData.erp = (eval("(object.mapdata.AMR460)"));
        object.enterMyData.erp = Number.isNaN(object.enterMyData.erp) ? object.NEGATIVE_CONST : object.enterMyData.erp;
      }

      let temp60 = Number((object.enterMyData.erp)).toFixed(1);
      let temp61 = Number(object.applicationDevelopmentData.OnPremiseBusinessSystem.value).toFixed(1);

      if (temp60 == temp61) {
        this.erpEquality = true;
      }
      // this.enterMyData.staffingmixEmployee = 0.6322;

      if (this.enterMyData.erp == Infinity || this.enterMyData.erp == 'infinity' || this.enterMyData.erp == "Infinity" || isNaN(this.enterMyData.erp)) {
        this.enterMyData.erp = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.erp)) {
        this.enterMyData.erp = this.enterMyData.erp;
      } else {
        this.enterMyData.erp = 0;
      }

      //cots
      //AMR465

      if (object.mapdata.AMR465 == object.NEGATIVE_CONST) {
        object.enterMyData.cots = this.NEGATIVE_CONST;
      }
      else {
        object.enterMyData.cots = (eval("(object.mapdata.AMR465)"));
        object.enterMyData.cots = Number.isNaN(object.enterMyData.cots) ? object.NEGATIVE_CONST : object.enterMyData.cots;
      }


      let temp58 = Number((object.enterMyData.cots)).toFixed(1);
      let temp59 = Number(object.applicationDevelopmentData.cots.value).toFixed(1);

      if (temp56 == temp57) {
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

      if (object.mapdata.AMR470 == object.NEGATIVE_CONST) {
        object.enterMyData.bespoke = this.NEGATIVE_CONST;
      }
      else {
        object.enterMyData.bespoke = (eval("(object.mapdata.AMR470)"));
        object.enterMyData.bespoke = Number.isNaN(object.enterMyData.bespoke) ? object.NEGATIVE_CONST : object.enterMyData.bespoke;
      }

      let temp62 = Number((object.enterMyData.bespoke)).toFixed(1);
      let temp63 = Number(object.applicationDevelopmentData.bespoke.value).toFixed(1);

      if (temp62 == temp63) {
        this.bespokeEquality = true;
      }

      // this.enterMyData.staffingmixEmployee = 0.6322;

      if (this.enterMyData.bespoke == Infinity || this.enterMyData.bespoke == 'infinity' || this.enterMyData.bespoke == "Infinity" || isNaN(this.enterMyData.bespoke)) {
        this.enterMyData.bespoke = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.bespoke)) {
        this.enterMyData.bespoke = this.enterMyData.bespoke;
      } else {
        this.enterMyData.bespoke = 0;
      }

      //average build time
      //P77050

      if (object.mapdata.P77050 == object.NEGATIVE_CONST) {
        object.enterMyData.buildTime = this.NEGATIVE_CONST;
      }
      else {
        object.enterMyData.buildTime = (eval("(object.mapdata.P77050)"));
        object.enterMyData.buildTime = Number.isNaN(object.enterMyData.buildTime) ? object.NEGATIVE_CONST : object.enterMyData.buildTime;
      }

      let temp64 = (Number((object.enterMyData.buildTime))).toFixed(1);
      let temp65 = (Number(object.applicationDevelopmentData.averageBuildingTime.number)).toFixed(1);


      if (temp64 == temp65) {
        object.buildTimeEquality = true;
      }

      // this.enterMyData.staffingmixEmployee = 0.6322;

      if (this.enterMyData.buildTime == Infinity || this.enterMyData.buildTime == 'infinity' || this.enterMyData.buildTime == "Infinity" || isNaN(this.enterMyData.buildTime)) {
        this.enterMyData.buildTime = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.buildTime)) {
        this.enterMyData.buildTime = this.enterMyData.buildTime;
      } else {
        this.enterMyData.buildTime = 0;
      }

      //automated testing
      //P67085

      if (object.mapdata.P67085 == object.NEGATIVE_CONST) {
        object.enterMyData.automatedTesting = this.NEGATIVE_CONST;
      }
      else {
        object.enterMyData.automatedTesting = (eval("(object.mapdata.P67085)"));
        object.enterMyData.automatedTesting = Number.isNaN(object.enterMyData.automatedTesting) ? object.NEGATIVE_CONST : object.enterMyData.automatedTesting;
      }

      let temp66 = Number((object.enterMyData.automatedTesting)).toFixed(1);
      let temp67 = Number(object.applicationDevelopmentData.automatedTesting.number).toFixed(1);

      if (temp66 == temp67) {
        this.automatedtestingEquality = true;
      }

      // this.enterMyData.staffingmixEmployee = 0.6322;

      if (this.enterMyData.automatedTesting == Infinity || this.enterMyData.automatedTesting == 'infinity' || this.enterMyData.automatedTesting == "Infinity" || isNaN(this.enterMyData.automatedTesting)) {
        this.enterMyData.automatedTesting = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.automatedTesting)) {
        this.enterMyData.automatedTesting = this.enterMyData.automatedTesting;
      } else {
        this.enterMyData.automatedTesting = 0;
      }


      //annual cost FTE employee
      //DAD150 / EAD010

      if (mapdata1.DAD150 == this.NEGATIVE_CONST && mapdata1.EAD010 == this.NEGATIVE_CONST) {
        this.enterMyData.FTEEmployee = this.NEGATIVE_CONST;
      }
      else if (mapdata1.DAD150 == this.NEGATIVE_CONST) {
        this.enterMyData.FTEEmployee = 0;
      }
      else if (mapdata1.EAD010 == this.NEGATIVE_CONST) {
        this.enterMyData.FTEEmployee = this.NEGATIVE_CONST;
      }
      else {
        this.enterMyData.FTEEmployee = eval("(object.mapdata.DAD150) / (object.mapdata.EAD010)");
      }

      let temp15 = Math.round(Number(this.enterMyData.FTEEmployee));
      let temp16 = Math.round(Number(this.applicationDevelopmentData.annualCostPerEmp.mean));

      if (temp15 == temp16) {
        this.costPerEmplyeeEquality = true;
      }

      // this.enterMyData.staffingmixEmployee = 0.6322;

      if (this.enterMyData.FTEEmployee == Infinity || this.enterMyData.FTEEmployee == 'infinity' || this.enterMyData.FTEEmployee == "Infinity" || isNaN(this.enterMyData.FTEEmployee)) {
        this.enterMyData.FTEEmployee = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.FTEEmployee)) {
        this.enterMyData.FTEEmployee = this.enterMyData.FTEEmployee;
      } else {
        this.enterMyData.FTEEmployee = 0;
      }


      //annual cost FTE contractor
      //DAD155 / EAD020

      if (mapdata1.DAD155 == this.NEGATIVE_CONST && mapdata1.EAD020 == this.NEGATIVE_CONST) {
        this.enterMyData.FTEContractor = this.NEGATIVE_CONST;
      }
      else if (mapdata1.DAD155 == this.NEGATIVE_CONST) {
        this.enterMyData.FTEContractor = 0;
      }
      else if (mapdata1.DAD155 == this.NEGATIVE_CONST) {
        this.enterMyData.FTEContractor = this.NEGATIVE_CONST;
      }
      else {
        this.enterMyData.FTEContractor = eval("(object.mapdata.DAD155) / (object.mapdata.EAD020)");
      }

      let temp17 = Math.round(Number(this.enterMyData.FTEContractor));
      let temp18 = Math.round(Number(this.applicationDevelopmentData.annualCostPerContracted.number));

      if (temp17 == temp18) {
        this.costPerContractorEquality = true;
      }


      // this.enterMyData.staffingmixEmployee = 0.6322;

      if (this.enterMyData.FTEContractor == Infinity || this.enterMyData.FTEContractor == 'infinity' || this.enterMyData.FTEContractor == "Infinity" || isNaN(this.enterMyData.FTEContractor)) {
        this.enterMyData.FTEContractor = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.FTEContractor)) {
        this.enterMyData.FTEContractor = this.enterMyData.FTEContractor;
      } else {
        this.enterMyData.FTEContractor = 0;
      }

      // staffing mix employee
      // //EAD010 / ( EAD010 + EAD020 )

      if (mapdata1.EAD010 == this.NEGATIVE_CONST
        && mapdata1.EAD020 == this.NEGATIVE_CONST
        && mapdata1.EAD030 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixEmployee = this.NEGATIVE_CONST;
      }
      else if (mapdata1.EAD010 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixEmployee = this.NEGATIVE_CONST;
      }
      else if (mapdata1.EAD020 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixEmployee = eval("object.mapdata.EAD010 / (object.mapdata.EAD010 + 0)");
      }
      else {
        this.enterMyData.staffingmixEmployee = eval("object.mapdata.EAD010 / (object.mapdata.EAD010 + object.mapdata.EAD020 + object.mapdata.EAD030)");
      }

      let temp10 = Number((this.enterMyData.staffingmixEmployee * 100)).toFixed(1);
      let temp20 = Number((this.applicationDevelopmentData.employeeFTE.number)).toFixed(1);

      if (temp10 == temp20) {
        this.staffingMixEmployeeEquality = true;
      }

      // this.enterMyData.staffingmixEmployee = 0.6322;

      if (this.enterMyData.staffingmixEmployee == Infinity || this.enterMyData.staffingmixEmployee == 'infinity' || this.enterMyData.staffingmixEmployee == "Infinity" || isNaN(this.enterMyData.staffingmixEmployee)) {
        this.enterMyData.staffingmixEmployee = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.staffingmixEmployee)) {
        this.enterMyData.staffingmixEmployee = this.enterMyData.staffingmixEmployee;
      } else {
        this.enterMyData.staffingmixEmployee = 0;
      }

      // EAD020 / (EAD010+EAD020)
      //in case of null or empty value
      if (mapdata1.EAD010 == this.NEGATIVE_CONST
        && mapdata1.EAD020 == this.NEGATIVE_CONST
        && mapdata1.EAD030 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixContract = this.NEGATIVE_CONST;
      }
      else if (mapdata1.EAD020 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixContract = this.NEGATIVE_CONST;
      }
      else if (mapdata1.EAD010 == this.NEGATIVE_CONST) {
        this.enterMyData.staffingmixContract = eval("object.mapdata.EAD020 / (0+object.mapdata.EAD020)");
      }
      else {
        this.enterMyData.staffingmixContract = eval("object.mapdata.EAD020 / (object.mapdata.EAD010 + object.mapdata.EAD020 +object.mapdata.EAD030)");
      }

      let enterContract = (Number(this.enterMyData.staffingmixContract) * 100).toFixed(1);
      let userContract = Number(this.applicationDevelopmentData.annualCostPerContracted.number).toFixed(1);

      if (enterContract == userContract) {
        this.staffingMixContractorEquality = true;
      }

      // this.enterMyData.staffingmixContract = 0.3678;

      if (this.enterMyData.staffingmixContract == Infinity || this.enterMyData.staffingmixContract == 'infinity' || this.enterMyData.staffingmixContract == "Infinity" || isNaN(this.enterMyData.staffingmixContract)) {
        this.enterMyData.staffingmixContract = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.staffingmixContract)) {
        this.enterMyData.staffingmixContract = this.enterMyData.staffingmixContract;
      } else {
        this.enterMyData.staffingmixContract = 0;
      }

      //staffing mix managed services
      //EAD030 / ( EAD010 + EAD020 + EAD030 )

      if (mapdata1.EAD030 == this.NEGATIVE_CONST
        && mapdata1.EAD010 == this.NEGATIVE_CONST
        && mapdata1.EAD020 == this.NEGATIVE_CONST) {
        this.enterMyData.managedServices = this.NEGATIVE_CONST;
      }
      else {
        this.enterMyData.managedServices = eval("object.mapdata.EAD030 / (object.mapdata.EAD010 + object.mapdata.EAD020+ object.mapdata.EAD030)");
      }

      let temp68 = Number((this.enterMyData.managedServices * 100)).toFixed(1);
      let temp69 = Number((this.applicationDevelopmentData.managedServices.mean)).toFixed(1);

      if (temp68 == temp69) {
        this.managedServiceEquality = true;
      }

      // this.enterMyData.managedServices = 0.6322;

      if (this.enterMyData.managedServices == Infinity || this.enterMyData.managedServices == 'infinity' || this.enterMyData.managedServices == "Infinity" || isNaN(this.enterMyData.managedServices)) {
        this.enterMyData.managedServices = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.managedServices)) {
        this.enterMyData.managedServices = this.enterMyData.managedServices;
      } else {
        this.enterMyData.managedServices = 0;
      }

      //staffing mix ADM AD managed services
      //EAD030 / ( EAD030 + EAM030 )

      if (mapdata1.EAD030 == this.NEGATIVE_CONST
        && mapdata1.EAM030 == this.NEGATIVE_CONST) {
        this.enterMyData.ADMADManagedServices = this.NEGATIVE_CONST;
      }
      else {
        this.enterMyData.ADMADManagedServices = eval("object.mapdata.EAD030 / (object.mapdata.EAD030 + object.mapdata.EAM030)");
      }

      let temp70 = Number((this.enterMyData.ADMADManagedServices * 100)).toFixed(1);
      let temp71 = Number((this.applicationDevelopmentData.staffingMixADM.adServices)).toFixed(1);

      if (temp70 == temp71) {
        this.ADMADManagedEquality = true;
      }

      // this.enterMyData.managedServices = 0.6322;

      if (this.enterMyData.ADMADManagedServices == Infinity || this.enterMyData.ADMADManagedServices == 'infinity' || this.enterMyData.ADMADManagedServices == "Infinity" || isNaN(this.enterMyData.ADMADManagedServices)) {
        this.enterMyData.ADMADManagedServices = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.ADMADManagedServices)) {
        this.enterMyData.ADMADManagedServices = this.enterMyData.ADMADManagedServices;
      } else {
        this.enterMyData.ADMADManagedServices = 0;
      }

      //staffing mix ADM AM managed services
      //EAM030 / ( EAD030 + EAM030 )

      if (mapdata1.EAD030 == this.NEGATIVE_CONST
        && mapdata1.EAM030 == this.NEGATIVE_CONST) {
        this.enterMyData.ADMAMManagedServices = this.NEGATIVE_CONST;
      }
      else {
        this.enterMyData.ADMAMManagedServices = eval("object.mapdata.EAM030 / (object.mapdata.EAD030 + object.mapdata.EAM030)");
      }

      let temp72 = Number((this.enterMyData.ADMAMManagedServices * 100)).toFixed(1);
      let temp73 = Number((this.applicationDevelopmentData.staffingMixADM.amServices)).toFixed(1);

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

      //staffing mix ADM AD employee fte
      //EAD010 / ( EAD010 + EAM010 )


      if (mapdata1.EAD010 == this.NEGATIVE_CONST
        && mapdata1.EAM010 == this.NEGATIVE_CONST) {
        this.enterMyData.ADMADMEmployeeStaffMix = this.NEGATIVE_CONST;
      }
      else {
        this.enterMyData.ADMADMEmployeeStaffMix = eval("object.mapdata.EAD010 / (object.mapdata.EAD010 + object.mapdata.EAM010)");
      }

      let temp76 = Number((this.enterMyData.ADMADMEmployeeStaffMix * 100)).toFixed(1);
      let temp77 = Number((this.applicationDevelopmentData.staffingMixADM.adEmployee)).toFixed(1);

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

      //staffing mix ADM AM employee
      //EAM010 / ( EAD010 + EAM010 )


      if (mapdata1.EAM010 == this.NEGATIVE_CONST
        && mapdata1.EAD010 == this.NEGATIVE_CONST) {
        this.enterMyData.ADMAMMEmployeeStaffMix = this.NEGATIVE_CONST;
      }
      else {
        this.enterMyData.ADMAMMEmployeeStaffMix = eval("object.mapdata.EAM010 / (object.mapdata.EAD010 + object.mapdata.EAM010)");
      }

      let temp78 = Number((this.enterMyData.ADMAMMEmployeeStaffMix * 100)).toFixed(1);
      let temp79 = Number((this.applicationDevelopmentData.staffingMixADM.amEmployee)).toFixed(1);

      if (temp78 == temp79) {
        this.ADMAMEmployeeEquality = true;
      }

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

      //staffing mix ADM AD contractor fte
      //EAD020 / ( EAD020 + EAM020 )



      if (mapdata1.EAD020 == this.NEGATIVE_CONST
        && mapdata1.EAM020 == this.NEGATIVE_CONST) {
        this.enterMyData.ADMADMContractStaffMix = this.NEGATIVE_CONST;
      }
      else {
        this.enterMyData.ADMADMContractStaffMix = eval("object.mapdata.EAD020 / (object.mapdata.EAD020 + object.mapdata.EAM020)");
      }

      let temp80 = Number((this.enterMyData.ADMADMContractStaffMix * 100)).toFixed(1);
      let temp81 = Number((this.applicationDevelopmentData.staffingMixADM.adContractor)).toFixed(1);

      if (temp80 == temp81) {
        this.ADMADContractEquality = true;
      }

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

      //staffing mix ADM AM contract
      //EAM020 / ( EAD020 + EAM020 )

      if (mapdata1.EAD020 == this.NEGATIVE_CONST
        && mapdata1.EAM020 == this.NEGATIVE_CONST) {
        this.enterMyData.ADMAMMContractStaffMix = this.NEGATIVE_CONST;
      }
      else {
        this.enterMyData.ADMAMMContractStaffMix = eval("object.mapdata.EAM020 / (object.mapdata.EAD020 + object.mapdata.EAM020)");
      }

      let temp82 = Number((this.enterMyData.ADMAMMContractStaffMix * 100)).toFixed(1);
      let temp83 = Number((this.applicationDevelopmentData.staffingMixADM.amContractor)).toFixed(1);

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



      // //offshore
      // //( P51005 + P51025 ) / P21090
      if (mapdata1.P51005 == this.NEGATIVE_CONST && mapdata1.P51025 == this.NEGATIVE_CONST && mapdata1.P21090 == this.NEGATIVE_CONST) {
        this.enterMyData.offshore = this.NEGATIVE_CONST;
      }
      else if (mapdata1.P51005 == this.NEGATIVE_CONST) {
        this.enterMyData.offshore = eval("(0 + object.mapdata.P51025) / (object.mapdata.P21090)");
      }
      else if (mapdata1.P51025 == this.NEGATIVE_CONST) {
        this.enterMyData.offshore = eval("(0 + object.mapdata.P51005) / (object.mapdata.P21090)");
      }
      else if (mapdata1.P21090 == this.NEGATIVE_CONST) {
        this.enterMyData.offshore = this.NEGATIVE_CONST;
      }
      else {
        this.enterMyData.offshore = eval("(object.mapdata.P51005 + object.mapdata.P51025) / (object.mapdata.P21090)");
      }

      let temp13 = Number((this.enterMyData.offshore * 100)).toFixed(1);
      let temp14 = Number((this.applicationDevelopmentData.offShore.number)).toFixed(1);

      if (temp13 == temp14) {
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

      // //average project size
      // //P21090 / ADR300


      // if(object.mapdata.P21090 == this.NEGATIVE_CONST && object.mapdata.ADR300 == this.NEGATIVE_CONST)
      // {
      //   this.enterMyData.averageProjectSize = this.NEGATIVE_CONST;
      // }
      // else if(object.mapdata.P21090 == this.NEGATIVE_CONST)
      // {
      //   this.enterMyData.averageProjectSize =  0;
      // }
      // else if(object.mapdata.ADR300 == this.NEGATIVE_CONST)
      // {
      //   this.enterMyData.averageProjectSize =  this.NEGATIVE_CONST;
      // }
      // else
      // {
      //   this.enterMyData.averageProjectSize = eval("(object.mapdata.P21090) / (object.mapdata.ADR300)");
      // }

      // let temp19 = Math.round((this.enterMyData.averageProjectSize));
      // let temp21 = Math.round((object.applicationDevelopmentData.data.AverageProjectSizeinhours.ProjectSize.Number.value));

      // if (temp19 == temp21)
      // {
      //   this.avgProjectSizeEquality = true;
      // }

      // if(this.enterMyData.averageProjectSize == Infinity || this.enterMyData.averageProjectSize == 'infinity' || this.enterMyData.averageProjectSize == "Infinity" || isNaN(this.enterMyData.averageProjectSize)) {
      //   this.enterMyData.averageProjectSize = this.NEGATIVE_CONST;
      // } else if(Number(this.enterMyData.averageProjectSize)) {
      //   this.enterMyData.averageProjectSize = this.enterMyData.averageProjectSize;
      // } else {
      //   this.enterMyData.averageProjectSize = 0;
      // }

      //on time delivery
      //P21055 / ADR300


      if (mapdata1.P21055 == this.NEGATIVE_CONST && mapdata1.ADR300 == this.NEGATIVE_CONST) {
        this.enterMyData.onTimeDelivery = this.NEGATIVE_CONST;
      }
      else if (mapdata1.P21055 == this.NEGATIVE_CONST) {
        this.enterMyData.onTimeDelivery = 0;
      }
      else if (mapdata1.ADR300 == this.NEGATIVE_CONST) {
        this.enterMyData.onTimeDelivery = this.NEGATIVE_CONST;
      }
      else {
        this.enterMyData.onTimeDelivery = eval("(object.mapdata.P21055) / (object.mapdata.ADR300)") * 100;
      }


      let temp22 = (this.enterMyData.onTimeDelivery).toFixed(1);
      let temp23 = Number(object.applicationDevelopmentData.oneTimeDelivery.number).toFixed(1);


      if (temp22 == temp23) {
        this.onTimeDeliveryEquality = true;
      }

      if (this.enterMyData.onTimeDelivery == Infinity || this.enterMyData.onTimeDelivery == 'infinity' || this.enterMyData.onTimeDelivery == "Infinity" || isNaN(this.enterMyData.onTimeDelivery)) {
        this.enterMyData.onTimeDelivery = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.onTimeDelivery)) {
        this.enterMyData.onTimeDelivery = this.enterMyData.onTimeDelivery;
      } else {
        this.enterMyData.onTimeDelivery = 0;
      }

      // //on budget delivery
      // //P21085 / ADR300



      if (mapdata1.P21085 == this.NEGATIVE_CONST && mapdata1.ADR300 == this.NEGATIVE_CONST) {
        this.enterMyData.onBudgetDelivery = this.NEGATIVE_CONST;
      }
      else if (mapdata1.P21085 == this.NEGATIVE_CONST) {
        this.enterMyData.onBudgetDelivery = 0;
      }
      else if (mapdata1.ADR300 == this.NEGATIVE_CONST) {
        this.enterMyData.onBudgetDelivery = this.NEGATIVE_CONST;
      }
      else {
        this.enterMyData.onBudgetDelivery = eval("(object.mapdata.P21085) / (object.mapdata.ADR300)") * 100;
      }


      let temp24 = (this.enterMyData.onBudgetDelivery).toFixed(1);
      let temp25 = Number(object.applicationDevelopmentData.onBudget.number).toFixed(1);


      if (temp24 == temp25) {
        this.onBudgetDeliveryEquality = true;
      }

      if (this.enterMyData.onBudgetDelivery == Infinity || this.enterMyData.onBudgetDelivery == 'infinity' || this.enterMyData.onBudgetDelivery == "Infinity" || isNaN(this.enterMyData.onBudgetDelivery)) {
        this.enterMyData.onBudgetDelivery = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.onBudgetDelivery)) {
        this.enterMyData.onBudgetDelivery = this.enterMyData.onBudgetDelivery;
      } else {
        this.enterMyData.onBudgetDelivery = 0;
      }

      //application release rate
      //      P77010 / AMR300

      if (mapdata1.P77010 == this.NEGATIVE_CONST && mapdata1.AMR300 == this.NEGATIVE_CONST) {
        this.enterMyData.applicationReleaseRate = this.NEGATIVE_CONST;
      }
      else {
        this.enterMyData.applicationReleaseRate = eval("(object.mapdata.P77010) / (object.mapdata.AMR300)");
      }


      let temp84 = (Number(this.enterMyData.applicationReleaseRate)).toFixed(1);
      let temp85 = (Number(object.applicationDevelopmentData.noOfReleasePerApp.appReleaseNumber)).toFixed(1);


      if (temp84 == temp85) {
        this.appReleaseRateEquality = true;
      }

      if (this.enterMyData.applicationReleaseRate == Infinity ||
        this.enterMyData.applicationReleaseRate == 'infinity' ||
        this.enterMyData.applicationReleaseRate == "Infinity" ||
        isNaN(this.enterMyData.applicationReleaseRate)) {
        this.enterMyData.applicationReleaseRate = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.applicationReleaseRate)) {
        this.enterMyData.applicationReleaseRate = this.enterMyData.applicationReleaseRate;
      } else {
        this.enterMyData.onBudgetDelivery = 0;
      }

      //development methodology

      //waterfall
      // //PR0920
      // if(object.mapdata.PR0920 == this.NEGATIVE_CONST)
      // {
      //   this.enterMyData.waterfall = this.NEGATIVE_CONST;
      // }
      // else
      // {
      //   this.enterMyData.waterfall = eval("(object.mapdata.PR0920)") * 100;
      // }


      // let temp30 = Math.round(this.enterMyData.waterfall);
      // let temp31 = Math.round(Number(object.applicationDevelopmentData.data.DevelopmentMethodology.DevelopmentMethodology.Waterfall.value));


      // if (temp30 == temp31)
      // {
      //   this.devMethodWaterfallEquality = true;
      // }

      // if(this.enterMyData.waterfall == Infinity || this.enterMyData.waterfall == 'infinity' || this.enterMyData.waterfall == "Infinity" || isNaN(this.enterMyData.waterfall)) {
      //   this.enterMyData.waterfall = this.NEGATIVE_CONST;
      // } else if(Number(this.enterMyData.waterfall)) {
      //   this.enterMyData.waterfall = this.enterMyData.waterfall;
      // } else {
      //   this.enterMyData.waterfall = 0;
      // }


      // //agile
      // //PR0905
      // if(object.mapdata.PR0905 == this.NEGATIVE_CONST)
      // {
      //   this.enterMyData.agile = this.NEGATIVE_CONST;
      // }
      // else
      // {
      //   this.enterMyData.agile = eval("(object.mapdata.PR0905)") * 100;
      // }


      // let temp26 = Math.round(this.enterMyData.agile);
      // let temp27 = Math.round(Number(object.applicationDevelopmentData.data.DevelopmentMethodology.DevelopmentMethodology.Agile.value));


      // if (temp26 == temp27)
      // {
      //   this.devMethodAgileEquality = true;
      // }

      // if(this.enterMyData.agile == Infinity || this.enterMyData.agile == 'infinity' || this.enterMyData.agile == "Infinity" || isNaN(this.enterMyData.agile)) {
      //   this.enterMyData.agile = this.NEGATIVE_CONST;
      // } else if(Number(this.enterMyData.agile)) {
      //   this.enterMyData.agile = this.enterMyData.agile;
      // } else {
      //   this.enterMyData.agile = 0;
      // }


      // //hybrid
      // //PR0910
      // if(object.mapdata.PR0910 == this.NEGATIVE_CONST)
      // {
      //   this.enterMyData.sdlchybrid = this.NEGATIVE_CONST;
      // }
      // else
      // {
      //   this.enterMyData.sdlchybrid = eval("(object.mapdata.PR0910)") * 100;
      // }


      // let temp28 = Math.round(this.enterMyData.sdlchybrid);
      // let temp29 = Math.round(Number(object.applicationDevelopmentData.data.DevelopmentMethodology.DevelopmentMethodology.Hybrid.value));


      // if (temp28 == temp29)
      // {
      //   this.devMethodHybridEquality = true;
      // }

      // if(this.enterMyData.sdlchybrid == Infinity || this.enterMyData.sdlchybrid == 'infinity' || this.enterMyData.sdlchybrid == "Infinity" || isNaN(this.enterMyData.sdlchybrid)) {
      //   this.enterMyData.sdlchybrid = this.NEGATIVE_CONST;
      // } else if(Number(this.enterMyData.sdlchybrid)) {
      //   this.enterMyData.sdlchybrid = this.enterMyData.sdlchybrid;
      // } else {
      //   this.enterMyData.sdlchybrid = 0;
      // }


      // //none
      // //PR0915

      // if(object.mapdata.PR0915 == this.NEGATIVE_CONST)
      // {
      //   this.enterMyData.sdlcnone = this.NEGATIVE_CONST;
      // }
      // else
      // {
      //   this.enterMyData.sdlcnone = eval("(object.mapdata.PR0915)") * 100;
      // }


      // let temp32 = Math.round(this.enterMyData.sdlcnone);
      // let temp33 = Math.round(Number(object.applicationDevelopmentData.data.DevelopmentMethodology.DevelopmentMethodology.None.value));


      // if (temp32 == temp33)
      // {
      //   this.devMethodNoneEquality = true;
      // }

      // if(this.enterMyData.sdlcnone == Infinity || this.enterMyData.sdlcnone == 'infinity' || this.enterMyData.sdlcnone == "Infinity" || isNaN(this.enterMyData.sdlcnone)) {
      //   this.enterMyData.sdlcnone = this.NEGATIVE_CONST;
      // } else if(Number(this.enterMyData.sdlcnone)) {
      //   this.enterMyData.sdlcnone = this.enterMyData.sdlcnone;
      // } else {
      //   this.enterMyData.sdlcnone = 0;
      // }


      // //other
      // //PR0925

      // if(object.mapdata.PR0925 == this.NEGATIVE_CONST)
      // {
      //   this.enterMyData.sdlcothers = this.NEGATIVE_CONST;
      // }
      // else
      // {
      //   this.enterMyData.sdlcothers = eval("(object.mapdata.PR0925)") * 100;
      // }


      // let temp34 = Math.round(this.enterMyData.sdlcothers);
      // let temp35 = Math.round(Number(object.applicationDevelopmentData.data.DevelopmentMethodology.DevelopmentMethodology.Other.value));


      // if (temp34 == temp35)
      // {
      //   this.devMethodOtherEquality = true;
      // }

      // if(this.enterMyData.sdlcothers == Infinity || this.enterMyData.sdlcothers == 'infinity' || this.enterMyData.sdlcothers == "Infinity" || isNaN(this.enterMyData.sdlcothers)) {
      //   this.enterMyData.sdlcothers = this.NEGATIVE_CONST;
      // } else if(Number(this.enterMyData.sdlcothers)) {
      //   this.enterMyData.sdlcothers = this.enterMyData.sdlcothers;
      // } else {
      //   this.enterMyData.sdlcothers = 0;
      // }

      // //cost per hour worked
      // //( DAD150 + DAD155 ) / P21090
     

      if (mapdata1.DAD150 == this.NEGATIVE_CONST && mapdata1.DAD155 == this.NEGATIVE_CONST && mapdata1.DAD170 == this.NEGATIVE_CONST && mapdata1.P21090 == this.NEGATIVE_CONST) {
        this.enterMyData.costperhour = this.NEGATIVE_CONST;
      }
      else if(mapdata1.P21090 == this.NEGATIVE_CONST){
        this.enterMyData.costperhour = this.NEGATIVE_CONST;
      }
      else if (mapdata1.DAD150 != this.NEGATIVE_CONST && mapdata1.DAD155 == this.NEGATIVE_CONST && mapdata1.DAD170 == this.NEGATIVE_CONST) {
        this.enterMyData.costperhour = eval("(object.mapdata.DAD150) / (object.mapdata.P21090)");
      }
      else if (mapdata1.DAD150 == this.NEGATIVE_CONST && mapdata1.DAD155 != this.NEGATIVE_CONST && mapdata1.DAD170 == this.NEGATIVE_CONST) {
        this.enterMyData.costperhour = eval("(object.mapdata.DAD155) / (object.mapdata.P21090)");
      }
      else if (mapdata1.DAD150 == this.NEGATIVE_CONST && mapdata1.DAD155 == this.NEGATIVE_CONST && mapdata1.DAD170 != this.NEGATIVE_CONST) {
        this.enterMyData.costperhour = eval("(object.mapdata.DAD170) / (object.mapdata.P21090)");
      }
      else if (mapdata1.DAD150 == this.NEGATIVE_CONST && mapdata1.DAD155 != this.NEGATIVE_CONST && mapdata1.DAD170 != this.NEGATIVE_CONST) {
        this.enterMyData.costperhour = eval("(object.mapdata.DAD155 + object.mapdata.DAD170) / (object.mapdata.P21090)");
      }
      else if (mapdata1.DAD150 != this.NEGATIVE_CONST && mapdata1.DAD155 != this.NEGATIVE_CONST && mapdata1.DAD170 == this.NEGATIVE_CONST) {
        this.enterMyData.costperhour = eval("(object.mapdata.DAD150 + object.mapdata.DAD155) / (object.mapdata.P21090)");
      }
      else if (mapdata1.DAD150 != this.NEGATIVE_CONST && mapdata1.DAD155 == this.NEGATIVE_CONST && mapdata1.DAD170 != this.NEGATIVE_CONST) {
        this.enterMyData.costperhour = eval("(object.mapdata.DAD150 + object.mapdata.DAD170) / (object.mapdata.P21090)");
      }
      else {
        this.enterMyData.costperhour = eval("(object.mapdata.DAD150 + object.mapdata.DAD155 + object.mapdata.DAD170) / (object.mapdata.P21090)");
      }

      
      let temp36 = Math.round(Number(this.enterMyData.costperhour));
      let temp37 = Math.round(Number(object.applicationDevelopmentData.tcoPerHourWorked.costPerHourNumber));


      if (temp36 == temp37) {
        this.costPerHourEquality = true;
      }

      if (this.enterMyData.costperhour == Infinity || this.enterMyData.costperhour == 'infinity' || this.enterMyData.costperhour == "Infinity" || isNaN(this.enterMyData.costperhour)) {
        this.enterMyData.costperhour = this.NEGATIVE_CONST;
      } else if (Number(this.enterMyData.costperhour)) {
        this.enterMyData.costperhour = this.enterMyData.costperhour;
      } else {
        this.enterMyData.costperhour = 0;
      }

      // //price per hour worked
      // //DAD150 + DAD155 + DAD170 ) / P21090

      // if (mapdata1.DAD150 == this.NEGATIVE_CONST && mapdata1.DAD155 == this.NEGATIVE_CONST && mapdata1.P21090 == this.NEGATIVE_CONST) {
      //   this.enterMyData.priceperhour = this.NEGATIVE_CONST;
      // }
      // else if (mapdata1.DAD150 == this.NEGATIVE_CONST) {
      //   this.enterMyData.priceperhour = eval("(object.mapdata.DAD155) / (object.mapdata.P21090)");
      // }
      // else if (mapdata1.DAD155 == this.NEGATIVE_CONST) {
      //   this.enterMyData.priceperhour = eval("(object.mapdata.DAD150) / (object.mapdata.P21090)");
      // }
      // else if (mapdata1.P21090 == this.NEGATIVE_CONST) {
      //   this.enterMyData.priceperhour = this.NEGATIVE_CONST;
      // }
      // else {
      //   this.enterMyData.priceperhour = eval("(object.mapdata.DAD150 + object.mapdata.DAD155) / (object.mapdata.P21090)");
      // }

      if (mapdata1.DAD150 == this.NEGATIVE_CONST && mapdata1.DAD155 == this.NEGATIVE_CONST && mapdata1.DAD170 == this.NEGATIVE_CONST && mapdata1.P21090 == this.NEGATIVE_CONST) {
        this.enterMyData.priceperhour = this.NEGATIVE_CONST;
      }
      else if(mapdata1.P21090 == this.NEGATIVE_CONST){
        this.enterMyData.priceperhour = this.NEGATIVE_CONST;
      }
      else if (mapdata1.DAD150 != this.NEGATIVE_CONST && mapdata1.DAD155 == this.NEGATIVE_CONST && mapdata1.DAD170 == this.NEGATIVE_CONST) {
        this.enterMyData.priceperhour = eval("(object.mapdata.DAD150) / (object.mapdata.P21090)");
      }
      else if (mapdata1.DAD150 == this.NEGATIVE_CONST && mapdata1.DAD155 != this.NEGATIVE_CONST && mapdata1.DAD170 == this.NEGATIVE_CONST) {
        this.enterMyData.priceperhour = eval("(object.mapdata.DAD155) / (object.mapdata.P21090)");
      }
      else if (mapdata1.DAD150 == this.NEGATIVE_CONST && mapdata1.DAD155 == this.NEGATIVE_CONST && mapdata1.DAD170 != this.NEGATIVE_CONST) {
        this.enterMyData.priceperhour = eval("(object.mapdata.DAD170) / (object.mapdata.P21090)");
      }
      else if (mapdata1.DAD150 == this.NEGATIVE_CONST && mapdata1.DAD155 != this.NEGATIVE_CONST && mapdata1.DAD170 != this.NEGATIVE_CONST) {
        this.enterMyData.priceperhour = eval("(object.mapdata.DAD155 + object.mapdata.DAD170) / (object.mapdata.P21090)");
      }
      else if (mapdata1.DAD150 != this.NEGATIVE_CONST && mapdata1.DAD155 != this.NEGATIVE_CONST && mapdata1.DAD170 == this.NEGATIVE_CONST) {
        this.enterMyData.priceperhour = eval("(object.mapdata.DAD150 + object.mapdata.DAD155) / (object.mapdata.P21090)");
      }
      else if (mapdata1.DAD150 != this.NEGATIVE_CONST && mapdata1.DAD155 == this.NEGATIVE_CONST && mapdata1.DAD170 != this.NEGATIVE_CONST) {
        this.enterMyData.priceperhour = eval("(object.mapdata.DAD150 + object.mapdata.DAD170) / (object.mapdata.P21090)");
      }
      else {
        this.enterMyData.priceperhour = eval("(object.mapdata.DAD150 + object.mapdata.DAD155 + object.mapdata.DAD170) / (object.mapdata.P21090)");
      }

      
      let temp38 = Math.round(Number(this.enterMyData.priceperhour));
      let temp39 = Math.round(Number(object.applicationDevelopmentData.pricePerHoursWorked.pricePerHoursNumber));


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


      //AD effort allocation
      //onshoreplanning
      //P1R250

      object.enterMyData.onshorePlanningEffort = Number.isNaN(object.mapdata.P1R250) ? this.NEGATIVE_CONST : object.mapdata.P1R250;

      console.log("onshorePlanningEffort",object.enterMyData.onshorePlanningEffort);
      let temp86 = (object.enterMyData.onshorePlanningEffort).toFixed(1);
      let temp87 = Number(object.applicationDevelopmentData.projectCostAllocationOnshore.onStrategyPlanning).toFixed(1);


      if (temp86 == temp87) {
        this.onshorePlanningEffortEquality = true;
      }

      //onshorerequirement
      //P1R255
      object.enterMyData.onshoreRequirementEffort = Number.isNaN(object.mapdata.P1R255) ? this.NEGATIVE_CONST : object.mapdata.P1R255;

      let temp88 = (object.enterMyData.onshoreRequirementEffort).toFixed(1);
      let temp89 = Number(object.applicationDevelopmentData.projectCostAllocationOnshore.onshoreRequirement).toFixed(1);


      if (temp88 == temp89) {
        this.onshoreRequirementEffortEquality = true;
      }

      //onshoredesign
      //P1R260

      object.enterMyData.onshoreDesignEffort = Number.isNaN(object.mapdata.P1R260) ? this.NEGATIVE_CONST : object.mapdata.P1R260;

      let temp90 = (object.enterMyData.onshoreDesignEffort).toFixed(1);
      let temp91 = Number(object.applicationDevelopmentData.projectCostAllocationOnshore.onshoreDesign).toFixed(1);


      if (temp90 == temp91) {
        this.onshoreDesignEffortEquality = true;
      }

      //onshorecoding
      //P1R265

      object.enterMyData.onshoreCodingEffort = Number.isNaN(object.mapdata.P1R265) ? this.NEGATIVE_CONST : object.mapdata.P1R265;

      let temp92 = (object.enterMyData.onshoreCodingEffort).toFixed(1);
      let temp93 = Number(object.applicationDevelopmentData.projectCostAllocationOnshore.onshoreCoding).toFixed(1);


      if (temp92 == temp93) {
        this.onshoreCodingEffortEquality = true;
      }

      //onshoretesting
      //P1R270


     
      object.enterMyData.onshoreTestingEffort = Number.isNaN(object.mapdata.P1R270) ? this.NEGATIVE_CONST : object.mapdata.P1R270;

      let temp94 = (object.enterMyData.onshoreTestingEffort).toFixed(1);
      let temp95 = Number(object.applicationDevelopmentData.projectCostAllocationOnshore.onshoreTesting).toFixed(1);


      if (temp94 == temp95) {
        this.onshoreTestingEffortEquality = true;
      }

      //onshoreimplement
      //P1R275

      object.enterMyData.onshoreImplementEffort = Number.isNaN(object.mapdata.P1R275) ? this.NEGATIVE_CONST : object.mapdata.P1R275;

      let temp96 = (object.enterMyData.onshoreImplementEffort).toFixed(1);
      let temp97 = Number(object.applicationDevelopmentData.projectCostAllocationOnshore.onshoreImplement).toFixed(1);


      if (temp96 == temp97) {
        this.onshoreImplementEffortEquality = true;
      }
      
      //onshoresustain
      //P1R280

      object.enterMyData.onshoreSustainEffort = Number.isNaN(object.mapdata.P1R280) ? this.NEGATIVE_CONST : object.mapdata.P1R280;

      let temp98 = (object.enterMyData.onshoreSustainEffort).toFixed(1);
      let temp99 = Number(object.applicationDevelopmentData.projectCostAllocationOnshore.onshoreSustain).toFixed(1);


      if (temp98 == temp99) {
        this.onshoreSustainEffortEquality = true;
      }

      //offshore
      //offshoreplanning
      //P1R251

      object.enterMyData.offshorePlanningEffort = Number.isNaN(object.mapdata.P1R251) ? this.NEGATIVE_CONST : object.mapdata.P1R251;

      let temp101 = (object.enterMyData.offshorePlanningEffort).toFixed(1);
      let temp102 = Number(object.applicationDevelopmentData.projectCostAllocationOffshore.offStrategyPlanning).toFixed(1);


      if (temp101 == temp102) {
        this.offshorePlanningEffortEquality = true;
      }

      //offshorerequirement
      //P1R256
      object.enterMyData.offshoreRequirementEffort = Number.isNaN(object.mapdata.P1R256) ? this.NEGATIVE_CONST : object.mapdata.P1R256;

      let temp103 = (object.enterMyData.offshoreRequirementEffort).toFixed(1);
      let temp104 = Number(object.applicationDevelopmentData.projectCostAllocationOffshore.offshoreRequirement).toFixed(1);


      if (temp103 == temp104) {
        this.offshoreRequirementEffortEquality = true;
      }

      //offshoredesign
      //P1R261

      object.enterMyData.offshoreDesignEffort = Number.isNaN(object.mapdata.P1R261) ? this.NEGATIVE_CONST : object.mapdata.P1R261;

      let temp105 = (object.enterMyData.offshoreDesignEffort).toFixed(1);
      let temp106 = Number(object.applicationDevelopmentData.projectCostAllocationOffshore.offshoreDesign).toFixed(1);


      if (temp105 == temp106) {
        this.offshoreDesignEffortEquality = true;
      }

      //offshorecoding
      //P1R266

      object.enterMyData.offshoreCodingEffort = Number.isNaN(object.mapdata.P1R266) ? this.NEGATIVE_CONST : object.mapdata.P1R266;

      let temp107 = (object.enterMyData.offshoreCodingEffort).toFixed(1);
      let temp108 = Number(object.applicationDevelopmentData.projectCostAllocationOffshore.offshoreCoding).toFixed(1);


      if (temp107 == temp108) {
        this.offshoreCodingEffortEquality = true;
      }

      //offshoretesting
      //P1R271


      object.enterMyData.offshoreTestingEffort = Number.isNaN(object.mapdata.P1R271) ? this.NEGATIVE_CONST : object.mapdata.P1R271;

      let temp109 = (object.enterMyData.offshoreTestingEffort).toFixed(1);
      let temp110 = Number(object.applicationDevelopmentData.projectCostAllocationOffshore.offshoreTesting).toFixed(1);


      if (temp109 == temp110) {
        this.offshoreTestingEffortEquality = true;
      }

      //offshoreimplement
      //P1R276

      object.enterMyData.offshoreImplementEffort = Number.isNaN(object.mapdata.P1R276) ? this.NEGATIVE_CONST : object.mapdata.P1R276;

      let temp111 = (object.enterMyData.offshoreImplementEffort).toFixed(1);
      let temp112 = Number(object.applicationDevelopmentData.projectCostAllocationOffshore.offshoreImplement).toFixed(1);


      if (temp111 == temp112) {
        this.offshoreImplementEffortEquality = true;
      }

      //offshoresustain
      //P1R281

      object.enterMyData.offshoreSustainEffort = Number.isNaN(object.mapdata.P1R281) ? this.NEGATIVE_CONST : object.mapdata.P1R281;

      let temp113 = (object.enterMyData.offshoreSustainEffort).toFixed(1);
      let temp114 = Number(object.applicationDevelopmentData.projectCostAllocationOffshore.offshoreSustain).toFixed(1);


      if (temp113 == temp114) {
        this.offshoreSustainEffortEquality = true;
      }

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
        }else{
          object.enterMyData.applicationDevCost = (eval("((object.mapdata.DAD150 + object.mapdata.DAD155  + object.mapdata.DAD165 + object.mapdata.DAD170) / (object.mapdata.DAD150 + object.mapdata.DAD155  + object.mapdata.DAD165 + object.mapdata.DAD170 + object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170) )") * 100);
          object.enterMyData.applicationDevCost = Number.isNaN(object.enterMyData.applicationDevCost) ? object.NEGATIVE_CONST : object.enterMyData.applicationDevCost;
      }
      
      let tempADCost = Number((object.enterMyData.applicationDevCost)).toFixed(1);
      let tempADCompareCost = Number(object.applicationDevelopmentData.ApplicationDevelopmentCost.value).toFixed(1);
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
        }else{
          object.enterMyData.applicationMaintenanceCost = (eval("((object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170) / (object.mapdata.DAD150 + object.mapdata.DAD155  + object.mapdata.DAD165 + object.mapdata.DAD170 + object.mapdata.DAM150 + object.mapdata.DAM155  + object.mapdata.DAM165 + object.mapdata.DAM170) )") * 100);
          object.enterMyData.applicationMaintenanceCost = Number.isNaN(object.enterMyData.applicationMaintenanceCost) ? object.NEGATIVE_CONST : object.enterMyData.applicationMaintenanceCost;
      }
      
      let tempAMCost = Number((object.enterMyData.applicationMaintenanceCost)).toFixed(1);
      let tempAMCompareCost = Number(object.applicationDevelopmentData.ApplicationMaintenanceCosts.value).toFixed(1);
      if(tempAMCost == tempAMCompareCost){
        object.amCostEquality = true;
      }
    }
    catch (error) {
      //  console.log(error);
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "12",
        "pageName": "Non CIO Service Desk Tower Landing Screen",
        "errorType": "warn",
        "errorTitle": "Data Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    }
  }

  nonEditableElm = ["AMR455","AMR460","AMR465","AMR470", "P77050","P67085","P1R250","P1R255","P1R260","P1R265","P1R270","P1R275","P1R280","P1R251","P1R256","P1R261","P1R266","P1R271","P1R276","P1R281", "PR0900"];

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

  costPerHourDialog() {
    this.display_costPerInstance = 'block';
    //this.showDrillDown = true;
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
        "dashboardId": "12",
        "pageName": "Non CIO Service Desk Tower Landing Screen",
        "errorType": "warn",
        "errorTitle": "Data Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    }
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


  //this will be invoked when we change value of drop down
  public getFilterData(filter: string) {

    let object = this;

    //reset CRG
    object.selectedcustomRef = object.selectedCRGName[0];

    if (filter === "industry") {
    
      //get landing data for selected industry
      if(object.selectedindustry.value=="All Industries")
      { 
        object.industrySizeService.setADFilters('Global','Grand Total');
      }
      else
      {
        object.industrySizeService.setADFilters('Industry',object.selectedindustry.value);
        object.selectedsize = object.selectedsizes[0];
      }

      //call web service
      object.industrySizeService.getADFilteredLandingData().subscribe((allData:any) => {
        object.applicationDevelopmentData = allData;
        object.compareServicedeskInputData();
  
      },(error)=>{
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId" : "12",
          "pageName" : "Non CIO Service Desk Tower Landing Screen",
          "errorType" : "Fatal",
          "errorTitle" : "web Service Error",
          "errorDescription" : error.message,
          "errorObject" : error
        }
  
        throw errorObj;
      });
    
    }
   
    if (filter === "size") {
    
      //get landing data for selected industry
      if(object.selectedsize.value=="All Sizes")
      { 
        object.industrySizeService.setADFilters('Global','Grand Total');
      }
      else
      {
        object.industrySizeService.setADFilters('size',object.selectedsize.value);
        object.selectedindustry = object.selectedIndustries[0];
      }

      //call web service
      object.industrySizeService.getADFilteredLandingData().subscribe((allData:any) => {
        object.applicationDevelopmentData = allData;
        object.compareServicedeskInputData();
      },(error)=>{
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId" : "12",
          "pageName" : "Non CIO Service Desk Tower Landing Screen",
          "errorType" : "Fatal",
          "errorTitle" : "web Service Error",
          "errorDescription" : error.message,
          "errorObject" : error
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
      object.applicationDevelopmentData = data;
      // this.updateLineChartData();
      this.updateDrillDown();
      this.compareServicedeskInputData();
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
  }

  //region change
  setRegion(region) {
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
        console.log("scenarioData====> ", object.scenarioObj);

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
    //console.log('ngOnDestroy for Service desk');
    this.ADSharedService.getEmitter().removeAllListeners();
  }

  //function to check all relevent data is loaded on page
  isAllReleventDataLoaded() {
    let object = this;
    object.showApplicationDevelopmentData = true;

    //alert('object.landingPageDataLoaded: '+object.landingPageDataLoaded+' object.industryDataLoaded: '+object.industryDataLoaded+' object.currencyFilterLoaded: '+object.currencyFilterLoaded+' object.revenueFilterLoaded: '+object.revenueFilterLoaded+' object.scenarioListLoaded: '+object.scenarioListLoaded+' object.CRGListLoaded: '+object.CRGListLoaded);
    
    if (object.landingPageDataLoaded && 
      object.industryDataLoaded && 
      object.currencyFilterLoaded && 
      object.revenueFilterLoaded &&
      object.scenarioListLoaded &&
      object.CRGListLoaded) {
      object.showApplicationDevelopmentData = true;
      object.industrySizeService.getEmitter().emit('landingPageDataLoaded');
    }
    // else {
    //   object.showApplicationDevelopmentData = false;
    // }
  }

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
        temp.dashboardId = "12";
        temp.updatedBy = null;
        temp.customId = "-9999";
        temp.definition=""; //
        object.selectedCRGName.push(temp);
  
        for (let index in object.customReferenceGroupList) {
          let option: any = {};
  
          if(object.customReferenceGroupList[index].dashboardId=='12')
          {
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
  
        object.getCurrencyDropdown();
  
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

  getCurrencyDropdown()
  {
    let object = this; 

    //currency
    object.dropDownService.getCurrency().subscribe((data: any) => {
      object.allCurrencies = data['currencyExchange'];
      if (object.allCurrencies != undefined && object.allCurrencies != null) {
        object.currencyFilterLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.currencyFilterLoaded = false;
        object.showApplicationDevelopmentData = false;
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

      // if (object.data.currency != undefined && object.data.currency != null) {
      //   object.currencyFilterLoaded = true;
      //   object.isAllReleventDataLoaded();
      // }
      // else {
      //   object.currencyFilterLoaded = false;
      //   object.showApplicationDevelopmentData = false;
      // }

      //change currency symbol
      this.currencySymbol = this.currencyVar(this.currencyCode);

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
      // object.showDefaultCurrency();
    }
    else
    {
        //set custom reference group in service
        object.industrySizeService.setCRGId(selectedcustomRef.customId);
        object.resetNonCRGFilters();
        //web service to fetch CRG data
        object.industrySizeService.fetchCRGData().subscribe((crgData: any) => {
  
          if(crgData!=undefined || crgData!=null)
          {
            object.applicationDevelopmentData = crgData;
            object.compareServicedeskInputData();
            object.landingPageDataLoaded=true;
            //object.isAllReleventDataLoaded();
          }
  
        });
    }
    
    
  }
  
  showDefaultLandingData() {
  
    let object = this;
  
    // this is used for all landing page data
    object.applicationDevelopmentLanding.getData().subscribe((allData: any) => {
      object.applicationDevelopmentData = allData;
      if(object.applicationDevelopmentData!=undefined && object.applicationDevelopmentData!=null)
      {
        object.landingPageDataLoaded=true;
        //object.isAllReleventDataLoaded();
      }
      else
      {
        object.landingPageDataLoaded=false;
        object.showApplicationDevelopmentData=false;
      }
     
      object.updateDrillDown();
      this.compareServicedeskInputData();

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
  
  resetNonCRGFilters(){
  
    let object = this;
  
    //object.show = false;
    object.landingPageDataLoaded =false;
    object.currencyFilterLoaded =false;
  
    
    //currency
    // object.showDefaultCurrency();

    //industry
    object.showDefaultIndustry();

    //revenue
    object.showDefaultRevenue();

  }

  
  showDefaultCurrency()
  {
    let object = this;
  
    object.dropDownService.getCurrency().subscribe((data: any) => {
      object.data.currency = data['currencyExchange'];
      object.allCurrencies = object.data.currency;
      let currency;
  
      object.allCurrencies.forEach(element => {
  
        if (element.value === "USD") {
          currency = element;
        }
  
        if (object.allCurrencies != undefined && object.allCurrencies != null) {
          object.currencyFilterLoaded = true;
          //object.isAllReleventDataLoaded();
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

  showDefaultRevenue()
  {
    let object = this;

    object.dropDownService.getRevenue().subscribe((data: any) => {
      object.data.revenue = data.revenue;
      // object.defaultsize = "All Sizes";

     
      object.selectedsizes=[];


      //set default selection
      let temp1: any ={}; 

      temp1.id = "";
      temp1.key="Grand Total";
      temp1.value = "All Sizes";
      object.selectedsizes.push(temp1);

      for (let index in object.data.revenue) {
        let option: any = {};
      
        option.id = object.data.revenue[index].id;
        option.key= object.data.revenue[index].key;
        option.value = object.data.revenue[index].value;
        object.selectedsizes.push(option);
        
        
     }

     object.selectedsize = object.selectedsizes[0];

     
     object.selectedindustry = object.selectedIndustries[0];
     if ( object.data.revenue != undefined &&  object.data.revenue != null) {
       object.revenueFilterLoaded = true;
       //object.isAllReleventDataLoaded();
     }
     else {
       object.revenueFilterLoaded = false;
       object.showApplicationDevelopmentData = false;
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

  showDefaultIndustry()
  {
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

      object.selectedIndustries=[];

      //set default selection
      let temp: any ={}; 

      temp.id = "";
      temp.key="Grand Total";
      temp.value = "All Industries";
      object.selectedIndustries.push(temp);

      //let scanrioId = 0;
      for (let index in object.data.industries) {
        let option: any = {};
      
        option.id = object.data.industries[index].id;
        option.key= object.data.industries[index].key;
        option.value = object.data.industries[index].value;
        object.selectedIndustries.push(option);
        
        
     }

      object.selectedindustry = object.selectedIndustries[0];
      if (object.data.industries != undefined && object.data.industries != null) {
        object.industryDataLoaded = true;
        //object.isAllReleventDataLoaded();
      }
      else {
        object.industryDataLoaded = false;
        object.showApplicationDevelopmentData = false;
      }

      
    },(error)=>{
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
 
}



