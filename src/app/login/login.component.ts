/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:login.component.ts **/
/** Description:  **/
/** Created By: 106##### Created Date: 28/09/2018 **/
/** Update By:  10650919 Update Date:  03/10/2018 **/
/*******************************************************/

import {
  Component,
  OnInit
} from '@angular/core';
import {
  LoginServiceService
} from '../services/login/login-service.service';
import {
  FormsModule
} from '@angular/forms';
import {
  Router
} from '@angular/router';
import {
  LoginDataBroadcastService
} from '../services/login/login-data-broadcast.service';
import {
  Response
} from '@angular/http'
import {
  PrivilegesService
} from '../services/privileges.service'
import {
  Privileges
} from '../entities/privileges';

import { environment } from '../../environments/environment';

import { OktaAuthService } from '@okta/okta-angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading = false;
  loginData: any;
  public username: string;
  public password: any;
  loggedInFlag: boolean = false;
  error: boolean = false;
  // private errorMessage = "Incorrect username or password entered !"
  private errorMessage: any;
  private APIURL: string;

  //okta
  isAuthenticated: boolean;


  constructor(private _loginService: LoginServiceService, private router: Router, private loginDataBroadcastService: LoginDataBroadcastService, private privilegesService: PrivilegesService, public oktaAuth: OktaAuthService) {
    this.APIURL = environment.apiUrl;

    // Subscribe to authentication state changes
    this.oktaAuth.$authenticationState.subscribe(
      (isAuthenticated: boolean) => this.isAuthenticated = isAuthenticated

    );

  }

  ngOnInit() {

    // Get the authentication state for immediate use
    this.oktaAuth.isAuthenticated().then(
      (isAuthenticated: boolean) => this.isAuthenticated = isAuthenticated
    );

    console.log('is authenticated in ngoninit: ', this.isAuthenticated);

    if (localStorage.getItem('userloginInfo') != undefined || localStorage.getItem('userloginInfo') != null) {
      this.router.navigate(['/CIODashboard']);
    }
    // else
    // {
    //   this.router.navigate(['/app-authentication-failure']);
    // }

  }

  login() {

    console.log('is authenticated in login: ', this.isAuthenticated);
    //localStorage.removeItem('userloginInfo');
    this.oktaAuth.loginRedirect('/profile');
    //this.oktaAuth.logout('/');

  }

  logout() {
    this.oktaAuth.logout('/');
  }


  // send the user info and get the details 
  sendUserInfo() {
    let self = this;
    this.loading = true;
    this._loginService.getUserLoginInfo(this.username, this.password).subscribe(
      (data) => {
        // if (data["loginStatus"] == "Failed" && data["loginStatus"] == !null) {
        if (data["userDetails"]["loginStatus"] == "Success") {
          this.loginData = data;
          //    console.log(data);
          // this.changePrivilegKeysOfLinks(this.loginData.previliges);
          this.mapSessionWithDashBoards(this.loginData.privileges, this.loginData);
          this.setAccessForKPIMaintainece(this.loginData.privileges, this.loginData);

          this.setAccessForAdminSection(this.loginData.linkPrivileges, this.loginData)
          //this.loginData.previliges=CryptoJS.AES.encrypt(JSON.stringify(this.loginData.previliges), 'key').toString();


          this.loginData.landPageURL = this.privilegesService.getData().landPageURL;
          // console.log(this.loginData);
          if (this.privilegesService.getData().hasAnyPrivilege) {
            this.router.navigate([this.privilegesService.getData().landPageURL])
            this.loginDataBroadcastService.set("userloginInfo", this.loginData);
            self.loginDataBroadcastService.getEmitter().emit('setLoginData');

          } else {
            this.loading = false;
            // this.errorMessage = "You dont have any Privileges.Please contact ISG Admin";
            this.errorMessage = data["userDetails"]["loginMessage"];
            console.log(this.errorMessage);
            this.error = true;
          }

        } else {
          this.error = true;
          this.loading = false;
          // this.errorMessage = "Incorrect username or password entered !";
          this.errorMessage = data["userDetails"]["loginMessage"];
        }
      },
      error => {
        //throw custom exception to global error handler
        //create error object
        let errorObj = {
          "dashboardId": "NA",
          "pageName": "Login Screen",
          "errorType": "Fatal",
          "errorTitle": "Web Service Error",
          "errorDescription": error.message,
          "errorObject": error
        }

        throw errorObj;
      }
    );
  }
  //this will map previliges 
  //this will prevent access to particular pages
  //what being done here will be used in auth guard
  mapSessionWithDashBoards(privileges, sessionData) {
    let object = this;
    //this map is for 
    let accessMap: Map<string, boolean> = new Map<string, boolean>();


    accessMap["/CIODashboard"] = false;
    accessMap["/Mainframe"] = false;
    accessMap["/Windows"] = false;
    accessMap["/Linux"] = false;
    accessMap["/Unix"] = false;
    accessMap["/Storage"] = false;
    accessMap["/LAN"] = false;
    accessMap["/WAN"] = false;
    accessMap["/Voice"] = false;
    accessMap["/WorkplaceServices"] = false;
    accessMap["/ServiceDesk"] = false;

    let hasanyAccess = false;

    for (let privilege in privileges) {


      if (privilege == "CIO DASHBOARD" && privileges["CIO DASHBOARD"]["View Landing Page"] != undefined && privileges["CIO DASHBOARD"]["View Landing Page"] != false) {
        accessMap["/CIODashboard"] = true;
        hasanyAccess = true;
      }


      if (privilege == "MAINFRAME" && privileges["MAINFRAME"]["View Landing Page"] != undefined && privileges["MAINFRAME"]["View Landing Page"] != false) {
        accessMap["/Mainframe"] = true;
        hasanyAccess = true;
      }

      if (privilege == "WINDOWS" && privileges["WINDOWS"]["View Landing Page"] != undefined && privileges["WINDOWS"]["View Landing Page"] != false) {
        accessMap["/Windows"] = true;
        hasanyAccess = true;
      }
      if (privilege == "LINUX" && privileges["LINUX"]["View Landing Page"] != undefined && privileges["LINUX"]["View Landing Page"] != false) {
        accessMap["/Linux"] = true;
        hasanyAccess = true;
      }
      if (privilege == "UNIX" && privileges["UNIX"]["View Landing Page"] != undefined && privileges["UNIX"]["View Landing Page"] != false) {
        accessMap["/Unix"] = true;
        hasanyAccess = true;
      }
      if (privilege == "STORAGE" && privileges["STORAGE"]["View Landing Page"] != undefined && privileges["STORAGE"]["View Landing Page"] != false) {
        accessMap["/Storage"] = true;
        hasanyAccess = true;
      }

      if (privilege == "LAN" && privileges["LAN"]["View Landing Page"] != undefined && privileges["LAN"]["View Landing Page"] != false) {
        accessMap["/LAN"] = true;
        hasanyAccess = true;
      }

      if (privilege == "WAN" && privileges["WAN"]["View Landing Page"] != undefined && privileges["WAN"]["View Landing Page"] != false) {
        accessMap["/WAN"] = true;
        hasanyAccess = true;
      }


      if (privilege == "VOICE" && privileges["VOICE"]["View Landing Page"] != undefined && privileges["VOICE"]["View Landing Page"] != false) {
        accessMap["/Voice"] = true;
        hasanyAccess = true;
      }
      if (privilege == "WORKPLACE SERVICE" && privileges["WORKPLACE SERVICE"]["View Landing Page"] != undefined && privileges["WORKPLACE SERVICE"]["View Landing Page"] != false) {
        accessMap["/WorkplaceServices"] = true;
        hasanyAccess = true;
      }
      if (privilege == "SERVICE DESK" && privileges["SERVICE DESK"]["View Landing Page"] != undefined && privileges["SERVICE DESK"]["View Landing Page"] != false) {
        accessMap["/ServiceDesk"] = true;
        hasanyAccess = true;
      }

    }

    sessionData.accessMap = accessMap;
    object.privilegesService.getData().hasAnyPrivilege = hasanyAccess;
    object.privilegesService.getData().infratowers = false;

    if (accessMap["/CIODashboard"] == true) {
      object.privilegesService.getData().landPageURL = "/CIODashboard";
    } else {
      object.privilegesService.getData().landPageURL = "/Mainframe";

    }

    if (accessMap["/Mainframe"] == false) {

      if (accessMap["/Windows"] == true) {
        object.privilegesService.getData().infraURL = "/Windows";
        object.privilegesService.getData().infratowers = true;
        if (accessMap["/CIODashboard"] == false)
          object.privilegesService.getData().landPageURL = "/Windows";

        return;
      }
      if (accessMap["/Linux"] == true) {
        object.privilegesService.getData().infraURL = "/Linux";
        object.privilegesService.getData().infratowers = true;
        if (accessMap["/CIODashboard"] == false)
          object.privilegesService.getData().landPageURL = "/Linux";
        return;
      }
      if (accessMap["/Unix"] == true) {
        object.privilegesService.getData().infraURL = "/Unix";
        object.privilegesService.getData().infratowers = true;
        if (accessMap["/CIODashboard"] == false)
          object.privilegesService.getData().landPageURL = "/Unix";
        return;
      }
      if (accessMap["/Storage"] == true) {
        object.privilegesService.getData().infraURL = "/Storage";
        object.privilegesService.getData().infratowers = true;
        if (accessMap["/CIODashboard"] == false)
          object.privilegesService.getData().landPageURL = "/Storage";
        return;
      }
      if (accessMap["/LAN"] == true) {
        object.privilegesService.getData().infraURL = "/LAN";
        object.privilegesService.getData().infratowers = true;
        if (accessMap["/CIODashboard"] == false)
          object.privilegesService.getData().landPageURL = "/LAN";

        return;
      }
      if (accessMap["/WAN"] == true) {
        object.privilegesService.getData().infraURL = "/WAN";
        object.privilegesService.getData().infratowers = true;
        if (accessMap["/CIODashboard"] == false)
          object.privilegesService.getData().landPageURL = "/WAN";

        return;
      }
      if (accessMap["/Voice"] == true) {
        object.privilegesService.getData().infraURL = "/Voice";
        object.privilegesService.getData().infratowers = true;
        if (accessMap["/CIODashboard"] == false)
          object.privilegesService.getData().landPageURL = "/Voice";
        return;
      }
      if (accessMap["/WorkplaceServices"] == true) {
        object.privilegesService.getData().infraURL = "/WorkplaceServices";
        object.privilegesService.getData().infratowers = true;
        if (accessMap["/CIODashboard"] == false)
          object.privilegesService.getData().landPageURL = "/WorkplaceServices";
        return;
      }
      if (accessMap["/ServiceDesk"] == true) {
        object.privilegesService.getData().infraURL = "/ServiceDesk";
        object.privilegesService.getData().infratowers = true;
        if (accessMap["/CIODashboard"] == false)
          object.privilegesService.getData().landPageURL = "/ServiceDesk";

        return;
      }
    } else {
      object.privilegesService.getData().infratowers = true;
      if (accessMap["/CIODashboard"] == false)
        object.privilegesService.getData().landPageURL = "/Mainframe";

    }



  }

  setAccessForKPIMaintainece(privileges, sessionData) {
    let kpiMaintenance: Map<string, boolean> = new Map<string, boolean>();
    let canAccessKPIScreen = false;
    for (let privilege in privileges) {

      kpiMaintenance[privilege] = false;

      if (privilege == "CIO DASHBOARD" && privileges["CIO DASHBOARD"]["KPI MetaData Maintenance"] != undefined && privileges["CIO DASHBOARD"]["KPI MetaData Maintenance"] != false) {
        kpiMaintenance[privilege] = true;
        canAccessKPIScreen = true;
      }


      if (privilege == "MAINFRAME" && privileges["MAINFRAME"]["KPI MetaData Maintenance"] != undefined && privileges["MAINFRAME"]["KPI MetaData Maintenance"] != false) {
        kpiMaintenance[privilege] = true;
        canAccessKPIScreen = true;
      }

      if (privilege == "WINDOWS" && privileges["WINDOWS"]["KPI MetaData Maintenance"] != undefined && privileges["WINDOWS"]["KPI MetaData Maintenance"] != false) {
        kpiMaintenance[privilege] = true;
        canAccessKPIScreen = true;
      }

      if (privilege == "LINUX" && privileges["LINUX"]["KPI MetaData Maintenance"] != undefined && privileges["LINUX"]["KPI MetaData Maintenance"] != false) {
        kpiMaintenance[privilege] = true;
        canAccessKPIScreen = true;
      }

      if (privilege == "UNIX" && privileges["UNIX"]["KPI MetaData Maintenance"] != undefined && privileges["UNIX"]["KPI MetaData Maintenance"] != false) {
        kpiMaintenance[privilege] = true;
        canAccessKPIScreen = true;

      }

      if (privilege == "STORAGE" && privileges["STORAGE"]["KPI MetaData Maintenance"] != undefined && privileges["STORAGE"]["KPI MetaData Maintenance"] != false) {
        kpiMaintenance[privilege] = true;
        canAccessKPIScreen = true;
      }

      if (privilege == "LAN" && privileges["LAN"]["KPI MetaData Maintenance"] != undefined && privileges["LAN"]["KPI MetaData Maintenance"] != false) {
        kpiMaintenance[privilege] = true;
        canAccessKPIScreen = true;
      }

      if (privilege == "WAN" && privileges["WAN"]["KPI MetaData Maintenance"] != undefined && privileges["WAN"]["KPI MetaData Maintenance"] != false) {
        kpiMaintenance[privilege] = true;
        canAccessKPIScreen = true;
      }


      if (privilege == "VOICE" && privileges["VOICE"]["KPI MetaData Maintenance"] != undefined && privileges["VOICE"]["KPI MetaData Maintenance"] != false) {
        kpiMaintenance[privilege] = true;
        canAccessKPIScreen = true;
      }

      if (privilege == "WORKPLACE SERVICE" && privileges["WORKPLACE SERVICE"]["KPI MetaData Maintenance"] != undefined && privileges["WORKPLACE SERVICE"]["KPI MetaData Maintenance"] != false) {
        kpiMaintenance[privilege] = true;
        //  console.log('cvsbhjcvdfsbvchjvbfdjhvbfdjhvbfjh');
        //  console.log(JSON.stringify(kpiMaintenance));
        canAccessKPIScreen = true;
      }

      if (privilege == "SERVICE DESK" && privileges["SERVICE DESK"]["KPI MetaData Maintenance"] != undefined && privileges["SERVICE DESK"]["KPI MetaData Maintenance"] != false) {
        kpiMaintenance[privilege] = true;
        canAccessKPIScreen = true;
      }

    }

    // console.log(JSON.stringify(kpiMaintenance));

    let isInternal = sessionData.userDetails.isInternal;
    if (canAccessKPIScreen && isInternal == "yes") {
      canAccessKPIScreen = true;
    } else {
      canAccessKPIScreen = false;

    }
    sessionData.canAceessKPI = canAccessKPIScreen;
    sessionData.kpiAccess = kpiMaintenance;
  }
  setAccessForAdminSection(screens, sessionData) {

    let hasAccessToAdmin = false;
    let screensMap: Map<string, boolean> = new Map<string, boolean>();
    let isInternal = sessionData.userDetails.isInternal;

    screensMap["/roleDashboardMapping"] = false;
    screensMap["/roleUserMapping"] = false;
    screensMap["/externalUserProjectMapping"] = false;
    screensMap["/dashboardMaster"] = false;
    screensMap["/dashboardFeatureMapping"] = false;
    screensMap["/roleMaster"] = false;
    screensMap["/role-feature"] = false;
    screensMap["/adminRights"] = false;
    screensMap["/customReferenceRoleUserMapping"] = false;
    screensMap["/surveyValidation"] = false;


    if (isInternal == "yes") {
      isInternal = true;
    } else {
      isInternal = false;
    }
    for (let screen in screens) {

      if (screen == "Admin Master" && screens["Admin Master"] != undefined && screens["Admin Master"] != false) {
        screensMap["/adminRights"] = true;

      }
      if (screen == "Dashboard Feature Mapping" && screens["Dashboard Feature Mapping"] != undefined && screens["Dashboard Feature Mapping"] != false) {
        screensMap["/dashboardFeatureMapping"] = true;

      }
      if (screen == "Dashboard Master" && screens["Dashboard Master"] != undefined && screens["Dashboard Master"] != false) {
        screensMap["/dashboardMaster"] = true;
      }
      if (screen == "External User Project Mapping" && screens["External User Project Mapping"] != undefined && screens["External User Project Mapping"] != false) {
        screensMap["/externalUserProjectMapping"] = true;
      }
      if (screen == "Feature Master" && screens["Feature Master"] != undefined && screens["Feature Master"] != false) {
        screensMap["/role-feature"] = true;

      }
      if (screen == "Role Dashboard Mapping" && screens["Role Dashboard Mapping"] != undefined && screens["Role Dashboard Mapping"] != false) {
        screensMap["/roleDashboardMapping"] = true;

      }
      if (screen == "Role Master" && screens["Role Master"] != undefined && screens["Role Master"] != false) {
        screensMap["/roleMaster"] = true;
      }
      if (screen == "Role User Mapping" && screens["Role User Mapping"] != undefined && screens["Role User Mapping"] != false) {
        screensMap["/roleUserMapping"] = true;
      }
      if (screen == "Custom Reference Group User Mapping" && screens["Custom Reference Group User Mapping"] != undefined && screens["Custom Reference Group User Mapping"] != false) {
        screensMap["/customReferenceRoleUserMapping"] = true;
      }
      if (screen == "Survey Validation" && screens["Survey Validation"] != undefined && screens["Survey Validation"] != false) {
        screensMap["/surveyValidation"] = true;
      }
      if (screens[screen] == true) hasAccessToAdmin = true;

    }


    if (!isInternal) {
      screensMap["/dashboardMaster"] = false
      screensMap["/dashboardFeatureMapping"] = false;
      screensMap["/roleMaster"] = false;
      screensMap["/adminRights"] = false;
      screensMap["/kpiMaintainace"] = false;
      screensMap["/roleDashboardMapping"] = false;
      screensMap["/adminRights"] = false;
      screensMap["/externalUserProjectMapping"] = false;
      screensMap["/roleUserMapping"] = false;
      hasAccessToAdmin = false;
      screensMap["/role-feature"] = false;
      screensMap["/customReferenceRoleUserMapping"] = false;
      screensMap["/surveyValidation"] = false;

    }
    //  screensMap["/roleDashboardMapping"]=true;
    sessionData.screensMap = screensMap;
    sessionData.hasAccessToAdmin = hasAccessToAdmin;

    // console.log(JSON.stringify(this.privilegesService.getData()));
  }


  changePrivilegKeysOfLinks(links) {

    let linkMap: Map<string, string> = new Map<string, string>();

    linkMap["AdmFtr0001"] = "Dashboard Master";
    linkMap["AdmFtr0002"] = "Feature Master";
    linkMap["AdmFtr0003"] = "Role Master";
    linkMap["AdmFtr0004"] = "Admin Master";
    linkMap["AdmFtr0005"] = "Dashboard Feature Mapping";
    linkMap["AdmFtr0006"] = "Role Dashboard Mapping";
    linkMap["AdmFtr0007"] = "Role User Mapping";
    linkMap["AdmFtr0008"] = "External User Project Mapping";
    linkMap["AdmFtr0009"] = "Custom Reference Group User Mapping";
    linkMap["AdmFtr0010"] = "Survey Validation";

    for (let link in links) {

      if (linkMap[link] != undefined && linkMap[link] != null) {


        if (link == "AdmFtr0001") {
          links[linkMap["AdmFtr0001"]] = links[link];
          delete links["AdmFtr0001"];
        }
        if (link == "AdmFtr0002") {
          links[linkMap["AdmFtr0002"]] = links[link];
          delete links["AdmFtr0002"];

        }
        if (link == "AdmFtr0003") {
          links[linkMap["AdmFtr0003"]] = links[link];
          delete links["AdmFtr0003"];

        }
        if (link == "AdmFtr0004") {
          links[linkMap["AdmFtr0004"]] = links[link];
          delete links["AdmFtr0004"];

        }
        if (link == "AdmFtr0005") {
          links[linkMap["AdmFtr0005"]] = links[link];
          delete links["AdmFtr0005"];

        }
        if (link == "AdmFtr0006") {
          links[linkMap["AdmFtr0006"]] = links[link];
          delete links["AdmFtr0006"];

        }
        if (link == "AdmFtr0007") {
          links[linkMap["AdmFtr0007"]] = links[link];
          delete links["AdmFtr0007"];

        }
        if (link == "AdmFtr0008") {
          links[linkMap["AdmFtr0008"]] = links[link];
          delete links["AdmFtr0008"];

        }
        if (link == "AdmFtr0009") {
          links[linkMap["AdmFtr0009"]] = links[link];
          delete links["AdmFtr0009"];

        }
        if (link == "AdmFtr0010") {
          links[linkMap["AdmFtr0010"]] = links[link];
          delete links["AdmFtr0010"];

        }
      }
    }
  }
}