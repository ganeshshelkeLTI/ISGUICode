import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LoginDataBroadcastService } from '../services/login/login-data-broadcast.service';
import {NotificationMaintenanceService } from '../services/notification-maintenance/notification-maintenance.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-deployment-notification',
  templateUrl: './deployment-notification.component.html',
  styleUrls: ['./deployment-notification.component.css']
})
export class DeploymentNotificationComponent implements OnInit {

  public selectedStartDate:any; //= new Date();
  public modifiedStartDate: any;

  public selectedEndDate:any; //= new Date();
  public modifiedEndDate: any;

  public NotificationType:any="Prod Deployment";
  public notificationMessage:any;
  
  public userdata: any;
  public emailId:any;
  public logged_In_user:any;
  public responseMessageObj: any;
  public disableSaveButton:boolean = true;
  public notificationData: any;
  public startTime;
  public endTime;
  public notificationDate; 

  constructor(private loginDataBroadcastService:LoginDataBroadcastService, private notificationMaintenanceService: NotificationMaintenanceService,private toastr: ToastrService) { }

  ngOnInit() {

    let object = this;

    object.getUserLoginInfo();
    object.getNotificationDetails();

  }

  public showNotificationTable:boolean=false;

  getNotificationDetails()
  {
    let object = this;

    object.notificationMaintenanceService.fetchNotificationDetails().subscribe(data => {


      

      
      if(data[0]==undefined ||data[0]==null || data[0]=='undefined' ||data[0]=='null')
      {
        
        object.showNotificationTable=false;
        
      }
      else
      {
        object.showNotificationTable=true;
        object.notificationData = data[0];  

      let date;
        let day = new Date(object.notificationData.startTime).getDay();
        object.notificationDate = new Date(object.notificationData.startTime).toLocaleDateString();
        console.log("day:",day);
        let message;
        let gsDayNames = [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ];

        let dayName = gsDayNames[day];

        let result = object.notificationData.notificationMessage.includes(dayName);

        object.startTime = new Date(object.notificationData.startTime).toLocaleTimeString(navigator.language, {
          hour: '2-digit',
          minute:'2-digit'
        });
        
        object.endTime = new Date(object.notificationData.endTime).toLocaleTimeString(navigator.language, {
          hour: '2-digit',
          minute:'2-digit'
        });
        
      }
    });
  

  }

  onNotificationMessageChange(event)
  {
    let object = this;

    object.notificationMessage = event.target.value;


    object.checkAllmandatoryFields();
  }

  getUserLoginInfo() {
    let _self = this;
    _self.userdata = _self.loginDataBroadcastService.get('userloginInfo');
    _self.emailId = _self.userdata['userDetails']['emailId'];
    _self.logged_In_user = _self.userdata['userDetails']["sessionId"];
  }

  setStartDate()
  {
    let object =this;
    
    let datePipe=new DatePipe('en-US');
    object.modifiedStartDate=datePipe.transform(object.selectedStartDate,'yyyy-MM-dd h:mm:ss a');
    //object.modifiedStartDate = object.modifiedStartDate.split(',')[0]+':'+object.modifiedStartDate.split(',')[1];
    //object.modifiedStartDate = object.modifiedStartDate.split(' ')[0]+object.modifiedStartDate.split(' ')[1]+object.modifiedStartDate.split(' ')[2];
    
    object.checkAllmandatoryFields();

  }

  setEndDate()
  {
    let object =this;

    let datePipe=new DatePipe('en-US');
    object.modifiedEndDate=datePipe.transform(object.selectedEndDate,'yyyy-MM-dd h:mm:ss a');
    object.checkAllmandatoryFields();
  }

  checkAllmandatoryFields()
  {
    let object = this;

    
    if(object.notificationMessage.length > 0
      && object.selectedStartDate !='' && object.selectedStartDate !=undefined
      && object.selectedEndDate !='' && object.selectedEndDate !=undefined
      )
      {
        object.disableSaveButton =false;
      }
      else
      {
        object.disableSaveButton =true;
      }

  }

  deleteNotification()
  {
    let object = this;

    //get input details and create web service request object
    let requestObject ={
      "adminId":object.emailId,
      "startTime": object.modifiedStartDate,
      "endTime": object.modifiedEndDate,
      "notificationType" : object.NotificationType,
      "notificationMessage" : object.notificationMessage,
      "createOn" : null,
      "notificationDowntimeStatus" : 'Deactivate' 
    };

    
    
    //call web service
    object.notificationMaintenanceService.saveNotificationDetails(requestObject).subscribe((response) => {
      
      
      object.responseMessageObj = response;
      let msg = "Notification deleted successfully."

      object.toastr.info(msg, '', { timeOut: 1500, positionClass: 'toast-top-center' });

      object.getNotificationDetails();  

    }, (error) => {
      
      object.toastr.error('Error in operation. Kindly try again.', '', { timeOut: 2000, positionClass: 'toast-top-center' });
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : "NA",
        "pageName" : "Role Master Screen",
        "errorType" : "fatal",
        "errorTitle" : "Web Service Error",
        "errorDescription" : error.message,
        "errorObject" : error
      }
      throw errorObj;
    })


  }


  saveNotificationDetails()
  {
    let object = this;

    //get input details and create web service request object
    let requestObject ={
      "adminId":object.emailId,
      "startTime": object.modifiedStartDate,
      "endTime": object.modifiedEndDate,
      "notificationType" : object.NotificationType,
      "notificationMessage" : object.notificationMessage,
      "createOn" : null,
      "notificationDowntimeStatus" : "null" 
    };

    
    
    //call web service
    object.notificationMaintenanceService.saveNotificationDetails(requestObject).subscribe((response) => {
      
      
      object.responseMessageObj = response;
      //let msg = responseMessageObj.key;

      object.toastr.info(object.responseMessageObj.key, '', { timeOut: 1500, positionClass: 'toast-top-center' });

      object.getNotificationDetails();
    }, (error) => {
      
      object.toastr.error(object.responseMessageObj.key, '', { timeOut: 2000, positionClass: 'toast-top-center' });
      //throw custom exception to global error handler
      //create error object
      let errorObj = {
        "dashboardId" : "NA",
        "pageName" : "Role Master Screen",
        "errorType" : "fatal",
        "errorTitle" : "Web Service Error",
        "errorDescription" : error.message,
        "errorObject" : error
      }
      throw errorObj;
    })


  }

}
