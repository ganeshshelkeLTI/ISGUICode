
/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:compare-towers.component.ts **/
/** Description: This file is created to compare the Scenario data and display in grid **/
/** Created By: 10650919  Created Date: 28/09/2018 **/
/** Update By:  10650919  Update Date:  28/09/2018 **/
/** Developed at:  **/
/*******************************************************/

import {
  Component,
  OnInit,
  Input, OnDestroy, ViewChild
} from '@angular/core';
import {
  HeaderCompareScreenDataService
} from '../services/header-compare-screen-data.service';
import {
  CompareGridService
} from '../services/compare-grid.service';
import {
  ComparegridService
} from '../services/comparegrid.service';
import {
  HeaderComponent
} from '../header/header.component';
import {
  FilterDataService
} from '../services/filter-data.service';
import {
  SiblingDataService
} from '../services/sibling-data.service';
import { ToastrService } from 'ngx-toastr';
import { LinuxEditAndCompareSharedService } from '../services/servers/linux/linux-edit-and-compare-shared.service';
import { UnixEditAndCompareSharedService } from '../services/servers/unix/unix-edit-and-compare-shared.service';

import { WorkplaceEditAndCompareSharedService } from '../services/workplace/workplace-edit-and-compare-shared.service';

import { EditAndCompareSharedService } from '../services/edit-and-compare-shared.service';
import { EnterCompareDataTowersService } from '../services/enter-compare-data-towers.service';
import { ComaparegridShareddataService } from '../services/comaparegrid-shareddata.service';
import { IndustrySizeService } from '../services/industry-size.service';
import { EventEmitter } from 'events';
import { CioheaderdataService } from '../services/cioheaderdata.service';
import { UpdateCompareScreenNotificationService } from '../services/update-compare-screen-notification.service';
import { MainframeEditAndCompareSharedService } from '../services/mainframe/mainframe-edit-and-compare-shared.service';
import { ComaparegridServerShareddataService } from '../services/comaparegrid-server-shareddata.service';

import {
  WindowsEditAndCompareSharedService
} from '../services/servers/windows/windows-edit-and-compare-shared.service';

import {
  StorageEditAndCompareSharedService
} from '../services/storage/storage-edit-and-compare-shared.service'

import {
  CompareeditWorkplaceShareddataService
} from '../services/workplace/compareedit-workplace-shareddata.service'

import {
  ComaparegridStorageSharedService
} from '../services/storage/comaparegrid-storage-shared.service'

import {
  ComaparegridworkplaceSharedService
} from '../services/workplace/comaparegridworkplace-shared.service'

import {
  ComparegridServicedeskSharedService
} from '../services/servicedesk/comparegrid-servicedesk-shared.service'

import { ServiceDeskEditAndCompareSharedService } from '../services/servicedesk/service-desk-edit-and-compare-shared.service';

import {
  WanEditAndCompareSharedService
} from '../services/network/wan/wan-edit-and-compare-shared.service'

import {
  VoiceEditAndCompareSharedService
} from '../services/network/voice/voice-edit-and-compare-shared.service'

import {
  ComparegridNetworkSharedService
} from '../services/network/comparegrid-network-shared.service'

import { LANEditAndCompareSharedService } from '../services/network/lan/lanedit-and-compare-shared.service';
import { PrivilegesService } from '../services/privileges.service';
import { ApplicationDevelopmentEditAndCompareSharedService } from '../services/application-development/application-development-edit-and-compare-shared.service';
import { ComparegridApplicationDevelopmentService } from '../services/application-development/comparegrid-application-development.service';
import { ApplicationMaintenanceEditAndCompareSharedService } from '../services/application-maintenance/application-maintenance-edit-and-compare-shared.service';
import { ComparegridApplicationMaintenanceService } from '../services/application-maintenance/comparegrid-application-maintenance.service';
import { CustomRefGroupService } from '../services/custom-ref-group/custom-ref-group.service';
import { CIOGeneralTabCompanyDetailService } from '../services/ciogeneral-tab-company-detail.service';
import { DropDownService } from '../services/drop-down.service';
import { UpdateScenarioListNotificationServiceService } from '../services/update-scenario-list-notification-service.service';

declare var $: any;
@Component({
  selector: 'compare-towers',
  templateUrl: './compare-towers.component.html',
  styleUrls: ['./compare-towers.component.css']
})

export class CompareTowersComponent implements OnInit, OnDestroy {

  public emitter = new EventEmitter();
  //@ViewChild('')
  private mode: string = "industry";
  private show: boolean = false;
  public disableCompareButton: boolean;
  public disableNewScenarioBtn: boolean = true;
  private headerComponent: HeaderComponent
  private isEditDisabled: boolean = true;
  industryChecked: boolean = true;

  options: boolean = true;
  showIndustries: string = 'region';
  selectedSection: string = 'region';
  showCustomReference: boolean = true;
  selectedValue: any;
  private count = 0;
  setsenarioId: any;
  private isScenariosLoaded: boolean = false;
  private isRegionLoaded: boolean = false;
  public letUserProcced: boolean = true;
  private industries = {};
  private regions = {};
  private revenue = {};

  private scanrio = {

  }

  private selectedIndustries: any[] = [];
  private selectedRegion: any[] = [];
  private selectedRevenue: any[] = [];
  selectedScanrio: any[] = [];
  private flagForOption: boolean;
  public pageId: any;
  privilegesObject: any;

  //custom refrence variables
  private customRerence = {}
  private selectedcustomRerence: any[] = [];
  private isCustomReferenceLoaded: boolean = false;

  //list of servers
  private selectedServers: any[] = [];
  public serverList = [
    { "label": "Windows", "id": "Windows", "value": "false", "dashboardId": 3 },
    { "label": "Linux", "id": "Linux", "value": "false", "dashboardId": 4 },
    { "label": "Unix", "id": "Unix", "value": "false", "dashboardId": 5 }
  ];

  allCurrencyData:any;
  selectedCurrency:any;
  isScenarioNotSelected: boolean = true;
  
  public confirmBoxDeleteFlag:boolean = false;
  public isDeleteAllowed: boolean = false;

  constructor(private compareHeaderDataService: HeaderCompareScreenDataService,
    private compareGridSharedService: ComaparegridServerShareddataService,
    private filter: FilterDataService,
    private compareGridService: CompareGridService,
    private siblingData: SiblingDataService,
    private editAndCompareSharedService: EditAndCompareSharedService,
    private comapreTowerData: EnterCompareDataTowersService,
    public industryService: IndustrySizeService,
    private commonService: CioheaderdataService,
    private updateCompareScreenNotificationService: UpdateCompareScreenNotificationService,
    private mainframeEditAndCompareSharedService: MainframeEditAndCompareSharedService,
    private windowsEditAndCompareSharedService: WindowsEditAndCompareSharedService,
    private linuxEditAndCompareSharedService: LinuxEditAndCompareSharedService,
    private unixEditAndCompareSharedService: UnixEditAndCompareSharedService,
    private storageEditAndCompareSharedService: StorageEditAndCompareSharedService,
    private comparegridNetworkSharedService: ComparegridNetworkSharedService,
    private privilegesService: PrivilegesService,
    private toastr: ToastrService,
    private lanEditAndCompareSharedService: LANEditAndCompareSharedService,
    private workplaceSharedService: ComaparegridworkplaceSharedService,
    private comparegridStorageSharedService: ComaparegridStorageSharedService,
    private comparegridServiceDeskSharedService: ComparegridServicedeskSharedService,
    private voiceEditAndCompareSharedService: VoiceEditAndCompareSharedService,
    private wanEditAndCompareSharedService: WanEditAndCompareSharedService,
    private WorkplaceEditAndCompareSharedService: WorkplaceEditAndCompareSharedService,
    private ServiceDeskEditAndCompareSharedService: ServiceDeskEditAndCompareSharedService,
    private applicationDevelopmentEditAndCompareSharedService: ApplicationDevelopmentEditAndCompareSharedService,
    private comparegridApplicationDevelopmentService: ComparegridApplicationDevelopmentService,
    private applicationMaintenanceEditAndCompareSharedService: ApplicationMaintenanceEditAndCompareSharedService,
    private comparegridApplicationMaintenanceService: ComparegridApplicationMaintenanceService,
    private customRefGroupService: CustomRefGroupService,
    private cIOGeneralTabCompanyDetailService: CIOGeneralTabCompanyDetailService,
    private dropdownservice: DropDownService,
    private updateScenarioListNotificationServiceService: UpdateScenarioListNotificationServiceService) {

    let object = this;


    object.disableCompareButton = true;
    object.disableNewScenarioBtn = true;
    object.privilegesObject = object.privilegesService.getData();

    object.privilegesService.getEmitter().on('updatePrivileges', function () {
      object.privilegesObject = object.privilegesService.getData();
    });

    object.updateCompareScreenNotificationService.getEmitter().on('updateCompareScreen', function () {
      object.getScarerioList();
      object.getCustomRefernceList();
    })

    object.compareHeaderDataService.getEmitter().on('dataChange', function () {
      try {
        let data = (object.compareHeaderDataService.getData());
        object.isRegionLoaded = false;

        for (let industry of data.industries) {
          industry.label = industry.value;
        }

        for (let region of data.region) {
          region.label = region.value;
        }

        // for (let revenue of data.revenue) {
        //   revenue.label = revenue.value;
        // }
        
        object.dropdownservice.getRevenue().subscribe((data: any) => {
          data.revenue = data.revenue;
          console.log(data.revenue);
          for(let revenue of data.revenue){
            revenue.label = revenue.value;
          }
          object.selectedRevenue = [];
          let defaultRevenue = {
           label : "All Sizes",
           value : false,
           id :"Grand Total"
         };
         object.revenue = data.revenue;
         object.selectedRevenue.push(defaultRevenue);
         for(let index in object.revenue){
           let option: any= {};
           option.label = object.revenue[index].label;
           option.value = false;
           option.id = object.revenue[index].id;
           object.selectedRevenue.push(option);
         }
 
         console.log(object.selectedRevenue);
        });
        

        object.industries = data.industries;
        object.regions = data.region;
        object.revenue = data.revenue;
      
        object.selectedRegion = [];

        let gloabalOption: any = {};
        gloabalOption.label = "Global";
        gloabalOption.value = false;
        gloabalOption.id = "Global";//this is id required to send to backend
        object.selectedRegion.push(gloabalOption);

        for (let index in object.regions) {
          let option: any = {};
          option.label = object.regions[index].label;
          option.value = false;
          option.id = object.regions[index].id;
          object.selectedRegion.push(option);

        }
        //this options is added from UI side

        // alert(JSON.stringify(object.selectedRegion));

        object.selectedServers = [];

        //selected servers
        for (let index in object.serverList) {
          let option: any = {};
          option.label = object.serverList[index].label;
          option.value = false;
          option.id = object.serverList[index].id;
          option.dashboardId = object.serverList[index].dashboardId;
          object.selectedServers.push(option);

        }


        //selected industries
        object.selectedIndustries = [];
        let defaultIndustry = {
          label: "All Industries",
          value: false,
          id: "Grand Total"
        };
        object.selectedIndustries.push(defaultIndustry);

        for (let index in object.industries) {
          let option: any = {};
          option.label = object.industries[index].label;
          option.value = false;
          object.selectedIndustries.push(option);
        }

       

        //some changes on for scanrio

        data.scanrio = [];
        object.isRegionLoaded = true;

        object.scanrio = data.scanrio;

        for (let index in object.scanrio) {
          let option: any = {};
          option.label = object.scanrio[index].label;
          option.value = false;
          option.id = object.scanrio[index].id;
          object.selectedScanrio.push(option);
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

    //on popup load event
    object.compareGridSharedService.getEmitter().on('popupOpen', function () {
      //set page id as per tower
      object.pageUpdate();
      object.letUserProcced = false;

    });

    object.compareGridSharedService.getEmitter().on('close', function () {
      object.resetCurrencyOnCompare();
      object.close();
    })

    object.compareHeaderDataService.getEmitter().on('updateCompareScreen', function () {
      object.getScarerioList();
      object.getCustomRefernceList();
    })

    //on comapre grid server popup close, reset compare popup
    this.compareGridSharedService.getEmitter().on('serverGridClose', function () {

      //call reset
      object.resetOptions("industry");
      object.resetOptions("region");
      object.resetOptions("scanerio");
      object.resetOptions("server");
      object.resetOptions("custom_reference");
      //disable scenario edit button
      object.isEditDisabled = true;
      object.resetCurrencyOnCompare();
    })

    //on comapre grid network popup close, reset compare popup
    this.comparegridNetworkSharedService.getEmitter().on('networkGridClose', function () {

      //call reset
      object.resetOptions("industry");
      object.resetOptions("region");
      object.resetOptions("scanerio");
      object.resetOptions("server");
      object.resetOptions("custom_reference");
      //disable scenario edit button
      object.isEditDisabled = true;
      object.resetCurrencyOnCompare();
    })

    //on comapre grid service desk popup close, reset compare popup
    this.comparegridServiceDeskSharedService.getEmitter().on('serviceDeskGridClose', function () {

      //call reset
      object.resetOptions("industry");
      object.resetOptions("region");
      object.resetOptions("scanerio");
      object.resetOptions("server");
      object.resetOptions("custom_reference");
      //disable scenario edit button
      object.isEditDisabled = true;
      object.resetCurrencyOnCompare();

    })

    //on comapre grid workplace popup close, reset compare popup
    this.workplaceSharedService.getEmitter().on('workplaceGridClose', function () {

      //call reset
      object.resetOptions("industry");
      object.resetOptions("region");
      object.resetOptions("scanerio");
      object.resetOptions("server");
      object.resetOptions("custom_reference");
      //disable scenario edit button
      object.isEditDisabled = true;
      object.resetCurrencyOnCompare();
    })

    //on comapre grid storage popup close, reset compare popup
    this.comparegridStorageSharedService.getEmitter().on('storageGridClose', function () {

      //call reset
      object.resetOptions("industry");
      object.resetOptions("region");
      object.resetOptions("scanerio");
      object.resetOptions("server");
      object.resetOptions("custom_reference");
      //disable scenario edit button
      object.isEditDisabled = true;
      object.resetCurrencyOnCompare();
    })

    //on mainframe grid close, reset
    this.mainframeEditAndCompareSharedService.getEmitter().on('mainframeCompareGridClose', function () {

      //call reset
      object.resetOptions("industry");
      object.resetOptions("region");
      object.resetOptions("scanerio");
      object.resetOptions("server");
      object.resetOptions("custom_reference");
      //disable scenario edit button
      object.isEditDisabled = true;
      object.resetCurrencyOnCompare();
    })

    //on application development grid close, reset
    this.comparegridApplicationDevelopmentService.getEmitter().on('applicationDevelopmentCompareGridClose', function () {

      //call reset
      object.resetOptions("industry");
      object.resetOptions("region");
      object.resetOptions("revenue");
      object.resetOptions("scanerio");
      object.resetOptions("server");
      object.resetOptions("custom_reference");
      //disable scenario edit button
      object.isEditDisabled = true;
      object.resetCurrencyOnCompare();
    })

    this.comparegridApplicationMaintenanceService.getEmitter().on('applicatioMaintenanceCompareGridClose', function () {

      //call reset
      object.resetOptions("industry");
      object.resetOptions("region");
      object.resetOptions("revenue");
      object.resetOptions("scanerio");
      object.resetOptions("server");
      object.resetOptions("custom_reference");
      //disable scenario edit button
      object.isEditDisabled = true;
      object.resetCurrencyOnCompare();
    })

  }

  ngOnInit() {

    let object = this;
    object.getScarerioList();
    object.getCustomRefernceList();
    object.siblingData.enterDataHeaderFlagMessage.subscribe(message => this.flagForOption = message)
    object.cIOGeneralTabCompanyDetailService.getAllCurrency().subscribe((currency) => {
      object.allCurrencyData = currency;
      for(let defaultCurrency of object.allCurrencyData.currencyExchange){
        if(defaultCurrency.value === 'USD'){
          object.selectedCurrency = defaultCurrency;
        }
      }
		});

  }

  public pageUpdate() {
    //get page id
    this.pageId = this.industryService.getPageId();

    //alertalert('page '+this.pageId);
    this.showCustomReference = true;
    //this.compareGridSharedService.getEmitter().emit('pageUpdate');

    if (this.pageId == 2 || this.pageId == 3 || this.pageId == 4 || this.pageId == 5 || this.pageId == 6 || this.pageId == 7 || this.pageId == 8 || this.pageId == 9 || this.pageId == 10 || this.pageId == 11) {
      //make regions active by default
      this.showIndustries = 'region';
      //alert(this.showIndustries);
    }

    if (this.pageId == 12 || this.pageId == 13) {
      //make regions active by default
      this.showIndustries = 'industry';
      //alert(this.showIndustries);
    }
  }


  toggleFilter(flagVal) {
    let object = this;
    object.showIndustries = flagVal;
    if (object.showIndustries == 'industry') {
      object.resetOptions("industry");
          console.log("showIndustries  industry", object.showIndustries);
    }else if(object.showIndustries == 'revenue'){
      object.resetOptions("revenue");
      console.log("showIndustries revenue", object.showIndustries);
    }else if(object.showIndustries == 'servers'){
          object.resetOptions("server");
          console.log("showIndustries  server", object.showIndustries);
    }else if(object.showIndustries == 'region'){
        object.resetOptions("region");
        console.log("showIndustries  region", object.showIndustries);
    }else if(object.showIndustries == 'custom_reference'){
      object.resetOptions("custom_reference");
      console.log("showIndustries  region", object.showIndustries);
  }
    object.change();
  }

  getCustomRefernceList() {
    let object = this;
    object.isCustomReferenceLoaded = false;
    object.pageId = this.industryService.getPageId();
    
    object.industryService.getCustomRefereneGroupList().subscribe(function (response) {
      try {
        object.customRerence = response;
        console.log("custom refernce list", object.customRerence);
        
        object.selectedcustomRerence = [];
        let scanrioId = 0;
        for (let index in object.customRerence) {
          let option: any = {};

          option.label = object.customRerence[index].customName;
          option.value = false;
          option.id = object.customRerence[index].customId;
          option.dashboardId = object.customRerence[index].dashboardId;
          object.selectedcustomRerence.push(option);
          //
          // }
        }

      }
      catch (error) {
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



  //this will update scarnioList
  getScarerioList() {
    let object = this;
    object.isScenariosLoaded = false;
    object.comapreTowerData.getScanrioData().subscribe(function (response) {

      try {
        object.scanrio = response;
        object.selectedScanrio = [];

        let scanrioId = 0;
        for (let index in object.scanrio) {
          let option: any = {};

          option.label = index + '_' + object.scanrio[index];
          option.name = object.scanrio[index];
          option.value = false;
          option.id = index; //
          object.selectedScanrio.push(option);
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

      object.selectedScanrio.reverse();
      object.isScenariosLoaded = true;
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": this.pageId,
        "pageName": "Non CIO Compare Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });

    object.isEditDisabled = true;
    //reset
    object.resetOptions("industry");
    object.resetOptions("region");
    object.resetOptions("scanerio");
    object.resetOptions("server");
    object.resetOptions("custom_reference");
  }

  compareData(): void {

    try {

      let object = this;
      let scenarioID = -1;
      let scenarioName: string = "";
      let selectedMode: any;
      for (let scanerio of object.selectedScanrio) {
        if (scanerio.value == true) {
          scenarioID = scanerio.id;
          scenarioName = scanerio.label;
        }
      }

      // for (let  of object.selectedcustomRerence) {
      //   if (scanerio.value == true) {
      //     scenarioID = scanerio.id;
      //     scenarioName = scanerio.label;
      //   }
      // }

      if (object.showIndustries == 'industry') {
        // if (this.pageId == 12 || this.pageId == 13) {
          selectedMode = ("industry");
        }else if(object.showIndustries == 'revenue'){
          selectedMode = ("revenue");
        }
        else if(object.showIndustries == 'servers'){
          selectedMode = ("server");
        // }
      }
      else if(object.showIndustries == 'region'){
        selectedMode = ("region")
      }
      else if(object.showIndustries == 'custom_reference'){
        selectedMode = ("custom_reference")
      }

      //  selectedMode = (object.showIndustries === true ? "server" : "region");

      //alert(JSON.stringify(object.selectedRevenue));

      let requestedParamObj = {
        selectedMode: selectedMode,
        selectedIndustries: object.selectedIndustries,
        selecterevenue: object.selectedRevenue,
        selectedRegion: object.selectedRegion,
        selectedServers: object.selectedServers,
        selectedScenarios: object.selectedScanrio,
        selectedcustomRerence : object.selectedcustomRerence,
        selectedScanrioId: scenarioID,
        selectedScenarioName: scenarioName,
        selectedCurrencyToCompare: object.selectedCurrency
        //add one attribute here selected scenario and bind selcted scenario id to it to access it in compare grid component
      }

      object.letUserProcced = false;
      for (let scanerio of object.selectedScanrio) {
        if (scanerio.value == true)
          object.letUserProcced = true;
      }
      for (let region of object.selectedRegion) {
        if (region.value == true)
          object.letUserProcced = true;
      }
      for (let server of object.selectedServers) {
        if (server.value == true)
          object.letUserProcced = true;
      }
      for (let industries of object.selectedIndustries) {
        if (industries.value == true)
          object.letUserProcced = true;
      }
      for (let revenue of object.selectedRevenue) {
        if (revenue.value == true)
          object.letUserProcced = true;
      }

      for (let customRef of object.selectedcustomRerence) {
        if (customRef.value == true)
        object.letUserProcced = true;
      }

      if (object.letUserProcced == false) {
        //  $('.modal-compare-grid-tower').modal('hide');
        //alert('Please wait..');
        this.toastr.info('Please wait till the data loads...', '', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });

        return;
      }
      $('.compare-towers-modal').modal('hide');

      if (this.pageId == 2) {
        // $('.modal-compare-grid-tower').modal('show');
        $('.modal-compare-grid-tower').modal({
          backdrop: 'static',
          keyboard: false,
          show: true
        });
        object.mainframeEditAndCompareSharedService.setData(requestedParamObj);
        object.mainframeEditAndCompareSharedService.getEmitter().emit('mainframedataChange');
      }
      if (this.pageId == 3) {
        $('.modal-compare-grid-server').modal({
          backdrop: 'static',
          keyboard: false,
          show: true
        });
        object.compareGridSharedService.setData(requestedParamObj);
        object.compareGridSharedService.getEmitter().emit('serverdataChange');

      } if (this.pageId == 4) {
        $('.modal-compare-grid-server').modal({
          backdrop: 'static',
          keyboard: false,
          show: true
        });
        object.compareGridSharedService.setData(requestedParamObj);
        object.compareGridSharedService.getEmitter().emit('serverdataChange');

      } if (this.pageId == 5) {
        $('.modal-compare-grid-server').modal({
          backdrop: 'static',
          keyboard: false,
          show: true
        });

        object.compareGridSharedService.setData(requestedParamObj);
        object.compareGridSharedService.getEmitter().emit('serverdataChange');
      }
      if (this.pageId == 6) {

        $('.modal-compare-grid-storage').modal({
          backdrop: 'static',
          keyboard: false,
          show: true
        });
        object.comparegridStorageSharedService.setData(requestedParamObj);

        object.comparegridStorageSharedService.getEmitter().emit('storageDataChange');
      }
      if (this.pageId == 7 || this.pageId == 8 || this.pageId == 9) {
        $('.modal-compare-grid-network').modal({
          backdrop: 'static',
          keyboard: false,
          show: true
        });
        object.comparegridNetworkSharedService.setData(requestedParamObj);
        object.comparegridNetworkSharedService.getEmitter().emit('networkDataChange');
      }
      if (this.pageId == 10) {

        $('.modal-compare-grid-workplace').modal({
          backdrop: 'static',
          keyboard: false,
          show: true
        });
        object.workplaceSharedService.setData(requestedParamObj);
        object.workplaceSharedService.getEmitter().emit('workplaceDataChange');
      }
      if (this.pageId == 11) {
        $('.modal-compare-grid-servicedesk').modal({
          backdrop: 'static',
          keyboard: false,
          show: true
        });
        object.comparegridServiceDeskSharedService.setData(requestedParamObj);
        object.comparegridServiceDeskSharedService.getEmitter().emit('serviceDeskDataChange');
      }
      if (this.pageId == 12) {
        $('.modal-app-compare-grid-application-development').modal({
          backdrop: 'static',
          keyboard: false,
          show: true
        });

        object.comparegridApplicationDevelopmentService.setData(requestedParamObj);
        object.comparegridApplicationDevelopmentService.getEmitter().emit('applicationDevelopmentDataChange');
      }
      if (this.pageId == 13) {
        $('.modal-app-compare-grid-application-maintenance').modal({
          backdrop: 'static',
          keyboard: false,
          show: true
        });
        object.comparegridApplicationMaintenanceService.setData(requestedParamObj);
        object.comparegridApplicationMaintenanceService.getEmitter().emit('applicationMaintenanceDataChange');
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

  }

  cancelCompareData() { }

  ngDoCheck() { }

  error_class = "";

  //

  public editAndCompare() {

    try {

      let object = this;
      // object.headerComponent.showEnteredDataflag = true;
      //object.siblingData.changeEnterDataHeaderFlag(true);

      let selectedScanrio; // Variable to show edit and compare scenario
      // let object=this;
      for (let scanerio of object.selectedScanrio) {

        if (scanerio.value == true) {
          selectedScanrio = scanerio.id;
          this.setsenarioId = scanerio.id;
        }
      }

      // Set the scenario ID and other selected industries

      // let selectedMode = (object.showIndustries == 'industry' ? "industry" : "region");
      let selectedMode;
      if(object.showIndustries == 'industry'){
        let selectedMode = "industry"
      }else if(object.showIndustries == 'revenue'){
        let selectedMode ="revenue"
      }else if(object.showIndustries == 'region'){
        let selectedMode = "region"
      }

      let requestedParamObj = {
        selectedMode: selectedMode,
        selectedIndustries: object.selectedIndustries,
        selectedRegion: object.selectedRegion,
        selectedServers: object.selectedServers,
        selectedScanrio: selectedScanrio,
        selectedcustomRerence: this.selectedcustomRerence
      }

      if (this.pageId == 2) {
        object.mainframeEditAndCompareSharedService.setData(requestedParamObj);
        object.mainframeEditAndCompareSharedService.getEmitter().emit('editmainframescenario');
        object.mainframeEditAndCompareSharedService.getEmitter().emit('mainframedataChange');
      }
      if (this.pageId == 3) {
        object.windowsEditAndCompareSharedService.setData(requestedParamObj)
        object.windowsEditAndCompareSharedService.getEmitter().emit('serverdataChange')

      } if (this.pageId == 4) {
        object.linuxEditAndCompareSharedService.setData(requestedParamObj)
        object.linuxEditAndCompareSharedService.getEmitter().emit('serverdataChange');

      } if (this.pageId == 5) {
        object.unixEditAndCompareSharedService.setData(requestedParamObj);
        object.unixEditAndCompareSharedService.getEmitter().emit('serverdataChange');
      }
      if (this.pageId == 6) {
        object.storageEditAndCompareSharedService.setData(requestedParamObj);
        object.storageEditAndCompareSharedService.getEmitter().emit('storageDataChange');
      }
      if (this.pageId == 7) {
        object.lanEditAndCompareSharedService.setData(requestedParamObj);
        object.lanEditAndCompareSharedService.getEmitter().emit('networkDataChange');
      }
      if (this.pageId == 8) {
        object.wanEditAndCompareSharedService.setData(requestedParamObj);
        object.wanEditAndCompareSharedService.getEmitter().emit('networkDataChange');

      } if (this.pageId == 9) {
        object.voiceEditAndCompareSharedService.setData(requestedParamObj);
        object.voiceEditAndCompareSharedService.getEmitter().emit('networkDataChange');

      }

      if (this.pageId == 10) {
        object.WorkplaceEditAndCompareSharedService.setData(requestedParamObj);
        object.WorkplaceEditAndCompareSharedService.getEmitter().emit('workplaceDataChange');

      }

      if (this.pageId == 11) {
        object.ServiceDeskEditAndCompareSharedService.setData(requestedParamObj);
        object.ServiceDeskEditAndCompareSharedService.getEmitter().emit('serviceDeskDataChange');

      }

      //as we are using same input screen and web service for input my data
      if (this.pageId == 12) {
        object.applicationDevelopmentEditAndCompareSharedService.setData(requestedParamObj);
        object.applicationDevelopmentEditAndCompareSharedService.getEmitter().emit('applicationDevelopmentDataChange');
      }
      if (this.pageId == 13) {
        object.applicationDevelopmentEditAndCompareSharedService.setData(requestedParamObj);
        object.applicationDevelopmentEditAndCompareSharedService.getEmitter().emit('applicationDevelopmentDataChange');
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

  }

  editAndCompareEventHandler() {
    this.editAndCompare();
  }

  updateScanrioList(scenario) {

    try {

      let selectedCount = 0;
      let object = this;
      let currentItemId = scenario.id;

      for (let scanerio of object.selectedScanrio) {

        if (scanerio.value == true) {

          selectedCount++;
        }
      }

      if(selectedCount > 0){
        object.isScenarioNotSelected = false;
        object.isDeleteAllowed = true;
      }else{
        object.cIOGeneralTabCompanyDetailService.getAllCurrency().subscribe((currency) => {
          object.allCurrencyData = currency;
          for(let defaultCurrency of object.allCurrencyData.currencyExchange){
            if(defaultCurrency.value === 'USD'){
              object.selectedCurrency = defaultCurrency;
            }
          }
        });
        object.isScenarioNotSelected = true;
        object.isDeleteAllowed = false;
      }
      if (selectedCount == 1) {
        object.isEditDisabled = false;

      } else {
        object.isEditDisabled = true;
      }

      let countOption = 0;
      for (let index in this.selectedRegion) {
        if (this.selectedRegion[index].value === true)
          countOption++;
      }

      let serverCountOption = 0;
      for (let index in this.selectedServers) {
        if (this.selectedServers[index].value === true)
          serverCountOption++;
      }

      let industryCountOption = 0;
      for (let index in this.selectedIndustries) {
        if (this.selectedIndustries[index].value === true)
          industryCountOption++;
      }

      let totalOptionCnt = selectedCount + countOption + serverCountOption + industryCountOption;
      if (totalOptionCnt > 1 && totalOptionCnt < 4) {
        object.disableCompareButton = false;

      } else {
        object.disableCompareButton = true;
      }

      // if(selectedCount >= 2){
      //   object.disableCompareButton=false;
      // }

      if (totalOptionCnt > 3) {
        this.error_class = "red";
      } else {
        this.error_class = "";
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


  }

  public change() {

    try {

      let object = this;
      object.count = 0;
      this.setsenarioId = 0;
      object.disableCompareButton = false;
      object.disableNewScenarioBtn = false;
      object.letUserProcced = false;
      let scenarioSelectCnt = 0;


      for (let index in object.selectedScanrio) {


        if (object.selectedScanrio[index].value === true) {
          object.count++;
          scenarioSelectCnt++;
          object.letUserProcced = true;
        }

        if(scenarioSelectCnt > 0){
         object.isScenarioNotSelected = false;
         object.isDeleteAllowed = true;
        }else{
          // object.cIOGeneralTabCompanyDetailService.getAllCurrency().subscribe((currency) => {
          //   object.allCurrencyData = currency;
          //   for(let defaultCurrency of object.allCurrencyData.currencyExchange){
          //     if(defaultCurrency.value === 'USD'){
          //       object.selectedCurrency = defaultCurrency;
          //     }
          //   }
          // });
          object.isScenarioNotSelected = true;
          object.isDeleteAllowed = false;
          
        }

        if (scenarioSelectCnt > 3) {
          this.error_class = "red";
          object.disableCompareButton = true;
          object.disableNewScenarioBtn = true;
        } else {
          this.error_class = "";
        }
      }
     console.log(object.isScenarioNotSelected);
      if (object.count > 3) return;

      if (object.showIndustries == 'servers') {
        for (let index in this.selectedServers) {
          if (object.selectedServers[index].value === true) {
            object.count++;
            object.letUserProcced = true;
          }

          if (object.count > 3) {
            this.error_class = "red";
            object.disableCompareButton = true;
          } else {
            this.error_class = "";
          }
        }
      }else if(object.showIndustries == 'industry'){

        for (let index in this.selectedIndustries) {
          if (this.selectedIndustries[index].value === true) {
            object.count++;
            object.letUserProcced = true;
          }

          if (object.count > 3) {
            this.error_class = "red";
            object.disableCompareButton = true;
            object.disableNewScenarioBtn = true;
          } else {
            this.error_class = "";
          }
        }

      }else if(object.showIndustries == 'revenue'){

        for (let index in this.selectedRevenue) {
          if (this.selectedRevenue[index].value === true) {
            object.count++;
            object.letUserProcced = true;
          }

          if (object.count > 3) {
            this.error_class = "red";
            object.disableCompareButton = true;
            object.disableNewScenarioBtn = true;
          } else {
            this.error_class = "";
          }
        }
      }else if(object.showIndustries == 'custom_reference'){

        for (let index in this.selectedcustomRerence) {
          if (this.selectedcustomRerence[index].value === true) {
            object.count++;
            object.letUserProcced = true;
          }

          if (object.count > 3) {
            this.error_class = "red";
            object.disableCompareButton = true;
            object.disableNewScenarioBtn = true;
          } else {
            this.error_class = "";
          }
        }

      }
      else {
        for (let index in this.selectedRegion) {
          if (this.selectedRegion[index].value === true) {
            object.count++;
            object.letUserProcced = true;
          }

          if (object.count > 3) {
            this.error_class = "red";
            object.disableCompareButton = true;
            object.disableNewScenarioBtn = true;
          } else {
            this.error_class = "";
          }
        }

      }

      if (object.count <= 1) {
        object.disableCompareButton = true;
      }
      if (object.count == 0 || object.count > 2) {
        object.disableNewScenarioBtn = true;
      }

      if (object.count <= 3 && object.count > 2) {
        object.disableCompareButton = false;
      }
      // if (scenarioSelectCnt >= 2){
      //   object.disableCompareButton = true;
      //   return;
      // }

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

  }

  //it will reset op
  resetOptions(mode): void {

    try {

      let object = this;
      object.disableCompareButton = true;
      object.disableNewScenarioBtn = true;
      object.letUserProcced = false;
      if (mode === "industry") {
        object.selectedIndustries.forEach(element => {
          element.value = false;
        });
      } else {
        object.selectedRegion.forEach(element => {
          element.value = false;
        });
      }

      if (mode == "scanerio") {
        object.selectedScanrio.forEach(element => {
          element.value = false;
        });
      }

      if (mode == "revenue") {
        object.selectedRevenue.forEach(element => {
          element.value = false;
        });
      }

      if (mode == "server") {
        object.selectedServers.forEach(element => {
          element.value = false;
        });
      }

      if (mode == "custom_reference") {
        object.selectedcustomRerence.forEach(element => {
          element.value = false;
        });
      }
      this.error_class = "";

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
  }

  resetCurrencyOnCompare(){
    let object = this;
    object.cIOGeneralTabCompanyDetailService.getAllCurrency().subscribe((currency) => {
      object.allCurrencyData = currency;
      for(let defaultCurrency of object.allCurrencyData.currencyExchange){
        if(defaultCurrency.value === 'USD'){
          object.selectedCurrency = defaultCurrency;
        }
      }
    });
    object.isScenarioNotSelected = true;
    object.isDeleteAllowed = false;
  }
  //it will be invoked on click of close button
  public close() {
    let object = this;
    object.resetCurrencyOnCompare();
   
    object.resetOptions("industry");
    object.resetOptions("region");
    object.resetOptions("revenue");
    object.resetOptions("revenue");
    object.resetOptions("scanerio");
    object.resetOptions("custom_reference");
    if (this.pageId != 2 || this.pageId != 3 || this.pageId != 4 || this.pageId != 5 || this.pageId != 6 || this.pageId != 7 || this.pageId != 8 || this.pageId != 9 || this.pageId != 10 || this.pageId != 11) {
      object.showIndustries == 'industry';
    }
    else {
      object.showIndustries == 'region';
    }

    //reset
    object.isEditDisabled = true;
    object.resetOptions("industry");
    object.resetOptions("region");
    object.resetOptions("scanerio");
    object.resetOptions("server");
    object.resetOptions("custom_reference");
  }

  setFlagEnterData() {

    try {

      let object = this;

      let requestedParamObj = {
        selectedMode: null,
        selectedIndustries: null,
        selectedRegion: null,
        selectedScanrio: 0
      }

      if (object.pageId == 2) {
        object.mainframeEditAndCompareSharedService.setData(requestedParamObj);
        object.mainframeEditAndCompareSharedService.getEmitter().emit('mainframedataChange');

      } if (object.pageId == 3) {
        object.windowsEditAndCompareSharedService.setData(requestedParamObj);
        object.windowsEditAndCompareSharedService.getEmitter().emit('serverdataChange');

      }
      if (this.pageId == 4) {
        object.linuxEditAndCompareSharedService.setData(requestedParamObj)
        object.linuxEditAndCompareSharedService.getEmitter().emit('serverdataChange');

      } if (this.pageId == 5) {
        object.unixEditAndCompareSharedService.setData(requestedParamObj);
        object.unixEditAndCompareSharedService.getEmitter().emit('serverdataChange');
      }
      if (this.pageId == 6) {

        object.storageEditAndCompareSharedService.setData(requestedParamObj);
        object.storageEditAndCompareSharedService.getEmitter().emit('storageDataChange');
      }
      if (this.pageId == 7) {

        object.lanEditAndCompareSharedService.setData(requestedParamObj);
        object.lanEditAndCompareSharedService.getEmitter().emit('networkDataChange');
      }

      if (this.pageId == 10) {
        object.WorkplaceEditAndCompareSharedService.setData(requestedParamObj);
        object.WorkplaceEditAndCompareSharedService.getEmitter().emit('workplaceDataChange');
      }
      if (this.pageId == 8) {
        object.wanEditAndCompareSharedService.setData(requestedParamObj);
        object.wanEditAndCompareSharedService.getEmitter().emit('networkDataChange');

      } if (this.pageId == 9) {
        object.voiceEditAndCompareSharedService.setData(requestedParamObj);
        object.voiceEditAndCompareSharedService.getEmitter().emit('networkDataChange');

      }

      if (this.pageId == 11) {

        object.ServiceDeskEditAndCompareSharedService.setData(requestedParamObj);
        object.ServiceDeskEditAndCompareSharedService.getEmitter().emit('serviceDeskDataChange');
      }

      if (this.pageId == 12) {
        object.applicationDevelopmentEditAndCompareSharedService.setData(requestedParamObj);
        object.applicationDevelopmentEditAndCompareSharedService.getEmitter().emit('applicationDevelopmentDataChange');
      }
      if (this.pageId == 13) {
        object.applicationDevelopmentEditAndCompareSharedService.setData(requestedParamObj);
        object.applicationDevelopmentEditAndCompareSharedService.getEmitter().emit('applicationDevelopmentDataChange');
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

  }

  @Input() //this function will be invoked when input properties are set.It will take reference of header component
  set header(reference) {
    let object = this;
    object.headerComponent = reference;
    object.headerComponent.setCompareComponent(this);

  }

  deleteScenario(){
    let object = this;
    object.confirmBoxDeleteFlag = true;
  }

  
  
  deleteConfirmYes(flag){
    let object = this;
    if(flag){
      let loggedInId = JSON.parse(localStorage.getItem('userloginInfo'));
      let userId = loggedInId['userDetails']['emailId']
      let requestObj = {
        "userId": userId,
        "dashboardID":object.pageId,
        "scenarioIDList":[]
      };
      let scenarioNameList : any[] = [];
      for (let scenario of object.selectedScanrio) {
        let tempObj = {
        "scenarioId": '',
        "isActive": 0
        };
       if (scenario.value == true) {
          tempObj.scenarioId = scenario.id;
          scenarioNameList.push(scenario.label);//for displaying scenario names in deletion succeful notification
          requestObj.scenarioIDList.push(tempObj);
        }          
      }

      console.log("requesObj",requestObj);
      //call webservice
      object.comapreTowerData.deleteScenario(requestObj).subscribe(function (response) {
        
      object.getScarerioList();
        //after successfull response close confirmation box
        console.log("Scenario name list",scenarioNameList);
          if(scenarioNameList.length > 0){
            let message = "deleted successfully.";
            let description = '';
            description = scenarioNameList.toString();
            
          console.log("description",description);

            object.toastr.info('Scenario ' + description + " " + message, '', {
              timeOut: 7000,
              positionClass: 'toast-top-center'
            });
          }
         
          if(object.pageId == 2){
            object.updateScenarioListNotificationServiceService.getEmitter().emit('updateMainframeScenarioListAfterDeletion');
          }else  if(object.pageId == 3){
            object.updateScenarioListNotificationServiceService.getEmitter().emit('updateWindowsScenarioListAfterDeletion');
          }else  if(object.pageId == 4){
            object.updateScenarioListNotificationServiceService.getEmitter().emit('updateLinuxScenarioListAfterDeletion');
          }else  if(object.pageId == 5){
            object.updateScenarioListNotificationServiceService.getEmitter().emit('updateUnixScenarioListAfterDeletion');
          }else  if(object.pageId == 6){
            object.updateScenarioListNotificationServiceService.getEmitter().emit('updateStorageScenarioListAfterDeletion');
          }else  if(object.pageId == 7){
            object.updateScenarioListNotificationServiceService.getEmitter().emit('updateLanScenarioListAfterDeletion');
          }else  if(object.pageId == 8){
            object.updateScenarioListNotificationServiceService.getEmitter().emit('updateWanScenarioListAfterDeletion');
          }else  if(object.pageId == 9){
            object.updateScenarioListNotificationServiceService.getEmitter().emit('updateVoiceScenarioListAfterDeletion');
          }else  if(object.pageId == 10){
            object.updateScenarioListNotificationServiceService.getEmitter().emit('updateWorkplaceScenarioListAfterDeletion');
          }else  if(object.pageId == 11){
            object.updateScenarioListNotificationServiceService.getEmitter().emit('updateServiceDeskScenarioListAfterDeletion');
          }else  if(object.pageId == 12){
            object.updateScenarioListNotificationServiceService.getEmitter().emit('updateADMScenarioListAfterDeletion');
          }
        
      });
      object.confirmBoxDeleteFlag = false;
      //once scenario is deleted reset selection and update list of scenarios
      object.close();
    }else{
      object.confirmBoxDeleteFlag = false;
    }
  }

  ngOnDestroy() {
    this.privilegesService.getEmitter().removeAllListeners();
  }

}


