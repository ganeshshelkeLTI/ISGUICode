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

import { PrivilegesService } from '../services/privileges.service';
import { IndustrySizeService } from '../services/industry-size.service';
import { ToastrService } from 'ngx-toastr';
import { CustomRefGroupService } from '../services/custom-ref-group/custom-ref-group.service';
import { CIOGeneralTabCompanyDetailService } from '../services/ciogeneral-tab-company-detail.service';
import { ComparegridDigitalService } from '../services/digital/comparegrid-digital.service';
import { DigitalSharedService } from '../services/digital/digital-shared.service';
import { DigitalEditAndCompareSharedService } from '../services/digital/digital-edit-and-compare-shared.service';
import { UpdateCompareScreenNotificationService } from '../services/update-compare-screen-notification.service';
import { GetrevenueService } from '../services/getrevenue.service';
import { EnterCompareDataTowersService } from '../services/enter-compare-data-towers.service';
import { RoleUserMappingServiceService } from '../services/admin/role-user-mapping-service.service';
import { UpdateScenarioListNotificationServiceService } from '../services/update-scenario-list-notification-service.service';

declare var $: any;
@Component({
  selector: 'app-compare-towers-digital',
  templateUrl: './compare-towers-digital.component.html',
  styleUrls: ['./compare-towers-digital.component.css']
})
export class CompareTowersDigitalComponent implements OnInit {

  private show: boolean = false;
  disableCompareButton: boolean;
  private flagForOption: boolean;
  private isEditDisabled: boolean = true;
  private disableNewScenarioBtn: boolean = true;
  isSurveyNotSelected: boolean = true;
  showIndustries: string = 'industry';
  error_class = "";

  private headerComponent: HeaderComponent
  privilegesObject: any;

  private industries = {}
  private regions = {}
  private selectedIndustries: any = [];
  private selectedRegion: any[] = [];
  private selectedRevenue: any[] = [];
  public revenue;

  //custom refrence variables
  private customRerence = {}
  private selectedcustomRerence: any[] = [];
  private isCustomReferenceLoaded: boolean = false;
  public letUserProcced: boolean = true;
  public pageId: any;

  allCurrencyData: any;
  selectedCurrency: any;
  private count = 0;

  sessionId: any;
  loggedInId: any;

  public surveyList: any;
  public selectedSurvey: any;
  public confirmBoxDeleteFlag:boolean = false;
  public isDeleteAllowed: boolean = false;

  constructor(private compareHeaderDataService: HeaderCompareScreenDataService,
    private compareGridSharedService: ComparegridService,
    private filter: FilterDataService,
    private toastr: ToastrService,
    private compareGridService: CompareGridService,
    private siblingData: SiblingDataService,
    private privilegesService: PrivilegesService,
    public industryService: IndustrySizeService,
    private customRefGroupService: CustomRefGroupService,
    private cIOGeneralTabCompanyDetailService: CIOGeneralTabCompanyDetailService,
    private comparegridDigitalService: ComparegridDigitalService,
    private digitalSharedService: DigitalSharedService,
    private digitalEditAndCompareSharedService: DigitalEditAndCompareSharedService,
    private updateCompareScreenNotificationService: UpdateCompareScreenNotificationService,
    private getRevenueService: GetrevenueService,
    private enterCompareDataTowersService:EnterCompareDataTowersService,
    private roleUserMappingServiceService:RoleUserMappingServiceService,
    private updateScenarioListNotificationServiceService: UpdateScenarioListNotificationServiceService) {

    let object = this;
    object.disableCompareButton = true;
    object.disableNewScenarioBtn = true;

    object.privilegesObject = object.privilegesService.getData();

    object.privilegesService.getEmitter().on('updatePrivileges', function () {
      object.privilegesObject = object.privilegesService.getData();
    });

    updateScenarioListNotificationServiceService.getEmitter().on('updateDigitalScenarioListAfterDeletion', function(){
      object.getSurveyList();
  });
  
    // object.updateCompareScreenNotificationService.getEmitter().on('updateCompareScreen', function () {
    //   object.getSurveyList();
    //   object.getCustomRefernceList();
    // })
     object.digitalSharedService.getEmitter().on('newdigitalsurveygenerated', function () {
      object.getSurveyList();
    });
    object.digitalSharedService.getEmitter().on('newDigitalSurveySaved', function () {
      object.getSurveyList();
    });
    
    object.loggedInId = JSON.parse(localStorage.getItem('userloginInfo'));
    object.sessionId = object.loggedInId.userDetails.sessionId
    object.compareHeaderDataService.getEmitter().on('dataChange', function () {
      
      try {

        let data = (object.compareHeaderDataService.getData());
        
        console.log("data===>", data);
        for (let industry of data.industries) {
          industry.label = industry.value;
        }
        for (let region of data.region) {
          region.label = region.value;
        }

        object.industries = data.industries;
        object.regions = data.region;
        let rev = object.getRevenueService.getData();
        if(data.revenue == undefined || data.revenue == null || data.revenue == ""){
          object.revenue = rev;
        }else{
          object.revenue = data.revenue;
        }
        console.log("this.getRevenueService.getData()",rev);
        console.log('revenue object: ',object.revenue);

        object.selectedIndustries = [];
        let defaultIndustry = {
          label: "All Industries",
          value: false,
          key: "Grand Total"
        };
        object.selectedIndustries.push(defaultIndustry);
        for (let index in object.industries) {
          let option: any = {};
          option.label = object.industries[index].label;
          option.key = object.industries[index].key;
          option.value = false;
          object.selectedIndustries.push(option);
        }

        object.selectedRegion = [];
        
        let gloabalOption: any = {};
        gloabalOption.label = "Global";
        gloabalOption.value = false;
        gloabalOption.id = "Global";
        gloabalOption.key = "Global"
        //this is id required to send to backend
        object.selectedRegion.push(gloabalOption);
        for (let index in object.regions) {
          let option: any = {};
          option.label = object.regions[index].label;
          option.value = false;
          option.id = object.regions[index].id;
          option.key = object.regions[index].key;
          object.selectedRegion.push(option);
        }

        console.log("selectedregion", object.selectedRegion);
        //some changes on for scanrio

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
          option.id = object.revenue[index].key;
          object.selectedRevenue.push(option);
        }

        console.log('object.selectedRevenue: ', object.selectedRevenue);


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

    //on comapre grid network popup close, reset compare popup
    object.comparegridDigitalService.getEmitter().on('DigitalCompareGridClose', function () {

      //call reset
      object.resetOptions("industry");
      object.resetOptions("region");
      object.resetOptions("revenue");
      object.resetOptions("survey");
      object.resetOptions("server");
      object.resetOptions("custom_reference");
      //disable scenario edit button
      object.isEditDisabled = true;
      object.showIndustries = 'industry';
    })


  }

  public userKeyDetails:any;
  ngOnInit() {
    let object = this;
    let email = object.loggedInId['userDetails']['emailId'];
    this.roleUserMappingServiceService.searchUserById(email).subscribe((data: any) => {

      let userData = data;
      object.userKeyDetails = userData.staff[0].key;
    });
    object.getCustomRefernceList();
    object.getSurveyList();
    object.siblingData.enterDataHeaderFlagMessage.subscribe(message => this.flagForOption = message)
    object.cIOGeneralTabCompanyDetailService.getAllCurrency().subscribe((currency) => {
      object.allCurrencyData = currency;
      for (let defaultCurrency of object.allCurrencyData.currencyExchange) {
        if (defaultCurrency.value === 'USD') {
          object.selectedCurrency = defaultCurrency;
        }
      }
    });
    object.industryService.setPageId(14);
  }


  toggleFilter(flagVal) {
    let object = this;
    object.showIndustries = flagVal;

    
    if (object.showIndustries == 'industry') {
      object.resetOptions("industry");
    }
    else if (object.showIndustries == 'region') {
      object.resetOptions("region");
    }
    else if (object.showIndustries == 'revenue') {
      object.resetOptions("revenue");
    } 
    else if (object.showIndustries == 'custom_reference') {
      object.resetOptions("custom_reference");
    }
    object.change();

  }

  getCustomRefernceList() {
    let object = this;
    object.isCustomReferenceLoaded = false;
    object.industryService.setPageId(14);
    object.industryService.getCustomRefereneGroupList().subscribe((response: any) => {
      console.log(object.industryService.getPageId());
      console.log(response);
      try {
        object.customRerence = response;
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

  getSurveyList() {

    let object = this;

    //web service
    object.digitalSharedService.getSurveyListForUser('14').subscribe((response: any) => {

      //list of survey
      object.surveyList = response;
      console.log("surveyList", object.surveyList);

      object.selectedSurvey = [];
      let scanrioId = 0;
      for (let index in object.surveyList) {
        let option: any = {};

        option.label = object.surveyList[index].surveyName;
        option.value = false;
        option.id = object.surveyList[index].userSurveyId;
        option.surveyId = object.surveyList[index].surveyId;
        option.dashboardId = object.surveyList[index].dashboardId;
        object.selectedSurvey.push(option);
        //
        // }
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


  //it will reset op
  resetOptions(mode): void {
    let object = this;
    object.disableCompareButton = true;
    object.disableNewScenarioBtn = true;
    //object.selectedIndustries='industry';

    if (mode === "industry") {
      object.selectedIndustries.forEach(element => {
        element.value = false;
      });

    }else if (mode === "revenue") {
      object.selectedRevenue.forEach(element => {
        element.value = false;
      });
      console.log('object.selectedRevenue: ',object.selectedRevenue);
    } 
    else if(mode === "region"){
      object.selectedRegion.forEach(element => {
        element.value = false;
      });
    }

    if (mode == "survey") {
      object.selectedSurvey.forEach(element => {
        element.value = false;
      });
    }

    if (mode == "custom_reference") {
      object.selectedcustomRerence.forEach(element => {
        element.value = false;
      });
    }
    this.error_class = "";
    //object.showIndustries = 'industry'; 
  }

  updateSurveyList(survey) {

    try {

      let selectedCount = 0;
      let object = this;
      let currentItemId = survey.id;

      for (let survey of object.selectedSurvey) {

        if (survey.value == true) {

          selectedCount++;
        }
      }


      if (selectedCount == 1) {
        object.isEditDisabled = false;

      } else {
        object.isEditDisabled = true;
      }

      if(selectedCount > 0){
        object.isDeleteAllowed = true;
      }else{
        object.isDeleteAllowed = false;
      }

      let countOption = 0;
      for (let index in this.selectedRegion) {
        if (this.selectedRegion[index].value === true)
          countOption++;
      }


      let industryCountOption = 0;
      for (let index in this.selectedIndustries) {
        if (this.selectedIndustries[index].value === true)
          industryCountOption++;
      }

      let revenueCountOption = 0;
      for (let index in this.selectedRevenue) {
        if (this.selectedRevenue[index].value === true)
        revenueCountOption++;
      }

      let totalOptionCnt = selectedCount + countOption + industryCountOption+revenueCountOption;
      if (totalOptionCnt > 1 && totalOptionCnt < 4) {
        object.disableCompareButton = false;

      } else {
        object.disableCompareButton = true;
      }

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
    let object = this;
    object.count = 0;
    object.disableCompareButton = false;
    object.disableNewScenarioBtn = false;
    let surveySelectCnt = 0;

    for (let index in object.selectedSurvey) {
      if (object.selectedSurvey[index].value === true) {
        object.count++;
        surveySelectCnt++;
        object.letUserProcced = true;
      }

      if (surveySelectCnt > 0) {
        object.isSurveyNotSelected = false;
        object.isDeleteAllowed = true;
      } else {

        object.isSurveyNotSelected = true;
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
    } 
    else if (object.showIndustries == 'revenue') {
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
    }else if (object.showIndustries == 'custom_reference') {
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

  compareData(): void {

    try {

      let object = this;
      let scenarioID = -1;
      // let scenarioName: string = "";
      let selectedMode: any;
      // for (let scanerio of object.selectedScanrio) {
      //   if (scanerio.value == true) {
      //     scenarioID = scanerio.id;
      //     scenarioName = scanerio.label;
      //   }
      // }

      // for (let  of object.selectedcustomRerence) {
      //   if (scanerio.value == true) {
      //     scenarioID = scanerio.id;
      //     scenarioName = scanerio.label;
      //   }
      // }

      if (object.showIndustries == 'industry') {
        // if (this.pageId == 12 || this.pageId == 13) {
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
        selectedcustomRerence: object.selectedcustomRerence,
        selectedSurvey: object.selectedSurvey,
        selectedCurrencyToCompare: object.selectedCurrency
        //add one attribute here selected scenario and bind selcted scenario id to it to access it in compare grid component
      }

      object.letUserProcced = false;
      for (let survey of object.selectedSurvey) {
        if (survey.value == true)
          object.letUserProcced = true;
      }
      for (let region of object.selectedRegion) {
        if (region.value == true)
          object.letUserProcced = true;
      }
      for (let revenue of object.selectedRevenue) {
        if (revenue.value == true)
          object.letUserProcced = true;
      }

      for (let industries of object.selectedIndustries) {
        if (industries.value == true)
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
      $('.compare-towers-digital').modal('hide');


      $('.modal-compare-grid-digital').modal({
        backdrop: 'static',
        keyboard: false,
        show: true
      });
      object.comparegridDigitalService.setData(requestedParamObj);
      console.log("digitalDataChange crg data", requestedParamObj);
      object.comparegridDigitalService.getEmitter().emit('digitalDataChange');

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

  setFlagEnterData() {

    try {

      let object = this;

      let requestedParamObject = {
        selectedMode: null,
        selectedIndustries: null,
        selectedRegion: null,
        selectedRevenue: null,
        selectedSurvey: -9999
      }

      object.digitalEditAndCompareSharedService.setData(requestedParamObject);
      object.digitalEditAndCompareSharedService.getEmitter().emit('editDigitalSurvey');


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

  public editAndCompare() {

    try {

      let object = this;

      let selectedSurvey; // Variable to show edit and compare survey
      // let object=this;
      for (let survey of object.selectedSurvey) {

        if (survey.value == true) {
          selectedSurvey = survey.surveyId;
        }
      }

      // Set the scenario ID and other selected industries

      let selectedMode = (object.showIndustries == 'industry' ? "industry" : "region");

      let requestedParamObj = {
        selectedMode: selectedMode,
        selectedIndustries: object.selectedIndustries,
        selectedRegion: object.selectedRegion,
        selectedRevenue: object.selectedRevenue,
        selectedSurvey: selectedSurvey,
        selectedcustomRerence: this.selectedcustomRerence
      }

      object.digitalEditAndCompareSharedService.setData(requestedParamObj);
      object.digitalEditAndCompareSharedService.getEmitter().emit('editDigitalSurvey');
      
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

  //it will be invoked on click of close button
  public close() {
    let object = this;
   
    object.resetOptions("industry");
    object.resetOptions("region");
    object.resetOptions("revenue");
    object.resetOptions("survey");
    object.resetOptions("custom_reference");
    
      object.showIndustries == 'industry';

    //reset
    object.isEditDisabled = true;
    
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
      let userId = object.userKeyDetails;
      let requestObj = {
        "userId": userId,
        "dashboardID":14,
        "surveyIDList":[]
      };
      let surveyNameList : any[] = [];
      for (let survey of object.selectedSurvey) {
        let tempObj = {
        "surveyId": '',
        "isActive": 0
        };
       if (survey.value == true) {
          tempObj.surveyId = survey.surveyId;
          surveyNameList.push(survey.label);//for displaying scenario names in deletion succeful notification
          requestObj.surveyIDList.push(tempObj);
        }          
      }

      console.log("requesObj",requestObj);
      //call webservice
      object.enterCompareDataTowersService.deleteScenario(requestObj).subscribe(function (response) {
        
      object.getSurveyList();
        //after successfull response close confirmation box
        console.log("Scenario name list",surveyNameList);
          if(surveyNameList.length > 0){
            let message = "deleted successfully.";
            let description = '';
            description = surveyNameList.toString();
            
          console.log("description",description);

            object.toastr.info('Scenario ' + description + " " + message, '', {
              timeOut: 7000,
              positionClass: 'toast-top-center'
            });
          }
        
          object.updateScenarioListNotificationServiceService.getEmitter().emit('updateDigitalScenarioListAfterDeletion');
      });
      object.confirmBoxDeleteFlag = false;
      //once scenario is deleted reset selection and update list of scenarios
      object.close();
    }else{
      object.confirmBoxDeleteFlag = false;
    }
  }

  ngOnDestroy() {
    let object = this;
    object.privilegesService.getEmitter().removeAllListeners();
  }


}
