/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:cio-dashboard.component.ts **/
/** Description: This file is created to compare data **/
/** Created By: 10651227, 10641888, 10650615 Created Date: 28/09/2018 **/
/** Update By:  10651227, 10641888, 10650615  Update Date:  28/09/2018 **/
/*******************************************************/

import {
  Component,
  OnInit,
  Input,
  OnDestroy
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

import { EditAndCompareSharedService } from '../services/edit-and-compare-shared.service';
import { PrivilegesService } from '../services/privileges.service';
import { IndustrySizeService } from '../services/industry-size.service';
import { CustomRefGroupService } from '../services/custom-ref-group/custom-ref-group.service';
import { CIOGeneralTabCompanyDetailService } from '../services/ciogeneral-tab-company-detail.service';
import {
  ToastrService
} from 'ngx-toastr';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { EnterCompareDataTowersService } from '../services/enter-compare-data-towers.service';
import { UpdateScenarioListNotificationServiceService } from '../services/update-scenario-list-notification-service.service';

declare var $: any;

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit, OnDestroy {
  private mode: string = "industry";
  private show: boolean = false;
  disableCompareButton: boolean;
  private disableNewScenarioBtn: boolean = true;
  private headerComponent: HeaderComponent
  private isEditDisabled: boolean = true;
  industryChecked: boolean = true;
  public isDeleteAllowed: boolean = false;
  options: boolean = true;
  showIndustries: string = 'industry';
  selectedValue : any;
  private count = 0;
  setsenarioId: any;
  private industries = {}
  private regions = {

  }

  public revenue ={};

  private scanrio = {

  }

  //custom refrence variables
  private customRerence = {}
  private selectedcustomRerence: any[] = [];
  private isCustomReferenceLoaded: boolean = false;
  public pageId: any;

  privilegesObject: any;
  private selectedIndustries: any = [];
  private selectedRegion: any[] = [];
  public selectedRevenue: any[] =[];
  selectedScanrio: any[] = [];
  private flagForOption: boolean;
  sessionId: any;
  loggedInId: any;

  allCurrencyData:any;
  selectedCurrency:any;
  isScenarioNotSelected: boolean = true;
  public confirmBoxDeleteFlag:boolean = false;

  constructor(private compareHeaderDataService: HeaderCompareScreenDataService, private compareGridSharedService: ComparegridService, private filter: FilterDataService, private compareGridService: CompareGridService, private siblingData: SiblingDataService, private editAndCompareSharedService: EditAndCompareSharedService, private privilegesService: PrivilegesService, public industryService: IndustrySizeService, private customRefGroupService: CustomRefGroupService, private cIOGeneralTabCompanyDetailService: CIOGeneralTabCompanyDetailService,private toastr: ToastrService, private enterCompareDataTowersService:EnterCompareDataTowersService,private updateScenarioListNotificationServiceService: UpdateScenarioListNotificationServiceService) {
    let object = this;
    object.disableCompareButton = true;
    object.disableNewScenarioBtn = true;

    object.privilegesObject = object.privilegesService.getData();

    object.privilegesService.getEmitter().on('updatePrivileges', function () {
      object.privilegesObject = object.privilegesService.getData();
    });

    //console.log(object.privilegesObject.enterMyData);
    object.loggedInId = JSON.parse(localStorage.getItem('userloginInfo'));
    object.sessionId = object.loggedInId.userDetails.sessionId
    object.compareHeaderDataService.getEmitter().on('dataChange', function () {

      try {

        
        let data = (object.compareHeaderDataService.getData());

        console.log('filter data options1: ' ,data.revenue);

        for (let industry of data.industries) {
          industry.label = industry.value;
        }
        for (let region of data.region) {
          region.label = region.value;
        }
        // for (let revenue of data.revenue) {
        //   revenue.label = revenue.value;
        // }

        object.industries = data.industries;
        object.regions = data.region;
        object.revenue = data.revenue;

        console.log('filter data options: ' ,object.revenue);

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

        //revnue
        object.selectedRevenue = [];
        let defaultRevenue = {
          label: "All Sizes",
          value: false,
          id: "Global"
        };
        object.selectedRevenue.push(defaultRevenue);

        for (let index in object.revenue) {
          let option: any = {};
          option.label = object.revenue[index].value;
          option.value = false;
          option.id = object.revenue[index].id;
          object.selectedRevenue.push(option);
        }

        console.log('object.selectedRevenue: ', object.selectedRevenue);

        //some changes on for scanrio


        data.scanrio = [];



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
          "dashboardId": "1",
          "pageName": "CIO Dashboard Compare Screen",
          "errorType": "warn",
          "errorTitle": "Data Error",
          "errorDescription": error.message,
          "errorObject": error
        }

        throw errorObj;
      }

    })


    object.compareGridSharedService.getEmitter().on('close', function () {
      object.resetCurrencyOnCompare();
      object.close();
    })

    object.compareHeaderDataService.getEmitter().on('updateCompareScreen', function () {
      object.getScarerioList();
      object.pageUpdate();
    });


  }

 pageUpdate() {
   let object = this;
      this.showIndustries = 'industry';
      object.resetCurrencyOnCompare();
      object.resetOptions("industry");
      object.resetOptions("region");
      object.resetOptions("scanerio");
      object.resetOptions("custom_reference");
      object.resetOptions("revenue");
  }

  public emailId: any;
  public userKeyDetails:any;

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



  toggleFilter(flagVal) {
    let object = this;
    object.showIndustries = flagVal;

    if (object.showIndustries == 'industry') {
      object.resetOptions("industry");
    } else if (object.showIndustries == 'region') {
      object.resetOptions("region");
    } else if (object.showIndustries == 'custom_reference') {
      object.resetOptions("custom_reference");
    } else if(object.showIndustries == 'revenue'){
      object.resetOptions("revenue");
    }
    object.change();

  }

  //this will update scarnioList
  getScarerioList() {
    let object = this;

    object.compareGridService.getScanrioData().subscribe(function (response) {
      object.scanrio = response;

      object.selectedScanrio = [];

      let scanrioId = 0;
      for (let index in object.scanrio) {
        let option: any = {};
        if (object.scanrio[index] == null || object.scanrio[index].trim().length == 0) {
          option.label = index;
        } else {
          option.label = index + '_' + object.scanrio[index];
        }
        // option.label = index+'_'+object.scanrio[index];
        option.name = object.scanrio[index];
        option.value = false;
        option.id = index; //
        object.selectedScanrio.push(option);
        //
      }

      object.selectedScanrio.reverse();
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "1",
        "pageName": "CIO Dashboard Compare Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    });



  }


  getCustomRefernceList() {
    let object = this;
    object.isCustomReferenceLoaded = false;
    object.pageId = this.industryService.getPageId();
    console.log("getPageId", object.pageId);
    object.industryService.getCustomRefereneGroupList().subscribe(function (response) {
      try {
        object.customRerence = response;
        console.log("custom refernce list cio", object.customRerence);
        object.selectedcustomRerence = [];

        let scanrioId = 0;
        for (let index in object.customRerence) {
          // if(object.customRerence[index].dashboardId==this.pageId){
          let option: any = {};

          option.label = object.customRerence[index].customName;
          // option.name = object.customRerence[index];
          option.value = false;
          option.id = object.customRerence[index].customId;
          option.dashboardId = object.customRerence[index].dashboardId;
          object.selectedcustomRerence.push(option);
          //
          // }
        }

        console.log("custom refernce list", object.selectedcustomRerence);
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



  compareData(): void {


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


    if (object.showIndustries == 'industry') {
      selectedMode = ("industry");
    }
    else if (object.showIndustries == 'region') {
      selectedMode = ("region")
    }
    else if (object.showIndustries == 'revenue') {
      selectedMode = ("revenue")
    } 
    else if (object.showIndustries == 'custom_reference') {
      selectedMode = ("custom_reference")
    }

    let requestedParamObj = {
      selectedMode: selectedMode,
      selectedIndustries: object.selectedIndustries,
      selectedRegion: object.selectedRegion,
      selectedRevenue: object.selectedRevenue,
      selectedScenarios: object.selectedScanrio,
      selectedScanrioId: scenarioID,
      selectedScenarioName: scenarioName,
      selectedcustomRerence: object.selectedcustomRerence,
      selectedCurrencyToCompare: object.selectedCurrency
      //add one attribute here selected scenario and bind selcted scenario id to it to access it in compare grid component
    }
console.log("requestedParamObj", requestedParamObj);
    object.compareGridSharedService.setData(requestedParamObj);
    object.compareGridSharedService.getEmitter().emit('dataChange');

    setTimeout(() => {
      $('.compare-grid-modal').modal({
        backdrop: 'static',
        keyboard: true,
        show: true
      });
    }, 500);


  }

  cancelCompareData() { }

  ngDoCheck() { }

  error_class = "";


  // 

  public editAndCompare() {

    let object = this;
    object.headerComponent.showEnteredDataflag = true;
    object.siblingData.changeEnterDataHeaderFlag(true);

    let selectedScanrio; // Variable to show edit and compare scenario
    // let object=this;
    for (let scanerio of object.selectedScanrio) {

      if (scanerio.value == true) {
        selectedScanrio = scanerio.id;
        this.setsenarioId = scanerio.id;
      }
    }

    // Set the scenario ID and other selected industries

    let selectedMode = (object.showIndustries === 'industry' ? "industry" : "region");

    let requestedParamObj = {
      selectedMode: selectedMode,
      selectedIndustries: object.selectedIndustries,
      selectedRegion: object.selectedRegion,
      selectedRevenue: object.selectedRevenue,
      selectedScanrio: selectedScanrio,
      selectedcustomRerence: object.selectedcustomRerence
    }

    object.editAndCompareSharedService.setData(requestedParamObj);



    object.editAndCompareSharedService.getEmitter().emit('dataChange');

  }

  editAndCompareEventHandler() {
    let object = this;
    object.editAndCompareSharedService.getEmitter().emit('hideSaveAndCompareButton')
    this.editAndCompare();
  }


  updateScanrioList(scenario) {

    let selectedCount = 0;
    let object = this;
    let currentItemId = scenario.id;

    for (let scanerio of object.selectedScanrio) {

      // if(scanerio.id != currentItemId){
      //   scanerio.value = false;
      // }

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


    //for compare button enable/disable
    let countOption = 0;
    if (object.showIndustries == 'industry') {
      for (let index in this.selectedIndustries) {
        if (object.selectedIndustries[index].value === true)
          countOption++;
      }
    } else if (object.showIndustries == 'region') {
      for (let index in this.selectedRegion) {
        if (this.selectedRegion[index].value === true)
          countOption++;
      }
    } 
    else if (object.showIndustries == 'revenue') {
      for (let index in this.selectedRevenue) {
        if (this.selectedRevenue[index].value === true)
          countOption++;
      }
    } else if (object.showIndustries == 'custom_reference') {
      for (let index in this.selectedcustomRerence) {
        if (this.selectedcustomRerence[index].value === true)
          countOption++;
      }
    }

    let totalOptionCnt = selectedCount + countOption;

    if (totalOptionCnt > 1 && totalOptionCnt < 4) {
      object.disableCompareButton = false;

    } else {
      object.disableCompareButton = true;
    }

    // if(selectedCount >= 2){
    //   object.disableCompareButton=true;
    // }

    if (totalOptionCnt > 3) {
      this.error_class = "red";
    } else {
      this.error_class = "";
    }


  }


  public change() {
    let object = this;
    object.count = 0;
    this.setsenarioId = 0;
    object.disableCompareButton = false;
    object.disableNewScenarioBtn = false;
    let scenarioSelectCnt = 0;

    for (let index in object.selectedScanrio) {
      // if (object.selectedScanrio[index].value) {
      //   this.setsenarioId = object.selectedScanrio[index].id;
      // }

      if (object.selectedScanrio[index].value === true) {
        object.count++;
        scenarioSelectCnt++;
      }

      if(scenarioSelectCnt > 0){
        object.isScenarioNotSelected = false;
        object.isDeleteAllowed = true;
       }else{
      
         object.isScenarioNotSelected = true;
         object.isDeleteAllowed = false;
         
       }

      if (object.count > 3) {
        this.error_class = "red";
        object.disableCompareButton = true;
        object.disableNewScenarioBtn = true;
      } else {
        this.error_class = "";
      }
    }

    if (object.count > 3) return;

    if (object.showIndustries == 'industry') {
      for (let index in this.selectedIndustries) {
        if (object.selectedIndustries[index].value === true) object.count++

        if (object.count > 3) {
          this.error_class = "red";
          object.disableCompareButton = true;
        } else {
          this.error_class = "";
        }
      }
    } else if (object.showIndustries == 'region') {
      for (let index in this.selectedRegion) {
        if (this.selectedRegion[index].value === true) object.count++

        if (object.count > 3) {
          this.error_class = "red";
          object.disableCompareButton = true;
          object.disableNewScenarioBtn = true;
        } else {
          this.error_class = "";
        }
      }
    } else if (object.showIndustries == 'revenue') {
      for (let index in this.selectedRevenue) {
        if (this.selectedRevenue[index].value === true) object.count++

        if (object.count > 3) {
          this.error_class = "red";
          object.disableCompareButton = true;
          object.disableNewScenarioBtn = true;
        } else {
          this.error_class = "";
        }
      }
    } 
    else if (object.showIndustries == 'custom_reference') {
      for (let index in this.selectedcustomRerence) {
        if (this.selectedcustomRerence[index].value === true) object.count++

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
      return;
    }
  }

  //it will reset op
  resetOptions(mode): void {
    let object = this;
    object.disableCompareButton = true;
    object.disableNewScenarioBtn = true;
    if (mode === "industry") {
      object.selectedIndustries.forEach(element => {
        element.value = false;
      });
    }
    else if (mode === "revenue") {
      object.selectedRevenue.forEach(element => {
        element.value = false;
      });
    } 
    else {
      object.selectedRegion.forEach(element => {
        element.value = false;
      });
    }

    if (mode == "scanerio") {
      object.selectedScanrio.forEach(element => {
        element.value = false;
        this.isEditDisabled = true;
      });
    }
    if (mode == "custom_reference") {
      object.selectedcustomRerence.forEach(element => {
        element.value = false;
      });
    }
    this.error_class = "";
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
    // object.resetCurrencyOnCompare();
    // object.resetOptions("industry");
    // object.resetOptions("region");
    // object.resetOptions("scanerio");
    // object.resetOptions("custom_reference");
    // object.resetOptions("revenue");
    // object.showIndustries == 'industry';
    // object.showIndustries = true;
  }

  setFlagEnterData() {
    let object = this;
    object.headerComponent.showEnteredDataflag = true;
    object.siblingData.changeEnterDataHeaderFlag(true);
    // object.compareData();

    object.editAndCompareSharedService.setShowSaveAndCompareButton(false);
    object.editAndCompareSharedService.getEmitter().emit('hideSaveAndCompareButton');
    //code that we need to rethink on
    let requestedParamObj = {
      selectedMode: null,
      selectedIndustries: null,
      selectedRegion: null,
      selectedRevenue: null,
      selectedScanrio: 0
    }
    object.editAndCompareSharedService.setData(requestedParamObj);

    //    setTimeout(function(){},120);

    object.editAndCompareSharedService.getEmitter().emit('dataChange');
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
      let userId = object.loggedInId['userDetails']['emailId']
      let requestObj = {
        "userId": userId,
        "dashboardID":1,
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
      object.enterCompareDataTowersService.deleteScenario(requestObj).subscribe(function (response) {
        
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
          object.updateScenarioListNotificationServiceService.getEmitter().emit('updateCIOScenarioListAfterDeletion');
    
      });
      object.confirmBoxDeleteFlag = false;
      //once scenario is deleted reset selection and update list of scenarios
      object.pageUpdate();
    }else{
      object.confirmBoxDeleteFlag = false;
    }
  }
  

  ngOnDestroy() {
    this.privilegesService.getEmitter().removeAllListeners();
  }

}
