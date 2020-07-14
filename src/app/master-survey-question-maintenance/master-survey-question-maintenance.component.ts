import { Component, OnInit } from '@angular/core';
import { SurveyQuestionMaintenanceService } from '../services/survey-question-maintenance/survey-question-maintenance.service'
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';
import { DatePipe } from '@angular/common';
import { templateJitUrl } from '@angular/compiler';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-master-survey-question-maintenance',
  templateUrl: './master-survey-question-maintenance.component.html',
  styleUrls: ['./master-survey-question-maintenance.component.css']
})
export class MasterSurveyQuestionMaintenanceComponent implements OnInit {

  public mappedQuestionData: any;
  public mappedQuestionWithFlagObj: any[] = [];
  public allQuestionsList: any = [];
  public dashBoardList: any[] = [];
  public selectedDashBoardItemId: any = 14;
  public dashboardDropDownLoaded: boolean = false;
  public dashBoards: any;
  private rows: any[] = [];
  private rowIndex: number;
  productForm: FormGroup;
  private rowCount: number = 0;
  public dataLoaded: boolean = false;
  private noDataPresent: boolean = false;
  public LoggedUserData: any;

  constructor(private service: SurveyQuestionMaintenanceService, private fb: FormBuilder,private loginDataBroadcastService: LoginDataBroadcastService,private toastr: ToastrService) {

  }

  ngOnInit() {
    let object = this;
    object.dataLoaded = false;
    /* Initiate the form structure */
    // this.productForm = this.fb.group({
    //   masterQuestionDataForm: this.fb.array([this.fb.group({ 
    //     description: '',
    //     operation: 'I',
    //     id: 0,
    //     question_id: 0,
    //     isMapped: false 
    // })])
    // })
    object.LoggedUserData = object.loginDataBroadcastService.get('userloginInfo');

    
    object.populateDashBoard();
    
  }

  populateDashBoard() {
    let object = this;
    object.service.getDashBoards().subscribe((response: any) => {




      object.dashBoardList = object.allowedDashBoardList(response);

      object.dashBoardList = object.dashBoardList.splice(13, 1);


      object.selectedDashBoardItemId = object.dashBoardList[0].dashboardID;//select CIO dashboard as selected default DashBoardID(only for landing page)
      // object.populateAllDropDown();
      object.fetchAllQuestions();
    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "NA",
        "pageName": "KPI Maintenance Screen",
        "errorType": "Fatal",
        "errorTitle": "Web Service Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    })
  }

  allowedDashBoardList(dashboards): any {
    let alloweddashboardList = [];
    let allowedDashBoardMap = JSON.parse(localStorage.getItem('userloginInfo')).kpiAccess;
    for (let dashboard of dashboards) {

      if (allowedDashBoardMap[dashboard.dashboardName] != undefined && allowedDashBoardMap[dashboard.dashboardName] == true) {
        alloweddashboardList.push(dashboard);
      }

    }
    return alloweddashboardList;
  }


  populateAllDropDown() {

    try {
      let object = this;
      object.dashboardDropDownLoaded = false;

      //this three service populate dropdowns async. and then after getting response they check
      object.service.getDashBoards().subscribe((response: any) => {
        object.dashBoards = object.allowedDashBoardList(response);

        //alert(JSON.stringify(object.dashBoards[13]));
        //alert(object.dashBoards[0].dashboardID);

        object.dashBoards.splice(0, 13);

        object.dashboardDropDownLoaded = true//since we have all dashboard list
        // object.notify.emit('dataLoadedSuccessFully');

      }, (error) => {
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId": "NA",
          "pageName": "KPI Maintenance Screen",
          "errorType": "Fatal",
          "errorTitle": "Web Service Error",
          "errorDescription": error.message,
          "errorObject": error
        }

        throw errorObj;
      })



    }
    catch (error) {

      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "NA",
        "pageName": "KPI Maintenance Screen",
        "errorType": "warn",
        "errorTitle": "Data Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    }

  }

  fetchAllQuestions() {

    let object = this;
    let dashboardId = object.selectedDashBoardItemId;
    /**
     * Start of code which needs to be replace
     * Replace following code once fetch webservice implemented, and assign it's response to "object.mappedQuestionWithFlagObj"
     */
    object.service.fetchQuestionDetails().subscribe((response: any) => {

      //get all question list
      object.allQuestionsList = response;

      //get already saved question records on basis of dashboard id
      object.service.retreiveData(dashboardId).subscribe((response: any) => {
        object.mappedQuestionData = response;
        //generating new array of object which contains all question with flag which will indicate whether question is mapped in digital survey question maintenance or not

        for (let i = 0; i < object.allQuestionsList.length; i++) {
          let found: boolean = false;

          for (let j = 0; j < object.mappedQuestionData.length; j++) { // j < is missed;
            if (object.allQuestionsList[i].question_Id == object.mappedQuestionData[j].question_Id) {
              found = true;
              object.addMappedData(true, object.allQuestionsList[i]);
              break;
            }
          }
          if (found == false) {
            object.addMappedData(false, object.allQuestionsList[i]);
          }
        }


        let count = object.mappedQuestionWithFlagObj.length;

        if(count==0)
        {
          object.noDataPresent = true;
          object.initForm();
        }
        else
        {
          object.noDataPresent = false;
        object.initForm();
        let index = 0;
        while (index < count) {
          object.masterQuestionData.push(this.fb.group({
            description: object.mappedQuestionWithFlagObj[index].question_Display_Text,
            table_Id: object.mappedQuestionWithFlagObj[index].table_Id,
            operation: 'U',
            id: 0,
            question_id: object.mappedQuestionWithFlagObj[index].question_Id,
            isMapped: object.mappedQuestionWithFlagObj[index].isMapped
          }));
          let row: any = {};
          row.selectedStatus = 'U';
          row.description = object.mappedQuestionWithFlagObj[index].question_Display_Text;
          row.table_Id = object.mappedQuestionWithFlagObj[index].table_Id;
          row.isMapped = object.mappedQuestionWithFlagObj[index].isMapped;
          object.rows[++object.rowIndex] = row;
          
          object.rowCount++;
          index++;
        }
        
        
      }
        object.dataLoaded = true;
      });
    });
    /** of code which needs to be replace */

  }

  //generating new array of object which contains all question with flag which will indicate whether question is mapped in digital survey question maintenance or not
  addMappedData(flag, obj) {
    let object = this;
    let temp = {
      question_Id: '',
      question_Display_Text: "",
      table_Id: "",
      isMapped: false
    }
    temp.question_Id = obj.question_Id;
    temp.question_Display_Text = obj.question_Display_Text;
    temp.table_Id = obj.table_Id;
    if (flag) {
      temp.isMapped = true;
    } else {
      temp.isMapped = false;
    }
    object.mappedQuestionWithFlagObj.push(temp);
  }


  saveData() {
    //save or update the question list

    let object = this;

    try {
      let object = this;
   
      let request: any = {
        "dashboardId" : object.selectedDashBoardItemId,
        "digitalNewQuestionsList" : []
      };
  
      let data = object.productForm.value.masterQuestionDataForm;

      //let datePipe=new DatePipe('en-US');
      
      //let todaydate=datePipe.transform(new Date(),'dd/MM/yyyy');
      

        let index = 0;
        
       //making neccessary changes in forms row,like parse to int,appending null instead of NA in each row etc etc
       for (let y of data) {
        let temp = {
          "description" : y.description,
          "dashboardQuestionId" : y.question_id,
          "tableId" : null,
          "createdBy" : null,
          "modifiedBy" : object.LoggedUserData.userDetails.emailId,
          "modifiedDate" : null,
          "createdDate" : null,
          "operation" : y.operation

        };

        if (!(index == 0 && (!object.noDataPresent))) {
          request.digitalNewQuestionsList.push(temp);
        }

        index++;

       }

       

       object.service.editSurveyQuestions(request).subscribe((response) => {
        
       
        this.toastr.info('Data Saved Successfully', '', { timeOut: 1500, positionClass: 'toast-top-center' });
        
      

      }, (error) => {
        
        this.toastr.error('Some unexpected Error have occurred', '', { timeOut: 2000, positionClass: 'toast-top-center' });
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId": "NA",
          "pageName": "KPI Maintenance Screen",
          "errorType": "fatal",
          "errorTitle": "Web Service Error",
          "errorDescription": error.message,
          "errorObject": error
        }

        throw errorObj;
      })




    }
    catch (error) {

      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "NA",
        "pageName": "KPI Maintenance Screen",
        "errorType": "warn",
        "errorTitle": "Data Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    }

  }

  deleteData(pointIndex) {
    let object =this;
   
    let request: any = {
      "dashboardId" : object.selectedDashBoardItemId,
      "digitalNewQuestionsList" : []
    };

    if(object.productForm.value.masterQuestionDataForm[pointIndex].question_id < 1){
      //it will delete blank row which is not saved 
      object.masterQuestionData.removeAt(pointIndex);
    }else{
      //it will delete unmapped question permenantly from db
      let data = object.productForm.value.masterQuestionDataForm;
      object.productForm.value.masterQuestionDataForm[pointIndex].operation = 'D';
      let index = 0;
     for (let y of data) {
      let temp = {
        "description" : y.description,
        "dashboardQuestionId" : y.question_id,
        "tableId" : y.table_Id,
        "createdBy" : null,
        "modifiedBy" : null,
        "modifiedDate" : null,
        "createdDate" : null,
        "operation" : y.operation
  
      };
  
      if (!(index == 0)) {
        request.digitalNewQuestionsList.push(temp);
      }
      index++;
     }
      //call webservice for hard delete
    }
    
  }

  get masterQuestionData() {
    return this.productForm.get('masterQuestionDataForm') as FormArray;
  }

  //invoked on adding new row
  addData() {
    try {
      this.masterQuestionData.push(this.fb.group({
        description: ['', Validators.required],
        operation: 'I',
        id: 0,
        question_id: 0,
        isMapped: false
      }));
      let object = this;


      let row: any = {};
      row.description = "";
      row.isMapped = false;
      row.selectedStatus = 'I'//default selectedStatus;
      object.rows[++object.rowIndex] = row;

      object.rowCount++;

    }
    catch (error) {

      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "NA",
        "pageName": "KPI Maintenance Screen",
        "errorType": "warn",
        "errorTitle": "Data Error",
        "errorDescription": error.message,
        "errorObject": error
      }

      throw errorObj;
    }

  }
 //for initForm
 initForm() {

  try {
    let object = this;
    this.productForm = this.fb.group({
      masterQuestionDataForm: this.fb.array([this.fb.group({
        description: "",
        table_Id: 0,
        isMapped: true,
        operation: 'I',
        id: 0,
        question_id:0
      })])
    })


    let row: any = {};
    object.rowIndex = 0;
    row.description = "";
    row.table_Id="";
    row.isMapped = "";
    row.selectedStatus = 'I';
    object.rows[object.rowIndex] = row;
    object.rowCount++;

  } catch (error) {

    //throw custom exception to global error handler
    //create error object
    let errorObj = {
      "dashboardId": "NA",
      "pageName": "KPI Maintenance Screen",
      "errorType": "warn",
      "errorTitle": "Data Error",
      "errorDescription": error.message,
      "errorObject": error
    }

    throw errorObj;
  }
}




}
