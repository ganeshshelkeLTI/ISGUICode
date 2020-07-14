import {
  Component
} from '@angular/core';
import {
  Observable
} from 'rxjs';
import {
  HttpClientModule
} from '@angular/common/http';
import {
  HttpClient,
  HttpParams,
  HttpRequest,
  HttpHeaders,
  HttpEvent
} from '@angular/common/http';
import {
  Http
} from '@angular/http';
import {
  Router,
  Event
} from '@angular/router';
import {
  Location
} from '@angular/common';
import {
  NavigationEnd
} from '@angular/router';

import {
  PrivilegesService
} from './services/privileges.service'

import {
  TokenAuthenticationService
} from './services/token-authentication.service';

import {
  LoginDataBroadcastService
} from './services/login/login-data-broadcast.service';
import {
  Response
} from '@angular/http'

import {
  Privileges
} from './entities/privileges';

import { environment } from '../environments/environment';

import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'IntelliSource Dashboard';
  myVal = 0;
  router: string;
  url = "";

  private tokenParam: any;
  private stateParam: any;
  private codeParam: any;
  private urlString: any;
  private url_length: number;
  private token_index: number;
  private urlLoaded: boolean = false;
  private param_string: any;
  private paramArray: any;
  private authenticationReqObject: any;
  showHeaderComponent: boolean = false;
  private dashboardURLMapper: Map<string, string>;

  //variables from login page
  loading = false;
  loginData: any;
  public username: string;
  public password: any;
  loggedInFlag: boolean = false;
  error: boolean = false;
  // private errorMessage = "Incorrect username or password entered !"
  private errorMessage: any;
  private APIURL: string;

  //session variables
  private userdata: any;
  private sessionId: any;

  private storedLoginData: any;


  //private _loginService: LoginServiceService, private router: Router, private loginDataBroadcastService: LoginDataBroadcastService, private privilegesService: PrivilegesService

  constructor(private _router: Router, private location: Location, private privilegesService: PrivilegesService, private tokenAuthenticationService: TokenAuthenticationService, private loginDataBroadcastService: LoginDataBroadcastService, public oktaAuth: OktaAuthService) {

    this.APIURL = environment.apiUrl;

   
    this.dashboardURLMapper = new Map<string, string>();
    this.prepareMap();
    this._router.events.subscribe((event: Event) => {

      if (!this.urlLoaded) {
        this.url = this.location.path();

      
        this.urlString = window.location.href;

        if(this.urlString.indexOf("isginformxdev")>=0)
        {
          window.location.href="https://informdev.isg-one.com/dev";
        }
        else if(this.urlString.indexOf("isginformxtest")>=0)
        {
          window.location.href="https://informtest.isg-one.com";
        }
        else if(this.urlString.indexOf("isginformxdemo")>=0)
        {
          window.location.href="https://informdemo.isg-one.com";
        }
        else if(this.urlString.indexOf("isginformx.isg-one")>=0)
        {
          window.location.href="https://inform.isg-one.com";
        }
    

        this.url_length = this.urlString.length;
        this.token_index = this.urlString.indexOf('id_token');



        //if user is already logged in, we get session id
        //if token and sessionid both are absent, redirect to logout 

        //get session id

        this.userdata = this.loginDataBroadcastService.get('userloginInfo');

        if (this.userdata != null && this.userdata != undefined) {

          this.sessionId = this.userdata['userDetails']["sessionId"];

        }
        else {

          this.sessionId = '';

        }


        if ((this.token_index != null && Number(this.token_index) > -1)) {



          //get parameter string
          this.param_string = window.location.href.substring(this.token_index, this.url_length);


          //get prameters seperated by &
          this.paramArray = this.param_string.split('&');


          for (let cnt = 0; cnt < this.paramArray.length; cnt++) {
            //get id_token parameter
            if (Number(this.paramArray[cnt].indexOf('id_token')) > -1) {
              this.tokenParam = this.paramArray[cnt].split('=')[1];


            }

            if (this.tokenParam == undefined || this.tokenParam == null) {
              this.tokenParam = '';
            }


            //get state parameter
            if (Number(this.paramArray[cnt].indexOf('state')) > -1) {
              this.stateParam = this.paramArray[cnt].split('=')[1];
            }


            if (this.stateParam == undefined || this.stateParam == null) {
              this.stateParam = '';
            }

            //get code parameter
            if (Number(this.paramArray[cnt].indexOf('code')) > -1) {
              this.codeParam = this.paramArray[cnt].split('=')[1];
            }


            if (this.codeParam == undefined || this.codeParam == null) {
              this.codeParam = '';
            }

          }


          //set parameters in service
          // this.tokenAuthenticationService.setParameters(this.tokenParam, this.stateParam, this.codeParam);

          this.authenticationReqObject = {
            "tokenId": this.tokenParam,
            "code": "",
            "state": ""
          };


          //call web service for authentication if token id is present
          if (Number(this.tokenParam.length) > 0) {
            //call web service 


            this.tokenAuthenticationService.authenticateToken(this.authenticationReqObject).subscribe(
              (responseData) => {

                //if response is successful redirect user to ISG portal
                this.sendUserInfo(responseData);

                // this.tokenAuthenticationService.setLoginData(responseData);

              },
              (error) => { });
          }
          else {
            //redirect to external login page

            console.log('token not found loop: ', this.tokenParam);
            console.log('environment: ', this.APIURL);

            //this.oktaAuth.loginRedirect('/profile');
            this.oktaAuth.logout('/');

            //dev
            // if(this.APIURL=='https://isgintellisourcedev.isg-one.com:8443/')
            // {
            //   //window.location.href='https://isgb2c.b2clogin.com/isgb2c.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_ISG_Momentum_SU_SI&client_id=c5501d47-10fc-48b8-b6c1-384e5ec3e995&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fisginformxdev.isg-one.com%2Fdev&scope=openid&response_type=id_token&prompt=login';
            //   //local
            //   //this.oktaAuth.loginRedirect('/login');

            // }
            // //QA
            // else if(this.APIURL=='https://isgintellisourceqaws.isg-one.com:8443/')
            // {
            //   window.location.href='https://isgb2c.b2clogin.com/isgb2c.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_ISG_GENERIC_SUSI&client_id=c663867c-064b-455e-9d58-364fa911dc28&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fisginformxtest.isg-one.com&scope=openid&response_type=id_token&prompt=login';
            // }
            // //prod
            // else if(this.APIURL=='https://isgintellisource.isg-one.com:8443/')
            // {
            //   window.location.href='https://isgb2c.b2clogin.com/isgb2c.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_ISG_GENERIC_SUSI&client_id=848bd326-7030-4952-b9c1-d567b550ba6b&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fisginformx.isg-one.com&scope=openid&response_type=id_token&prompt=login';
            // }
            // else
            // {
            //   //local
            //   this.oktaAuth.loginRedirect('/profile');
            //   //window.location.href='https://isgb2c.b2clogin.com/isgb2c.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_ISG_Momentum_SU_SI&client_id=c5501d47-10fc-48b8-b6c1-384e5ec3e995&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fisginformxdev.isg-one.com%2Fdev&scope=openid&response_type=id_token&prompt=login';
            // }

          }



        }

        else if (this.sessionId != null && this.sessionId != undefined && this.sessionId != '') {

          // //get login data

          // this.storedLoginData = this.tokenAuthenticationService.getLoginData();



          // //send to authentication method
          // this.sendUserInfo(this.storedLoginData);



        }

        else {


          //redirect to external login page

          //this.oktaAuth.loginRedirect('/profile');
          this.oktaAuth.logout('/');

          //dev
          // if(this.APIURL=='https://isgintellisourcedev.isg-one.com:8443/')
          // {
          //  // window.location.href='https://isgb2c.b2clogin.com/isgb2c.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_ISG_Momentum_SU_SI&client_id=c5501d47-10fc-48b8-b6c1-384e5ec3e995&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fisginformxdev.isg-one.com%2Fdev&scope=openid&response_type=id_token&prompt=login';
          //  //local
          //  //this.oktaAuth.loginRedirect('/login');

          // }
          // //QA
          // else if(this.APIURL=='https://isgintellisourceqaws.isg-one.com:8443/')
          // {
          //   window.location.href='https://isgb2c.b2clogin.com/isgb2c.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_ISG_GENERIC_SUSI&client_id=c663867c-064b-455e-9d58-364fa911dc28&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fisginformxtest.isg-one.com&scope=openid&response_type=id_token&prompt=login';
          // }
          // //prod
          // else if(this.APIURL=='https://isgintellisource.isg-one.com:8443/')
          // {
          //   window.location.href='https://isgb2c.b2clogin.com/isgb2c.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_ISG_GENERIC_SUSI&client_id=848bd326-7030-4952-b9c1-d567b550ba6b&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fisginformx.isg-one.com&scope=openid&response_type=id_token&prompt=login';
          // }
          // else
          // {
          //   //window.location.href='https://isgbaa2c.b2clogin.com/isgb2c.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_ISG_Momentum_SU_SI&client_id=c5501d47-10fc-48b8-b6c1-384e5ec3e995&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fisginformxdev.isg-one.com%2Fdev&scope=openid&response_type=id_token&prompt=login';
          //   this.oktaAuth.loginRedirect('/profile');
          // }
        }

        this.urlLoaded = true;

      }
      else
      {
       this.urlString = window.location.href;
      
        if(this.urlString.indexOf("isginformxdev")>=0)
        {
          window.location.href="https://informdev.isg-one.com/dev";
        }
        else if(this.urlString.indexOf("isginformxtest")>=0)
        {
          window.location.href="https://informtest.isg-one.com";
        }
        else if(this.urlString.indexOf("isginformxdemo")>=0)
        {
          window.location.href="https://informdemo.isg-one.com";
        }
        else if(this.urlString.indexOf("isginformx.isg-one")>=0)
        {
          window.location.href="https://inform.isg-one.com";
        }
      }

      if (event instanceof NavigationEnd) {

        if (event.url == '/' || event.url == '/login') {
          this.showHeaderComponent = false;
        } else {
          let url = event.url;
          this.allowAccesss();
          console.log('this.dashboardURLMapper[url.slice(1)] ', this.dashboardURLMapper[url.slice(1)]);
          console.log('this.dashboardURLMapper[url]', this.dashboardURLMapper[url]);
          console.log('this.dashboardURLMapper', this.dashboardURLMapper);

          this.setPrivileges(this.dashboardURLMapper[url.slice(1)]);
          this.privilegesService.getEmitter().emit('updatePrivileges');
          this.showHeaderComponent = true;
        }
      }
    });
  }
  ngOnInit() {

  }

  sendUserInfo(data) {
    let self = this;
    this.loading = true;

    // if (data["loginStatus"] == "Failed" && data["loginStatus"] == !null) {
    if (data["userDetails"]["loginStatus"] == "Success") {
      this.loginData = data;

      //if no previlages are present, send to auth failure
      // if(Number(this.loginData.privileges.length)<=0)
      // {
      //   //redirect auth failure 

      //  this.error = true;
      //   this.loading = false;
      //   var msg = "You do not have the necessary privileges to access the system. Please contact ISG support @ ISG ISGInformX@isg-one.com";
      //   this.loginDataBroadcastService.set("errorMessage", msg);
      //   this._router.navigate(['/app-authentication-failure']);

      // }


      // this.changePrivilegKeysOfLinks(this.loginData.previliges);
      this.mapSessionWithDashBoards(this.loginData.privileges, this.loginData);
      this.setAccessForKPIMaintainece(this.loginData.privileges, this.loginData);

      this.setAccessForAdminSection(this.loginData.linkPrivileges, this.loginData)
      //this.loginData.previliges=CryptoJS.AES.encrypt(JSON.stringify(this.loginData.previliges), 'key').toString();


      this.loginData.landPageURL = this.privilegesService.getData().landPageURL;

      if (this.privilegesService.getData().hasAnyPrivilege) {
        this._router.navigate([this.privilegesService.getData().landPageURL])
        this.loginDataBroadcastService.set("userloginInfo", this.loginData);
        self.loginDataBroadcastService.getEmitter().emit('setLoginData');

      } else {
        this.loading = false;
        // this.errorMessage = "You dont have any Privileges.Please contact ISG Admin";
        this.errorMessage = data["userDetails"]["loginMessage"];

        this.error = true;
      }

    } else {

      this.error = true;
      this.loading = false;
      this.loginDataBroadcastService.set("errorMessage", data["userDetails"]["loginMessage"]);
      this._router.navigate(['/app-authentication-failure']);
    }
  }


  getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\#&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);


    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ''));
  };


  setPrivileges(url) {
    let object = this;
    let privileges = JSON.parse(localStorage.getItem('userloginInfo'));

    console.log('privilages from login: ', privileges);
    console.log('privilageurl fetched: ', url);

    if (privileges["privileges"][url] == undefined || privileges["privileges"][url] == null) {

      object.privilegesService.getData().compareScreen = false;
      object.privilegesService.getData().pdf = false;
      object.privilegesService.getData().reset = false;
      object.privilegesService.getData().saveScenario = false;
      object.privilegesService.getData().enterMyData = false;
      object.privilegesService.getData().deleteScenario = false;

      return;

    }    //Run Compare: false

    console.log("privileges Input My Data", privileges["privileges"][url]["Input My Data"]);
    if (privileges["privileges"][url]["Input My Data"] == undefined || privileges["privileges"][url]["Input My Data"] == false) {
      console.log('setting input my data false ', privileges["privileges"][url]["Input My Data"]);

      object.privilegesService.getData().enterMyData = false;
    } else {
      object.privilegesService.getData().enterMyData = true;
      console.log('setting input my data true ', url);
    }
    //for Compare Screen
    if (privileges["privileges"][url]["Compare"] == undefined || privileges["privileges"][url]["Compare"] == false) {
      object.privilegesService.getData().compareScreen = false;
    } else {
      object.privilegesService.getData().compareScreen = true;
    }
    //for PDF
    if (privileges["privileges"][url]["Generate PDF"] == undefined || privileges["privileges"][url]["Generate PDF"] == false) {
      object.privilegesService.getData().pdf = false;
    } else {
      object.privilegesService.getData().pdf = true;
    }
    //for Save Scenario
    if (privileges["privileges"][url]["Save Scenarios"] == undefined || privileges["privileges"][url]["Save Scenarios"] == false) {
      object.privilegesService.getData().saveScenario = false;
    } else {
      object.privilegesService.getData().saveScenario = true;
    }
    if (privileges["privileges"][url]["Delete Scenario"] == undefined || privileges["privileges"][url]["Delete Scenario"] == false) {
      object.privilegesService.getData().deleteScenario = false;
    } else {
      object.privilegesService.getData().deleteScenario = true;
    }

  }
  //this will allow access to particular DashBoard(hide and show on header)
  allowAccesss() {
    let object = this;
    let privileges = JSON.parse(localStorage.getItem('userloginInfo')).privileges;
    console.log('tower list ', privileges);
    let infraTower = false;
    let applicationTower = false;
    let digitalTower = false;
    for (let tower in privileges) {

      if (privileges[tower]["View Landing Page"] != undefined && privileges[tower]["View Landing Page"]) {

        if (tower == "WAN" || tower == "LAN" || tower == "VOICE") {
          object.privilegesService.getData().network = true;
          infraTower = true;
        }
        if (tower == "WINDOWS" || tower == "UNIX" || tower == "LINUX") {
          object.privilegesService.getData().servers = true;
          infraTower = true;
        }
        if (tower == "WORKPLACE SERVICE" || tower == "SERVICE DESK" || tower == "MAINFRAME") {

          infraTower = true;
        }
        if (tower == "Application Development" || tower == "Application Maintenance and Support") {

          applicationTower = true;

        }

        if (tower == "Digital Tower") {

          digitalTower = true;

        }

        object.privilegesService.getData()[tower] = true;

      } else {
        object.privilegesService.getData()[tower] = false;

      }


    }

    object.privilegesService.getData().infratowers = infraTower;
    object.privilegesService.getData().applicationtowers = applicationTower;
    object.privilegesService.getData().digitaltower = digitalTower;


    //  if(privileges["CIO DASHBOARD"]==undefined||)


  }
  prepareMap() {

    this.dashboardURLMapper["CIODashboard"] = "CIO DASHBOARD";
    this.dashboardURLMapper["Mainframe"] = "MAINFRAME";

    this.dashboardURLMapper["Windows"] = "WINDOWS";
    this.dashboardURLMapper["Linux"] = "LINUX";
    this.dashboardURLMapper["Unix"] = "UNIX";

    this.dashboardURLMapper["Storage"] = "STORAGE";

    this.dashboardURLMapper["LAN"] = "LAN";
    this.dashboardURLMapper["WAN"] = "WAN";
    this.dashboardURLMapper["Voice"] = "VOICE";

    this.dashboardURLMapper["WorkplaceServices"] = "WORKPLACE SERVICE";

    this.dashboardURLMapper["ServiceDesk"] = "SERVICE DESK";

    this.dashboardURLMapper["application-development"] = "Application Development";
    this.dashboardURLMapper["application-maintenance"] = "Application Maintenance and Support";

    this.dashboardURLMapper["Digital"] = "Digital Tower";


  }

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
    accessMap["/application-development"] = false;
    accessMap["/application-maintenance"] = false;
    accessMap["/Digital"] = false;

    let hasanyAccess = false;

    for (let privilege in privileges) {

      console.log('map access: ', privilege);

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

      if (privilege == "Application Development" && privileges["Application Development"]["View Landing Page"] != undefined && privileges["Application Development"]["View Landing Page"] != false) {
        accessMap["/application-development"] = true;
        hasanyAccess = true;
      }

      if (privilege == "Application Maintenance and Support" && privileges["Application Maintenance and Support"]["View Landing Page"] != undefined && privileges["Application Maintenance and Support"]["View Landing Page"] != false) {
        accessMap["/application-maintenance"] = true;
        hasanyAccess = true;
      }

      if (privilege == "Digital Tower" && privileges["Digital Tower"]["View Landing Page"] != undefined && privileges["Digital Tower"]["View Landing Page"] != false) {
        accessMap["/Digital"] = true;
        hasanyAccess = true;
      }

    }

    
    
    sessionData.accessMap = accessMap;
    object.privilegesService.getData().hasAnyPrivilege = hasanyAccess;
    object.privilegesService.getData().infratowers = false;
    object.privilegesService.getData().digitaltower = false;

    if (accessMap["/CIODashboard"] == true) {
      console.log('2');
      object.privilegesService.getData().landPageURL = "/CIODashboard";
    } else if (accessMap["/application-development"] == true) {
      console.log('3')
      object.privilegesService.getData().landPageURL = "/application-development";

    }
    else if (accessMap["/application-maintenance"] == true) {
      console.log('4')
      object.privilegesService.getData().landPageURL = "/application-maintenance";
    }
    else {
      console.log('5');
      object.privilegesService.getData().landPageURL = "/Digital";
    }

    if (accessMap["/application-development"] == false) {
      console.log('6');
      if (accessMap["/application-maintenance"] == true) {
        console.log('7');
        object.privilegesService.getData().applicationURL = "/application-maintenance";
        object.privilegesService.getData().applicationtowers = true;
        if (accessMap["/CIODashboard"] == false)
          object.privilegesService.getData().landPageURL = "/application-maintenance";

        return;
      }
      else {
        console.log('8');
        object.privilegesService.getData().infratowers = true;
        if (accessMap["/CIODashboard"] == false)
          object.privilegesService.getData().landPageURL = "/Mainframe";

      }
    }

    if (accessMap["/application-maintenance"] == false) {
      console.log('9');
      if (accessMap["/application-development"] == true) {
        object.privilegesService.getData().applicationURL = "/application-development";
        object.privilegesService.getData().applicationtowers = true;
        if (accessMap["/CIODashboard"] == false)
          object.privilegesService.getData().landPageURL = "/application-development";

        return;
      }
      else {
        console.log('10');
        object.privilegesService.getData().infratowers = true;
        if (accessMap["/CIODashboard"] == false)
          object.privilegesService.getData().landPageURL = "/Mainframe";

      }
    }

    if (accessMap["/Digital"] == false) {
      console.log('11');
      /*if (accessMap["/application-development"] == true) {
        object.privilegesService.getData().applicationURL = "/application-development";
        object.privilegesService.getData().applicationtowers = true;
        if (accessMap["/CIODashboard"] == false)
          object.privilegesService.getData().landPageURL = "/application-development";

        return;
      }
      else if (accessMap["/application-maintenance"] == true) {
        object.privilegesService.getData().applicationURL = "/application-maintenance";
        object.privilegesService.getData().applicationtowers = true;
        if (accessMap["/CIODashboard"] == false)
          object.privilegesService.getData().landPageURL = "/application-maintenance";

        return;
      }
      else {
        object.privilegesService.getData().infratowers = true;
        if (accessMap["/CIODashboard"] == false)
          object.privilegesService.getData().landPageURL = "/CIODashboard";

      }*/

      object.privilegesService.getData().digitaltower=false;
      
    }
    else
    {
      object.privilegesService.getData().digitaltower=true;

      
      object.privilegesService.getData().infratowers = true;
      if (accessMap["/Digital"] == false)
        object.privilegesService.getData().landPageURL = "/Digital";

        if (accessMap["/application-development"] == false 
      && accessMap["/application-maintenance"] == false 
      && accessMap["/CIODashboard"] == false
      && accessMap["/Mainframe"] == false
      && accessMap["/Linux"] == false
      && accessMap["/Unix"] == false
      && accessMap["/Storage"] == false
      && accessMap["/LAN"] == false
      && accessMap["/WAN"] == false
      && accessMap["/Voice"] == false
      && accessMap["/WorkplaceServices"] == false
      && accessMap["/ServiceDesk"] == false) {
        
        object.privilegesService.getData().applicationURL = "/Digital";
        object.privilegesService.getData().landPageURL = "/Digital";

        
        //return;
      }

    }


    if (accessMap["/Mainframe"] == false) {
      console.log('13');
      if (accessMap["/Windows"] == true) {
        object.privilegesService.getData().infraURL = "/Windows";
        object.privilegesService.getData().infratowers = true;
        if (accessMap["/CIODashboard"] == false)
          object.privilegesService.getData().landPageURL = "/Windows";

        return;
      }
      if (accessMap["/Linux"] == true) {
        console.log('14');
        object.privilegesService.getData().infraURL = "/Linux";
        object.privilegesService.getData().infratowers = true;
        if (accessMap["/CIODashboard"] == false)
          object.privilegesService.getData().landPageURL = "/Linux";
        return;
      }
      if (accessMap["/Unix"] == true) {
        console.log('15');
        object.privilegesService.getData().infraURL = "/Unix";
        object.privilegesService.getData().infratowers = true;
        if (accessMap["/CIODashboard"] == false)
          object.privilegesService.getData().landPageURL = "/Unix";
        return;
      }
      if (accessMap["/Storage"] == true) {
        console.log('16');
        object.privilegesService.getData().infraURL = "/Storage";
        object.privilegesService.getData().infratowers = true;
        if (accessMap["/CIODashboard"] == false)
          object.privilegesService.getData().landPageURL = "/Storage";
        return;
      }
      if (accessMap["/LAN"] == true) {
        console.log('17');
        object.privilegesService.getData().infraURL = "/LAN";
        object.privilegesService.getData().infratowers = true;
        if (accessMap["/CIODashboard"] == false)
          object.privilegesService.getData().landPageURL = "/LAN";

        return;
      }
      if (accessMap["/WAN"] == true) {
        console.log('18');
        object.privilegesService.getData().infraURL = "/WAN";
        object.privilegesService.getData().infratowers = true;
        if (accessMap["/CIODashboard"] == false)
          object.privilegesService.getData().landPageURL = "/WAN";

        return;
      }
      if (accessMap["/Voice"] == true) {
        console.log('19');
        object.privilegesService.getData().infraURL = "/Voice";
        object.privilegesService.getData().infratowers = true;
        if (accessMap["/CIODashboard"] == false)
          object.privilegesService.getData().landPageURL = "/Voice";
        return;
      }
      if (accessMap["/WorkplaceServices"] == true) {
        console.log('20');
        object.privilegesService.getData().infraURL = "/WorkplaceServices";
        object.privilegesService.getData().infratowers = true;
        if (accessMap["/CIODashboard"] == false)
          object.privilegesService.getData().landPageURL = "/WorkplaceServices";
        return;
      }
      if (accessMap["/ServiceDesk"] == true) {
        console.log('21');
        object.privilegesService.getData().infraURL = "/ServiceDesk";
        object.privilegesService.getData().infratowers = true;
        if (accessMap["/CIODashboard"] == false)
          object.privilegesService.getData().landPageURL = "/ServiceDesk";

        return;
      }
    } else if ((accessMap["/application-development"] == true)) {
      console.log('22');
      object.privilegesService.getData().infratowers = true;
      if (accessMap["/application-development"] == false)
        object.privilegesService.getData().landPageURL = "/application-development";

    }
    else if ((accessMap["/application-maintenance"] == true)) {
      console.log('23');
      object.privilegesService.getData().infratowers = true;
      if (accessMap["/application-maintenance"] == false)
        object.privilegesService.getData().landPageURL = "/application-maintenance";

    }
    else if ((accessMap["/Digital"] == true)) {

      
      object.privilegesService.getData().infratowers = true;
      if (accessMap["/Digital"] == false)
        object.privilegesService.getData().landPageURL = "/Digital";

        if (accessMap["/application-development"] == false 
      && accessMap["/application-maintenance"] == false 
      && accessMap["/CIODashboard"] == false
      && accessMap["/Mainframe"] == false
      && accessMap["/Linux"] == false
      && accessMap["/Unix"] == false
      && accessMap["/Storage"] == false
      && accessMap["/LAN"] == false
      && accessMap["/WAN"] == false
      && accessMap["/Voice"] == false
      && accessMap["/WorkplaceServices"] == false
      && accessMap["/ServiceDesk"] == false) {
        
        object.privilegesService.getData().applicationURL = "/Digital";
        object.privilegesService.getData().landPageURL = "/Digital";

        
        //return;
      }
      

    }
    else {
      console.log('25');
      object.privilegesService.getData().infratowers = true;
      if (accessMap["/CIODashboard"] == false)
        object.privilegesService.getData().landPageURL = "/Mainframe";

    }



  }


  setAccessForKPIMaintainece(privileges, sessionData) {
    let kpiMaintenance: Map<string, boolean> = new Map<string, boolean>();
    let canAccessKPIScreen = false;

    //console.log('inside privilages: ', privileges);
    for (let privilege in privileges) {

      console.log('kpi privilage ', privilege);
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
        canAccessKPIScreen = true;
      }

      if (privilege == "SERVICE DESK" && privileges["SERVICE DESK"]["KPI MetaData Maintenance"] != undefined && privileges["SERVICE DESK"]["KPI MetaData Maintenance"] != false) {
        kpiMaintenance[privilege] = true;
        canAccessKPIScreen = true;
      }

      if (privilege == "Application Development" && privileges["Application Development"]["KPI MetaData Maintenance"] != undefined && privileges["Application Development"]["KPI MetaData Maintenance"] != false) {

        kpiMaintenance[privilege] = true;
        canAccessKPIScreen = true;
      }

      if (privilege == "Application Maintenance and Support" && privileges["Application Maintenance and Support"]["KPI MetaData Maintenance"] != undefined && privileges["Application Maintenance and Support"]["KPI MetaData Maintenance"] != false) {

        kpiMaintenance[privilege] = true;
        canAccessKPIScreen = true;
      }

      if (privilege == "Digital Tower" && privileges["Digital Tower"]["KPI MetaData Maintenance"] != undefined && privileges["Digital Tower"]["KPI MetaData Maintenance"] != false) {

        kpiMaintenance[privilege] = true;
        canAccessKPIScreen = true;
      }

    }


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
    screensMap["/customReferenceMaintenance"] = false;
    screensMap["/surveyQuestionMaintenance"] = false;
    screensMap["/surveyValidation"] = false;
    screensMap["/scenarioMaintenance"] =false;
    screensMap["/masterQuestionMaintenance"]=false;
    screensMap["/deploymentNotificationComponent"]=false;


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
      if (screen == "Admin Master" && screens["Admin Master"] != undefined && screens["Admin Master"] != false) {
        screensMap["/adminRights"] = true;

      }
      if (screen == "Custom Reference Group User Mapping" && screens["Custom Reference Group User Mapping"] != undefined && screens["Custom Reference Group User Mapping"] != false) {
        screensMap["/customReferenceRoleUserMapping"] = true;
      }

      if (screen == "Custom Reference Group Maintenance" && screens["Custom Reference Group Maintenance"] != undefined && screens["Custom Reference Group Maintenance"] != false) {
        screensMap["/customReferenceMaintenance"] = true;
      }
      if (screen == "Digital KPI Maintenance" && screens["Digital KPI Maintenance"] != undefined && screens["Digital KPI Maintenance"] != false) {
        screensMap["/surveyQuestionMaintenance"] = true;
      }
      if (screen == "Digital Data Validation" && screens["Digital Data Validation"] != undefined && screens["Digital Data Validation"] != false) {
        screensMap["/surveyValidation"] = true;
      } 
      if (screen == "Inactive Scenario Maintenance" && screens["Inactive Scenario Maintenance"] != undefined && screens["Inactive Scenario Maintenance"] != false) {
        screensMap["/scenarioMaintenance"] = true;
      }
      if (screen == "Master Question Maintenance" && screens["Master Question Maintenance"] != undefined && screens["Master Question Maintenance"] != false) {
        screensMap["/masterQuestionMaintenance"] = true;
      }
      if (screen == "Notification Maintenance" && screens["Notification Maintenance"] != undefined && screens["Notification Maintenance"] != false) {
        screensMap["/deploymentNotificationComponent"] = true;
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
      screensMap["/role-feature"] = false;
      screensMap["/customReferenceRoleUserMapping"] = false;
      screensMap["/customReferenceMaintenance"] = false;
      screensMap["/surveyQuestionMaintenance"] = false;
      screensMap["/surveyValidation"] = false;
      screensMap["/scenarioMaintenance"] = false;
      screensMap["/masterQuestionMaintenance"] = false;
      screensMap["/deploymentNotificationComponent"] = false;

    }

   
    //  screensMap["/roleDashboardMapping"]=true;
    sessionData.screensMap = screensMap;
    sessionData.hasAccessToAdmin = hasAccessToAdmin;


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
    linkMap["AdmFtr0010"] = "Custom Reference Group Maintenance";
    linkMap["AdmFtr0012"] = "Digital Data Validation"

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
        if (link == "AdmFtr0012") {
          links[linkMap["AdmFtr0012"]] = links[link];
          delete links["AdmFtr0012"];

        }
      }
    }
  }
}
