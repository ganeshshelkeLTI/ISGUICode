import { Component, OnInit } from '@angular/core';
import { SurveyQuestionMaintenanceService } from '../services/survey-question-maintenance/survey-question-maintenance.service'
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

import { KpiMaintenanceService } from '../services/kpi-maintenance.service';
import { EventEmitter } from 'events';
import { ToastrService } from 'ngx-toastr';

import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-survey-question-maintenance',
  templateUrl: './survey-question-maintenance.component.html',
  styleUrls: ['./survey-question-maintenance.component.css']
})
export class SurveyQuestionMaintenanceComponent implements OnInit {

  public dataLoaded: boolean = false;
  private visibilityStatus: boolean = true;
  private rows: any[] = [];
  private rowIndex: number;
  private dashBoards: any[] = [];
  private kpiData: any[] = [];
  private category: any[] = [];
  private subCategory: any[] = [];
  private rowCount: number = 0;
  private dashBoardList: any[] = [];
  private selectedDashBoardItemId: any;//this is for select tag above rows
  // private dashBoardDropDownLoaded:boolean;
  submitted = false;
  private notify: EventEmitter = new EventEmitter();//this is event Emitter emitted on
  temp;
  private noDataPresend: boolean = false;
  private rowsDeleted = [];//keeping a record of deleted row
  //this is done because when we delete a row,it gets hidden "It is not deleted at that time"
  //we will keep a record of rows that are deleted and will delete them after getting response from form

  //the below three properties will check if three dropdown are loaded for lazy loading
  private dashboardDropDownLoaded: boolean;
  private kpiDropDownLoaded: boolean;
  private categoryDropDownLoaded: boolean;
  public InputTypeDropDownLoaded: boolean;
  private enableSave: boolean;
  public inputTypeList: any;

  public allQuestionsList: any = [];

  productForm: FormGroup;


  constructor(private service: SurveyQuestionMaintenanceService,
    private fb: FormBuilder,
    private toastr: ToastrService) {

  }

  ngOnInit() {

    let object = this;
    object.dataLoaded = false;
    object.enableSave = true;
    //populateDashBoard will populate select tag above all rows*
    object.populateDashBoard();

    object.notify.on('dataLoadedSuccessFully', function () {

      //populate rows if you have populated all three dropdowns
      if (object.InputTypeDropDownLoaded&&object.dashboardDropDownLoaded && object.categoryDropDownLoaded && object.kpiDropDownLoaded) {

        object.fetchData(object.selectedDashBoardItemId);
      }

    });


  }

  //this will populate above row select tag*
  populateDashBoard() {
    let object = this;
    object.service.getDashBoards().subscribe((response: any) => {




      object.dashBoardList = object.allowedDashBoardList(response);
      //console.log('object.dashBoardList', object.dashBoardList);

      //for(let cnt = 0 ; cnt<object.dashBoardList.length; cnt++)
      //{
      //if(object.dashBoardList[cnt].dashboardID<14)
      //{
      object.dashBoardList = object.dashBoardList.splice(13, 1);
      //alert(JSON.stringify(object.dashBoardList));
      //}
      //}

      object.selectedDashBoardItemId = object.dashBoardList[0].dashboardID;//select CIO dashboard as selected default DashBoardID(only for landing page)
      object.populateAllDropDown();//after population above dashboard dropdown,populate other dropdown


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

  //these all function will lazy load all drop down data
  populateAllDropDown() {

    try {
      let object = this;
      object.dashboardDropDownLoaded = false;
      object.kpiDropDownLoaded = false;
      object.categoryDropDownLoaded = false;
      object.InputTypeDropDownLoaded=false;

      //this three service populate dropdowns async. and then after getting response they check
      object.service.getDashBoards().subscribe((response: any) => {
        object.dashBoards = object.allowedDashBoardList(response);

        //alert(JSON.stringify(object.dashBoards[13]));
        //alert(object.dashBoards[0].dashboardID);

        object.dashBoards.splice(0, 13);

        object.dashboardDropDownLoaded = true//since we have all dashboard list
        object.notify.emit('dataLoadedSuccessFully');

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

      // //digital dashboard columns
      // object.service.getDashBoardData(object.selectedDashBoardItemId).subscribe((response: any) => {

      //   console.log('data: ',response);

      // },(error)=>{
      //   //throw custom exception to global error handler
      //   //create error object
      //   let errorObj = {
      //     "dashboardId" : "NA",
      //     "pageName" : "KPI Maintenance Screen",
      //     "errorType" : "Fatal",
      //     "errorTitle" : "Web Service Error",
      //     "errorDescription" : error.message,
      //     "errorObject" : error 
      //   }

      //   throw errorObj; 
      // })

      object.service.getKpiGroup(object.selectedDashBoardItemId).subscribe((response: any) => {

        console.log('kpi data: ',response);
        object.kpiData = response;
        object.kpiDropDownLoaded = true;//since we have loaded kpi
        object.notify.emit('dataLoadedSuccessFully');

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

      //category      
      object.service.getCategory(object.selectedDashBoardItemId).subscribe((response: any) => {
        object.category = response;
        object.categoryDropDownLoaded = true;//same as above
        object.notify.emit('dataLoadedSuccessFully');

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

      //input type 
      object.service.getInputType().subscribe((response: any) => {
        object.inputTypeList = response;
        console.log('Input type list: ',object.inputTypeList);
        object.InputTypeDropDownLoaded = true;//same as above
        object.notify.emit('dataLoadedSuccessFully');

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

  //functions
  updateKpidata() {
    let object = this;

    object.populateAllDropDown();

  }

  get dataPoints() {
    return this.productForm.get('kpi_maintenance_data') as FormArray;
  }

  //invoked on adding new row
  addData() {

    //remove already used question record
    // for(let cnt=0;cnt<this.allQuestionsList.length;cnt++)
    // {
    //   for(let i =0;i<this.rows.length;i++)
    //   {
    //     if(this.rows[i].selectedQuestion==this.allQuestionsList[cnt]['question_Id'])
    //     {
    //       console.log('existing used question: ',this.allQuestionsList[cnt]);
    //       //remove question from list
    //       this.allQuestionsList = this.allQuestionsList.splice(cnt,1);
    //     }
    //   }
    // }

    try {
      this.dataPoints.push(this.fb.group({
        dashboard_id: ['1', Validators.required],
        src_code: ['', Validators.required],
        desc: ['', Validators.required],
        short_desc: '',
        input_type: ['', Validators.required],
        input_value: ['', Validators.required],
        any_dependent_question: ['', Validators.required],
        any_sub_question: ['', Validators.required],
        mapped_kpi_group: [[], Validators.required],
        category: [[], Validators.required],
        sub_category: [[], Validators.required],
        is_visible: 1,
        operation: 'I',
        id: 0,
        question_id:0,
        dependentOnQuestion : 0,
        subQuestionOf:0

      }));
      let object = this;


      let row: any = {};
      row.selectedSubCategory = "NA";
      row.category = object.category;//populating lazy loaded category
      row.subCategory = [];//since sub-category depends on selected category
      row.dashboards = object.dashBoards;//populating lazy loaded dashboards
      row.desc = object.allQuestionsList;
      row.input_type = object.inputTypeList;
      row.selectedInputType = object.inputTypeList[0]['id'];
      row.kpidata = object.kpiData;//populating lazy loaded kpi data
      row.selectedKpi = row.kpidata.length === 0 ? undefined : object.kpiData[0].kpiGroupID;
      row.selectedCategory = object.category.length === 0 ? undefined : object.category[0].categoryID;//default category
      row.selectedQuestion = parseInt(object.allQuestionsList[0]['question_Id']);
      row.dependentParentId=0;
      row.subQuestionParentId=0;
      row.questionId = object.allQuestionsList[0]['question_Id'];
      row.selectedDashBoardId = object.selectedDashBoardItemId;//current select DashBoard
      row.selectedStatus = 'I'//default selectedStatus
      row.isHidden = false;
      row.selectedDependentQuestion = "N";
      row.selectedSubQuestion = "N";
      row.selectedInputValue = "#";//default value is number
      row.showEye = true;
      object.rows[++object.rowIndex] = row;
      // object.updateDashBoard(object.rowIndex);

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

  //on delete click,
  //Please be aware it wont delete row ,it will just hide it
  deleteData(index) {
    //console.log(index);
    try {
      let object = this;
      object.rows[index].selectedStatus = 'D';
      object.rows[index].isHidden = true;//hide

      object.dataPoints.at(index).clearAsyncValidators();
      object.dataPoints.at(index).clearValidators();
      object.dataPoints.at(index).markAsPristine();
      //console.log(object.rows[index]);
      //object.dataPoints.at(index).clearValidators();
      object.dataPoints.at(index).get('src_code').clearValidators();
      object.dataPoints.at(index).get('src_code').updateValueAndValidity();

      object.dataPoints.at(index).get('desc').clearValidators();
      object.dataPoints.at(index).get('desc').updateValueAndValidity();

      object.dataPoints.at(index).get('input_type').clearValidators();
      object.dataPoints.at(index).get('input_type').updateValueAndValidity();

      object.dataPoints.at(index).get('input_value').clearValidators();
      object.dataPoints.at(index).get('input_value').updateValueAndValidity();


      //object.dataPoints.at(index).updateValueAndValidity();
      //console.log(object.dataPoints.at(index));
      //object.dataPoints.removeAt(index);
      //console.log(row);
      object.rowsDeleted.push(index);
    }
    catch (error) {
      //console.log(error);
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

  //sending all row data from forms to server
  saveData(): void {

    console.log('in save', this.productForm);

    try {
      let object = this;
      object.enableSave = false;

      this.submitted = true;
      // if (this.productForm.invalid) {//if form is invalid then we wont be sending rows to server,applying validation here

      //   object.enableSave = true;
      //   object.toastr.warning('Please Enter the required Fields', '', { timeOut: 1000 })
      //   return;

      // }

      console.log('valid for for save');

      let request: any = {};
      // response.logged_In_user = "E5E8339B-0620-4377-82FE-0008029EDC53";//subject to change
      //request.sessionId = JSON.parse(localStorage.getItem('userloginInfo')).userDetails.sessionId;
      //request.dashboard_id = parseInt(object.selectedDashBoardItemId);

      let data = object.productForm.value.kpi_maintenance_data;

      console.log('data for saving :', data);

      let index = 0;
      let array = [];
      //making neccessary changes in forms row,like parse to int,appending null instead of NA in each row etc etc
      for (let y of data) {
        y.category = parseInt(y.category);
        y.dashboard_id = parseInt(y.dashboard_id);
        if (y.sub_category == "NA" || y.sub_category == null){
           y.sub_category = null;
        }
        else
          y.sub_category = parseInt(y.sub_category);

        if (y.mapped_kpi_group == "NA") y.mapped_kpi_group = null;
        if (y.is_visible === true) y.is_visible = 1;
        if (y.is_visible === false) y.is_visible = 0;


        if (!(index == 0 && (!object.noDataPresend))) {
          array.push(y);
        }



        index++;
      }
      //request.kpi_maintenance_data = array;

       console.log('request object for WS: ',array);   
      //finally sending rows to server
      object.service.saveSurveyQuestionData(array).subscribe((response) => {
        object.enableSave = true;
        console.log('save response: ',response);
        this.toastr.info('Data Saved Successfully', '', { timeOut: 1500 });
        object.populateAllDropDown();//re-populating all rows again


      }, (error) => {
        object.enableSave = true;
        this.toastr.error('Some unexpected Error have occurred', '', { timeOut: 2000 });
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

  //the below two function will be invoked when user click on row's dashboard select tag

  //call on click of dasboard dropdown(select) row*
  updateCategory(rowIndex) {

    try {
      let object = this;
      if(object.rows[rowIndex].selectedStatus!='I')
      {
        object.rows[rowIndex].selectedStatus = 'U';
      } 

      let dashBoradId = object.rows[rowIndex].selectedDashBoardId;

      object.service.getCategory(dashBoradId).subscribe((response) => {


        object.rows[rowIndex].category = response;


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
      });

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

  //call on click of category dropdown(select) row*
  updateSubCategory(rowIndex) {
    try {
      let object = this;
      
      if(object.rows[rowIndex].selectedStatus!='I')
      {
        object.rows[rowIndex].selectedStatus = 'U';
      }
      

      let categoryId = object.rows[rowIndex].selectedCategory;
      object.service.getSubCategory(categoryId).subscribe((response) => {


        object.rows[rowIndex].subCategory = response;


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
      });
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

  createDynmicRow(): any {

  }

  //this will be populate
  fetchData(dashBoardId) {

    try {
      let object = this;

      //get question details
      object.service.fetchQuestionDetails().subscribe((response: any) => {

        //get question list
        object.allQuestionsList = response;

        //get already saved question records on basis of dashboard id
        object.service.retreiveData(dashBoardId).subscribe((response: any) => {


          console.log('response data fetched: ', response);

          let count = response.length;

         console.log('fetched number of rows: ',count);

          if (count == 0) {
            object.noDataPresend = true;
            object.initForm();
          } else {
            object.noDataPresend = false;
            object.initForm();

            let index = 0;


            while (index < count) {
              object.dataPoints.push(this.fb.group({
                dashboard_id: response[index].dashboard_Id,
                desc: object.allQuestionsList,
                input_type: response[index].question_type_id,
                input_value: response[index].value_type,
                any_sub_question: response[index].has_SubQuestion,
                any_dependent_question: response[index].has_Dependent,
                mapped_kpi_group: [],
                category: [],
                sub_category: [],
                is_visible: response[index].active,
                operation: 'U',
                id: 0,
                question_id: response[index].dashboard_Question_Id,
                dependentOnQuestion : 0,
                subQuestionOf: 0


               }));
               let row: any = {};

              row.is_visible = response[index] == 1 ? true : false;
              //console.log('row.is_visible: ',row.is_visible);
              row.selectedSubCategory = response[index].survey_Sub_Category_Id == null ? "NA" : response[index].survey_Sub_Category_Id;
              //console.log('row.selectedSubCategory: ',row.selectedSubCategory);
              row.selectedKpi = response[index].dashboard_Id;
              var rowQuestionid = response[index].dashboard_Question_Id-1;
              row.selectedQuestion = parseInt(object.allQuestionsList[rowQuestionid]['question_Id']);
              console.log('row.selectedQuestion: ',row.selectedQuestion);
              row.dashboards = object.dashBoards;
              //console.log('row.dashboards: ',row.dashboards);
              row.desc = object.allQuestionsList;
              row.input_type = object.inputTypeList;
              var questionInputType = response[index].question_type_id -1;
              //console.log('questionInputType', questionInputType);
              row.selectedInputType = object.inputTypeList[questionInputType]['id'];
              //console.log('input type list: ',object.inputTypeList);
              row.selectedDependentQuestion = response[index].has_Dependent == 0 ? "N" : "Y";
              //console.log('row.selectedDependentQuestion: ',row.selectedDependentQuestion);
              row.selectedSubQuestion = response[index].has_SubQuestion == 0 ? "N" : "Y";
              //console.log('row.selectedSubQuestion: ',row.selectedSubQuestion);
              row.category = [];
              row.subCategory = [];
              row.inputType = [];
              row.kpidata = object.kpiData;//populating lazy loaded kpi data
              //var kpiid = response[index].kpiGroupId;
              for(let kpiid = 0 ;kpiid<object.kpiData.length;kpiid++)
              {
                if(response[index].kpiGroupId==object.kpiData[kpiid].kpiGroupID)
                {
                  row.selectedKpi = response[index].kpiGroupId;
                }
              }
              row.dependentOnQuestion = response[index].is_Dependent== '1' ? response[index].parent_Id: 0;
              row.subQuestionParentId =response[index].is_SubQuestion== '1' ? response[index].parent_Id : 0;
              row.dependentParentId = response[index].is_Dependent== '1' ? response[index].parent_Id : 0;
              console.log('row.dependentOnQuestion: ',row.dependentOnQuestion);
              
              row.subQuestionOf = response[index].is_SubQuestion== '1' ? response[index].parent_Id : 0;
              console.log('row.subQuestionOf: ',row.subQuestionOf);
              row.selectedDashBoardId = response[index].dashboard_Id;
              //console.log('row.selectedDashBoardId: ',row.selectedDashBoardId);
              row.selectedCategory = response[index].survey_Category_Id == null ? "NA" : response[index].survey_Category_Id;
              //console.log('row.selectedCategory: ',row.selectedCategory);
              row.selectedInputValue = response[index].value_type;
              //console.log('row.selectedInputValue: ',row.selectedInputValue);
              row.showEye = response[index].active === 0 ? false : true;
              //console.log('row.showEye: ',row.showEye);
              row.selectedSubCategory = response[index].survey_Sub_Category_Id == null ? "NA" : response[index].survey_Sub_Category_Id;
              //console.log('row.selectedSubCategory: ',row.selectedSubCategory);
              row.isHidden = false;
              //console.log('row.isHidden: ',row.isHidden);
              row.selectedStatus = 'U';
              //console.log('row.selectedStatus: ',row.selectedStatus);

              //row.selectedKpi = '';
              object.getCategory(row, response[index].survey_Category_Id);
              //object.getKpiData(row, response[index].dashboard_id);

              // if (response[index].category != null)
              object.getSubCategory(row, response[index].survey_Category_Id);
              //object.getDashBoard(row);
              object.rows[++object.rowIndex] = row;
              object.rowCount++;


              index++;
            }

            //header update for subqestion and dependent question TH
            //let subQuestionHeader:boolean=false;
            //let dependentQuestionHeader:boolean=false;
            for ( let row =0;row<object.rows.length; row++)
            {
                if(object.rows[row].selectedDependentQuestion=='Y')
                {
                  object.showDependentQuestionRow=true;
                }
                if(object.rows[row].selectedSubQuestion=='Y')
                {
                  object.showSubQuestionRow=true;
                }
            }


          }

          console.log('datapoints: ',object.dataPoints);

          object.dataLoaded = true;

          object.enableSave = true;

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
      });


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

  //this will be invoked when user will change dashboard value,this function will
  //update/populate Kpi select tag on basis of selected dashboard
  updateKpi(pointIndex) {

    try {
      let object = this;
      if(object.rows[pointIndex].selectedStatus!='I')
      {
        object.rows[pointIndex].selectedStatus = 'U';
      }
      

      let kpiId = object.rows[pointIndex].selectedDashBoardId;
      object.service.getKpiGroup(kpiId).subscribe((response) => {

        object.rows[pointIndex].kpidata = response;


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
      });
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

  updateDashBoard(rowIndex) {

    try {
      let object = this;
      object.service.getDashBoards().subscribe((response: any) => {

        object.rows[rowIndex].dashboards = response;
        object.rows[rowIndex].selectedDashBoardId = response[0].dashboardID;


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


  //for initForm
  initForm() {

    try {
      let object = this;
      this.productForm = this.fb.group({
        kpi_maintenance_data: this.fb.array([this.fb.group({
          dashboard_id: object.selectedDashBoardItemId,
          desc: [],
          input_type: [],
          input_value: [],
          any_dependent_question: '',
          any_sub_question: '',
          mapped_kpi_group: [],
          category: [],
          sub_category: [],
          is_visible: 1,
          operation: 'I',
          id: 0,
          question_id:0,
          dependentOnQuestion : 0,
          subQuestionOf:0
        })])
      })


      let row: any = {};
      object.rowIndex = 0;

      console.log('current question id: ',object.allQuestionsList[object.rowIndex]['question_Id']);
      
      row.selectedDashBoardId = undefined;
      //row.selectedKpi = undefined;
      row.selectedQuestion = parseInt(object.allQuestionsList[object.rowIndex]['question_Id']);
      row.dependentParentId=0;
      row.subQuestionParentId=0;
      row.questionId = object.allQuestionsList[object.rowIndex]['question_Id'];
      row.desc = object.allQuestionsList;
      row.input_type = object.inputTypeList;
      row.selectedInputType = object.inputTypeList[object.rowIndex]['id'];
      row.selectedInputValue = "#";
      row.selectedDependentQuestion = 'N';
      row.selectedSubQuestion = 'N';
      row.selectedCategory = "NA";
      row.selectedSubCategory = "NA";
      row.kpidata = object.kpiData;
      row.selectedKpi = '';
      row.dashboards = object.dashBoards;
      row.selectedDashBoardId = "NA";
      row.inputType = [];
      row.category = [];
      row.subCategory = [];
      row.isHidden = false;
      row.selectedStatus = 'I';
      row.showEye = true;
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

  //tested:ok,invoked on populating row getCategory ,getKpiData,getCategory will return data already loaded
  getDashBoard(row) {
    let object = this;
    row.dashboards = object.dashBoards;

  }

  getKpiData(row, kpiId) {
    let object = this;
    row.kpidata = object.kpiData;
  }

  getCategory(row, categoryId) {
    let object = this;
    row.category = object.category;
  }

  //since subcategory depends upon category id,so we have to hit service for every row to populate for subcategory select tag
  getSubCategory(row, subCategoryId) {
    let object = this;
    object.service.getSubCategory(subCategoryId).subscribe((response: any) => {

      if (response.length == 0) {
        row.selectedSubCategory = "NA";
        row.subCategory = [];
      } else
        row.subCategory = response;
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



  //this will update RowStatus of each row on ,please refer component html
  updateRowStatus(rowIndex) {
    let object = this;

    (object.rows[rowIndex].selectedStatus!='I')
    {
      object.rows[rowIndex].selectedStatus = 'U';
    }
    

  }

  public showDependentQuestionRow: boolean = false;


  toggleDependentQuestionRow() {
    let object = this;
    object.showDependentQuestionRow = !object.showDependentQuestionRow;

  }

  public showSubQuestionRow: boolean = false;

  toggleSubQuestionRow() {
    let object = this;
    object.showSubQuestionRow = !object.showSubQuestionRow;
  }

  changeRowVisibility(rowIndex) {
    let object = this;
    object.rows[rowIndex].showEye = !object.rows[rowIndex].showEye;
  }

  setParentDependeny(currentQuestionId)
  {
    let object = this;

    //this is same functionality as add row
    //difference is this only gets called in case of adding new row for dependent question

    try {
      this.dataPoints.push(this.fb.group({
        dashboard_id: ['1', Validators.required],
        src_code: ['', Validators.required],
        desc: ['', Validators.required],
        short_desc: '',
        input_type: ['', Validators.required],
        input_value: ['', Validators.required],
        any_dependent_question: ['', Validators.required],
        any_sub_question: ['', Validators.required],
        mapped_kpi_group: [[], Validators.required],
        category: [[], Validators.required],
        sub_category: [[], Validators.required],
        is_visible: 1,
        operation: 'I',
        id: 0,
        question_id:0,
        dependentOnQuestion : 0,
        subQuestionOf:0

      }));
      let object = this;


      let row: any = {};
      row.selectedSubCategory = "NA";
      row.kpidata = object.kpiData;//populating lazy loaded kpi data
      row.category = object.category;//populating lazy loaded category
      row.subCategory = [];//since sub-category depends on selected category
      row.dashboards = object.dashBoards;//populating lazy loaded dashboards
      row.desc = object.allQuestionsList;
      row.input_type = object.inputTypeList;
      row.selectedInputType = object.inputTypeList[0]['id'];
      row.selectedKpi = row.kpidata.length === 0 ? undefined : object.kpiData[0].kpiGroupID;
      row.selectedCategory = object.category.length === 0 ? undefined : object.category[0].categoryID;//default category
      row.selectedQuestion = parseInt(object.allQuestionsList[0]['question_Id']);
      row.dependentParentId=currentQuestionId;
      row.subQuestionParentId=0;
      row.questionId = object.allQuestionsList[0]['question_Id'];
      row.selectedDashBoardId = object.selectedDashBoardItemId;//current select DashBoard
      row.selectedStatus = 'I'//default selectedStatus
      row.isHidden = false;
      row.selectedDependentQuestion = "N";
      row.selectedSubQuestion = "N";
      row.selectedInputValue = "#";//default value is number
      row.showEye = true;
      row.dependentOnQuestion = currentQuestionId;
      row.subQuestionOf = 0;
      row.selected
      object.rows[++object.rowIndex] = row;
      // object.updateDashBoard(object.rowIndex);

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

  setSubQuestionParentDependency(currentQuestionId)
  {
    let object = this;

    //this is same functionality as add row
    //difference is this only gets called in case of adding new row for dependent question

    try {
      this.dataPoints.push(this.fb.group({
        dashboard_id: ['1', Validators.required],
        src_code: ['', Validators.required],
        desc: ['', Validators.required],
        short_desc: '',
        input_type: ['', Validators.required],
        input_value: ['', Validators.required],
        any_dependent_question: ['', Validators.required],
        any_sub_question: ['', Validators.required],
        mapped_kpi_group: [[], Validators.required],
        category: [[], Validators.required],
        sub_category: [[], Validators.required],
        is_visible: 1,
        operation: 'I',
        id: 0,
        question_id:0,
        dependentOnQuestion : 0,
        subQuestionOf:0

      }));
      let object = this;


      let row: any = {};
      row.selectedSubCategory = "NA";
      row.kpidata = object.kpiData;//populating lazy loaded kpi data
      row.category = object.category;//populating lazy loaded category
      row.subCategory = [];//since sub-category depends on selected category
      row.dashboards = object.dashBoards;//populating lazy loaded dashboards
      row.desc = object.allQuestionsList;
      row.input_type = object.inputTypeList;
      row.selectedInputType = object.inputTypeList[0]['id'];
      row.selectedKpi = row.kpidata.length === 0 ? undefined : object.kpiData[0].kpiGroupID;
      row.selectedCategory = object.category.length === 0 ? undefined : object.category[0].categoryID;//default category
      row.selectedQuestion = parseInt(object.allQuestionsList[0]['question_Id']);
      row.dependentParentId=0;
      row.subQuestionParentId=currentQuestionId;
      row.questionId = object.allQuestionsList[0]['question_Id'];
      row.selectedDashBoardId = object.selectedDashBoardItemId;//current select DashBoard
      row.selectedStatus = 'I'//default selectedStatus
      row.isHidden = false;
      row.selectedDependentQuestion = "N";
      row.selectedSubQuestion = "N";
      row.selectedInputValue = "#";//default value is number
      row.showEye = true;
      row.dependentOnQuestion = 0;
      row.subQuestionOf = currentQuestionId;
      row.selected
      object.rows[++object.rowIndex] = row;
      // object.updateDashBoard(object.rowIndex);

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


}
