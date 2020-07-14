import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-support-mail',
  templateUrl: './support-mail.component.html',
  styleUrls: ['./support-mail.component.css']
})
export class SupportMailComponent implements OnInit {

  subject: any;
  message:any;
  to:string;
  disableSendButton: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  sendMail(){
    if(this.to != undefined && this.message != ""){
      //call service to send mail
    }
  }
}
