/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:infra-urlprperties.ts **/
/** Description: This file is created to create properties for URL **/
/** Created By: 10641278 Created Date: 01/10/2018 **/
/** Update By:  10641278  Update Date:  10/10/2018 **/
/*******************************************************/

export const INFRAURLProperties = {
    //FOR CIO DEFINATION
    CIO_DEFINATION_DATA : '/isgDashboard/kpiGroupWithDefination?dashboardId=1',
    //FOR COMMON
    DROPDOWN_DATA : 'isgDashboard/dropDownDataList',
    SCALE_DATA_LIST : 'isgDashboard/dropDownDataList?dropDownSource=industrySize',
    DEFINATION_DATA : '/isgDashboard/kpiGroupWithDefination',
    SCALE_FILTER_DATA : 'isgDashboard/isgDashboard?filter=Region',

    //FOR MAINFRAME
    MAINFRAME_DEFAULT_LANDING_DATA : 'isgDashboard/maindashboard?filter=Region&value=Global&industrySize=Small',
    MAINFRAME_SCALE_FILTER_DATA : 'isgDashboard/maindashboard?filter=Region',
    //FOR STORAGE
    STORAGE_DEFAULT_LANDING_DATA : 'isgDashboard/isgDashboard?filter=Region&value=Global&dashboard_id=6&industrySize=Small',
    //FOR WORKPLACE SERVICES
    WORKPLACE_SERVICES_DEFAULT_LANDING_DATA : 'isgDashboard/isgDashboard?filter=Region&value=Global&dashboard_id=10&industrySize=Small',
    //FOR SERVICE DESK
    SERVICE_DESK_DEFAULT_LANDING_DATA : 'isgDashboard/isgDashboard?filter=Region&value=Global&dashboard_id=11&industrySize=Small',
    //FOR SERVERS
    WINDOWS_DEFAULT_LANDING_DATA : 'isgDashboard/isgDashboard?filter=Region&value=Global&dashboard_id=3&industrySize=Small',
    LINUX_DEFAULT_LANDING_DATA : 'isgDashboard/isgDashboard?filter=Region&value=Global&dashboard_id=4&industrySize=Small',
    UNIX_DEFAULT_LANDING_DATA : 'isgDashboard/isgDashboard?filter=Region&value=Global&dashboard_id=5&industrySize=Small',
    LINUX_DEFINATION_DATA : 'isgDashboard/kpiGroup?dashboardId=4',
    //FOR NETWORK
    LAN_DEFAULT_LANDING_DATA : 'isgDashboard/isgDashboard?filter=Region&value=Global&dashboard_id=7&industrySize=Small',
    WAN_DEFAULT_LANDING_DATA : 'isgDashboard/isgDashboard?filter=Region&value=Global&dashboard_id=8&industrySize=Small',
    VOICE_DEFAULT_LANDING_DATA : 'isgDashboard/isgDashboard?filter=Region&value=Global&dashboard_id=9&industrySize=Small',
    //COMMON INPUT MY DATA
    INPUT_MY_DATA_TEMPLATE :'isgDashboard/templateFormat',
    REGION_INPUT_LIST_DATA : 'isgDashboard/dropDownDataList?dropDownSource=region',
    COMPARE_GRID_DATA : 'isgDashboard/compareAll',
    SCENARIO_LIST_DATA : 'isgDashboard/scenarios',
    SCENARIO_INPUT_DATA : 'isgDashboard/scenarioData',
    SAVE_SCENARIO_DATA : 'isgDashboard/saveScenario',
    SCENARIO_DATA : 'isgDashboard/templateFormat',
    CRG_COMPARE_GRID_DATA : 'isgDashboard/customReferenceCompareAll',

    //for application development
    //https://isgintellisourcedev.isg-one.com:8443/isgDashboard/admDashboard?filter_type=Global&filter_value=Grand%20Total&sessionId=LTIISG5f1578e3ba596433b99600f8d93649171
    APPLICATION_DEVELOPMENT_DEFAULT_LANDING_DATA : 'isgDashboard/admDashboard?filter_type=Global&filter_value=Grand%20Total',
    ADM_FILTER_DATA : 'isgDashboard/admDashboardFilter',
    AD_FILTER_DATA : 'isgDashboard/adDashboardFilter',
    AM_FILTER_DATA : 'isgDashboard/amDashboard',
    //for application maintenance
    APPLICATION_MAINTENANCE_DEFAULT_LANDING_DATA : 'isgDashboard/amDashboard?filter_type=Global&filter_value=Grand%20Total&dashboard_id=',
    //1.	https://isgintellisourcedev.isg-one.com:8443/isgDashboard/amDashboard?filter_type=Global&filter_value=Grand%20Total&dashboard_id=13&sessionId=LTIISG5f1578e3ba596433b99600f8d93649171

    DASHBOARD_CRG_LIST  : 'isgDashboard/customReferenceGroupListBasedOnUser?dashboardId=',
    DASHBOARD_CRG_DATA : 'isgDashboard/customReferenceLandingPage?filter_type=Region&filter_value=Global&dashboard_id=',
    ADMIN1_DASHBOARD_CRG_DATA: 'isgDashboard/fetchCustomRefererenceData?filter_type=Region&filter_value=Global&dashboard_id=',
    ADMIN1_DASHBOARD_ADM_CRG_DATA: 'isgDashboard/fetchCustomRefererenceData?filter_type=Global&filter_value=Grand%20Total&industry_size=null&dashboard_id=',        
    AD_DASHBOARD_CRG_DATA: 'isgDashboard/adCustomReference?filter_type=Total&filter_value=Grand Total&customId=',
    SAVE_UPDATE_CRG_MAINTENANCE: 'isgDashboard/saveCustomRefGroupMaster',
    MAINFRAME_DASHBOARD_CRG_DATA: 'isgDashboard/mainframeCustomReference?filter_type=Region&industry_size=Small&filter_value=Global&customId=',
    DASHBOARD_CRG_DATA_BYID: 'isgDashboard/fetchCustomRefererenceDataDetails?filter_type=Region&filter_value=Global&dashboard_id=',
    DASHBOARD_ADM_CRG_DATA_BYID : 'isgDashboard/fetchCustomRefererenceDataDetails?filter_type=Global&filter_value=Grand%20Total&industry_size=null&dashboard_id=',
    MAPPED_CRG_LIST_USER : 'isgDashboard/findGroupByUserId?userId=',  
    //http://localhost:8080/isgDashboard/fetchCustomRefererenceDataDetails?filter_type=Region&filter_value=Global&dashboard_id=10&customId=10&sessionId=LTIISG414d0561109db48e6a1306d43fa9ae57f

    //for delete scenario
    SCENARIO_DELETION: "isgDashboard/softDeleteScenarioId",
    DIGITAL_SURVEY_DELETION: "isgDashboard/softDeleteSurveyIDDigital"
}