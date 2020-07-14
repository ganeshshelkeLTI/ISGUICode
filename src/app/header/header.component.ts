/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:header.component.ts **/
/** Description: This file is created to display header menu and links **/
/** Created By: 10651577  Created Date: 28/09/2018 **/
/** Update By:  10650919  Update Date:  01/10/2018 **/
/** Developed at:  **/
/*******************************************************/

import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
  Output, OnDestroy
} from '@angular/core';
import {
  FilterDataService
} from '../services/filter-data.service'
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
  EventEmitter
} from 'events';
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
  Location, formatDate, DatePipe
} from '@angular/common';
import {
  Router
} from '@angular/router';
import {
  SiblingDataService
} from '../services/sibling-data.service';
import {
  HeaderCompareEnterDataSharedService
} from '../services/header-compare-enter-data-shared.service';

import {
  EnterCompareDataTowersService
} from '../services/enter-compare-data-towers.service';
import {
  ComaparegridShareddataService
} from '../services/comaparegrid-shareddata.service';
import {
  UpdateCompareScreenNotificationService
} from '../services/update-compare-screen-notification.service';
import {
  ComaparegridServerShareddataService
} from '../services/comaparegrid-server-shareddata.service';

import {
  MainframeInputmydataSharedService
} from '../services/mainframe-inputmydata-shared.service';
import {
  LoginDataBroadcastService
} from '../services/login/login-data-broadcast.service';
import {
  Roles
} from '../entities/roles';
import {
  element
} from 'protractor';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import { PrivilegesService } from '../services/privileges.service';

import { environment } from '../../environments/environment';

import { IndustrySizeService } from '../services/industry-size.service';

import { OktaAuthService } from '@okta/okta-angular';

import {
  CompareGridService
} from '../services/compare-grid.service';

import {
  CIOEnterMyDataSharedService
} from '../services/cioenter-my-data-shared.service'

import { CustomRefGroupService } from '../services/custom-ref-group/custom-ref-group.service';

import { GetrevenueService } from '../services/getrevenue.service';
import { UpdateScenarioListNotificationServiceService } from '../services/update-scenario-list-notification-service.service';
import { Ng6NotifyPopupService } from 'ng6-notify-popup';
import { NotificationMaintenanceService } from '../services/notification-maintenance/notification-maintenance.service';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [FilterDataService, Ng6NotifyPopupService]
})
export class HeaderComponent implements OnInit, OnDestroy {

  public MINUTES_UNITL_AUTO_LOGOUT: number = 30 // in mins
  public CHECK_INTERVAL: number = 15000 // in ms
  public STORE_KEY = 'lastAction';


  public emitter = new EventEmitter();

  private APIURL: string;

  //private data: FilterData;
  private data: any = {};
  private data1: IsgKpiData;

  private selectedindustry; //it will be assigned string
  private selectedregion; //it will be assigned string
  private selectedsize; //it will be assigned string
  private selectedcurrency; //this will be assigned whole object currency

  private defaultindustry;
  private defaultregion;
  private defaultsize;
  private defaultcurrency;
  private compareComponent: CompareComponent
  private showAdmin: boolean;
  private industryLoaded: boolean;
  private regionLoaded: boolean;
  public revenueLoaded: boolean;
  public crgLoaded: boolean;
  public currencyLoaded: boolean;
  public scenarioLoaded: boolean;
  public CIODataLoaded: boolean;
  public showEnteredDataflag: boolean = false;
  private showHeader: boolean = true;
  private showLogoHeader: boolean = true;
  public showEnterDataFlg: boolean = false;
  private showMainframeHeader: boolean = false;
  private showApplicationHeader: boolean = false;
  private showDigitalHeader: boolean = false;
  private currentURL: string = '';
  currentUrl: any;
  route: string;

  showCompareGridChild: boolean = false;
  public showCompareGridTowerflag: boolean = false;
  private enableEnterMyData: boolean;


  showCompareScreen: string = 'none';
  showCompareGridScreen: string = 'none';

  private selectedIndustry: string;

  resizePopup: string = "minimize";

  serverHeader: boolean = false;

  activeLink: string = "mainframe";

  //Servers Towers Enter My Data
  public showEnteredDataTowerflag: boolean = false;
  public showEnterDataTowerflag: boolean = false;

  public hideHeaderForLogin: boolean = false;
  public fullname: string;
  public userdata: any;
  public role: string;
  privilegesObject: any;
  private canAccessKPI: boolean = false;
  private canAccessAdmin: boolean;
  private adminAccessObject: any;
  private isInternal: boolean;
  // public role: string;

  selectedMenuOption: string = 'Insights';

  //flag to check landing page data load
  public landingPageDataLoaded: boolean = false;

  menuOverlayFlg: boolean = false;

  public scenarios: any;
  public selectedScenarioList: any[];
  public selectedscenario: any;

  //CRG
  public customReferenceGroupList: any;
  public selectedCRGName: any;
  public CRGNameToCompare: any;
  public selectedcustomRef: any;
  public selectedCRGData: any;

  public selectedregions: any;
  public revenues: any;

  @ViewChild('ghostbutton') notificationButton: ElementRef;
  public notificationMessage: any;

  constructor(private http: HttpClient,
    private service: FilterDataService,
    private commonService: CioheaderdataService,
    private compareHeaderDataService: HeaderCompareScreenDataService,
    private dropDownService: DropDownService,
    location: Location,
    private router: Router,
    private siblingData: SiblingDataService,
    private headerInputMyDataShared: HeaderCompareEnterDataSharedService,
    private genericEnterCompare: EnterCompareDataTowersService,
    private compareGridSharedService: ComaparegridShareddataService,
    private updateCompareScreenNotificationService: UpdateCompareScreenNotificationService,
    private mainframeSharedService: MainframeInputmydataSharedService,
    private comaparegridServerShareddataService: ComaparegridServerShareddataService,
    private loginDataBroadcastService: LoginDataBroadcastService,
    private _router: Router,
    private _location: Location,
    private privileges: PrivilegesService,
    private industrySizeService: IndustrySizeService,
    public oktaService: OktaAuthService,
    private compareGridService: CompareGridService,
    private cIOEnterMyDataSharedService: CIOEnterMyDataSharedService,
    private customRefGroupService: CustomRefGroupService,
    private getrevenueService: GetrevenueService,
    private updateScenarioListNotificationServiceService: UpdateScenarioListNotificationServiceService,
    private notify: Ng6NotifyPopupService,
    private notificationMaintenanceService: NotificationMaintenanceService) {
    let object = this;


    object.check();
    object.initListener();
    object.initInterval();
    localStorage.setItem(object.STORE_KEY, Date.now().toString());




    updateScenarioListNotificationServiceService.getEmitter().on('updateCIOScenarioListAfterDeletion', function () {
      object.getScenarioDropDown();
    });

    object.industryLoaded = false;
    object.regionLoaded = false;
    object.revenueLoaded = false;
    object.crgLoaded = false;
    object.currencyLoaded = false;
    object.scenarioLoaded = false;
    object.showAdmin = false;
    object.CIODataLoaded = false;

    object.setAdminRight();

    object.canAccessKPI = JSON.parse(localStorage.getItem('userloginInfo')).canAceessKPI;
    let isInternal = JSON.parse(localStorage.getItem('userloginInfo')).userDetails.isInternal;

    if (isInternal == "yes") {
      object.isInternal = true;
    } else {
      object.isInternal = false;
    }

    object.privilegesObject = object.privileges.getData();



    object.privileges.getEmitter().on('updatePrivileges', function () {
      object.privilegesObject = object.privileges.getData();


    });

    this.APIURL = environment.apiUrl;

    let loginSharedData = object.loginDataBroadcastService.getEmitter();
    loginSharedData.on('setLoginData', function () {
      object.getUserLoginInfo();
    })

    object.validatePath();

    router.events.subscribe((val) => {


      if (location.path() == '/kpiMaintainace') {
        this.showHeader = false;
        object.currentURL = '/kpiMaintainace';
      } else {
        this.showHeader = true;
        object.currentURL = location.path();
      }
      //for mainframe
      if (location.path() == '/Mainframe' || location.path() == '/Windows' || location.path() == '/Linux' || location.path() == '/Unix' || location.path() == '/Storage' || location.path() == '/WorkplaceServices' || location.path() == '/ServiceDesk' || location.path() == '/LAN' || location.path() == '/WAN' || location.path() == '/Voice') {
        this.showMainframeHeader = true;
        object.currentURL = location.path();
      } else {
        this.showMainframeHeader = false;
        object.currentURL = location.path();

      }

      //for application 
      if (location.path() == '/application-development' || location.path() == '/application-maintenance') {
        this.showApplicationHeader = true;
        object.currentURL = location.path();
      } else {
        this.showApplicationHeader = false;
        object.currentURL = location.path();
      }

      //for digital
      if (location.path() == '/Digital') {
        this.showDigitalHeader = true;
        object.currentURL = location.path();
      } else {
        this.showDigitalHeader = false;
        object.currentURL = location.path();
      }





      if (location.path() == '/login' || location.path() == '' || location.path() == '/app-authentication-failure') {
        this.hideHeaderForLogin = true;
      } else {
        this.hideHeaderForLogin = false;
      }


      this.currentUrl = router.url;


      if (this.currentUrl == '/' || this.currentUrl == '/CIODashboard') {
        this.selectedItem = 'dashboard';

      } else if (location.path() == '/Mainframe' || location.path() == '/Windows' || location.path() == '/Linux' || location.path() == '/Unix' || location.path() == '/Storage' || location.path() == '/WorkplaceServices' || location.path() == '/ServiceDesk' || location.path() == '/LAN' || location.path() == '/WAN' || location.path() == '/Voice') {
        this.selectedItem = 'mainframe';
      } else if (location.path() == '/Digital') {
        this.selectedItem = 'digital';
      }
      else if (location.path() == '/application-development') {
        this.selectedItem = 'application';
      }
      else if (location.path() == '/application-maintenance') {
        this.selectedItem = 'application';
      }
      else {
        this.selectedItem = '';
      }


      if (location.path() == '/roleMaster') {
        this.showLogoHeader = false;
        object.currentUrl = '/roleMaster';
      } else if (location.path() == '/dashboardMaster') {
        this.showLogoHeader = false;
        object.currentURL = '/dashboardMaster';
      } else if (location.path() == '/featureMaster') {
        this.showLogoHeader = false;
        object.currentURL = '/featureMaster';
      } else if (location.path() == '/dashboardFeatureMapping') {
        this.showLogoHeader = false;
        object.currentURL = '/dashboardFeatureMapping';
      } else if (location.path() == '/roleDashboardMapping') {
        this.showLogoHeader = false;
        object.currentURL = '/roleDashboardMapping';
      } else if (location.path() == '/roleUserMapping') {
        this.showLogoHeader = false;
        object.currentURL = '/roleUserMapping';
      } else if (location.path() == '/externalUserProjectMapping') {
        this.showLogoHeader = false;
        object.currentURL = '/externalUserProjectMapping';
      } else if (location.path() == '/viewExternalUser') {
        this.showLogoHeader = false;
        object.currentURL = '/viewExternalUser';
      } else if (location.path() == '/adminRights') {
        this.showLogoHeader = false;
        object.currentURL = '/adminRights';
      } else if (location.path() == '/roleDashboardMapping') {
        this.showLogoHeader = false;
        object.currentURL = '/roleDashboardMapping';
      } else if (location.path() == '/customReferenceRoleUserMapping') {
        this.showLogoHeader = false;
        object.currentURL = '/customReferenceRoleUserMapping';
      }
      else if (location.path() == '/customReferenceMaintenance') {
        this.showLogoHeader = false;
        object.currentURL = '/customReferenceMaintenance';
      }
      else if (location.path() == '/surveyQuestionMaintenance') {
        this.showLogoHeader = false;
        object.currentURL = '/surveyQuestionMaintenance';
      }
      else if (location.path() == '/surveyValidation') {
        this.showLogoHeader = false;
        object.currentURL = '/surveyValidation';
      }
      else if (location.path() == '/scenarioMaintenance') {
        this.showLogoHeader = false;
        object.currentURL = '/scenarioMaintenance';
      }
      else if (location.path() == '/masterQuestionMaintenance') {
        this.showLogoHeader = false;
        object.currentURL = '/masterQuestionMaintenance';
      }
      else if (location.path() == '/deploymentNotificationComponent') {
        this.showLogoHeader = false;
        object.currentURL = '/deploymentNotificationComponent';
      }
      else {
        this.showLogoHeader = true;
        object.currentURL = location.path();
      }

    });

    //event to get landing page data load so that compare screen can be enabled
    object.industrySizeService.getEmitter().on('landingPageDataLoaded', function () {

      object.landingPageDataLoaded = true;

    });

    //event to reset landing page data load so that compare screen can be disabled
    object.industrySizeService.getEmitter().on('landingPageDataReset', function () {

      object.landingPageDataLoaded = false;

    });


    //event to get scenario currency
    object.commonService.getEvent().on('setScenarioCurrency', function () {

      let selectCurrency = object.cIOEnterMyDataSharedService.getData().currency;

      // let selectCurrency = object.commonService.getData();

      if (typeof selectCurrency === 'object') {
        selectCurrency = selectCurrency.key;
      }



      object.data.currency.forEach((element) => {

        if (element.key == selectCurrency) {
          object.selectedcurrency = element;
        }

      });
      //now again sending data to cio

      object.commonService.setData(object.selectedcurrency);
      object.commonService.getEvent().emit('change');

    })

    //event to reset currency
    object.commonService.getEvent().on('resetcurrency', function () {

      let selectCurrency = "FE482E13-D3B6-4208-8C3C-2FD7AFBEBEA1";//USD key

      // let selectCurrency = object.commonService.getData();

      // if (typeof selectCurrency === 'object') {
      //   selectCurrency = selectCurrency.key;
      // }



      object.data.currency.forEach((element) => {

        if (element.key == selectCurrency) {
          object.selectedcurrency = element;
        }

      });


      //reset scenario
      object.selectedscenario = object.selectedScenarioList[0];

      //now again sending data to cio

      object.commonService.setData(object.selectedcurrency);
      object.commonService.getEvent().emit('change');


    })



    //event to update scenario dropdown
    object.commonService.getEvent().on('updatescenariodropdown', function () {

      //get selected scenario
      let selectedscenario = object.cIOEnterMyDataSharedService.getScenarioSelection();


      if (selectedscenario != null || selectedscenario != undefined) {
        //get dropdown of scenarios
        // List of scenarios for dropdown
        object.compareGridService.getScanrioData().subscribe(function (response) {

          try {
            object.scenarios = response;
            object.selectedScenarioList = [];

            //set default selection
            let temp: any = {};

            temp.label = "N/A";
            temp.name = "N/A";
            temp.value = false;
            temp.id = "-9999"; //
            object.selectedScenarioList.push(temp);


            let scanrioId = 0;
            for (let index in object.scenarios) {
              let option: any = {};

              option.label = index + '_' + object.scenarios[index];
              option.name = object.scenarios[index];
              option.value = false;
              option.id = index; //
              object.selectedScenarioList.push(option);


              if (selectedscenario == index) {
                object.selectedscenario = option;
              }

            }



            //object.selectedscenario = object.selectedScenarioList[Number(selectedscenario)];

            object.scenarioLoaded = true;
            object.notifyCompareScreen();


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

    })

    //event to updated newly created scenario in dropdown
    object.commonService.getEvent().on('newCIOScenarioSaved', function () {

      //get selected scenario
      let selectedscenario = object.cIOEnterMyDataSharedService.getScenarioSelection();

      if (selectedscenario != null || selectedscenario != undefined) {
        //get dropdown of scenarios
        // List of scenarios for dropdown
        object.compareGridService.getScanrioData().subscribe(function (response) {

          try {
            object.scenarios = response;
            object.selectedScenarioList = [];

            //set default selection
            let temp: any = {};

            temp.label = "N/A";
            temp.name = "N/A";
            temp.value = false;
            temp.id = "-9999"; //
            object.selectedScenarioList.push(temp);


            let scanrioId = 0;
            for (let index in object.scenarios) {
              let option: any = {};

              option.label = index + '_' + object.scenarios[index];
              option.name = object.scenarios[index];
              option.value = false;
              option.id = index; //
              object.selectedScenarioList.push(option);
              if (selectedscenario == index) {
                object.selectedscenario = option;
              }
            }

            //object.selectedscenario = object.selectedScenarioList[Number(selectedscenario)];
            object.scenarioLoaded = true;
            object.notifyCompareScreen();

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

  }


  initListener() {
    document.body.addEventListener('click', () => this.reset());
    document.body.addEventListener('mouseover', () => this.reset());
    document.body.addEventListener('mouseout', () => this.reset());
    document.body.addEventListener('keydown', () => this.reset());
    document.body.addEventListener('keyup', () => this.reset());
    document.body.addEventListener('keypress', () => this.reset());
  }

  reset() {
    this.setLastAction(Date.now());
  }

  initInterval() {
    setInterval(() => {
      this.check();
    }, this.CHECK_INTERVAL);
  }


  public getLastAction() {
    return parseInt(localStorage.getItem(this.STORE_KEY));
  }
  public setLastAction(lastAction: number) {
    localStorage.setItem(this.STORE_KEY, lastAction.toString());
  }

  check() {

    let location = this._location;

    console.log('checking route 1: ', location.path());

    if (location.path() != '' && location.path() != '/Login' && location.path() != null && location.path() != undefined) {

      console.log('checking route 2: ', location.path());
      const now = Date.now();
      console.log('Now: ', now);
      const timeleft = this.getLastAction() + this.MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
      console.log('time left: ', timeleft);
      const diff = timeleft - now;
      console.log('difference: ', diff);
      const isTimeout = diff < 0;

      if (isTimeout) {
        // localStorage.clear();
        //alert('Your session is expired due to inactivity. Please login again to continue.');
        // this.router.navigate(['./login']);
        $('.modal-idle-session-popup').modal({
          backdrop: 'static',
          keyboard: false,
          show: true
        });
        //this.logoutUser();
      }
    }
  }

  closeSessionPopup() {
    let object = this;

    $('.modal-idle-session-popup').modal('hide');

    setTimeout(function () {
      object.logoutUser();
    }, 2000);


  }

  // get user login details from login data broadcast service
  getUserLoginInfo() {
    let _self = this;
    _self.userdata = _self.loginDataBroadcastService.get('userloginInfo');
    _self.fullname = _self.userdata["userDetails"]["fullName"];
    _self.industrySizeService.setUserEmail(_self.userdata['userDetails']['emailId']);
    _self.customRefGroupService.setUserEmail(_self.userdata['userDetails']['emailId']);
    // _self.role = _self.userdata["userDetails"]["role"];
    // _self.role = _self.userdata['userDetails']["role"];
  }

  // updatePrivileges() {
  //   let role = "demo_sales_lite";
  //   let enableEnterMyData=Roles.user.roles.demo_sales_lite.enter_data;
  //   this.enableEnterMyData=enableEnterMyData;
  // }

  ngOnInit() {
    let object = this;
    object.enableEnterMyData = true;

    object.notificationPopupCall();


    // object.updatePrivileges();

    $(".option-menus-collapse").hide();
    $(".search-box").addClass('search-hide');
    object.searchIcon();

    //this will be invoked when user will click on save and compare from input my data

    object.commonService.getEvent().on('setCurrency', function () {
      //we will get currency from cio dashboard which cio is getting from input my data
      //Path for data input my data->cio->header
      let selectCurrency = object.commonService.getData();

      if (typeof selectCurrency === 'object') {
        selectCurrency = selectCurrency.key;
      }



      object.data.currency.forEach((element) => {

        if (element.key == selectCurrency) {
          object.selectedcurrency = element;
        }

      });
      //now again sending data to cio

      object.commonService.setData(object.selectedcurrency);
      object.commonService.getEvent().emit('change');
      object.commonService.getEvent().emit('toggle');



    });




    object.dropDownService.getIndustry().subscribe((data: any) => {
      object.data = {
        industries: []
      };

      for (let indObj of data.industries) {
        if (indObj.key != "C946BACA-444F-4E5D-8FB9-94BF3457C6B8") {
          object.data.industries.push(indObj);
        }
      }
      // object.data.industries = data.industries;

      object.selectedindustry = "Grand Total";
      object.defaultindustry = "Grand Total";
      object.industryLoaded = true;
      object.notifyCompareScreen();



    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "1",
        "pageName": "Header Filters",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });

    /*object.dropDownService.getRegions().subscribe((data: any) => {

      object.data.region = data.region;
      object.selectedregion = "Grand Total";
      object.defaultregion = "Grand Total";
      object.regionLoaded = true;
      object.notifyCompareScreen();

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "1",
        "pageName": "Header Filters",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });

    
    // List of scenarios for dropdown
    object.compareGridService.getScanrioData().subscribe(function (response) {

      try {
        object.scenarios = response;
        object.selectedScenarioList = [];

        //set default selection
        let temp: any = {};

        temp.label = "N/A";
        temp.name = "N/A";
        temp.value = false;
        temp.id = "-9999"; //
        object.selectedScenarioList.push(temp);


        let scanrioId = 0;
        for (let index in object.scenarios) {
          let option: any = {};

          option.label = index + '_' + object.scenarios[index];
          option.name = object.scenarios[index];
          option.value = false;
          option.id = index; //
          object.selectedScenarioList.push(option);
        }

        object.selectedscenario = object.selectedScenarioList[0];
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

    object.dropDownService.getRevenue().subscribe((data: any) => {
      object.data.revenue = data.revenue;
      object.selectedsize = "Grand Total";
      object.defaultsize = "Grand Total";

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "1",
        "pageName": "Header Filters",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    }) */

    // logged in user info
    object.getUserLoginInfo();



    //get CRG list
    object.getCRGDropdown();

    //region
    object.getRegionDropDown();

    //scenario
    object.getScenarioDropDown();

    //revenue
    object.getRevenueDropDown();




    //showing header
    // this.showHeader = true;
  }

  public notificationData: any;
  notificationPopupCall() {
    let object = this;

    //calling webservice for fetching notification data 
    object.notificationMaintenanceService.fetchNotificationDetails().subscribe(data => {
      object.notificationData = data[0];

      /** 
       * adding condition for displaying popup.
       * if popupenable is not displayed yet and its enablePopup flag is true then only we will allow to display popup window
      */
      if (sessionStorage.getItem('popupDisplayed') != 'true' && (object.notificationData.flag == true || object.notificationData.flag == 'True') ) {

        console.log('display popup: ', sessionStorage.getItem('popupDisplayed'));
        //this.show("success", "success", 'top');

        //show popup
        //#overallPer
        let inputElement: HTMLElement = object.notificationButton.nativeElement as HTMLElement;
        inputElement.click();

        //auto close popup after 1 minute
        setTimeout(function () {
          $('.modal-notificication-popup').modal('hide');
        }, 60000);


        // object.notificationData = { "Start_Time": "2020-03-29:10:30:AM", "End_Time": "2020-03-31:12:30:PM", "Notification_type": "Prod Deployment", "Notification_Message": "Application will be down for scheduled maintenance", "Create_On": "When details are inserted in the table" };
        let date;
        let day = new Date(object.notificationData.startTime).getDay();
        console.log("day:",day);
        let message;
        let gsDayNames = [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ];

        let dayName = gsDayNames[day];

        let result = object.notificationData.notificationMessage.includes(dayName);

        let time = new Date(object.notificationData.startTime).toLocaleTimeString(navigator.language, {
          hour: '2-digit',
          minute:'2-digit'
        });
        console.log(time);
        let endTime = new Date(object.notificationData.endTime).toLocaleTimeString(navigator.language, {
          hour: '2-digit',
          minute:'2-digit'
        });
        if (result == true) {
          date = new Date(object.notificationData.startTime).toLocaleDateString();
          message = object.notificationData.notificationMessage + " " + date + " between " + time + " to " + endTime + " GMT";
        } else {
          date = new Date(object.notificationData.startTime).toDateString();
          message = object.notificationData.notificationMessage + " on " + date + " between " + time + " to " + endTime + " GMT";
        }

        object.notificationMessage = message;
        console.log('message: ', message);

        //update popup status
        sessionStorage.setItem('popupDisplayed', 'true');




        // $('.modal-notificication-popup').modal('hide');
        // $('.modal-notificication-popup').css('display','block');
        // // $('.modal-notificication-popup').modal({
        // //   backdrop: 'static',
        // //   keyboard: false,
        // //   show: true
        // // });

      }
    });
    console.log('display popup: ', sessionStorage.getItem('popupDisplayed'));

  }

  closeNotificationPopup() {
    let object = this;

    $('.modal-notificication-popup').modal('hide');
  }

  getCurrencyDropDown() {
    let object = this;

    object.dropDownService.getCurrency().subscribe((data: any) => {
      object.data.currency = data['currencyExchange'];



      let currency;

      object.data.currency.forEach(element => {

        if (element.value === "USD") {
          currency = element;

          object.selectedcurrency = currency;

          object.defaultcurrency = currency;
          object.currencyLoaded = true;
        }

      });

      object.selectedcurrency = currency;

      object.defaultcurrency = object.selectedcurrency;


      object.commonService.setData(object.selectedcurrency);
      //object.commonService.getEvent().emit('change');

      object.notifyCompareScreen();

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "1",
        "pageName": "Header Filters",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });

  }


  getRegionDropDown() {
    let object = this;
    object.dropDownService.getRegions().subscribe((data: any) => {

      object.data.region = data.region;
      object.selectedregions = object.data.region;
      object.selectedregion = "Grand Total";
      object.defaultregion = "Grand Total";
      object.regionLoaded = true;
      object.notifyCompareScreen();



    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "1",
        "pageName": "Header Filters",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });

  }

  getRevenueDropDown() {
    let object = this;
    object.dropDownService.getRevenue().subscribe((data: any) => {
      object.data.revenue = data.revenue;
      object.getrevenueService.setData(object.data.revenue);
      object.revenues = object.data.revenue;
      object.selectedsize = "Grand Total";
      object.defaultsize = "Grand Total";

      object.revenueLoaded = true;
      //currency
      object.getCurrencyDropDown();

      object.notifyCompareScreen();


    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "1",
        "pageName": "Header Filters",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })
  }

  getScenarioDropDown() {
    let object = this;

    // List of scenarios for dropdown
    object.compareGridService.getScanrioData().subscribe(function (response) {

      try {
        object.scenarios = response;
        object.selectedScenarioList = [];

        //set default selection
        let temp: any = {};

        temp.label = "N/A";
        temp.name = "N/A";
        temp.value = false;
        temp.id = "-9999"; //
        object.selectedScenarioList.push(temp);


        let scanrioId = 0;
        for (let index in object.scenarios) {
          let option: any = {};

          option.label = index + '_' + object.scenarios[index];
          option.name = object.scenarios[index];
          option.value = false;
          option.id = index; //
          object.selectedScenarioList.push(option);
        }

        object.selectedscenario = object.selectedScenarioList[0];
        object.scenarioLoaded = true;

        object.notifyCompareScreen();

        //set selected scenario in shared service
        object.commonService.setScenario(object.selectedscenario);

        object.commonService.getEventEmitter().emit('scenariodropdownchange');


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

  getIndustryDropdown() {
    let object = this;
    object.dropDownService.getIndustry().subscribe((data: any) => {
      object.data = {
        industries: []
      };

      for (let indObj of data.industries) {
        if (indObj.key != "C946BACA-444F-4E5D-8FB9-94BF3457C6B8") {
          object.data.industries.push(indObj);
        }
      }
      // object.data.industries = data.industries;

      object.selectedindustry = "Grand Total";
      object.defaultindustry = "Grand Total";
      object.industryLoaded = true;
      object.notifyCompareScreen();



    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "1",
        "pageName": "Header Filters",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });
  }

  logoutUser() {
    this.privileges.resetALL();
    // this.http.get("http://23.101.52.40:8080/isgDashboard/logout").subscribe();
    this.http.get(this.APIURL + "/isgDashboard/logout").subscribe();
    localStorage.removeItem('userloginInfo');
    sessionStorage.clear();

    //this.router.navigate(['/']);

    //redirect to external login page
    this.oktaService.logout('/');

    //dev
    // if(this.APIURL=='https://isgintellisourcedev.isg-one.com:8443/')
    // {
    //   //window.location.href='https://isgb2c.b2clogin.com/isgb2c.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_ISG_Momentum_SU_SI&client_id=c5501d47-10fc-48b8-b6c1-384e5ec3e995&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fisginformxdev.isg-one.com%2Fdev&scope=openid&response_type=id_token&prompt=login';

    //   this.oktaService.logout('/');

    // }
    // //QA
    // else if(this.APIURL=='https://isgintellisourceqaws.isg-one.com:8443/')
    // {
    //   window.location.href='https://isgb2c.b2clogin.com/isgb2c.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_ISG_GENERIC_SUSI&client_id=c663867c-064b-455e-9d58-364fa911dc28&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fisginformxtest.isg-one.com&scope=openid&response_type=id_token&prompt=login';
    // }
    // //prod
    // else if(this.APIURL=='https://isgintellisource.isg-one.com:8443/')
    // {
    //   window.location.href='https://isgb2c.b2clogin.com/isgb2c.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_ISG_GENERIC_SUSI&client_id=848bd326-7030-4952-b9c1-d567b550ba6b&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fisginformx.isg-one.com&scope=openid&response_type=id_token&prompt=login';
    // }
    // else
    // {
    //   //window.location.href='https://isgb2c.b2clogin.com/isgb2c.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_ISG_Momentum_SU_SI&client_id=c5501d47-10fc-48b8-b6c1-384e5ec3e995&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fisginformxdev.isg-one.com%2Fdev&scope=openid&response_type=id_token&prompt=login';
    //   this.oktaService.logout('/');
    // }
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
          "dashboardId": "",
          "pageName": "Header Filters",
          "errorType": "Fatal",
          "errorTitle": "Web Service Error",
          "errorDescription": error.message,
          "errorObject": error
        }

        throw errorObj;
      })
  }


  //this will be invoked when we change value of drop down
  public getFilterData(filter: string) {

    let object = this;

    if (filter === "industry") {

      if (this.selectedindustry == "Total") {

        this.getKPIData("Total", "Grand Total");
      } else {
        this.getKPIData("Industry", object.selectedindustry)
      }

      this.selectedregion = this.defaultregion;
      this.selectedsize = this.defaultsize;
      this.selectedcustomRef = this.selectedCRGName[0];
      // this.selectedcurrency = this.defaultcurrency;
      return;
    }
    if (filter === "size") {

      if (this.selectedsize == "Total") {

        this.getKPIData("Total", "Grand Total");
      } else {
        this.getKPIData("Size", object.selectedsize)
      }
      this.selectedindustry = this.defaultindustry;
      this.selectedregion = this.defaultregion;
      this.selectedcustomRef = this.selectedCRGName[0];
      // this.selectedcurrency = this.defaultcurrency;
      return;

    }
    if (filter === "region") {

      if (this.selectedregion == "Total") {

        this.getKPIData("Total", "Grand Total");
      } else {
        this.getKPIData("Region", object.selectedregion)
      }
      this.selectedindustry = this.defaultindustry;
      this.selectedsize = this.defaultsize;
      this.selectedcustomRef = this.selectedCRGName[0];
      // this.selectedcurrency = this.defaultcurrency;
      return;
    }
    if (filter === "currency") {
      object.commonService.currencies = object.data.currency;
      object.commonService.setData(this.selectedcurrency);
      object.commonService.getEvent().emit('change');
      object.commonService.getEvent().emit('convertCurrency');
      //since we need all currencies

      return;
    }
    if (filter === "scenario") {

      //set selected scenario in shared service
      object.commonService.setScenario(this.selectedscenario);

      object.commonService.getEventEmitter().emit('scenariodropdownchange');
      this.selectedindustry = this.defaultindustry;
      this.selectedsize = this.defaultsize;
      this.selectedregion = this.defaultregion;
    }

    if (filter === "custom_reference") {

      //set selected CRG in shared service
      object.commonService.setCRGData(this.selectedcustomRef);


      object.commonService.getEventEmitter().emit('CRGdropdownchange');
      this.selectedindustry = this.defaultindustry;
      this.selectedsize = this.defaultsize;
      this.selectedregion = this.defaultregion;
    }
  }
  //this will be invoked when we click on compare button on header
  ShowCompareModel() {
    this.showCompareScreen = 'block';
    let object = this;
    object.compareComponent.close();
    object.compareHeaderDataService.getEmitter().emit('updateCompareScreen');
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

    if (object.industryLoaded && object.regionLoaded && object.revenueLoaded && object.crgLoaded && object.currencyLoaded && object.scenarioLoaded) {
      object.CIODataLoaded = true;
      object.compareHeaderDataService.setData(object.data);
      let emitter = object.compareHeaderDataService.getEmitter();
      emitter.emit('dataChange');


    }

  }

  showEnterDataPopup() {
    let object = this;
    object.showEnterDataFlg = true;
    object.siblingData.changeEnterDataHeaderFlag(false);
  }

  public openNav() {
    document.getElementById("mySidenav").style.right = "0px";
    this.menuOverlayFlg = true;
  }

  public closeNav() {
    document.getElementById("mySidenav").style.right = "-250px";
    this.menuOverlayFlg = false;
  }

  showEnterData() {
    let object = this;
    object.showEnteredDataflag = true;
    object.headerInputMyDataShared.getEmitter().emit('showSaveAndCompareButton');

  }

  mobileView() {
    $(".option-menus-collapse").addClass('search-hide');
    $(".search-box").addClass('search-hide');
  }

  searchIcon() {
    // $(".search-icon").click(function(){
    $(".search-box").toggle();
    // });
  }

  toggleMenu() {
    // $('.firstline-menus').on('click', function () {
    $('.firstline-menus-collapse').toggleClass('open')
    // })
  }

  private selectedItem = 'dashboard';

  //toggle dashboard and mainframe menu

  toggleDashboard(event, newValue) {

    this.selectedItem = newValue; // don't forget to update the model here

    // ... do other stuff here ...
    this.selectedindustry = "Grand Total";
    this.selectedregion = "Grand Total";
    this.selectedsize = "Grand Total";
    this.selectedcurrency = this.defaultcurrency;
    this.selectedscenario = this.selectedScenarioList[0];
    this.selectedcustomRef = this.selectedCRGName[0];

    //call CRG dropdown refresh in case of CIO
    if (this.selectedItem == 'dashboard') {
      this.getCRGDropdown();
      this.getRegionDropDown();
      this.getRevenueDropDown();
      this.getCurrencyDropDown();
      this.getScenarioDropDown();
      this.getIndustryDropdown();

    }

    if (this.selectedItem == 'digital') {
      this.getRevenueDropDown();
      // this.getrevenueService.setData(this.revenues);
    }

  }


  updateActiveLink(event, item) {
    if (item == 'mainframe') {
      this.activeLink = 'mainframe';
    } else if (item == 'servers') {
      this.activeLink = 'servers';
    } else if (item == 'workplace') {
      this.activeLink = 'workplace';
    } else if (item == 'servicedesk') {
      this.activeLink = 'servicedesk';
    } else if (item == 'application') {
      this.activeLink = 'application';
    }
  }

  //popup logic for enter my data on towers
  showEnterDataTower() {
    let object = this;
    this.showEnteredDataTowerflag = true;
    object.headerInputMyDataShared.getEmitter().emit('showEnterDataTowerButton');
  }

  showEnterDataTowersPopup() {
    let object = this;
    object.showEnterDataTowerflag = true;
    object.siblingData.changeEnterDataHeaderFlag(false);
  }

  public setCompare() {
    let object = this;
    //emit an event of comapre popup opened
    object.comaparegridServerShareddataService.getEmitter().emit('popupOpen');
    this.showCompareGridTowerflag = true;


  }
  public updateCompareScreen() {
    let object = this;

    object.updateCompareScreenNotificationService.getEmitter().emit('updateCompareScreen');

  }

  public setInoutMyData() {
    let object = this;
    object.mainframeSharedService.getEmitter().emit('popupOpenInputmydata');
  }

  openKpiMaintenence() {
    this.router.navigate(['/kpiMaintainace']);
    this.closeNav();
  }

  openDashboardMaster() {
    this.router.navigate(['/dashboardMaster']);
    this.closeNav();
  }

  openFeatureMaster() {
    this.router.navigate(['/featureMaster']);
    this.closeNav();
  }

  openRoleMaster() {
    this.router.navigate(['/roleMaster']);
    this.closeNav();
  }

  openWebLink() {
    this.router.navigate(['/adminRights']);
    this.closeNav();
  }

  openExternalProjectMapping() {
    this.router.navigate(['/externalUserProjectMapping']);
    this.closeNav();
  }

  // openViewAllUser() {
  //   this.router.navigate(['/viewExternalUser']);
  //   this.closeNav();
  // }

  openDashboardFeatureMapping() {
    this.router.navigate(['/dashboardFeatureMapping']);
    this.closeNav();
  }

  openRoleUserMapping() {
    this.router.navigate(['/roleUserMapping']);
    this.closeNav();
  }

  openRoleDashboardMapping() {
    this.router.navigate(['/roleDashboardMapping']);
    this.closeNav();
  }

  //for custom refernce group user mapping

  openCustomReferenceUserMapping() {
    this.router.navigate(['/customReferenceRoleUserMapping']);
    this.closeNav();
  }

  openCustomReferenceMiantenance() {
    this.router.navigate(['/customReferenceMaintenance']);
    this.closeNav();
  }

  openSurveyQuestionMaintenance() {
    this.router.navigate(['/surveyQuestionMaintenance']);
    this.closeNav();
  }

  openSurveyValidation() {
    this.router.navigate(['/surveyValidation']);
    this.closeNav();
  }

  openScenarioMaintenance() {
    this.router.navigate(['/scenarioMaintenance']);
    this.closeNav();
  }

  openMasterQuestionMaintenance() {
    this.router.navigate(['/masterQuestionMaintenance']);
    this.closeNav();
  }

  openDeploymentNotification() {
    this.router.navigate(['/deploymentNotificationComponent']);
    this.closeNav();
  }

  toggleMenuOption(menu_option) {
    this.selectedMenuOption = menu_option;
  }

  // validatePath for route
  validatePath() {
    let object = this;
    let location = this._location;
    let router = this._router;

    if (location.path() == '/kpiMaintainace') {
      this.showHeader = false;
      object.currentURL = '/kpiMaintainace';
    } else {
      this.showHeader = true;
      object.currentURL = location.path();
    }
    //for mainframe
    if (location.path() == '/Mainframe' || location.path() == '/Windows' || location.path() == '/Linux' || location.path() == '/Unix' || location.path() == '/Storage' || location.path() == '/WorkplaceServices' || location.path() == '/ServiceDesk' || location.path() == '/LAN' || location.path() == '/WAN' || location.path() == '/Voice') {
      this.showMainframeHeader = true;
      object.currentURL = location.path();
    } else {
      this.showMainframeHeader = false;
      object.currentURL = location.path();

    }

    //for application 
    if (location.path() == '/application-development' || location.path() == '/application-maintenance') {
      this.showApplicationHeader = true;
      object.currentURL = location.path();
    } else {
      this.showApplicationHeader = false;
      object.currentURL = location.path();
    }

    //for digital
    if (location.path() == '/Digital') {
      this.showDigitalHeader = true;
      object.currentURL = location.path();
    } else {
      this.showDigitalHeader = false;
      object.currentURL = location.path();
    }


    if (location.path() == '/login' || location.path() == '' || location.path() == '/app-authentication-failure') {
      this.hideHeaderForLogin = true;
    } else {
      this.hideHeaderForLogin = false;
    }

    this.currentUrl = router.url;


    if (this.currentUrl == '/' || this.currentUrl == '/CIODashboard') {
      this.selectedItem = 'dashboard';
    } else if (location.path() == '/Mainframe' || location.path() == '/Windows' || location.path() == '/Linux' || location.path() == '/Unix' || location.path() == '/Storage' || location.path() == '/WorkplaceServices' || location.path() == '/ServiceDesk' || location.path() == '/LAN' || location.path() == '/WAN' || location.path() == '/Voice') {
      this.selectedItem = 'mainframe';
    } else if (location.path() == '/Digital') {
      this.selectedItem = 'digital';
    }
    else if (location.path() == '/application-development') {
      this.selectedItem = 'application';
    }
    else if (location.path() == '/application-maintenance') {
      this.selectedItem = 'application';
    }
    else {
      this.selectedItem = '';
    }

    if (location.path() == '/roleMaster') {
      this.showLogoHeader = false;
      object.currentUrl = '/roleMaster';
    } else if (location.path() == '/dashboardMaster') {
      this.showLogoHeader = false;
      object.currentURL = '/dashboardMaster';
    } else if (location.path() == '/featureMaster') {
      this.showLogoHeader = false;
      object.currentURL = '/featureMaster';
    } else if (location.path() == '/dashboardFeatureMapping') {
      this.showLogoHeader = false;
      object.currentURL = '/dashboardFeatureMapping';
    } else if (location.path() == '/roleDashboardMapping') {
      this.showLogoHeader = false;
      object.currentURL = '/roleDashboardMapping';
    } else if (location.path() == '/roleUserMapping') {
      this.showLogoHeader = false;
      object.currentURL = '/roleUserMapping';
    } else if (location.path() == '/externalUserProjectMapping') {
      this.showLogoHeader = false;
      object.currentURL = '/externalUserProjectMapping';
    } else if (location.path() == '/viewExternalUser') {
      this.showLogoHeader = false;
      object.currentURL = '/viewExternalUser';
    } else if (location.path() == '/adminRights') {
      this.showLogoHeader = false;
      object.currentURL = '/adminRights';
    } else if (location.path() == '/customReferenceRoleUserMapping') {
      this.showLogoHeader = false;
      object.currentURL = '/customReferenceRoleUserMapping';
    } else if (location.path() == '/customReferenceMaintenance') {
      this.showLogoHeader = false;
      object.currentURL = '/customReferenceMaintenance';
    }
    else if (location.path() == '/surveyQuestionMaintenance') {
      this.showLogoHeader = false;
      object.currentURL = '/surveyQuestionMaintenance';
    } else if (location.path() == '/surveyValidation') {
      this.showLogoHeader = false;
      object.currentURL = '/surveyValidation';
    }
    else if (location.path() == '/scenarioMaintenance') {
      this.showLogoHeader = false;
      object.currentURL = '/scenarioMaintenance';
    } else if (location.path() == '/masterQuestionMaintenance') {
      this.showLogoHeader = false;
      object.currentURL = '/masterQuestionMaintenance';
    }
    else if (location.path() == '/deploymentNotificationComponent') {
      this.showLogoHeader = false;
      object.currentURL = '/deploymentNotificationComponent';
    } else {
      this.showLogoHeader = true;
      object.currentURL = location.path();
    }

  }

  setAdminRight() {
    let object = this;
    object.adminAccessObject = {};

    object.adminAccessObject["/roleDashboardMapping"] = false;
    object.adminAccessObject["/roleUserMapping"] = false;
    object.adminAccessObject["/dashboardFeatureMapping"] = false;
    object.adminAccessObject["/externalUserProjectMapping"] = false;
    object.adminAccessObject["/dashboardMaster"] = false;
    object.adminAccessObject["/dashboardFeatureMapping"] = false;
    object.adminAccessObject["/roleMaster"] = false;
    object.adminAccessObject["/role-feature"] = false;
    object.adminAccessObject["/adminRights"] = false;
    object.adminAccessObject["/customReferenceMaintenance"] = false;
    object.adminAccessObject["/customReferenceRoleUserMapping"] = false;
    object.adminAccessObject["/surveyQuestionMaintenance"] = false;
    object.adminAccessObject["/surveyValidation"] = false;
    object.adminAccessObject["/scenarioMaintenance"] = false;
    object.adminAccessObject["/masterQuestionMaintenance"] = false;
    object.adminAccessObject["/deploymentNotificationComponent"] = false;

    let screens = JSON.parse(localStorage.getItem('userloginInfo')).screensMap;

    //screensMap["/adminRights"]=true;

    try {
      for (let screen in screens) {

        if (screens[screen] == true) object.showAdmin = true;
        object.adminAccessObject[screen] = screens[screen];
      }

    } catch (error) {

    }

  }
  //avoiding memory leaks
  ngOnDestroy() {
    let object = this;
    object.privileges.getEmitter().removeAllListeners();
  }

  //CRG functions
  getCRGDropdown() {
    //get dropdown of scenarios

    let object = this;

    object.industrySizeService.setPageId(1);


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
        temp.dashboardId = "1";
        temp.updatedBy = null;
        temp.customId = "-9999";
        temp.definition = "";//
        object.selectedCRGName.push(temp);

        for (let index in object.customReferenceGroupList) {
          let option: any = {};

          if (object.customReferenceGroupList[index].dashboardId == '1') {
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

        object.crgLoaded = true;
        object.notifyCompareScreen();



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

  // to append notification popup in body
  show(text: string, type: string, position: string): void {
    let obj = { "Start_Time": "2020-03-29:10:30:AM", "End_Time": "2020-03-31:12:30:PM", "Notification_type": "Prod Deployment", "Notification_Message": "Application will be down", "Create_On": "When details are inserted in the table" };
    let date;
    let day = new Date(obj.Start_Time).getDay();
    let message;
    let gsDayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ];

    let dayName = gsDayNames[day];

    let result = obj.Notification_Message.includes(dayName);
    console.log(result);

    let time = new Date(obj.Start_Time).toLocaleTimeString();
    let endTime = new Date(obj.End_Time).toLocaleTimeString();
    if (result == true) {
      date = new Date(obj.Start_Time).toLocaleDateString();
      message = obj.Notification_Message + " " + date + " at " + time + " to " + endTime + " GMT";
    } else {
      date = new Date(obj.Start_Time).toDateString();
      message = obj.Notification_Message + " on " + date + " at " + time + " to " + endTime + " GMT";
    }

    //  let message = obj.Notification_Message+" on "+date+" at "+time+" to "+endTime+" GMT";
    this.notify.show(message, { position: position, duration: '2000', type: type, sticky: true });
  }



}

