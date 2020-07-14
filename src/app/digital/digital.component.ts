/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:service-desk.component.ts **/
/** Description: This file is created to get the ladning page data, filter related data and compare/input my data with drill downs (Chart) **/
/** Created By: 10651577  Created Date: 28/09/2018 **/
/** Update By:  10650919  Update Date:  03/10/2018 **/
/*******************************************************/


import { Component, OnInit } from '@angular/core';
import { EventEmitter } from 'protractor';
import { FilterDataService } from '../services/filter-data.service';
import { DropDownService } from '../services/drop-down.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { DigitalSharedService } from '../services/digital/digital-shared.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
//import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import { CustomRefGroupService } from '../services/custom-ref-group/custom-ref-group.service';
import { IndustrySizeService } from '../services/industry-size.service'
import { HeaderCompareScreenDataService } from '../services/header-compare-screen-data.service';

import { CompareComponent } from '../Compare/compare.component';


import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';
import { DigitalEditAndCompareSharedService } from '../services/digital/digital-edit-and-compare-shared.service';
import { UpdateCompareScreenNotificationService} from '../services/update-compare-screen-notification.service';
import { UpdateScenarioListNotificationServiceService } from '../services/update-scenario-list-notification-service.service';

declare var $: any;

@Component({
  selector: 'Digital',
  templateUrl: './digital.component.html',
  styleUrls: ['./digital.component.css']
})

export class DigitalComponent implements OnInit {

  public userData: any;
  public sessionId: any;
  private industryLoaded: boolean;
  private regionLoaded: boolean;
  public showEnterDataFlg: boolean = false;
  private showEnteredDataflag: boolean = false;
  public navigatedFromInputMyData: boolean =false;

  private compareComponent: CompareComponent
  showCompareGridChild: boolean = false;
  showCompareScreen: string = 'none';
  resizePopup: string = "minimize";
  //coe bar chart
  // public barChartOptions: ChartOptions = {
  //   responsive: true,
  //   // We use these empty structures as placeholders for dynamic theming.
  //   scales: { xAxes: [{ticks: {
  //     beginAtZero: true
  //   }}
  //   ], 
  //   yAxes: [{}] },
  //   plugins: {
  //     datalabels: {
  //       anchor: 'end',
  //       align: 'end',
  //     }
  //   }
  // };
  // public barChartLabels: Label[] = ['RPA and Cognitive Automation', 
  // 'Artificial Intelligence / Machine Learning', 
  // 'Blockchain', 
  // 'Enterprise Agility',
  //  'Internet of Things', 
  //  'Augmented or Virtual Reality', 
  //  'Digital Marketing'];
  // public barChartType: ChartType = 'horizontalBar';
  // public barChartLegend = true;
  // public COEChartColors: Array<any> =  [
  //   { // first color
  //     backgroundColor: '#81cee3',
  //     borderColor: '#81cee3',
  //     pointBackgroundColor: '#81cee3',
  //     pointBorderColor: '#fff',
  //     pointHoverBackgroundColor: '#fff',
  //     pointHoverBorderColor: '#81cee3'
  //   }];
  // //public barChartPlugins = [pluginDataLabels];

  // public barChartData: ChartDataSets[] = [
  //   { data: [35, 44, 27, 46, 65, 26, 87], label: 'COE %' }
  // ];

  //top 10 capabilities horizontal bar chart

  public businessInnovationBarChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{
        ticks: {
          min: 0,
          stepSize: 25,
          max:100,
          
        }
      }],
      yAxes: [{}]
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };


  public digitalBackboneChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{
        ticks: {
          min: 0,
          stepSize: 25,       
          max:100
        },
        barPercentage: 0.4
      }], yAxes: [{}]
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  public smartTechnologiesOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{
        ticks: {
          min: 0,
          stepSize: 25, 
          max:100
        }
      }], yAxes: [{}]
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };


  public digitalEcosystemsOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{
        ticks: {
          min: 0,
          stepSize: 25, 
          max:100
        },
        barThickness: 6,  // number (pixels) or 'flex'
        maxBarThickness: 8 // number (pixels)
      }], yAxes: [{}]
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  public digitalOperatingOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{
        ticks: {
          min: 0,
          stepSize: 25,
          max:100
        }
      }], yAxes: [{}]
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  public insightsOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{
        ticks: {
          min: 0,
          stepSize: 25, 
          max:100
        }
      }], yAxes: [{}]
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  public businessInnovationLabel: Label[] = [];
  public digitalBackboneLabel: Label[] = [];
  public digitalEcosystemsLabel: Label[] = [];
  public smartTechnologiesLabel: Label[] = [];
  public digitalOperatingLabel: Label[] = [];
  public insightsLabel: Label[] = [];

  public digitalBackboneChartData: ChartDataSets[] = [
    // { data: [61, 59, 55, 53, 53, 50, 46, 45, 43, 40], label: 'Digital Capability %' }
  ];

  public digitalEcosystemsChartData: ChartDataSets[] = [
  ];

  public businessInnovationChartData: ChartDataSets[] = [
    // { data: [], label: 'Digital Capability %' }
  ];

  public digitalOperatingChartData: ChartDataSets[] = [
    // { data: [], label: 'Digital Capability %' }
  ];

  public smartTechnologiesChartData: ChartDataSets[] = [
    // { data: [], label: 'Digital Capability %' }
  ];

  public insightsChartData: ChartDataSets[] = [
    // { data: [], label: 'Digital Capability %' }
  ];

  public businessInnovationChartColors: Array<any> = [
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

  public digitalBackboneColors: Array<any> = [
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


  public digitalEcosystemsColors: Array<any> = [
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

  public smartTechnologiesColors: Array<any> = [
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


  public digitalOperatingColors: Array<any> = [
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

  public insightsColors: Array<any> = [
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


  /**
   * 'Personalized content for employees based on their activities, roles and preferences.', 
  'Going-to-market through third party digital sales channels.', 
  'We have end-to-end visibility on our product and service development backlog.', 
  'Employees can access the systems and data they need in a self-service way.',
   'We regularly assess and manage the impact of automation on our employees.', 
   'A common technology and platform to deliver our applications.', 
   'A staff of software development that have expertise in data science and statistics.',
  'Processing and analyzing IoT data streams at scale.',
'Co-creating digital products or services with customers or partners.',
'Using e-learning approaches such as massive Online Open Courses to educate our workforce.'
   */
  public horizontalBar: ChartType = 'horizontalBar';

  // public topTenChartData: ChartDataSets[] = [
  //   { data: [53, 41, 39, 36, 34, 34, 33, 32, 32, 28], label: 'Digital Capability %' }
  // ];




  /**
   * 'On-demand ability to add or decrease infrastruture as the business deamnds it.', 
'Monitoring and maintain equipment or facilities using digital twin models.', 
'Crowdsourcing product development.', 
'Automating internal or external customer interactions using chartbots.',
 'Using machine learning to optimize pricing for products and services.', 
 'A microservices-based application architacture.', 
 'Analyzing unstructured data (e.g. voice, video, text etc.)',
'Generating increamental business value from data from connected people, devices or machinery.',
'Process for master data management and data lifecycle management.',
'Using Augmented Reality to support field services.'
   */

  //  public horizontalBar: ChartType = 'horizontalBar';



  public currencyVar: any;
  public currentyear: any;

  public showDigitalData: any = false;

  //filter vars
  public selectedIndustries: any;
  public data: any = {};
  public selectedindustry: any;
  public industryDataLoaded: boolean = false;

  public selectedsizes: any;
  public selectedsize: any;
  public revenueFilterLoaded: boolean = false;

  public selectedregion: any;
  selectedregions: any;
  public defaultregion: any;
  public regionFilterLoaded: boolean = false;

  public landingPageData: any;
  public landingPageDataLoaded: boolean = false;

  public enterMyData = {
    "ITSpendasRevenue" : null,
    "hardware" : null,
    "software" : null,
    "personnel" : null,
    "services" : null,
    "spendother" :null,
    "fulltimeemployee" : null,
    "fulltimecontractor" : null,
    "revenue": null,
    "revenueIncreased" : null,
    "customerretention" : null,
    "customerretentionincreased" : null,
    "operationalexpenses" : null,
    "operationalexpensesdecreased" : null,
    "coerpa": null,
    "coeAI" : null,
    "coeblockchain" : null,
    "coeenterprise" : null,
    "coeinternet" : null,
    "coeaugmented" : null,
    "coedigitalmarketing" : null,
    "digitalSpendOfITSpend": null,
    "digitalSpendPerEmployee": null,
    "digitalEmployeesPerEmployee": null  



  };

  public itSpendEquality: boolean =false;
  public itSpendSoftwareEquality: boolean =false;
  public itSpendHardwareEquality: boolean =false;
  public itSpendPersonnelEquality: boolean =false;
  public itSpendServicesEquality: boolean =false;
  public itSpendOthersEquality: boolean =false;
  public fullTimeEmployeeEquality: boolean =false;
  public fullTimeContractorEquality: boolean =false;
  public revenueEquality: boolean=false;
  public customerRetentionEquality: boolean=false;
  public operationExpensesEquality: boolean=false;
  public digitalSpendOfITSpendEquality: boolean =false;
  public digitalSpendPerEmployeeEquality: boolean =false;
  public digitalEmployeeEquality: boolean =false;



  public enterMyDataBarChart: any;

  public pageId: any;

  //definition variable
  private digitalDefinitionData: any;
  public digital_definition_data = [];
  bottom_ten_definitaion: any;
  top_ten_definition: any;
  public customReferenceGroupList :any;
  public selectedCRGName = [];
  public selectedcustomRef: any;

  public selectedSurveyList: any[]=[];
  public surveyList: any[]=[];
  public selectedSurvey: any;

  public enterMyDataLoaded: any;

  public scaleData: any;

  public ItSpendDefinition: any;
  public digiCostBreakDown: any;
  public ItSRevenueDefinition: any;
  public digiSpendPerEmployeeDefinition: any;
  public digiSpendCompanyEmpDefinitn: any;
  public empDedicatedToDigiDefinitn: any;
  public CoesDefinitn: any;
  public benefitsOfDigiDefinitn: any;
  public businessInnovatnDefinitn: any;
  public digiBackboneDefinitn: any;
  public digiEcosystemDefinitn: any;
  public digiOMDefinitn: any;
  public insightsDefinitn: any;
  public smartTechDefinitn: any;

  constructor(
    private filterservice: FilterDataService,
    private dropDownService: DropDownService,
    location: Location, router: Router,
    private sharedservice: DigitalSharedService,
    private crgService: CustomRefGroupService,
    private compareHeaderDataService: HeaderCompareScreenDataService,
    private industrySizeService: IndustrySizeService,
    private loginDataBroadcastService:LoginDataBroadcastService,
    private digitalEditAndCompareSharedService: DigitalEditAndCompareSharedService,
    private updateCompareScreenNotificationService: UpdateCompareScreenNotificationService,
    private updateScenarioListNotificationServiceService: UpdateScenarioListNotificationServiceService
  ) { 

    let object =this;
    //update scenariolist after deletion from compare modal
    updateScenarioListNotificationServiceService.getEmitter().on('updateDigitalScenarioListAfterDeletion', function(){
      object.getSurveyList();
    });
    object.updateCompareScreenNotificationService.getEmitter().on('updateCompareScreen',function(){
      object.compareHeaderDataService.setData(object.data);
      console.log("After compare update",object.data);
      let emitter = object.compareHeaderDataService.getEmitter();
      emitter.emit('dataChange');
    });
    //event emitter input my data survey update
    object.sharedservice.getEmitter().on('DigitalSurveyUpdated', function () {

      //get selected survey id
      var surveyid = object.sharedservice.getSurveyId();

      for (let index in object.selectedSurveyList) {
        
        
        if(surveyid==object.selectedSurveyList[index].surveyId)
        {
          object.selectedSurvey = object.selectedSurveyList[index];
          object.getSurveyDataByID(object.selectedSurvey);
        }
       
      }
      
    });
    
        object.sharedservice.getEmitter().on('newdigitalsurveygenerated',function(){
          //get updated list of survey
          object.getSurveyList();
        });

        //event emitter input my data survey save
        object.sharedservice.getEmitter().on('newDigitalSurveySaved', function () {

          //get selected survey id
          //var surveyid = object.sharedservice.getSurveyId();

          object.navigatedFromInputMyData=true;

          //get updated list of survey
          object.getSurveyList();
    
          
          
        });


        
	     //PRAGYA SURVEY DROPDOWN CHANGE STARTS
    //Survey Selection from compare grid
    

    object.digitalEditAndCompareSharedService.getEmitter().on('compareGridDigitalSurvey', function () {
      let survey= object.digitalEditAndCompareSharedService.getData().selectedSurvey;
      console.log("surveyId", survey);
     
        let surveyid=survey.surveyId;

        for (let index in object.selectedSurveyList) {
        
        
          if(surveyid==object.selectedSurveyList[index].surveyId)
          {
            object.selectedSurvey = object.selectedSurveyList[index];
            object.getSurveyDataByID(object.selectedSurvey);
          }
         
        }

    });
    //PRAGYA SURVEY DROPDOWN CHANGE ENDS

     //change in compare scenario dropdown
     object.digitalEditAndCompareSharedService.getEmitter().on('compareGridDigital', function () {
      //get selected scenario
      let survey = object.digitalEditAndCompareSharedService.getSurvey();

      let surveyid=survey.surveyId;

      for (let index in object.selectedSurveyList) {
      
      
        if(surveyid==object.selectedSurveyList[index].surveyId)
        {
          object.selectedSurvey = object.selectedSurveyList[index];
          object.getSurveyDataByID(object.selectedSurvey);
        }
       
      }

    });
	
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }




  ngOnInit() {

    let object = this;
    object.industrySizeService.setPageId(14);
    //get session id
    object.userData = object.loginDataBroadcastService.get('userloginInfo');
    object.sessionId = object.userData['userDetails']["sessionId"];
    
    //currencyvar
    object.currencyVar = require('currency-symbol-map');

    //current year
    object.currentyear = (new Date()).getFullYear();

    console.log('before getting data:');

    //get landing page data
    object.showDefaultLandingData();

    console.log('after getting data:');

    //filters
    //industry
    object.showDefaultIndustry();
    //region
    object.showDefaultRegion();

    //revenue
    object.showDefaultRevenue();

    
    object.getCRGDropdown();
    object.getSurveyList();

    //scale
    object.getScaleDetails();

  }

getScaleDetails() {
    let object = this;

    object.sharedservice.getScaleDetails().subscribe((response: any) => {

        object.scaleData = response;

        
        console.log('scaledata: ',object.scaleData);

    }, (error) => {
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
            "dashboardId": '14',
            "pageName": "Non CIO Service Desk Tower Input My Data Screen",
            "errorType": "Fatal",
            "errorTitle": "Web Service Error",
            "errorDescription": error.message,
            "errorObject": error
        }

        throw errorObj;
    });


}

  showDefaultLandingData() {
    let object = this;

    object.enterMyDataLoaded = false;

    object.sharedservice.getDefaultLandingData('14').subscribe((repsonse) => {

      console.log('got response of landing data: ', )
      object.landingPageData = repsonse;
      console.log("landing page data", object.landingPageData);
      if (object.landingPageData != undefined && object.landingPageData != null) {



        //create KPI's data
        object.createBusinessInnovationData();
        object.createDigitalBackboneData();
        object.createDigitalEcosystemsData();
        object.createSmartTechnologiesData();
        object.createDigitalOperatingData();
        object.createInsightsboneData();

        // object.getSurveyDataByID();

        object.landingPageDataLoaded = true;
      }
      else {
        object.landingPageDataLoaded = false;
      }

    }, (error) => {
      //throw custom exception to global error handler



      //create error object
      let errorObj = {
        "dashboardId": "14",
        "pageName": "Non CIO Service Desk Tower Landing Screen",
        "errorType": "Fatal",
        "errorTitle": "web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });

    object.sharedservice.getDigitalDefinationData('14').subscribe((repsonse) => {
      object.digitalDefinitionData = repsonse;
      
      console.log("digital_definition_data", this.digitalDefinitionData);

      object.ItSpendDefinition = object.digitalDefinitionData["digital spend as a % of it spend"].defination;
      object.digiCostBreakDown = object.digitalDefinitionData["digital spend by category"].defination;
      object.ItSRevenueDefinition = object.digitalDefinitionData["digital spend as a % of revenue"].defination;
      object.digiSpendPerEmployeeDefinition = object.digitalDefinitionData["digital spend per employee"].defination;
      object.digiSpendCompanyEmpDefinitn = object.digitalDefinitionData["digital employees as % of company employees"].defination;
      object.empDedicatedToDigiDefinitn = object.digitalDefinitionData["employees dedicated to digital"].defination;
      object.CoesDefinitn = object.digitalDefinitionData["where companies have coes"].defination;
      object.benefitsOfDigiDefinitn = object.digitalDefinitionData["benefits of digital initiatives"].defination;
      object.businessInnovatnDefinitn = object.digitalDefinitionData["business model innovation"].defination;
      object.digiBackboneDefinitn = object.digitalDefinitionData["digital backbone"].defination;
      object.digiEcosystemDefinitn = object.digitalDefinitionData["digital ecosystems"].defination;
      object.digiOMDefinitn = object.digitalDefinitionData["enterprise agility (formerly digital operating model)"].defination;
      object.insightsDefinitn = object.digitalDefinitionData.insights.defination;
      object.smartTechDefinitn = object.digitalDefinitionData["technologies at scale (formerly smart technologies)"].defination;

      
      
      // for(let definitionData of object.digitalDefinitionData){
      //   this.digital_definition_data[definitionData.kpiGroupName.replace(/\s/g, "")] = definitionData;
      // }

      // this.top_ten_definition = this.digital_definition_data["Top10Capabilities-Enterpriseshaveinproduction"].defination;
      // this.bottom_ten_definitaion = this.digital_definition_data["Bottom10capabilities-notstartedyet"].defination;
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "14",
        "pageName": "Non CIO Service Desk Tower Landing Screen",
        "errorType": "Fatal",
        "errorTitle": "web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })

    // get group definition information
    // object.sharedservice.getDefinitaionData('14').subscribe((repsonse) => {
    //   object.digitalDefinitionData = repsonse;
      
    //   // for(let definitionData of object.digitalDefinitionData){
    //   //   this.digital_definition_data[definitionData.kpiGroupName.replace(/\s/g, "")] = definitionData;
    //   // }

    //   // this.top_ten_definition = this.digital_definition_data["Top10Capabilities-Enterpriseshaveinproduction"].defination;
    //   // this.bottom_ten_definitaion = this.digital_definition_data["Bottom10capabilities-notstartedyet"].defination;
    // }, (error) => {
      //throw custom exception to global error handler
      //create error object
    //   let errorObj = {
    //     "dashboardId": "14",
    //     "pageName": "Non CIO Service Desk Tower Landing Screen",
    //     "errorType": "Fatal",
    //     "errorTitle": "web Service Error",
    //     "errorDescription": error.message,
    //     "errorObject": error
    //   }

    //   throw errorObj;
    // })

    

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

      console.log('object.selectedIndustries ', object.selectedIndustries);

      object.selectedindustry = object.selectedIndustries[0];
      if (object.data.industries != undefined && object.data.industries != null) {
        object.industryDataLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.industryDataLoaded = false;
        object.showDigitalData = false;
      }


    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "14",
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

    object.sharedservice.getRevenue().subscribe((data: any) => {
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

        option.id = object.data.revenue[index].key;
        option.key = object.data.revenue[index].key;
        option.value = object.data.revenue[index].value;
        // option.sortOrder = object.data.revenue[index].sortOrder;
        object.selectedsizes.push(option);
      }

      // object.selectedsizes = object.selectedsizes.sort((a,b)=> a.sortOrder-b.sortOrder);

      console.log("selectedsize", object.selectedsizes);
      object.selectedsize = object.selectedsizes[0];


      //object.selectedindustry = object.selectedIndustries[0];
      if (object.data.revenue != undefined && object.data.revenue != null) {
        object.revenueFilterLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.revenueFilterLoaded = false;
        object.showDigitalData = false;
      }

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

  showDefaultRegion() {
    let object = this;

    object.dropDownService.getRegions().subscribe((data: any) => {
      object.data.region = data.region;
      object.selectedregions = [];

      //set default selection
      let temp: any = {};

      temp.id = "Grand Total";
      temp.key = "Grand Total";
      temp.value = "Global";
      object.selectedregions.push(temp);

      for (let index in object.data.region) {
        let option: any = {};

        option.id = object.data.region[index].id;
        option.key = object.data.region[index].key;
        option.value = object.data.region[index].value;
        object.selectedregions.push(option);


      }

      console.log('object.selectedregions ', object.selectedregions);

      object.selectedregion = object.selectedregions[0];
      // object.selectedregion = "Grand Total";
      // object.defaultregion = "Grand Total";
      // object.regionFilterLoaded = true;

      if (object.data.region != undefined && object.data.region != null) {
        object.regionFilterLoaded = true;
        object.isAllReleventDataLoaded();
      }
      else {
        object.regionFilterLoaded = false;
        object.showDigitalData = false;
      }

console.log("Region loaded",object.data.region);
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

  public filterValue: any;
  //this will be invoked when we change value of drop down
  public getFilterData(filter: string) {

    let object = this;
    object.selectedcustomRef = object.selectedCRGName[0];
    if (filter === "Industry") {
      if (object.selectedindustry.value == "All Industries") {
        this.getGlobalData();
      }
      else {
        this.filterValue = this.selectedindustry.key;
        //call web service
        object.getKPIData("Industry", this.filterValue)
        
      }
      object.selectedsize = object.selectedsizes[0];
      object.selectedregion = object.selectedregions[0];
    }

    if (filter === "Revenue") {
      if (object.selectedsize.value == "All Sizes") {
        this.getGlobalData();
      }
      else {
        this.filterValue = this.selectedsize.key;
        //call web service
        object.getKPIData("Revenue", this.filterValue)
       
      }
      object.selectedindustry = object.selectedIndustries[0];
      object.selectedregion = object.selectedregions[0];


    }
  }


  public getKPIData(filter: string, filterValue: string) {
    let object = this;

    this.pageId = '14';

    object.sharedservice.getDataByFilterValue(filter, filterValue, this.pageId).subscribe((allData: any) => {
      object.landingPageData = allData;

      object.createBusinessInnovationData();
      object.createDigitalBackboneData();
      object.createDigitalEcosystemsData();
      object.createSmartTechnologiesData();
      object.createDigitalOperatingData();
      object.createInsightsboneData();

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "14",
        "pageName": "Non CIO Service Desk Tower Landing Screen",
        "errorType": "Fatal",
        "errorTitle": "web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })

  }




  setRegion(region) {

    let object = this;

    this.pageId = '14';
    object.selectedcustomRef = object.selectedCRGName[0];

    console.log("region", region);
    if (region.value == "Global") {
      object.getGlobalData();
    }
    else {
      this.filterValue = region.key;
      //call web service
      object.getKPIData("Region", this.filterValue);
     

    }

    object.selectedindustry = object.selectedIndustries[0];
    object.selectedsize = object.selectedsizes[0];
  }

  //function to check all relevent data is loaded on page
  isAllReleventDataLoaded() {
    let object = this;
    object.showDigitalData = true;
    // if (
    //   object.industryDataLoaded &&  
    //   object.revenueFilterLoaded &&
    //   object.regionFilterLoaded &&
    //   object.landingPageDataLoaded) {
    //   object.showDigitalData = true;
      object.industrySizeService.getEmitter().emit('landingPageDataLoaded');
      object.compareHeaderDataService.setData(object.data);
      let emitter = object.compareHeaderDataService.getEmitter();
      emitter.emit('dataChange');
      
    // }
    // else {
    //   object.showDigitalData = false;
    // }
  }

 


  createBusinessInnovationData() {
    let object = this;
    object.businessInnovationLabel = [];
    object.businessInnovationChartData = [];


    let tempDataObj = { data: [], label: 'Market Data' };
    let tempDataObj1 = {data:[], label: 'Scenario Data'};
    //insert labels, data
    for (let cnt = 0; cnt < object.landingPageData.Data.BusinessModelInnovation.length; cnt++) {
      if(object.enterMyDataBarChart != undefined || object.enterMyDataBarChart != null){
        if(object.enterMyDataBarChart.Data.BusinessModelInnovation != undefined || object.enterMyDataBarChart.Data.BusinessModelInnovation != null){
          for (let cnt1 = 0; cnt1 < object.enterMyDataBarChart.Data.BusinessModelInnovation.length; cnt1++) {
            if(object.landingPageData.Data.BusinessModelInnovation[cnt].questionName == object.enterMyDataBarChart.Data.BusinessModelInnovation[cnt1].questionName){
              tempDataObj1.data.push(object.enterMyDataBarChart.Data.BusinessModelInnovation[cnt1].value);
            }      
          }
        }
      }
      //label
      object.businessInnovationLabel.push(object.landingPageData.Data.BusinessModelInnovation[cnt].questionName);
      
      //data
      tempDataObj.data.push((Number(object.landingPageData.Data.BusinessModelInnovation[cnt].value)).toFixed()); 

    }
   
    object.businessInnovationChartData.push(tempDataObj);
    
    if(object.enterMyDataBarChart != undefined || object.enterMyDataBarChart != null){
      if(object.enterMyDataBarChart.Data.BusinessModelInnovation.length > 0 && (object.enterMyDataBarChart.Data.BusinessModelInnovation != undefined || object.enterMyDataBarChart.Data.BusinessModelInnovation != null)){
        object.businessInnovationChartData.push(tempDataObj1);
      }
    }

    console.log('object.topTenChartData: ', tempDataObj);
    console.log("businessInnovation",object.businessInnovationChartData);

  }

  // resetLandingPageData(){
  //   let object= this;
  //   object.businessInnovationChartData=[];
  //   object.digitalBackboneChartData=[];
  //   object.digitalEcosystemsChartData=[];
  //   object.digitalOperatingChartData = [];
  //   object.insightsChartData = [];
  // }

  createDigitalBackboneData() {
    let object = this;
    object.digitalBackboneChartData = [];
    object.digitalBackboneLabel = [];

    let tempDataObj = { data: [], label: 'Market Data' };        
    let tempDataObj1 = { data: [], label: 'Scenario Data' };
    

    //insert labels, data
    for (let cnt = 0; cnt < object.landingPageData.Data.DigitalBackbone.length; cnt++) {
      if (object.enterMyDataBarChart!= undefined || object.enterMyDataBarChart != null) {
        if(object.enterMyDataBarChart.Data.DigitalBackbone != undefined || object.enterMyDataBarChart.Data.DigitalBackbone != null) {
        
          //insert labels, data
        for (let cnt1 = 0; cnt1 < object.enterMyDataBarChart.Data.DigitalBackbone.length; cnt1++) {
          if (object.enterMyDataBarChart.Data.DigitalBackbone[cnt1].questionName == object.landingPageData.Data.DigitalBackbone[cnt].questionName) {

            //data
            tempDataObj1.data.push(object.enterMyDataBarChart.Data.DigitalBackbone[cnt1].value);

          }

        }
     
      }
    }
      //label
      object.digitalBackboneLabel.push(object.landingPageData.Data.DigitalBackbone[cnt].questionName);

      //data
      tempDataObj.data.push((Number(object.landingPageData.Data.DigitalBackbone[cnt].value)).toFixed());

    }

    object.digitalBackboneChartData.push(tempDataObj);
    if (object.enterMyDataBarChart!= undefined || object.enterMyDataBarChart != null) {
      if(object.enterMyDataBarChart.Data.DigitalBackbone.length > 0 && (object.enterMyDataBarChart.Data.DigitalBackbone != undefined || object.enterMyDataBarChart.Data.DigitalBackbone != null)) {
        
      object.digitalBackboneChartData.push(tempDataObj1);
      }
    }

    console.log('object.bottomTenChartData: ', object.digitalBackboneChartData);

  }

  createDigitalEcosystemsData() {
    let object = this;
    object.digitalEcosystemsLabel = [];
    object.digitalEcosystemsChartData = [];

    let tempDataObj = { data: [], label: 'Market Data' };
    
    let tempDataObj1 = { data: [], label: 'Scenario Data' };

    //insert labels, data
    for (let cnt = 0; cnt < object.landingPageData.Data.DigitalEcosystems.length; cnt++) {
      if(object.enterMyDataBarChart!= undefined || object.enterMyDataBarChart != null){
        if(object.enterMyDataBarChart.Data.DigitalEcosystems.length != undefined || object.enterMyDataBarChart.Data.DigitalEcosystems.length != null){
          //insert labels, data
           for (let cnt1 = 0; cnt1 < object.enterMyDataBarChart.Data.DigitalEcosystems.length; cnt1++) {
             if(object.enterMyDataBarChart.Data.DigitalEcosystems[cnt1].questionName == object.landingPageData.Data.DigitalEcosystems[cnt].questionName){
                
               //data
               tempDataObj1.data.push(object.enterMyDataBarChart.Data.DigitalEcosystems[cnt1].value);
             }
 
           }
       }
      }
      
      //label
      object.digitalEcosystemsLabel.push(object.landingPageData.Data.DigitalEcosystems[cnt].questionName);

      //data
      tempDataObj.data.push((Number(object.landingPageData.Data.DigitalEcosystems[cnt].value)).toFixed());

    }

   

    object.digitalEcosystemsChartData.push(tempDataObj);
    if(object.enterMyDataBarChart !=undefined || object.enterMyDataBarChart != null){
      if(object.enterMyDataBarChart.Data.DigitalEcosystems.length > 0 && (object.enterMyDataBarChart.Data.DigitalEcosystems != undefined || object.enterMyDataBarChart.Data.DigitalEcosystems != null)){
        object.digitalEcosystemsChartData.push(tempDataObj1);
      }
    }
    

    console.log('ecosystem: ', object.digitalEcosystemsChartData);

  }

  createDigitalOperatingData() {
    let object = this;
    object.digitalOperatingLabel = [];
    object.digitalOperatingChartData = [];

    let tempDataObj = { data: [], label: 'Market Data' };
    let tempDataObj1 = { data: [], label: 'Scenario Data' };

    //insert labels, data
    for (let cnt = 0; cnt < object.landingPageData.Data.EnterpriseAgilityformerlyDigitalOperatingModel.length; cnt++) {

      if(object.enterMyDataBarChart!= undefined || object.enterMyDataBarChart != null){
        if(object.enterMyDataBarChart.Data.EnterpriseAgilityformerlyDigitalOperatingModel != undefined || object.enterMyDataBarChart.Data.EnterpriseAgilityformerlyDigitalOperatingModel != null){
          //insert labels, data
          for (let cnt1 = 0; cnt1 < object.enterMyDataBarChart.Data.EnterpriseAgilityformerlyDigitalOperatingModel.length; cnt1++) {   
            if(object.enterMyDataBarChart.Data.EnterpriseAgilityformerlyDigitalOperatingModel[cnt1].questionName == object.landingPageData.Data.EnterpriseAgilityformerlyDigitalOperatingModel[cnt].questionName){
             //data
             tempDataObj1.data.push(object.enterMyDataBarChart.Data.EnterpriseAgilityformerlyDigitalOperatingModel[cnt1].value);
            }      
          }
        }
      }
     
      //label
      object.digitalOperatingLabel.push(object.landingPageData.Data.EnterpriseAgilityformerlyDigitalOperatingModel[cnt].questionName);

      //data
      tempDataObj.data.push((Number(object.landingPageData.Data.EnterpriseAgilityformerlyDigitalOperatingModel[cnt].value).toFixed()));

    }

    object.digitalOperatingChartData.push(tempDataObj);
    if(object.enterMyDataBarChart!= undefined || object.enterMyDataBarChart != null){
      if(object.enterMyDataBarChart.Data.EnterpriseAgilityformerlyDigitalOperatingModel.length > 0 && (object.enterMyDataBarChart.Data.EnterpriseAgilityformerlyDigitalOperatingModel != undefined || object.enterMyDataBarChart.Data.EnterpriseAgilityformerlyDigitalOperatingModel != null)){
        object.digitalOperatingChartData.push(tempDataObj1);
      }
    }


    console.log('object.bottomTenChartData: ', object.digitalOperatingChartData);

  }

  createInsightsboneData() {
    let object = this;
    object.insightsLabel= [];
    object.insightsChartData = [];

    let tempDataObj = { data: [], label: 'Market Data' };
    let tempDataObj1 = { data: [], label: 'Scenario Data' };

    //insert labels, data
    for (let cnt = 0; cnt < object.landingPageData.Data.Insights.length; cnt++) {
      if(object.enterMyDataBarChart!= undefined || object.enterMyDataBarChart != null){
        if (object.enterMyDataBarChart.Data.Insights != undefined || object.enterMyDataBarChart.Data.Insights != null) {
          //insert labels, data
          for (let cnt1 = 0; cnt1 < object.enterMyDataBarChart.Data.Insights.length; cnt1++) {
            if (object.landingPageData.Data.Insights[cnt].questionName == object.enterMyDataBarChart.Data.Insights[cnt1].questionName) {
  
              //data
              tempDataObj1.data.push(object.enterMyDataBarChart.Data.Insights[cnt].value);
            }
  
          }
        }
      }
      //label
      object.insightsLabel.push(object.landingPageData.Data.Insights[cnt].questionName);

      //data
      tempDataObj.data.push((Number(object.landingPageData.Data.Insights[cnt].value)).toFixed());

    }

    

    object.insightsChartData.push(tempDataObj);
    if(object.enterMyDataBarChart!= undefined || object.enterMyDataBarChart != null){
      if(object.enterMyDataBarChart.Data.Insights.length > 0 && (object.enterMyDataBarChart.Data.Insights != undefined || object.enterMyDataBarChart.Data.Insights != null)) {
       
        object.insightsChartData.push(tempDataObj1);
      }
    }

    console.log('object.bottomTenChartData: ', object.insightsChartData);

  }


  createSmartTechnologiesData() {
    let object = this;
    object.smartTechnologiesLabel = [];
    object.smartTechnologiesChartData = [];

    let tempDataObj = { data: [], label: 'Market Data' };
    let tempDataObj1 = { data: [], label: 'Scenario Data' };
    

    //insert labels, data
    for (let cnt = 0; cnt < object.landingPageData.Data.TechnologiesatScaleformerlySmartTechnologies.length; cnt++) {
     if(object.enterMyDataBarChart != undefined || object.enterMyDataBarChart != null){
      if(object.enterMyDataBarChart.Data.TechnologiesatScaleformerlySmartTechnologies != undefined || object.enterMyDataBarChart.Data.TechnologiesatScaleformerlySmartTechnologies != null){
        // //insert labels, data
        for (let cnt1 = 0; cnt1 < object.enterMyDataBarChart.Data.TechnologiesatScaleformerlySmartTechnologies.length; cnt1++) {
          if(object.enterMyDataBarChart.Data.TechnologiesatScaleformerlySmartTechnologies[cnt1].questionName == object.landingPageData.Data.TechnologiesatScaleformerlySmartTechnologies[cnt].questionName){ 
            //data
            tempDataObj1.data.push(object.enterMyDataBarChart.Data.TechnologiesatScaleformerlySmartTechnologies[cnt1].value);
          }
        }
      }
     }
      //label
      object.smartTechnologiesLabel.push(object.landingPageData.Data.TechnologiesatScaleformerlySmartTechnologies[cnt].questionName);

      //data
      tempDataObj.data.push((Number(object.landingPageData.Data.TechnologiesatScaleformerlySmartTechnologies[cnt].value)).toFixed());

    }

    

    object.smartTechnologiesChartData.push(tempDataObj);
    if(object.enterMyDataBarChart != undefined || object.enterMyDataBarChart != null){
      if(object.enterMyDataBarChart.Data.TechnologiesatScaleformerlySmartTechnologies.length > 0 && (object.enterMyDataBarChart.Data.TechnologiesatScaleformerlySmartTechnologies != undefined || object.enterMyDataBarChart.Data.TechnologiesatScaleformerlySmartTechnologies != null)){
        object.smartTechnologiesChartData.push(tempDataObj1);
      }
    }

    console.log('object.bottomTenChartData: ', object.smartTechnologiesChartData);

  }

  ShowCompareModel() {
    this.showCompareScreen = 'block';
    let object = this;
    object.compareComponent.close();

  }
  HideCompareModel() {
    this.showCompareScreen = 'none';
  }

  
  setCompareComponent(reference) {
    let object = this;
    object.compareComponent = reference;
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


  //this function will notify compareScreen to update itself with the current data
  notifyCompareScreen() {
    let object = this;
    if (object.industryLoaded && object.regionLoaded) {
      object.compareHeaderDataService.setData(object.data);
      let emitter = object.compareHeaderDataService.getEmitter();
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

  // }

  getScenarioDataByCustomRef(selectedcustomRef) {

    //get crg data by id

    let object = this;

    // if (object.showDiv == false) //in case compare scnarion is enabled, dont reset
    // {
      //reset other filters
      object.resetNonCRGFilters();

    // }
    
    //when selected N/A
    if (selectedcustomRef.customId == '-9999') {
      object.getGlobalData();
      // object.showDefaultCurrency();
    }
    else {
      //set custom reference group in service
      object.crgService.setCRGId(selectedcustomRef.customId);
      object.crgService.setDashboardId(14);

      //web service to fetch CRG data
      object.crgService.fetchCRGDataById().subscribe((crgData: any) => {


        if (crgData != undefined || crgData != null) {
          object.landingPageData = crgData;

          object.createBusinessInnovationData();
          object.createDigitalBackboneData();
          object.createDigitalEcosystemsData();
          object.createSmartTechnologiesData();
          object.createDigitalOperatingData();
          object.createInsightsboneData();
          // object.landingPageDataLoaded = true;
        }

      });
    }

  }

  getCRGDropdown() {
    //get dropdown of scenarios

    let object = this;

    //TODO..
    //wb service to fetch CRG list

    try {

      let dashborid = 14;
      object.industrySizeService.getCustomRefereneGroupList().subscribe((data: any) => {


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
        temp.definition = "";//
        object.selectedCRGName.push(temp);

        console.log('mainframe object.selectedCRGName ', object.selectedCRGName);

        for (let index in object.customReferenceGroupList) {
          let option: any = {};

          if (object.customReferenceGroupList[index].dashboardId == '14') {
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

  }

  
  resetNonCRGFilters() {

    let object = this;

    //object.show = false;
    object.landingPageDataLoaded = false;
    object.revenueFilterLoaded = false;
    object.regionFilterLoaded = false;
    object.industryDataLoaded = false;

    //scale service
    object.showDefaultRevenue();

    //Region
    object.showDefaultRegion();

    //industry
    object.showDefaultIndustry();

  }

  getSurveyDataByID(selectedSurvey){

    let object = this;
    let selectedSurveyId: any[] = [];
    selectedSurveyId.push(selectedSurvey.surveyId);

    object.showDefaultLandingData();
    object.showDefaultIndustry();
    object.showDefaultRegion();
    object.showDefaultRevenue();

    
    let dataobj={
      "selectedValue":{
        "sectionName":"DigitalSurvey",
        "sectionValues":selectedSurveyId, // replace this with selected survey id once dropdown added.
        "dashBoardId":14
      },
    "sessionId":object.sessionId}

   
    if(object.selectedSurvey.surveyId == undefined || object.selectedSurvey.surveyId == null || object.selectedSurvey.surveyId == -9999){
      //resetting survey data
      object.enterMyDataBarChart.Data.BusinessModelInnovation = [];
      object.enterMyDataBarChart.Data.DigitalBackbone = [];
      object.enterMyDataBarChart.Data.DigitalEcosystems = [];
      object.enterMyDataBarChart.Data.EnterpriseAgilityformerlyDigitalOperatingModel = [];
      object.enterMyDataBarChart.Data.Insights = [];
      object.enterMyDataBarChart.Data.TechnologiesatScaleformerlySmartTechnologies = [];
      //resetting end

    }else{
      object.sharedservice.getSurveyDataForDashboard(dataobj).subscribe(data =>{


        object.enterMyDataBarChart = data;

        // for(let obj of object.enterMyDataBarChart.Data){
        //   for(let obj1=0; obj1 < obj.length; obj1++){
        //     if(obj[obj1].value == "null" || obj[obj1].value == null || obj[obj1].value == undefined){
        //       obj[obj1].value = -9999;
        //     }
        //   }
          
        // }
        // console.log(data.Data)
        //assignment of user data with other fields
        object.enterMyData = {
          "ITSpendasRevenue" : data.Data.DigitalSpendasaofRevenue[0].value != "null" ? (Number(data.Data.DigitalSpendasaofRevenue[0].value)) : -9999,
          "hardware" : data.Data.DigitalSpendbycategory[1].value != "null" ? (Number(data.Data.DigitalSpendbycategory[1].value)) : -9999,
          "software" : data.Data.DigitalSpendbycategory[2].value != "null" ? (Number(data.Data.DigitalSpendbycategory[2].value)): -9999,
          "personnel" : data.Data.DigitalSpendbycategory[3].value !="null"? (Number(data.Data.DigitalSpendbycategory[3].value)):-9999,
          "services" : data.Data.DigitalSpendbycategory[4].value != "null" ? (Number(data.Data.DigitalSpendbycategory[4].value)): -9999,
          "spendother" :data.Data.DigitalSpendbycategory[5].value != "null" ? (Number(data.Data.DigitalSpendbycategory[5].value)): -9999,
          "fulltimeemployee" : data.Data.Employeesdedicatedtodigital[1].value != "null" ? (Number(data.Data.Employeesdedicatedtodigital[1].value)): -9999,
          "fulltimecontractor" : data.Data.Employeesdedicatedtodigital[2].value != "null" ? (Number(data.Data.Employeesdedicatedtodigital[2].value)): -9999,
          "revenue": null,
          "revenueIncreased" : data.Data.BenefitsofDigitalinitiatives[1].value != "null"? (Number(data.Data.BenefitsofDigitalinitiatives[1].value)): -9999,
          "customerretention" : null,
          "customerretentionincreased" : data.Data.BenefitsofDigitalinitiatives[3].value != "null" ? (Number(data.Data.BenefitsofDigitalinitiatives[3].value)) : -9999,
          "operationalexpenses" : null,
          "operationalexpensesdecreased" : data.Data.BenefitsofDigitalinitiatives[5].value !="null" ?  (Number(data.Data.BenefitsofDigitalinitiatives[5].value)): -9999,
          "coerpa": (data.Data.WherecompanieshaveCOEs[1].value != -9999 && data.Data.WherecompanieshaveCOEs[1].value != 0) ? "Yes": "No",
          "coeAI" : (data.Data.WherecompanieshaveCOEs[2].value != -9999 && data.Data.WherecompanieshaveCOEs[2].value != 0) ? "Yes": "No",
          "coeblockchain" : (data.Data.WherecompanieshaveCOEs[3].value != -9999 && data.Data.WherecompanieshaveCOEs[3].value != 0) ? "Yes": "No",
          "coeenterprise" : (data.Data.WherecompanieshaveCOEs[4].value != -9999 && data.Data.WherecompanieshaveCOEs[4].value != 0) ? "Yes": "No",
          "coeinternet" : (data.Data.WherecompanieshaveCOEs[5].value != -9999 && data.Data.WherecompanieshaveCOEs[5].value != 0) ? "Yes": "No",
          "coeaugmented" : (data.Data.WherecompanieshaveCOEs[6].value != -9999 && data.Data.WherecompanieshaveCOEs[6].value != 0) ? "Yes": "No",
          "coedigitalmarketing" : (data.Data.WherecompanieshaveCOEs[7].value != -9999 && data.Data.WherecompanieshaveCOEs[7].value != 0) ? "Yes": "No",
          "digitalSpendOfITSpend": data.Data.DigitalSpendasaofITSpend[0].value != "null" ? (Number(data.Data.DigitalSpendasaofITSpend[0].value)): -9999,
          "digitalSpendPerEmployee": data.Data.DigitalSpendperEmployee[0].value != "null" ? (Number(data.Data.DigitalSpendperEmployee[0].value)): -9999,
          "digitalEmployeesPerEmployee": data.Data.DigitalEmployeesasofCompanyEmployees[0].value != "null" ? (Number(data.Data.DigitalEmployeesasofCompanyEmployees[0].value)): -9999
        };

        console.log(object.enterMyData);


        //it spend

        if(Number(object.enterMyData.ITSpendasRevenue).toFixed(1) == Number(object.landingPageData.Data.DigitalSpendasaofRevenue[0].value).toFixed(1))
        {
          object.itSpendEquality =true;
        } 
        else
        {
          object.itSpendEquality =false;
        }

        //personnel
        if(Number(object.enterMyData.personnel) == Number(object.landingPageData.Data.DigitalSpendbycategory[2].value))
        {
          object.itSpendPersonnelEquality =true;
        } 
        else
        {
          object.itSpendPersonnelEquality =false;
        }

        //hardware
        if(Number(object.enterMyData.hardware) == Number(object.landingPageData.Data.DigitalSpendbycategory[0].value))
        {
          object.itSpendHardwareEquality =true;
        } 
        else
        {
          object.itSpendHardwareEquality =false;
        }

        //software
        if(Number(object.enterMyData.software) == Number(object.landingPageData.Data.DigitalSpendbycategory[1].value))
        {
          object.itSpendSoftwareEquality =true;
        } 
        else
        {
          object.itSpendSoftwareEquality =false;
        }

        //servces
        if(Number(object.enterMyData.services) == Number(object.landingPageData.Data.DigitalSpendbycategory[3].value))
        {
          object.itSpendServicesEquality =true;
        } 
        else
        {
          object.itSpendServicesEquality =false;
        }

        //others
        if(Number(object.enterMyData.spendother) == Number(object.landingPageData.Data.DigitalSpendbycategory[4].value))
        {
          object.itSpendOthersEquality =true;
        } 
        else
        {
          object.itSpendOthersEquality =false;
        }

        //employees dedicated to digital
        if(Number(object.enterMyData.fulltimeemployee) == Number(object.landingPageData.Data.Employeesdedicatedtodigital[1].value))
        {
          object.fullTimeEmployeeEquality =true;
        } 
        else
        {
          object.fullTimeEmployeeEquality =false;
        }

        // //contractors dedicated to digital
        if(Number(object.enterMyData.fulltimecontractor) == Number(object.landingPageData.Data.Employeesdedicatedtodigital[0].value))
        {
          object.fullTimeContractorEquality =true;
        } 
        else
        {
          object.fullTimeContractorEquality =false;
        }

        //revenue
        if(Number(object.enterMyData.revenueIncreased) == Number(object.landingPageData.Data.BenefitsofDigitalinitiatives[3].value))
        {
          object.revenueEquality =true;
        } 
        else
        {
          object.revenueEquality =false;
        }

        //retention
        if(Number(object.enterMyData.customerretentionincreased) == Number(object.landingPageData.Data.BenefitsofDigitalinitiatives[4].value))
        {
          object.customerRetentionEquality =true;
        } 
        else
        {
          object.customerRetentionEquality =false;
        }


        //operational revenue
        if(Number(object.enterMyData.operationalexpensesdecreased) == Number(object.landingPageData.Data.BenefitsofDigitalinitiatives[0].value))
        {
          object.operationExpensesEquality =true;
        } 
        else
        {
          object.operationExpensesEquality =false;
        }

        //digital sped of IT spend
        if(Number(object.enterMyData.digitalSpendOfITSpend) == Number(object.landingPageData.Data.DigitalSpendasaofITSpend[0].value))
        {
          object.digitalSpendOfITSpendEquality =true;
        } 
        else
        {
          object.digitalSpendOfITSpendEquality =false;
        }

       
        //digital spend per employee
        if(Number(object.enterMyData.digitalSpendPerEmployee) == Number(object.landingPageData.Data.DigitalSpendperEmployee[0].value))
        {
          object.digitalSpendPerEmployeeEquality =true;
        } 
        else
        {
          object.digitalSpendPerEmployeeEquality =false;
        }

        
        //digital employee per employee
        if(Number(object.enterMyData.digitalEmployeesPerEmployee) == Number(object.landingPageData.Data.DigitalEmployeesasofCompanyEmployees[0].value))
        {
          object.digitalEmployeeEquality =true;
        } 
        else
        {
          object.digitalEmployeeEquality =false;
        }
       

        //bar chart
        if(object.enterMyDataBarChart != undefined && object.enterMyDataBarChart != null) {
          //create KPI's data of survey for bar chart
          object.createBusinessInnovationData();
          object.createDigitalBackboneData();
          object.createDigitalEcosystemsData();
          object.createSmartTechnologiesData();
          object.createDigitalOperatingData();
          object.createInsightsboneData();
  
          object.enterMyDataLoaded = true;
        }
        else {
          object.enterMyDataLoaded = false;
        }
      });
    }

  }

  getSurveyList() {

    let object = this;

    //web service
    object.sharedservice.getSurveyListForUser('14').subscribe((response: any) => {

        //list of survey
        object.surveyList = response;
        console.log("surveyList", object.surveyList);
        
        object.selectedSurveyList = [];

        //set default selection
        let temp: any = {};

        temp.label = "N/A";
        temp.value = false;
        temp.id = "-9999";
        temp.surveyId = "-9999";
        temp.dashboardId = "14";
        object.selectedSurveyList.push(temp);

        for (let index in object.surveyList) {
          let option: any = {};

          option.label = object.surveyList[index].surveyName;
          option.value = false;
          option.id = object.surveyList[index].userSurveyId;
          option.surveyId = object.surveyList[index].surveyId;
          option.dashboardId = object.surveyList[index].dashboardId;
          object.selectedSurveyList.push(option);
         
        }

        if(object.navigatedFromInputMyData==true)
        {

               var len= object.selectedSurveyList.length -1;
               object.selectedSurvey = object.selectedSurveyList[len];
               
               object.getSurveyDataByID(object.selectedSurvey);
          
        }
        else
        {
          object.selectedSurvey = object.selectedSurveyList[0];
          object.getSurveyDataByID(object.selectedSurvey);
        }
        

    }, (error) => {
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
            "dashboardId": '14',
            "pageName": "Non CIO Service Desk Tower Input My Data Screen",
            "errorType": "Fatal",
            "errorTitle": "Web Service Error",
            "errorDescription": error.message,
            "errorObject": error
        }

        throw errorObj;
    });

}

makePositiveValue(val) {
  return Math.abs(val).toFixed(2);
}
 
getGlobalData(){
  let object= this;
  object.sharedservice.getDefaultLandingData('14').subscribe((repsonse) => {
    object.landingPageData = repsonse;

    object.createBusinessInnovationData();
    object.createDigitalBackboneData();
    object.createDigitalEcosystemsData();
    object.createSmartTechnologiesData();
    object.createDigitalOperatingData();
    object.createInsightsboneData();

  }, (error) => {
    //throw custom exception to global error handler
    //create error object
    let errorObj = {
      "dashboardId": "14",
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
