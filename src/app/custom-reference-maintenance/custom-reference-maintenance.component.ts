import { Component, OnInit } from '@angular/core';
import { KpiMaintenanceService } from '../services/kpi-maintenance.service';
import { CustomRefGroupService } from '../services/custom-ref-group/custom-ref-group.service';
import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';
import { ToastrService} from 'ngx-toastr';
import { TextMaskModule } from 'angular2-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';


declare var $: any;

//for decimal negative
const decimalNegativeNumberMask = createNumberMask({
  prefix: '',
  suffix: '',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ',' ,
  allowDecimal: true,
  decimalSymbol: '.',
  decimalLimit: 6,
  integerLimit: null,
  allowNegative: true,
  allowLeadingZeroes: true
});

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
  selector: 'customReferenceMaintenance',
  templateUrl: './custom-reference-maintenance.component.html',
  styleUrls: ['./custom-reference-maintenance.component.css']
})
export class CustomReferenceMaintenanceComponent implements OnInit {

  numberMask = numberMask;
  decimalNumberMask = decimalNumberMask;
  decimalNegativeNumberMask = decimalNegativeNumberMask;

  public dashboardData: any;
  public dashBoardList: any[] = [];
  public selectedDashBoardItemId: any;//this is for select tag above rows

  public mainframeDataLoaded =false;

  public customDataObject:any[] =[];

  public isSaveEnabled: boolean =true;
  public isCopyEnabled: boolean =true;
  public isDigitalTower: boolean = false;
  public isPartial: string  = "0";

  public CIOKPIGroupList=["IT Spend as a % of Revenue",
"IT Spend-Cost Breakdown",
"IT Spend Per user",
"IT Spend By Expenditure Type As a %",
"IT Spend Outsourced",
"CAPEX vs. OPEX",
"IT Run vs. IT Change vs. IT Transform - Run",
"IT Run vs. IT Change vs. IT Transform - Change",
"IT Run vs. IT Change vs. IT Transform - Transform",
"IT Personnel",
"User Experience Index",
"Digital Spend"];
  
  public maninFrameKPIGroupList=["Availability",
  "Staffing Mix Employee", 
  "Staffing Mix Contractor", 
  "Utilization",
  "Annual Cost Per Configured MIPS - Total Cost of Ownership",
  "Annual Cost Per Configured MIPS - Market Price",
  "Annual Cost Per Mainframe FTE - Employee",
  "Annual Cost Per Mainframe FTE - Contractor",
  "Number of Configured MPIS per FTE",
  "Total Mainframe Cost Allocation"];

  public storageKPIGroupList=["Storage Availability",
  "Staffing Mix Employees",
  "Staffing Mix Contractors",
  "Storage Utilization",
  "Annual Cost Per Storage FTE - Employee",
  "Annual Cost Per Storage FTE - Contractor",
  "Annual Cost Per Installed TB - Total Cost of Ownership",
  "Annual Cost Per Installed TB - Market Price",
  "Storage By Type",
  "# of Storage TBs Per FTE",
  "Storage Cost Allocation"];


  public serverKPIGroupList=["Availability",
  "Staffing Mix Employee", 
  "Staffing Mix Contractor", 
  "Annual Cost Per OS Instance - Total Cost of Ownership",
  "Annual Cost Per OS Instance - Market Price",
  "Annual Cost Per Core - Total Cost of Ownership",
  "Annual Cost Per Core - Market Price",
  "Annual Cost Per Server FTE - Employee",
  "Annual Cost Per Server FTE - Contractor",
  "Number of OS Instances per FTE",
  "Server Provisioning Time",
  "Server Cost Allocation"];

  public LANKPIGroupList=["LAN Cost Allocation",
  "Annual Cost Per Active LAN Port-Total Cost of Ownership",
  "Annual Cost Per Active LAN Port-Market Price",
  "Annual Cost Per Network FTE - Employee",
  "Annual Cost Per Network FTE - Contractor",
  "LAN Utilization",
  "LAN Availability",
  "# of Active LAN Ports Per FTE",
  "Staffing Mix - Employee",
  "Staffing Mix - Contractor",
  "Office LAN vs. DC LAN" 
];

public WANKPIGroupList=["WAN Cost Allocation",
  "Annual Cost Per Active WAN Port-Total Cost of Ownership",
  "Annual Cost Per Active WAN Port-Market Price",
  "Annual Cost Per Network FTE - Employee",
  "Annual Cost Per Network FTE - Contractor",
  "WAN Recovery Time",
  "WAN Availability",
  "# of Active WAN Locations Per FTE",
  "Staffing Mix - Employee",
  "Staffing Mix - Contractor",
  "Legacy WAN vs. SD WAN" 
];

public VoiceKPIGroupList=["Voice Cost Allocation",
  "Annual Cost Per Voice Handset-Total Cost of Ownership",
  "Annual Cost Per Voice Handset-Market Price",
  "Annual Cost Per Network FTE - Employee",
  "Annual Cost Per Network FTE - Contractor",
  "Voice Handset Provisioning Time",
  "Voice Availability",
  "# of Voice Handsets Per FTE",
  "Staffing Mix - Employee",
  "Staffing Mix - Contractor",
  "Traditional PBX vs. VoIP" 
];

public workPlaceKPIGroupList=["Workplace Services Cost Allocation",
  "Annual Cost Per Workplace Services Device-Total Cost of Ownership",
  "Annual Cost Per Workplace Services Device-Market Price",
  "Annual Cost Per Workplace Services User - Total Cost of Ownership",
  "Annual Cost Per Workplace Services User - Market Price",
  "Annual Cost Per Workplace Services FTE - Employee",
  "Annual Cost Per Workplace Services FTE - Contractor",
  "Annual Cost Per Mailbox",
  "# of Devices Per FTE",
  "Staffing Mix - Employee",
  "Staffing Mix - Contractor",
  "PC Deployment Time",
  "Incident Response Time",
  "PC Refresh Rate",
  "User Experience Score" 
];

public serviceDeskKPIGroupList=["Annual Cost Per Service Desk FTE - Employee",
  "Annual Cost Per Service Desk FTE - Contractor",
  "Offshore",
  "# of Tickets Per FTE",
  "Staffing Mix - Employees",
  "Staffing Mix - Contractors",
  "Service Desk Cost Allocation",
  "Annual Cost Per Service Desk User - Total Cost of Ownership",
  "Annual Cost Per Service Desk User - Market Price",
  "Cost Per Service Desk Ticket - Total Cost of Ownership",
  "Cost Per Service Desk Ticket - Market Price",
  "Average Speed To Answer",
  "Average Handle Time",
  "# Of Tickets Per User",
  "User Experience Score By Channel",
  "First Call Resolution %"
];

public applicationDevelopmentKPIGroupList =[
  "Application Development And Maintenance Cost Allocation",
  "Application Development And Maintenance Staffing Mix",
  "Application Development Cost Allocation",
  "Average Build Time",
  "Automated Testing %",
  "Development Methodology",
  "Annual Cost Per Application Development FTE",
  "Annual Cost Per Application Development FTE - Contractor",
  "Staffing Mix",
  "Staffing Mix Contractor",
  "Staffing Mix Managed Services",
  "offshore %",
  "On-Time Delivery %",
  "On-Budget Delivery %",
  "Application Release Rate",
  "Cost Per Hour Worked - Cost Per Hour",
  "Cost Per Hour Worked - Price Per Hour",
  "Annual Project Effort Allocation"
];

public  applicationMaintananceKPIGroupList=["Application Defect Severity %",
"OffShore %",
"Staffing Mix",
"Staffing Mix - Contractors",
"Staffing Mix - Managed Services",
"Application Maintenance Cost Allocation",
"Application Development And Maintenance Cost Allocation",
"Enhancements Per Application",
"Enhancements Completed Per Application",
"Application Development And Maintenance Staffing Mix",
"Cost Per Hour Worked - Cost Per Hour",
"Cost Per Hour Worked - Price Per Hour",
"Cost Per Support Contact",
"Defects Close Rate",
"Defects Per Application",
"Defects Per Application - Defect Closed",
"Annual Cost Per Application Maintenance FTE",
"Annual Cost Per Appllication Maintenance FTE - Contractor"
]

public digitalTowerGroupList=[
"Where Companies Have CoEs", "Benefits of Digital Initiatives", 
"Digital Spend by Category", "Employees Dedicated To Digital", 
"Company Current Digital Transformation Efforts", "Digital Spend as a % of Revenue",
"Digital Backbone","Insights","Business Model Innovation",
"Enterprise Agility formerly Digital Operating Model","Digital Ecosystems","Technologies at Scale formerly Smart Technologies",
"Digital Spend as a % of IT Spend", "Digital Spend Per Employee",
"Digital Employees as % of Company Employees" 

]
public sessionId: any;
public userdata: any;
public selectedCustomRefGroup: any;
public customReferenceGroupName: string = '';
public definition: any;
public customReferenceGroupIDs: any;
public customGroupID:any=[];

public showTabularData: boolean = false;
public tabularData: any;

public selectedDashboardName:any;

public display_confirmationbox: boolean = false;

public saveRequestObject={"dashboardId":1,
"createdBy":"",
"updatedBy":"",
"customId":"-9999",
"isPartial": "0",
"generalInformationData":[
  {"customName":"","definition":""}
],
"kpiGroupData" : []
};

  constructor(
    private service: KpiMaintenanceService,
    private crgService : CustomRefGroupService,
    private loginDataBroadcastService: LoginDataBroadcastService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

    let object = this;

    object.customReferenceGroupIDs = '';
    object.customGroupID = [];
    
    object.showTabularData = false;

    this.userdata = this.loginDataBroadcastService.get('userloginInfo');


       if(this.userdata!=null && this.userdata!=undefined)
       {
        
        this.sessionId = this.userdata['userDetails']["sessionId"];
        
       }
       else
       {
        
        this.sessionId='';
        
       }

    //populate dashboard dropdown
    object.populateDashBoard();

    object.mainframeDataLoaded =false;

    object.checkEntireFormFilled();

}

  populateDashBoard() {
    let object = this;
    object.service.getDashBoards().subscribe((response: any) => {

      object.dashBoardList = object.allowedDashBoardList(response);
      
      object.selectedDashBoardItemId = object.dashBoardList[0].dashboardID;//select CIO dashboard as selected default DashBoardID(only for landing page)

      object.crgService.setDashboardId(object.selectedDashBoardItemId);

      object.getCustomGroupRefList();
      
      object.getCRGData();

    }, (error) => {
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId": "NA",
        "pageName": "CRG page",
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

  kpiValueChange(){
    
  }

  createCIOData()
  {

  let object = this;
  object.customDataObject = [];
  //IT Spend as a % of Revenue

  

  object.groupMainframeUpperLowerKPIs(object.CIOKPIGroupList[0],
    object.dashboardData.data.ITSpendasaofCompanyRevenue.ITSpendRevUpper.ITSpendRevUpper.label,
    object.dashboardData.data.ITSpendasaofCompanyRevenue.ITSpendRevUpper.ITSpendRevUpper.value,
    object.dashboardData.data.ITSpendasaofCompanyRevenue.ITSpendRevUpper.ITSpendRevUpper.kpiCode,
    object.dashboardData.data.ITSpendasaofCompanyRevenue.ITSpendRevLower.ITSpendRevLower.label,
    object.dashboardData.data.ITSpendasaofCompanyRevenue.ITSpendRevLower.ITSpendRevLower.value,
    object.dashboardData.data.ITSpendasaofCompanyRevenue.ITSpendRevLower.ITSpendRevLower.kpiCode,
    object.dashboardData.data.ITSpendasaofCompanyRevenue.ITSpendRevMean.ITSpendRevMean.label,
    object.dashboardData.data.ITSpendasaofCompanyRevenue.ITSpendRevMean.ITSpendRevMean.value,
    object.dashboardData.data.ITSpendasaofCompanyRevenue.ITSpendRevMean.ITSpendRevMean.kpiCode);

    //IT Spend cost breakdown
    object.groupMainframeUpperLowerKPIs(object.CIOKPIGroupList[1],
      object.dashboardData.data.ITSpendCostBreakdown.Applications.Applications.label,
      object.dashboardData.data.ITSpendCostBreakdown.Applications.Applications.value,
      object.dashboardData.data.ITSpendCostBreakdown.Applications.Applications.kpiCode,
      object.dashboardData.data.ITSpendCostBreakdown.Management.Management.label,
      object.dashboardData.data.ITSpendCostBreakdown.Management.Management.value,
      object.dashboardData.data.ITSpendCostBreakdown.Management.Management.kpiCode,
      object.dashboardData.data.ITSpendCostBreakdown.Infrastructure.Infrastructure.label,
      object.dashboardData.data.ITSpendCostBreakdown.Infrastructure.Infrastructure.value,
      object.dashboardData.data.ITSpendCostBreakdown.Infrastructure.Infrastructure.kpiCode
      );


      
      //IT Spend cost breakdown infra - drilldown
      object.groupSixDrillDownElements(object.CIOKPIGroupList[1],
        'Infrastructure',
        object.dashboardData.drills.ITSpendbyFunctionInfrastructure[0].label,
        object.dashboardData.drills.ITSpendbyFunctionInfrastructure[0].value,
        object.dashboardData.drills.ITSpendbyFunctionInfrastructure[0].kpiCode,
        object.dashboardData.drills.ITSpendbyFunctionInfrastructure[1].label,
        object.dashboardData.drills.ITSpendbyFunctionInfrastructure[1].value,
        object.dashboardData.drills.ITSpendbyFunctionInfrastructure[1].kpiCode,
        object.dashboardData.drills.ITSpendbyFunctionInfrastructure[2].label,
        object.dashboardData.drills.ITSpendbyFunctionInfrastructure[2].value,
        object.dashboardData.drills.ITSpendbyFunctionInfrastructure[2].kpiCode,
        object.dashboardData.drills.ITSpendbyFunctionInfrastructure[3].label,
        object.dashboardData.drills.ITSpendbyFunctionInfrastructure[3].value,
        object.dashboardData.drills.ITSpendbyFunctionInfrastructure[3].kpiCode,
        object.dashboardData.drills.ITSpendbyFunctionInfrastructure[4].label,
        object.dashboardData.drills.ITSpendbyFunctionInfrastructure[4].value,
        object.dashboardData.drills.ITSpendbyFunctionInfrastructure[4].kpiCode
        );
        
    
        //IT Spend cost breakdown application - drilldown

        object.groupTwoDrilldownElements(object.CIOKPIGroupList[1],
        'Applications',
        object.dashboardData.drills.ITSpendbyFunctionApplications[0].label,
        object.dashboardData.drills.ITSpendbyFunctionApplications[0].value,
        object.dashboardData.drills.ITSpendbyFunctionApplications[0].kpiCode,
        object.dashboardData.drills.ITSpendbyFunctionApplications[1].label,
        object.dashboardData.drills.ITSpendbyFunctionApplications[1].value,
        object.dashboardData.drills.ITSpendbyFunctionApplications[1].kpiCode
        
      );

      //IT Spend cost breakdown management - drilldown
      object.groupTwoDrilldownElements(object.CIOKPIGroupList[1],
        'Management',
        object.dashboardData.drills.ITSpendbyFunctionManagement[0].label,
        object.dashboardData.drills.ITSpendbyFunctionManagement[0].value,
        object.dashboardData.drills.ITSpendbyFunctionManagement[0].kpiCode,
        object.dashboardData.drills.ITSpendbyFunctionManagement[1].label,
        object.dashboardData.drills.ITSpendbyFunctionManagement[1].value,
        object.dashboardData.drills.ITSpendbyFunctionManagement[1].kpiCode
        
      );


    // "IT Spend Per user"
    object.groupMainframeUpperLowerKPIs(object.CIOKPIGroupList[2],
      object.dashboardData.data.ITSpendperUser.ITSpendPerUserUpperCY.ITSpendPerUserUpperCY.label,
      object.dashboardData.data.ITSpendperUser.ITSpendPerUserUpperCY.ITSpendPerUserUpperCY.value,
      object.dashboardData.data.ITSpendperUser.ITSpendPerUserUpperCY.ITSpendPerUserUpperCY.kpiCode,
      object.dashboardData.data.ITSpendperUser.ITSpendPerUserLowerCY.ITSpendPerUserLowerCY.label,
      object.dashboardData.data.ITSpendperUser.ITSpendPerUserLowerCY.ITSpendPerUserLowerCY.value,
      object.dashboardData.data.ITSpendperUser.ITSpendPerUserLowerCY.ITSpendPerUserLowerCY.kpiCode,
      object.dashboardData.data.ITSpendperUser.ITSpendPerUserMeanCY.ITSpendPerUserMeanCY.label,
      object.dashboardData.data.ITSpendperUser.ITSpendPerUserMeanCY.ITSpendPerUserMeanCY.value,
      object.dashboardData.data.ITSpendperUser.ITSpendPerUserMeanCY.ITSpendPerUserMeanCY.kpiCode
      );

      // "IT Spend By Expenditure Type"
      object.groupFiveElements(object.CIOKPIGroupList[3],
        object.dashboardData.data.ITSpendbyExpenditureType.ITSpendPersonnel.ITSpendPersonnel.label,
        object.dashboardData.data.ITSpendbyExpenditureType.ITSpendPersonnel.ITSpendPersonnel.value,
        object.dashboardData.data.ITSpendbyExpenditureType.ITSpendPersonnel.ITSpendPersonnel.kpiCode,
        object.dashboardData.data.ITSpendbyExpenditureType.ITSpendHardware.ITSpendHardware.label,
        object.dashboardData.data.ITSpendbyExpenditureType.ITSpendHardware.ITSpendHardware.value,
        object.dashboardData.data.ITSpendbyExpenditureType.ITSpendHardware.ITSpendHardware.kpiCode,
        object.dashboardData.data.ITSpendbyExpenditureType.ITSpendSoftware.ITSpendSoftware.label,
        object.dashboardData.data.ITSpendbyExpenditureType.ITSpendSoftware.ITSpendSoftware.value,
        object.dashboardData.data.ITSpendbyExpenditureType.ITSpendSoftware.ITSpendSoftware.kpiCode,
        object.dashboardData.data.ITSpendbyExpenditureType.ItSpendOutsourced.ItSpendOutsourced.label,
        object.dashboardData.data.ITSpendbyExpenditureType.ItSpendOutsourced.ItSpendOutsourced.value,
        object.dashboardData.data.ITSpendbyExpenditureType.ItSpendOutsourced.ItSpendOutsourced.kpiCode,
        object.dashboardData.data.ITSpendbyExpenditureType.ITSpendOther.ITSpendOther.label,
        object.dashboardData.data.ITSpendbyExpenditureType.ITSpendOther.ITSpendOther.value,
        object.dashboardData.data.ITSpendbyExpenditureType.ITSpendOther.ITSpendOther.kpiCode);

        // "IT Spend Outsourced"
        object.groupMainframeUpperLowerKPIs(object.CIOKPIGroupList[4],
          object.dashboardData.data.ITSpendOutsourced.OutsourcedUpper.OutsourcedUpper.label,
          object.dashboardData.data.ITSpendOutsourced.OutsourcedUpper.OutsourcedUpper.value,
          object.dashboardData.data.ITSpendOutsourced.OutsourcedUpper.OutsourcedUpper.kpiCode,
          object.dashboardData.data.ITSpendOutsourced.OutsourcedLower.OutsourcedLower.label,
          object.dashboardData.data.ITSpendOutsourced.OutsourcedLower.OutsourcedLower.value,
          object.dashboardData.data.ITSpendOutsourced.OutsourcedLower.OutsourcedLower.kpiCode,
          object.dashboardData.data.ITSpendOutsourced.OutsourcedMean.OutsourcedMean.label,
          object.dashboardData.data.ITSpendOutsourced.OutsourcedMean.OutsourcedMean.value,
          object.dashboardData.data.ITSpendOutsourced.OutsourcedMean.OutsourcedMean.kpiCode
          );
    
          // "CAPEX vs. OPEX"
          object.groupTwoKPIs(object.CIOKPIGroupList[5],
            object.dashboardData.data.CAPEXvsOPEX.CapExMean.CapExMean.label,
          object.dashboardData.data.CAPEXvsOPEX.CapExMean.CapExMean.value,
          object.dashboardData.data.CAPEXvsOPEX.CapExMean.CapExMean.kpiCode,
          object.dashboardData.data.CAPEXvsOPEX.OpExMean.OpExMean.label,
          object.dashboardData.data.CAPEXvsOPEX.OpExMean.OpExMean.value,
          object.dashboardData.data.CAPEXvsOPEX.OpExMean.OpExMean.kpiCode
          );


          

          // "IT Run vs. IT Change vs. IT Transform - Run"
          object.groupMainframeUpperLowerKPIs(object.CIOKPIGroupList[6],
            object.dashboardData.data.ITRunvsITChangevsITTransform.RunUpper.RunUpper.label,
            object.dashboardData.data.ITRunvsITChangevsITTransform.RunUpper.RunUpper.value,
            object.dashboardData.data.ITRunvsITChangevsITTransform.RunUpper.RunUpper.kpiCode,
            object.dashboardData.data.ITRunvsITChangevsITTransform.RunLower.RunLower.label,
            object.dashboardData.data.ITRunvsITChangevsITTransform.RunLower.RunLower.value,
            object.dashboardData.data.ITRunvsITChangevsITTransform.RunLower.RunLower.kpiCode,
            object.dashboardData.data.ITRunvsITChangevsITTransform.RunMean.RunMean.label,
            object.dashboardData.data.ITRunvsITChangevsITTransform.RunMean.RunMean.value,
            object.dashboardData.data.ITRunvsITChangevsITTransform.RunMean.RunMean.kpiCode
            );
        
          // "IT Run vs. IT Change vs. IT Transform - Change",
          object.groupMainframeUpperLowerKPIs(object.CIOKPIGroupList[7],
            object.dashboardData.data.ITRunvsITChangevsITTransform.ChangeUpper.ChangeUpper.label,
            object.dashboardData.data.ITRunvsITChangevsITTransform.ChangeUpper.ChangeUpper.value,
            object.dashboardData.data.ITRunvsITChangevsITTransform.ChangeUpper.ChangeUpper.kpiCode,
            object.dashboardData.data.ITRunvsITChangevsITTransform.ChangeLower.ChangeLower.label,
            object.dashboardData.data.ITRunvsITChangevsITTransform.ChangeLower.ChangeLower.value,
            object.dashboardData.data.ITRunvsITChangevsITTransform.ChangeLower.ChangeLower.kpiCode,
            object.dashboardData.data.ITRunvsITChangevsITTransform.ChangeMean.ChangeMean.label,
            object.dashboardData.data.ITRunvsITChangevsITTransform.ChangeMean.ChangeMean.value,
            object.dashboardData.data.ITRunvsITChangevsITTransform.ChangeMean.ChangeMean.kpiCode
            );

            // "IT Run vs. IT Change vs. IT Transform - Transform",
          object.groupMainframeUpperLowerKPIs(object.CIOKPIGroupList[8],
            object.dashboardData.data.ITRunvsITChangevsITTransform.TransformUpper.TransformUpper.label,
            object.dashboardData.data.ITRunvsITChangevsITTransform.TransformUpper.TransformUpper.value,
            object.dashboardData.data.ITRunvsITChangevsITTransform.TransformUpper.TransformUpper.kpiCode,
            object.dashboardData.data.ITRunvsITChangevsITTransform.TransformLower.TransformLower.label,
            object.dashboardData.data.ITRunvsITChangevsITTransform.TransformLower.TransformLower.value,
            object.dashboardData.data.ITRunvsITChangevsITTransform.TransformLower.TransformLower.kpiCode,
            object.dashboardData.data.ITRunvsITChangevsITTransform.TransformMean.TransformMean.label,
            object.dashboardData.data.ITRunvsITChangevsITTransform.TransformMean.TransformMean.value,
            object.dashboardData.data.ITRunvsITChangevsITTransform.TransformMean.TransformMean.kpiCode
            );

            // "IT Personnel"
            object.groupFiveElements(object.CIOKPIGroupList[9],
              object.dashboardData.data.ITPersonnel.FTEPercent.FTEPercent.label,
              object.dashboardData.data.ITPersonnel.FTEPercent.FTEPercent.value,
              object.dashboardData.data.ITPersonnel.FTEPercent.FTEPercent.kpiCode,
              object.dashboardData.data.ITPersonnel.ContractorPercent.ContractorPercent.label,
              object.dashboardData.data.ITPersonnel.ContractorPercent.ContractorPercent.value,
              object.dashboardData.data.ITPersonnel.ContractorPercent.ContractorPercent.kpiCode,
              object.dashboardData.data.ITPersonnel.OnshorePercent.OnshorePercent.label,
              object.dashboardData.data.ITPersonnel.OnshorePercent.OnshorePercent.value,
              object.dashboardData.data.ITPersonnel.OnshorePercent.OnshorePercent.kpiCode,
              object.dashboardData.data.ITPersonnel.OffshorePercent.OffshorePercent.label,
              object.dashboardData.data.ITPersonnel.OffshorePercent.OffshorePercent.value,
              object.dashboardData.data.ITPersonnel.OffshorePercent.OffshorePercent.kpiCode,
              object.dashboardData.data.ITPersonnel.AttritionMean.AttritionMean.label,
              object.dashboardData.data.ITPersonnel.AttritionMean.AttritionMean.value,
              object.dashboardData.data.ITPersonnel.AttritionMean.AttritionMean.kpiCode);

              // "User Experience Index"
              object.groupMainframeUpperLowerKPIs(object.CIOKPIGroupList[10],
                object.dashboardData.data.UserExperienceIndex.UserExperienceUpper.UserExperienceUpper.label,
                object.dashboardData.data.UserExperienceIndex.UserExperienceUpper.UserExperienceUpper.value,
                object.dashboardData.data.UserExperienceIndex.UserExperienceUpper.UserExperienceUpper.kpiCode,
                object.dashboardData.data.UserExperienceIndex.UserExperienceLower.UserExperienceLower.label,
                object.dashboardData.data.UserExperienceIndex.UserExperienceLower.UserExperienceLower.value,
                object.dashboardData.data.UserExperienceIndex.UserExperienceLower.UserExperienceLower.kpiCode,
                object.dashboardData.data.UserExperienceIndex.UserExperienceMean.UserExperienceMean.label,
                object.dashboardData.data.UserExperienceIndex.UserExperienceMean.UserExperienceMean.value,
                object.dashboardData.data.UserExperienceIndex.UserExperienceMean.UserExperienceMean.kpiCode
                );
    
                // "Digital Spend"
                object.groupMainframeUpperLowerKPIs(object.CIOKPIGroupList[11],
                  object.dashboardData.data.DigitalSpend.DigitalUpper.DigitalUpper.label,
                  object.dashboardData.data.DigitalSpend.DigitalUpper.DigitalUpper.value,
                  object.dashboardData.data.DigitalSpend.DigitalUpper.DigitalUpper.kpiCode,
                  object.dashboardData.data.DigitalSpend.DigitalLower.DigitalLower.label,
                  object.dashboardData.data.DigitalSpend.DigitalLower.DigitalLower.value,
                  object.dashboardData.data.DigitalSpend.DigitalLower.DigitalLower.kpiCode,
                  object.dashboardData.data.DigitalSpend.DigitalMean.DigitalMean.label,
                  object.dashboardData.data.DigitalSpend.DigitalMean.DigitalMean.value,
                  object.dashboardData.data.DigitalSpend.DigitalMean.DigitalMean.kpiCode
                  );
      

    

    object.mainframeDataLoaded =true;
  }


  createMainframeData()
  {
    let object = this;
    object.customDataObject = [];
    //distribute kpi groups

            //mainframe cost allocation
            object.groupMainframeCostAllocationKPIs(object.maninFrameKPIGroupList[9],
              object.dashboardData.data.TotalMainframeCostAllocation.CostAllocationEmp.Number.label,
              object.dashboardData.data.TotalMainframeCostAllocation.CostAllocationEmp.Number.value,
              object.dashboardData.data.TotalMainframeCostAllocation.CostAllocationEmp.Number.kpiCode,
              object.dashboardData.data.TotalMainframeCostAllocation.CostAllocationHW.Number.label,
              object.dashboardData.data.TotalMainframeCostAllocation.CostAllocationHW.Number.value,
              object.dashboardData.data.TotalMainframeCostAllocation.CostAllocationHW.Number.kpiCode,
              object.dashboardData.data.TotalMainframeCostAllocation.CostAllocationSW.Number.label,
              object.dashboardData.data.TotalMainframeCostAllocation.CostAllocationSW.Number.value,
              object.dashboardData.data.TotalMainframeCostAllocation.CostAllocationSW.Number.kpiCode,
              object.dashboardData.data.TotalMainframeCostAllocation.CostAllocationOS.Number.label,
              object.dashboardData.data.TotalMainframeCostAllocation.CostAllocationOS.Number.value,
              object.dashboardData.data.TotalMainframeCostAllocation.CostAllocationOS.Number.kpiCode    
            )

         
            //cost allocation drill down personnel
            object.groupEightDrillDownElements(object.maninFrameKPIGroupList[9],
            'Personnel',
            object.dashboardData.drills.PersonnelCostAllocation[0].label,
            object.dashboardData.drills.PersonnelCostAllocation[0].value,
            object.dashboardData.drills.PersonnelCostAllocation[0].kpiCode,
            object.dashboardData.drills.PersonnelCostAllocation[1].label,
            object.dashboardData.drills.PersonnelCostAllocation[1].value,
            object.dashboardData.drills.PersonnelCostAllocation[1].kpiCode,
            object.dashboardData.drills.PersonnelCostAllocation[2].label,
            object.dashboardData.drills.PersonnelCostAllocation[2].value,
            object.dashboardData.drills.PersonnelCostAllocation[2].kpiCode,
            object.dashboardData.drills.PersonnelCostAllocation[3].label,
            object.dashboardData.drills.PersonnelCostAllocation[3].value,
            object.dashboardData.drills.PersonnelCostAllocation[3].kpiCode,
            object.dashboardData.drills.PersonnelCostAllocation[4].label,
            object.dashboardData.drills.PersonnelCostAllocation[4].value,
            object.dashboardData.drills.PersonnelCostAllocation[4].kpiCode,
            object.dashboardData.drills.PersonnelCostAllocation[5].label,
            object.dashboardData.drills.PersonnelCostAllocation[5].value,
            object.dashboardData.drills.PersonnelCostAllocation[5].kpiCode,
            object.dashboardData.drills.PersonnelCostAllocation[6].label,
            object.dashboardData.drills.PersonnelCostAllocation[6].value,
            object.dashboardData.drills.PersonnelCostAllocation[6].kpiCode,
            object.dashboardData.drills.PersonnelCostAllocation[7].label,
            object.dashboardData.drills.PersonnelCostAllocation[7].value,
            object.dashboardData.drills.PersonnelCostAllocation[7].kpiCode
          )

          //cost allocation drill down hardware
          object.groupThreeDrillDownElements(object.maninFrameKPIGroupList[9],
            'Hardware',
            object.dashboardData.drills.HardwareCostAllocation[0].label,
            object.dashboardData.drills.HardwareCostAllocation[0].value,
            object.dashboardData.drills.HardwareCostAllocation[0].kpiCode,
            object.dashboardData.drills.HardwareCostAllocation[1].label,
            object.dashboardData.drills.HardwareCostAllocation[1].value,
            object.dashboardData.drills.HardwareCostAllocation[1].kpiCode,
            object.dashboardData.drills.HardwareCostAllocation[2].label,
            object.dashboardData.drills.HardwareCostAllocation[2].value,
            object.dashboardData.drills.HardwareCostAllocation[2].kpiCode
          )

           //cost allocation drill down software
           object.groupSevenDrillDownElements(object.maninFrameKPIGroupList[9],
            'Software',
            object.dashboardData.drills.SoftwareCostAllocation[0].label,
            object.dashboardData.drills.SoftwareCostAllocation[0].value,
            object.dashboardData.drills.SoftwareCostAllocation[0].kpiCode,
            object.dashboardData.drills.SoftwareCostAllocation[1].label,
            object.dashboardData.drills.SoftwareCostAllocation[1].value,
            object.dashboardData.drills.SoftwareCostAllocation[1].kpiCode,
            object.dashboardData.drills.SoftwareCostAllocation[2].label,
            object.dashboardData.drills.SoftwareCostAllocation[2].value,
            object.dashboardData.drills.SoftwareCostAllocation[2].kpiCode,
            object.dashboardData.drills.SoftwareCostAllocation[3].label,
            object.dashboardData.drills.SoftwareCostAllocation[3].value,
            object.dashboardData.drills.SoftwareCostAllocation[3].kpiCode,
            object.dashboardData.drills.SoftwareCostAllocation[4].label,
            object.dashboardData.drills.SoftwareCostAllocation[4].value,
            object.dashboardData.drills.SoftwareCostAllocation[4].kpiCode,
            object.dashboardData.drills.SoftwareCostAllocation[5].label,
            object.dashboardData.drills.SoftwareCostAllocation[5].value,
            object.dashboardData.drills.SoftwareCostAllocation[5].kpiCode,
            object.dashboardData.drills.SoftwareCostAllocation[6].label,
            object.dashboardData.drills.SoftwareCostAllocation[6].value,
            object.dashboardData.drills.SoftwareCostAllocation[6].kpiCode
          )

                //cost allocation drill down outsourcing
                object.groupNineDrillDownElements(object.maninFrameKPIGroupList[9],
                  'Outsourcing',
                  object.dashboardData.drills.OutsourcingCostAllocation[0].label,
                  object.dashboardData.drills.OutsourcingCostAllocation[0].value,
                  object.dashboardData.drills.OutsourcingCostAllocation[0].kpiCode,
                  object.dashboardData.drills.OutsourcingCostAllocation[1].label,
                  object.dashboardData.drills.OutsourcingCostAllocation[1].value,
                  object.dashboardData.drills.OutsourcingCostAllocation[1].kpiCode,
                  object.dashboardData.drills.OutsourcingCostAllocation[2].label,
                  object.dashboardData.drills.OutsourcingCostAllocation[2].value,
                  object.dashboardData.drills.OutsourcingCostAllocation[2].kpiCode,
                  object.dashboardData.drills.OutsourcingCostAllocation[3].label,
                  object.dashboardData.drills.OutsourcingCostAllocation[3].value,
                  object.dashboardData.drills.OutsourcingCostAllocation[3].kpiCode,
                  object.dashboardData.drills.OutsourcingCostAllocation[4].label,
                  object.dashboardData.drills.OutsourcingCostAllocation[4].value,
                  object.dashboardData.drills.OutsourcingCostAllocation[4].kpiCode,
                  object.dashboardData.drills.OutsourcingCostAllocation[5].label,
                  object.dashboardData.drills.OutsourcingCostAllocation[5].value,
                  object.dashboardData.drills.OutsourcingCostAllocation[5].kpiCode,
                  object.dashboardData.drills.OutsourcingCostAllocation[6].label,
                  object.dashboardData.drills.OutsourcingCostAllocation[6].value,
                  object.dashboardData.drills.OutsourcingCostAllocation[6].kpiCode,
                  object.dashboardData.drills.OutsourcingCostAllocation[7].label,
                  object.dashboardData.drills.OutsourcingCostAllocation[7].value,
                  object.dashboardData.drills.OutsourcingCostAllocation[7].kpiCode,
                  object.dashboardData.drills.OutsourcingCostAllocation[8].label,
                  object.dashboardData.drills.OutsourcingCostAllocation[8].value,
                  object.dashboardData.drills.OutsourcingCostAllocation[8].kpiCode
                )
           
      
             //cost per MIPS - cost of ownership
      object.groupMainframeUpperLowerKPIs(object.maninFrameKPIGroupList[4],
        object.dashboardData.data.AnnualCostPerConfiguredMIPS.CostPerMIPS.UpperCY.label,
        object.dashboardData.data.AnnualCostPerConfiguredMIPS.CostPerMIPS.UpperCY.value, 
        object.dashboardData.data.AnnualCostPerConfiguredMIPS.CostPerMIPS.UpperCY.kpiCode, 
        object.dashboardData.data.AnnualCostPerConfiguredMIPS.CostPerMIPS.LowerCY.label, 
        object.dashboardData.data.AnnualCostPerConfiguredMIPS.CostPerMIPS.LowerCY.value, 
        object.dashboardData.data.AnnualCostPerConfiguredMIPS.CostPerMIPS.LowerCY.kpiCode, 
        object.dashboardData.data.AnnualCostPerConfiguredMIPS.CostPerMIPS.NumberCY.label, 
        object.dashboardData.data.AnnualCostPerConfiguredMIPS.CostPerMIPS.NumberCY.value,
        object.dashboardData.data.AnnualCostPerConfiguredMIPS.CostPerMIPS.NumberCY.kpiCode);
     
      //cost per MIPS - market price
      object.groupMainframeUpperLowerKPIs(object.maninFrameKPIGroupList[5],
        object.dashboardData.data.AnnualCostPerConfiguredMIPS.PricePerMIPS.UpperCY.label,
        object.dashboardData.data.AnnualCostPerConfiguredMIPS.PricePerMIPS.UpperCY.value, 
        object.dashboardData.data.AnnualCostPerConfiguredMIPS.PricePerMIPS.UpperCY.kpiCode, 
        object.dashboardData.data.AnnualCostPerConfiguredMIPS.PricePerMIPS.LowerCY.label, 
        object.dashboardData.data.AnnualCostPerConfiguredMIPS.PricePerMIPS.LowerCY.value, 
        object.dashboardData.data.AnnualCostPerConfiguredMIPS.PricePerMIPS.LowerCY.kpiCode, 
        object.dashboardData.data.AnnualCostPerConfiguredMIPS.PricePerMIPS.NumberCY.label, 
        object.dashboardData.data.AnnualCostPerConfiguredMIPS.PricePerMIPS.NumberCY.value,
        object.dashboardData.data.AnnualCostPerConfiguredMIPS.PricePerMIPS.NumberCY.kpiCode);
     
      //annual cost per mainframe fte -employee
      object.groupMainframeUpperLowerKPIs(object.maninFrameKPIGroupList[6],
        object.dashboardData.data.AnnualCostPerMainframeFTE.CostPerEmployee.Upper.label,
        object.dashboardData.data.AnnualCostPerMainframeFTE.CostPerEmployee.Upper.value, 
        object.dashboardData.data.AnnualCostPerMainframeFTE.CostPerEmployee.Upper.kpiCode, 
        object.dashboardData.data.AnnualCostPerMainframeFTE.CostPerEmployee.Lower.label, 
        object.dashboardData.data.AnnualCostPerMainframeFTE.CostPerEmployee.Lower.value, 
        object.dashboardData.data.AnnualCostPerMainframeFTE.CostPerEmployee.Lower.kpiCode, 
        object.dashboardData.data.AnnualCostPerMainframeFTE.CostPerEmployee.Number.label, 
        object.dashboardData.data.AnnualCostPerMainframeFTE.CostPerEmployee.Number.value,
        object.dashboardData.data.AnnualCostPerMainframeFTE.CostPerEmployee.Number.kpiCode);
     
        //annual cost per mainframe fte -contractor
      object.groupMainframeUpperLowerKPIs(object.maninFrameKPIGroupList[7],
        object.dashboardData.data.AnnualCostPerMainframeFTE.CostPerContractor.Upper.label,
        object.dashboardData.data.AnnualCostPerMainframeFTE.CostPerContractor.Upper.value, 
        object.dashboardData.data.AnnualCostPerMainframeFTE.CostPerContractor.Upper.kpiCode, 
        object.dashboardData.data.AnnualCostPerMainframeFTE.CostPerContractor.Lower.label, 
        object.dashboardData.data.AnnualCostPerMainframeFTE.CostPerContractor.Lower.value, 
        object.dashboardData.data.AnnualCostPerMainframeFTE.CostPerContractor.Lower.kpiCode, 
        object.dashboardData.data.AnnualCostPerMainframeFTE.CostPerContractor.Number.label, 
        object.dashboardData.data.AnnualCostPerMainframeFTE.CostPerContractor.Number.value,
        object.dashboardData.data.AnnualCostPerMainframeFTE.CostPerContractor.Number.kpiCode);

        //utilization
      object.groupMainframeUpperLowerKPIs(object.maninFrameKPIGroupList[3],
        object.dashboardData.data.Utilization.Utilization.Upper.label,
        object.dashboardData.data.Utilization.Utilization.Upper.value, 
        object.dashboardData.data.Utilization.Utilization.Upper.kpiCode, 
        object.dashboardData.data.Utilization.Utilization.Lower.label, 
        object.dashboardData.data.Utilization.Utilization.Lower.value, 
        object.dashboardData.data.Utilization.Utilization.Lower.kpiCode, 
        object.dashboardData.data.Utilization.Utilization.Number.label, 
        object.dashboardData.data.Utilization.Utilization.Number.value,
        object.dashboardData.data.Utilization.Utilization.Number.kpiCode);
      

      //availability
      object.groupMainframeUpperLowerKPIs(object.maninFrameKPIGroupList[0],
        object.dashboardData.data.Availability.Availability.Upper.label,
        object.dashboardData.data.Availability.Availability.Upper.value, 
        object.dashboardData.data.Availability.Availability.Upper.kpiCode, 
        object.dashboardData.data.Availability.Availability.Lower.label, 
        object.dashboardData.data.Availability.Availability.Lower.value, 
        object.dashboardData.data.Availability.Availability.Lower.kpiCode, 
        object.dashboardData.data.Availability.Availability.Number.label, 
        object.dashboardData.data.Availability.Availability.Number.value,
        object.dashboardData.data.Availability.Availability.Number.kpiCode);

  //number of configured mips per fte
  object.groupMainframeUpperLowerKPIs(object.maninFrameKPIGroupList[8],
    object.dashboardData.data.NumberofConfiguredMIPSPerFTE.MIPSPerFTE.Upper.label,
    object.dashboardData.data.NumberofConfiguredMIPSPerFTE.MIPSPerFTE.Upper.value, 
    object.dashboardData.data.NumberofConfiguredMIPSPerFTE.MIPSPerFTE.Upper.kpiCode, 
    object.dashboardData.data.NumberofConfiguredMIPSPerFTE.MIPSPerFTE.Lower.label, 
    object.dashboardData.data.NumberofConfiguredMIPSPerFTE.MIPSPerFTE.Lower.value, 
    object.dashboardData.data.NumberofConfiguredMIPSPerFTE.MIPSPerFTE.Lower.kpiCode, 
    object.dashboardData.data.NumberofConfiguredMIPSPerFTE.MIPSPerFTE.Number.label, 
    object.dashboardData.data.NumberofConfiguredMIPSPerFTE.MIPSPerFTE.Number.value,
    object.dashboardData.data.NumberofConfiguredMIPSPerFTE.MIPSPerFTE.Number.kpiCode);


     
      //staffingmix employee
      object.groupMainframeUpperLowerKPIs(object.maninFrameKPIGroupList[1],
        object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.label,
        object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.value, 
        object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.kpiCode, 
        object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.label, 
        object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.value, 
        object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.kpiCode, 
        object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.label, 
        object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.value,
        object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.kpiCode
      );

      
      //staffingmix contractor
      object.groupMainframeUpperLowerKPIs(object.maninFrameKPIGroupList[2],
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.label,
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.value, 
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.kpiCode, 
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.label, 
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.value, 
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.kpiCode, 
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.label, 
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.value,
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.kpiCode);
            
     
      

     
      object.mainframeDataLoaded =true;
    
      
  }

  groupTwoDrillDownElements(kpiheader,
    drilldownheader,
    element1label,
    element1value,
    element1code,
    element2label,
    element2value,
    element2code)
    {
      let object = this;

       //element1
       var element1 = element1label;
       var element1Value = element1value;
       var element1Code = element1code;
       var element1tmp = {
         "kpiElementLabel" : element1,
         "kpiElementValue" : element1Value,
         "kpiElementCode" : element1Code
       }
     
       //element2
       var element2 = element2label;
       var element2Value = element2value;
       var element2Code = element2code;
       var element2tmp = {
         "kpiElementLabel" : element2,
         "kpiElementValue" : element2Value,
         "kpiElementCode" : element2Code
       }
     
      
      
      var drilldownObj =[];
              
        
              drilldownObj.push(element1tmp);
              drilldownObj.push(element2tmp);
      
            
              var tempObj = {
                "headerLabel" : kpiheader+' Drilldown'+' - '+drilldownheader,
                "drilldownObj" : drilldownObj
              }
    
              
            
              object.customDataObject.push(tempObj);
    
              
    }


  groupThreeDrillDownElements(kpiheader,
    drilldownheader,
    element1label,
    element1value,
    element1code,
    element2label,
    element2value,
    element2code,
    element3label,
    element3value,
    element3code)
    {
      let object = this;

      //element1
      var element1 = element1label;
      var element1Value = element1value;
      var element1Code = element1code;
      var element1tmp = {
        "kpiElementLabel" : element1,
        "kpiElementValue" : element1Value,
        "kpiElementCode" : element1Code
      }
    
      //element2
      var element2 = element2label;
      var element2Value = element2value;
      var element2Code = element2code;
      var element2tmp = {
        "kpiElementLabel" : element2,
        "kpiElementValue" : element2Value,
        "kpiElementCode" : element2Code
      }
    
      //element3
      var element3 = element3label;
      var element3Value = element3value;
      var element3Code = element3code;
      var element3tmp = {
        "kpiElementLabel" : element3,
        "kpiElementValue" : element3Value,
        "kpiElementCode" : element3Code
      }
    
      
      var drilldownObj =[];
              
        
              drilldownObj.push(element1tmp);
              drilldownObj.push(element2tmp);
              drilldownObj.push(element3tmp);
              
            
              var tempObj = {
                "headerLabel" : kpiheader+' Drilldown'+' - '+drilldownheader,
                "drilldownObj" : drilldownObj
              }
    
              
            
              object.customDataObject.push(tempObj);
    
              
    }

    groupFourDrillDownElements(kpiheader,
      drilldownheader,
      element1label,
      element1value,
      element1code,
      element2label,
      element2value,
      element2code,
      element3label,
      element3value,
      element3code,
      element4label,
      element4value,
    element4code)
      {
        let object = this;
    
     //element1
  var element1 = element1label;
  var element1Value = element1value;
  var element1Code = element1code;
  var element1tmp = {
    "kpiElementLabel" : element1,
    "kpiElementValue" : element1Value,
    "kpiElementCode" : element1Code
  }

  //element2
  var element2 = element2label;
  var element2Value = element2value;
  var element2Code = element2code;
  var element2tmp = {
    "kpiElementLabel" : element2,
    "kpiElementValue" : element2Value,
    "kpiElementCode" : element2Code
  }

  //element3
  var element3 = element3label;
  var element3Value = element3value;
  var element3Code = element3code;
  var element3tmp = {
    "kpiElementLabel" : element3,
    "kpiElementValue" : element3Value,
    "kpiElementCode" : element3Code
  }

  //element4
  var element4 = element4label;
  var element4Value = element4value;
  var element4Code = element4code;
  var element4tmp = {
    "kpiElementLabel" : element4,
    "kpiElementValue" : element4Value,
    "kpiElementCode" : element4Code
  }
      
     
      var drilldownObj =[];
              
        
              drilldownObj.push(element1tmp);
              drilldownObj.push(element2tmp);
              drilldownObj.push(element3tmp);
              drilldownObj.push(element4tmp);
            
              if(drilldownheader!='')
              {
              var tempObj = {
                "headerLabel" : kpiheader+' Drilldown'+' - '+drilldownheader,
                "drilldownObj" : drilldownObj
              }
            }
            else
            {
              var tempObj = {
                "headerLabel" : kpiheader+' Drilldown',
                "drilldownObj" : drilldownObj
              }
            }
    
              
            
              object.customDataObject.push(tempObj);
    
              
      }

      groupFiveDrillDownElements(kpiheader,
      drilldownheader,
      element1label,
      element1value,
      element1code,
      element2label,
      element2value,
      element2code,
      element3label,
      element3value,
      element3code,
      element4label,
      element4value,
      element4code,
      element5label,
      element5value,
      element5code)
      {
        let object = this;
    
    //element1
  var element1 = element1label;
  var element1Value = element1value;
  var element1Code = element1code;
  var element1tmp = {
    "kpiElementLabel" : element1,
    "kpiElementValue" : element1Value,
    "kpiElementCode" : element1Code
  }

  //element2
  var element2 = element2label;
  var element2Value = element2value;
  var element2Code = element2code;
  var element2tmp = {
    "kpiElementLabel" : element2,
    "kpiElementValue" : element2Value,
    "kpiElementCode" : element2Code
  }

  //element3
  var element3 = element3label;
  var element3Value = element3value;
  var element3Code = element3code;
  var element3tmp = {
    "kpiElementLabel" : element3,
    "kpiElementValue" : element3Value,
    "kpiElementCode" : element3Code
  }

  //element4
  var element4 = element4label;
  var element4Value = element4value;
  var element4Code = element4code;
  var element4tmp = {
    "kpiElementLabel" : element4,
    "kpiElementValue" : element4Value,
    "kpiElementCode" : element4Code
  }

  //element5
  var element5 = element5label;
  var element5Value = element5value;
  var element5Code = element5code;
  var element5tmp = {
    "kpiElementLabel" : element5,
    "kpiElementValue" : element5Value,
    "kpiElementCode" : element5Code
  }
     
      
     
      var drilldownObj =[];
              
        
              drilldownObj.push(element1tmp);
              drilldownObj.push(element2tmp);
              drilldownObj.push(element3tmp);
              drilldownObj.push(element4tmp);
              drilldownObj.push(element5tmp);
              
            
              var tempObj = {
                "headerLabel" : kpiheader+' Drilldown'+' - '+drilldownheader,
                "drilldownObj" : drilldownObj
              }
    
              
            
              object.customDataObject.push(tempObj);
    
              
      }



    group6DrillDownElements(kpiheader,
      drilldownheader,
      element1label,
  element1value,
  element1code,
  element2label,
  element2value,
  element2code,
  element3label,
  element3value,
  element3code,
  element4label,
  element4value,
  element4code,
  element5label,
  element5value,
  element5code,
  element6label,
  element6value,
  element6code)
      {
        let object = this;
    
     //element1
  var element1 = element1label;
  var element1Value = element1value;
  var element1Code = element1code;
  var element1tmp = {
    "kpiElementLabel" : element1,
    "kpiElementValue" : element1Value,
    "kpiElementCode" : element1Code
  }

  //element2
  var element2 = element2label;
  var element2Value = element2value;
  var element2Code = element2code;
  var element2tmp = {
    "kpiElementLabel" : element2,
    "kpiElementValue" : element2Value,
    "kpiElementCode" : element2Code
  }

  //element3
  var element3 = element3label;
  var element3Value = element3value;
  var element3Code = element3code;
  var element3tmp = {
    "kpiElementLabel" : element3,
    "kpiElementValue" : element3Value,
    "kpiElementCode" : element3Code
  }

  //element4
  var element4 = element4label;
  var element4Value = element4value;
  var element4Code = element4code;
  var element4tmp = {
    "kpiElementLabel" : element4,
    "kpiElementValue" : element4Value,
    "kpiElementCode" : element4Code
  }

  //element5
  var element5 = element5label;
  var element5Value = element5value;
  var element5Code = element5code;
  var element5tmp = {
    "kpiElementLabel" : element5,
    "kpiElementValue" : element5Value,
    "kpiElementCode" : element5Code
  }

  //element6
  var element6 = element6label;
  var element6Value = element6value;
  var element6Code = element6code;
  var element6tmp = {
    "kpiElementLabel" : element6,
    "kpiElementValue" : element6Value,
    "kpiElementCode" : element6Code
  }
 
      
     
      var drilldownObj =[];
              
        
              drilldownObj.push(element1tmp);
              drilldownObj.push(element2tmp);
              drilldownObj.push(element3tmp);
              drilldownObj.push(element4tmp);
              drilldownObj.push(element5tmp);
              drilldownObj.push(element6tmp);
      
     
    
              
            
              var tempObj = {
                "headerLabel" : kpiheader+' Drilldown'+' - '+drilldownheader,
                "drilldownObj" : drilldownObj
              }
    
              
            
              object.customDataObject.push(tempObj);
    
              
      }


  groupSevenDrillDownElements(kpiheader,
      drilldownheader,
  element1label,
  element1value,
  element1code,
  element2label,
  element2value,
  element2code,
  element3label,
  element3value,
  element3code,
  element4label,
  element4value,
  element4code,
  element5label,
  element5value,
  element5code,
  element6label,
  element6value,
  element6code,
  element7label,
  element7value,
  element7code)
      {
        let object = this;
    
      //element1
  var element1 = element1label;
  var element1Value = element1value;
  var element1Code = element1code;
  var element1tmp = {
    "kpiElementLabel" : element1,
    "kpiElementValue" : element1Value,
    "kpiElementCode" : element1Code
  }

  //element2
  var element2 = element2label;
  var element2Value = element2value;
  var element2Code = element2code;
  var element2tmp = {
    "kpiElementLabel" : element2,
    "kpiElementValue" : element2Value,
    "kpiElementCode" : element2Code
  }

  //element3
  var element3 = element3label;
  var element3Value = element3value;
  var element3Code = element3code;
  var element3tmp = {
    "kpiElementLabel" : element3,
    "kpiElementValue" : element3Value,
    "kpiElementCode" : element3Code
  }

  //element4
  var element4 = element4label;
  var element4Value = element4value;
  var element4Code = element4code;
  var element4tmp = {
    "kpiElementLabel" : element4,
    "kpiElementValue" : element4Value,
    "kpiElementCode" : element4Code
  }

  //element5
  var element5 = element5label;
  var element5Value = element5value;
  var element5Code = element5code;
  var element5tmp = {
    "kpiElementLabel" : element5,
    "kpiElementValue" : element5Value,
    "kpiElementCode" : element5Code
  }

  //element6
  var element6 = element6label;
  var element6Value = element6value;
  var element6Code = element6code;
  var element6tmp = {
    "kpiElementLabel" : element6,
    "kpiElementValue" : element6Value,
    "kpiElementCode" : element6Code
  }

  //element7
  var element7 = element7label;
  var element7Value = element7value;
  var element7Code = element7code;
  var element7tmp = {
    "kpiElementLabel" : element7,
    "kpiElementValue" : element7Value,
    "kpiElementCode" : element7Code
  }

     
     
      var drilldownObj =[];
              
        
              drilldownObj.push(element1tmp);
              drilldownObj.push(element2tmp);
              drilldownObj.push(element3tmp);
              drilldownObj.push(element4tmp);
              drilldownObj.push(element5tmp);
              drilldownObj.push(element6tmp);
              drilldownObj.push(element7tmp);
     
    
              
            
              var tempObj = {
                "headerLabel" : kpiheader+' Drilldown'+' - '+drilldownheader,
                "drilldownObj" : drilldownObj
              }
    
              
            
              object.customDataObject.push(tempObj);
    
              
      }

  groupEightDrillDownElements(kpiheader,
  drilldownheader,
  element1label,
  element1value,
  element1code,
  element2label,
  element2value,
  element2code,
  element3label,
  element3value,
  element3code,
  element4label,
  element4value,
  element4code,
  element5label,
  element5value,
  element5code,
  element6label,
  element6value,
  element6code,
  element7label,
  element7value,
  element7code,
  element8label,
  element8value,
  element8code)
  {
    let object = this;

  //element1
  var element1 = element1label;
  var element1Value = element1value;
  var element1Code = element1code;
  var element1tmp = {
    "kpiElementLabel" : element1,
    "kpiElementValue" : element1Value,
    "kpiElementCode" : element1Code
  }

  //element2
  var element2 = element2label;
  var element2Value = element2value;
  var element2Code = element2code;
  var element2tmp = {
    "kpiElementLabel" : element2,
    "kpiElementValue" : element2Value,
    "kpiElementCode" : element2Code
  }

  //element3
  var element3 = element3label;
  var element3Value = element3value;
  var element3Code = element3code;
  var element3tmp = {
    "kpiElementLabel" : element3,
    "kpiElementValue" : element3Value,
    "kpiElementCode" : element3Code
  }

  //element4
  var element4 = element4label;
  var element4Value = element4value;
  var element4Code = element4code;
  var element4tmp = {
    "kpiElementLabel" : element4,
    "kpiElementValue" : element4Value,
    "kpiElementCode" : element4Code
  }

  //element5
  var element5 = element5label;
  var element5Value = element5value;
  var element5Code = element5code;
  var element5tmp = {
    "kpiElementLabel" : element5,
    "kpiElementValue" : element5Value,
    "kpiElementCode" : element5Code
  }

  //element6
  var element6 = element6label;
  var element6Value = element6value;
  var element6Code = element6code;
  var element6tmp = {
    "kpiElementLabel" : element6,
    "kpiElementValue" : element6Value,
    "kpiElementCode" : element6Code
  }

  //element7
  var element7 = element7label;
  var element7Value = element7value;
  var element7Code = element7code;
  var element7tmp = {
    "kpiElementLabel" : element7,
    "kpiElementValue" : element7Value,
    "kpiElementCode" : element7Code
  }

 
  //element8
  var element8 = element8label;
  var element8Value = element8value;
  var element8Code = element8code;
  var element8tmp = {
    "kpiElementLabel" : element8,
    "kpiElementValue" : element8Value,
    "kpiElementCode" : element8Code
  }


  var drilldownObj =[];
          
    
          drilldownObj.push(element1tmp);
          drilldownObj.push(element2tmp);
          drilldownObj.push(element3tmp);
          drilldownObj.push(element4tmp);
          drilldownObj.push(element5tmp);
          drilldownObj.push(element6tmp);
          drilldownObj.push(element7tmp);
          drilldownObj.push(element8tmp);

          
        
          var tempObj = {
            "headerLabel" : kpiheader+' Drilldown'+' - '+drilldownheader,
            "drilldownObj" : drilldownObj
          }

          
        
          object.customDataObject.push(tempObj);

          
  }

  groupNineDrillDownElements(kpiheader,
    drilldownheader,
    element1label,
  element1value,
  element1code,
  element2label,
  element2value,
  element2code,
  element3label,
  element3value,
  element3code,
  element4label,
  element4value,
  element4code,
  element5label,
  element5value,
  element5code,
  element6label,
  element6value,
  element6code,
  element7label,
  element7value,
  element7code,
  element8label,
  element8value,
  element8code,
  element9label,
  element9value,
  element9code)
    {
      let object = this;
  
    //element1
  var element1 = element1label;
  var element1Value = element1value;
  var element1Code = element1code;
  var element1tmp = {
    "kpiElementLabel" : element1,
    "kpiElementValue" : element1Value,
    "kpiElementCode" : element1Code
  }

  //element2
  var element2 = element2label;
  var element2Value = element2value;
  var element2Code = element2code;
  var element2tmp = {
    "kpiElementLabel" : element2,
    "kpiElementValue" : element2Value,
    "kpiElementCode" : element2Code
  }

  //element3
  var element3 = element3label;
  var element3Value = element3value;
  var element3Code = element3code;
  var element3tmp = {
    "kpiElementLabel" : element3,
    "kpiElementValue" : element3Value,
    "kpiElementCode" : element3Code
  }

  //element4
  var element4 = element4label;
  var element4Value = element4value;
  var element4Code = element4code;
  var element4tmp = {
    "kpiElementLabel" : element4,
    "kpiElementValue" : element4Value,
    "kpiElementCode" : element4Code
  }

  //element5
  var element5 = element5label;
  var element5Value = element5value;
  var element5Code = element5code;
  var element5tmp = {
    "kpiElementLabel" : element5,
    "kpiElementValue" : element5Value,
    "kpiElementCode" : element5Code
  }

  //element6
  var element6 = element6label;
  var element6Value = element6value;
  var element6Code = element6code;
  var element6tmp = {
    "kpiElementLabel" : element6,
    "kpiElementValue" : element6Value,
    "kpiElementCode" : element6Code
  }

  //element7
  var element7 = element7label;
  var element7Value = element7value;
  var element7Code = element7code;
  var element7tmp = {
    "kpiElementLabel" : element7,
    "kpiElementValue" : element7Value,
    "kpiElementCode" : element7Code
  }

 
  //element8
  var element8 = element8label;
  var element8Value = element8value;
  var element8Code = element8code;
  var element8tmp = {
    "kpiElementLabel" : element8,
    "kpiElementValue" : element8Value,
    "kpiElementCode" : element8Code
  }


    //element9
    var element9 = element9label;
    var element9Value = element9value;
    var element9Code = element9code;
    var element9tmp = {
      "kpiElementLabel" : element9,
      "kpiElementValue" : element9Value,
      "kpiElementCode" : element9Code
    }
  
    var drilldownObj =[];
            
      
            drilldownObj.push(element1tmp);
            drilldownObj.push(element2tmp);
            drilldownObj.push(element3tmp);
            drilldownObj.push(element4tmp);
            drilldownObj.push(element5tmp);
            drilldownObj.push(element6tmp);
            drilldownObj.push(element7tmp);
            drilldownObj.push(element8tmp);
            drilldownObj.push(element9tmp);
  
            
          
            var tempObj = {
              "headerLabel" : kpiheader+' Drilldown'+' - '+drilldownheader,
              "drilldownObj" : drilldownObj
            }
  
            
          
            object.customDataObject.push(tempObj);
  
            
    }

  groupTenDrillDownElements(kpiheader,
    drilldownheader,
    element1label,
    element1value,
    element1code,
    element2label,
    element2value,
    element2code,
    element3label,
    element3value,
    element3code,
    element4label,
    element4value,
    element4code,
    element5label,
    element5value,
    element5code,
    element6label,
    element6value,
    element6code,
    element7label,
    element7value,
    element7code,
    element8label,
    element8value,
    element8code,
    element9label,
    element9value,
    element9code,
    element10label,
    element10value,
    element10code)
    {
      let object = this;
  
      //element1
  var element1 = element1label;
  var element1Value = element1value;
  var element1Code = element1code;
  var element1tmp = {
    "kpiElementLabel" : element1,
    "kpiElementValue" : element1Value,
    "kpiElementCode" : element1Code
  }

  //element2
  var element2 = element2label;
  var element2Value = element2value;
  var element2Code = element2code;
  var element2tmp = {
    "kpiElementLabel" : element2,
    "kpiElementValue" : element2Value,
    "kpiElementCode" : element2Code
  }

  //element3
  var element3 = element3label;
  var element3Value = element3value;
  var element3Code = element3code;
  var element3tmp = {
    "kpiElementLabel" : element3,
    "kpiElementValue" : element3Value,
    "kpiElementCode" : element3Code
  }

  //element4
  var element4 = element4label;
  var element4Value = element4value;
  var element4Code = element4code;
  var element4tmp = {
    "kpiElementLabel" : element4,
    "kpiElementValue" : element4Value,
    "kpiElementCode" : element4Code
  }

  //element5
  var element5 = element5label;
  var element5Value = element5value;
  var element5Code = element5code;
  var element5tmp = {
    "kpiElementLabel" : element5,
    "kpiElementValue" : element5Value,
    "kpiElementCode" : element5Code
  }

  //element6
  var element6 = element6label;
  var element6Value = element6value;
  var element6Code = element6code;
  var element6tmp = {
    "kpiElementLabel" : element6,
    "kpiElementValue" : element6Value,
    "kpiElementCode" : element6Code
  }

  //element7
  var element7 = element7label;
  var element7Value = element7value;
  var element7Code = element7code;
  var element7tmp = {
    "kpiElementLabel" : element7,
    "kpiElementValue" : element7Value,
    "kpiElementCode" : element7Code
  }

 
  //element8
  var element8 = element8label;
  var element8Value = element8value;
  var element8Code = element8code;
  var element8tmp = {
    "kpiElementLabel" : element8,
    "kpiElementValue" : element8Value,
    "kpiElementCode" : element8Code
  }


    //element9
    var element9 = element9label;
    var element9Value = element9value;
    var element9Code = element9code;
    var element9tmp = {
      "kpiElementLabel" : element9,
      "kpiElementValue" : element9Value,
      "kpiElementCode" : element9Code
    }
  
    //element10
    var element10 = element10label;
    var element10Value = element10value;
    var element10Code = element10code;
    var element10tmp = {
      "kpiElementLabel" : element10,
      "kpiElementValue" : element10Value,
      "kpiElementCode" : element10Code
    }

  
    var drilldownObj =[];
            
      
            drilldownObj.push(element1tmp);
            drilldownObj.push(element2tmp);
            drilldownObj.push(element3tmp);
            drilldownObj.push(element4tmp);
            drilldownObj.push(element5tmp);
            drilldownObj.push(element6tmp);
            drilldownObj.push(element7tmp);
            drilldownObj.push(element8tmp);
            drilldownObj.push(element9tmp);
            drilldownObj.push(element10tmp);
  
            
          
            var tempObj = {
              "headerLabel" : kpiheader+' Drilldown'+' - '+drilldownheader,
              "drilldownObj" : drilldownObj
            }
  
            
          
            object.customDataObject.push(tempObj);
  
            
    }


  groupElevenDrillDownElements(kpiheader,
      drilldownheader,
      element1label,
      element1value,
      element1code,
      element2label,
      element2value,
      element2code,
      element3label,
      element3value,
      element3code,
      element4label,
      element4value,
      element4code,
      element5label,
      element5value,
      element5code,
      element6label,
      element6value,
      element6code,
      element7label,
      element7value,
      element7code,
      element8label,
      element8value,
      element8code,
      element9label,
      element9value,
      element9code,
      element10label,
      element10value,
      element10code,
      element11label,
      element11value,
      element11code)
      {
        let object = this;
    
        //element1
  var element1 = element1label;
  var element1Value = element1value;
  var element1Code = element1code;
  var element1tmp = {
    "kpiElementLabel" : element1,
    "kpiElementValue" : element1Value,
    "kpiElementCode" : element1Code
  }

  //element2
  var element2 = element2label;
  var element2Value = element2value;
  var element2Code = element2code;
  var element2tmp = {
    "kpiElementLabel" : element2,
    "kpiElementValue" : element2Value,
    "kpiElementCode" : element2Code
  }

  //element3
  var element3 = element3label;
  var element3Value = element3value;
  var element3Code = element3code;
  var element3tmp = {
    "kpiElementLabel" : element3,
    "kpiElementValue" : element3Value,
    "kpiElementCode" : element3Code
  }

  //element4
  var element4 = element4label;
  var element4Value = element4value;
  var element4Code = element4code;
  var element4tmp = {
    "kpiElementLabel" : element4,
    "kpiElementValue" : element4Value,
    "kpiElementCode" : element4Code
  }

  //element5
  var element5 = element5label;
  var element5Value = element5value;
  var element5Code = element5code;
  var element5tmp = {
    "kpiElementLabel" : element5,
    "kpiElementValue" : element5Value,
    "kpiElementCode" : element5Code
  }

  //element6
  var element6 = element6label;
  var element6Value = element6value;
  var element6Code = element6code;
  var element6tmp = {
    "kpiElementLabel" : element6,
    "kpiElementValue" : element6Value,
    "kpiElementCode" : element6Code
  }

  //element7
  var element7 = element7label;
  var element7Value = element7value;
  var element7Code = element7code;
  var element7tmp = {
    "kpiElementLabel" : element7,
    "kpiElementValue" : element7Value,
    "kpiElementCode" : element7Code
  }

 
  //element8
  var element8 = element8label;
  var element8Value = element8value;
  var element8Code = element8code;
  var element8tmp = {
    "kpiElementLabel" : element8,
    "kpiElementValue" : element8Value,
    "kpiElementCode" : element8Code
  }


    //element9
    var element9 = element9label;
    var element9Value = element9value;
    var element9Code = element9code;
    var element9tmp = {
      "kpiElementLabel" : element9,
      "kpiElementValue" : element9Value,
      "kpiElementCode" : element9Code
    }
  
    //element10
    var element10 = element10label;
    var element10Value = element10value;
    var element10Code = element10code;
    var element10tmp = {
      "kpiElementLabel" : element10,
      "kpiElementValue" : element10Value,
      "kpiElementCode" : element10Code
    }

      //element11
      var element11 = element11label;
      var element11Value = element11value;
      var element11Code = element11code;
      var element11tmp = {
        "kpiElementLabel" : element11,
        "kpiElementValue" : element11Value,
        "kpiElementCode" : element11Code
      }
    
      var drilldownObj =[];
              
        
              drilldownObj.push(element1tmp);
              drilldownObj.push(element2tmp);
              drilldownObj.push(element3tmp);
              drilldownObj.push(element4tmp);
              drilldownObj.push(element5tmp);
              drilldownObj.push(element6tmp);
              drilldownObj.push(element7tmp);
              drilldownObj.push(element8tmp);
              drilldownObj.push(element9tmp);
              drilldownObj.push(element10tmp);
              drilldownObj.push(element11tmp);
    
              
            
              var tempObj = {
                "headerLabel" : kpiheader+' Drilldown'+' - '+drilldownheader,
                "drilldownObj" : drilldownObj
              }
    
              
            
              object.customDataObject.push(tempObj);
    
              
      }

  groupThirteenDrillDownElements(kpiheader,
        drilldownheader,
        element1label,
      element1value,
      element1code,
      element2label,
      element2value,
      element2code,
      element3label,
      element3value,
      element3code,
      element4label,
      element4value,
      element4code,
      element5label,
      element5value,
      element5code,
      element6label,
      element6value,
      element6code,
      element7label,
      element7value,
      element7code,
      element8label,
      element8value,
      element8code,
      element9label,
      element9value,
      element9code,
      element10label,
      element10value,
      element10code,
      element11label,
      element11value,
      element11code,
      element12label,
        element12value,
        element12code,
        element13label,
        element13value,
        element13code)
        {
          let object = this;
      
           //element1
  var element1 = element1label;
  var element1Value = element1value;
  var element1Code = element1code;
  var element1tmp = {
    "kpiElementLabel" : element1,
    "kpiElementValue" : element1Value,
    "kpiElementCode" : element1Code
  }

  //element2
  var element2 = element2label;
  var element2Value = element2value;
  var element2Code = element2code;
  var element2tmp = {
    "kpiElementLabel" : element2,
    "kpiElementValue" : element2Value,
    "kpiElementCode" : element2Code
  }

  //element3
  var element3 = element3label;
  var element3Value = element3value;
  var element3Code = element3code;
  var element3tmp = {
    "kpiElementLabel" : element3,
    "kpiElementValue" : element3Value,
    "kpiElementCode" : element3Code
  }

  //element4
  var element4 = element4label;
  var element4Value = element4value;
  var element4Code = element4code;
  var element4tmp = {
    "kpiElementLabel" : element4,
    "kpiElementValue" : element4Value,
    "kpiElementCode" : element4Code
  }

  //element5
  var element5 = element5label;
  var element5Value = element5value;
  var element5Code = element5code;
  var element5tmp = {
    "kpiElementLabel" : element5,
    "kpiElementValue" : element5Value,
    "kpiElementCode" : element5Code
  }

  //element6
  var element6 = element6label;
  var element6Value = element6value;
  var element6Code = element6code;
  var element6tmp = {
    "kpiElementLabel" : element6,
    "kpiElementValue" : element6Value,
    "kpiElementCode" : element6Code
  }

  //element7
  var element7 = element7label;
  var element7Value = element7value;
  var element7Code = element7code;
  var element7tmp = {
    "kpiElementLabel" : element7,
    "kpiElementValue" : element7Value,
    "kpiElementCode" : element7Code
  }

 
  //element8
  var element8 = element8label;
  var element8Value = element8value;
  var element8Code = element8code;
  var element8tmp = {
    "kpiElementLabel" : element8,
    "kpiElementValue" : element8Value,
    "kpiElementCode" : element8Code
  }


    //element9
    var element9 = element9label;
    var element9Value = element9value;
    var element9Code = element9code;
    var element9tmp = {
      "kpiElementLabel" : element9,
      "kpiElementValue" : element9Value,
      "kpiElementCode" : element9Code
    }
  
    //element10
    var element10 = element10label;
    var element10Value = element10value;
    var element10Code = element10code;
    var element10tmp = {
      "kpiElementLabel" : element10,
      "kpiElementValue" : element10Value,
      "kpiElementCode" : element10Code
    }

      //element11
      var element11 = element11label;
      var element11Value = element11value;
      var element11Code = element11code;
      var element11tmp = {
        "kpiElementLabel" : element11,
        "kpiElementValue" : element11Value,
        "kpiElementCode" : element11Code
      }
    
      //element12
      var element12 = element12label;
      var element12Value = element12value;
      var element12Code = element12code;
      var element12tmp = {
        "kpiElementLabel" : element12,
        "kpiElementValue" : element12Value,
        "kpiElementCode" : element12Code
      }

      //element13
      var element13 = element13label;
      var element13Value = element13value;
      var element13Code = element13code;
      var element13tmp = {
        "kpiElementLabel" : element13,
        "kpiElementValue" : element13Value,
        "kpiElementCode" : element13Code
      }



        var drilldownObj =[];
                
          
                drilldownObj.push(element1tmp);
                drilldownObj.push(element2tmp);
                drilldownObj.push(element3tmp);
                drilldownObj.push(element4tmp);
                drilldownObj.push(element5tmp);
                drilldownObj.push(element6tmp);
                drilldownObj.push(element7tmp);
                drilldownObj.push(element8tmp);
                drilldownObj.push(element9tmp);
                drilldownObj.push(element10tmp);
                drilldownObj.push(element11tmp);
                drilldownObj.push(element12tmp);
                drilldownObj.push(element13tmp);
      
                
              
                var tempObj = {
                  "headerLabel" : kpiheader+' Drilldown'+' - '+drilldownheader,
                  "drilldownObj" : drilldownObj
                }
      
                
              
                object.customDataObject.push(tempObj);
      
                
        }

  groupTwoDrilldownElements(kpiheader,
drilldownheader,
element1label,
element1value,
element1code,
element2label,
element2value,
element2code)
{
  let object = this;

  //element1
  var element1 = element1label;
  var element1Value = element1value;
  var element1Code = element1code;
  var element1tmp = {
    "kpiElementLabel" : element1,
    "kpiElementValue" : element1Value,
    "kpiElementCode" : element1Code
  }

  //element2
  var element2 = element2label;
  var element2Value = element2value;
  var element2Code = element2code;
  var element2tmp = {
    "kpiElementLabel" : element2,
    "kpiElementValue" : element2Value,
    "kpiElementCode" : element2Code
  }
 
  var drilldownObj =[];
          
    
          drilldownObj.push(element1tmp);
          drilldownObj.push(element2tmp);

          
        
          var tempObj = {
            "headerLabel" : kpiheader+' Drilldown'+' - '+drilldownheader,
            "drilldownObj" : drilldownObj
          }

          
        
          object.customDataObject.push(tempObj);

          


  }

  groupSixDrillDownElements(kpiheader,
  drilldownheader,
  personnellabel,
  personnelvalue,
  personnelcode,
hardwarelabel,
hardwarevalue,
hardwarecode,
softwarelabel,
softwarevalue,
softwarecode,
outsourcinglabel,
outsourcingvalue,
outsourcingcode,
otherslabel,
othersvalue,
otherscode)
{
  let object = this;
  
          //personnel
          var perosnnel = personnellabel;
          var perosnnelValue = personnelvalue;
          var perosnnelCode = personnelcode;
          var personneltmp = {
            "kpiElementLabel" : perosnnel,
            "kpiElementValue" : perosnnelValue,
            "kpiElementCode" : perosnnelCode
          }
          //hardware
          var hardware = hardwarelabel;
          var hardwareValue = hardwarevalue;
          var hardwareCode = hardwarecode;
          var hardwaretmp = {
            "kpiElementLabel" : hardware,
            "kpiElementValue" : hardwareValue,
            "kpiElementCode" : hardwareCode,
          }
          //software
          var software = softwarelabel;
          var softwareValue = softwarevalue;
          var softwareCode = softwarecode;
          var softwaretmp = {
            "kpiElementLabel" : software,
            "kpiElementValue" : softwareValue,
            "kpiElementCode" : softwareCode,
          }

          //outsourcing
          var outsourcing = outsourcinglabel;
          var outsourcingValue = outsourcingvalue;
          var outsourcingCode = outsourcingcode;
          var outsourcetmp = {
            "kpiElementLabel" : outsourcing,
            "kpiElementValue" : outsourcingValue,
            "kpiElementCode" : outsourcingCode
          }

          //others
          var others = otherslabel;
          var othersValue = othersvalue;
          var othersCode = otherscode;
          var otherstmp = {
            "kpiElementLabel" : others,
            "kpiElementValue" : othersValue,
            "kpiElementCode" : othersCode
          }

          var drilldownObj =[];
          
    
          drilldownObj.push(personneltmp);
          drilldownObj.push(hardwaretmp);
          drilldownObj.push(softwaretmp);
          drilldownObj.push(outsourcetmp);
          drilldownObj.push(otherstmp);

          
        
          var tempObj = {
            "headerLabel" : kpiheader+' Drilldown'+' - '+drilldownheader,
            "drilldownObj" : drilldownObj
          }

          
        
          object.customDataObject.push(tempObj);

          

  }

  //group 3 elements
  groupMainframeUpperLowerKPIs(kpiheader,
    upperlabel,
    uppervalue,
    uppercode, 
    lowerlabel, 
    lowervalue,
    lowercode,
    meanlabel, 
    meanvalue,
    meancode
    )
  {

    

    let object = this;
    
          //upper
          var upper = upperlabel;
          var upperValue = uppervalue;
          var upperCode = uppercode;
          var uppertmp = {
            "kpiElementLabel" : upper,
            "kpiElementValue" : upperValue,
            "kpiElementCode" : upperCode
          }
          //lower
          var lower = lowerlabel;
          var lowerValue = lowervalue;
          var lowerCode = lowercode;
          var lowertmp = {
            "kpiElementLabel" : lower,
            "kpiElementValue" : lowerValue,
            "kpiElementCode" : lowerCode
          }
          //mean
          var mean = meanlabel;
          var meanValue = meanvalue;
          var meanCode = meancode;
          var meantmp = {
            "kpiElementLabel" : mean,
            "kpiElementValue" : meanValue,
            "kpiElementCode" : meanCode
          }
          var dataObj =[];
    
          dataObj.push(meantmp);
          dataObj.push(uppertmp);
          dataObj.push(lowertmp);
    
    
          var tempObj = {
            "headerLabel" : kpiheader,
            "dataObj" : dataObj
          }

          
        
          object.customDataObject.push(tempObj);

  }

  //group 4 elements
  groupMainframeCostAllocationKPIs(kpiheader,
    personnellabel,
    personnelvalue,
    personnelcode,
  hardwarelabel,
  hardwarevalue,
  hardwarecode,
softwarelabel,
softwarevalue,
softwarecode,
outsourcinglabel,
outsourcingvalue,
outsourcingcode){

  let object = this;

  
          //personnel
          var perosnnel = personnellabel;
          var perosnnelValue = personnelvalue;
          var perosnnelCode = personnelcode;
          var personneltmp = {
            "kpiElementLabel" : perosnnel,
            "kpiElementValue" : perosnnelValue,
            "kpiElementCode" : perosnnelCode,
          }
          //hardware
          var hardware = hardwarelabel;
          var hardwareValue = hardwarevalue;
          var hardwareCode = hardwarecode;
          var hardwaretmp = {
            "kpiElementLabel" : hardware,
            "kpiElementValue" : hardwareValue,
            "kpiElementCode" : hardwareCode,
          }
          //software
          var software = softwarelabel;
          var softwareValue = softwarevalue;
          var softwareCode = softwarecode;
          var softwaretmp = {
            "kpiElementLabel" : software,
            "kpiElementValue" : softwareValue,
            "kpiElementCode" : softwareCode,
          }

          //outsourcing
          var outsourcing = outsourcinglabel;
          var outsourcingValue = outsourcingvalue;
          var outsourcingCode = outsourcingcode;
          var outsourcetmp = {
            "kpiElementLabel" : outsourcing,
            "kpiElementValue" : outsourcingValue,
            "kpiElementCode" : outsourcingCode,
          }

          var dataObj =[];
    
          dataObj.push(personneltmp);
          dataObj.push(hardwaretmp);
          dataObj.push(softwaretmp);
          dataObj.push(outsourcetmp);
    
          var tempObj = {
            "headerLabel" : kpiheader,
            "dataObj" : dataObj
          }
        
          object.customDataObject.push(tempObj);


  }

  //group 2 elements
  groupTwoKPIs(kpiheader,
  element1label,
  element1val,
  element1code,
  element2label,
  element2val,
  element2code)
{
  let object = this;
  
  //element1
  var element1 = element1label;
  var element1Value = element1val;
  var element1Code = element1code;
  var element1tmp = {
    "kpiElementLabel" : element1,
    "kpiElementValue" : element1Value,
    "kpiElementCode" : element1Code,
  }
  //element2
  var element2 = element2label;
  var element2Value = element2val;
  var element2Code = element2code;
  var element2tmp = {
    "kpiElementLabel" : element2,
    "kpiElementValue" : element2Value,
    "kpiElementCode" : element2Code
  }

  var dataObj =[];
    
          dataObj.push(element1tmp);
          dataObj.push(element2tmp);
    
          var tempObj = {
            "headerLabel" : kpiheader,
            "dataObj" : dataObj
          }
        
          object.customDataObject.push(tempObj);
  }
//group 1 element
  groupOneKPIs(kpiheader,
    element1label,
    element1val,
    element1code)
  {
    let object = this;
    
    //element1
    var element1 = element1label;
    var element1Value = element1val;
    var element1Code = element1code;
    var element1tmp = {
      "kpiElementLabel" : element1,
      "kpiElementValue" : element1Value,
      "kpiElementCode" : element1Code,
    }
  
    var dataObj =[];
      
            dataObj.push(element1tmp);
      
            var tempObj = {
              "headerLabel" : kpiheader,
              "dataObj" : dataObj
            }
          
            object.customDataObject.push(tempObj);
    }
  //group 5 elements
  groupFiveElements(kpiheader,
  personnellabel,
  personnelvalue,
  personnelcode,
hardwarelabel,
hardwarevalue,
hardwarecode,
softwarelabel,
softwarevalue,
softwarecode,
outsourcinglabel,
outsourcingvalue,
outsourcingcode,
otherslabel,
othersvalue,
otherscode)
{
  let object = this;
  
          //personnel
          var perosnnel = personnellabel;
          var perosnnelValue = personnelvalue;
          var perosnnelCode = personnelcode;
          var personneltmp = {
            "kpiElementLabel" : perosnnel,
            "kpiElementValue" : perosnnelValue,
            "kpiElementCode" : perosnnelCode,
          }
          //hardware
          var hardware = hardwarelabel;
          var hardwareValue = hardwarevalue;
          var hardwareCode = hardwarecode;
          var hardwaretmp = {
            "kpiElementLabel" : hardware,
            "kpiElementValue" : hardwareValue,
            "kpiElementCode" : hardwareCode,
          }
          //software
          var software = softwarelabel;
          var softwareValue = softwarevalue;
          var softwareCode = softwarecode;
          var softwaretmp = {
            "kpiElementLabel" : software,
            "kpiElementValue" : softwareValue,
            "kpiElementCode" : softwareCode,
          }

          //outsourcing
          var outsourcing = outsourcinglabel;
          var outsourcingValue = outsourcingvalue;
          var outsourcingCode = outsourcingcode;
          var outsourcetmp = {
            "kpiElementLabel" : outsourcing,
            "kpiElementValue" : outsourcingValue,
            "kpiElementCode" : outsourcingCode
          }

          //others
          var others = otherslabel;
          var othersValue = othersvalue;
          var othersCode = otherscode;
          var otherstmp = {
            "kpiElementLabel" : others,
            "kpiElementValue" : othersValue,
            "kpiElementCode" : othersCode
          }

          var dataObj =[];
    
          dataObj.push(personneltmp);
          dataObj.push(hardwaretmp);
          dataObj.push(softwaretmp);
          dataObj.push(outsourcetmp);
          dataObj.push(otherstmp);
    
          var tempObj = {
            "headerLabel" : kpiheader,
            "dataObj" : dataObj
          }
        
          object.customDataObject.push(tempObj);

    }

  //group 7 elements
    groupSevenElements(kpiheader,
      element1label,
      element1value,
      element1code,
      element2label,
    element2value,
    element2code,
    element3label,
    element3value,
    element3code,
    element4label,
    element4value,
    element4code,
    element5label,
    element5value,
    element5code,
    element6label,
    element6value,
    element6code,
    element7label,
    element7value,
    element7code
    )
    {
      let object = this;
      
              //element1
              var element1label = element1label;
              var element1Value = element1value;
              var element1Code = element1code;
              var element1temp = {
                "kpiElementLabel" : element1label,
                "kpiElementValue" : element1Value,
                "kpiElementCode" : element1Code,
              }
              //element2
              var element2 = element2label;
              var element2Value = element2value;
              var element2Code = element2code;
              var element2tmp = {
                "kpiElementLabel" : element2,
                "kpiElementValue" : element2Value,
                "kpiElementCode" : element2Code,
              }

              //element3
              var element3label = element3label;
              var element3Value = element3value;
              var element3Code = element3code;
              var element3temp = {
                "kpiElementLabel" : element3label,
                "kpiElementValue" : element3Value,
                "kpiElementCode" : element3Code,
              }

              //element4
              var element4label = element4label;
              var element4Value = element4value;
              var element4Code = element4code;
              var element4temp = {
                "kpiElementLabel" : element4label,
                "kpiElementValue" : element4Value,
                "kpiElementCode" : element4Code,
              }

              //element5
              var element5label = element5label;
              var element5Value = element5value;
              var element5Code = element5code;
              var element5temp = {
                "kpiElementLabel" : element5label,
                "kpiElementValue" : element5Value,
                "kpiElementCode" : element5Code,
              }

              //element6
              var element6label = element6label;
              var element6Value = element6value;
              var element6Code = element6code;
              var element6temp = {
                "kpiElementLabel" : element6label,
                "kpiElementValue" : element6Value,
                "kpiElementCode" : element6Code,
              }

              //element7
              var element7label = element7label;
              var element7Value = element7value;
              var element7Code = element7code;
              var element7temp = {
                "kpiElementLabel" : element7label,
                "kpiElementValue" : element7Value,
                "kpiElementCode" : element7Code,
              }
    
              
    
              var dataObj =[];
        
              dataObj.push(element1temp);
              dataObj.push(element2tmp);
              dataObj.push(element3temp);
              dataObj.push(element4temp);
              dataObj.push(element5temp);
              dataObj.push(element6temp),
              dataObj.push(element7temp)
        
              var tempObj = {
                "headerLabel" : kpiheader,
                "dataObj" : dataObj
              }
            
              object.customDataObject.push(tempObj);
    
        }


        groupNineElements(kpiheader,
          element1label,
          element1value,
          element1code,
          element2label,
        element2value,
        element2code,
        element3label,
        element3value,
        element3code,
        element4label,
        element4value,
        element4code,
        element5label,
        element5value,
        element5code,
        element6label,
        element6value,
        element6code,
        element7label,
        element7value,
        element7code,
        element8label,
        element8value,
        element8code,
        element9label,
        element9value,
        element9code
        )
        {
          let object = this;
          
                  //element1
                  var element1label = element1label;
                  var element1Value = element1value;
                  var element1Code = element1code;
                  var element1temp = {
                    "kpiElementLabel" : element1label,
                    "kpiElementValue" : element1Value,
                    "kpiElementCode" : element1Code,
                  }
                  //element2
                  var element2 = element2label;
                  var element2Value = element2value;
                  var element2Code = element2code;
                  var element2tmp = {
                    "kpiElementLabel" : element2,
                    "kpiElementValue" : element2Value,
                    "kpiElementCode" : element2Code,
                  }
    
                  //element3
                  var element3label = element3label;
                  var element3Value = element3value;
                  var element3Code = element3code;
                  var element3temp = {
                    "kpiElementLabel" : element3label,
                    "kpiElementValue" : element3Value,
                    "kpiElementCode" : element3Code,
                  }
    
                  //element4
                  var element4label = element4label;
                  var element4Value = element4value;
                  var element4Code = element4code;
                  var element4temp = {
                    "kpiElementLabel" : element4label,
                    "kpiElementValue" : element4Value,
                    "kpiElementCode" : element4Code,
                  }
    
                  //element5
                  var element5label = element5label;
                  var element5Value = element5value;
                  var element5Code = element5code;
                  var element5temp = {
                    "kpiElementLabel" : element5label,
                    "kpiElementValue" : element5Value,
                    "kpiElementCode" : element5Code,
                  }
    
                  //element6
                  var element6label = element6label;
                  var element6Value = element6value;
                  var element6Code = element6code;
                  var element6temp = {
                    "kpiElementLabel" : element6label,
                    "kpiElementValue" : element6Value,
                    "kpiElementCode" : element6Code,
                  }
    
                  //element7
                  var element7label = element7label;
                  var element7Value = element7value;
                  var element7Code = element7code;
                  var element7temp = {
                    "kpiElementLabel" : element7label,
                    "kpiElementValue" : element7Value,
                    "kpiElementCode" : element7Code,
                  }

                  //element8
                  var element8label = element8label;
                  var element8Value = element8value;
                  var element8Code = element8code;
                  var element8temp = {
                    "kpiElementLabel" : element8label,
                    "kpiElementValue" : element8Value,
                    "kpiElementCode" : element8Code,
                  }

                  //element9
                  var element9label = element9label;
                  var element9Value = element9value;
                  var element9Code = element9code;
                  var element9temp = {
                    "kpiElementLabel" : element9label,
                    "kpiElementValue" : element9Value,
                    "kpiElementCode" : element9Code,
                  }
        
                  
        
                  var dataObj =[];
            
                  dataObj.push(element1temp);
                  dataObj.push(element2tmp);
                  dataObj.push(element3temp);
                  dataObj.push(element4temp);
                  dataObj.push(element5temp);
                  dataObj.push(element6temp),
                  dataObj.push(element7temp);
                  dataObj.push(element8temp);
                  dataObj.push(element9temp);
            
                  var tempObj = {
                    "headerLabel" : kpiheader,
                    "dataObj" : dataObj
                  }
                
                  object.customDataObject.push(tempObj);
        
            }
createServerData()
{
  let object = this;
  object.customDataObject = [];
    //distribute kpi groups

        //server cost allocation
        object.groupMainframeCostAllocationKPIs(object.serverKPIGroupList[11],
          object.dashboardData.data.TotalServerCostAllocation.CostAllocationEmp.Number.label,
          object.dashboardData.data.TotalServerCostAllocation.CostAllocationEmp.Number.value,
          object.dashboardData.data.TotalServerCostAllocation.CostAllocationEmp.Number.kpiCode,
          object.dashboardData.data.TotalServerCostAllocation.CostAllocationHW.Number.label,
          object.dashboardData.data.TotalServerCostAllocation.CostAllocationHW.Number.value,
          object.dashboardData.data.TotalServerCostAllocation.CostAllocationHW.Number.kpiCode,
          object.dashboardData.data.TotalServerCostAllocation.CostAllocationSW.Number.label,
          object.dashboardData.data.TotalServerCostAllocation.CostAllocationSW.Number.value,
          object.dashboardData.data.TotalServerCostAllocation.CostAllocationSW.Number.kpiCode,
          object.dashboardData.data.TotalServerCostAllocation.CostAllocationOS.Number.label,
          object.dashboardData.data.TotalServerCostAllocation.CostAllocationOS.Number.value,
          object.dashboardData.data.TotalServerCostAllocation.CostAllocationOS.Number.kpiCode  
        );

        //server drilldown
        //personnel
        object.groupElevenDrillDownElements(object.serverKPIGroupList[11],
          'Personnel',
          object.dashboardData.drills.PersonnelCostAllocation[0].label,
          object.dashboardData.drills.PersonnelCostAllocation[0].value,
          object.dashboardData.drills.PersonnelCostAllocation[0].kpiCode,
          object.dashboardData.drills.PersonnelCostAllocation[1].label,
          object.dashboardData.drills.PersonnelCostAllocation[1].value,
          object.dashboardData.drills.PersonnelCostAllocation[1].kpiCode,
          object.dashboardData.drills.PersonnelCostAllocation[2].label,
          object.dashboardData.drills.PersonnelCostAllocation[2].value,
          object.dashboardData.drills.PersonnelCostAllocation[2].kpiCode,
          object.dashboardData.drills.PersonnelCostAllocation[3].label,
          object.dashboardData.drills.PersonnelCostAllocation[3].value,
          object.dashboardData.drills.PersonnelCostAllocation[3].kpiCode,
          object.dashboardData.drills.PersonnelCostAllocation[4].label,
          object.dashboardData.drills.PersonnelCostAllocation[4].value,
          object.dashboardData.drills.PersonnelCostAllocation[4].kpiCode,
          object.dashboardData.drills.PersonnelCostAllocation[5].label,
          object.dashboardData.drills.PersonnelCostAllocation[5].value,
          object.dashboardData.drills.PersonnelCostAllocation[5].kpiCode,
          object.dashboardData.drills.PersonnelCostAllocation[6].label,
          object.dashboardData.drills.PersonnelCostAllocation[6].value,
          object.dashboardData.drills.PersonnelCostAllocation[6].kpiCode,
          object.dashboardData.drills.PersonnelCostAllocation[7].label,
          object.dashboardData.drills.PersonnelCostAllocation[7].value,
          object.dashboardData.drills.PersonnelCostAllocation[7].kpiCode,
          object.dashboardData.drills.PersonnelCostAllocation[8].label,
          object.dashboardData.drills.PersonnelCostAllocation[8].value,
          object.dashboardData.drills.PersonnelCostAllocation[8].kpiCode,
          object.dashboardData.drills.PersonnelCostAllocation[9].label,
          object.dashboardData.drills.PersonnelCostAllocation[9].value,
          object.dashboardData.drills.PersonnelCostAllocation[9].kpiCode,
          object.dashboardData.drills.PersonnelCostAllocation[10].label,
          object.dashboardData.drills.PersonnelCostAllocation[10].value,
          object.dashboardData.drills.PersonnelCostAllocation[10].kpiCode
        )

        //cost allocation drill down hardware
        object.groupThreeDrillDownElements(object.serverKPIGroupList[11],
          'Hardware',
          object.dashboardData.drills.HardwareCostAllocation[0].label,
          object.dashboardData.drills.HardwareCostAllocation[0].value,
          object.dashboardData.drills.HardwareCostAllocation[0].kpiCode,
          object.dashboardData.drills.HardwareCostAllocation[1].label,
          object.dashboardData.drills.HardwareCostAllocation[1].value,
          object.dashboardData.drills.HardwareCostAllocation[1].kpiCode,
          object.dashboardData.drills.HardwareCostAllocation[2].label,
          object.dashboardData.drills.HardwareCostAllocation[2].value,
          object.dashboardData.drills.HardwareCostAllocation[2].kpiCode
        )

         //cost allocation drill down software
         object.group6DrillDownElements(object.serverKPIGroupList[11],
          'Software',
          object.dashboardData.drills.SoftwareCostAllocation[0].label,
          object.dashboardData.drills.SoftwareCostAllocation[0].value,
          object.dashboardData.drills.SoftwareCostAllocation[0].kpiCode,
          object.dashboardData.drills.SoftwareCostAllocation[1].label,
          object.dashboardData.drills.SoftwareCostAllocation[1].value,
          object.dashboardData.drills.SoftwareCostAllocation[1].kpiCode,
          object.dashboardData.drills.SoftwareCostAllocation[2].label,
          object.dashboardData.drills.SoftwareCostAllocation[2].value,
          object.dashboardData.drills.SoftwareCostAllocation[2].kpiCode,
          object.dashboardData.drills.SoftwareCostAllocation[3].label,
          object.dashboardData.drills.SoftwareCostAllocation[3].value,
          object.dashboardData.drills.SoftwareCostAllocation[3].kpiCode,
          object.dashboardData.drills.SoftwareCostAllocation[4].label,
          object.dashboardData.drills.SoftwareCostAllocation[4].value,
          object.dashboardData.drills.SoftwareCostAllocation[4].kpiCode,
          object.dashboardData.drills.SoftwareCostAllocation[5].label,
          object.dashboardData.drills.SoftwareCostAllocation[5].value,
          object.dashboardData.drills.SoftwareCostAllocation[5].kpiCode,
        )

              //cost allocation drill down outsourcing
              object.groupTenDrillDownElements(object.serverKPIGroupList[11],
                'Outsourcing',
                object.dashboardData.drills.OutsourcingCostAllocation[0].label,
                object.dashboardData.drills.OutsourcingCostAllocation[0].value,
                object.dashboardData.drills.OutsourcingCostAllocation[0].kpiCode,
                object.dashboardData.drills.OutsourcingCostAllocation[1].label,
                object.dashboardData.drills.OutsourcingCostAllocation[1].value,
                object.dashboardData.drills.OutsourcingCostAllocation[1].kpiCode,
                object.dashboardData.drills.OutsourcingCostAllocation[2].label,
                object.dashboardData.drills.OutsourcingCostAllocation[2].value,
                object.dashboardData.drills.OutsourcingCostAllocation[2].kpiCode,
                object.dashboardData.drills.OutsourcingCostAllocation[3].label,
                object.dashboardData.drills.OutsourcingCostAllocation[3].value,
                object.dashboardData.drills.OutsourcingCostAllocation[3].kpiCode,
                object.dashboardData.drills.OutsourcingCostAllocation[4].label,
                object.dashboardData.drills.OutsourcingCostAllocation[4].value,
                object.dashboardData.drills.OutsourcingCostAllocation[4].kpiCode,
                object.dashboardData.drills.OutsourcingCostAllocation[5].label,
                object.dashboardData.drills.OutsourcingCostAllocation[5].value,
                object.dashboardData.drills.OutsourcingCostAllocation[5].kpiCode,
                object.dashboardData.drills.OutsourcingCostAllocation[6].label,
                object.dashboardData.drills.OutsourcingCostAllocation[6].value,
                object.dashboardData.drills.OutsourcingCostAllocation[6].kpiCode,
                object.dashboardData.drills.OutsourcingCostAllocation[7].label,
                object.dashboardData.drills.OutsourcingCostAllocation[7].value,
                object.dashboardData.drills.OutsourcingCostAllocation[7].kpiCode,
                object.dashboardData.drills.OutsourcingCostAllocation[8].label,
                object.dashboardData.drills.OutsourcingCostAllocation[8].value,
                object.dashboardData.drills.OutsourcingCostAllocation[8].kpiCode,
                object.dashboardData.drills.OutsourcingCostAllocation[9].label,
                object.dashboardData.drills.OutsourcingCostAllocation[9].value,
                object.dashboardData.drills.OutsourcingCostAllocation[9].kpiCode

              )

           //Annual Cost Per OS Instance - Total Cost of Ownership
      object.groupMainframeUpperLowerKPIs(object.serverKPIGroupList[3],
        object.dashboardData.data.AnnualCostPerOSInstance.CostPerServer.UpperCY.label,
        object.dashboardData.data.AnnualCostPerOSInstance.CostPerServer.UpperCY.value, 
        object.dashboardData.data.AnnualCostPerOSInstance.CostPerServer.UpperCY.kpiCode, 
        object.dashboardData.data.AnnualCostPerOSInstance.CostPerServer.LowerCY.label, 
        object.dashboardData.data.AnnualCostPerOSInstance.CostPerServer.LowerCY.value, 
        object.dashboardData.data.AnnualCostPerOSInstance.CostPerServer.LowerCY.kpiCode, 
        object.dashboardData.data.AnnualCostPerOSInstance.CostPerServer.NumberCY.label, 
        object.dashboardData.data.AnnualCostPerOSInstance.CostPerServer.NumberCY.value,
        object.dashboardData.data.AnnualCostPerOSInstance.CostPerServer.NumberCY.kpiCode);
     
      //Annual Cost Per OS Instance - Market Price
      object.groupMainframeUpperLowerKPIs(object.serverKPIGroupList[4],
        object.dashboardData.data.AnnualCostPerOSInstance.PricePerServer.UpperCY.label,
        object.dashboardData.data.AnnualCostPerOSInstance.PricePerServer.UpperCY.value, 
        object.dashboardData.data.AnnualCostPerOSInstance.PricePerServer.UpperCY.kpiCode, 
        object.dashboardData.data.AnnualCostPerOSInstance.PricePerServer.LowerCY.label, 
        object.dashboardData.data.AnnualCostPerOSInstance.PricePerServer.LowerCY.value, 
        object.dashboardData.data.AnnualCostPerOSInstance.PricePerServer.LowerCY.kpiCode, 
        object.dashboardData.data.AnnualCostPerOSInstance.PricePerServer.NumberCY.label, 
        object.dashboardData.data.AnnualCostPerOSInstance.PricePerServer.NumberCY.value,
        object.dashboardData.data.AnnualCostPerOSInstance.PricePerServer.NumberCY.kpiCode);

            //Annual Cost Per Core - Total Cost of Ownership
            object.groupMainframeUpperLowerKPIs(object.serverKPIGroupList[5],
              object.dashboardData.data.AnnualCostPerCore.CostPerCore.Upper.label,
              object.dashboardData.data.AnnualCostPerCore.CostPerCore.Upper.value, 
              object.dashboardData.data.AnnualCostPerCore.CostPerCore.Upper.kpiCode, 
              object.dashboardData.data.AnnualCostPerCore.CostPerCore.Lower.label, 
              object.dashboardData.data.AnnualCostPerCore.CostPerCore.Lower.value, 
              object.dashboardData.data.AnnualCostPerCore.CostPerCore.Lower.kpiCode, 
              object.dashboardData.data.AnnualCostPerCore.CostPerCore.Number.label, 
              object.dashboardData.data.AnnualCostPerCore.CostPerCore.Number.value,
              object.dashboardData.data.AnnualCostPerCore.CostPerCore.Number.kpiCode);
           
            //Annual Cost Per Core - Market Price
            object.groupMainframeUpperLowerKPIs(object.serverKPIGroupList[6],
              object.dashboardData.data.AnnualCostPerCore.PricePerCore.UpperCY.label,
              object.dashboardData.data.AnnualCostPerCore.PricePerCore.UpperCY.value, 
              object.dashboardData.data.AnnualCostPerCore.PricePerCore.UpperCY.kpiCode, 
              object.dashboardData.data.AnnualCostPerCore.PricePerCore.LowerCY.label, 
              object.dashboardData.data.AnnualCostPerCore.PricePerCore.LowerCY.value, 
              object.dashboardData.data.AnnualCostPerCore.PricePerCore.LowerCY.kpiCode, 
              object.dashboardData.data.AnnualCostPerCore.PricePerCore.NumberCY.label, 
              object.dashboardData.data.AnnualCostPerCore.PricePerCore.NumberCY.value,
              object.dashboardData.data.AnnualCostPerCore.PricePerCore.NumberCY.kpiCode);

                //annual cost per server fte -employee
      object.groupMainframeUpperLowerKPIs(object.serverKPIGroupList[7],
        object.dashboardData.data.AnnualCostPerServerFTE.CostPerEmployee.Upper.label,
        object.dashboardData.data.AnnualCostPerServerFTE.CostPerEmployee.Upper.value,
        object.dashboardData.data.AnnualCostPerServerFTE.CostPerEmployee.Upper.kpiCode, 
        object.dashboardData.data.AnnualCostPerServerFTE.CostPerEmployee.Lower.label, 
        object.dashboardData.data.AnnualCostPerServerFTE.CostPerEmployee.Lower.value, 
        object.dashboardData.data.AnnualCostPerServerFTE.CostPerEmployee.Lower.kpiCode, 
        object.dashboardData.data.AnnualCostPerServerFTE.CostPerEmployee.Number.label, 
        object.dashboardData.data.AnnualCostPerServerFTE.CostPerEmployee.Number.value,
        object.dashboardData.data.AnnualCostPerServerFTE.CostPerEmployee.Number.kpiCode);
     
        //annual cost per server fte -contractor
      object.groupMainframeUpperLowerKPIs(object.serverKPIGroupList[8],
        object.dashboardData.data.AnnualCostPerServerFTE.CostPerContractor.Upper.label,
        object.dashboardData.data.AnnualCostPerServerFTE.CostPerContractor.Upper.value, 
        object.dashboardData.data.AnnualCostPerServerFTE.CostPerContractor.Upper.kpiCode, 
        object.dashboardData.data.AnnualCostPerServerFTE.CostPerContractor.Lower.label, 
        object.dashboardData.data.AnnualCostPerServerFTE.CostPerContractor.Lower.value, 
        object.dashboardData.data.AnnualCostPerServerFTE.CostPerContractor.Lower.kpiCode, 
        object.dashboardData.data.AnnualCostPerServerFTE.CostPerContractor.Number.label, 
        object.dashboardData.data.AnnualCostPerServerFTE.CostPerContractor.Number.value,
        object.dashboardData.data.AnnualCostPerServerFTE.CostPerContractor.Number.kpiCode);

          //server provisioning time
          object.groupMainframeUpperLowerKPIs(object.serverKPIGroupList[10],
            object.dashboardData.data.ProvisioningTime.ProvisioningTime.Upper.label,
            object.dashboardData.data.ProvisioningTime.ProvisioningTime.Upper.value, 
            object.dashboardData.data.ProvisioningTime.ProvisioningTime.Upper.kpiCode, 
            object.dashboardData.data.ProvisioningTime.ProvisioningTime.Lower.label, 
            object.dashboardData.data.ProvisioningTime.ProvisioningTime.Lower.value, 
            object.dashboardData.data.ProvisioningTime.ProvisioningTime.Lower.kpiCode, 
            object.dashboardData.data.ProvisioningTime.ProvisioningTime.Number.label, 
            object.dashboardData.data.ProvisioningTime.ProvisioningTime.Number.value,
            object.dashboardData.data.ProvisioningTime.ProvisioningTime.Number.kpiCode);
    

      
      //availability
      object.groupMainframeUpperLowerKPIs(object.serverKPIGroupList[0],
        object.dashboardData.data.Availability.Availability.Upper.label,
        object.dashboardData.data.Availability.Availability.Upper.value, 
        object.dashboardData.data.Availability.Availability.Upper.kpiCode, 
        object.dashboardData.data.Availability.Availability.Lower.label, 
        object.dashboardData.data.Availability.Availability.Lower.value, 
        object.dashboardData.data.Availability.Availability.Lower.kpiCode, 
        object.dashboardData.data.Availability.Availability.Number.label, 
        object.dashboardData.data.Availability.Availability.Number.value,
        object.dashboardData.data.Availability.Availability.Number.kpiCode);

        
        //number of instance per fte
        object.groupMainframeUpperLowerKPIs(object.serverKPIGroupList[9],
          object.dashboardData.data.NumberofOSInstancesPerFTE.ServersPerFTE.Upper.label,
          object.dashboardData.data.NumberofOSInstancesPerFTE.ServersPerFTE.Upper.value, 
          object.dashboardData.data.NumberofOSInstancesPerFTE.ServersPerFTE.Upper.kpiCode, 
          object.dashboardData.data.NumberofOSInstancesPerFTE.ServersPerFTE.Lower.label, 
          object.dashboardData.data.NumberofOSInstancesPerFTE.ServersPerFTE.Lower.value, 
          object.dashboardData.data.NumberofOSInstancesPerFTE.ServersPerFTE.Lower.kpiCode, 
          object.dashboardData.data.NumberofOSInstancesPerFTE.ServersPerFTE.Number.label, 
          object.dashboardData.data.NumberofOSInstancesPerFTE.ServersPerFTE.Number.value,
          object.dashboardData.data.NumberofOSInstancesPerFTE.ServersPerFTE.Number.kpiCode);

     
      //staffingmix employee
      object.groupMainframeUpperLowerKPIs(object.serverKPIGroupList[1],
        object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.label,
        object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.value, 
        object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.kpiCode, 
        object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.label, 
        object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.value, 
        object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.kpiCode, 
        object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.label, 
        object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.value,
        object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.kpiCode);

      
      //staffingmix contractor
      object.groupMainframeUpperLowerKPIs(object.serverKPIGroupList[2],
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.label,
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.value, 
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.kpiCode, 
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.label, 
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.value, 
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.kpiCode, 
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.label, 
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.value,
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.kpiCode);
     
    
      
        
      

      object.mainframeDataLoaded =true;
    
}

createLANObject()
{
  let object = this;
  object.customDataObject = [];
//LAN Cost Allocation

object.groupMainframeUpperLowerKPIs(object.LANKPIGroupList[0],
  object.dashboardData.data.TotalLANCostAllocation.CostAllocationEmp.Number.label,
  object.dashboardData.data.TotalLANCostAllocation.CostAllocationEmp.Number.value, 
  object.dashboardData.data.TotalLANCostAllocation.CostAllocationEmp.Number.kpiCode, 
  object.dashboardData.data.TotalLANCostAllocation.CostAllocationHWSW.Number.label, 
  object.dashboardData.data.TotalLANCostAllocation.CostAllocationHWSW.Number.value, 
  object.dashboardData.data.TotalLANCostAllocation.CostAllocationHWSW.Number.kpiCode, 
  object.dashboardData.data.TotalLANCostAllocation.CostAllocationOS.Number.label, 
  object.dashboardData.data.TotalLANCostAllocation.CostAllocationOS.Number.value,
  object.dashboardData.data.TotalLANCostAllocation.CostAllocationOS.Number.kpiCode);

  //drilldown personnel
  object.groupFourDrillDownElements(object.LANKPIGroupList[0],
    'Personnel',
    object.dashboardData.drills.PersonnelCostAllocation[0].label,
    object.dashboardData.drills.PersonnelCostAllocation[0].value,
    object.dashboardData.drills.PersonnelCostAllocation[0].kpiCode,
    object.dashboardData.drills.PersonnelCostAllocation[1].label,
    object.dashboardData.drills.PersonnelCostAllocation[1].value,
    object.dashboardData.drills.PersonnelCostAllocation[1].kpiCode,
    object.dashboardData.drills.PersonnelCostAllocation[2].label,
    object.dashboardData.drills.PersonnelCostAllocation[2].value,
    object.dashboardData.drills.PersonnelCostAllocation[2].kpiCode,
    object.dashboardData.drills.PersonnelCostAllocation[3].label,
    object.dashboardData.drills.PersonnelCostAllocation[3].value,
    object.dashboardData.drills.PersonnelCostAllocation[3].kpiCode
  );

  //hardware software
  object.groupThreeDrillDownElements(object.LANKPIGroupList[0],
    'Hardware & Software',
    object.dashboardData.drills.HardwareandSoftwareCostAllocation[0].label,
    object.dashboardData.drills.HardwareandSoftwareCostAllocation[0].value,
    object.dashboardData.drills.HardwareandSoftwareCostAllocation[0].kpiCode,
    object.dashboardData.drills.HardwareandSoftwareCostAllocation[1].label,
    object.dashboardData.drills.HardwareandSoftwareCostAllocation[1].value,
    object.dashboardData.drills.HardwareandSoftwareCostAllocation[1].kpiCode,
    object.dashboardData.drills.HardwareandSoftwareCostAllocation[2].label,
    object.dashboardData.drills.HardwareandSoftwareCostAllocation[2].value,
    object.dashboardData.drills.HardwareandSoftwareCostAllocation[2].kpiCode
  );

  //outsourcing
  object.groupFiveDrillDownElements(object.LANKPIGroupList[0],
    'Outsourcing',
    object.dashboardData.drills.OutsourcingCostAllocation[0].label,
    object.dashboardData.drills.OutsourcingCostAllocation[0].value,
    object.dashboardData.drills.OutsourcingCostAllocation[0].kpiCode,
    object.dashboardData.drills.OutsourcingCostAllocation[1].label,
    object.dashboardData.drills.OutsourcingCostAllocation[1].value,
    object.dashboardData.drills.OutsourcingCostAllocation[1].kpiCode,
    object.dashboardData.drills.OutsourcingCostAllocation[2].label,
    object.dashboardData.drills.OutsourcingCostAllocation[2].value,
    object.dashboardData.drills.OutsourcingCostAllocation[2].kpiCode,
    object.dashboardData.drills.OutsourcingCostAllocation[3].label,
    object.dashboardData.drills.OutsourcingCostAllocation[3].value,
    object.dashboardData.drills.OutsourcingCostAllocation[3].kpiCode,
    object.dashboardData.drills.OutsourcingCostAllocation[4].label,
    object.dashboardData.drills.OutsourcingCostAllocation[4].value,
    object.dashboardData.drills.OutsourcingCostAllocation[4].kpiCode
  );

 


//   "Annual Cost Per Active LAN Port-Total Cost of Ownership"
object.groupMainframeUpperLowerKPIs(object.LANKPIGroupList[1],
  object.dashboardData.data.AnnualCostPerActiveLANPort.LANCostPerPort.Upper.label,
  object.dashboardData.data.AnnualCostPerActiveLANPort.LANCostPerPort.Upper.value, 
  object.dashboardData.data.AnnualCostPerActiveLANPort.LANCostPerPort.Upper.kpiCode, 
  object.dashboardData.data.AnnualCostPerActiveLANPort.LANCostPerPort.Lower.label, 
  object.dashboardData.data.AnnualCostPerActiveLANPort.LANCostPerPort.Lower.value, 
  object.dashboardData.data.AnnualCostPerActiveLANPort.LANCostPerPort.Lower.kpiCode, 
  object.dashboardData.data.AnnualCostPerActiveLANPort.LANCostPerPort.Number.label, 
  object.dashboardData.data.AnnualCostPerActiveLANPort.LANCostPerPort.Number.value,
  object.dashboardData.data.AnnualCostPerActiveLANPort.LANCostPerPort.Number.kpiCode);

//   "Annual Cost Per Active LAN Port-Market Price"
object.groupMainframeUpperLowerKPIs(object.LANKPIGroupList[2],
  object.dashboardData.data.AnnualCostPerActiveLANPort.LANPricePerPort.Upper.label,
  object.dashboardData.data.AnnualCostPerActiveLANPort.LANPricePerPort.Upper.value, 
  object.dashboardData.data.AnnualCostPerActiveLANPort.LANPricePerPort.Upper.kpiCode, 
  object.dashboardData.data.AnnualCostPerActiveLANPort.LANPricePerPort.Lower.label, 
  object.dashboardData.data.AnnualCostPerActiveLANPort.LANPricePerPort.Lower.value, 
  object.dashboardData.data.AnnualCostPerActiveLANPort.LANPricePerPort.Lower.kpiCode, 
  object.dashboardData.data.AnnualCostPerActiveLANPort.LANPricePerPort.Number.label, 
  object.dashboardData.data.AnnualCostPerActiveLANPort.LANPricePerPort.Number.value,
  object.dashboardData.data.AnnualCostPerActiveLANPort.LANPricePerPort.Number.kpiCode);


//   "Annual Cost Per Network FTE - Employee"
object.groupMainframeUpperLowerKPIs(object.LANKPIGroupList[3],
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerEmployee.Upper.label,
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerEmployee.Upper.value, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerEmployee.Upper.kpiCode, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerEmployee.Lower.label, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerEmployee.Lower.value, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerEmployee.Lower.kpiCode, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerEmployee.Number.label, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerEmployee.Number.value,
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerEmployee.Number.kpiCode);

//   "Annual Cost Per Network FTE - Contractor"
object.groupMainframeUpperLowerKPIs(object.LANKPIGroupList[4],
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerContractor.Upper.label,
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerContractor.Upper.value, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerContractor.Upper.kpiCode, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerContractor.Lower.label, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerContractor.Lower.value, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerContractor.Lower.kpiCode, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerContractor.Number.label, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerContractor.Number.value,
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerContractor.Number.kpiCode);

//   "LAN Utilization" 
object.groupMainframeUpperLowerKPIs(object.LANKPIGroupList[5],
  object.dashboardData.data.Utilization.LANUtilization.Upper.label,
  object.dashboardData.data.Utilization.LANUtilization.Upper.value, 
  object.dashboardData.data.Utilization.LANUtilization.Upper.kpiCode, 
  object.dashboardData.data.Utilization.LANUtilization.Lower.label, 
  object.dashboardData.data.Utilization.LANUtilization.Lower.value, 
  object.dashboardData.data.Utilization.LANUtilization.Lower.kpiCode, 
  object.dashboardData.data.Utilization.LANUtilization.Number.label, 
  object.dashboardData.data.Utilization.LANUtilization.Number.value,
  object.dashboardData.data.Utilization.LANUtilization.Number.kpiCode);

//   "LAN Availability"
object.groupMainframeUpperLowerKPIs(object.LANKPIGroupList[6],
  object.dashboardData.data.Availability.LANAvailability.Upper.label,
  object.dashboardData.data.Availability.LANAvailability.Upper.value, 
  object.dashboardData.data.Availability.LANAvailability.Upper.kpiCode, 
  object.dashboardData.data.Availability.LANAvailability.Lower.label, 
  object.dashboardData.data.Availability.LANAvailability.Lower.value, 
  object.dashboardData.data.Availability.LANAvailability.Lower.kpiCode, 
  object.dashboardData.data.Availability.LANAvailability.Number.label, 
  object.dashboardData.data.Availability.LANAvailability.Number.value,
  object.dashboardData.data.Availability.LANAvailability.Number.kpiCode);

//   "# of Active LAN Ports Per FTE"
object.groupMainframeUpperLowerKPIs(object.LANKPIGroupList[7],
  object.dashboardData.data.NumberofActiveLANPortsPerFTE.PortsPerLANFTE.Upper.label,
  object.dashboardData.data.NumberofActiveLANPortsPerFTE.PortsPerLANFTE.Upper.value, 
  object.dashboardData.data.NumberofActiveLANPortsPerFTE.PortsPerLANFTE.Upper.kpiCode, 
  object.dashboardData.data.NumberofActiveLANPortsPerFTE.PortsPerLANFTE.Lower.label, 
  object.dashboardData.data.NumberofActiveLANPortsPerFTE.PortsPerLANFTE.Lower.value, 
  object.dashboardData.data.NumberofActiveLANPortsPerFTE.PortsPerLANFTE.Lower.kpiCode, 
  object.dashboardData.data.NumberofActiveLANPortsPerFTE.PortsPerLANFTE.Number.label, 
  object.dashboardData.data.NumberofActiveLANPortsPerFTE.PortsPerLANFTE.Number.value,
  object.dashboardData.data.NumberofActiveLANPortsPerFTE.PortsPerLANFTE.Number.kpiCode);

//   "Staffing Mix - Employee"
object.groupMainframeUpperLowerKPIs(object.LANKPIGroupList[8],
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.label,
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.value, 
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.kpiCode, 
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.label, 
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.value, 
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.kpiCode, 
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.label, 
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.value,
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.kpiCode);

//   "Staffing Mix - Contractor",
object.groupMainframeUpperLowerKPIs(object.LANKPIGroupList[9],
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.label,
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.value, 
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.kpiCode, 
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.label, 
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.value, 
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.kpicode, 
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.label, 
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.value,
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.kpiCode);

  //   "Office LAN vs. DC LAN" 
  object.groupTwoKPIs(object.LANKPIGroupList[10],
    object.dashboardData.data.OfficeLANvsDCLAN.LANOffice.LANOffice.label, 
    object.dashboardData.data.OfficeLANvsDCLAN.LANOffice.LANOffice.value,
    object.dashboardData.data.OfficeLANvsDCLAN.LANOffice.LANOffice.kpiCode,
    object.dashboardData.data.OfficeLANvsDCLAN.LANDC.LANDC.label,
    object.dashboardData.data.OfficeLANvsDCLAN.LANDC.LANDC.value,
    object.dashboardData.data.OfficeLANvsDCLAN.LANDC.LANDC.kpiCode 
   );

    

    object.mainframeDataLoaded =true;
  

}

createWANData()
{
  let object = this;
  object.customDataObject = [];
//WAN Cost Allocation

object.groupMainframeUpperLowerKPIs(object.WANKPIGroupList[0],
  object.dashboardData.data.TotalWANCostAllocation.CostAllocationEmp.Number.label,
  object.dashboardData.data.TotalWANCostAllocation.CostAllocationEmp.Number.value, 
  object.dashboardData.data.TotalWANCostAllocation.CostAllocationEmp.Number.kpiCode, 
  object.dashboardData.data.TotalWANCostAllocation.CostAllocationHWSW.Number.label, 
  object.dashboardData.data.TotalWANCostAllocation.CostAllocationHWSW.Number.value, 
  object.dashboardData.data.TotalWANCostAllocation.CostAllocationHWSW.Number.kpiCode, 
  object.dashboardData.data.TotalWANCostAllocation.CostAllocationOS.Number.label, 
  object.dashboardData.data.TotalWANCostAllocation.CostAllocationOS.Number.value,
  object.dashboardData.data.TotalWANCostAllocation.CostAllocationOS.Number.kpiCode);

  //drilldown
  //personnel
  object.groupFourDrillDownElements(object.WANKPIGroupList[0],
    'Personnel',
    object.dashboardData.drills.PersonnelCostAllocation[0].label,
    object.dashboardData.drills.PersonnelCostAllocation[0].value,
    object.dashboardData.drills.PersonnelCostAllocation[0].kpiCode,
    object.dashboardData.drills.PersonnelCostAllocation[1].label,
    object.dashboardData.drills.PersonnelCostAllocation[1].value,
    object.dashboardData.drills.PersonnelCostAllocation[1].kpiCode,
    object.dashboardData.drills.PersonnelCostAllocation[2].label,
    object.dashboardData.drills.PersonnelCostAllocation[2].value,
    object.dashboardData.drills.PersonnelCostAllocation[2].kpiCode,
    object.dashboardData.drills.PersonnelCostAllocation[3].label,
    object.dashboardData.drills.PersonnelCostAllocation[3].value,
    object.dashboardData.drills.PersonnelCostAllocation[3].kpiCode
  );

  //hardware and software
  object.groupTwoDrillDownElements(object.WANKPIGroupList[0],
    'Hardware & Software',
    object.dashboardData.drills.HardwareandSoftwareCostAllocation[0].label,
    object.dashboardData.drills.HardwareandSoftwareCostAllocation[0].value,
    object.dashboardData.drills.HardwareandSoftwareCostAllocation[0].kpiCode,
    object.dashboardData.drills.HardwareandSoftwareCostAllocation[1].label,
    object.dashboardData.drills.HardwareandSoftwareCostAllocation[1].value,
    object.dashboardData.drills.HardwareandSoftwareCostAllocation[1].kpiCode,
  );

  //outsourcing
  object.groupFiveDrillDownElements(object.WANKPIGroupList[0],
    'Outsourcing',
    object.dashboardData.drills.OutsourcingCostAllocation[0].label,
    object.dashboardData.drills.OutsourcingCostAllocation[0].value,
    object.dashboardData.drills.OutsourcingCostAllocation[0].kpiCode,
    object.dashboardData.drills.OutsourcingCostAllocation[1].label,
    object.dashboardData.drills.OutsourcingCostAllocation[1].value,
    object.dashboardData.drills.OutsourcingCostAllocation[1].kpiCode,
    object.dashboardData.drills.OutsourcingCostAllocation[2].label,
    object.dashboardData.drills.OutsourcingCostAllocation[2].value,
    object.dashboardData.drills.OutsourcingCostAllocation[2].kpiCode,
    object.dashboardData.drills.OutsourcingCostAllocation[3].label,
    object.dashboardData.drills.OutsourcingCostAllocation[3].value,
    object.dashboardData.drills.OutsourcingCostAllocation[3].kpiCode,
    object.dashboardData.drills.OutsourcingCostAllocation[4].label,
    object.dashboardData.drills.OutsourcingCostAllocation[4].value,
    object.dashboardData.drills.OutsourcingCostAllocation[4].kpiCode
  );



//   "Annual Cost Per Active WAN Location-Total Cost of Ownership"
object.groupMainframeUpperLowerKPIs(object.WANKPIGroupList[1],
  object.dashboardData.data.AnnualCostPerWANLocation.WANCostPerLocation.Upper.label,
  object.dashboardData.data.AnnualCostPerWANLocation.WANCostPerLocation.Upper.value, 
  object.dashboardData.data.AnnualCostPerWANLocation.WANCostPerLocation.Upper.kpiCode, 
  object.dashboardData.data.AnnualCostPerWANLocation.WANCostPerLocation.Lower.label, 
  object.dashboardData.data.AnnualCostPerWANLocation.WANCostPerLocation.Lower.value, 
  object.dashboardData.data.AnnualCostPerWANLocation.WANCostPerLocation.Lower.kpiCode, 
  object.dashboardData.data.AnnualCostPerWANLocation.WANCostPerLocation.Number.label, 
  object.dashboardData.data.AnnualCostPerWANLocation.WANCostPerLocation.Number.value,
  object.dashboardData.data.AnnualCostPerWANLocation.WANCostPerLocation.Number.kpiCode);

//   "Annual Cost Per Active WAN Location-Market Price"
object.groupMainframeUpperLowerKPIs(object.WANKPIGroupList[2],
  object.dashboardData.data.AnnualCostPerWANLocation.WANPricePerLocation.Upper.label,
  object.dashboardData.data.AnnualCostPerWANLocation.WANPricePerLocation.Upper.value, 
  object.dashboardData.data.AnnualCostPerWANLocation.WANPricePerLocation.Upper.kpiCode, 
  object.dashboardData.data.AnnualCostPerWANLocation.WANPricePerLocation.Lower.label, 
  object.dashboardData.data.AnnualCostPerWANLocation.WANPricePerLocation.Lower.value, 
  object.dashboardData.data.AnnualCostPerWANLocation.WANPricePerLocation.Lower.kpiCode, 
  object.dashboardData.data.AnnualCostPerWANLocation.WANPricePerLocation.Number.label, 
  object.dashboardData.data.AnnualCostPerWANLocation.WANPricePerLocation.Number.value,
  object.dashboardData.data.AnnualCostPerWANLocation.WANPricePerLocation.Number.kpiCode);

  

//   "Annual Cost Per Network FTE - Employee"
object.groupMainframeUpperLowerKPIs(object.WANKPIGroupList[3],
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerEmployee.Upper.label,
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerEmployee.Upper.value, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerEmployee.Upper.kpiCode, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerEmployee.Lower.label, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerEmployee.Lower.value, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerEmployee.Lower.kpiCode, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerEmployee.Number.label, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerEmployee.Number.value,
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerEmployee.Number.kpiCode);

//   "Annual Cost Per Network FTE - Contractor"
object.groupMainframeUpperLowerKPIs(object.WANKPIGroupList[4],
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerContractor.Upper.label,
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerContractor.Upper.value, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerContractor.Upper.kpiCode, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerContractor.Lower.label, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerContractor.Lower.value,
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerContractor.Lower.kpiCode, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerContractor.Number.label, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerContractor.Number.value,
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerContractor.Number.kpiCode);

//   "WAN Recovery Time" 
object.groupMainframeUpperLowerKPIs(object.WANKPIGroupList[5],
  object.dashboardData.data.RecoveryTime.WANRecovery.Upper.label,
  object.dashboardData.data.RecoveryTime.WANRecovery.Upper.value, 
  object.dashboardData.data.RecoveryTime.WANRecovery.Upper.kpiCode, 
  object.dashboardData.data.RecoveryTime.WANRecovery.Lower.label, 
  object.dashboardData.data.RecoveryTime.WANRecovery.Lower.value, 
  object.dashboardData.data.RecoveryTime.WANRecovery.Lower.kpiCode, 
  object.dashboardData.data.RecoveryTime.WANRecovery.Number.label, 
  object.dashboardData.data.RecoveryTime.WANRecovery.Number.value,
  object.dashboardData.data.RecoveryTime.WANRecovery.Number.kpiCode);

//   "WAN Availability"
object.groupMainframeUpperLowerKPIs(object.WANKPIGroupList[6],
  object.dashboardData.data.Availability.WANAvailability.Upper.label,
  object.dashboardData.data.Availability.WANAvailability.Upper.value, 
  object.dashboardData.data.Availability.WANAvailability.Upper.kpiCode, 
  object.dashboardData.data.Availability.WANAvailability.Lower.label, 
  object.dashboardData.data.Availability.WANAvailability.Lower.value, 
  object.dashboardData.data.Availability.WANAvailability.Lower.kpiCode, 
  object.dashboardData.data.Availability.WANAvailability.Number.label, 
  object.dashboardData.data.Availability.WANAvailability.Number.value,
  object.dashboardData.data.Availability.WANAvailability.Number.kpiCode);

//   "# of WAN Locations Per FTE"
object.groupMainframeUpperLowerKPIs(object.WANKPIGroupList[7],
  object.dashboardData.data.NumberofWANLocationsPerFTE.LocationsPerWANFTE.Upper.label,
  object.dashboardData.data.NumberofWANLocationsPerFTE.LocationsPerWANFTE.Upper.value, 
  object.dashboardData.data.NumberofWANLocationsPerFTE.LocationsPerWANFTE.Upper.kpiCode, 
  object.dashboardData.data.NumberofWANLocationsPerFTE.LocationsPerWANFTE.Lower.label, 
  object.dashboardData.data.NumberofWANLocationsPerFTE.LocationsPerWANFTE.Lower.value, 
  object.dashboardData.data.NumberofWANLocationsPerFTE.LocationsPerWANFTE.Lower.kpiCode, 
  object.dashboardData.data.NumberofWANLocationsPerFTE.LocationsPerWANFTE.Number.label, 
  object.dashboardData.data.NumberofWANLocationsPerFTE.LocationsPerWANFTE.Number.value,
  object.dashboardData.data.NumberofWANLocationsPerFTE.LocationsPerWANFTE.Number.kpiCode);

//   "Staffing Mix - Employee"
object.groupMainframeUpperLowerKPIs(object.WANKPIGroupList[8],
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.label,
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.value, 
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.kpiCode, 
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.label, 
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.value, 
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.kpiCode, 
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.label, 
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.value,
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.kpiCode);

//   "Staffing Mix - Contractor",
object.groupMainframeUpperLowerKPIs(object.WANKPIGroupList[9],
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.label,
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.value, 
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.kpiCode, 
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.label, 
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.value,
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.kpiCode, 
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.label, 
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.value,
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.kpiCode);

  //   Legacy WAN vs. SD WAN
  object.groupTwoKPIs(object.WANKPIGroupList[10],
    object.dashboardData.data.LegacyWANvsSDWAN.WANSDWAN.WANSDWAN.label, 
    object.dashboardData.data.LegacyWANvsSDWAN.WANSDWAN.WANSDWAN.value,
    object.dashboardData.data.LegacyWANvsSDWAN.WANSDWAN.WANSDWAN.kpiCode,
    object.dashboardData.data.LegacyWANvsSDWAN.WANLegacy.WANLegacy.label,
    object.dashboardData.data.LegacyWANvsSDWAN.WANLegacy.WANLegacy.value,
    object.dashboardData.data.LegacyWANvsSDWAN.WANLegacy.WANLegacy.kpiCode  
   );

    

    object.mainframeDataLoaded =true;
  

}

createVoiceData()
{
  let object = this;
  object.customDataObject = [];
//voice Cost Allocation

object.groupMainframeCostAllocationKPIs(object.VoiceKPIGroupList[0],
  object.dashboardData.data.TotalVoiceCostAllocation.CostAllocationEmp.Number.label,
  object.dashboardData.data.TotalVoiceCostAllocation.CostAllocationEmp.Number.value, 
  object.dashboardData.data.TotalVoiceCostAllocation.CostAllocationEmp.Number.kpiCode, 
  object.dashboardData.data.TotalVoiceCostAllocation.CostAllocationHW.Number.label, 
  object.dashboardData.data.TotalVoiceCostAllocation.CostAllocationHW.Number.value, 
  object.dashboardData.data.TotalVoiceCostAllocation.CostAllocationHW.Number.kpiCode, 
  object.dashboardData.data.TotalVoiceCostAllocation.CostAllocationSW.Number.label, 
  object.dashboardData.data.TotalVoiceCostAllocation.CostAllocationSW.Number.value,
  object.dashboardData.data.TotalVoiceCostAllocation.CostAllocationSW.Number.kpiCode,
  object.dashboardData.data.TotalVoiceCostAllocation.CostAllocationOS.Number.label, 
  object.dashboardData.data.TotalVoiceCostAllocation.CostAllocationOS.Number.value,
  object.dashboardData.data.TotalVoiceCostAllocation.CostAllocationOS.Number.kpiCode);

  //drilldown
  //personnel
  object.groupFourDrillDownElements(object.VoiceKPIGroupList[0],
    'Personnel',
    object.dashboardData.drills.PersonnelCostAllocation[0].label,
    object.dashboardData.drills.PersonnelCostAllocation[0].value,
    object.dashboardData.drills.PersonnelCostAllocation[0].kpiCode,
    object.dashboardData.drills.PersonnelCostAllocation[1].label,
    object.dashboardData.drills.PersonnelCostAllocation[1].value,
    object.dashboardData.drills.PersonnelCostAllocation[1].kpiCode,
    object.dashboardData.drills.PersonnelCostAllocation[2].label,
    object.dashboardData.drills.PersonnelCostAllocation[2].value,
    object.dashboardData.drills.PersonnelCostAllocation[2].kpiCode,
    object.dashboardData.drills.PersonnelCostAllocation[3].label,
    object.dashboardData.drills.PersonnelCostAllocation[3].value,
    object.dashboardData.drills.PersonnelCostAllocation[3].kpiCode
  );

  //hardware 
  object.groupThreeDrillDownElements(object.VoiceKPIGroupList[0],
    'Hardware',
    object.dashboardData.drills.HardwareCostAllocation[0].label,
    object.dashboardData.drills.HardwareCostAllocation[0].value,
    object.dashboardData.drills.HardwareCostAllocation[0].kpiCode,
    object.dashboardData.drills.HardwareCostAllocation[1].label,
    object.dashboardData.drills.HardwareCostAllocation[1].value,
    object.dashboardData.drills.HardwareCostAllocation[1].kpiCode,
    object.dashboardData.drills.HardwareCostAllocation[2].label,
    object.dashboardData.drills.HardwareCostAllocation[2].value,
    object.dashboardData.drills.HardwareCostAllocation[2].kpiCode
  );

  //software
  object.groupThreeDrillDownElements(object.VoiceKPIGroupList[0],
    'Software',
    object.dashboardData.drills.SoftwareCostAllocation[0].label,
    object.dashboardData.drills.SoftwareCostAllocation[0].value,
    object.dashboardData.drills.SoftwareCostAllocation[0].kpiCode,
    object.dashboardData.drills.SoftwareCostAllocation[1].label,
    object.dashboardData.drills.SoftwareCostAllocation[1].value,
    object.dashboardData.drills.SoftwareCostAllocation[1].kpiCode,
    object.dashboardData.drills.SoftwareCostAllocation[2].label,
    object.dashboardData.drills.SoftwareCostAllocation[2].value,
    object.dashboardData.drills.SoftwareCostAllocation[2].kpiCode
  );


  //outsourcing
  object.groupSevenDrillDownElements(object.VoiceKPIGroupList[0],
    'Outsourcing',
    object.dashboardData.drills.OutsourcingCostAllocation[0].label,
    object.dashboardData.drills.OutsourcingCostAllocation[0].value,
    object.dashboardData.drills.OutsourcingCostAllocation[0].kpiCode,
    object.dashboardData.drills.OutsourcingCostAllocation[1].label,
    object.dashboardData.drills.OutsourcingCostAllocation[1].value,
    object.dashboardData.drills.OutsourcingCostAllocation[1].kpiCode,
    object.dashboardData.drills.OutsourcingCostAllocation[2].label,
    object.dashboardData.drills.OutsourcingCostAllocation[2].value,
    object.dashboardData.drills.OutsourcingCostAllocation[2].kpiCode,
    object.dashboardData.drills.OutsourcingCostAllocation[3].label,
    object.dashboardData.drills.OutsourcingCostAllocation[3].value,
    object.dashboardData.drills.OutsourcingCostAllocation[3].kpiCode,
    object.dashboardData.drills.OutsourcingCostAllocation[4].label,
    object.dashboardData.drills.OutsourcingCostAllocation[4].value,
    object.dashboardData.drills.OutsourcingCostAllocation[4].kpiCode,
    object.dashboardData.drills.OutsourcingCostAllocation[5].label,
    object.dashboardData.drills.OutsourcingCostAllocation[5].value,
    object.dashboardData.drills.OutsourcingCostAllocation[5].kpiCode,
    object.dashboardData.drills.OutsourcingCostAllocation[6].label,
    object.dashboardData.drills.OutsourcingCostAllocation[6].value,
    object.dashboardData.drills.OutsourcingCostAllocation[6].kpiCode
  );


//   "Annual Cost Per Voice Handsets-Total Cost of Ownership"
object.groupMainframeUpperLowerKPIs(object.VoiceKPIGroupList[1],
  object.dashboardData.data.AnnualCostPerVoiceHandset.VoiceCostPerHandset.Upper.label,
  object.dashboardData.data.AnnualCostPerVoiceHandset.VoiceCostPerHandset.Upper.value, 
  object.dashboardData.data.AnnualCostPerVoiceHandset.VoiceCostPerHandset.Upper.kpiCode, 
  object.dashboardData.data.AnnualCostPerVoiceHandset.VoiceCostPerHandset.Lower.label, 
  object.dashboardData.data.AnnualCostPerVoiceHandset.VoiceCostPerHandset.Lower.value, 
  object.dashboardData.data.AnnualCostPerVoiceHandset.VoiceCostPerHandset.Lower.kpiCode, 
  object.dashboardData.data.AnnualCostPerVoiceHandset.VoiceCostPerHandset.Number.label, 
  object.dashboardData.data.AnnualCostPerVoiceHandset.VoiceCostPerHandset.Number.value,
  object.dashboardData.data.AnnualCostPerVoiceHandset.VoiceCostPerHandset.Number.kpiCode);

//  "Annual Cost Per Voice Handsets-Market Price"
object.groupMainframeUpperLowerKPIs(object.VoiceKPIGroupList[2],
  object.dashboardData.data.AnnualCostPerVoiceHandset.VoicePricePerHandset.Upper.label,
  object.dashboardData.data.AnnualCostPerVoiceHandset.VoicePricePerHandset.Upper.value,
  object.dashboardData.data.AnnualCostPerVoiceHandset.VoicePricePerHandset.Upper.kpiCode, 
  object.dashboardData.data.AnnualCostPerVoiceHandset.VoicePricePerHandset.Lower.label, 
  object.dashboardData.data.AnnualCostPerVoiceHandset.VoicePricePerHandset.Lower.value,
  object.dashboardData.data.AnnualCostPerVoiceHandset.VoicePricePerHandset.Lower.kpiCode, 
  object.dashboardData.data.AnnualCostPerVoiceHandset.VoicePricePerHandset.Number.label, 
  object.dashboardData.data.AnnualCostPerVoiceHandset.VoicePricePerHandset.Number.value,
  object.dashboardData.data.AnnualCostPerVoiceHandset.VoicePricePerHandset.Number.kpiCode);


//   "Annual Cost Per Network FTE - Employee"
object.groupMainframeUpperLowerKPIs(object.VoiceKPIGroupList[3],
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerEmployee.Upper.label,
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerEmployee.Upper.value,
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerEmployee.Upper.kpiCode, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerEmployee.Lower.label, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerEmployee.Lower.value, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerEmployee.Lower.kpiCode, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerEmployee.Number.label, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerEmployee.Number.value,
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerEmployee.Number.kpiCode);

//   "Annual Cost Per Network FTE - Contractor"
object.groupMainframeUpperLowerKPIs(object.VoiceKPIGroupList[4],
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerContractor.Upper.label,
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerContractor.Upper.value, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerContractor.Upper.kpiCode, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerContractor.Lower.label, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerContractor.Lower.value, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerContractor.Lower.kpiCode, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerContractor.Number.label, 
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerContractor.Number.value,
  object.dashboardData.data.AnnualCostPerNetworkFTE.CostPerContractor.Number.kpiCode);

//   Voice Handset Provisioning Time
object.groupMainframeUpperLowerKPIs(object.VoiceKPIGroupList[5],
  object.dashboardData.data.ProvisioningTime.VoiceProvisioning.Upper.label,
  object.dashboardData.data.ProvisioningTime.VoiceProvisioning.Upper.value,
  object.dashboardData.data.ProvisioningTime.VoiceProvisioning.Upper.kpiCode, 
  object.dashboardData.data.ProvisioningTime.VoiceProvisioning.Lower.label, 
  object.dashboardData.data.ProvisioningTime.VoiceProvisioning.Lower.value, 
  object.dashboardData.data.ProvisioningTime.VoiceProvisioning.Lower.kpiCode, 
  object.dashboardData.data.ProvisioningTime.VoiceProvisioning.Number.label, 
  object.dashboardData.data.ProvisioningTime.VoiceProvisioning.Number.value,
  object.dashboardData.data.ProvisioningTime.VoiceProvisioning.Number.kpiCode);

//   "Voice Availability"
object.groupMainframeUpperLowerKPIs(object.VoiceKPIGroupList[6],
  object.dashboardData.data.Availability.VoiceAvailability.Upper.label,
  object.dashboardData.data.Availability.VoiceAvailability.Upper.value, 
  object.dashboardData.data.Availability.VoiceAvailability.Upper.kpiCode, 
  object.dashboardData.data.Availability.VoiceAvailability.Lower.label, 
  object.dashboardData.data.Availability.VoiceAvailability.Lower.value, 
  object.dashboardData.data.Availability.VoiceAvailability.Lower.kpiCode, 
  object.dashboardData.data.Availability.VoiceAvailability.Number.label, 
  object.dashboardData.data.Availability.VoiceAvailability.Number.value,
  object.dashboardData.data.Availability.VoiceAvailability.Number.kpiCode);

//   # of Voice Handsets Per FTE
object.groupMainframeUpperLowerKPIs(object.VoiceKPIGroupList[7],
  object.dashboardData.data.NumberofVoiceHandsetsPerFTE.HandsetsPerVoiceFTE.Upper.label,
  object.dashboardData.data.NumberofVoiceHandsetsPerFTE.HandsetsPerVoiceFTE.Upper.value, 
  object.dashboardData.data.NumberofVoiceHandsetsPerFTE.HandsetsPerVoiceFTE.Upper.kpiCode, 
  object.dashboardData.data.NumberofVoiceHandsetsPerFTE.HandsetsPerVoiceFTE.Lower.label, 
  object.dashboardData.data.NumberofVoiceHandsetsPerFTE.HandsetsPerVoiceFTE.Lower.value, 
  object.dashboardData.data.NumberofVoiceHandsetsPerFTE.HandsetsPerVoiceFTE.Lower.kpiCode, 
  object.dashboardData.data.NumberofVoiceHandsetsPerFTE.HandsetsPerVoiceFTE.Number.label, 
  object.dashboardData.data.NumberofVoiceHandsetsPerFTE.HandsetsPerVoiceFTE.Number.value,
  object.dashboardData.data.NumberofVoiceHandsetsPerFTE.HandsetsPerVoiceFTE.Number.kpiCode);

//   "Staffing Mix - Employee"
object.groupMainframeUpperLowerKPIs(object.VoiceKPIGroupList[8],
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.label,
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.value, 
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.kpiCode, 
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.label, 
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.value, 
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.kpiCode, 
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.label, 
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.value,
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.kpiCode);

//   "Staffing Mix - Contractor",
object.groupMainframeUpperLowerKPIs(object.VoiceKPIGroupList[9],
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.label,
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.value, 
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.kpiCode, 
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.label, 
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.value, 
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.kpiCode, 
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.label, 
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.value,
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.kpiCode);

  //  Traditional PBX vs. VoIP
  object.groupTwoKPIs(object.VoiceKPIGroupList[10],
    object.dashboardData.data.TraditionalPBXvsVoIP.VoicePBX.VoicePBX.label,
    object.dashboardData.data.TraditionalPBXvsVoIP.VoicePBX.VoicePBX.value,
    object.dashboardData.data.TraditionalPBXvsVoIP.VoicePBX.VoicePBX.kpiCode,
    object.dashboardData.data.TraditionalPBXvsVoIP.VoiceVoIP.VoiceVoIP.label, 
    object.dashboardData.data.TraditionalPBXvsVoIP.VoiceVoIP.VoiceVoIP.value,
    object.dashboardData.data.TraditionalPBXvsVoIP.VoiceVoIP.VoiceVoIP.kpiCode
     
   );

    

    object.mainframeDataLoaded =true;
  

}

createWorkplaceData()
{
  let object =this;
  object.customDataObject = [];

  // "Workplace Services Cost Allocation",
  object.groupMainframeCostAllocationKPIs(object.workPlaceKPIGroupList[0],
    object.dashboardData.data.TotalWorkplaceServicesCostAllocation.CostAllocationEmp.Number.label,
    object.dashboardData.data.TotalWorkplaceServicesCostAllocation.CostAllocationEmp.Number.value, 
    object.dashboardData.data.TotalWorkplaceServicesCostAllocation.CostAllocationEmp.Number.kpiCode, 
    object.dashboardData.data.TotalWorkplaceServicesCostAllocation.CostAllocationHW.Number.label, 
    object.dashboardData.data.TotalWorkplaceServicesCostAllocation.CostAllocationHW.Number.value, 
    object.dashboardData.data.TotalWorkplaceServicesCostAllocation.CostAllocationHW.Number.kpiCode, 
    object.dashboardData.data.TotalWorkplaceServicesCostAllocation.CostAllocationSW.Number.label, 
    object.dashboardData.data.TotalWorkplaceServicesCostAllocation.CostAllocationSW.Number.value,
    object.dashboardData.data.TotalWorkplaceServicesCostAllocation.CostAllocationSW.Number.kpiCode,
    object.dashboardData.data.TotalWorkplaceServicesCostAllocation.CostAllocationOS.Number.label, 
    object.dashboardData.data.TotalWorkplaceServicesCostAllocation.CostAllocationOS.Number.value,
    object.dashboardData.data.TotalWorkplaceServicesCostAllocation.CostAllocationOS.Number.kpiCode);

    //drilldown
  //personnel
  object.groupElevenDrillDownElements(object.workPlaceKPIGroupList[0],
    'Personnel',
    object.dashboardData.drills.PersonnelCostAllocation[0].label,
    object.dashboardData.drills.PersonnelCostAllocation[0].value,
    object.dashboardData.drills.PersonnelCostAllocation[0].kpiCode,
    object.dashboardData.drills.PersonnelCostAllocation[1].label,
    object.dashboardData.drills.PersonnelCostAllocation[1].value,
    object.dashboardData.drills.PersonnelCostAllocation[1].kpiCode,
    object.dashboardData.drills.PersonnelCostAllocation[2].label,
    object.dashboardData.drills.PersonnelCostAllocation[2].value,
    object.dashboardData.drills.PersonnelCostAllocation[2].kpiCode,
    object.dashboardData.drills.PersonnelCostAllocation[3].label,
    object.dashboardData.drills.PersonnelCostAllocation[3].value,
    object.dashboardData.drills.PersonnelCostAllocation[3].kpiCode,
    object.dashboardData.drills.PersonnelCostAllocation[4].label,
    object.dashboardData.drills.PersonnelCostAllocation[4].value,
    object.dashboardData.drills.PersonnelCostAllocation[4].kpiCode,
    object.dashboardData.drills.PersonnelCostAllocation[5].label,
    object.dashboardData.drills.PersonnelCostAllocation[5].value,
    object.dashboardData.drills.PersonnelCostAllocation[5].kpiCode,
    object.dashboardData.drills.PersonnelCostAllocation[6].label,
    object.dashboardData.drills.PersonnelCostAllocation[6].value,
    object.dashboardData.drills.PersonnelCostAllocation[6].kpiCode,
    object.dashboardData.drills.PersonnelCostAllocation[7].label,
    object.dashboardData.drills.PersonnelCostAllocation[7].value,
    object.dashboardData.drills.PersonnelCostAllocation[7].kpiCode,
    object.dashboardData.drills.PersonnelCostAllocation[8].label,
    object.dashboardData.drills.PersonnelCostAllocation[8].value,
    object.dashboardData.drills.PersonnelCostAllocation[8].kpiCode,
    object.dashboardData.drills.PersonnelCostAllocation[9].label,
    object.dashboardData.drills.PersonnelCostAllocation[9].value,
    object.dashboardData.drills.PersonnelCostAllocation[9].kpiCode,
    object.dashboardData.drills.PersonnelCostAllocation[10].label,
    object.dashboardData.drills.PersonnelCostAllocation[10].value,
    object.dashboardData.drills.PersonnelCostAllocation[10].kpiCode,

  );

  //hardware 
  object.group6DrillDownElements(object.workPlaceKPIGroupList[0],
    'Hardware',
    object.dashboardData.drills.HardwareCostAllocation[0].label,
    object.dashboardData.drills.HardwareCostAllocation[0].value,
    object.dashboardData.drills.HardwareCostAllocation[0].kpiCode,
    object.dashboardData.drills.HardwareCostAllocation[1].label,
    object.dashboardData.drills.HardwareCostAllocation[1].value,
    object.dashboardData.drills.HardwareCostAllocation[1].kpiCode,
    object.dashboardData.drills.HardwareCostAllocation[2].label,
    object.dashboardData.drills.HardwareCostAllocation[2].value,
    object.dashboardData.drills.HardwareCostAllocation[2].kpiCode,
    object.dashboardData.drills.HardwareCostAllocation[3].label,
    object.dashboardData.drills.HardwareCostAllocation[3].value,
    object.dashboardData.drills.HardwareCostAllocation[3].kpiCode,
    object.dashboardData.drills.HardwareCostAllocation[4].label,
    object.dashboardData.drills.HardwareCostAllocation[4].value,
    object.dashboardData.drills.HardwareCostAllocation[4].kpiCode,
    object.dashboardData.drills.HardwareCostAllocation[5].label,
    object.dashboardData.drills.HardwareCostAllocation[5].value,
    object.dashboardData.drills.HardwareCostAllocation[5].kpiCode,
  );

  //software
  object.groupNineDrillDownElements(object.workPlaceKPIGroupList[0],
    'Software',
    object.dashboardData.drills.SoftwareCostAllocation[0].label,
    object.dashboardData.drills.SoftwareCostAllocation[0].value,
    object.dashboardData.drills.SoftwareCostAllocation[0].kpiCode,
    object.dashboardData.drills.SoftwareCostAllocation[1].label,
    object.dashboardData.drills.SoftwareCostAllocation[1].value,
    object.dashboardData.drills.SoftwareCostAllocation[1].kpiCode,
    object.dashboardData.drills.SoftwareCostAllocation[2].label,
    object.dashboardData.drills.SoftwareCostAllocation[2].value,
    object.dashboardData.drills.SoftwareCostAllocation[2].kpiCode,
    object.dashboardData.drills.SoftwareCostAllocation[3].label,
    object.dashboardData.drills.SoftwareCostAllocation[3].value,
    object.dashboardData.drills.SoftwareCostAllocation[3].kpiCode,
    object.dashboardData.drills.SoftwareCostAllocation[4].label,
    object.dashboardData.drills.SoftwareCostAllocation[4].value,
    object.dashboardData.drills.SoftwareCostAllocation[4].kpiCode,
    object.dashboardData.drills.SoftwareCostAllocation[5].label,
    object.dashboardData.drills.SoftwareCostAllocation[5].value,
    object.dashboardData.drills.SoftwareCostAllocation[5].kpiCode,
    object.dashboardData.drills.SoftwareCostAllocation[6].label,
    object.dashboardData.drills.SoftwareCostAllocation[6].value,
    object.dashboardData.drills.SoftwareCostAllocation[6].kpiCode,
    object.dashboardData.drills.SoftwareCostAllocation[7].label,
    object.dashboardData.drills.SoftwareCostAllocation[7].value,
    object.dashboardData.drills.SoftwareCostAllocation[7].kpiCode,
    object.dashboardData.drills.SoftwareCostAllocation[8].label,
    object.dashboardData.drills.SoftwareCostAllocation[8].value,
    object.dashboardData.drills.SoftwareCostAllocation[8].kpiCode
  );


  //outsourcing
  object.groupThirteenDrillDownElements(object.workPlaceKPIGroupList[0],
    'Outsourcing',
    object.dashboardData.drills.OutsourcingCostAllocation[0].label,
    object.dashboardData.drills.OutsourcingCostAllocation[0].value,
    object.dashboardData.drills.OutsourcingCostAllocation[0].kpiCode,
    object.dashboardData.drills.OutsourcingCostAllocation[1].label,
    object.dashboardData.drills.OutsourcingCostAllocation[1].value,
    object.dashboardData.drills.OutsourcingCostAllocation[1].kpiCode,
    object.dashboardData.drills.OutsourcingCostAllocation[2].label,
    object.dashboardData.drills.OutsourcingCostAllocation[2].value,
    object.dashboardData.drills.OutsourcingCostAllocation[2].kpiCode,
    object.dashboardData.drills.OutsourcingCostAllocation[3].label,
    object.dashboardData.drills.OutsourcingCostAllocation[3].value,
    object.dashboardData.drills.OutsourcingCostAllocation[3].kpiCode,
    object.dashboardData.drills.OutsourcingCostAllocation[4].label,
    object.dashboardData.drills.OutsourcingCostAllocation[4].value,
    object.dashboardData.drills.OutsourcingCostAllocation[4].kpiCode,
    object.dashboardData.drills.OutsourcingCostAllocation[5].label,
    object.dashboardData.drills.OutsourcingCostAllocation[5].value,
    object.dashboardData.drills.OutsourcingCostAllocation[5].kpiCode,
    object.dashboardData.drills.OutsourcingCostAllocation[6].label,
    object.dashboardData.drills.OutsourcingCostAllocation[6].value,
    object.dashboardData.drills.OutsourcingCostAllocation[6].kpiCode,
    object.dashboardData.drills.OutsourcingCostAllocation[7].label,
    object.dashboardData.drills.OutsourcingCostAllocation[7].value,
    object.dashboardData.drills.OutsourcingCostAllocation[7].kpiCode,
    object.dashboardData.drills.OutsourcingCostAllocation[8].label,
    object.dashboardData.drills.OutsourcingCostAllocation[8].value,
    object.dashboardData.drills.OutsourcingCostAllocation[8].kpiCode,
    object.dashboardData.drills.OutsourcingCostAllocation[9].label,
    object.dashboardData.drills.OutsourcingCostAllocation[9].value,
    object.dashboardData.drills.OutsourcingCostAllocation[9].kpiCode,
    object.dashboardData.drills.OutsourcingCostAllocation[10].label,
    object.dashboardData.drills.OutsourcingCostAllocation[10].value,
    object.dashboardData.drills.OutsourcingCostAllocation[10].kpiCode,
    object.dashboardData.drills.OutsourcingCostAllocation[11].label,
    object.dashboardData.drills.OutsourcingCostAllocation[11].value,
    object.dashboardData.drills.OutsourcingCostAllocation[11].kpiCode,
    object.dashboardData.drills.OutsourcingCostAllocation[12].label,
    object.dashboardData.drills.OutsourcingCostAllocation[12].value,
    object.dashboardData.drills.OutsourcingCostAllocation[12].kpiCode,
  );


  // "Annual Cost Per Workplace Services Device-Total Cost of Ownership",
  object.groupMainframeUpperLowerKPIs(object.workPlaceKPIGroupList[1],
    object.dashboardData.data.AnnualCostPerWorkplaceServicesDevice.CostPerDevice.UpperCY.label,
    object.dashboardData.data.AnnualCostPerWorkplaceServicesDevice.CostPerDevice.UpperCY.value, 
    object.dashboardData.data.AnnualCostPerWorkplaceServicesDevice.CostPerDevice.UpperCY.kpiCode, 
    object.dashboardData.data.AnnualCostPerWorkplaceServicesDevice.CostPerDevice.LowerCY.label, 
    object.dashboardData.data.AnnualCostPerWorkplaceServicesDevice.CostPerDevice.LowerCY.value, 
    object.dashboardData.data.AnnualCostPerWorkplaceServicesDevice.CostPerDevice.LowerCY.kpiCode, 
    object.dashboardData.data.AnnualCostPerWorkplaceServicesDevice.CostPerDevice.NumberCY.label, 
    object.dashboardData.data.AnnualCostPerWorkplaceServicesDevice.CostPerDevice.NumberCY.value,
    object.dashboardData.data.AnnualCostPerWorkplaceServicesDevice.CostPerDevice.NumberCY.kpiCode);

    // "Annual Cost Per Workplace Services Device-Market Price",
    object.groupMainframeUpperLowerKPIs(object.workPlaceKPIGroupList[2],
      object.dashboardData.data.AnnualCostPerWorkplaceServicesDevice.PricePerDevice.UpperCY.label,
      object.dashboardData.data.AnnualCostPerWorkplaceServicesDevice.PricePerDevice.UpperCY.value, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesDevice.PricePerDevice.UpperCY.kpiCode, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesDevice.PricePerDevice.LowerCY.label, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesDevice.PricePerDevice.LowerCY.value, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesDevice.PricePerDevice.LowerCY.kpiCode, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesDevice.PricePerDevice.NumberCY.label, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesDevice.PricePerDevice.NumberCY.value,
      object.dashboardData.data.AnnualCostPerWorkplaceServicesDevice.PricePerDevice.NumberCY.kpiCode);

    // "Annual Cost Per Workplace Services User - Total Cost of Ownership",
    object.groupMainframeUpperLowerKPIs(object.workPlaceKPIGroupList[3],
      object.dashboardData.data.AnnualCostPerWorkplaceServicesUser.CostPerUser.UpperCY.label,
      object.dashboardData.data.AnnualCostPerWorkplaceServicesUser.CostPerUser.UpperCY.value, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesUser.CostPerUser.UpperCY.kpiCode, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesUser.CostPerUser.LowerCY.label, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesUser.CostPerUser.LowerCY.value, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesUser.CostPerUser.LowerCY.kpiCode, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesUser.CostPerUser.NumberCY.label, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesUser.CostPerUser.NumberCY.value,
      object.dashboardData.data.AnnualCostPerWorkplaceServicesUser.CostPerUser.NumberCY.kpiCode);

     // "Annual Cost Per Workplace Services User - Market Price", 
     object.groupMainframeUpperLowerKPIs(object.workPlaceKPIGroupList[4],
      object.dashboardData.data.AnnualCostPerWorkplaceServicesUser.PricePerUser.UpperCY.label,
      object.dashboardData.data.AnnualCostPerWorkplaceServicesUser.PricePerUser.UpperCY.value, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesUser.PricePerUser.UpperCY.kpiCode, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesUser.PricePerUser.LowerCY.label, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesUser.PricePerUser.LowerCY.value, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesUser.PricePerUser.LowerCY.kpiCode, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesUser.PricePerUser.NumberCY.label, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesUser.PricePerUser.NumberCY.value,
      object.dashboardData.data.AnnualCostPerWorkplaceServicesUser.PricePerUser.NumberCY.kpiCode);

    // "Annual Cost Per Workplace Services FTE - Employee",
    object.groupMainframeUpperLowerKPIs(object.workPlaceKPIGroupList[5],
      object.dashboardData.data.AnnualCostPerWorkplaceServicesFTE.CostPerEmployee.Upper.label,
      object.dashboardData.data.AnnualCostPerWorkplaceServicesFTE.CostPerEmployee.Upper.value, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesFTE.CostPerEmployee.Upper.kpiCode, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesFTE.CostPerEmployee.Lower.label, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesFTE.CostPerEmployee.Lower.value, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesFTE.CostPerEmployee.Lower.kpiCode, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesFTE.CostPerEmployee.Number.label, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesFTE.CostPerEmployee.Number.value,
      object.dashboardData.data.AnnualCostPerWorkplaceServicesFTE.CostPerEmployee.Number.kpiCode);
    
    //   "Annual Cost Per Workplace Services FTE - Contractor"
    object.groupMainframeUpperLowerKPIs(object.workPlaceKPIGroupList[6],
      object.dashboardData.data.AnnualCostPerWorkplaceServicesFTE.CostPerContractor.Upper.label,
      object.dashboardData.data.AnnualCostPerWorkplaceServicesFTE.CostPerContractor.Upper.value, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesFTE.CostPerContractor.Upper.kpiCode, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesFTE.CostPerContractor.Lower.label, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesFTE.CostPerContractor.Lower.value, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesFTE.CostPerContractor.Lower.kpiCode, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesFTE.CostPerContractor.Number.label, 
      object.dashboardData.data.AnnualCostPerWorkplaceServicesFTE.CostPerContractor.Number.value,
      object.dashboardData.data.AnnualCostPerWorkplaceServicesFTE.CostPerContractor.Number.kpiCode);

    // "Annual Cost Per Mailbox",
    object.groupMainframeUpperLowerKPIs(object.workPlaceKPIGroupList[7],
      object.dashboardData.data.AnnualCostPerMailbox.CostPerMailbox.UpperCY.label,
      object.dashboardData.data.AnnualCostPerMailbox.CostPerMailbox.UpperCY.value, 
      object.dashboardData.data.AnnualCostPerMailbox.CostPerMailbox.UpperCY.kpiCode, 
      object.dashboardData.data.AnnualCostPerMailbox.CostPerMailbox.LowerCY.label, 
      object.dashboardData.data.AnnualCostPerMailbox.CostPerMailbox.LowerCY.value, 
      object.dashboardData.data.AnnualCostPerMailbox.CostPerMailbox.LowerCY.kpiCode, 
      object.dashboardData.data.AnnualCostPerMailbox.CostPerDevice.MailboxCY.label, 
      object.dashboardData.data.AnnualCostPerMailbox.CostPerDevice.MailboxCY.value,
      object.dashboardData.data.AnnualCostPerMailbox.CostPerDevice.MailboxCY.kpiCode);

    // "# of Devices Per FTE",
    object.groupMainframeUpperLowerKPIs(object.workPlaceKPIGroupList[8],
      object.dashboardData.data.NumberofDevicesPerFTE.DevicesPerFTE.Upper.label,
      object.dashboardData.data.NumberofDevicesPerFTE.DevicesPerFTE.Upper.value, 
      object.dashboardData.data.NumberofDevicesPerFTE.DevicesPerFTE.Upper.kpiCode, 
      object.dashboardData.data.NumberofDevicesPerFTE.DevicesPerFTE.Lower.label, 
      object.dashboardData.data.NumberofDevicesPerFTE.DevicesPerFTE.Lower.value, 
      object.dashboardData.data.NumberofDevicesPerFTE.DevicesPerFTE.Lower.kpiCode, 
      object.dashboardData.data.NumberofDevicesPerFTE.DevicesPerFTE.Number.label, 
      object.dashboardData.data.NumberofDevicesPerFTE.DevicesPerFTE.Number.value,
      object.dashboardData.data.NumberofDevicesPerFTE.DevicesPerFTE.Number.kpiCode);

      //   "Staffing Mix - Employee"
object.groupMainframeUpperLowerKPIs(object.workPlaceKPIGroupList[9],
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.label,
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.value, 
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.kpiCode, 
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.label, 
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.value, 
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.kpiCode, 
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.label, 
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.value,
  object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.kpiCode);

//   "Staffing Mix - Contractor",
object.groupMainframeUpperLowerKPIs(object.workPlaceKPIGroupList[10],
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.label,
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.value, 
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.kpiCode, 
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.label, 
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.value, 
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.kpiCode, 
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.label, 
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.value,
  object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.kpiCode);

// "PC Deployment Time",
object.groupMainframeUpperLowerKPIs(object.workPlaceKPIGroupList[11],
  object.dashboardData.data.AverageDeploymentTimeindays.WorkplaceServicesDeployTime.Upper.label,
  object.dashboardData.data.AverageDeploymentTimeindays.WorkplaceServicesDeployTime.Upper.value, 
  object.dashboardData.data.AverageDeploymentTimeindays.WorkplaceServicesDeployTime.Upper.kpiCode, 
  object.dashboardData.data.AverageDeploymentTimeindays.WorkplaceServicesDeployTime.Lower.label, 
  object.dashboardData.data.AverageDeploymentTimeindays.WorkplaceServicesDeployTime.Lower.value, 
  object.dashboardData.data.AverageDeploymentTimeindays.WorkplaceServicesDeployTime.Lower.kpiCode, 
  object.dashboardData.data.AverageDeploymentTimeindays.WorkplaceServicesDeployTime.Mean.label, 
  object.dashboardData.data.AverageDeploymentTimeindays.WorkplaceServicesDeployTime.Mean.value,
  object.dashboardData.data.AverageDeploymentTimeindays.WorkplaceServicesDeployTime.Mean.kpiCode);

  // "Incident Response Time",
  object.groupMainframeUpperLowerKPIs(object.workPlaceKPIGroupList[12],
    object.dashboardData.data.IncidentResponseTime.WorkplaceServices.P2.label,
    object.dashboardData.data.IncidentResponseTime.WorkplaceServices.P2.value, 
    object.dashboardData.data.IncidentResponseTime.WorkplaceServices.P2.kpiCode, 
    object.dashboardData.data.IncidentResponseTime.WorkplaceServices.P3.label, 
    object.dashboardData.data.IncidentResponseTime.WorkplaceServices.P3.value, 
    object.dashboardData.data.IncidentResponseTime.WorkplaceServices.P3.kpiCode, 
    object.dashboardData.data.IncidentResponseTime.WorkplaceServices.P1.label, 
    object.dashboardData.data.IncidentResponseTime.WorkplaceServices.P1.value,
    object.dashboardData.data.IncidentResponseTime.WorkplaceServices.P1.kpiCode);


  // "PC Refresh Rate",
  object.groupMainframeUpperLowerKPIs(object.workPlaceKPIGroupList[13],
    object.dashboardData.data.RefreshRateinYears.WorkplaceServicesRefreshRate.Upper.label,
    object.dashboardData.data.RefreshRateinYears.WorkplaceServicesRefreshRate.Upper.value, 
    object.dashboardData.data.RefreshRateinYears.WorkplaceServicesRefreshRate.Upper.kpiCode, 
    object.dashboardData.data.RefreshRateinYears.WorkplaceServicesRefreshRate.Lower.label, 
    object.dashboardData.data.RefreshRateinYears.WorkplaceServicesRefreshRate.Lower.value, 
    object.dashboardData.data.RefreshRateinYears.WorkplaceServicesRefreshRate.Lower.kpiCode, 
    object.dashboardData.data.RefreshRateinYears.WorkplaceServicesRefreshRate.Mean.label, 
    object.dashboardData.data.RefreshRateinYears.WorkplaceServicesRefreshRate.Mean.value,
    object.dashboardData.data.RefreshRateinYears.WorkplaceServicesRefreshRate.Mean.kpiCode);


  // "User Experience Score" 
  object.groupMainframeCostAllocationKPIs(object.workPlaceKPIGroupList[14],
    object.dashboardData.data.UserExperienceScore.OnsiteSupport.OnsiteSupport.label,
    object.dashboardData.data.UserExperienceScore.OnsiteSupport.OnsiteSupport.value, 
    object.dashboardData.data.UserExperienceScore.OnsiteSupport.OnsiteSupport.kpiCode, 
    object.dashboardData.data.UserExperienceScore.WorkplaceTechnology.WorkplaceTechnology.label, 
    object.dashboardData.data.UserExperienceScore.WorkplaceTechnology.WorkplaceTechnology.value, 
    object.dashboardData.data.UserExperienceScore.WorkplaceTechnology.WorkplaceTechnology.kpiCode, 
    object.dashboardData.data.UserExperienceScore.TechnologyProcurement.TechnologyProcurement.label, 
    object.dashboardData.data.UserExperienceScore.TechnologyProcurement.TechnologyProcurement.value,
    object.dashboardData.data.UserExperienceScore.TechnologyProcurement.TechnologyProcurement.kpiCode,
    object.dashboardData.data.UserExperienceScore.EmailSatisfaction.EmailSatisfaction.label, 
    object.dashboardData.data.UserExperienceScore.EmailSatisfaction.EmailSatisfaction.value,
    object.dashboardData.data.UserExperienceScore.EmailSatisfaction.EmailSatisfaction.kpiCode);


  

  object.mainframeDataLoaded =true;

}

createApplicationDevelopmentData()
{
  let object = this;
  object.customDataObject = [];
  object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.OnPremiseBusinessSystem.OnPremiseBusinessSystem.label = "On-Premise Enterprise Business Systems %";
  
  
 
  // "Application Development And Maintenance Cost Allocation",
  object.groupSixKPIs(object.applicationDevelopmentKPIGroupList[0],
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.Development.Cost.label,
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.Development.Cost.value, 
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.Development.Cost.kpiCode,
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.Maintenance.Cost.label,
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.Maintenance.Cost.value, 
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.Maintenance.Cost.kpiCode,
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.SaaS.SaaS.label,
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.SaaS.SaaS.value, 
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.SaaS.SaaS.kpiCode, 
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.OnPremiseBusinessSystem.OnPremiseBusinessSystem.label, 
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.OnPremiseBusinessSystem.OnPremiseBusinessSystem.value, 
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.OnPremiseBusinessSystem.OnPremiseBusinessSystem.kpiCode, 
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.COTS.COTS.label, 
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.COTS.COTS.value,
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.COTS.COTS.kpiCode,
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.Bespoke.Bespoke.label, 
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.Bespoke.Bespoke.value,
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.Bespoke.Bespoke.kpiCode);

    


    // "Application Development And Maintenance Staffing Mix ,
    object.groupSixKPIs(object.applicationDevelopmentKPIGroupList[1],
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixEmployee.AD.Employee.label,
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixEmployee.AD.Employee.value, 
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixEmployee.AD.Employee.kpiCode, 
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixEmployee.AM.Employee.label, 
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixEmployee.AM.Employee.value,
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixEmployee.AM.Employee.kpiCode,
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixContractor.AD.Contractor.label,
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixContractor.AD.Contractor.value, 
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixContractor.AD.Contractor.kpiCode, 
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixContractor.AM.Contractor.label, 
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixContractor.AM.Contractor.value,
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixContractor.AM.Contractor.kpiCode,
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixManagedServices.AD.Services.label,
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixManagedServices.AD.Services.value, 
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixManagedServices.AD.Services.kpiCode, 
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixManagedServices.AM.Services.label, 
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixManagedServices.AM.Services.value,
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixManagedServices.AM.Services.kpiCode
    );

    // "Application Development Cost Allocation",
    object.groupMainframeUpperLowerKPIs(object.applicationDevelopmentKPIGroupList[2],
      object.dashboardData.data.ApplicationDevelopmentCostAllocation.CostAllocationEmp.Number.label,
      object.dashboardData.data.ApplicationDevelopmentCostAllocation.CostAllocationEmp.Number.value, 
      object.dashboardData.data.ApplicationDevelopmentCostAllocation.CostAllocationEmp.Number.kpiCode, 
      object.dashboardData.data.ApplicationDevelopmentCostAllocation.CostAllocationOS.Number.label, 
      object.dashboardData.data.ApplicationDevelopmentCostAllocation.CostAllocationOS.Number.value, 
      object.dashboardData.data.ApplicationDevelopmentCostAllocation.CostAllocationOS.Number.kpiCode, 
      object.dashboardData.data.ApplicationDevelopmentCostAllocation.CostAllocationSW.Number.label, 
      object.dashboardData.data.ApplicationDevelopmentCostAllocation.CostAllocationSW.Number.value,
      object.dashboardData.data.ApplicationDevelopmentCostAllocation.CostAllocationSW.Number.kpiCode);
 
      // "Average Build Time",
      object.groupMainframeUpperLowerKPIs(object.applicationDevelopmentKPIGroupList[3],
        object.dashboardData.data.AverageBuildTime.AverageBuildTime.Upper.label,
        object.dashboardData.data.AverageBuildTime.AverageBuildTime.Upper.value, 
        object.dashboardData.data.AverageBuildTime.AverageBuildTime.Upper.kpiCode, 
        object.dashboardData.data.AverageBuildTime.AverageBuildTime.Lower.label, 
        object.dashboardData.data.AverageBuildTime.AverageBuildTime.Lower.value, 
        object.dashboardData.data.AverageBuildTime.AverageBuildTime.Lower.kpiCode, 
        object.dashboardData.data.AverageBuildTime.AverageBuildTime.Number.label, 
        object.dashboardData.data.AverageBuildTime.AverageBuildTime.Number.value,
        object.dashboardData.data.AverageBuildTime.AverageBuildTime.Number.kpiCode);
   
      // "Automated Testing %",
      object.groupMainframeUpperLowerKPIs(object.applicationDevelopmentKPIGroupList[4],
          object.dashboardData.data.AutomatedTesting.AutomatedTesting.Upper.label,
          object.dashboardData.data.AutomatedTesting.AutomatedTesting.Upper.value, 
          object.dashboardData.data.AutomatedTesting.AutomatedTesting.Upper.kpiCode, 
          object.dashboardData.data.AutomatedTesting.AutomatedTesting.Lower.label, 
          object.dashboardData.data.AutomatedTesting.AutomatedTesting.Lower.value, 
          object.dashboardData.data.AutomatedTesting.AutomatedTesting.Lower.kpiCode, 
          object.dashboardData.data.AutomatedTesting.AutomatedTesting.Number.label, 
          object.dashboardData.data.AutomatedTesting.AutomatedTesting.Number.value,
          object.dashboardData.data.AutomatedTesting.AutomatedTesting.Number.kpiCode);

        // "Development Methodology",
        object.groupFiveElements(object.applicationDevelopmentKPIGroupList[5],
          object.dashboardData.data.DevelopmentMethodology.DevelopmentMethodology.Waterfall.label,
          object.dashboardData.data.DevelopmentMethodology.DevelopmentMethodology.Waterfall.value, 
          object.dashboardData.data.DevelopmentMethodology.DevelopmentMethodology.Waterfall.kpiCode, 
          object.dashboardData.data.DevelopmentMethodology.DevelopmentMethodology.Agile.label, 
          object.dashboardData.data.DevelopmentMethodology.DevelopmentMethodology.Agile.value, 
          object.dashboardData.data.DevelopmentMethodology.DevelopmentMethodology.Agile.kpiCode, 
          object.dashboardData.data.DevelopmentMethodology.DevelopmentMethodology.Hybrid.label, 
          object.dashboardData.data.DevelopmentMethodology.DevelopmentMethodology.Hybrid.value,
          object.dashboardData.data.DevelopmentMethodology.DevelopmentMethodology.Hybrid.kpiCode,
          object.dashboardData.data.DevelopmentMethodology.DevelopmentMethodology.None.label, 
          object.dashboardData.data.DevelopmentMethodology.DevelopmentMethodology.None.value,
          object.dashboardData.data.DevelopmentMethodology.DevelopmentMethodology.None.kpiCode,
          object.dashboardData.data.DevelopmentMethodology.DevelopmentMethodology.Other.label, 
          object.dashboardData.data.DevelopmentMethodology.DevelopmentMethodology.Other.value,
          object.dashboardData.data.DevelopmentMethodology.DevelopmentMethodology.Other.kpiCode);

      // "Annual Cost Per Application Development FTE - Employee",
      object.groupSixKPIs(object.applicationDevelopmentKPIGroupList[6],
        object.dashboardData.data.AnnualCostPerApplicationDevelopmentFTE.CostPerEmployee.Number.label, 
        object.dashboardData.data.AnnualCostPerApplicationDevelopmentFTE.CostPerEmployee.Number.value,
        object.dashboardData.data.AnnualCostPerApplicationDevelopmentFTE.CostPerEmployee.Number.kpiCode,
        object.dashboardData.data.AnnualCostPerApplicationDevelopmentFTE.CostPerEmployee.Upper.label,
        object.dashboardData.data.AnnualCostPerApplicationDevelopmentFTE.CostPerEmployee.Upper.value, 
        object.dashboardData.data.AnnualCostPerApplicationDevelopmentFTE.CostPerEmployee.Upper.kpiCode, 
        object.dashboardData.data.AnnualCostPerApplicationDevelopmentFTE.CostPerEmployee.Lower.label, 
        object.dashboardData.data.AnnualCostPerApplicationDevelopmentFTE.CostPerEmployee.Lower.value, 
        object.dashboardData.data.AnnualCostPerApplicationDevelopmentFTE.CostPerEmployee.Lower.kpiCode,
        object.dashboardData.data.AnnualCostPerApplicationDevelopmentFTE.CostPerContractor.Number.label, 
        object.dashboardData.data.AnnualCostPerApplicationDevelopmentFTE.CostPerContractor.Number.value,
        object.dashboardData.data.AnnualCostPerApplicationDevelopmentFTE.CostPerContractor.Number.kpiCode,
        object.dashboardData.data.AnnualCostPerApplicationDevelopmentFTE.CostPerContractor.Upper.label,
        object.dashboardData.data.AnnualCostPerApplicationDevelopmentFTE.CostPerContractor.Upper.value, 
        object.dashboardData.data.AnnualCostPerApplicationDevelopmentFTE.CostPerContractor.Upper.kpiCode, 
      object.dashboardData.data.AnnualCostPerApplicationDevelopmentFTE.CostPerContractor.Lower.label, 
      object.dashboardData.data.AnnualCostPerApplicationDevelopmentFTE.CostPerContractor.Lower.value, 
      object.dashboardData.data.AnnualCostPerApplicationDevelopmentFTE.CostPerContractor.Lower.kpiCode);


    // "Staffing Mix Employee",
    object.groupNineElements(object.applicationDevelopmentKPIGroupList[8], 
      object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.label, 
      object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.value,
      object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.kpiCode,
      object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.label,
      object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.value, 
      object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.kpiCode, 
      object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.label, 
      object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.value, 
      object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.kpiCode, 
      object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.label, 
      object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.value,
      object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.kpiCode,
      object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.label,
      object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.value, 
      object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.kpiCode, 
      object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.label, 
      object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.value, 
      object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.kpiCode,  
      object.dashboardData.data.StaffingMix.StaffingMixManagedServices.Number.label, 
      object.dashboardData.data.StaffingMix.StaffingMixManagedServices.Number.value,
      object.dashboardData.data.StaffingMix.StaffingMixManagedServices.Number.kpiCode,
      object.dashboardData.data.StaffingMix.StaffingMixManagedServices.Upper.label,
      object.dashboardData.data.StaffingMix.StaffingMixManagedServices.Upper.value, 
      object.dashboardData.data.StaffingMix.StaffingMixManagedServices.Upper.kpiCode, 
      object.dashboardData.data.StaffingMix.StaffingMixManagedServices.Lower.label, 
      object.dashboardData.data.StaffingMix.StaffingMixManagedServices.Lower.value, 
      object.dashboardData.data.StaffingMix.StaffingMixManagedServices.Lower.kpiCode);
    


        // "offshore %",
        object.groupMainframeUpperLowerKPIs(object.applicationDevelopmentKPIGroupList[11],
          object.dashboardData.data.Offshore.Offshore.Upper.label,
          object.dashboardData.data.Offshore.Offshore.Upper.value, 
          object.dashboardData.data.Offshore.Offshore.Upper.kpiCode, 
          object.dashboardData.data.Offshore.Offshore.Lower.label, 
          object.dashboardData.data.Offshore.Offshore.Lower.value, 
          object.dashboardData.data.Offshore.Offshore.Lower.kpiCode, 
          object.dashboardData.data.Offshore.Offshore.Number.label, 
          object.dashboardData.data.Offshore.Offshore.Number.value,
          object.dashboardData.data.Offshore.Offshore.Number.kpiCode);

         // "On Time Delivery %", 
         object.groupMainframeUpperLowerKPIs(object.applicationDevelopmentKPIGroupList[12],
          object.dashboardData.data.OnTimeDelivery.OnTimeDelivery.Upper.label,
          object.dashboardData.data.OnTimeDelivery.OnTimeDelivery.Upper.value, 
          object.dashboardData.data.OnTimeDelivery.OnTimeDelivery.Upper.kpiCode, 
          object.dashboardData.data.OnTimeDelivery.OnTimeDelivery.Lower.label, 
          object.dashboardData.data.OnTimeDelivery.OnTimeDelivery.Lower.value, 
          object.dashboardData.data.OnTimeDelivery.OnTimeDelivery.Lower.kpiCode, 
          object.dashboardData.data.OnTimeDelivery.OnTimeDelivery.Number.label, 
          object.dashboardData.data.OnTimeDelivery.OnTimeDelivery.Number.value,
          object.dashboardData.data.OnTimeDelivery.OnTimeDelivery.Number.kpiCode);

          // "On Budget Delivery %",
          object.groupMainframeUpperLowerKPIs(object.applicationDevelopmentKPIGroupList[13],
            object.dashboardData.data.OnBudgetDelivery.OnBudget.Upper.label,
            object.dashboardData.data.OnBudgetDelivery.OnBudget.Upper.value, 
            object.dashboardData.data.OnBudgetDelivery.OnBudget.Upper.kpiCode, 
            object.dashboardData.data.OnBudgetDelivery.OnBudget.Lower.label, 
            object.dashboardData.data.OnBudgetDelivery.OnBudget.Lower.value, 
            object.dashboardData.data.OnBudgetDelivery.OnBudget.Lower.kpiCode, 
            object.dashboardData.data.OnBudgetDelivery.OnBudget.Number.label, 
            object.dashboardData.data.OnBudgetDelivery.OnBudget.Number.value,
            object.dashboardData.data.OnBudgetDelivery.OnBudget.Number.kpiCode);
  
      // "Application Release Rate",        
      object.groupMainframeUpperLowerKPIs(object.applicationDevelopmentKPIGroupList[14],
        object.dashboardData.data.ApplicationReleaseRate.ReleasesPerApplication.Upper.label,
        object.dashboardData.data.ApplicationReleaseRate.ReleasesPerApplication.Upper.value, 
        object.dashboardData.data.ApplicationReleaseRate.ReleasesPerApplication.Upper.kpiCode, 
        object.dashboardData.data.ApplicationReleaseRate.ReleasesPerApplication.Lower.label, 
        object.dashboardData.data.ApplicationReleaseRate.ReleasesPerApplication.Lower.value, 
        object.dashboardData.data.ApplicationReleaseRate.ReleasesPerApplication.Lower.kpiCode, 
        object.dashboardData.data.ApplicationReleaseRate.ReleasesPerApplication.Number.label, 
        object.dashboardData.data.ApplicationReleaseRate.ReleasesPerApplication.Number.value,
        object.dashboardData.data.ApplicationReleaseRate.ReleasesPerApplication.Number.kpiCode);

        // "Cost Per Hour Worked -cost per hour",
        object.groupMainframeUpperLowerKPIs(object.applicationDevelopmentKPIGroupList[15],
          object.dashboardData.data.CostPerHourWorked.CostPerHour.UpperCY.label,
          object.dashboardData.data.CostPerHourWorked.CostPerHour.UpperCY.value, 
          object.dashboardData.data.CostPerHourWorked.CostPerHour.UpperCY.kpiCode, 
          object.dashboardData.data.CostPerHourWorked.CostPerHour.LowerCY.label, 
          object.dashboardData.data.CostPerHourWorked.CostPerHour.LowerCY.value, 
          object.dashboardData.data.CostPerHourWorked.CostPerHour.LowerCY.kpiCode, 
          object.dashboardData.data.CostPerHourWorked.CostPerHour.NumberCY.label, 
          object.dashboardData.data.CostPerHourWorked.CostPerHour.NumberCY.value,
          object.dashboardData.data.CostPerHourWorked.CostPerHour.NumberCY.kpiCode);

          //cost per hour drill down
          object.groupFourDrillDownElements(object.applicationDevelopmentKPIGroupList[15],
            '',
          object.dashboardData.drills.TCOPerHourWorkedCurrentYear[0].label,
          object.dashboardData.drills.TCOPerHourWorkedCurrentYear[0].value,
          object.dashboardData.drills.TCOPerHourWorkedCurrentYear[0].kpiCode,
          object.dashboardData.drills.TCOPerHourWorkedCurrentYear[1].label,
          object.dashboardData.drills.TCOPerHourWorkedCurrentYear[1].value,
          object.dashboardData.drills.TCOPerHourWorkedCurrentYear[1].kpiCode,
          object.dashboardData.drills.TCOPerHourWorkedCurrentYear[2].label,
          object.dashboardData.drills.TCOPerHourWorkedCurrentYear[2].value,
          object.dashboardData.drills.TCOPerHourWorkedCurrentYear[2].kpiCode,
          object.dashboardData.drills.TCOPerHourWorkedCurrentYear[3].label,
          object.dashboardData.drills.TCOPerHourWorkedCurrentYear[3].value,
          object.dashboardData.drills.TCOPerHourWorkedCurrentYear[3].kpiCode)
     
          // "Cost Per Hour Worked -price per hour",
     object.groupMainframeUpperLowerKPIs(object.applicationDevelopmentKPIGroupList[16],
      object.dashboardData.data.CostPerHourWorked.PricePerHour.UpperCY.label,
      object.dashboardData.data.CostPerHourWorked.PricePerHour.UpperCY.value, 
      object.dashboardData.data.CostPerHourWorked.PricePerHour.UpperCY.kpiCode, 
      object.dashboardData.data.CostPerHourWorked.PricePerHour.LowerCY.label, 
      object.dashboardData.data.CostPerHourWorked.PricePerHour.LowerCY.value, 
      object.dashboardData.data.CostPerHourWorked.PricePerHour.LowerCY.kpiCode, 
      object.dashboardData.data.CostPerHourWorked.PricePerHour.NumberCY.label, 
      object.dashboardData.data.CostPerHourWorked.PricePerHour.NumberCY.value,
      object.dashboardData.data.CostPerHourWorked.PricePerHour.NumberCY.kpiCode);

      //price per hour drill down
      object.groupFourDrillDownElements(object.applicationDevelopmentKPIGroupList[16],
        '',
      object.dashboardData.drills.PricePerHourWorkedCurrentYear[0].label,
      object.dashboardData.drills.PricePerHourWorkedCurrentYear[0].value,
      object.dashboardData.drills.PricePerHourWorkedCurrentYear[0].kpiCode,
      object.dashboardData.drills.PricePerHourWorkedCurrentYear[1].label,
      object.dashboardData.drills.PricePerHourWorkedCurrentYear[1].value,
      object.dashboardData.drills.PricePerHourWorkedCurrentYear[1].kpiCode,
      object.dashboardData.drills.PricePerHourWorkedCurrentYear[2].label,
      object.dashboardData.drills.PricePerHourWorkedCurrentYear[2].value,
      object.dashboardData.drills.PricePerHourWorkedCurrentYear[2].kpiCode,
      object.dashboardData.drills.PricePerHourWorkedCurrentYear[3].label,
      object.dashboardData.drills.PricePerHourWorkedCurrentYear[3].value,
      object.dashboardData.drills.PricePerHourWorkedCurrentYear[3].kpiCode)
 

       // "Project Effort Allocation"
      object.groupForteenKPIs(object.applicationDevelopmentKPIGroupList[17],
        object.dashboardData.data.AnnualProjectEffortAllocation.Onshore.StrategyAndPlanning.label,
        object.dashboardData.data.AnnualProjectEffortAllocation.Onshore.StrategyAndPlanning.value,
        object.dashboardData.data.AnnualProjectEffortAllocation.Onshore.StrategyAndPlanning.kpiCode,
        object.dashboardData.data.AnnualProjectEffortAllocation.Onshore.Requirements.label,
        object.dashboardData.data.AnnualProjectEffortAllocation.Onshore.Requirements.value,
        object.dashboardData.data.AnnualProjectEffortAllocation.Onshore.Requirements.kpiCode,
        object.dashboardData.data.AnnualProjectEffortAllocation.Onshore.Design.label,
        object.dashboardData.data.AnnualProjectEffortAllocation.Onshore.Design.value,
        object.dashboardData.data.AnnualProjectEffortAllocation.Onshore.Design.kpiCode,
        object.dashboardData.data.AnnualProjectEffortAllocation.Onshore.Coding.label,
        object.dashboardData.data.AnnualProjectEffortAllocation.Onshore.Coding.value,
        object.dashboardData.data.AnnualProjectEffortAllocation.Onshore.Coding.kpiCode,
        object.dashboardData.data.AnnualProjectEffortAllocation.Onshore.Testing.label,
        object.dashboardData.data.AnnualProjectEffortAllocation.Onshore.Testing.value,
        object.dashboardData.data.AnnualProjectEffortAllocation.Onshore.Testing.kpiCode,
        object.dashboardData.data.AnnualProjectEffortAllocation.Onshore.Implement.label,
        object.dashboardData.data.AnnualProjectEffortAllocation.Onshore.Implement.value,
        object.dashboardData.data.AnnualProjectEffortAllocation.Onshore.Implement.kpiCode,
        object.dashboardData.data.AnnualProjectEffortAllocation.Onshore.Sustain.label,
        object.dashboardData.data.AnnualProjectEffortAllocation.Onshore.Sustain.value,
        object.dashboardData.data.AnnualProjectEffortAllocation.Onshore.Sustain.kpiCode,
        object.dashboardData.data.AnnualProjectEffortAllocation.Offshore.StrategyAndPlanning.label,
        object.dashboardData.data.AnnualProjectEffortAllocation.Offshore.StrategyAndPlanning.value,
        object.dashboardData.data.AnnualProjectEffortAllocation.Offshore.StrategyAndPlanning.kpiCode,
        object.dashboardData.data.AnnualProjectEffortAllocation.Offshore.Requirements.label,
        object.dashboardData.data.AnnualProjectEffortAllocation.Offshore.Requirements.value,
        object.dashboardData.data.AnnualProjectEffortAllocation.Offshore.Requirements.kpiCode,
        object.dashboardData.data.AnnualProjectEffortAllocation.Offshore.Design.label,
        object.dashboardData.data.AnnualProjectEffortAllocation.Offshore.Design.value,
        object.dashboardData.data.AnnualProjectEffortAllocation.Offshore.Design.kpiCode,
        object.dashboardData.data.AnnualProjectEffortAllocation.Offshore.Coding.label,
        object.dashboardData.data.AnnualProjectEffortAllocation.Offshore.Coding.value,
        object.dashboardData.data.AnnualProjectEffortAllocation.Offshore.Coding.kpiCode,
        object.dashboardData.data.AnnualProjectEffortAllocation.Offshore.Testing.label,
        object.dashboardData.data.AnnualProjectEffortAllocation.Offshore.Testing.value,
        object.dashboardData.data.AnnualProjectEffortAllocation.Offshore.Testing.kpiCode,
        object.dashboardData.data.AnnualProjectEffortAllocation.Offshore.Implement.label,
        object.dashboardData.data.AnnualProjectEffortAllocation.Offshore.Implement.value,
        object.dashboardData.data.AnnualProjectEffortAllocation.Offshore.Implement.kpiCode,
        object.dashboardData.data.AnnualProjectEffortAllocation.Offshore.Sustain.label,
        object.dashboardData.data.AnnualProjectEffortAllocation.Offshore.Sustain.value,
        object.dashboardData.data.AnnualProjectEffortAllocation.Offshore.Sustain.kpiCode
      )
 

  

  object.mainframeDataLoaded =true;

}

groupSixKPIs(kpiheader,
  element1label, element1value, element1code,
  element2label, element2value, element2code,
  element3label, element3value, element3code,
  element4label, element4value, element4code,
  element5label, element5value, element5code,
  element6label, element6value, element6code)
{
  let object = this;
  
    //element1
    var element1 = element1label;
    var element1Value = element1value;
    var element1Code = element1code;
    var element1tmp = {
      "kpiElementLabel" : element1,
      "kpiElementValue" : element1Value,
      "kpiElementCode" : element1Code
    }
  
    //element2
    var element2 = element2label;
    var element2Value = element2value;
    var element2Code = element2code;
    var element2tmp = {
      "kpiElementLabel" : element2,
      "kpiElementValue" : element2Value,
      "kpiElementCode" : element2Code
    }
  
    //element3
    var element3 = element3label;
    var element3Value = element3value;
    var element3Code = element3code;
    var element3tmp = {
      "kpiElementLabel" : element3,
      "kpiElementValue" : element3Value,
      "kpiElementCode" : element3Code
    }
  
    //element4
    var element4 = element4label;
    var element4Value = element4value;
    var element4Code = element4code;
    var element4tmp = {
      "kpiElementLabel" : element4,
      "kpiElementValue" : element4Value,
      "kpiElementCode" : element4Code
    }
  
    //element5
    var element5 = element5label;
    var element5Value = element5value;
    var element5Code = element5code;
    var element5tmp = {
      "kpiElementLabel" : element5,
      "kpiElementValue" : element5Value,
      "kpiElementCode" : element5Code
    }
  
    //element6
    var element6 = element6label;
    var element6Value = element6value;
    var element6Code = element6code;
    var element6tmp = {
      "kpiElementLabel" : element6,
      "kpiElementValue" : element6Value,
      "kpiElementCode" : element6Code
    }

  var dataObj =[];

  dataObj.push(element1tmp);
  dataObj.push(element2tmp);
  dataObj.push(element3tmp); 
  dataObj.push(element4tmp);
  dataObj.push(element5tmp);
  dataObj.push(element6tmp);

  var tempObj = {
    "headerLabel" : kpiheader,
    "dataObj" : dataObj
  }

  object.customDataObject.push(tempObj);

}

groupForteenKPIs(kpiheader,
  element1label,
      element1value,
      element1code,
      element2label,
      element2value,
      element2code,
      element3label,
      element3value,
      element3code,
      element4label,
      element4value,
      element4code,
      element5label,
      element5value,
      element5code,
      element6label,
      element6value,
      element6code,
      element7label,
      element7value,
      element7code,
      element8label,
      element8value,
      element8code,
      element9label,
      element9value,
      element9code,
      element10label,
      element10value,
      element10code,
      element11label,
      element11value,
      element11code,
      element12label,
        element12value,
        element12code,
        element13label,
        element13value,
        element13code,
        element14label,
        element14value,
        element14code)
{
let object = this;

     //element1
     var element1 = element1label;
     var element1Value = element1value;
     var element1Code = element1code;
     var element1tmp = {
       "kpiElementLabel" : element1,
       "kpiElementValue" : element1Value,
       "kpiElementCode" : element1Code
     }
   
     //element2
     var element2 = element2label;
     var element2Value = element2value;
     var element2Code = element2code;
     var element2tmp = {
       "kpiElementLabel" : element2,
       "kpiElementValue" : element2Value,
       "kpiElementCode" : element2Code
     }
   
     //element3
     var element3 = element3label;
     var element3Value = element3value;
     var element3Code = element3code;
     var element3tmp = {
       "kpiElementLabel" : element3,
       "kpiElementValue" : element3Value,
       "kpiElementCode" : element3Code
     }
   
     //element4
     var element4 = element4label;
     var element4Value = element4value;
     var element4Code = element4code;
     var element4tmp = {
       "kpiElementLabel" : element4,
       "kpiElementValue" : element4Value,
       "kpiElementCode" : element4Code
     }
   
     //element5
     var element5 = element5label;
     var element5Value = element5value;
     var element5Code = element5code;
     var element5tmp = {
       "kpiElementLabel" : element5,
       "kpiElementValue" : element5Value,
       "kpiElementCode" : element5Code
     }
   
     //element6
     var element6 = element6label;
     var element6Value = element6value;
     var element6Code = element6code;
     var element6tmp = {
       "kpiElementLabel" : element6,
       "kpiElementValue" : element6Value,
       "kpiElementCode" : element6Code
     }
   
     //element7
     var element7 = element7label;
     var element7Value = element7value;
     var element7Code = element7code;
     var element7tmp = {
       "kpiElementLabel" : element7,
       "kpiElementValue" : element7Value,
       "kpiElementCode" : element7Code
     }
   
    
     //element8
     var element8 = element8label;
     var element8Value = element8value;
     var element8Code = element8code;
     var element8tmp = {
       "kpiElementLabel" : element8,
       "kpiElementValue" : element8Value,
       "kpiElementCode" : element8Code
     }
   
   
       //element9
       var element9 = element9label;
       var element9Value = element9value;
       var element9Code = element9code;
       var element9tmp = {
         "kpiElementLabel" : element9,
         "kpiElementValue" : element9Value,
         "kpiElementCode" : element9Code
       }
     
       //element10
       var element10 = element10label;
       var element10Value = element10value;
       var element10Code = element10code;
       var element10tmp = {
         "kpiElementLabel" : element10,
         "kpiElementValue" : element10Value,
         "kpiElementCode" : element10Code
       }
   
         //element11
         var element11 = element11label;
         var element11Value = element11value;
         var element11Code = element11code;
         var element11tmp = {
           "kpiElementLabel" : element11,
           "kpiElementValue" : element11Value,
           "kpiElementCode" : element11Code
         }
       
         //element12
         var element12 = element12label;
         var element12Value = element12value;
         var element12Code = element12code;
         var element12tmp = {
           "kpiElementLabel" : element12,
           "kpiElementValue" : element12Value,
           "kpiElementCode" : element12Code
         }
   
         //element13
         var element13 = element13label;
         var element13Value = element13value;
         var element13Code = element13code;
         var element13tmp = {
           "kpiElementLabel" : element13,
           "kpiElementValue" : element13Value,
           "kpiElementCode" : element13Code
         }
   
//element14
var element14 = element14label;
var element14Value = element14value;
var element14Code = element14code;
var element14tmp = {
  "kpiElementLabel" : element14,
  "kpiElementValue" : element14Value,
  "kpiElementCode" : element14Code
}

var dataObj =[];

dataObj.push(element1tmp);
dataObj.push(element2tmp);
dataObj.push(element3tmp); 
dataObj.push(element4tmp);
dataObj.push(element5tmp);
dataObj.push(element6tmp);
dataObj.push(element7tmp);
dataObj.push(element8tmp);
dataObj.push(element9tmp); 
dataObj.push(element10tmp);
dataObj.push(element11tmp);
dataObj.push(element12tmp);
dataObj.push(element13tmp);
dataObj.push(element14tmp);

var tempObj = {
  "headerLabel" : kpiheader,
  "dataObj" : dataObj
}

object.customDataObject.push(tempObj);

}

//Tilottama - Storage, Service Desk and AM data creation functions & (group six kpis function started remove this six kpi fun) started
createStorageData(){
  let object = this;
  object.customDataObject = [];

  //cost allocation
  object.groupMainframeCostAllocationKPIs(object.storageKPIGroupList[10],
    object.dashboardData.data.TotalStorageCostAllocation.CostAllocationEmp.Number.label,
    object.dashboardData.data.TotalStorageCostAllocation.CostAllocationEmp.Number.value,
    object.dashboardData.data.TotalStorageCostAllocation.CostAllocationEmp.Number.kpiCode,
    object.dashboardData.data.TotalStorageCostAllocation.CostAllocationHW.Number.label,
    object.dashboardData.data.TotalStorageCostAllocation.CostAllocationHW.Number.value,
    object.dashboardData.data.TotalStorageCostAllocation.CostAllocationHW.Number.kpiCode,
    object.dashboardData.data.TotalStorageCostAllocation.CostAllocationSW.Number.label,
    object.dashboardData.data.TotalStorageCostAllocation.CostAllocationSW.Number.value,
    object.dashboardData.data.TotalStorageCostAllocation.CostAllocationSW.Number.kpiCode,
    object.dashboardData.data.TotalStorageCostAllocation.CostAllocationOS.Number.label,
    object.dashboardData.data.TotalStorageCostAllocation.CostAllocationOS.Number.value,
    object.dashboardData.data.TotalStorageCostAllocation.CostAllocationOS.Number.kpiCode
    );

    //cost allocation drilldown
    //personnel
    object.groupEightDrillDownElements(object.storageKPIGroupList[10],
      'Personnel',
      object.dashboardData.drills.PersonnelCostAllocation[0].label,
      object.dashboardData.drills.PersonnelCostAllocation[0].value,
      object.dashboardData.drills.PersonnelCostAllocation[0].kpiCode,
      object.dashboardData.drills.PersonnelCostAllocation[1].label,
      object.dashboardData.drills.PersonnelCostAllocation[1].value,
      object.dashboardData.drills.PersonnelCostAllocation[1].kpiCode,
      object.dashboardData.drills.PersonnelCostAllocation[2].label,
      object.dashboardData.drills.PersonnelCostAllocation[2].value,
      object.dashboardData.drills.PersonnelCostAllocation[2].kpiCode,
      object.dashboardData.drills.PersonnelCostAllocation[3].label,
      object.dashboardData.drills.PersonnelCostAllocation[3].value,
      object.dashboardData.drills.PersonnelCostAllocation[3].kpiCode,
      object.dashboardData.drills.PersonnelCostAllocation[4].label,
      object.dashboardData.drills.PersonnelCostAllocation[4].value,
      object.dashboardData.drills.PersonnelCostAllocation[4].kpiCode,
      object.dashboardData.drills.PersonnelCostAllocation[5].label,
      object.dashboardData.drills.PersonnelCostAllocation[5].value,
      object.dashboardData.drills.PersonnelCostAllocation[5].kpiCode,
      object.dashboardData.drills.PersonnelCostAllocation[6].label,
      object.dashboardData.drills.PersonnelCostAllocation[6].value,
      object.dashboardData.drills.PersonnelCostAllocation[6].kpiCode,
      object.dashboardData.drills.PersonnelCostAllocation[7].label,
      object.dashboardData.drills.PersonnelCostAllocation[7].value,
      object.dashboardData.drills.PersonnelCostAllocation[7].kpiCode
    );

    //hardware
    object.groupSevenDrillDownElements(object.storageKPIGroupList[10],
      'Hardware',
      object.dashboardData.drills.HardwareCostAllocation[0].label,
      object.dashboardData.drills.HardwareCostAllocation[0].value,
      object.dashboardData.drills.HardwareCostAllocation[0].kpiCode,
      object.dashboardData.drills.HardwareCostAllocation[1].label,
      object.dashboardData.drills.HardwareCostAllocation[1].value,
      object.dashboardData.drills.HardwareCostAllocation[1].kpiCode,
      object.dashboardData.drills.HardwareCostAllocation[2].label,
      object.dashboardData.drills.HardwareCostAllocation[2].value,
      object.dashboardData.drills.HardwareCostAllocation[2].kpiCode,
      object.dashboardData.drills.HardwareCostAllocation[3].label,
      object.dashboardData.drills.HardwareCostAllocation[3].value,
      object.dashboardData.drills.HardwareCostAllocation[3].kpiCode,
      object.dashboardData.drills.HardwareCostAllocation[4].label,
      object.dashboardData.drills.HardwareCostAllocation[4].value,
      object.dashboardData.drills.HardwareCostAllocation[4].kpiCode,
      object.dashboardData.drills.HardwareCostAllocation[5].label,
      object.dashboardData.drills.HardwareCostAllocation[5].value,
      object.dashboardData.drills.HardwareCostAllocation[5].kpiCode,
      object.dashboardData.drills.HardwareCostAllocation[6].label,
      object.dashboardData.drills.HardwareCostAllocation[6].value,
      object.dashboardData.drills.HardwareCostAllocation[6].kpiCode
    );


    //software
    object.groupSevenDrillDownElements(object.storageKPIGroupList[10],
      'Software',
      object.dashboardData.drills.SoftwareCostAllocation[0].label,
      object.dashboardData.drills.SoftwareCostAllocation[0].value,
      object.dashboardData.drills.SoftwareCostAllocation[0].kpiCode,
      object.dashboardData.drills.SoftwareCostAllocation[1].label,
      object.dashboardData.drills.SoftwareCostAllocation[1].value,
      object.dashboardData.drills.SoftwareCostAllocation[1].kpiCode,
      object.dashboardData.drills.SoftwareCostAllocation[2].label,
      object.dashboardData.drills.SoftwareCostAllocation[2].value,
      object.dashboardData.drills.SoftwareCostAllocation[2].kpiCode,
      object.dashboardData.drills.SoftwareCostAllocation[3].label,
      object.dashboardData.drills.SoftwareCostAllocation[3].value,
      object.dashboardData.drills.SoftwareCostAllocation[3].kpiCode,
      object.dashboardData.drills.SoftwareCostAllocation[4].label,
      object.dashboardData.drills.SoftwareCostAllocation[4].value,
      object.dashboardData.drills.SoftwareCostAllocation[4].kpiCode,
      object.dashboardData.drills.SoftwareCostAllocation[5].label,
      object.dashboardData.drills.SoftwareCostAllocation[5].value,
      object.dashboardData.drills.SoftwareCostAllocation[5].kpiCode,
      object.dashboardData.drills.SoftwareCostAllocation[6].label,
      object.dashboardData.drills.SoftwareCostAllocation[6].value,
      object.dashboardData.drills.SoftwareCostAllocation[6].kpiCode
    );

    //outsourcing
    //software
    object.groupTenDrillDownElements(object.storageKPIGroupList[10],
      'Outsourcing',
      object.dashboardData.drills.OutsourcingCostAllocation[0].label,
      object.dashboardData.drills.OutsourcingCostAllocation[0].value,
      object.dashboardData.drills.OutsourcingCostAllocation[0].kpiCode,
      object.dashboardData.drills.OutsourcingCostAllocation[1].label,
      object.dashboardData.drills.OutsourcingCostAllocation[1].value,
      object.dashboardData.drills.OutsourcingCostAllocation[1].kpiCode,
      object.dashboardData.drills.OutsourcingCostAllocation[2].label,
      object.dashboardData.drills.OutsourcingCostAllocation[2].value,
      object.dashboardData.drills.OutsourcingCostAllocation[2].kpiCode,
      object.dashboardData.drills.OutsourcingCostAllocation[3].label,
      object.dashboardData.drills.OutsourcingCostAllocation[3].value,
      object.dashboardData.drills.OutsourcingCostAllocation[3].kpiCode,
      object.dashboardData.drills.OutsourcingCostAllocation[4].label,
      object.dashboardData.drills.OutsourcingCostAllocation[4].value,
      object.dashboardData.drills.OutsourcingCostAllocation[4].kpiCode,
      object.dashboardData.drills.OutsourcingCostAllocation[5].label,
      object.dashboardData.drills.OutsourcingCostAllocation[5].value,
      object.dashboardData.drills.OutsourcingCostAllocation[5].kpiCode,
      object.dashboardData.drills.OutsourcingCostAllocation[6].label,
      object.dashboardData.drills.OutsourcingCostAllocation[6].value,
      object.dashboardData.drills.OutsourcingCostAllocation[6].kpiCode,
      object.dashboardData.drills.OutsourcingCostAllocation[7].label,
      object.dashboardData.drills.OutsourcingCostAllocation[7].value,
      object.dashboardData.drills.OutsourcingCostAllocation[7].kpiCode,
      object.dashboardData.drills.OutsourcingCostAllocation[8].label,
      object.dashboardData.drills.OutsourcingCostAllocation[8].value,
      object.dashboardData.drills.OutsourcingCostAllocation[8].kpiCode,
      object.dashboardData.drills.OutsourcingCostAllocation[9].label,
      object.dashboardData.drills.OutsourcingCostAllocation[9].value,
      object.dashboardData.drills.OutsourcingCostAllocation[9].kpiCode
    );
  

    //installed TB
    object.groupMainframeUpperLowerKPIs(object.storageKPIGroupList[6],
      object.dashboardData.data.AnnualCostPerInstalledTB.PricePerTB.UpperCY.label,
      object.dashboardData.data.AnnualCostPerInstalledTB.PricePerTB.UpperCY.value,
      object.dashboardData.data.AnnualCostPerInstalledTB.PricePerTB.UpperCY.kpiCode,
      object.dashboardData.data.AnnualCostPerInstalledTB.PricePerTB.LowerCY.label,
      object.dashboardData.data.AnnualCostPerInstalledTB.PricePerTB.LowerCY.value,
      object.dashboardData.data.AnnualCostPerInstalledTB.PricePerTB.LowerCY.kpiCode,
      object.dashboardData.data.AnnualCostPerInstalledTB.PricePerTB.NumberCY.label,
      object.dashboardData.data.AnnualCostPerInstalledTB.PricePerTB.NumberCY.value,
      object.dashboardData.data.AnnualCostPerInstalledTB.PricePerTB.NumberCY.kpiCode
      );

  
   object.groupMainframeUpperLowerKPIs(object.storageKPIGroupList[7],
    object.dashboardData.data.AnnualCostPerInstalledTB.CostPerTB.Upper.label,
    object.dashboardData.data.AnnualCostPerInstalledTB.CostPerTB.Upper.value,
    object.dashboardData.data.AnnualCostPerInstalledTB.CostPerTB.Upper.kpiCode,
    object.dashboardData.data.AnnualCostPerInstalledTB.CostPerTB.Lower.label,
    object.dashboardData.data.AnnualCostPerInstalledTB.CostPerTB.Lower.value,
    object.dashboardData.data.AnnualCostPerInstalledTB.CostPerTB.Lower.kpiCode,
    object.dashboardData.data.AnnualCostPerInstalledTB.CostPerTB.Number.label,
    object.dashboardData.data.AnnualCostPerInstalledTB.CostPerTB.Number.value,
    object.dashboardData.data.AnnualCostPerInstalledTB.CostPerTB.Number.kpiCode
    );

    
      //storage FTE

      object.groupMainframeUpperLowerKPIs(object.storageKPIGroupList[4],
        object.dashboardData.data.AnnualCostPerStorageFTE.CostPerEmployee.Upper.label,
        object.dashboardData.data.AnnualCostPerStorageFTE.CostPerEmployee.Upper.value,
        object.dashboardData.data.AnnualCostPerStorageFTE.CostPerEmployee.Upper.kpiCode,
        object.dashboardData.data.AnnualCostPerStorageFTE.CostPerEmployee.Lower.label,
        object.dashboardData.data.AnnualCostPerStorageFTE.CostPerEmployee.Lower.value,
        object.dashboardData.data.AnnualCostPerStorageFTE.CostPerEmployee.Lower.kpiCode,
        object.dashboardData.data.AnnualCostPerStorageFTE.CostPerEmployee.Number.label,
        object.dashboardData.data.AnnualCostPerStorageFTE.CostPerEmployee.Number.value,
        object.dashboardData.data.AnnualCostPerStorageFTE.CostPerEmployee.Number.kpiCode
        );
      

      object.groupMainframeUpperLowerKPIs(object.storageKPIGroupList[5],
        object.dashboardData.data.AnnualCostPerStorageFTE.CostPerContractor.Upper.label,
        object.dashboardData.data.AnnualCostPerStorageFTE.CostPerContractor.Upper.value,
        object.dashboardData.data.AnnualCostPerStorageFTE.CostPerContractor.Upper.kpiCode,
        object.dashboardData.data.AnnualCostPerStorageFTE.CostPerContractor.Lower.label,
        object.dashboardData.data.AnnualCostPerStorageFTE.CostPerContractor.Lower.value,
        object.dashboardData.data.AnnualCostPerStorageFTE.CostPerContractor.Lower.kpiCode,
        object.dashboardData.data.AnnualCostPerStorageFTE.CostPerContractor.Number.label,
        object.dashboardData.data.AnnualCostPerStorageFTE.CostPerContractor.Number.value,
        object.dashboardData.data.AnnualCostPerStorageFTE.CostPerContractor.Number.kpiCode
        );
      

        //utilization
        object.groupMainframeUpperLowerKPIs(object.storageKPIGroupList[3],
          object.dashboardData.data.Utilization.Utilization.Upper.label,
          object.dashboardData.data.Utilization.Utilization.Upper.value,
          object.dashboardData.data.Utilization.Utilization.Upper.kpiCode,
          object.dashboardData.data.Utilization.Utilization.Lower.label,
          object.dashboardData.data.Utilization.Utilization.Lower.value,
          object.dashboardData.data.Utilization.Utilization.Lower.kpiCode,
          object.dashboardData.data.Utilization.Utilization.Number.label,
          object.dashboardData.data.Utilization.Utilization.Number.value,
          object.dashboardData.data.Utilization.Utilization.Number.kpiCode
          );

          //availability

  object.groupMainframeUpperLowerKPIs(object.storageKPIGroupList[0],
    object.dashboardData.data.Availability.Availability.Upper.label,
    object.dashboardData.data.Availability.Availability.Upper.value,
    object.dashboardData.data.Availability.Availability.Upper.kpiCode,
    object.dashboardData.data.Availability.Availability.Lower.label,
    object.dashboardData.data.Availability.Availability.Lower.value,
    object.dashboardData.data.Availability.Availability.Lower.kpiCode,
    object.dashboardData.data.Availability.Availability.Number.label,
    object.dashboardData.data.Availability.Availability.Number.value,
    object.dashboardData.data.Availability.Availability.Number.kpiCode
    );

    //# storage FTE
    object.groupMainframeUpperLowerKPIs(object.storageKPIGroupList[9],
      object.dashboardData.data.NumberofStorageTBsPerFTE.TBsPerFTE.Upper.label,
      object.dashboardData.data.NumberofStorageTBsPerFTE.TBsPerFTE.Upper.value,
      object.dashboardData.data.NumberofStorageTBsPerFTE.TBsPerFTE.Upper.kpiCode,
      object.dashboardData.data.NumberofStorageTBsPerFTE.TBsPerFTE.Lower.label,
      object.dashboardData.data.NumberofStorageTBsPerFTE.TBsPerFTE.Lower.value,
      object.dashboardData.data.NumberofStorageTBsPerFTE.TBsPerFTE.Lower.kpiCode,
      object.dashboardData.data.NumberofStorageTBsPerFTE.TBsPerFTE.Number.label,
      object.dashboardData.data.NumberofStorageTBsPerFTE.TBsPerFTE.Number.value,
      object.dashboardData.data.NumberofStorageTBsPerFTE.TBsPerFTE.Number.kpiCode
      );
  
      //storage by type
      object.groupMainframeUpperLowerKPIs(object.storageKPIGroupList[8],
        object.dashboardData.data.StoragebyType.NAS.NAS.label,
        object.dashboardData.data.StoragebyType.NAS.NAS.value,
        object.dashboardData.data.StoragebyType.NAS.NAS.kpiCode,
        object.dashboardData.data.StoragebyType.Backup.Backup.label,
        object.dashboardData.data.StoragebyType.Backup.Backup.value,
        object.dashboardData.data.StoragebyType.Backup.Backup.kpiCode,
        object.dashboardData.data.StoragebyType.SAN.SAN.label,
        object.dashboardData.data.StoragebyType.SAN.SAN.value,
        object.dashboardData.data.StoragebyType.SAN.SAN.kpiCode
        );
      
  //staffing mix emp    

  object.groupMainframeUpperLowerKPIs(object.storageKPIGroupList[1],
    object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.label,
    object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.value,
    object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.kpiCode,
    object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.label,
    object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.value,
    object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.kpiCode,
    object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.label,
    object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.value,
    object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.kpiCode
    );

    //staffing mix contractor

 object.groupMainframeUpperLowerKPIs(object.storageKPIGroupList[2],
    object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.label,
    object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.value,
    object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.kpiCode,
    object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.label,
    object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.value,
    object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.kpiCode,
    object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.label,
    object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.value,
    object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.kpiCode
    );




  
  
  
    object.mainframeDataLoaded =true;
    
}

createServiceDeskData(){
  let object = this;
  object.customDataObject = [];
  
  
    
 
  //total cost allocation
  


  object.groupMainframeUpperLowerKPIs(object.serviceDeskKPIGroupList[6],
      object.dashboardData.data.TotalServiceDeskCostAllocation.CostAllocationEmp.Number.label,
      object.dashboardData.data.TotalServiceDeskCostAllocation.CostAllocationEmp.Number.value,
      object.dashboardData.data.TotalServiceDeskCostAllocation.CostAllocationEmp.Number.kpiCode,
      object.dashboardData.data.TotalServiceDeskCostAllocation.CostAllocationHWSW.Number.label,
      object.dashboardData.data.TotalServiceDeskCostAllocation.CostAllocationHWSW.Number.value,
      object.dashboardData.data.TotalServiceDeskCostAllocation.CostAllocationHWSW.Number.kpiCode,
      object.dashboardData.data.TotalServiceDeskCostAllocation.CostAllocationOS.Number.label,
      object.dashboardData.data.TotalServiceDeskCostAllocation.CostAllocationOS.Number.value,
      object.dashboardData.data.TotalServiceDeskCostAllocation.CostAllocationOS.Number.kpiCode
    );
  
        //drilldown

  




  //personnel
  object.groupFourDrillDownElements(object.serviceDeskKPIGroupList[6],
    'Personnel',
    object.dashboardData.drills.PersonnelCostAllocation[0].label,
    object.dashboardData.drills.PersonnelCostAllocation[0].value,
    object.dashboardData.drills.PersonnelCostAllocation[0].kpiCode,
    object.dashboardData.drills.PersonnelCostAllocation[1].label,
    object.dashboardData.drills.PersonnelCostAllocation[1].value,
    object.dashboardData.drills.PersonnelCostAllocation[1].kpiCode,
    object.dashboardData.drills.PersonnelCostAllocation[2].label,
    object.dashboardData.drills.PersonnelCostAllocation[2].value,
    object.dashboardData.drills.PersonnelCostAllocation[2].kpiCode,
    object.dashboardData.drills.PersonnelCostAllocation[3].label,
    object.dashboardData.drills.PersonnelCostAllocation[3].value,
    object.dashboardData.drills.PersonnelCostAllocation[3].kpiCode,
  );

  
  

  //hardware 
  object.groupTwoDrillDownElements(object.serviceDeskKPIGroupList[6],
    'Hardware & Software',
    object.dashboardData.drills.HardwareandSoftwareCostAllocation[0].label,
    object.dashboardData.drills.HardwareandSoftwareCostAllocation[0].value,
    object.dashboardData.drills.HardwareandSoftwareCostAllocation[0].kpiCode,
    object.dashboardData.drills.HardwareandSoftwareCostAllocation[1].label,
    object.dashboardData.drills.HardwareandSoftwareCostAllocation[1].value,
    object.dashboardData.drills.HardwareandSoftwareCostAllocation[1].kpiCode
  );

  

  //outsourcing
  object.groupThreeDrillDownElements(object.serviceDeskKPIGroupList[6],
    'Outsourcing',
    object.dashboardData.drills.OutsourcingCostAllocation[0].label,
    object.dashboardData.drills.OutsourcingCostAllocation[0].value,
    object.dashboardData.drills.OutsourcingCostAllocation[0].kpiCode,
    object.dashboardData.drills.OutsourcingCostAllocation[1].label,
    object.dashboardData.drills.OutsourcingCostAllocation[1].value,
    object.dashboardData.drills.OutsourcingCostAllocation[1].kpiCode,
    object.dashboardData.drills.OutsourcingCostAllocation[2].label,
    object.dashboardData.drills.OutsourcingCostAllocation[2].value,
   object.dashboardData.drills.OutsourcingCostAllocation[2].kpiCode
  );

  //annual cost per service desk user

  object.groupMainframeUpperLowerKPIs(object.serviceDeskKPIGroupList[7],
    object.dashboardData.data.AnnualCostPerServiceDeskUser.CostPerUser.UpperCY.label,
    object.dashboardData.data.AnnualCostPerServiceDeskUser.CostPerUser.UpperCY.value,
    object.dashboardData.data.AnnualCostPerServiceDeskUser.CostPerUser.UpperCY.kpiCode,
    object.dashboardData.data.AnnualCostPerServiceDeskUser.CostPerUser.LowerCY.label,
    object.dashboardData.data.AnnualCostPerServiceDeskUser.CostPerUser.LowerCY.value,
    object.dashboardData.data.AnnualCostPerServiceDeskUser.CostPerUser.LowerCY.kpiCode,
    object.dashboardData.data.AnnualCostPerServiceDeskUser.CostPerUser.NumberCY.label,
    object.dashboardData.data.AnnualCostPerServiceDeskUser.CostPerUser.NumberCY.value,
    object.dashboardData.data.AnnualCostPerServiceDeskUser.CostPerUser.NumberCY.kpiCode
  );

object.groupMainframeUpperLowerKPIs(object.serviceDeskKPIGroupList[8],
    object.dashboardData.data.AnnualCostPerServiceDeskUser.PricePerUser.UpperCY.label,
    object.dashboardData.data.AnnualCostPerServiceDeskUser.PricePerUser.UpperCY.value,
    object.dashboardData.data.AnnualCostPerServiceDeskUser.PricePerUser.UpperCY.kpiCode,
    object.dashboardData.data.AnnualCostPerServiceDeskUser.PricePerUser.LowerCY.label,
    object.dashboardData.data.AnnualCostPerServiceDeskUser.PricePerUser.LowerCY.value,
    object.dashboardData.data.AnnualCostPerServiceDeskUser.PricePerUser.LowerCY.kpiCode,
    object.dashboardData.data.AnnualCostPerServiceDeskUser.PricePerUser.NumberCY.label,
    object.dashboardData.data.AnnualCostPerServiceDeskUser.PricePerUser.NumberCY.value,
    object.dashboardData.data.AnnualCostPerServiceDeskUser.PricePerUser.NumberCY.kpiCode
  ); 

    //cost per service desk ticket
    
    object.groupMainframeUpperLowerKPIs(object.serviceDeskKPIGroupList[9],
      object.dashboardData.data.AnnualCostPerServiceDeskTicket.CostPerTicket.UpperCY.label,
      object.dashboardData.data.AnnualCostPerServiceDeskTicket.CostPerTicket.UpperCY.value,
      object.dashboardData.data.AnnualCostPerServiceDeskTicket.CostPerTicket.UpperCY.kpiCode,
      object.dashboardData.data.AnnualCostPerServiceDeskTicket.CostPerTicket.LowerCY.label,
      object.dashboardData.data.AnnualCostPerServiceDeskTicket.CostPerTicket.LowerCY.value,
      object.dashboardData.data.AnnualCostPerServiceDeskTicket.CostPerTicket.LowerCY.kpiCode,
      object.dashboardData.data.AnnualCostPerServiceDeskTicket.CostPerTicket.NumberCY.label,
      object.dashboardData.data.AnnualCostPerServiceDeskTicket.CostPerTicket.NumberCY.value,
      object.dashboardData.data.AnnualCostPerServiceDeskTicket.CostPerTicket.NumberCY.kpiCode
    );
    
  object.groupMainframeUpperLowerKPIs(object.serviceDeskKPIGroupList[10],
      object.dashboardData.data.AnnualCostPerServiceDeskTicket.PricePerTicket.UpperCY.label,
      object.dashboardData.data.AnnualCostPerServiceDeskTicket.PricePerTicket.UpperCY.value,
      object.dashboardData.data.AnnualCostPerServiceDeskTicket.PricePerTicket.UpperCY.kpiCode,
      object.dashboardData.data.AnnualCostPerServiceDeskTicket.PricePerTicket.LowerCY.label,
      object.dashboardData.data.AnnualCostPerServiceDeskTicket.PricePerTicket.LowerCY.value,
      object.dashboardData.data.AnnualCostPerServiceDeskTicket.PricePerTicket.LowerCY.kpiCode,
      object.dashboardData.data.AnnualCostPerServiceDeskTicket.PricePerTicket.NumberCY.label,
      object.dashboardData.data.AnnualCostPerServiceDeskTicket.PricePerTicket.NumberCY.value,
      object.dashboardData.data.AnnualCostPerServiceDeskTicket.PricePerTicket.NumberCY.kpiCode
    );
  
  

  //cost service desk fte

  object.groupMainframeUpperLowerKPIs(object.serviceDeskKPIGroupList[0],
    object.dashboardData.data.AnnualCostPerServiceDeskFTE.CostPerEmployee.Upper.label,
    object.dashboardData.data.AnnualCostPerServiceDeskFTE.CostPerEmployee.Upper.value,
    object.dashboardData.data.AnnualCostPerServiceDeskFTE.CostPerEmployee.Upper.kpiCode,
    object.dashboardData.data.AnnualCostPerServiceDeskFTE.CostPerEmployee.Lower.label,
    object.dashboardData.data.AnnualCostPerServiceDeskFTE.CostPerEmployee.Lower.value,
    object.dashboardData.data.AnnualCostPerServiceDeskFTE.CostPerEmployee.Lower.kpiCode,
    object.dashboardData.data.AnnualCostPerServiceDeskFTE.CostPerEmployee.Number.label,
    object.dashboardData.data.AnnualCostPerServiceDeskFTE.CostPerEmployee.Number.value,
    object.dashboardData.data.AnnualCostPerServiceDeskFTE.CostPerEmployee.Number.kpiCode
    );

  object.groupMainframeUpperLowerKPIs(object.serviceDeskKPIGroupList[1],
    object.dashboardData.data.AnnualCostPerServiceDeskFTE.CostPerContractor.Upper.label,
    object.dashboardData.data.AnnualCostPerServiceDeskFTE.CostPerContractor.Upper.value,
    object.dashboardData.data.AnnualCostPerServiceDeskFTE.CostPerContractor.Upper.kpiCode,
    object.dashboardData.data.AnnualCostPerServiceDeskFTE.CostPerContractor.Lower.label,
    object.dashboardData.data.AnnualCostPerServiceDeskFTE.CostPerContractor.Lower.value,
    object.dashboardData.data.AnnualCostPerServiceDeskFTE.CostPerContractor.Lower.kpiCode,
    object.dashboardData.data.AnnualCostPerServiceDeskFTE.CostPerContractor.Number.label,
    object.dashboardData.data.AnnualCostPerServiceDeskFTE.CostPerContractor.Number.value,
    object.dashboardData.data.AnnualCostPerServiceDeskFTE.CostPerContractor.Number.kpiCode
    );

    //# ticket FTE

    
   object.groupMainframeUpperLowerKPIs(object.serviceDeskKPIGroupList[13],
    object.dashboardData.data.NumberofTicketsPerFTE.TicketsPerFTE.Upper.label,
    object.dashboardData.data.NumberofTicketsPerFTE.TicketsPerFTE.Upper.value,
    object.dashboardData.data.NumberofTicketsPerFTE.TicketsPerFTE.Upper.kpiCode,
    object.dashboardData.data.NumberofTicketsPerFTE.TicketsPerFTE.Lower.label,
    object.dashboardData.data.NumberofTicketsPerFTE.TicketsPerFTE.Lower.value,
    object.dashboardData.data.NumberofTicketsPerFTE.TicketsPerFTE.Lower.kpiCode,
    object.dashboardData.data.NumberofTicketsPerFTE.TicketsPerFTE.Number.label,
    object.dashboardData.data.NumberofTicketsPerFTE.TicketsPerFTE.Number.value,
    object.dashboardData.data.NumberofTicketsPerFTE.TicketsPerFTE.Number.kpiCode
  );

    //offshore
    object.groupMainframeUpperLowerKPIs(object.serviceDeskKPIGroupList[2],
      object.dashboardData.data.Offshore.Offshore.Upper.label,
      object.dashboardData.data.Offshore.Offshore.Upper.value,
      object.dashboardData.data.Offshore.Offshore.Upper.kpiCode,
      object.dashboardData.data.Offshore.Offshore.Lower.label,
      object.dashboardData.data.Offshore.Offshore.Lower.value,
      object.dashboardData.data.Offshore.Offshore.Lower.kpiCode,
      object.dashboardData.data.Offshore.Offshore.Number.label,
      object.dashboardData.data.Offshore.Offshore.Number.value,
      object.dashboardData.data.Offshore.Offshore.Number.kpiCode
      );  
    
      //staffing mix
      object.groupMainframeUpperLowerKPIs(object.serviceDeskKPIGroupList[4],
        object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.label,
        object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.value,
        object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.kpiCode,
        object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.label,
        object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.value,
        object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.kpiCode,
        object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.label,
        object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.value,
        object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.kpiCode
      ); 
      
    object.groupMainframeUpperLowerKPIs(object.serviceDeskKPIGroupList[5],
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.label,
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.value,
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.kpiCode,
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.label,
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.value,
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.kpiCode,
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.label,
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.value,
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.kpiCode
      );

      //frst call resolution
      object.groupMainframeUpperLowerKPIs(object.serviceDeskKPIGroupList[15],
        object.dashboardData.data.FirstCallResolution.ServiceDeskFCR.Upper.label,
        object.dashboardData.data.FirstCallResolution.ServiceDeskFCR.Upper.value,
        object.dashboardData.data.FirstCallResolution.ServiceDeskFCR.Upper.kpiCode,
        object.dashboardData.data.FirstCallResolution.ServiceDeskFCR.Lower.label,
        object.dashboardData.data.FirstCallResolution.ServiceDeskFCR.Lower.value,
        object.dashboardData.data.FirstCallResolution.ServiceDeskFCR.Lower.kpiCode,
        object.dashboardData.data.FirstCallResolution.ServiceDeskFCR.Mean.label,
        object.dashboardData.data.FirstCallResolution.ServiceDeskFCR.Mean.value,
        object.dashboardData.data.FirstCallResolution.ServiceDeskFCR.Mean.kpiCode
      );

      //average speed to answer
      object.groupMainframeUpperLowerKPIs(object.serviceDeskKPIGroupList[11],
        object.dashboardData.data.AverageSpeedtoAnswerinseconds.ServiceDeskASA.Upper.label,
        object.dashboardData.data.AverageSpeedtoAnswerinseconds.ServiceDeskASA.Upper.value,
        object.dashboardData.data.AverageSpeedtoAnswerinseconds.ServiceDeskASA.Upper.kpiCode,
        object.dashboardData.data.AverageSpeedtoAnswerinseconds.ServiceDeskASA.Lower.label,
        object.dashboardData.data.AverageSpeedtoAnswerinseconds.ServiceDeskASA.Lower.value,
        object.dashboardData.data.AverageSpeedtoAnswerinseconds.ServiceDeskASA.Lower.kpiCode,
        object.dashboardData.data.AverageSpeedtoAnswerinseconds.ServiceDeskASA.Mean.label,
        object.dashboardData.data.AverageSpeedtoAnswerinseconds.ServiceDeskASA.Mean.value,
        object.dashboardData.data.AverageSpeedtoAnswerinseconds.ServiceDeskASA.Mean.kpiCode
      );
  
  //average handle time
  object.groupMainframeUpperLowerKPIs(object.serviceDeskKPIGroupList[12],
    object.dashboardData.data.AverageHandleTimeinminutes.ServiceDeskAHA.Upper.label,
    object.dashboardData.data.AverageHandleTimeinminutes.ServiceDeskAHA.Upper.value,
    object.dashboardData.data.AverageHandleTimeinminutes.ServiceDeskAHA.Upper.kpiCode,
    object.dashboardData.data.AverageHandleTimeinminutes.ServiceDeskAHA.Lower.label,
    object.dashboardData.data.AverageHandleTimeinminutes.ServiceDeskAHA.Lower.value,
    object.dashboardData.data.AverageHandleTimeinminutes.ServiceDeskAHA.Lower.kpiCode,
    object.dashboardData.data.AverageHandleTimeinminutes.ServiceDeskAHA.Mean.label,
    object.dashboardData.data.AverageHandleTimeinminutes.ServiceDeskAHA.Mean.value,
    object.dashboardData.data.AverageHandleTimeinminutes.ServiceDeskAHA.Mean.kpiCode
  );

//# tickets per user
object.groupMainframeUpperLowerKPIs(object.serviceDeskKPIGroupList[3],
  object.dashboardData.data.NumberofTicketsPerUser.TicketsPerUser.Upper.label,
  object.dashboardData.data.NumberofTicketsPerUser.TicketsPerUser.Upper.value,
  object.dashboardData.data.NumberofTicketsPerUser.TicketsPerUser.Upper.kpiCode,
  object.dashboardData.data.NumberofTicketsPerUser.TicketsPerUser.Lower.label,
  object.dashboardData.data.NumberofTicketsPerUser.TicketsPerUser.Lower.value,
  object.dashboardData.data.NumberofTicketsPerUser.TicketsPerUser.Lower.kpiCode,
  object.dashboardData.data.NumberofTicketsPerUser.TicketsPerUser.Number.label,
  object.dashboardData.data.NumberofTicketsPerUser.TicketsPerUser.Number.value,
  object.dashboardData.data.NumberofTicketsPerUser.TicketsPerUser.Number.kpiCode
  ); 
 

//user experience score by channel  

  object.groupFiveElements(object.serviceDeskKPIGroupList[14],
    object.dashboardData.data.UserExperienceScoreByChannel.SelfService.SelfService.label,
    object.dashboardData.data.UserExperienceScoreByChannel.SelfService.SelfService.value,
    object.dashboardData.data.UserExperienceScoreByChannel.SelfService.SelfService.kpiCode,
    object.dashboardData.data.UserExperienceScoreByChannel.Email.Email.label,
    object.dashboardData.data.UserExperienceScoreByChannel.Email.Email.value,
    object.dashboardData.data.UserExperienceScoreByChannel.Email.Email.kpiCode,
    object.dashboardData.data.UserExperienceScoreByChannel.Chat.Chat.label,
    object.dashboardData.data.UserExperienceScoreByChannel.Chat.Chat.value,
    object.dashboardData.data.UserExperienceScoreByChannel.Chat.Chat.kpiCode,
    object.dashboardData.data.UserExperienceScoreByChannel.TechBar.TechBar.label,
    object.dashboardData.data.UserExperienceScoreByChannel.TechBar.TechBar.value,
    object.dashboardData.data.UserExperienceScoreByChannel.TechBar.TechBar.kpiCode,
    object.dashboardData.data.UserExperienceScoreByChannel.Telephone.Telephone.label,
    object.dashboardData.data.UserExperienceScoreByChannel.Telephone.Telephone.value,
    object.dashboardData.data.UserExperienceScoreByChannel.Telephone.Telephone.kpiCode
    );

  
  object.mainframeDataLoaded =true;
}

createAMData(){
  let object = this;
  object.customDataObject = [];
  object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.OnPremiseBusinessSystem.OnPremiseBusinessSystem.label = "On-Premise Enterprise Business Systems %";

  
  //ADM cost allocation
  object.groupSixKPIs(object.applicationMaintananceKPIGroupList[6],
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.Development.Cost.label,
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.Development.Cost.value, 
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.Development.Cost.kpiCode,
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.Maintenance.Cost.label,
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.Maintenance.Cost.value, 
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.Maintenance.Cost.kpiCode,
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.SaaS.SaaS.label,
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.SaaS.SaaS.value,
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.SaaS.SaaS.kpiCode,
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.OnPremiseBusinessSystem.OnPremiseBusinessSystem.label,
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.OnPremiseBusinessSystem.OnPremiseBusinessSystem.value,
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.OnPremiseBusinessSystem.OnPremiseBusinessSystem.kpiCode,
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.COTS.COTS.label,
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.COTS.COTS.value,
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.COTS.COTS.kpiCode,
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.Bespoke.Bespoke.label,
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.Bespoke.Bespoke.value,
    object.dashboardData.data.ApplicationDevelopmentandMaintenanceCostAllocation.Bespoke.Bespoke.kpiCode
    );
 
    //ADM staffing mix
    object.groupSixKPIs(object.applicationMaintananceKPIGroupList[9],
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixEmployee.AD.Employee.label,
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixEmployee.AD.Employee.value,
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixEmployee.AD.Employee.kpiCode,
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixContractor.AD.Contractor.label,
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixContractor.AD.Contractor.value,
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixContractor.AD.Contractor.kpiCode,
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixManagedServices.AD.Services.label,
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixManagedServices.AD.Services.value,
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixManagedServices.AD.Services.kpiCode,
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixEmployee.AM.Employee.label,
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixEmployee.AM.Employee.value,
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixEmployee.AM.Employee.kpiCode,
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixContractor.AM.Contractor.label,
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixContractor.AM.Contractor.value,
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixContractor.AM.Contractor.kpiCode,
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixManagedServices.AM.Services.label,
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixManagedServices.AM.Services.value,
      object.dashboardData.data.ApplicationDevelopmentAndMaintenanceStaffingMixManagedServices.AM.Services.kpiCode
      );

      //AM Cost FTE
      object.groupSixKPIs(object.applicationMaintananceKPIGroupList[16],
        object.dashboardData.data.AnnualCostPerApplicationMaintenanceFTE.CostPerEmployee.Number.label,
        object.dashboardData.data.AnnualCostPerApplicationMaintenanceFTE.CostPerEmployee.Number.value,
        object.dashboardData.data.AnnualCostPerApplicationMaintenanceFTE.CostPerEmployee.Number.kpiCode,
        object.dashboardData.data.AnnualCostPerApplicationMaintenanceFTE.CostPerEmployee.Upper.label,
        object.dashboardData.data.AnnualCostPerApplicationMaintenanceFTE.CostPerEmployee.Upper.value,
        object.dashboardData.data.AnnualCostPerApplicationMaintenanceFTE.CostPerEmployee.Upper.kpiCode,
        object.dashboardData.data.AnnualCostPerApplicationMaintenanceFTE.CostPerEmployee.Lower.label,
        object.dashboardData.data.AnnualCostPerApplicationMaintenanceFTE.CostPerEmployee.Lower.value,
        object.dashboardData.data.AnnualCostPerApplicationMaintenanceFTE.CostPerEmployee.Lower.kpiCode,
        object.dashboardData.data.AnnualCostPerApplicationMaintenanceFTE.CostPerContractor.Number.label,
        object.dashboardData.data.AnnualCostPerApplicationMaintenanceFTE.CostPerContractor.Number.value,
        object.dashboardData.data.AnnualCostPerApplicationMaintenanceFTE.CostPerContractor.Number.kpiCode,
        object.dashboardData.data.AnnualCostPerApplicationMaintenanceFTE.CostPerContractor.Upper.label,
        object.dashboardData.data.AnnualCostPerApplicationMaintenanceFTE.CostPerContractor.Upper.value,
        object.dashboardData.data.AnnualCostPerApplicationMaintenanceFTE.CostPerContractor.Upper.kpiCode,
        object.dashboardData.data.AnnualCostPerApplicationMaintenanceFTE.CostPerContractor.Lower.label,
        object.dashboardData.data.AnnualCostPerApplicationMaintenanceFTE.CostPerContractor.Lower.value,
        object.dashboardData.data.AnnualCostPerApplicationMaintenanceFTE.CostPerContractor.Lower.kpiCode);
     
     
  //application defect severity

  object.groupMainframeCostAllocationKPIs(object.applicationMaintananceKPIGroupList[0],
      object.dashboardData.data.ApplicationDefectSeverity.S1Defect.S1Defect.label,
      object.dashboardData.data.ApplicationDefectSeverity.S1Defect.S1Defect.value,
      object.dashboardData.data.ApplicationDefectSeverity.S1Defect.S1Defect.kpiCode,
      object.dashboardData.data.ApplicationDefectSeverity.S2Defect.S2Defect.label,
      object.dashboardData.data.ApplicationDefectSeverity.S2Defect.S2Defect.value,
      object.dashboardData.data.ApplicationDefectSeverity.S2Defect.S2Defect.kpiCode,
      object.dashboardData.data.ApplicationDefectSeverity.S3Defect.S3Defect.label,
      object.dashboardData.data.ApplicationDefectSeverity.S3Defect.S3Defect.value,
      object.dashboardData.data.ApplicationDefectSeverity.S3Defect.S3Defect.kpiCode,
      object.dashboardData.data.ApplicationDefectSeverity.S4Defect.S4Defect.label,
      object.dashboardData.data.ApplicationDefectSeverity.S4Defect.S4Defect.value,
      object.dashboardData.data.ApplicationDefectSeverity.S4Defect.S4Defect.kpiCode
  );


  //AM cost allocation
  object.groupMainframeUpperLowerKPIs(object.applicationMaintananceKPIGroupList[5],
    object.dashboardData.data.ApplicationMaintenanceCostAllocation.CostAllocationOS.Number.label,
    object.dashboardData.data.ApplicationMaintenanceCostAllocation.CostAllocationOS.Number.value,
    object.dashboardData.data.ApplicationMaintenanceCostAllocation.CostAllocationOS.Number.kpiCode,
    object.dashboardData.data.ApplicationMaintenanceCostAllocation.CostAllocationSW.Number.label,
    object.dashboardData.data.ApplicationMaintenanceCostAllocation.CostAllocationSW.Number.value,
    object.dashboardData.data.ApplicationMaintenanceCostAllocation.CostAllocationSW.Number.kpiCode,
    object.dashboardData.data.ApplicationMaintenanceCostAllocation.CostAllocationEmp.Number.label,
    object.dashboardData.data.ApplicationMaintenanceCostAllocation.CostAllocationEmp.Number.value,
    object.dashboardData.data.ApplicationMaintenanceCostAllocation.CostAllocationEmp.Number.kpiCode
    );
 
    //cost per hour worked
    object.groupMainframeUpperLowerKPIs(object.applicationMaintananceKPIGroupList[10],
      object.dashboardData.data.CostPerHourWorked.CostPerHour.UpperCY.label,
      object.dashboardData.data.CostPerHourWorked.CostPerHour.UpperCY.value,
      object.dashboardData.data.CostPerHourWorked.CostPerHour.UpperCY.kpiCode,
      object.dashboardData.data.CostPerHourWorked.CostPerHour.LowerCY.label,
      object.dashboardData.data.CostPerHourWorked.CostPerHour.LowerCY.value,
      object.dashboardData.data.CostPerHourWorked.CostPerHour.LowerCY.kpiCode,
      object.dashboardData.data.CostPerHourWorked.CostPerHour.NumberCY.label,
      object.dashboardData.data.CostPerHourWorked.CostPerHour.NumberCY.value,
      object.dashboardData.data.CostPerHourWorked.CostPerHour.NumberCY.kpiCode
      );

         //cost per hour drill down
         object.groupFourDrillDownElements(object.applicationMaintananceKPIGroupList[10],
          '',
        object.dashboardData.drills.TCOPerHourWorkedCurrentYear[0].label,
        object.dashboardData.drills.TCOPerHourWorkedCurrentYear[0].value,
        object.dashboardData.drills.TCOPerHourWorkedCurrentYear[0].kpiCode,
        object.dashboardData.drills.TCOPerHourWorkedCurrentYear[1].label,
        object.dashboardData.drills.TCOPerHourWorkedCurrentYear[1].value,
        object.dashboardData.drills.TCOPerHourWorkedCurrentYear[1].kpiCode,
        object.dashboardData.drills.TCOPerHourWorkedCurrentYear[2].label,
        object.dashboardData.drills.TCOPerHourWorkedCurrentYear[2].value,
        object.dashboardData.drills.TCOPerHourWorkedCurrentYear[2].kpiCode,
        object.dashboardData.drills.TCOPerHourWorkedCurrentYear[3].label,
        object.dashboardData.drills.TCOPerHourWorkedCurrentYear[3].value,
        object.dashboardData.drills.TCOPerHourWorkedCurrentYear[3].kpiCode)
   

    object.groupMainframeUpperLowerKPIs(object.applicationMaintananceKPIGroupList[11],
      object.dashboardData.data.CostPerHourWorked.PricePerHour.UpperCY.label,
      object.dashboardData.data.CostPerHourWorked.PricePerHour.UpperCY.value,
      object.dashboardData.data.CostPerHourWorked.PricePerHour.UpperCY.kpiCode,
      object.dashboardData.data.CostPerHourWorked.PricePerHour.LowerCY.label,
      object.dashboardData.data.CostPerHourWorked.PricePerHour.LowerCY.value,
      object.dashboardData.data.CostPerHourWorked.PricePerHour.LowerCY.kpiCode,
      object.dashboardData.data.CostPerHourWorked.PricePerHour.NumberCY.label,
      object.dashboardData.data.CostPerHourWorked.PricePerHour.NumberCY.value,
      object.dashboardData.data.CostPerHourWorked.PricePerHour.NumberCY.kpiCode
      );

         //cost per hour drill down
         object.groupFourDrillDownElements(object.applicationMaintananceKPIGroupList[11],
          '',
        object.dashboardData.drills.PricePerHourWorkedCurrentYear[0].label,
        object.dashboardData.drills.PricePerHourWorkedCurrentYear[0].value,
        object.dashboardData.drills.PricePerHourWorkedCurrentYear[0].kpiCode,
        object.dashboardData.drills.PricePerHourWorkedCurrentYear[1].label,
        object.dashboardData.drills.PricePerHourWorkedCurrentYear[1].value,
        object.dashboardData.drills.PricePerHourWorkedCurrentYear[1].kpiCode,
        object.dashboardData.drills.PricePerHourWorkedCurrentYear[2].label,
        object.dashboardData.drills.PricePerHourWorkedCurrentYear[2].value,
        object.dashboardData.drills.PricePerHourWorkedCurrentYear[2].kpiCode,
        object.dashboardData.drills.PricePerHourWorkedCurrentYear[3].label,
        object.dashboardData.drills.PricePerHourWorkedCurrentYear[3].value,
        object.dashboardData.drills.PricePerHourWorkedCurrentYear[3].kpiCode)
   

      //cost per support contract
      object.groupMainframeUpperLowerKPIs(object.applicationMaintananceKPIGroupList[12],
        object.dashboardData.data.CostPerSupportContact.CostPerContact.Upper.label,
        object.dashboardData.data.CostPerSupportContact.CostPerContact.Upper.value,
        object.dashboardData.data.CostPerSupportContact.CostPerContact.Upper.kpiCode,
        object.dashboardData.data.CostPerSupportContact.CostPerContact.Lower.label,
        object.dashboardData.data.CostPerSupportContact.CostPerContact.Lower.value,
        object.dashboardData.data.CostPerSupportContact.CostPerContact.Lower.kpiCode,
        object.dashboardData.data.CostPerSupportContact.CostPerContact.Number.label,
        object.dashboardData.data.CostPerSupportContact.CostPerContact.Number.value,
        object.dashboardData.data.CostPerSupportContact.CostPerContact.Number.kpiCode);
     

        //defect close rate
        object.groupMainframeUpperLowerKPIs(object.applicationMaintananceKPIGroupList[13],
          object.dashboardData.data.DefectCloseRate.DefectCloseRate.Upper.label,
          object.dashboardData.data.DefectCloseRate.DefectCloseRate.Upper.value,
          object.dashboardData.data.DefectCloseRate.DefectCloseRate.Upper.kpiCode,
          object.dashboardData.data.DefectCloseRate.DefectCloseRate.Lower.label,
          object.dashboardData.data.DefectCloseRate.DefectCloseRate.Lower.value,
          object.dashboardData.data.DefectCloseRate.DefectCloseRate.Lower.kpiCode,
          object.dashboardData.data.DefectCloseRate.DefectCloseRate.Number.label,
          object.dashboardData.data.DefectCloseRate.DefectCloseRate.Number.value,
          object.dashboardData.data.DefectCloseRate.DefectCloseRate.Number.kpiCode);
    
    //defects per application
    object.groupSixKPIs(object.applicationMaintananceKPIGroupList[14],
      object.dashboardData.data.DefectsperApplication.DefectsReportedPerApplication.Number.label,
      object.dashboardData.data.DefectsperApplication.DefectsReportedPerApplication.Number.value,
      object.dashboardData.data.DefectsperApplication.DefectsReportedPerApplication.Number.kpiCode,
      object.dashboardData.data.DefectsperApplication.DefectsReportedPerApplication.Upper.label,
      object.dashboardData.data.DefectsperApplication.DefectsReportedPerApplication.Upper.value,
      object.dashboardData.data.DefectsperApplication.DefectsReportedPerApplication.Upper.kpiCode,
      object.dashboardData.data.DefectsperApplication.DefectsReportedPerApplication.Lower.label,
      object.dashboardData.data.DefectsperApplication.DefectsReportedPerApplication.Lower.value,
      object.dashboardData.data.DefectsperApplication.DefectsReportedPerApplication.Lower.kpiCode,
      object.dashboardData.data.DefectsperApplication.DefectsClosedPerApplication.Number.label,
      object.dashboardData.data.DefectsperApplication.DefectsClosedPerApplication.Number.value,
      object.dashboardData.data.DefectsperApplication.DefectsClosedPerApplication.Number.kpiCode,
      object.dashboardData.data.DefectsperApplication.DefectsClosedPerApplication.Upper.label,
      object.dashboardData.data.DefectsperApplication.DefectsClosedPerApplication.Upper.value,
      object.dashboardData.data.DefectsperApplication.DefectsClosedPerApplication.Upper.kpiCode,
      object.dashboardData.data.DefectsperApplication.DefectsClosedPerApplication.Lower.label,
      object.dashboardData.data.DefectsperApplication.DefectsClosedPerApplication.Lower.value,
      object.dashboardData.data.DefectsperApplication.DefectsClosedPerApplication.Lower.kpiCode);
   
      //enhancements per application
      object.groupSixKPIs(object.applicationMaintananceKPIGroupList[7],
        object.dashboardData.data.EnhancementsPerApplication.EnhancementsCompletedPerApplication.Number.label,
        object.dashboardData.data.EnhancementsPerApplication.EnhancementsCompletedPerApplication.Number.value,
        object.dashboardData.data.EnhancementsPerApplication.EnhancementsCompletedPerApplication.Number.kpiCode,
        object.dashboardData.data.EnhancementsPerApplication.EnhancementsCompletedPerApplication.Upper.label,
        object.dashboardData.data.EnhancementsPerApplication.EnhancementsCompletedPerApplication.Upper.value,
        object.dashboardData.data.EnhancementsPerApplication.EnhancementsCompletedPerApplication.Upper.kpiCode,
        object.dashboardData.data.EnhancementsPerApplication.EnhancementsCompletedPerApplication.Lower.label,
        object.dashboardData.data.EnhancementsPerApplication.EnhancementsCompletedPerApplication.Lower.value,
        object.dashboardData.data.EnhancementsPerApplication.EnhancementsCompletedPerApplication.Lower.kpiCode,
        object.dashboardData.data.EnhancementsPerApplication.EnhancementRequestsPerApplication.Number.label,
        object.dashboardData.data.EnhancementsPerApplication.EnhancementRequestsPerApplication.Number.value,
        object.dashboardData.data.EnhancementsPerApplication.EnhancementRequestsPerApplication.Number.kpiCode,
        object.dashboardData.data.EnhancementsPerApplication.EnhancementRequestsPerApplication.Upper.label,
        object.dashboardData.data.EnhancementsPerApplication.EnhancementRequestsPerApplication.Upper.value,
        object.dashboardData.data.EnhancementsPerApplication.EnhancementRequestsPerApplication.Upper.kpiCode,
        object.dashboardData.data.EnhancementsPerApplication.EnhancementRequestsPerApplication.Lower.label,
        object.dashboardData.data.EnhancementsPerApplication.EnhancementRequestsPerApplication.Lower.value,
        object.dashboardData.data.EnhancementsPerApplication.EnhancementRequestsPerApplication.Lower.kpiCode
        );
        
       
   //offshore 

  object.groupMainframeUpperLowerKPIs(object.applicationMaintananceKPIGroupList[1],
      object.dashboardData.data.Offshore.Offshore.Upper.label,
      object.dashboardData.data.Offshore.Offshore.Upper.value,
      object.dashboardData.data.Offshore.Offshore.Upper.kpiCode,
      object.dashboardData.data.Offshore.Offshore.Lower.label,
      object.dashboardData.data.Offshore.Offshore.Lower.value,
      object.dashboardData.data.Offshore.Offshore.Lower.kpiCode,
      object.dashboardData.data.Offshore.Offshore.Number.label,
      object.dashboardData.data.Offshore.Offshore.Number.value,
      object.dashboardData.data.Offshore.Offshore.Number.kpiCode
   );

   //staffing mix
   
   object.groupNineElements(object.applicationMaintananceKPIGroupList[2],
    object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.label,
    object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.value,
    object.dashboardData.data.StaffingMix.StaffingMixEmployee.Number.kpiCode,
      object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.label,
      object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.value,
      object.dashboardData.data.StaffingMix.StaffingMixEmployee.Upper.kpiCode,
      object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.label,
      object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.value,
      object.dashboardData.data.StaffingMix.StaffingMixEmployee.Lower.kpiCode,
      object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.label,
      object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.value,
      object.dashboardData.data.StaffingMix.StaffingMixContractor.Number.kpiCode,
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.label,
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.value,
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Upper.kpiCode,
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.label,
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.value,
        object.dashboardData.data.StaffingMix.StaffingMixContractor.Lower.kpiCode,
        object.dashboardData.data.StaffingMix.StaffingMixManagedServices.Number.label,
        object.dashboardData.data.StaffingMix.StaffingMixManagedServices.Number.value,
        object.dashboardData.data.StaffingMix.StaffingMixManagedServices.Number.kpiCode,
        object.dashboardData.data.StaffingMix.StaffingMixManagedServices.Upper.label,
        object.dashboardData.data.StaffingMix.StaffingMixManagedServices.Upper.value,
        object.dashboardData.data.StaffingMix.StaffingMixManagedServices.Upper.kpiCode,
        object.dashboardData.data.StaffingMix.StaffingMixManagedServices.Lower.label,
        object.dashboardData.data.StaffingMix.StaffingMixManagedServices.Lower.value,
        object.dashboardData.data.StaffingMix.StaffingMixManagedServices.Lower.kpiCode
      );

      
  object.mainframeDataLoaded =true;
}


 


validateKPIInput(elementValue, event)
{
  //validate kpi values

  let object = this;
  if(elementValue != null && elementValue != "" && elementValue != undefined){
    elementValue = this.unmaskComma(elementValue);
  }
  //do not allow negative values
  if (Number(elementValue) < 0) {
     event.target.value = '';
  } 

  //condition to check copy enable
  //if CRG is selected from dropdown, and all data is filled, enable copy button
  let totalElements = 0;
  let completedElements = 0; 

  if(object.selectedCustomRefGroup!=0)
  {
    //loop through form controls
  $("#kpi-data-section input").each(function (index) {

    if ($(this).val() != '' && $(this).val() != null) {
      completedElements++;
    }

    totalElements = index + 1;

    
  });


  if((totalElements==completedElements) && totalElements>0)
  {
    object.isCopyEnabled=true;
  }
  else
  {
    object.isCopyEnabled=false;
  }

  }

  //loop through page to check all fields are filled
  object.checkEntireFormFilled();
  
}

checkEntireFormFilled()
{
  let object = this;

  let totalElements = 0;
  let completedElements = 0; 

  
  //loop through headcount form controls
  $(".dashboard-section input").each(function (index) {

    if ($(this).val() != '' && $(this).val() != null) {
      completedElements++;
    }

    totalElements = index + 1;

    
  });

  
  
  if((totalElements==completedElements) && totalElements>0)
  {
    object.isPartial="0";
    object.isSaveEnabled=true;
    if(Number(object.selectedCustomRefGroup)!=0)
    {
      object.isCopyEnabled=true;
    }
    
  }
  else
  {
    if(object.customReferenceGroupName != null 
      && object.definition != null 
      && object.customReferenceGroupName != undefined 
      && object.definition != undefined
      && object.customReferenceGroupName != "" 
      && object.definition != ""){
        object.isSaveEnabled=true;
        if(Number(object.selectedCustomRefGroup)!=0)
        {
          object.isCopyEnabled=true;
        }
        
      }else{
        
        object.isSaveEnabled=false;
        object.isCopyEnabled=false;
      }
    object.isPartial = "1";
  }
  

  
}

getCRGData(){
  let object = this;

  object.showTabularData=false;
  object.isCopyEnabled=false;
  object.isSaveEnabled=false;

 

  //set dashboard id
  object.crgService.setDashboardId(object.selectedDashBoardItemId);
  object.getCustomGroupRefList();

  object.crgService.getData(object.selectedDashBoardItemId).subscribe((data) => {
    
     object.getCustomGroupRefList();
     object.dashboardData = data;
     if(object.dashboardData != undefined || object.dashboardData != null){


      //remove redundant data from response
    for(let drillObject in object.dashboardData.drills)
    {
      if(drillObject!=null||drillObject!=undefined||drillObject!='')
      

      //logic to remove duplicate from array
      object.dashboardData.drills[drillObject] = object.dashboardData.drills[drillObject].filter((thing, index, self) =>
        index === self.findIndex((t) => (
          t.label === thing.label
        ))
      );
    }


      if(object.selectedDashBoardItemId == 1){
        object.createCIOData();
     }else if(object.selectedDashBoardItemId == 2){
        object.createMainframeData();
     }else if(object.selectedDashBoardItemId == 3){
        object.createServerData();
     }else if(object.selectedDashBoardItemId == 4){
      object.createServerData();
     }else if(object.selectedDashBoardItemId == 5){
      object.createServerData();
     }else if(object.selectedDashBoardItemId == 6){
        object.createStorageData();
     }else if(object.selectedDashBoardItemId ==7){
       object.createLANObject();
     }else if(object.selectedDashBoardItemId == 8){
       object.createWANData();
     }else if(object.selectedDashBoardItemId == 9){
       object.createVoiceData();
     }else if(object.selectedDashBoardItemId == 10){
       object.createWorkplaceData();
     }else if(object.selectedDashBoardItemId == 11){
        object.createServiceDeskData();
     }else if(object.selectedDashBoardItemId == 12){
       object.createApplicationDevelopmentData();
     }else if(object.selectedDashBoardItemId == 13){
        object.createAMData();
     }else if(object.selectedDashBoardItemId == 14){
       object.createDigitalData();
     }

     }
    
  }
  );
} 

getCustomGroupRefList(){
  
  let object = this;
  
  object.crgService.getCustomRefGroupList(object.selectedDashBoardItemId).subscribe((data)=>{
    object.customReferenceGroupIDs = data;
    object.customGroupID = [];
    for (let index=0; index < object.customReferenceGroupIDs.length; index++) {
      let option: any = {};
      option.label = object.customReferenceGroupIDs[index].customId+'_'+object.customReferenceGroupIDs[index].customName;
      option.customId = object.customReferenceGroupIDs[index].customId;
      option.customName = object.customReferenceGroupIDs[index].customName;
      object.customGroupID.push(option);
    }
    
    object.selectedCustomRefGroup = 0;
    object.getGeneralData();
    
  });

  
  
}

getGeneralData(){
  let object = this;
  if(object.selectedCustomRefGroup == 0){
    object.customReferenceGroupName = '';
    object.definition = '';
  }else{

    object.crgService.getGeneralData(object.selectedCustomRefGroup, object.selectedDashBoardItemId).subscribe((data)=>{
      object.tabularData = data;
      if(object.tabularData!=null || object.tabularData!=undefined || object.tabularData.length>0)
      {
        object.showTabularData=true;
        let tempDash = (object.tabularData[0].dashboardId);
        
        for(let cnt = 0; cnt < object.dashBoardList.length; cnt++)
        {
          if(object.dashBoardList[cnt].dashboardID==tempDash)
          {
  
            object.selectedDashboardName = object.dashBoardList[cnt].dashboardName;
          }
        }
        //object.selectedDashboardName = object.dashBoardList[tempDash].dashboardName;
        object.customReferenceGroupName = data[0].customName;
        object.definition = data[0].definition;
      }
      else
      {
        object.showTabularData=false;
      }
     
    });
  }
}

getSelectedCRGData(selectedCustomRefGroup)
{
  let object = this;

  // object.mainframeDataLoaded=false;

  //set custom reference group in service
  object.crgService.setCRGId(selectedCustomRefGroup);

  if(selectedCustomRefGroup==0)
  {
    //call default fetch web service
    object.showTabularData=false;
    //disable save and create new copy
    object.isSaveEnabled=false;
    object.isCopyEnabled=false;
  
    object.getCRGData();

  }
  else
  {
      //web service to fetch CRG data
  object.crgService.fetchCRGDataById().subscribe((crgData: any) => {


    object.dashboardData = crgData;

    if(crgData!=undefined || crgData!=null)
    {

      //remove redundant data from response
    for(let drillObject in object.dashboardData.drills)
    {
      if(drillObject!=null&&drillObject!=undefined&&drillObject!='')
      

      //logic to remove duplicate from array
      object.dashboardData.drills[drillObject] = object.dashboardData.drills[drillObject].filter((thing, index, self) =>
        index === self.findIndex((t) => (
          t.label === thing.label
        ))
      );
    }

      if(object.selectedDashBoardItemId == 1){
        object.createCIOData();
     }else if(object.selectedDashBoardItemId == 2){
        object.createMainframeData();
     }else if(object.selectedDashBoardItemId == 3){
        object.createServerData();
     }else if(object.selectedDashBoardItemId == 4){
      object.createServerData();
     }else if(object.selectedDashBoardItemId == 5){
      object.createServerData();
     }else if(object.selectedDashBoardItemId == 6){
        object.createStorageData();
     }else if(object.selectedDashBoardItemId ==7){
       object.createLANObject();
     }else if(object.selectedDashBoardItemId == 8){
       object.createWANData();
     }else if(object.selectedDashBoardItemId == 9){
       object.createVoiceData();
     }else if(object.selectedDashBoardItemId == 10){
       object.createWorkplaceData();
     }else if(object.selectedDashBoardItemId == 11){
        object.createServiceDeskData();
     }else if(object.selectedDashBoardItemId == 12){
       object.createApplicationDevelopmentData();
     }else if(object.selectedDashBoardItemId == 13){
        object.createAMData();
     }else if(object.selectedDashBoardItemId == 14){
       object.createDigitalData();
     }
    }
    // object.checkEntireFormFilled();
    //enable save and create new copy cooment below 2 lines and uncomment above line

    object.isSaveEnabled=true;
    object.isCopyEnabled=true;
  
  });
  }

}

//create CRG copy
createCRGCopy()
{
  let object =this;
  //reset general section
  object.selectedCustomRefGroup=0;
  object.customReferenceGroupName='';
  object.definition='';

  //disable save button
  object.isSaveEnabled=false;

  object.scrollToTop();
}

//delete CRG confirmation
OpenDeleteCRGPrompt(crgid)
{
  let object = this;
  //show confirmation prompt

  object.display_confirmationbox =true;

}

//close prompt
closeModalDialog()
{
  let object = this;
  //show confirmation prompt

  object.display_confirmationbox =false;

}

//delete CRG
deleteCRG()
{
  let object = this;
  if(object.selectedDashBoardItemId == 14){
    object.isDigitalTower = true;
  }else{
    object.isDigitalTower = false;
  }
  //close box
  object.closeModalDialog();

  //set CRG id
  object.crgService.setCRGId(object.tabularData[0].customId);

  //call delete web service
  object.crgService.deleteCRG(object.isDigitalTower).subscribe((response: any) => {

    
    //show success message
    var deleteMessage = 'Deleted Custom Reference Group with id: '+object.tabularData[0].customId+' successfully.';
			object.toastr.info(deleteMessage, '', {
				timeOut: 7000,
        positionClass: 'toast-top-center'
      });
      
      //update CRG list in dropdown
      object.getCustomGroupRefList();

      //get CRG template for dashboard
      object.getCRGData();

      //scroll to top of page
      object.scrollToTop();


  });


}

scrollToTop()
{
  //$('.dashboard-section').scrollToTop(10);
}

//save CRG
saveCRG()
{
  let object = this;

  //create request object for save
  
  //dashboard id
  object.saveRequestObject.dashboardId = object.selectedDashBoardItemId;


  //createed by
  //will be blank in case of update
  if(Number(object.selectedCustomRefGroup) == 0)
  {
    object.saveRequestObject.createdBy = object.userdata.userDetails.emailId;
    object.saveRequestObject.customId = "-9999";//garbage CRG id in case of insert new record
  }
  else
  {
    object.saveRequestObject.createdBy="";
    object.saveRequestObject.customId = object.selectedCustomRefGroup; //actual CRG id in case of update 
  }

  //updated by
  //will be blank in case of new CRG creation
  if(Number(object.selectedCustomRefGroup) == 0)
  {
    object.saveRequestObject.updatedBy = ""
  }
  else
  {
    object.saveRequestObject.updatedBy=object.userdata.userDetails.emailId;
  }

  
  object.saveRequestObject.isPartial = object.isPartial;
  
  //general information
  object.saveRequestObject.generalInformationData[0].customName = object.customReferenceGroupName;
  object.saveRequestObject.generalInformationData[0].definition = object.definition;
  object.saveRequestObject.kpiGroupData = [];

  //loop through data object to capture KPI code and value
  for(let cnt =0; cnt< object.customDataObject.length;cnt++)
  {
     
    if(object.customDataObject[cnt].dataObj!=undefined) //dataobj
    {
      for(let i=0; i < object.customDataObject[cnt].dataObj.length;i++)
      {
        if(object.selectedDashBoardItemId == 14){
          let tempObj = {"resultId":object.customDataObject[cnt].dataObj[i].kpiElementCode, 
          "resultValue": object.customDataObject[cnt].dataObj[i].kpiElementValue,
          "resultName": object.customDataObject[cnt].dataObj[i].resultName};
          if(tempObj.resultValue!= null && tempObj.resultValue != "" && tempObj.resultValue!= undefined){
            tempObj.resultValue = this.unmaskComma(tempObj.resultValue);
          }
          
          object.saveRequestObject.kpiGroupData.push(tempObj);
        }else{
          let tempObj = {"resultId":object.customDataObject[cnt].dataObj[i].kpiElementCode, 
          "resultValue": object.customDataObject[cnt].dataObj[i].kpiElementValue};
          if(tempObj.resultValue!= null && tempObj.resultValue != "" && tempObj.resultValue!= undefined){
            tempObj.resultValue = this.unmaskComma(tempObj.resultValue);
          }
          object.saveRequestObject.kpiGroupData.push(tempObj);
        }
        
        
       
        
      }
    }
    else if(object.customDataObject[cnt].drilldownObj!=undefined) //drilldownObj
    {
      for(let i=0; i < object.customDataObject[cnt].drilldownObj.length;i++)
      {
        let tempObj = {"resultId":object.customDataObject[cnt].drilldownObj[i].kpiElementCode, 
        "resultValue": object.customDataObject[cnt].drilldownObj[i].kpiElementValue};
        if(tempObj.resultValue!= null && tempObj.resultValue != "" && tempObj.resultValue!= undefined){
          tempObj.resultValue = this.unmaskComma(tempObj.resultValue);
        }
        object.saveRequestObject.kpiGroupData.push(tempObj);
        
      }
    }
    
  }


  //call web service to save Custom Reference Group
  object.crgService.saveCRG(object.saveRequestObject).subscribe((response) => {

    let message;
      
    if (Number(object.selectedCustomRefGroup) == 0) {
        message = "saved successfully.";

        //update CRG list
          
        //update CRG list in dropdown
        object.crgService.setDashboardId(object.selectedDashBoardItemId);
        object.getCustomGroupRefList();

      //get CRG template for dashboard
      object.getCRGData();

        
      } else {
        message = "updated successfully.";
          
        //update CRG list in dropdown
        object.crgService.setDashboardId(object.selectedDashBoardItemId);
        object.getCustomGroupRefList();

      //get CRG template for dashboard
      object.getCRGData();
      

      }

      let description = object.customReferenceGroupName;
      if(description==undefined||description==undefined||description.trim().length==0){
        description=response.value+'CRG '+response.value;
      }else{
        description='Custom Reference Group '+object.customReferenceGroupName;
      }

      this.toastr.info('' +description+" " + message, '', {
        timeOut: 7000,
        positionClass: 'toast-top-center'
      });


  }); 



}

createDigitalData(){
  let object = this;
  object.customDataObject = [];

  
  //IT spend
  let itSpendRevObj: any =[];
    for(let obj of object.dashboardData.Data.DigitalSpendasaofRevenue){
        let temp = {
          label: obj.questionName,
          value: obj.value,
          code: obj.questionId,
          resultName: obj.label
        }
        itSpendRevObj.push(temp);
    }
    object.groupKPIsOfDigitalTower(object.digitalTowerGroupList[5],itSpendRevObj);


  //digital spend by category
  let digitalSpendObj: any =[];
  for(let obj of object.dashboardData.Data.DigitalSpendbycategory){
      let temp = {
        label: obj.questionName,
        value: obj.value,
        code: obj.questionId,
        resultName: obj.label
      }
      digitalSpendObj.push(temp);
  }
  object.groupKPIsOfDigitalTower(object.digitalTowerGroupList[2],digitalSpendObj);     


   //Digital Spend as a % of IT Spend
   let digitalSpedObj: any =[];
   for(let obj of object.dashboardData.Data.DigitalSpendasaofITSpend){
       let temp = {
         label: obj.questionName,
         value: obj.value,
         code: obj.questionId,
         resultName: obj.label
       }
       digitalSpedObj.push(temp);
   }
   object.groupKPIsOfDigitalTower(object.digitalTowerGroupList[12],digitalSpedObj);

   //Digital Spend per employee
   let digitalSpedPerEmpObj: any =[];
   for(let obj of object.dashboardData.Data.DigitalSpendperEmployee){
       let temp = {
         label: obj.questionName,
         value: obj.value,
         code: obj.questionId,
         resultName: obj.label
       }
       digitalSpedPerEmpObj.push(temp);
   }
   object.groupKPIsOfDigitalTower(object.digitalTowerGroupList[13],digitalSpedPerEmpObj);

   //digital employee % of total employee
   let digitalEmpObj: any =[];
   for(let obj of object.dashboardData.Data.DigitalEmployeesasofCompanyEmployees){
       let temp = {
         label: obj.questionName,
         value: obj.value,
         code: obj.questionId,
         resultName: obj.label
       }
       digitalEmpObj.push(temp);
   }
   object.groupKPIsOfDigitalTower(object.digitalTowerGroupList[14],digitalEmpObj);

   //employees dedicated to digital
   let empDigitalObj: any =[];
   for(let obj of object.dashboardData.Data.Employeesdedicatedtodigital){
       let temp = {
         label: obj.questionName,
         value: obj.value,
         code: obj.questionId,
         resultName: obj.label
       }
       empDigitalObj.push(temp);
   }
   object.groupKPIsOfDigitalTower(object.digitalTowerGroupList[3],empDigitalObj);

  //where companies have CoEs
  
  let companyCOEObj: any =[];
  for(let obj of object.dashboardData.Data.WherecompanieshaveCOEs){
      let temp = {
        label: obj.questionName,
        value: obj.value,
        code: obj.questionId,
        resultName: obj.label
      }
      companyCOEObj.push(temp);
  }
  object.groupKPIsOfDigitalTower(object.digitalTowerGroupList[0],companyCOEObj);

  //ebenfits of digital

  let benifitsDigInitiativesObj: any =[];
  for(let obj of object.dashboardData.Data.BenefitsofDigitalinitiatives){
      let temp = {
        label: obj.questionName,
        value: obj.value,
        code: obj.questionId,
        resultName: obj.label
      }
      benifitsDigInitiativesObj.push(temp);
  }
  object.groupKPIsOfDigitalTower(object.digitalTowerGroupList[1],benifitsDigInitiativesObj);

  //business innovation
  let businessInnovationObj: any =[];
  for(let obj of object.dashboardData.Data.BusinessModelInnovation){
      let temp = {
        label: obj.questionName,
        value: obj.value,
        code: obj.questionId,
        resultName: obj.label
      }
      businessInnovationObj.push(temp);
  }
  object.groupKPIsOfDigitalTower(object.digitalTowerGroupList[8],businessInnovationObj);
  
  //digital backbone
  let digitalBackboneObj: any =[];
  for(let obj of object.dashboardData.Data.DigitalBackbone){
      let temp = {
        label: obj.questionName,
        value: obj.value,
        code: obj.questionId,
        resultName: obj.label
      }
      digitalBackboneObj.push(temp);
  }
  object.groupKPIsOfDigitalTower(object.digitalTowerGroupList[6],digitalBackboneObj);

   //digital ecosystem
   let digitalEcosystemsObj: any =[];
    for(let obj of object.dashboardData.Data.DigitalEcosystems){
        let temp = {
          label: obj.questionName,
          value: obj.value,
          code: obj.questionId,
          resultName: obj.label
        }
        digitalEcosystemsObj.push(temp);
    }
    object.groupKPIsOfDigitalTower(object.digitalTowerGroupList[10],digitalEcosystemsObj);

   //digital operating model
   let digitalOperatingModelObj: any =[];
    for(let obj of object.dashboardData.Data.EnterpriseAgilityformerlyDigitalOperatingModel){
        let temp = {
          label: obj.questionName,
          value: obj.value,
          code: obj.questionId,
          resultName: obj.label
        }
        digitalOperatingModelObj.push(temp);
    }
    object.groupKPIsOfDigitalTower(object.digitalTowerGroupList[9],digitalOperatingModelObj);

    //insights
    let insightsObj : any =[];
    for(let obj of object.dashboardData.Data.Insights){
      let temp = {
        label: obj.questionName,
        value: obj.value,
        code: obj.questionId,
        resultName: obj.label
      }
      insightsObj.push(temp);
  }
  object.groupKPIsOfDigitalTower(object.digitalTowerGroupList[7],insightsObj);


  //smart technologies

  let smartTechnologiesObj: any =[];
    for(let obj of object.dashboardData.Data.TechnologiesatScaleformerlySmartTechnologies){
        let temp = {
          label: obj.questionName,
          value: obj.value,
          code: obj.questionId,
          resultName: obj.label
        }
        smartTechnologiesObj.push(temp);
    }
    object.groupKPIsOfDigitalTower(object.digitalTowerGroupList[11],smartTechnologiesObj);

   

    // let comptransformationobj: any =[];
    // for(let obj of object.dashboardData.Data.Companycurrentdigitaltransformationefforts){
    //     let temp = {
    //       label: obj.label,
    //       value: obj.value,
    //       code: obj.questionId,
    //       resultName: obj.label
    //     }
    //     comptransformationobj.push(temp);
    // }
    // object.groupKPIsOfDigitalTower(object.digitalTowerGroupList[4],comptransformationobj);

      object.mainframeDataLoaded =true;

}

//group kpi of digital tower
groupKPIsOfDigitalTower(header,obj)
{
  let object = this;
  var dataObj =[];

  for(let element of obj){
    let elementobj = {
      "kpiElementLabel" : element.label,
      "kpiElementValue" :element.value,
      "kpiElementCode" : element.code,
      "resultName": element.resultName
    }

    
    dataObj.push(elementobj);
  }

  var tempObj = {
    "headerLabel" : header,
    "dataObj" : dataObj
  }

  object.customDataObject.push(tempObj);
  

  }

  unmaskComma(value){
    let t1: any;
    t1 = value.toString().replace(/,/g,"");
    return t1;
    
  }

}
  





