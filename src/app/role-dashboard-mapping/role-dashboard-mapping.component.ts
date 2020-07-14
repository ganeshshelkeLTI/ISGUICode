import { Component, OnInit } from '@angular/core';
import { RoleMasterService } from '../services/admin/role-master.service';
import { DashboardMasterService } from '../services/admin/dashboard-master.service';
import { RoleDashboardService } from '../services/admin/role-dashboard.service';
import { FeatureMasterService } from '../services/admin/feature-master.service';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
@Component({
  selector: 'app-dashboard-master',
  templateUrl: './role-dashboard-mapping.component.html',
  styleUrls: ['./role-dashboard-mapping.component.css']
})
export class RoleDashboardMappingComponent implements OnInit {
  
  allTowersData: any;
  allFeaturesData: any;
  allRoles: any;
  allDashboards: any;
  featuresMappedByRole: any;
  privilledgeData: any;
  
  private featureIDNameMa:Map<number,string>;
  private IDfeatureNameMap:Map<string,number>;
  
  
  dashboadFeatureForm: FormGroup;
  private dashBoards: any[] = [];
  private rows: any[] = [];
  private adminRows: any[] = [];
  private rowCount: number = 0;
  private rowIndex: number;
  private rowsDeleted = [];//keeping a record of deleted rows
  enableSave: boolean = false;
  
  public userdata: any;
  public emailId: string;
  public logged_In_user: string;
  
  selectedRoleId: any;
  noDataPresend:boolean = false;
  dataLoaded:boolean;
  private addedFeatureIds:any[] = [];
  
  submitted: boolean;
  public dashboardData:any = [];
  public allMappedFeatureIds:any;
  
  public selectedDashboardFeatures=[];

  public allAdminPages:any=[];
  public dashboardMappingData:any;

  public nonAdminUser:boolean=false;
  public adminPanelVisible:boolean=false; 
  public adminChecked:boolean=false;

  constructor(private roleMasterService:RoleMasterService, private dashboardMasterService :DashboardMasterService, private roleDashboardService: RoleDashboardService, private featureMasterService: FeatureMasterService, private fb: FormBuilder, private loginDataBroadcastService: LoginDataBroadcastService, private toastr: ToastrService) { 
    let object = this;
    let loginSharedData = object.loginDataBroadcastService.getEmitter();
    loginSharedData.on('setLoginData', function () {
      object.getUserLoginInfo();
    })
    
  }

  //dashboadFeatureForm: FormGroup;
  private isActive: boolean = true;
  
  ngOnInit() {
    
    let object = this;

     object.dataLoaded = false;
    object.enableSave = true;
    
    object.getUserLoginInfo();
    if(object.selectedRoleId == null  || object.selectedRoleId == undefined){
      object.selectedRoleId = 34;
    }
    object.getAllTowers();
   // object.getAllFeatures();
    object.getAllRole();
    
   
  //get admin rights panel information
  object.getAdminRecords();
  
  }

 
getAdminRecords()
{
  let object =this;

   let requesteddata = {
      "sessionId": object.logged_In_user,
      "masterType": "WebLink"
    }

  object.dashboardMasterService.getAdminData(requesteddata).subscribe( towersData => {

  object.allAdminPages = towersData;
  object.adminRows=[]; 

  let adminPage:any={};
  for(let row of object.allAdminPages.master_data)
  {
       let recordrow:any={};
       recordrow.masterId = row.masterId;
       object.adminRows.push(recordrow);
  }

  

  for(let adminrow of object.allAdminPages.master_data)
  {
      for(let row of object.adminRows){
        row[adminrow.masterName]={};
        row[adminrow.masterName].masterId=adminrow.masterId;
        row[adminrow.masterName].isChecked=false;
        row[adminrow.masterName].isDisabled=false;
        row[adminrow.masterName].createdBy = undefined;
        row[adminrow.masterName].createdDate = undefined;
        row[adminrow.masterName].modifiedBy = undefined;
        row[adminrow.masterName].modifiedDate =undefined;
        
      }
  }

    object.retrieveAdminMapping();
 
  

  });

 

}

 retrieveAdminMapping()
 {
    let object=this;

    //call web service to get prewviously saved admin configuration
     let roleId = object.selectedRoleId;
    object.roleDashboardService.retrieveAdminMapping(roleId).subscribe((response) => {

    object.dashboardMappingData = response;  
     
     for(let adminrow of object.allAdminPages.master_data)
     {

      for(let row of object.adminRows){

        for(let mappedrow of object.dashboardMappingData)
        {
             if(mappedrow.masterId==row[adminrow.masterName].masterId)
             {
                //check the checkbox
                row[adminrow.masterName].isChecked=true;

                //add created by, modfied by details
                row[adminrow.masterName].createdBy = mappedrow.createdBy;
                row[adminrow.masterName].createdDate = mappedrow.createdDate;
                row[adminrow.masterName].modifiedBy = mappedrow.modifiedBy;
                row[adminrow.masterName].modifiedDate = mappedrow.modifiedDate;

             }
        }

       
      
      }

      
     }
    
    }, (error) => {
        
        object.enableSave = true;
        this.toastr.error('Some unexpected Error have occurred', '', { timeOut: 2000 });
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId" : "NA",
          "pageName" : "role dashboard Mapping Screen",
          "errorType" : "fatal",
          "errorTitle" : "Web Service Error",
          "errorDescription" : error.message,
          "errorObject" : error
        }
        throw errorObj;
      })

 }

 

updateAdminCheckbox(rowindex, row,value,featureName){
    
   let object = this;

  // console.log('rowindex: ', rowindex); 
 //  console.log('admin rows row ', row);
  // console.log('true/false ', value);
  // console.log('admin.mastername ',object.adminRows[rowindex][featureName]);
    if(value==false){
   // row[featureName].isChecked=false;
   // console.log('unchecked ', row[featureName])
   for(let adminrow of object.allAdminPages.master_data)
   {

    for(let singlerow of object.adminRows){
      if(object.adminRows[rowindex][featureName].masterId==singlerow[adminrow.masterName].masterId)
      {
        singlerow[adminrow.masterName].isChecked=false;
      }
    }
   }


   
  
  }else{
        // row[featureName].isChecked=true;
        // console.log('checked ', row[featureName])
        for(let adminrow of object.allAdminPages.master_data)
        {

          for(let singlerow of object.adminRows){
            if(object.adminRows[rowindex][featureName].masterId==singlerow[adminrow.masterName].masterId)
            {
              singlerow[adminrow.masterName].isChecked=true;
            }
          }
        }
     }

   
  }
  

saveDashboardData()
{
    let object =this;

    
    let masterData=[];
    let tmpObj:any={};  
    let reqObj:any ={}; 
    let innerMappings=[];
   
    for(let adminrow of object.allAdminPages.master_data)
    {

      for(let row of object.adminRows){

        if(row[adminrow.masterName].isChecked==true)
        {
           
            //add values to tmp object
            innerMappings.push(row[adminrow.masterName].masterId);
        }
      
      }

      
    }

    //remove duplicates
    innerMappings = Array.from(new Set(innerMappings));

    reqObj={
      "sessionId" : object.logged_In_user,
       "mappings":[
                  {"id":''+object.selectedRoleId,
                  "operation": "U",
                  "mappings":innerMappings
                  }]   
           }

           

    //call web service to save configuration
    object.roleDashboardService.saveAdminConfiguration(reqObj).subscribe((response) => {
        object.enableSave = true;
        this.toastr.info('Data Saved Successfully', '', { timeOut: 1500 });
      }, (error) => {
        
        object.enableSave = true;
        this.toastr.error('Some unexpected Error have occurred', '', { timeOut: 2000 });
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId" : "NA",
          "pageName" : "role dashboard Mapping Screen",
          "errorType" : "fatal",
          "errorTitle" : "Web Service Error",
          "errorDescription" : error.message,
          "errorObject" : error
        }
        throw errorObj;
      })
  
}

  getRoleTowerFeatureMapping(){

    

    let object = this;
    
    let requesteddata = {
      "sessionId": object.logged_In_user,
      "id": object.selectedRoleId
    }
    //call a web service to get tower feature mapping
     object.roleDashboardService.getMappedFeaturesOfRole(requesteddata).subscribe( (mappedFeatures:any) => {
      
      
        object.resetAll();
      

    

     if(mappedFeatures!=undefined && mappedFeatures!=null && mappedFeatures.length>0)
     {
      for(let mappedFeature of mappedFeatures){

        
        for(let row of object.rows){
          
          if(row.dashboardId==mappedFeature.dashBoardId){
            object.mapRowWithFeature(row,mappedFeature)
          }
        object.getTowerFeatureByDashBoard(row);

              }
              
      }
     }
     else
     {
      for(let row of object.rows){
        object.getTowerFeatureByDashBoard(row);
      }
     }

      

     

      for(let row of object.rows)
      {
         let createdRow:any={};
        for(let mappedFeature of mappedFeatures)
        {
        
          createdRow.createdBy = mappedFeature.createdBy;
          createdRow.createdDate = mappedFeature.createdDate;
          createdRow.modifiedBy = mappedFeature.modifiedBy;
          createdRow.modifiedDate = mappedFeature.modifiedDate;

          if(mappedFeature.dashBoardId==row.dashboardId)
          {  
            row.createdRow = createdRow;
          }
        }
      }

     
     });

      //disable admin panel checkbox if user is not admin
    if(object.selectedRoleId==34)
    {
      //object.nonAdminUser=false;
    }
    else
    {
      //object.nonAdminUser=true;
      object.adminPanelVisible=false;
      object.adminChecked=false;
    }

    //get admin rights panel information
    object.getAdminRecords();

  }

  showHideAdminPanel(event)
  {
    let object=this;
    if(event==true)
    {
      //show admin panel
      object.adminPanelVisible=true;
      object.adminChecked=true;
    }
    else
    {
      //hide admin panel
      object.adminPanelVisible=false;
      object.adminChecked=false;
    }
  }
  
  getUserLoginInfo() {
    let _self = this;
    _self.userdata = _self.loginDataBroadcastService.get('userloginInfo');
    _self.emailId = _self.userdata['userDetails']['emailId'];
    _self.logged_In_user = _self.userdata['userDetails']["sessionId"];
  }
  
  get dashboardFeatureMappingPoints() {
    return this.dashboadFeatureForm.get('role_dashboard_mapping_data') as FormArray;
  }
  
  //for initForm
 
  resetAdminPanelRow(rowindex, rows, adminElement)
  {
    let object=this;

  
    for(let adminrow of object.allAdminPages.master_data)
    {

      for(let row of object.adminRows){

        if(object.adminRows[rowindex][adminElement].masterId==row[adminrow.masterName].masterId)
        {
          row[adminrow.masterName].isChecked=false;
          row[adminrow.masterName].createdBy=undefined;
          row[adminrow.masterName].createdDate=undefined;
          row[adminrow.masterName].modifiedBy=undefined;
          row[adminrow.masterName].modifiedDate=undefined;
        }
      }
    }

   

  }

  
 
  
  
  deleteData(index) {
    try{
      let object = this;
      object.rows[index].selectedStatus = 'D';
      object.rows[index].isHidden = true;
      object.rowsDeleted.push(index);
    }
    catch(error)
    {
      //throw custom exception to global error handler
			//create error object
     
		
			let errorObj = {
				"dashboardId" : "NA",
				"pageName" : "Role Dashboard Mapping Screen",
				"errorType" : "warn",
				"errorTitle" : "Data Error",
				"errorDescription" : error.message,
				"errorObject" : error
			}
			throw errorObj;
    }
  }
  
  // this is added to get all the dashboards
 

  public mapData =[]; 
  public MappingObject=[];
  
  getAllTowers(){
    let object = this;
    object.rows=[];
    object.dashboardMasterService.retreiveData().subscribe( towersData => {
      object.allTowersData = towersData;
      
     //object.rows=new Array<any>(object.allTowersData.length);

     for(let tower of object.allTowersData){
     let row:any={};
      row.dashboardId=tower.dashBoardId;
      object.rows.push(row);  
      
     }


object.getAllFeatures();

    
    });
   
  }
  
  getAllFeatures(){
    let object = this;
    
    object.featureMasterService.retreiveData().subscribe( featuresData => {
      object.allFeaturesData = featuresData;
       object.featureIDNameMa=new Map<number,string>();
       object.IDfeatureNameMap=new Map<string,number>();

      for(let feature of object.allFeaturesData){
        object.featureIDNameMa[feature.featureId]=feature.featureName;
        object.IDfeatureNameMap[feature.featureName]=feature.featureId;
        
      for(let row of object.rows){
        row[feature.featureName]={};
        row[feature.featureName].featureId=feature.featureId;
        row[feature.featureName].isChecked=false;
        row[feature.featureName].isdisabled=false;
        
      }
      
      }

this.dataLoaded=true

      object.getRoleTowerFeatureMapping();
    });
    
  }
  
  getAllRole(){
    let object = this;
    
    object.roleMasterService.retreiveData().subscribe( roleData => {
      object.allRoles = roleData;

    //disable admin panel checkbox if user is not admin
    // if(object.selectedRoleId==34)
    // {
    //   object.nonAdminUser=false;
    // }
    // else
    // {
    //   object.nonAdminUser=true;
    // }

    });
    
  }

  public towerRoleFeatureObject=[];
  
  //allMappedFeatureIds:any;
  
  
  checkBoxValue(row,value,featureName){
    
   let object = this;

   if(value==false){
row[featureName].isChecked=false;

   }else{
    row[featureName].isChecked=true;

   }
   
   

  }
  

  getTowerFeatureByDashBoard(row){

let object=this;

let requestedParam = {
  sessionId: object.logged_In_user,
  id: String(row.dashboardId)
  }
  
  //call service to fetch mapped towerFeatureIds according to dashboard
  object.roleDashboardService.findAllTowerFeatureByDashBoardId(requestedParam).subscribe( allTowerFeatures => {
  //object.allMappedFeatureIds = allTowerFeatures[0]; 
  row.featureIdList= allTowerFeatures[0].featureIdList;
  row.towerFeatureIdList= allTowerFeatures[0].towerFeatureIdList;
  
row.featureIdMap=new Map<number,number>();

for(let index=0;index<row.featureIdList.length;index++){
  row.featureIdMap[row.featureIdList[index]]=row.towerFeatureIdList[index];
  
}

    for(let feature of object.allFeaturesData)
    {
      if(!row.featureIdList.includes(feature.featureId))
      {
       
          //disable feature 
          row[feature.featureName].isDisabled=true;
        
      }
      
    }


  })
}
  
  saveData(): void{ 
  
 let object=this;

    let requestData=[];
 
    
    let towerids=[];
    //get all selected 
    let featureIds=[];
    object.rows.forEach((element)=>{

    

      for(let key in element){
     
        let id=object.IDfeatureNameMap[key];
        if(id!=undefined&&id!=null){

        if(element[key].isChecked==true){
        featureIds.push(""+element.featureIdMap[id]); 
        }
        
        }
      
      }

    });
    
   
    let requestedData={"sessionId":object.logged_In_user,
    "mappings":[
    {"id":object.selectedRoleId,
    "mappings":featureIds
    }]   
     };  
     
     object.roleDashboardService.saveAllFeatures(requestedData).subscribe((response) => {
        object.enableSave = true;
        this.toastr.info('Data Saved Successfully', '', { timeOut: 1500 });
      }, (error) => {
        
        object.enableSave = true;
        this.toastr.error('Some unexpected Error have occurred', '', { timeOut: 2000 });
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId" : "NA",
          "pageName" : "role dashboard Mapping Screen",
          "errorType" : "fatal",
          "errorTitle" : "Web Service Error",
          "errorDescription" : error.message,
          "errorObject" : error
        }
        throw errorObj;
      })  
      
    object.saveDashboardData();
    
  }

mapRowWithFeature(row,mappedFeature){
let object=this;
let featuresID=mappedFeature.featureId;

for(let id of featuresID){
 
  let featureName=object.featureIDNameMa[id];
if(featureName!=undefined&&featureName!=null){
  row[featureName].isChecked=true;
  row[featureName].isdisabled=false;
  
}

}



}

resetAll(){
let object=this;

object.rows.forEach((element)=>{

for(let feature of object.allFeaturesData ){

element[feature.featureName].isChecked=false; 

}


});

}

resetRow(row){
  let object=this;
  
for(let feature of object.allFeaturesData ){

row[feature.featureName].isChecked=false; 

row.createdRow=undefined;
}

}
}
