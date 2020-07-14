import {
    Component,
    OnInit,
    ElementRef,
    ViewChild, OnDestroy,
    Compiler
} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { getCurrencySymbol } from '@angular/common';
import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';
import { ToastrService } from 'ngx-toastr';
import { PrivilegesService } from '../services/privileges.service';
import { DigitalSharedService } from '../services/digital/digital-shared.service';
import {
    EventEmitter
} from 'events';

import {
    SiblingDataService
} from '../services/sibling-data.service';

import {
    HeaderCompareEnterDataSharedService
} from '../services/header-compare-enter-data-shared.service';

import { Options } from 'ng5-slider';
import { DigitalEditAndCompareSharedService } from '../services/digital/digital-edit-and-compare-shared.service';
import { TextMaskModule } from 'angular2-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { EnterCompareDataTowersService } from '../services/enter-compare-data-towers.service';
import { RoleUserMappingServiceService } from '../services/admin/role-user-mapping-service.service';
import { UpdateScenarioListNotificationServiceService } from '../services/update-scenario-list-notification-service.service';

declare var $: any;

//for decimal numbers
const decimalNumberMask = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: ',' ,
    allowDecimal: true,
    decimalSymbol: '.',
    decimalLimit: 6,
    integerLimit: null,
    allowNegative: false,
    allowLeadingZeroes: true
  });
  
  //mask for integer numbers
  const numberMask = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: ',' ,
    allowDecimal: false,
    integerLimit: null,
    allowNegative: false,
    allowLeadingZeroes: true
  });

@Component({
    selector: 'app-enter-my-data-digital',
    templateUrl: './enter-my-data-digital.component.html',
    styleUrls: ['./enter-my-data-digital.component.css']
})
export class EnterMyDataDigitalComponent implements OnInit {
    numberMask = numberMask;
    decimalNumberMask = decimalNumberMask;
    public value: number = 0;
    public options: Options = {
        floor: 0,
        ceil: 100
    };

    loggedInUserInfo: any;
    privilegesObject: any;

    public sessionId: string;
    public userdata: any;
    public emailId: any;
    dashboardId: string;

    public traansformationRadioStatus: any;

    public selectedSurvey: any;

    private showRestBox: boolean =false;
    confirmBoxResetFlag: boolean = false;
    confirmBoxCloseFlag: boolean = false;

    public surveyQuestionJSON: any;
    public surveyName: any;
    public selectedSurveyName: any;
    public isFormValid: boolean;

    public scaleData: any;

    public emitter = new EventEmitter();

    public sortedQuestionData = {
        general: [],
        digitalTransformationEfforts: []
    };

    public surveyStatusList: any;

    public selectedDataStatus: any;

    public surveyList: any;

    public selectedJobFunction: any;
    public slectedIndustry: any;
    public selectedCountry: any;
    public datastatusDisabled: boolean = true;
    public currencyDisabled: boolean = true;

    //expenditure validation
    public expenditureWarningMessage: boolean=false;
    public expenditurecnditionsFulfilled: boolean=true;
    public errorMessageExpenditure: any;

    public isEntireSurveyValid: boolean =false;
    public isCopyEnabled: boolean = false;

    isDeleteAllowed: boolean = false;
    confirmBoxDeleteFlag: boolean = false;
    public userKeyDetails:any;

    constructor(private http: HttpClient,
        private toastr: ToastrService,
        private loginDataBroadcastService: LoginDataBroadcastService,
        private privilegesService: PrivilegesService,
        private compiler: Compiler,
        private siblingData: SiblingDataService,
        private inputMyDataheaderSharedService: HeaderCompareEnterDataSharedService,
        private digitalSharedService: DigitalSharedService,
        private digitalEditAndCompareSharedService: DigitalEditAndCompareSharedService,
        private enterCompareDataTowersService:EnterCompareDataTowersService,
        private roleUserMappingServiceService:RoleUserMappingServiceService,
        private updateScenarioListNotificationServiceService: UpdateScenarioListNotificationServiceService) {

        let object = this;
        //update scenariolist after deletion from compare modal
        updateScenarioListNotificationServiceService.getEmitter().on('updateDigitalScenarioListAfterDeletion', function(){
            object.getSurveyList();
        });
        object.selectedSurvey = 0;
        object.dashboardId = "14";
        object.activateShowBox(false);




        object.loggedInUserInfo = JSON.parse(localStorage.getItem('userloginInfo'));

        object.privilegesObject = object.privilegesService.getData();

        object.privilegesService.getEmitter().on('updatePrivileges', function () {
            object.privilegesObject = object.privilegesService.getData();
        });

        object.inputMyDataheaderSharedService.getEmitter().on('showEnterDataTowerButton', function () {
            object.resetEnterFormTabular();
        });

        object.digitalEditAndCompareSharedService.getEmitter().on('editDigitalSurvey', function () {
            let surveyID = object.digitalEditAndCompareSharedService.getData().selectedSurvey;
             if (surveyID == 0) {
                 object.selectedSurvey = 0;
                 object.selectedSurveyName = "";
                   object.resetAll();
             } else {
                 object.selectedSurvey = surveyID;
                object.getSurveyDataById();
             }
        })
    }

    getUserLoginInfo() {
        let _self = this;

        _self.userdata = _self.loginDataBroadcastService.get('userloginInfo');
        _self.emailId = _self.userdata['userDetails']['emailId'];
        _self.sessionId = _self.userdata['userDetails']["sessionId"];

    }

    ngOnInit() {

        let object = this;
        let email = object.loggedInUserInfo['userDetails']['emailId'];
        this.roleUserMappingServiceService.searchUserById(email).subscribe((data: any) => {

            let userData = data;
            object.userKeyDetails = userData.staff[0].key;
        });
        this.isDeleteAllowed = false;
        //reset
        object.resetAll();

        //session
        object.getUserLoginInfo();

        //get survey list
        object.getSurveyList();

        //get survey status list and general info
        object.getGeneralInfoStructure();
        //object.selectedDataStatus = this.surveyStatusList[1];
        object.datastatusDisabled = true;
        object.currencyDisabled = true;

        //get question template
        object.getQuestionList();

        //get capability scale details
        object.getScaleDetails();

        object.activateShowBox(false);   
        

        object.checkAllSurveyValidations();

        object.isEntireSurveyValid=false;
        object.isCopyEnabled = false;



    }

    getScaleDetails() {
        let object = this;

        object.digitalSharedService.getScaleDetails().subscribe((response: any) => {

            object.scaleData = response;

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


    getGeneralInfoStructure() {
        let object = this;
        //web service
        object.digitalSharedService.getGeneralInfoStructure('14').subscribe((response: any) => {

            //get survey status list
            object.surveyStatusList = response.userDataStatus;
            object.selectedDataStatus = this.surveyStatusList[3];


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

    getSurveyList() {

        let object = this;

        //web service
        object.digitalSharedService.getSurveyListForUser('14').subscribe((response: any) => {

            //list of survey
            object.surveyList = response;

            object.selectedSurvey = -9999;



            object.resetAll();

            object.getSurveyDataById();


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

    getSurveyDataById() {

        let object = this;

        if (object.selectedSurvey == -9999) {

            //reset to default
            object.selectedDataStatus = object.surveyStatusList[3];
            object.selectedSurveyName = '';

            object.isEntireSurveyValid=false;
            object.isCopyEnabled = false;
            object.isDeleteAllowed = false;
            
            object.resetAll();


            //get default template
            object.getQuestionList();

            //form completion
            object.calculateFetchedSurveyCompletion();

            object.activateShowBox(false);

        }
        else
        {
            object.isEntireSurveyValid=true;
            object.isDeleteAllowed = true;
            object.isCopyEnabled = true;
        }

        //populate general data

        for (let cnt = 0; cnt < object.surveyList.length; cnt++) {
            if (object.selectedSurvey == object.surveyList[cnt].surveyId) {
                object.selectedSurveyName = object.surveyList[cnt].surveyName;
                for (let i = 0; i < object.surveyStatusList.length; i++) {
                    if (object.surveyList[cnt].dataStatusId == object.surveyStatusList[i].id) {
                        object.selectedDataStatus = object.surveyStatusList[i];
                    }
                }

            }
        }

        //populate survey question data

        //web service call here

        object.digitalSharedService.getSurveyDataById('14', object.selectedSurvey).subscribe((response: any) => {

            object.surveyQuestionJSON = response;

            object.isEntireSurveyValid=true;
            object.isCopyEnabled = true;
            
            object.setValuesOnSurvey();

            object.calculateFetchedSurveyCompletion();

            object.activateShowBox(true);
            

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

    calculateFetchedSurveyCompletion()
    {

        let object =this;

        //calculation
        let totalSurveyInfolElements = 0;
        let completedSurveyInfoElements = 0;
        let calculatedSurveyInfoPercentage = 0;

        let totalGeneralElements = 0;
        let completedGeneralElements = 0;
        let calculatedGeneralElements = 0;

        let totalInitiativeElements = 0;
        let completedInitiativeElements = 0;
        let calculatedInitiativeElements = 0;

        let totalCapabilityElements = 0;
        let completedCapabilityElements = 0;
        let calculatedCapabilityElements = 0;

        let totalFeedbackElements = 0;
        let completedFeedbackElements = 0;
        let calculatedFeedbackElements = 0;

        let totalFormElements = 0;
        let completedFormElements = 0;
        let calculatedFormElements = 0;


        //general info section is always populated on fetch
        calculatedSurveyInfoPercentage=100;
        $('#general-percentage').text(Math.round(calculatedSurveyInfoPercentage) + '%');

        console.log('general question list: ',object.surveyQuestionJSON);
        //general questions
        totalGeneralElements = 5;

        
        if(object.selectedCountry!=null && object.selectedCountry!='' && object.selectedCountry!='null' && parseInt(object.selectedCountry)!=-9999)
        {
            completedGeneralElements++;
        }
        if(object.selectedJobFunction!=null && object.selectedJobFunction!='' && parseInt(object.selectedJobFunction)>0)
        {
            completedGeneralElements++;
        }
        if(object.slectedIndustry!=null && object.slectedIndustry!='' && object.slectedIndustry!='null' && parseInt(object.slectedIndustry)!=-9999)
        {
            completedGeneralElements++;
        }

       
        if(parseInt(object.surveyQuestionJSON.General.null[1].numeric_Value)>=0)
        {
            completedGeneralElements++;
        }
        if(parseInt(object.surveyQuestionJSON.General.null[2].numeric_Value)>=0)
        {
            completedGeneralElements++;
        }

      
        calculatedGeneralElements = completedGeneralElements / totalGeneralElements * 100;

        $('#general-q-percentage').text(Math.round(calculatedGeneralElements) + '%');

        
        //digital transformation initiatives
        
        for(let cnt=0; cnt<object.surveyQuestionJSON['Digital Transformation initiatives']['null'].length; cnt++)
        { 
            if(parseInt(object.surveyQuestionJSON['Digital Transformation initiatives']['null'][cnt].dashboard_question_id)==7)
            {
                if(parseInt(object.surveyQuestionJSON['Digital Transformation initiatives']['null'][cnt].selected_Value_Id)>0)
                {
                    completedInitiativeElements++;    
                }
            }
            else if(parseInt(object.surveyQuestionJSON['Digital Transformation initiatives']['null'][cnt].numeric_Value)>=0){
                console.log("Digital Transformation initiatives']['null']", object.surveyQuestionJSON['Digital Transformation initiatives']['null'][cnt]);
                completedInitiativeElements++;
            }
            totalInitiativeElements++;
        }

        for(let cnt=0; cnt<object.surveyQuestionJSON['Digital Transformation initiatives']['Expenditures for Digital Initiatives'].length; cnt++)
        { 

            if(parseInt(object.surveyQuestionJSON['Digital Transformation initiatives']['Expenditures for Digital Initiatives'][cnt].numeric_Value)>=0){
                console.log("Digital Transformation initiatives']['Expenditures for Digital Initiatives']", object.surveyQuestionJSON['Digital Transformation initiatives']['Expenditures for Digital Initiatives'][cnt]);
                completedInitiativeElements++;
            }
            totalInitiativeElements++;
        }

        for(let cnt=0; cnt<object.surveyQuestionJSON['Digital Transformation initiatives']['Benefits of Digital Initiatives'].length; cnt++)
        { 
            
            if(parseInt(object.surveyQuestionJSON['Digital Transformation initiatives']['Benefits of Digital Initiatives'][cnt].numeric_Value)>=0){
                console.log("Digital Transformation initiatives']['Benefits of Digital Initiatives']", object.surveyQuestionJSON['Digital Transformation initiatives']['Benefits of Digital Initiatives'][cnt]);
                completedInitiativeElements++;
            }
            totalInitiativeElements++;
        }

        calculatedInitiativeElements = (completedInitiativeElements / totalInitiativeElements * 100);

        $('#transform-init-percentage').text(Math.round(calculatedInitiativeElements) + '%');

        //capabilities
        //null
        console.log('capabilities questions: ',object.surveyQuestionJSON['Capabilities']);
        for(let cnt=0; cnt<object.surveyQuestionJSON['Capabilities']['Business Model Innovation'].length; cnt++)
        {
            if(parseInt(object.surveyQuestionJSON['Capabilities']['Business Model Innovation'][cnt].numeric_Value)>0){
                completedCapabilityElements++;
            }
            totalCapabilityElements++;
        }

        //surveyQuestionJSON['Capabilities']['Digital Backbone']
        for(let cnt=0; cnt<object.surveyQuestionJSON['Capabilities']['Digital Backbone'].length; cnt++)
        {
            if(parseInt(object.surveyQuestionJSON['Capabilities']['Digital Backbone'][cnt].numeric_Value)>0){
                completedCapabilityElements++;
            }
            totalCapabilityElements++;
        }

        //surveyQuestionJSON['Capabilities']['Digital Operating model']
        for(let cnt=0; cnt<object.surveyQuestionJSON['Capabilities']['Enterprise Agility (formerly Digital Operating Model)'].length; cnt++)
        {
            if(parseInt(object.surveyQuestionJSON['Capabilities']['Enterprise Agility (formerly Digital Operating Model)'][cnt].numeric_Value)>0){
                completedCapabilityElements++;
            }
            totalCapabilityElements++;
        }

        //surveyQuestionJSON['Capabilities']['Enterprise Agility (formerly Digital Operating Model)']
        for(let cnt=0; cnt<object.surveyQuestionJSON['Capabilities']['Enterprise Agility (formerly Digital Operating Model)'].length; cnt++)
        {
            if(parseInt(object.surveyQuestionJSON['Capabilities']['Enterprise Agility (formerly Digital Operating Model)'][cnt].numeric_Value)>0){
                completedCapabilityElements++;
            }
            totalCapabilityElements++;
        }

        //surveyQuestionJSON['Capabilities']['Insights']
        for(let cnt=0; cnt<object.surveyQuestionJSON['Capabilities']['Insights'].length; cnt++)
        {
            if(parseInt(object.surveyQuestionJSON['Capabilities']['Insights'][cnt].numeric_Value)>0){
                completedCapabilityElements++;
            }
            totalCapabilityElements++;
        }

        //surveyQuestionJSON['Capabilities']['Smart_Technologies']
        for(let cnt=0; cnt<object.surveyQuestionJSON['Capabilities']['Technologies at Scale (formerly Smart Technologies)'].length; cnt++)
        {
            if(parseInt(object.surveyQuestionJSON['Capabilities']['Technologies at Scale (formerly Smart Technologies)'][cnt].numeric_Value)>0){
                completedCapabilityElements++;
            }
            totalCapabilityElements++;
        }

        
        calculatedCapabilityElements = (completedCapabilityElements / totalCapabilityElements * 100);
    
        $('#capabilities-percentage').text(Math.round(calculatedCapabilityElements) + '%');

        //feedback elements
        //surveyQuestionJSON.Feedback.null
        for(let cnt=0; cnt<object.surveyQuestionJSON.Feedback.null.length; cnt++)
        {
            
            if(object.surveyQuestionJSON.Feedback.null[cnt].text_Value!=null &&
                object.surveyQuestionJSON.Feedback.null[cnt].text_Value!='' 
            ){
                completedFeedbackElements++;
            }
            totalFeedbackElements++;
        }

        calculatedFeedbackElements = (completedFeedbackElements / totalFeedbackElements * 100);

        $('#feedback-percentage').text(Math.round(calculatedFeedbackElements) + '%');

        //calculate overall percentage
        totalFormElements = totalSurveyInfolElements + totalGeneralElements + totalInitiativeElements + totalCapabilityElements + totalFeedbackElements;

        completedFormElements = completedSurveyInfoElements + completedGeneralElements + completedInitiativeElements + completedCapabilityElements + completedFeedbackElements;

        calculatedFormElements = (completedFormElements / totalFormElements * 100);

        $('#overall-percentage').text(Math.round(calculatedFormElements) + '%');


    }

    setValuesOnSurvey() {
        let object = this;

        //set values by question id

        let i: number;
        let j: number;
        let subCatValue = [];
        let subcategory = [];
        let length1: any;
        let length2: any;


        //loop through survey object ot prepare request object
        // let category = Object.values(this.myData);
        let category = Object.keys(this.surveyQuestionJSON).map(e => this.surveyQuestionJSON[e]);
        length1 = Object.keys(this.surveyQuestionJSON).length;

        for (i = 0; i < length1; i++) {

            // subcategory = Object.values(category[i]);
            subcategory = Object.keys(category[i]).map(e => category[i][e]);

            length2 = Object.keys(subcategory).length;

            for (j = 0; j < length2; j++) {

                // subCatValue = Object.values(subcategory[j]);

                //console.log('question category: ',Object.keys(category[i]));

                subCatValue = Object.keys(subcategory[j]).map(e => subcategory[j][e]);

                for (let obj of subCatValue) {
                    let t1: any = {};



                    if (parseInt(obj.dashboard_question_id) == 1) {

                        if(parseInt(obj.selected_Value_Id)<=0)
                        {
                            object.selectedJobFunction = -9999   
                        }
                        else
                        {
                            object.selectedJobFunction = obj.selected_Value_Id;
                        }

                        
                    }
                    if (parseInt(obj.dashboard_question_id) == 4) {
                        
                        if(obj.onesys_Value_Id=='null' || obj.onesys_Value_Id==null)
                        {
                            object.slectedIndustry = -9999;
                        }
                        else
                        {
                            object.slectedIndustry = obj.onesys_Value_Id;
                        }
                        
                    }

                    if (parseInt(obj.dashboard_question_id) == 5) {
                        if(obj.onesys_Value_Id=='null' || obj.onesys_Value_Id==null)
                        {
                            object.selectedCountry = -9999;
                        }
                        else
                        {
                            object.selectedCountry = obj.onesys_Value_Id;
                        }
                        
                    }

                    if (obj.question_type == 'Radio_Button' && obj.dashboard_question_id == 6) {

                        if (parseInt(obj.numeric_Value) == 1) {
                            //$('#' + obj.dashboard_question_id).prop('checked', true);
                            object.showDigitalTransformationDependentQuestion = true;
                            object.traansformationRadioStatus='active';
                        }
                        else if(parseInt(obj.numeric_Value) == 0){
                            //$('#' + obj.dashboard_question_id).prop('checked', false);
                            object.showDigitalTransformationDependentQuestion = false;
                            object.traansformationRadioStatus='active';
                        }

                    }
                    else if (obj.question_type == 'Radio_Button' && (parseInt(obj.dashboard_question_id) == 28)) {

                        if (parseInt(obj.numeric_Value) == 1) {
                            //$('#' + obj.dashboard_question_id).prop('checked', true);
                            object.showDigitalBenefitRevenueSub = true;
                        }
                        else {
                            //$('#' + obj.dashboard_question_id).prop('checked', false);
                            object.showDigitalBenefitRevenueSub = false;
                        }

                    }
                    else if (obj.question_type == 'Radio_Button' && (parseInt(obj.dashboard_question_id) == 30)) {

                        if (parseInt(obj.numeric_Value) == 1) {
                            //$('#' + obj.dashboard_question_id).prop('checked', true);
                            object.showDigitalBenefitCustomerSub = true;
                        }
                        else {
                            //$('#' + obj.dashboard_question_id).prop('checked', false);
                            object.showDigitalBenefitCustomerSub = false;
                        }

                    }
                    else if (obj.question_type == 'Radio_Button' && (parseInt(obj.dashboard_question_id) == 32)) {

                        if (parseInt(obj.numeric_Value) == 1) {
                            //$('#' + obj.dashboard_question_id).prop('checked', true);
                            object.showDigitalBenefitOperationSub = true;
                        }
                        else {
                            //$('#' + obj.dashboard_question_id).prop('checked', false);
                            object.showDigitalBenefitOperationSub = false;
                        }

                    }
                    else if(obj.question_type == 'Textbox' && obj.categoryName!='Feedback')
                    {
                        if(parseInt(obj.numeric_Value)==-9999)
                        {
                            obj.numeric_Value=null;
                        }
                    }
                    
                    if(obj.categoryName=='Capabilities')
                    {
                        
                        if(parseInt(obj.numeric_Value)<0 || obj.numeric_Value==null || obj.numeric_Value=='null')
                        {
                            obj.table_id=-9999
                           
                        }
                    }

                    if(obj.note == "null"){
                        obj.note = null;
                    }
                   

                }

            }
        }

        //form completion
        //object.calculateFormCompletion();


    }

    toggleCapabilityCheckbox(question) {

        let object = this;

        
        if($('#' + question.dashboard_question_id + '-checkbox').is(':checked') == true) {
            question.numeric_Value = 0;
            question.table_id=-9999;

        }
        
    }

    closeEnterDataModal() {
        let object = this;
        // object.siblingData.changeEnterDataModalFlag(true);
        
        object.isCopyEnabled = false;
         if (object.showRestBox==true) {
             this.confirmBoxCloseFlag = true;
         } else {
        //     // object.resetAll();
        //     $('.modal-select-to-compare-digital').modal('hide');
            object.closeConfirmYes('true');
         }
         
       // object.confirmBoxCloseFlag = true;

        //this will reset entered data so that new form will be populated when user clicks on input my data and enter new scenario
    }

    resetConfirmYes(flag) {
        if (flag) {
            this.resetAll();
        }
        this.confirmBoxResetFlag = false;
    }

    closeConfirmYes(flag) {

        let object = this;
        
        
        if(flag=='true')
        {

            
            object.confirmBoxCloseFlag=false;
            $('.modal-select-to-compare-digital').modal('hide');
            object.confirmBoxCloseFlag=false;

            
            //reset percentages
            $('#general-percentage').text(Math.round(0) + '%');
            $('#general-q-percentage').text(Math.round(0) + '%');
            $('#transform-init-percentage').text(Math.round(0) + '%');
            $('#capabilities-percentage').text(Math.round(0) + '%');
            $('#feedback-percentage').text(Math.round(0) + '%');
            $('#overall-percentage').text(Math.round(0) + '%');

            object.selectedSurvey=-9999;
            object.getSurveyDataById();

            object.activateShowBox(false);

        }
        else
        {
           
            object.confirmBoxCloseFlag=false;
        }
            
        
    }

    setScrollPosition(scrollVal) {
        $(".main-data-section").scrollTop(scrollVal);
    }

    expandEnterDataForm(obj) {
        if ($(obj).attr("lastState") === null || $(obj).attr("lastState") === 0) {
            $(".collapseHeader").attr("aria-expanded", true);
            $(".collapseBody").addClass("show");
            $(obj).attr("lastState", 1);
            
        } else {
            $(".collapseHeader").attr("aria-expanded", false);
            $(".collapseBody").removeClass("show");
            $(obj).attr("lastState", 0);
        }

    }

    //public isGeneralSectionExpanded: boolean=false;

    resetEnterFormTabular() {
        $(".collapseHeader").attr("aria-expanded", false);
        $(".collapseBody").removeClass("show");

        
        setTimeout(() => {
            $("#section1-link1").attr("aria-expanded", true);
            $("#section1").addClass("show");
            
        }, 1000);

        //this.isGeneralSectionExpanded=true;
        
    }

    activateShowBox(value) {
        let object = this;
        object.showRestBox = value;

    }

    getQuestionList() {
        let object = this;
        object.isDeleteAllowed = false;
        //TODO.. call web service
        object.digitalSharedService.getSurveyTemplate('14').subscribe((response: any) => {

            object.surveyQuestionJSON = response;
            // object.surveyQuestionJSON.Capabilities.Smart_Technologies[0].numeric_Value = -9999;
            // for(let obj of object.surveyQuestionJSON['Capabilities']['Smart_Technologies']){
            //     obj.numeric_Value = -9999;
            // }
            //console.log(object.surveyQuestionJSON['Capabilities']['Smart_Technologies']);

            //bind to default model so that form initially shows placeholders and not 0

            let i: number;
            let j: number;
            let subCatValue = [];
            let subcategory = [];
            let length1: any;
            let length2: any;


            //loop through survey object ot prepare request object
            // let category = Object.values(this.myData);
            let category = Object.keys(this.surveyQuestionJSON).map(e => this.surveyQuestionJSON[e]);
            length1 = Object.keys(this.surveyQuestionJSON).length;

            for (i = 0; i < length1; i++) {

                // subcategory = Object.values(category[i]);
                subcategory = Object.keys(category[i]).map(e => category[i][e]);

                length2 = Object.keys(subcategory).length;

                for (j = 0; j < length2; j++) {

                    // subCatValue = Object.values(subcategory[j]);

                    //console.log('question category: ',Object.keys(category[i]));

                    subCatValue = Object.keys(subcategory[j]).map(e => subcategory[j][e]);

                    for (let obj of subCatValue) {
                        let t1: any = {};

                        //placeholders for % and # fields

                        if(parseInt(obj.dashboard_question_id)==7)
                        {
                            //console.log('question 6: ',obj);
                            obj.selected_Value_Id=-9999;
                        }

                        

                        if (obj.question_type == 'Textbox' && obj.categoryID != "36") {
                            obj.text_Value = '';
                            obj.numeric_Value = null;
                        }

                        if( obj.numeric_Value == null ||  obj.numeric_Value == undefined ||  obj.numeric_Value == 0){
                            if(obj.question_type != 'Textbox'){
                                obj.numeric_Value = -9999;
                            }   
                            if(obj.categoryID == 36){
                                obj.numeric_Value = -9999;
                            }                        
                        }

                        if(obj.categoryName == "Capabilities") //slider)
                        {
                            
                            obj.numeric_Value=-9999;
                            //console.log('updated capability queation: ',obj);
                        }
                        
                        
                        //console.log('capabilities questions: ', object.surveyQuestionJSON['Capabilities']);


                    }

                }
            }

            //form completion
            //object.calculateFormCompletion();

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

    public showDigitalBenefitRevenueSub: boolean = null;
    public showDigitalBenefitCustomerSub: boolean = null;
    public showDigitalBenefitOperationSub: boolean = null;

    toggleDigitalBenefitsRadio(currentQuestionid, questionInfo) {

        let object = this;

        var checkedStatus = $('#'+currentQuestionid).prop('checked');


        //find dependent question associated with current question
        for (let cnt = 0; cnt < object.surveyQuestionJSON['Digital Transformation initiatives']['Benefits of Digital Initiatives'].length; cnt++) {

            if ((parseInt(object.surveyQuestionJSON['Digital Transformation initiatives']['Benefits of Digital Initiatives'][cnt].parent_Id) == parseInt(currentQuestionid)) && parseInt(currentQuestionid) == 28) {
            
                if(checkedStatus==true)
                {
                    object.showDigitalBenefitRevenueSub = true;
                }
                else
                {
                    object.showDigitalBenefitRevenueSub = false;

                }

                // if (object.showDigitalBenefitRevenueSub == false) {
                //     object.showDigitalBenefitRevenueSub = true;
                // }
                // else if(object.showDigitalBenefitRevenueSub == true){
                //     object.showDigitalBenefitRevenueSub = false;
                // }
            } 
            else if ((parseInt(object.surveyQuestionJSON['Digital Transformation initiatives']['Benefits of Digital Initiatives'][cnt].parent_Id) == parseInt(currentQuestionid)) && parseInt(currentQuestionid) == 30) {
                // if (object.showDigitalBenefitCustomerSub == false) {
                //     object.showDigitalBenefitCustomerSub = true;
                // }
                // else if(object.showDigitalBenefitCustomerSub == true){
                //     object.showDigitalBenefitCustomerSub = false;

                // }

                if(checkedStatus==true)
                {
                    object.showDigitalBenefitCustomerSub = true;
                }
                else
                {
                    object.showDigitalBenefitCustomerSub = false;
                }

            }
            else if ((parseInt(object.surveyQuestionJSON['Digital Transformation initiatives']['Benefits of Digital Initiatives'][cnt].parent_Id) == parseInt(currentQuestionid)) && parseInt(currentQuestionid) == 32) {
                // if (object.showDigitalBenefitOperationSub == false) {
                //     object.showDigitalBenefitOperationSub = true;
                // }
                // else if (object.showDigitalBenefitOperationSub == true){
                //     object.showDigitalBenefitOperationSub = false;

                // }

                if(checkedStatus==true)
                {
                    object.showDigitalBenefitOperationSub = true;
                }
                else
                {
                    object.showDigitalBenefitOperationSub = false;
                }


            }

        }
    }

    public showDigitalTransformationDependentQuestion: boolean = false;

    toggleDigitalTransformationRadio(currentQuestionid) {

        let object = this;

        object.traansformationRadioStatus='active';

        var checkedStatuus = $('#'+currentQuestionid).prop('checked');

        
        //find dependent question associated with current question
        for (let cnt = 0; cnt < object.surveyQuestionJSON['Digital Transformation initiatives']['null'].length; cnt++) {

            if (parseInt(object.surveyQuestionJSON['Digital Transformation initiatives']['null'][cnt].parent_Id) == parseInt(currentQuestionid)) {

                // if (object.showDigitalTransformationDependentQuestion == true) {
                //     object.showDigitalTransformationDependentQuestion = false;
                //     //object.surveyQuestionJSON['Digital Transformation initiatives']['null'][cnt].table_id=-999;
                // }
                // else if (object.showDigitalTransformationDependentQuestion == false) {
                //     //object.surveyQuestionJSON['Digital Transformation initiatives']['null'][cnt].table_id=4;
                //     object.showDigitalTransformationDependentQuestion = true;
                // }

                if(checkedStatuus==false)
                {
                    object.showDigitalTransformationDependentQuestion = true;
                }
                else
                {
                    object.showDigitalTransformationDependentQuestion = false;
                }
            }
        }
    }

    //check completion status of input form
    checkEntireFormFilled() {
        let object = this;


        let totalElements = 0;
        let completedElements = 0;


        //   //loop through headcount form controls
        //   $(".dashboard-section input").each(function (index) {

        //     if ($(this).val() != '' && $(this).val() != null) {
        //       completedElements++;
        //     }

        //     totalElements = index + 1;


        //   });


        //   if((totalElements==completedElements) && totalElements>0)
        //   {
        //     object.isSaveEnabled=true;
        //   }
        //   else
        //   {
        //     object.isSaveEnabled=false;
        //   }


    }

    scenarioDataObj = [];

    saveEnteredSurvey() {
        let object = this;


        this.scenarioDataObj = [];

        let i: number;
        let j: number;
        let subCatValue = [];
        let subcategory = [];
        let length1: any;
        let length2: any;


        //loop through survey object ot prepare request object
        // let category = Object.values(this.myData);
        let category = Object.keys(this.surveyQuestionJSON).map(e => this.surveyQuestionJSON[e]);
        length1 = Object.keys(this.surveyQuestionJSON).length;



        for (i = 0; i < length1; i++) {

            // subcategory = Object.values(category[i]);
            subcategory = Object.keys(category[i]).map(e => category[i][e]);



            length2 = Object.keys(subcategory).length;

            for (j = 0; j < length2; j++) {

                // subCatValue = Object.values(subcategory[j]);
                subCatValue = Object.keys(subcategory[j]).map(e => subcategory[j][e]);

               
                for (let obj of subCatValue) {
                    let t1: any = {};
                    t1.dashboardQuestionId = obj.dashboard_question_id;
                    

                    if (obj.selected_Value_Id == undefined || obj.selected_Value_Id == "null") {
                        t1.selectedValueId = null;
                    }
                    else {
                        t1.selectedValueId = obj.selected_Value_Id;
                    }

                    if (obj.onesys_Value_Id == undefined || obj.onesys_Value_Id == "null") {
                        t1.onesysValueId = null;
                    }
                    else {
                        t1.onesysValueId = obj.onesys_Value_Id;
                    }

                    if (obj.value == undefined || obj.value == "null") {
                        t1.value = null;
                    }
                    else {
                        t1.value = obj.value;
                        if(t1.value != null && t1.value != "" && t1.value != undefined){
                            t1.value = (t1.value.toString()).replace(/,/g,"");
                 }
                    }

                    if (obj.numeric_Value == undefined || obj.numeric_Value == "null") {

                        t1.numericValue = -9999;
                    }
                    else {

                        if(obj.categoryName=='Capabilities')
                        {
                            if(parseInt(obj.table_id)==-9999)
                            {
                               // t1.numericValue =-9999;
                               t1.numericValue =-9999;
                            }
                            else
                            {
                                t1.numericValue =obj.numeric_Value;
                            }

                        }
                        else
                        {
                            t1.numericValue = obj.numeric_Value;
                            if(t1.numericValue != null && t1.numericValue != "" && t1.numericValue != undefined){
                                t1.numericValue = (t1.numericValue.toString()).replace(/,/g,"");
                     }
                        }

                        
                    }

                    if (obj.text_Value == undefined || obj.text_Value == "null") {
                        t1.textValue = null;
                    }
                    else {
                        t1.textValue = obj.text_Value;
                    }

                    if(obj.note == undefined || obj.note == "null" || obj.note == null){
                        t1.note = null;
                    }
                    else{
                        t1.note = obj.note;
                    }


                    //once save note functionality done append value of each src code note here

                    this.scenarioDataObj.push(t1);

                }

            }
        }

        let saveObj = {
            "sessionId": object.sessionId,
            "surveyId": object.selectedSurvey,
            "surveyName": object.selectedSurveyName,
            "dashboardId": "14",
            "dataStatusId": object.selectedDataStatus.id,
            "digitalIPWrapperDataList": object.scenarioDataObj
        }


        console.log('setting scenario obj: ', saveObj);

        //integrate web service
        object.digitalSharedService.saveScenario(saveObj).subscribe((response) => {


            //object.disabledStatus[0].disabled = true;
            //object.disabledStatus[1].disabled = true;
            object.isCopyEnabled = true;
            let message;
            if (object.selectedSurvey == -9999) {
                message = "Saved";

                //event emitter to navigate to landing page compare


                object.digitalSharedService.setSurveyId(object.selectedSurvey);

                object.digitalSharedService.getEmitter().emit('newDigitalSurveySaved');
                object.digitalSharedService.getEmitter().emit('newDigitalSurveySaved');


                //object.isResetRequired = false;
                //updating ScenarioList After Updating
                object.getSurveyList();

                object.resetEnterFormTabular();
                //console.log('getScenariosList of AD: ', response.value);

                //set saved scenario to service
                // this.applicationDevelopmentInputMyDataSharedService.setScenarioSelection(response.value);
                // //trigger a emitter to let landing page know
                // this.applicationDevelopmentInputMyDataSharedService.getEmitter().emit('newADScenarioSaved');          



            } else {
                message = "updated";
                //object.isResetRequired = false;
                //object.getSurveyDataById(response.value);

                //event emitter to navigate to landing page compare

             
                object.digitalSharedService.setSurveyId(object.selectedSurvey);

                object.digitalSharedService.getEmitter().emit('DigitalSurveyUpdated');
                object.digitalSharedService.getEmitter().emit('DigitalSurveyUpdated');


                object.getSurveyList();

                object.resetEnterFormTabular();



            }

            let description = object.selectedSurveyName;
            if (description == undefined || description == undefined || description.trim().length == 0) {
                description = response.value;// + '_Scenario ' + response.value;
            } else {
                description = response.value;// + '_' + this.selectedSurveyName;
            }
            this.toastr.info( description + " " + '', '', {
                timeOut: 7000,
                positionClass: 'toast-top-center'
            });

            object.isDeleteAllowed = true;


        }, (error) => {
            //throw custom exception to global error handler
            //create error object
            // console.log(error);

            let errorObj = {
                "dashboardId": "1",
                "pageName": "CIO Dashboard Input My Data Screen",
                "errorType": "Fatal",
                "errorTitle": "Web Service Error",
                "errorDescription": error.message,
                "errorObject": error
            }

            throw errorObj;
        });



    }

    saveSurvey() {
        let object = this;


        this.scenarioDataObj = [];

        let i: number;
        let j: number;
        let subCatValue = [];
        let subcategory = [];
        let length1: any;
        let length2: any;


        //loop through survey object ot prepare request object
        // let category = Object.values(this.myData);
        let category = Object.keys(this.surveyQuestionJSON).map(e => this.surveyQuestionJSON[e]);
        length1 = Object.keys(this.surveyQuestionJSON).length;



        for (i = 0; i < length1; i++) {

            // subcategory = Object.values(category[i]);
            subcategory = Object.keys(category[i]).map(e => category[i][e]);



            length2 = Object.keys(subcategory).length;

            for (j = 0; j < length2; j++) {

                // subCatValue = Object.values(subcategory[j]);
                subCatValue = Object.keys(subcategory[j]).map(e => subcategory[j][e]);

               
                for (let obj of subCatValue) {
                    let t1: any = {};
                    t1.dashboardQuestionId = obj.dashboard_question_id;
                    

                    if (obj.selected_Value_Id == undefined || obj.selected_Value_Id == "null") {
                        t1.selectedValueId = null;
                    }
                    else {
                        t1.selectedValueId = obj.selected_Value_Id;
                    }

                    if (obj.onesys_Value_Id == undefined || obj.onesys_Value_Id == "null") {
                        t1.onesysValueId = null;
                    }
                    else {
                        t1.onesysValueId = obj.onesys_Value_Id;
                    }

                    if (obj.value == undefined || obj.value == "null") {
                        t1.value = null;
                    }
                    else {
                        t1.value = obj.value;
                        if(t1.value != null && t1.value != "" && t1.value != undefined){
                            t1.value = (t1.value.toString()).replace(/,/g,"");
                 }
                    }

                    if (obj.numeric_Value == undefined || obj.numeric_Value == "null") {

                        t1.numericValue = -9999;
                    }
                    else {

                        if(obj.categoryName=='Capabilities')
                        {
                            if(parseInt(obj.table_id)==-9999)
                            {
                               // t1.numericValue =-9999;
                               t1.numericValue =-9999;
                            }
                            else
                            {
                                t1.numericValue =obj.numeric_Value;
                            }

                        }
                        else
                        {
                            t1.numericValue = obj.numeric_Value;
                            if(t1.numericValue != null && t1.numericValue != "" && t1.numericValue != undefined){
                                t1.numericValue = (t1.numericValue.toString()).replace(/,/g,"");
                     }
                        }

                        
                    }

                    if (obj.text_Value == undefined || obj.text_Value == "null") {
                        t1.textValue = null;
                    }
                    else {
                        t1.textValue = obj.text_Value;
                    }

                    if(obj.note == undefined || obj.note == "null" || obj.note == null){
                        t1.note = null;
                    }
                    else{
                        t1.note = obj.note;
                    }


                    //once save note functionality done append value of each src code note here

                    this.scenarioDataObj.push(t1);

                }

            }
        }

        let saveObj = {
            "sessionId": object.sessionId,
            "surveyId": object.selectedSurvey,
            "surveyName": object.selectedSurveyName,
            "dashboardId": "14",
            "dataStatusId": object.selectedDataStatus.id,
            "digitalIPWrapperDataList": object.scenarioDataObj
        }


        console.log('setting scenario obj: ', saveObj);

        //integrate web service
        object.digitalSharedService.saveScenario(saveObj).subscribe((response) => {


            //object.disabledStatus[0].disabled = true;
            //object.disabledStatus[1].disabled = true;
            object.isCopyEnabled = true;
            let message;
            if (object.selectedSurvey == -9999) {
                message = "Saved";

                //event emitter to navigate to landing page compare


                object.digitalSharedService.setSurveyId(object.selectedSurvey);

                //object.isResetRequired = false;
                //updating ScenarioList After Updating
                object.getSurveyList();

                object.resetEnterFormTabular();
                object.digitalSharedService.getEmitter().emit('newdigitalsurveygenerated');
                //console.log('getScenariosList of AD: ', response.value);

                //set saved scenario to service
                // this.applicationDevelopmentInputMyDataSharedService.setScenarioSelection(response.value);
                // //trigger a emitter to let landing page know
                // this.applicationDevelopmentInputMyDataSharedService.getEmitter().emit('newADScenarioSaved');          



            } else {
                message = "updated";
                //object.isResetRequired = false;
                //object.getSurveyDataById(response.value);

                //event emitter to navigate to landing page compare

             
                object.digitalSharedService.setSurveyId(object.selectedSurvey);


                object.getSurveyList();

                object.resetEnterFormTabular();



            }

            let description = object.selectedSurveyName;
            if (description == undefined || description == undefined || description.trim().length == 0) {
                description = response.value;// + '_Scenario ' + response.value;
            } else {
                description = response.value;// + '_' + this.selectedSurveyName;
            }
            this.toastr.info( description + " " + '', '', {
                timeOut: 7000,
                positionClass: 'toast-top-center'
            });

            object.isDeleteAllowed = true;


        }, (error) => {
            //throw custom exception to global error handler
            //create error object
            // console.log(error);

            let errorObj = {
                "dashboardId": "1",
                "pageName": "CIO Dashboard Input My Data Screen",
                "errorType": "Fatal",
                "errorTitle": "Web Service Error",
                "errorDescription": error.message,
                "errorObject": error
            }

            throw errorObj;
        });



    }

    captureQuestionDetails(question) {
        let object = this;

        //object.activateShowBox(true);

        var questionAnswer = $('#' + question.dashboard_question_id).val();

        var oneSysValueId = null;
        var numericValue = null;
        var selectedValueId = null;
        var value = null;
        var textValue = null;


        //for revenue question, capture numeric value and onesys
        if (parseInt(question.dashboard_question_id) == 2) {
            //set onesys id based on range

            if (parseInt(questionAnswer) < 500) {
                oneSysValueId = 'B4A44DB7-BD56-45CB-9C54-22583AA38219';
            }
            else if (parseInt(questionAnswer) >= 500 && parseInt(questionAnswer) < 1000) {
                oneSysValueId = '3C8EC208-A7D2-492B-8BB2-E8A98D1F8CC6';
            }
            else if (parseInt(questionAnswer) >= 1000 && parseInt(questionAnswer) <= 10000) {
                oneSysValueId = 'D2767B7C-F1B1-480E-8F26-447710351D7A';
            }
            else if (parseInt(questionAnswer) > 10000) {
                oneSysValueId = 'ECD2DDB5-7B22-472C-8284-573DA54F6604';
            }
            // else if (parseInt(questionAnswer) >= 3000 && parseInt(questionAnswer) < 5000) {
            //     oneSysValueId = '8F644EC3-E209-4E96-BFBB-96AEF70F7F9A';
            // }
            // else if (parseInt(questionAnswer) >= 5000 && parseInt(questionAnswer) < 10000) {
            //     oneSysValueId = '75CC7F98-59DE-4AB0-A2B1-719655DDD39F';
            // }
            // else if (parseInt(questionAnswer) >= 10000 && parseInt(questionAnswer) < 50000) {
            //     oneSysValueId = 'ECD2DDB5-7B22-472C-8284-573DA54F6604';
            // }
            // else if (parseInt(questionAnswer) >= 50000) {
            //     oneSysValueId = '997A3083-4A1E-4D3C-A402-C9F9243B57FD';
            // }

            //numeric value 
            numericValue = questionAnswer;
        }

        //question with dropdown and onesys
        else if (parseInt(question.dashboard_question_id) == 5 || parseInt(question.dashboard_question_id) == 4) {

            //onesys value 
            oneSysValueId = questionAnswer;

            //to get value loop through country dropdown
            // for (let i = 0; i < object.surveyQuestionJSON.General.null; i++) {
            //     if (object.surveyQuestionJSON.General.null[i] == 4) {
            //         for (let cnt = 0; cnt < object.surveyQuestionJSON.General.null[i].columns.length; cnt++) {
            //             if (parseInt(object.surveyQuestionJSON.General.null[i].columns[cnt].id) == parseInt(oneSysValueId)) {
            //                 value = object.surveyQuestionJSON.General.null[i].columns[cnt].name;
            //             }
            //         }
            //     }
            // }
        }

        else if (question.categoryName == "Capabilities") //slider
        {
            numericValue = question.numeric_Value;


            //get scale details
            for (let cnt = 0; cnt < object.scaleData.length; cnt++) {
                var minRangeThreshold = object.scaleData[cnt].min_Range;
                var maxRangeThreshold = object.scaleData[cnt].max_Range;

                if (parseInt(numericValue) > parseInt(minRangeThreshold) && parseInt(numericValue) <= parseInt(maxRangeThreshold)) {
                    //range id
                    selectedValueId = object.scaleData[cnt].id;
                    //range value
                    value = object.scaleData[cnt].scale_Name;

                    
                }
                else {
                    //range id
                    selectedValueId = null;
                    //range value
                    value = null;
                    
                }

            }

            if(parseInt(question.numeric_Value)>0)
            {
                question.table_id=9999;

               
                $('#' + question.dashboard_question_id + '-checkbox').prop('checked',false);

                console.log('checkbox: ',$('#' + question.dashboard_question_id + '-checkbox').prop('checked'));

                //$('#'+question.dashboard_question_id).prop('checked',false);
                // if($('#' + question.dashboard_question_id + '-checkbox').is(':checked') == false) {
                //     question.table_id=9999;
        
                // }
            }

        }
        //questions with free text numeric input
        else if (question.question_type == 'Textbox' && (question.value_type == '$' || question.value_type == '#' || question.value_type == '%')) {
            //numeric value
            numericValue = questionAnswer;
        }
        else if (question.question_type == 'Textbox') //regular freetext feedback
        {
            textValue = questionAnswer;
        }
        //regular question with dropdown
        else if (question.question_type == 'Drop/Down') {

            //numeric value
            selectedValueId = questionAnswer;

            value = $('#' + question.dashboard_question_id + ' :selected').text();


        }

        //COE text boxes
        else if (question.question_type == 'Radio_Button' && (parseInt(question.dashboard_question_id) >= 19 && parseInt(question.dashboard_question_id) <= 26)) {
            if ($('#' + question.dashboard_question_id).is(':checked') == true) {
                numericValue = 1;
                //uncheck none of the above question
                $('#27').prop('checked', false);
            }
            else {
                numericValue = 0;
            }

        }
        else if (question.question_type == 'Radio_Button' && (parseInt(question.dashboard_question_id) == 27)) {
            if ($('#' + question.dashboard_question_id).is(':checked') == true) {
                numericValue = 1;
                //uncheck none of the above question
                //$('#27').prop('checked', false);
            }
            else {
                numericValue = 0;
            }

        }
        //regular radio button
        else if (question.question_type == 'Radio_Button') {
            var groupname = +'' + question.dashboard_question_id;
            questionAnswer = $("input:radio[name=" + groupname + "]:checked").val();
            numericValue = questionAnswer;
        }

        console.log('inside capture');

        if(object.selectedSurveyName.length>0){
            if(oneSysValueId == null 
                && numericValue == null
                 && selectedValueId == null 
                 && value == null
                && textValue == null
                )        {
                    object.activateShowBox(false);
                }
                else
                {
                    object.activateShowBox(true);
                }
        }
        else {
           var perc1 = $('#general-q-percentage').text().split('%')[0];
            var perc2 = $('#transform-init-percentage').text().split('%')[0];
             var perc3 =  $('#capabilities-percentage').text().split('%')[0];
            var perc4 =  $('#feedback-percentage').text().split('%')[0];

            console.log('perc1: ', perc1);
            console.log('perc2: ', perc2);
            console.log('perc3: ', perc3);
            console.log('perc4: ', perc4);

            //if all section percentage are 0, form is unaltered
            if(perc1==0 && perc2==0 && perc3==0 && perc4==0)
            {
                object.activateShowBox(false);
            }
            else
            {
                object.activateShowBox(true);
            }

        }
        

        //assign the values in JSON data object
        let i: number;
        let j: number;
        let subCatValue = [];
        let subcategory = [];
        let length1: any;
        let length2: any;


        //loop through survey object ot prepare request object
        // let category = Object.values(this.myData);
        let category = Object.keys(this.surveyQuestionJSON).map(e => this.surveyQuestionJSON[e]);
        length1 = Object.keys(this.surveyQuestionJSON).length;

        for (i = 0; i < length1; i++) {

            // subcategory = Object.values(category[i]);
            subcategory = Object.keys(category[i]).map(e => category[i][e]);

            length2 = Object.keys(subcategory).length;

            for (j = 0; j < length2; j++) {

                // subCatValue = Object.values(subcategory[j]);

                //console.log('question category: ',Object.keys(category[i]));

                subCatValue = Object.keys(subcategory[j]).map(e => subcategory[j][e]);

                for (let obj of subCatValue) {
                    let t1: any = {};

                    if(parseInt(obj.dashboard_question_id)>=19 && parseInt(obj.dashboard_question_id)<=26)
                    {
                        if (question.dashboard_question_id==27) {
                            if(parseInt(numericValue)==1)
                            {
                                obj.numeric_Value = -9999;
                                obj.text_Value = textValue;
                                obj.onesys_Value_Id = oneSysValueId;
                                obj.value = value;
                                obj.selected_Value_Id = selectedValueId;   
                            }
                        console.log('captured question id: ',obj.dashboard_question_id);
                        console.log('numeric value: ',numericValue);
                        }
                        
                    }

                    if(parseInt(obj.dashboard_question_id)==27)
                    {
                        if (parseInt(question.dashboard_question_id)>=19 && parseInt(question.dashboard_question_id)<=26) {
                            if(parseInt(numericValue)==1)
                            {
                                obj.numeric_Value = -9999;
                                obj.text_Value = textValue;
                                obj.onesys_Value_Id = oneSysValueId;
                                obj.value = value;
                                obj.selected_Value_Id = selectedValueId;   
                            }
                        console.log('captured question id: ',obj.dashboard_question_id);
                        console.log('numeric value: ',numericValue);
                        }
                        
                    }

                    if(parseInt(obj.dashboard_question_id)==29)
                    {
                        if (parseInt(question.dashboard_question_id)==28)
                        {
                            if(parseInt(numericValue)==0)
                            {
                                obj.numeric_Value = '';
                                obj.text_Value = textValue;
                                obj.onesys_Value_Id = oneSysValueId;
                                obj.value = value;
                                obj.selected_Value_Id = selectedValueId;   
                            }
                        }
                    }

                    if(parseInt(obj.dashboard_question_id)==31)
                    {
                        if (parseInt(question.dashboard_question_id)==30)
                        {
                            if(parseInt(numericValue)==0)
                            {
                                obj.numeric_Value = '';
                                obj.text_Value = textValue;
                                obj.onesys_Value_Id = oneSysValueId;
                                obj.value = value;
                                obj.selected_Value_Id = selectedValueId;   
                            }
                        }
                    }

                    if(parseInt(obj.dashboard_question_id)==33)
                    {
                        if (parseInt(question.dashboard_question_id)==32)
                        {
                            if(parseInt(numericValue)==0)
                            {
                                obj.numeric_Value = '';
                                obj.text_Value = textValue;
                                obj.onesys_Value_Id = oneSysValueId;
                                obj.value = value;
                                obj.selected_Value_Id = selectedValueId;   
                            }
                        }
                    }

                    if (obj.dashboard_question_id == question.dashboard_question_id) {
                        obj.numeric_Value = numericValue;
                        obj.text_Value = textValue;
                        obj.onesys_Value_Id = oneSysValueId;
                        obj.value = value;
                        obj.selected_Value_Id = selectedValueId;

                    }

                    //placeholders for % and # fields

                    // if (obj.question_type == 'Textbox' && obj.categoryID!="36") {
                    //     obj.text_Value = '';
                    //     obj.numeric_Value = null;
                    // }



                }

            }
        }


    }

    toggleCOEQuestions(question) {
        let object = this;

        //if selected none of the above, reset all COE responses
        if (parseInt(question.dashboard_question_id) == 27) {
            if ($('#' + question.dashboard_question_id).is(':checked') == true) {
                //reset other COEs from question 20 to 26

                $('#20').prop('checked', false);
                $('#21').prop('checked', false);
                $('#22').prop('checked', false);
                $('#23').prop('checked', false);
                $('#24').prop('checked', false);
                $('#25').prop('checked', false);
                $('#26').prop('checked', false);

            }
            else {
                //numericValue = 0;
            }
        }




    }

    calculateFormCompletion() {
        let object = this;

        let totalSurveyInfolElements = 0;
        let completedSurveyInfoElements = 0;
        let calculatedSurveyInfoPercentage = 0;

        let totalGeneralElements = 0;
        let completedGeneralElements = 0;
        let calculatedGeneralElements = 0;

        let totalInitiativeElements = 0;
        let completedInitiativeElements = 0;
        let calculatedInitiativeElements = 0;

        let totalCapabilityElements = 0;
        let completedCapabilityElements = 0;
        let calculatedCapabilityElements = 0;

        let totalFeedbackElements = 0;
        let completedFeedbackElements = 0;
        let calculatedFeedbackElements = 0;

        let totalFormElements = 0;
        let completedFormElements = 0;
        let calculatedFormElements = 0;


        $(".general-section .form-control").each(function (index) {


            if ($(this).val() != '' && $(this).val() != null) {
                completedSurveyInfoElements++;
            }

            totalSurveyInfolElements = index + 1;

        });

        calculatedSurveyInfoPercentage = completedSurveyInfoElements / totalSurveyInfolElements * 100;



        $('#general-percentage').text(Math.round(calculatedSurveyInfoPercentage) + '%');

        //general section

        $(".general-question-section .form-control").each(function (index) {

            //console.log('general question change: ',$(this).val());
            if ($(this).val() != '' && $(this).val() != null && parseInt($(this).val())!=-9999) {
                completedGeneralElements++;
            }

            totalGeneralElements = index + 1;

        });

        calculatedGeneralElements = completedGeneralElements / totalGeneralElements * 100;

        $('#general-q-percentage').text(Math.round(calculatedGeneralElements) + '%');

        //digital initiatives
        $(".digital-transformation-init .form-control").each(function (index) {

            //console.log('digital transformation effort changes: ',$(this).attr('id'));

            if($(this).attr('id')=='7')
            {
                    
                    if(object.traansformationRadioStatus=='active')
                    {
                        completedInitiativeElements++;
                    }

                    if(parseInt($('#7').val())>0)
                    {
                        completedInitiativeElements++;
                    }
            }

            
            else if ($(this).val() != '' && $(this).val() != null && parseInt($(this).val())>=0)  {
                completedInitiativeElements++;
            }


            totalInitiativeElements = index + 1;

        });

        calculatedInitiativeElements = (completedInitiativeElements / totalInitiativeElements * 100);

        $('#transform-init-percentage').text(Math.round(calculatedInitiativeElements) + '%');

        //capabilities
        let i: number;
        let j: number;
        let subCatValue = [];
        let subcategory = [];
        let length1: any;
        let length2: any;


        //loop through survey object ot prepare request object
        // let category = Object.values(this.myData);
        let category = Object.keys(this.surveyQuestionJSON).map(e => this.surveyQuestionJSON[e]);
        length1 = Object.keys(this.surveyQuestionJSON).length;

        for (i = 0; i < length1; i++) {

            // subcategory = Object.values(category[i]);
            subcategory = Object.keys(category[i]).map(e => category[i][e]);

            length2 = Object.keys(subcategory).length;

            for (j = 0; j < length2; j++) {

                // subCatValue = Object.values(subcategory[j]);

                //console.log('question category: ',Object.keys(category[i]));

                subCatValue = Object.keys(subcategory[j]).map(e => subcategory[j][e]);

                for (let obj of subCatValue) {
                    let t1: any = {};

                    if (obj.categoryName == 'Capabilities' && parseInt(obj.dashboard_question_id) != 35) {
                        
                        if (parseInt(obj.numeric_Value) > 0) {
                            
                            completedCapabilityElements++;
                        }

                        totalCapabilityElements++;
                    }


                }

            }
        }

        //totalCapabilityElements=40;
       
        calculatedCapabilityElements = (completedCapabilityElements / totalCapabilityElements * 100);
    
        $('#capabilities-percentage').text(Math.round(calculatedCapabilityElements) + '%');

        //fedback section
        $(".feedback-section .form-control").each(function (index) {

          
            console.log('feedback values: ',$(this).val());
            
            if ($(this).val() != '' && $(this).val() != null) {
                completedFeedbackElements++;
            }

            totalFeedbackElements = index + 1;

        });

        calculatedFeedbackElements = (completedFeedbackElements / totalFeedbackElements * 100);

        if(isNaN(calculatedFeedbackElements))
        {
            calculatedFeedbackElements=0;
        }

        $('#feedback-percentage').text(Math.round(calculatedFeedbackElements) + '%');

        //calculate overall percentage
        totalFormElements = totalSurveyInfolElements + totalGeneralElements + totalInitiativeElements + totalCapabilityElements + totalFeedbackElements;

        completedFormElements = completedSurveyInfoElements + completedGeneralElements + completedInitiativeElements + completedCapabilityElements + completedFeedbackElements;

        calculatedFormElements = (completedFormElements / totalFormElements * 100);

        $('#overall-percentage').text(Math.round(calculatedFormElements) + '%');


    }


    checkthresholds(question, event) {
        if (question.value_type == '%') {
            event.target.value = event.target.value.toString().replace(/,/g,"");
            if (Number(event.target.value) > 100) {
                question.numeric_Value = 100;
                event.target.value = 100;
            }
        }


        if (event.target.value != null) {
            if (question.numeric_Value.split('.').length > 0) {
                var decimalplaces = question.numeric_Value.split('.')[1].length;
                var temp1 = question.numeric_Value.split('.')[0];
                var temp2 = question.numeric_Value.split('.')[1];

                if (decimalplaces > 6) {
                    temp2 = temp2.substring(0, 6);
                    question.numeric_Value = temp1 + '.' + temp2;
                }

            }

        }
    }

    validateExpenditureSum(question) {
        let object = this;
    }

    resetAll() {
        let object = this;

        object.isCopyEnabled = false;
        object.slectedIndustry=-9999;
        object.selectedJobFunction=-9999;
        object.selectedCountry=-9999;

        object.surveyQuestionJSON=null;
       
        object.confirmBoxCloseFlag=false;

        object.traansformationRadioStatus=null;

        object.showDigitalTransformationDependentQuestion=null;
        object.showDigitalBenefitRevenueSub = null;
        object.showDigitalBenefitCustomerSub = null;
        object.showDigitalBenefitOperationSub = null;

        //object.showDigitalTransformationDependentQuestion=null;

        //reset percentages
        $('#general-percentage').text(Math.round(0) + '%');
        $('#general-q-percentage').text(Math.round(0) + '%');
        $('#transform-init-percentage').text(Math.round(0) + '%');
        $('#capabilities-percentage').text(Math.round(0) + '%');
        $('#feedback-percentage').text(Math.round(0) + '%');
        $('#overall-percentage').text(Math.round(0) + '%');


        object.showRestBox=false;
        object.isDeleteAllowed = false;

    }

    //validations

    //validation on digital expenditure 
    validateExpenditureCondition()
    {
        let object = this;

        //get values of hardware, software, personnel, services and others
        //question no 11 to 15
        
        var hardware = $('#11').val();
        var software = $('#12').val();
        var personnel = $('#13').val();
        var services = $('#14').val();
        var others = $('#15').val();

        var totalExpenditure = Number(hardware)+Number(software)+Number(personnel)+Number(services)+Number(others);

        var hundred = 100;

        //valid condition
        if(totalExpenditure.toFixed(6)==hundred.toFixed(6))
        {
            object.expenditureWarningMessage=false;
            object.expenditurecnditionsFulfilled=true;
        }
        
        //blank 
        else if(totalExpenditure.toFixed(6)!=hundred.toFixed(6)
        && hardware==''
        && software ==''
        && personnel ==''
        && services ==''
        && others =='')
        {
            object.expenditureWarningMessage=false;
            object.expenditurecnditionsFulfilled=true;
        }

        //warning
        else if(totalExpenditure.toFixed(6)!=hundred.toFixed(6)
        &&( hardware==''
        || software ==''
        || personnel ==''
        || services ==''
        || others =='')
        && totalExpenditure > 0)
        {
            object.expenditureWarningMessage=true;
            object.expenditurecnditionsFulfilled=false;
            object.errorMessageExpenditure='The sum of percentages for hardware, software, personnel, services, and other must equal 100%.';
        }
        //error
        else if(totalExpenditure.toFixed(6)!=hundred.toFixed(6)
        &&( hardware!=''
        && software !=''
        && personnel !=''
        && services !=''
        && others !='')
        && totalExpenditure > 0)
        {
            object.expenditureWarningMessage=false;
            object.expenditurecnditionsFulfilled=false;
            object.errorMessageExpenditure='The sum of percentages for hardware, software, personnel, services, and other must equal 100%.';
        }

        //validate all section conditions
        object.checkAllSurveyValidations()

    }

    checkAllSurveyValidations()
    {
        let object = this;

        if(object.selectedSurveyName.length>0)
        {
            object.activateShowBox(true);
        }
        
        if(object.expenditurecnditionsFulfilled==true && object.selectedSurveyName!='')
        {
            object.isEntireSurveyValid =true;
            // object.isCopyEnabled = true;
        }
        else
        {
            object.isEntireSurveyValid =false;
            object.isCopyEnabled = false;
        }
    }

    //this is to open delete modal
 deleteScenario(){
    let object = this;
    object.confirmBoxDeleteFlag = true;
  }

//this is to delete scenario
  deleteConfirmYes(flag){
    let object = this;
    if(flag){
      let userId = object.userKeyDetails;
      let requestObj = {
        "userId": userId,
        "dashboardID":14,
        "surveyIDList":[]
      };
     
      let tempObj = {
        "surveyId": object.selectedSurvey,
        "isActive": 0
        };
        requestObj.surveyIDList.push(tempObj);

      console.log("requesObj",requestObj);
      //call webservice
      object.enterCompareDataTowersService.deleteScenario(requestObj).subscribe(function (response) {
          //after successfull response close confirmation box
        //once scenario get deleted refresh scenario list and reset scenario selection as well
        object.resetAll();
        object.getSurveyList();
          let message = "deleted successfully."
          
          let  description = object.selectedSurveyName;

          if (description == "" || description == undefined || description.trim().length == 0) {
            description = object.selectedSurvey + '_Scenario ' + object.selectedSurvey;
          } else {
            description = object.selectedSurvey + '_' +  description;
          }
          object.toastr.info('Scenario ' + description + " " + message, '', {
            timeOut: 7000,
            positionClass: 'toast-top-center'
          });
        
        object.updateScenarioListNotificationServiceService.getEmitter().emit('updateDigitalScenarioListAfterDeletion');
      });
      
      object.confirmBoxDeleteFlag = false;
      
    }else{
      object.confirmBoxDeleteFlag = false;
    }
  }

  createSceCopy(){
    let object =this;
    //reset general section
    object.selectedSurvey=-9999;
    object.selectedSurveyName='';
  
    //enable save button
    object.isEntireSurveyValid=false;
    object.isCopyEnabled = false;
    object.isDeleteAllowed = false;
  }

  
}



