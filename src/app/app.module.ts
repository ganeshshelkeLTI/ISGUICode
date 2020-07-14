import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';


import { CioDashboardComponent } from './cio-dashboard/cio-dashboard.component';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CompareComponent } from './Compare/compare.component';
import { CompareGridComponent } from './compare-grid/compare-grid.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgSelectModule } from '@ng-select/ng-select';

import * as FusionCharts from 'fusioncharts';
import * as FintTheme from 'fusioncharts/themes/fusioncharts.theme.fint';

import { FusionChartsModule } from 'angular-fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';

import { DonutChartComponent } from './donut-chart/donut-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component'
import { CioDashboardService } from './services/cio-dashboard.service';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { KpiMaintenanceComponent } from './kpi-maintenance/kpi-maintenance.component';
import { CompareCloseActionService } from './services/compare-close-action.service';
import { DrillDownDonutChartComponent } from './drill-down-donut-chart/drill-down-donut-chart.component';
import { CompareEnterDataComponent } from './compare-enter-data/compare-enter-data.component';
import { MainframeComponent } from './mainframe/mainframe.component';

import { NgxSpinnerModule } from 'ngx-spinner';
import { LayoutComponent } from './layout/layout.component';

import { MainframeDrillDownDonutChartComponent } from './mainframe-drill-down-donut-chart/mainframe-drill-down-donut-chart.component';
import { WindowsServersComponent } from './windows-servers/windows-servers.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { LinuxServersComponent } from './linux-servers/linux-servers.component';
import { UnixServersComponent } from './unix-servers/unix-servers.component';
import { WorkplaceServicesComponent } from './workplace-services/workplace-services.component';
import { EnterMyDataTowersComponent } from './enter-my-data-towers/enter-my-data-towers.component';
import { CompareTowersComponent } from './compare-towers/compare-towers.component'

import { StorageComponent } from './storage/storage.component';

import { ServiceDeskComponent } from './service-desk/service-desk.component';

import { LanNetworkComponent } from './lan-network/lan-network.component';
import { WanNetworkComponent } from './wan-network/wan-network.component';
import { VoiceNetworkComponent } from './voice-network/voice-network.component';
import { PopoverModule } from 'ng2-popover';
import { PopoverNoteComponent } from './popover-note/popover-note.component';
import { PopNoteComponent } from './pop-note/pop-note.component';
import { BarchartComponent } from './barchart/barchart.component';
import { CompareGridTowersComponent } from './compare-grid-towers/compare-grid-towers.component';
import { LoginComponent } from './login/login.component';
import { ServerInputMyDataComponent } from './server-input-my-data/server-input-my-data.component';
import { EnterMyDataWindowsComponent } from './enter-my-data-windows/enter-my-data-windows.component';
import { EnterMyDataLinuxComponent } from './enter-my-data-linux/enter-my-data-linux.component';
import { CompareGridServersComponent } from './compare-grid-servers/compare-grid-servers.component';
import { EnterMyDataUnixComponent } from './enter-my-data-unix/enter-my-data-unix.component';
import { CompareGridStorageComponent } from './compare-grid-storage/compare-grid-storage.component'

//Directive imports
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { EnterMyDataWorkplaceServiceComponent } from './enter-my-data-workplace-service/enter-my-data-workplace-service.component';
import { EnterMyDataStorageComponent } from './enter-my-data-storage/enter-my-data-storage.component';
import { CompareGridWorkplaceComponent } from './compare-grid-workplace/compare-grid-workplace.component';
import { EnterMyDataServiceDeskComponent } from './enter-my-data-service-desk/enter-my-data-service-desk.component';
import { CompareGridServiceDeskComponent } from './compare-grid-service-desk/compare-grid-service-desk.component';
import { EnterMyDataLANComponent } from './enter-my-data-lan/enter-my-data-lan.component';
import { EnterMyDataWanComponent } from './enter-my-data-wan/enter-my-data-wan.component';
import { EnterMyDataVoiceComponent } from './enter-my-data-voice/enter-my-data-voice.component';
import { CompareGridNetworkComponent } from './compare-grid-network/compare-grid-network.component';
import { UserPrivilegesComponent } from './user-privileges/user-privileges.component';

// Auth guard
import { AuthGuard } from './services/login/auth-guard.service';
// import { NoDecimalDirective } from './directives/no-decimal.directive';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Interceptor } from './entities/interceptor';
// import { NgxPermissionsModule } from 'ngx-permissions';

//import global error handler
import {ErrorHandler} from '@angular/core';
import {GlobalErrorHandlerService} from './services/error-handler/global-error-handler.service';
import { RoleMasterComponent } from './role-master/role-master.component';
import { RoleDashboardMappingComponent } from './role-dashboard-mapping/role-dashboard-mapping.component';
import { ExternalUserProjectMapping } from './external-user-project-mapping/external-user-project-mapping.component';
import { DashboardMasterComponent } from './dashboard-master/dashboard-master.component';
import { FeatureMasterComponent } from './feature-master/feature-master.component';
import { DashboardFeatureMappingComponent } from './dashboard-feature-mapping/dashboard-feature-mapping.component';
import { RoleUserMappingComponent } from './role-user-mapping/role-user-mapping.component';
import { RoleFeatureComponent } from './role-feature/role-feature.component';
import { ViewAllUserComponent } from './view-all-user/view-all-user.component';
// import { AuthorizerDirective } from './directives/authorizer.directive';

import { WebLinkMasterComponent } from './web-link-master/web-link-master.component';

import { Ng2SearchPipeModule } from 'ng2-search-filter'; 
import { OrderModule } from 'ngx-order-pipe';
import { NegativeNumberDirective } from './directives/negative-number.directive';



import { AdminMasterComponent } from './admin-master/admin-master.component';
import { AuthorizerDirective } from './directives/authorizer.directive';
import { NoDecimalDirective } from './directives/no-decimal.directive';
import { NumberDirective } from './services/number.directive';
import { SupportMailComponent } from './support-mail/support-mail.component';
import { AuthenticationFailureComponent } from './authentication-failure/authentication-failure.component';
import { environment } from '../environments/environment';
import { ChartsModule } from 'ng2-charts';
import { Ng5SliderModule } from 'ng5-slider';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import 'web-animations-js';  
 
// Import library
import { Ng6NotifyPopupModule } from 'ng6-notify-popup';

FusionChartsModule.fcRoot(FusionCharts, Charts, FintTheme);

//okta imports
import {
  OktaAuthModule,
  OktaCallbackComponent,
} from '@okta/okta-angular';

import { AdmComponent } from './adm/adm.component';
import { DigitalComponent } from './digital/digital.component';
import { EnterMyDataDigitalComponent } from './enter-my-data-digital/enter-my-data-digital.component';
import { ApplicationDevelopmentComponent } from './application-development/application-development.component';
import { ApplicationMaintenanceComponent } from './application-maintenance/application-maintenance.component';
import { EnterMyDataApplicationDevelopmentComponent } from './enter-my-data-application-development/enter-my-data-application-development.component';
import { EnterMyDataApplicationMaintenanceComponent } from './enter-my-data-application-maintenance/enter-my-data-application-maintenance.component';
import { CompareGridApplicationDevelopmentComponent } from './compare-grid-application-development/compare-grid-application-development.component';
import { CompareGridApplicationMaintenanceComponent } from './compare-grid-application-maintenance/compare-grid-application-maintenance.component';
import { CustomrefenceGroupUserMappingComponent } from './customrefence-group-user-mapping/customrefence-group-user-mapping.component';
import { CustomReferenceMaintenanceComponent } from './custom-reference-maintenance/custom-reference-maintenance.component';
import { SurveyQuestionMaintenanceComponent } from './survey-question-maintenance/survey-question-maintenance.component';
import { CompareTowersDigitalComponent } from './compare-towers-digital/compare-towers-digital.component';
import { SurveyValidationComponent } from './survey-validation/survey-validation.component';
import { CompareGridDigitalComponent } from './compare-grid-digital/compare-grid-digital.component';
import { SurveyValidationAdminComponent } from './survey-validation-admin/survey-validation-admin.component';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { TextMaskModule}  from 'angular2-text-mask';
import { InactiveSurveyMaintenanceComponent } from './inactive-survey-maintenance/inactive-survey-maintenance.component';
import { MasterSurveyQuestionMaintenanceComponent } from './master-survey-question-maintenance/master-survey-question-maintenance.component';
import { DeploymentNotificationComponent } from './deployment-notification/deployment-notification.component';


//this.APIURL = environment.apiUrl;

const config = environment.config;

console.log('config: ', config);

const appRoutes: Routes = [
  {
    path: '',
    component:LoginComponent
  },
  {
    path: 'implicit/callback',
    component: OktaCallbackComponent
  },
  {
    path: 'CIODashboard',
    component:CioDashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'kpiMaintainace',
    component:KpiMaintenanceComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'Mainframe',
    component:MainframeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'Windows',
    component:WindowsServersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'Linux',
    component:LinuxServersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'Unix',
    component:UnixServersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'WorkplaceServices',
    component:WorkplaceServicesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'Storage',
    component:StorageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'ServiceDesk',
    component:ServiceDeskComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'line',
    component:LineChartComponent
  },
  {
    path: 'LAN',
    component:LanNetworkComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'WAN',
    component:WanNetworkComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'Voice',
    component:VoiceNetworkComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component:LoginComponent
  },
  {
    path: 'user-privileges',
    component:UserPrivilegesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'roleMaster',
    component:RoleMasterComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'roleDashboardMapping',
    component:RoleDashboardMappingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'externalUserProjectMapping',
    component:ExternalUserProjectMapping,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboardMaster',
    component:DashboardMasterComponent,
    canActivate: [AuthGuard]
  },
  // removed
  // {
  //   path: 'featureMaster',
  //   component:FeatureMasterComponent
  // },
  {
    path: 'dashboardFeatureMapping',
    component:DashboardFeatureMappingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'roleUserMapping',
    component:RoleUserMappingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'role-feature',
    component:RoleFeatureComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'customReferenceMaintenance',
    component:CustomReferenceMaintenanceComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'customReferenceRoleUserMapping',
    component:CustomrefenceGroupUserMappingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'surveyQuestionMaintenance',
    component:SurveyQuestionMaintenanceComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'surveyValidation',
    component:SurveyValidationComponent,
    canActivate: [AuthGuard],
  },
	{
    path: 'survey-validation',
    component: SurveyValidationAdminComponent,
    canActivate: [AuthGuard]
  },

  // {
  //   path: 'viewExternalUser',
  //   component:ViewAllUserComponent
  // },

  // old
  // {
  //   path: 'webLinkMaster',
  //   component:WebLinkMasterComponent
  // }

  // new
  {
    path: 'adminRights',
    component:WebLinkMasterComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'app-authentication-failure',
    component: AuthenticationFailureComponent
  },
  {
    path: 'ADM',
    component:AdmComponent,
    canActivate: [AuthGuard]
  },
   {
     path: 'Digital',
     component:DigitalComponent,
     canActivate: [AuthGuard]
   },
  {
    path: 'application-development',
    component:ApplicationDevelopmentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'application-maintenance',
    component:ApplicationMaintenanceComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'scenarioMaintenance',
    component: InactiveSurveyMaintenanceComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'masterQuestionMaintenance',
    component: MasterSurveyQuestionMaintenanceComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'deploymentNotificationComponent',
    component: DeploymentNotificationComponent,
    canActivate: [AuthGuard]
  }
];



@NgModule({
  declarations: [
    AppComponent,
    CioDashboardComponent,
    HeaderComponent,
    FooterComponent,
    DonutChartComponent,
    PieChartComponent,
    CompareComponent,
    KpiMaintenanceComponent,
    CompareGridComponent,
    CompareEnterDataComponent,
    DrillDownDonutChartComponent,
    LayoutComponent,
    MainframeDrillDownDonutChartComponent,
    WindowsServersComponent,
    LineChartComponent,
    LinuxServersComponent,
    MainframeComponent,
    UnixServersComponent,
    ServiceDeskComponent,
    StorageComponent,
    WorkplaceServicesComponent,
    EnterMyDataTowersComponent,
    CompareTowersComponent,
    UnixServersComponent,
    LanNetworkComponent,
    WanNetworkComponent,
    VoiceNetworkComponent,
    PopNoteComponent,
    BarchartComponent,
    CompareGridTowersComponent,
    LoginComponent,
    ServerInputMyDataComponent,
    EnterMyDataWindowsComponent,
    EnterMyDataLinuxComponent,
    EnterMyDataUnixComponent,
    CompareGridServersComponent,
    PopoverNoteComponent,
    EnterMyDataWorkplaceServiceComponent,
    EnterMyDataStorageComponent,
    CompareGridStorageComponent,
    CompareGridWorkplaceComponent,
    EnterMyDataServiceDeskComponent,
    CompareGridServiceDeskComponent,
    EnterMyDataLANComponent,
    NumbersOnlyDirective,
    EnterMyDataWanComponent,
    CompareGridNetworkComponent,
    UserPrivilegesComponent,
    AdminMasterComponent,
    AuthorizerDirective,
    NoDecimalDirective,
    // NoDecimalDirective,
    RoleMasterComponent,
    RoleDashboardMappingComponent,
    ExternalUserProjectMapping,
    DashboardMasterComponent,
    FeatureMasterComponent,
    DashboardFeatureMappingComponent,
    RoleUserMappingComponent,
    RoleFeatureComponent,
    ViewAllUserComponent,
    // AuthorizerDirective,
    WebLinkMasterComponent,
    NegativeNumberDirective,
    EnterMyDataVoiceComponent,
    NegativeNumberDirective,
    NumberDirective,
    SupportMailComponent,
    AdmComponent,
    DigitalComponent,
    EnterMyDataDigitalComponent,
    ApplicationDevelopmentComponent,
    ApplicationMaintenanceComponent,
    EnterMyDataApplicationDevelopmentComponent,
    EnterMyDataApplicationMaintenanceComponent,
    CompareGridApplicationDevelopmentComponent,
    CompareGridApplicationMaintenanceComponent,
    AuthenticationFailureComponent,
    CustomrefenceGroupUserMappingComponent,
    CustomReferenceMaintenanceComponent,
    CompareTowersDigitalComponent ,
    SurveyQuestionMaintenanceComponent,
     CompareGridDigitalComponent,
     SurveyValidationAdminComponent,
     SurveyValidationComponent,
    MasterSurveyQuestionMaintenanceComponent,
    DeploymentNotificationComponent,
    InactiveSurveyMaintenanceComponent
  ],
  imports: [
    // NgxPermissionsModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    FusionChartsModule,
    // NgxPermissionsModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      {useHash: true}
    ),
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    PopoverModule,
    AngularFontAwesomeModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    NgSelectModule,NgxSpinnerModule,ToastrModule.forRoot({preventDuplicates: true}),
    Ng2SearchPipeModule,
    OrderModule, //including into imports
    OktaAuthModule.initAuth(config),
    ChartsModule,
    Ng5SliderModule,
    TextMaskModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    Ng6NotifyPopupModule,
  ],
  providers: [CioDashboardService,AuthGuard,{
    provide: ErrorHandler,
    useClass: GlobalErrorHandlerService,
  },{
    provide: HTTP_INTERCEPTORS,
    useClass: Interceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
