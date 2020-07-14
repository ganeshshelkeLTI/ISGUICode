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

declare var $: any;

@Component({
  selector: 'app-survey-validation-admin',
  templateUrl: './survey-validation-admin.component.html',
  styleUrls: ['./survey-validation-admin.component.css']
})
export class SurveyValidationAdminComponent implements OnInit {

  public value: number = 0;
  public options: Options = {
    floor: 0,
    ceil: 100,
    disabled: true,
  };

  loggedInUserInfo: any;
  privilegesObject: any;

  public sessionId: string;
  public userdata: any;
  public emailId: any;
  dashboardId: string;

  

  public selectedSurvey: any;

  private showRestBox: boolean;
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

  public showSurveyData: boolean = false;
  public surveyId: any;

  message:string;

  public traansformationRadioStatus: any;

  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private loginDataBroadcastService: LoginDataBroadcastService,
    private privilegesService: PrivilegesService,
    private compiler: Compiler,
    private siblingData: SiblingDataService,
    private inputMyDataheaderSharedService: HeaderCompareEnterDataSharedService,
    private digitalSharedService: DigitalSharedService,
    private digitalEditAndCompareSharedService: DigitalEditAndCompareSharedService) {

    let object = this;

        

    // object.selectedSurvey = 0;
    object.dashboardId = "14";
    object.activateShowBox(false);

    
    object.digitalSharedService.getEmitter().on('StartSurveyValidation', function () {
       
        object.confirmBoxCloseFlag =false;
     
       let surveyID = object.digitalSharedService.getSurveyId();

       
         object.selectedSurvey = surveyID;
         object.surveyId = surveyID;
        
         object.getSurveyDataById(object.selectedSurvey);

         
     
    });

    object.digitalSharedService.currentMessage.subscribe(message => this.message = message); // on

    if(object.message=='surveySelection'){

        object.confirmBoxCloseFlag=false;
        
        let surveyID = object.digitalSharedService.getSurveyId();

        
          object.selectedSurvey = surveyID;
          object.surveyId = surveyID;
        
          object.getSurveyDataById(object.selectedSurvey);

    }

    object.privilegesService.getEmitter().on('updatePrivileges', function () {
      object.privilegesObject = object.privilegesService.getData();
    });


   
  }

  getUserLoginInfo() {
    let _self = this;

    _self.userdata = _self.loginDataBroadcastService.get('userloginInfo');
    _self.emailId = _self.userdata['userDetails']['emailId'];
    _self.sessionId = _self.userdata['userDetails']["sessionId"];

  }

  ngOnInit() {

    let object = this;

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

        object.getSurveyDataById(object.selectedSurvey);



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

getSurveyDataById(selectedsurvey) {

    let object = this;

    object.selectedSurvey = selectedsurvey;

    object.resetAll();

    // if (object.selectedSurvey == -9999) {
    //     //reset to default
    //     object.selectedDataStatus = object.surveyStatusList[3];
    //     object.selectedSurveyName = '';
    //     //object.selectedSurvey = -9999;

    //     //form completion
    //     object.calculateFormCompletion();


    //     //get default template
    //     object.getQuestionList();


    // }

    
    //get survey list
    //web service
    object.digitalSharedService.getSurveyListForUser('14').subscribe((response: any) => {

        //list of survey
        object.surveyList = response;

        //object.selectedSurvey = -9999;

      
        //populate general data

        for (let cnt = 0; cnt < object.surveyList.length; cnt++) {
            if (object.selectedSurvey == object.surveyList[cnt].surveyId) {
                object.selectedSurveyName = object.surveyList[cnt].surveyName;
                for (let i = 0; i < object.surveyStatusList.length; i++) {
                    console.log('object.surveyList[cnt]', object.surveyList[cnt].dataStatusId);
                    console.log('object.surveyStatusList[cnt]', object.surveyStatusList[cnt]);
                    if (object.surveyList[cnt].dataStatusId == object.surveyStatusList[i].id) {
                        object.selectedDataStatus = object.surveyStatusList[i];
                    }
                }

            }
        }

        let surveyname = object.digitalSharedService.getSurveyName();

        object.selectedSurvey = surveyname;
        object.selectedSurveyName = surveyname;
       

        //object.resetAll();

        //object.getSurveyDataById(object.selectedSurvey);

        //populate survey question data

        object.surveyQuestionJSON= object.digitalSharedService.getsurveyQuestionJSON();
        
        object.setValuesOnSurvey();


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

// setValuesOnSurvey() {
//     let object = this;

//     //set values by question id

//     let i: number;
//     let j: number;
//     let subCatValue = [];
//     let subcategory = [];
//     let length1: any;
//     let length2: any;


//     //loop through survey object ot prepare request object
//     // let category = Object.values(this.myData);
//     let category = Object.keys(this.surveyQuestionJSON).map(e => this.surveyQuestionJSON[e]);
//     length1 = Object.keys(this.surveyQuestionJSON).length;

//     for (i = 0; i < length1; i++) {

//         // subcategory = Object.values(category[i]);
//         subcategory = Object.keys(category[i]).map(e => category[i][e]);

//         length2 = Object.keys(subcategory).length;

//         for (j = 0; j < length2; j++) {

//             // subCatValue = Object.values(subcategory[j]);

//             //console.log('question category: ',Object.keys(category[i]));

//             subCatValue = Object.keys(subcategory[j]).map(e => subcategory[j][e]);

//             for (let obj of subCatValue) {
//                 let t1: any = {};



//                 //for revenue question, capture numeric value and onesys
//                 /*  if (parseInt(obj.dashboard_question_id) == 2) {
//                       //set value based on range

//                       console.log('setting question id for question 2: ',obj.dashboard_question_id);
//                       console.log('setting selected value for question 2: ',obj.numeric_Value);
                      
//                       //numeric value 
//                       //$('#' + obj.dashboard_question_id).val(obj.numeric_Value);
//                       //  $('#2').val(obj.numeric_Value);
//                   }

//                   //question with dropdown and onesys
//                   else if (parseInt(obj.dashboard_question_id) == 5) {

//                       for (let cnt = 0; cnt < object.surveyQuestionJSON.General.null[i].columns.length; cnt++) {
//                           if (object.surveyQuestionJSON.General.null[i].columns[cnt].id == obj.onesys_Value_Id) {
//                               //value = object.surveyQuestionJSON.General.null[i].columns[cnt].name;
//                               $('#' + obj.dashboard_question_id).val(obj.onesys_Value_Id);
//                           }
//                       }

                      


                   
//                   }

//                   else if (obj.categoryName == "Capabilities") //slider
//                   {
                      
//                   }
//                   //questions with free text numeric input
//                   else if (obj.question_type == 'Textbox' && (obj.value_type == '$' || obj.value_type == '#' || obj.value_type == '%')) {
                      
//                       //numeric value
//                       $('#' + obj.dashboard_question_id).val(obj.numeric_Value);
//                   }
//                   else if (obj.question_type == 'Textbox') //regular freetext feedback
//                   {
//                       $('#' + obj.dashboard_question_id).val(obj.text_Value);
//                   }
//                   //regular question with dropdown
//                   else if (obj.question_type == 'Drop/Down') {

//                       //numeric value
                      
//                       $('#' + obj.dashboard_question_id).val(obj.selected_Value_Id);


//                   }

//                   //COE text boxes
//                   else if (obj.question_type == 'Radio_Button' && (parseInt(obj.dashboard_question_id) >= 19 && parseInt(obj.dashboard_question_id) <= 27)) {
                          
//                       if(obj.numeric_Value==1)
//                       {
//                           $('#' + obj.dashboard_question_id).prop('checked', true);
//                       }
//                       else
//                       {
//                           $('#' + obj.dashboard_question_id).prop('checked', false);
//                       }
                      
//                   }

//                   //regular radio button
//                   else 
//                   */
//                 if (parseInt(obj.dashboard_question_id) == 1) {

//                     object.selectedJobFunction = obj.selected_Value_Id;
//                 }
//                 if (parseInt(obj.dashboard_question_id) == 4) {
//                     object.slectedIndustry = obj.onesys_Value_Id;
//                 }

//                 if (parseInt(obj.dashboard_question_id) == 5) {
//                     object.selectedCountry = obj.onesys_Value_Id;
//                 }

//                 if (obj.question_type == 'Radio_Button' && obj.dashboard_question_id == 6) {

//                     if (parseInt(obj.numeric_Value) == 1) {
//                         //$('#' + obj.dashboard_question_id).prop('checked', true);
//                         object.showDigitalTransformationDependentQuestion = true;
//                     }
//                     else {
//                         //$('#' + obj.dashboard_question_id).prop('checked', false);
//                         object.showDigitalTransformationDependentQuestion = false;
//                     }

//                 }
//                 else if (obj.question_type == 'Radio_Button' && (parseInt(obj.dashboard_question_id) == 28)) {

//                     if (parseInt(obj.numeric_Value) == 1) {
//                         //$('#' + obj.dashboard_question_id).prop('checked', true);
//                         object.showDigitalBenefitRevenueSub = true;
//                     }
//                     else {
//                         //$('#' + obj.dashboard_question_id).prop('checked', false);
//                         object.showDigitalBenefitRevenueSub = false;
//                     }

//                 }
//                 else if (obj.question_type == 'Radio_Button' && (parseInt(obj.dashboard_question_id) == 30)) {

//                     if (parseInt(obj.numeric_Value) == 1) {
//                         //$('#' + obj.dashboard_question_id).prop('checked', true);
//                         object.showDigitalBenefitCustomerSub = true;
//                     }
//                     else {
//                         //$('#' + obj.dashboard_question_id).prop('checked', false);
//                         object.showDigitalBenefitCustomerSub = false;
//                     }

//                 }
//                 else if (obj.question_type == 'Radio_Button' && (parseInt(obj.dashboard_question_id) == 32)) {

//                     if (parseInt(obj.numeric_Value) == 1) {
//                         //$('#' + obj.dashboard_question_id).prop('checked', true);
//                         object.showDigitalBenefitOperationSub = true;
//                     }
//                     else {
//                         //$('#' + obj.dashboard_question_id).prop('checked', false);
//                         object.showDigitalBenefitOperationSub = false;
//                     }

//                 }


//             }

//         }
//     }

//     //form completion
//     object.calculateFormCompletion();


// }

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

    if ($('#' + question.dashboard_question_id + '-checkbox').is(':checked') == true) {
        question.numeric_Value = 0;
    }

}

closeEnterDataModal() {
    
    let object = this;
    // object.siblingData.changeEnterDataModalFlag(true);
    // if (object.showRestBox) {
    //     this.confirmBoxCloseFlag = true;
    // } else {
    //     // object.resetAll();
    //     $('.modal-select-to-compare-digital').modal('hide');
    // }

    object.confirmBoxCloseFlag = true;

    //this will reset entered data so that new form will be populated when user clicks on input my data and enter new scenario
    
}

resetConfirmYes(flag) {
    if (flag) {
        this.resetAll();
    }
    this.confirmBoxResetFlag = false;
}

closeConfirmYes(flag) {
    if (flag) {
        
        this.confirmBoxCloseFlag = false;
        this.resetEnterFormTabular();
    
        $('.modal-validate-survey').modal('hide');
        this.resetAll();
        
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

resetEnterFormTabular() {
    $(".collapseHeader").attr("aria-expanded", false);
    $(".collapseBody").removeClass("show");
    setTimeout(() => {
        $("#collapse-link1").attr("aria-expanded", true);
        $("#collapse1").addClass("show");
    }, 1000);
}

activateShowBox(value) {
    let object = this;
    object.showRestBox = value;

}

getQuestionList() {
    let object = this;

    //TODO.. call web service
    object.digitalSharedService.getSurveyTemplate('14').subscribe((response: any) => {

        object.surveyQuestionJSON = response;

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

                    if (obj.question_type == 'Textbox' && obj.categoryID != "36") {
                        obj.text_Value = '';
                        obj.numeric_Value = null;
                    }



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

public showDigitalBenefitRevenueSub: boolean = false;
public showDigitalBenefitCustomerSub: boolean = false;
public showDigitalBenefitOperationSub: boolean = false;

toggleDigitalBenefitsRadio(currentQuestionid) {

    let object = this;

    //find dependent question associated with current question
    for (let cnt = 0; cnt < object.surveyQuestionJSON['Digital Transformation initiatives']['Benefits of Digital Initiatives'].length; cnt++) {

        if ((parseInt(object.surveyQuestionJSON['Digital Transformation initiatives']['Benefits of Digital Initiatives'][cnt].parent_Id) == parseInt(currentQuestionid)) && parseInt(currentQuestionid) == 28) {
            if (object.showDigitalBenefitRevenueSub == false) {
                object.showDigitalBenefitRevenueSub = true;
            }
            else {
                object.showDigitalBenefitRevenueSub = false;

            }
        }
        else if ((parseInt(object.surveyQuestionJSON['Digital Transformation initiatives']['Benefits of Digital Initiatives'][cnt].parent_Id) == parseInt(currentQuestionid)) && parseInt(currentQuestionid) == 30) {
            if (object.showDigitalBenefitCustomerSub == false) {
                object.showDigitalBenefitCustomerSub = true;
            }
            else {
                object.showDigitalBenefitCustomerSub = false;

            }
        }
        else if ((parseInt(object.surveyQuestionJSON['Digital Transformation initiatives']['Benefits of Digital Initiatives'][cnt].parent_Id) == parseInt(currentQuestionid)) && parseInt(currentQuestionid) == 32) {
            if (object.showDigitalBenefitOperationSub == false) {
                object.showDigitalBenefitOperationSub = true;
            }
            else {
                object.showDigitalBenefitOperationSub = false;

            }
        }

    }
}

public showDigitalTransformationDependentQuestion: boolean = false;

toggleDigitalTransformationRadio(currentQuestionid) {
    let object = this;
    //find dependent question associated with current question
    for (let cnt = 0; cnt < object.surveyQuestionJSON['Digital Transformation initiatives']['null'].length; cnt++) {

        if (parseInt(object.surveyQuestionJSON['Digital Transformation initiatives']['null'][cnt].parent_Id) == parseInt(currentQuestionid)) {

            if (object.showDigitalTransformationDependentQuestion == false) {
                object.showDigitalTransformationDependentQuestion = true;
                //object.surveyQuestionJSON['Digital Transformation initiatives']['null'][cnt].table_id=-999;
            }
            else {
                //object.surveyQuestionJSON['Digital Transformation initiatives']['null'][cnt].table_id=4;
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
    //   

}

scenarioDataObj = [];

saveEnteredSurvey() {
    let object = this;



    let saveObj = {
        "sessionId": object.sessionId,
        "dataStatusId" : object.selectedDataStatus.id,
        "surveyId": object.surveyId //object.selectedSurvey
    }

    //integrate web service
    object.digitalSharedService.updateSurveyStatus(saveObj).subscribe((response) => {
         
         let  message = response.value;
         console.log("message after save on Validation:", message);

         //refresh a validation page once record is updated
        object.digitalSharedService.getEmitter().emit('surveyStatusUpdated');

        object.resetEnterFormTabular(); 
         
        this.toastr.info(message + "" + " " + '', '', {
            timeOut: 5000,
            positionClass: 'toast-top-center'
        });

        

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


    var questionAnswer = $('#' + question.dashboard_question_id).val();

    var oneSysValueId = null;
    var numericValue = null;
    var selectedValueId = null;
    var value = null;
    var textValue = null;


    //for revenue question, capture numeric value and onesys
    if (parseInt(question.dashboard_question_id) == 2) {
        //set onesys id based on range

        if (parseInt(questionAnswer) < 250) {
            oneSysValueId = '7D747147-41DA-42BA-92C3-A84084E696DD';
        }
        else if (parseInt(questionAnswer) >= 250 && parseInt(questionAnswer) < 500) {
            oneSysValueId = 'B4A44DB7-BD56-45CB-9C54-22583AA38219';
        }
        else if (parseInt(questionAnswer) >= 500 && parseInt(questionAnswer) < 1000) {
            oneSysValueId = '3C8EC208-A7D2-492B-8BB2-E8A98D1F8CC6';
        }
        else if (parseInt(questionAnswer) >= 1000 && parseInt(questionAnswer) < 3000) {
            oneSysValueId = 'D2767B7C-F1B1-480E-8F26-447710351D7A';
        }
        else if (parseInt(questionAnswer) >= 3000 && parseInt(questionAnswer) < 5000) {
            oneSysValueId = '8F644EC3-E209-4E96-BFBB-96AEF70F7F9A';
        }
        else if (parseInt(questionAnswer) >= 5000 && parseInt(questionAnswer) < 10000) {
            oneSysValueId = '75CC7F98-59DE-4AB0-A2B1-719655DDD39F';
        }
        else if (parseInt(questionAnswer) >= 10000 && parseInt(questionAnswer) < 50000) {
            oneSysValueId = 'ECD2DDB5-7B22-472C-8284-573DA54F6604';
        }
        else if (parseInt(questionAnswer) >= 50000) {
            oneSysValueId = '997A3083-4A1E-4D3C-A402-C9F9243B57FD';
        }

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

                console.log('scale id: ', selectedValueId);
                console.log('scale name: ', value);
            }
            else {
                //range id
                selectedValueId = null;
                //range value
                value = null;

                console.log('scale id: ', selectedValueId);
                console.log('scale name: ', value);
            }

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
    //regular radio button
    else if (question.question_type == 'Radio_Button') {
        var groupname = +'' + question.dashboard_question_id;
        questionAnswer = $("input:radio[name=" + groupname + "]:checked").val();
        numericValue = questionAnswer;
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

    console.log('updated data JSON: ', object.surveyQuestionJSON);


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


        if ($(this).val() != '' && $(this).val() != null) {
            completedGeneralElements++;
        }

        totalGeneralElements = index + 1;

    });

    calculatedGeneralElements = completedGeneralElements / totalGeneralElements * 100;

    $('#general-q-percentage').text(Math.round(calculatedGeneralElements) + '%');

    //digital initiatives
    $(".digital-transformation-init .form-control").each(function (index) {


        if ($(this).val() != '' && $(this).val() != null) {
            completedInitiativeElements++;
        }


        totalInitiativeElements = index + 1;

    });

    calculatedInitiativeElements = (completedInitiativeElements / totalInitiativeElements * 100) + 7;

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


   
    calculatedCapabilityElements = (completedCapabilityElements / totalCapabilityElements * 100);

    $('#capabilities-percentage').text(Math.round(calculatedCapabilityElements) + '%');

    //fedback section
    $(".feedback-section .form-control").each(function (index) {

        console.log('$(this).val(): ', $(this).val());

        if ($(this).val() != '' && $(this).val() != null) {
            completedFeedbackElements++;
        }

        totalFeedbackElements = index + 1;

    });

    calculatedFeedbackElements = (completedFeedbackElements / totalFeedbackElements * 100);

    $('#feedback-percentage').text(Math.round(calculatedFeedbackElements) + '%');

    //calculate overall percentage
    totalFormElements = totalSurveyInfolElements + totalGeneralElements + totalInitiativeElements + totalCapabilityElements + totalFeedbackElements;

    completedFormElements = completedSurveyInfoElements + completedGeneralElements + completedInitiativeElements + completedCapabilityElements + completedFeedbackElements;

    calculatedFormElements = (completedFormElements / totalFormElements * 100);

    $('#overall-percentage').text(Math.round(calculatedFormElements) + '%');


}


checkthresholds(question, event) {
    if (question.value_type == '%') {

        if (Number(event.target.value) > 100) {
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


}

ngOnDestroy(){
    this.privilegesService.getEmitter().removeAllListeners();
  }

}

