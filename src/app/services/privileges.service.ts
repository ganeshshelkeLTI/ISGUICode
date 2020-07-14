import { Injectable } from '@angular/core';
import { EventEmitter} from 'events';
@Injectable({
  providedIn: 'root'
})
export class PrivilegesService {
private data:any;
  private eventEmitter:EventEmitter;
  constructor() {
    this.eventEmitter=new EventEmitter();
    this.data={};
    this.data.enterMyData=false;
    this.data.compareScreen=false;
    this.data.reset=false;
    this.data.pdf=false;
    this.data.compareButton=false;
    this.data.saveScenario=false;
    this.data.deleteScenario=false;
    this.data["CIO DASHBOARD"]=false;
    this.data.WAN=false;
    this.data.LAN=false;
    this.data.VOICE=false;
    this.data.WINDOWS=false;
    this.data.LINUX=false;
    this.data.UNIX=false;
    this.data.STORAGE=false;
    this.data["WORKPLACE SERVICE"]=false;
    this.data["SERVICE DESK"]=false;
    this.data.MAINFRAME=false;
    this.data.servers=false;
    this.data.network=false;
    this.data.infratowers=true;
    this.data.infraURL="/Mainframe";
    this.data.hasAnyPrivilege=false;
    this.data.landPageURL="/CIODashboard";
    this.data.showCIO=true;
    this.data.showAdminPanel=false;
    this.data.kpiMaintainence=false;
    this.data.showAdminPanel=false;
    this.data.applicationtowers=true;
    this.data.applicationURL="/application-development";
    this.data.digitaltower=true;
    this.data.digitalURL="/Digital"; 
     
    this.data["External User Project Mapping"]= false;
    this.data["Role User Mapping"]= false;
    this.data["Role Master"]= false;
    this.data["Dashboard Master"]= false;
    this.data["Role Dashboard Mapping"]= false;
    this.data["Feature Master"]= false;
    this.data["Dashboard Feature Mapping"]= false;
    this.data["Custom Reference Group User Mapping"]= false;
    this.data["Custom Reference Group Maintenance"]= false;
    this.data["Digital Data Validation"]= false;
  }

getEmitter(){
  return this.eventEmitter;
}

setData(data){
this.data=data;
}

getData(){
  return this.data;
}

resetALL(){
  this.data.enterMyData=false;
  this.data.compareScreen=false;
  this.data.reset=false;
  this.data.pdf=false;
  this.data.compareButton=false;
  this.data.saveScenario=false;
  this.data.deleteScenario=false;
  this.data["CIO DASHBOARD"]=false;
  this.data.WAN=false;
  this.data.LAN=false;
  this.data.VOICE=false;
  this.data.WINDOWS=false;
  this.data.LINUX=false;
  this.data.UNIX=false;
  this.data.STORAGE=false;
  this.data["WORKPLACE SERVICE"]=false;
  this.data["SERVICE DESK"]=false;
  this.data.MAINFRAME=false;
  this.data.servers=false;
  this.data.network=false;
  this.data.infratowers=true;
  this.data.infraURL="/Mainframe";
  this.data.hasAnyPrivilege=false;
  this.data.landPageURL="/CIODashboard";
  this.data.showAdminPanel=false;
  this.data["External User Project Mapping"]= false;
  this.data["Role User Mapping"]= false;
  this.data["Role Master"]= false;
  this.data["Dashboard Master"]= false;
  this.data["Role Dashboard Mapping"]= false;
  this.data["Feature Master"]= false;
  this.data["Dashboard Feature Mapping"]= false;
  this.data["Custom Reference Group User Mapping"]= false;
  this.data["Custom Reference Group Maintenance"]= false;
  this.data["Digital Data Validation"]= false;
  }

}