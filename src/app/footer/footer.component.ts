/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:footer.component.ts **/
/** Description: This file is created to display footer menu and links **/
/** Created By: 10651577  Created Date: 28/09/2018 **/
/** Update By:  10651577  Update Date:  28/09/2018 **/
/** Developed at:  **/
/*******************************************************/

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  public currentYear: any;
  constructor() { }

  ngOnInit() {
    this.currentYear = (new Date()).getFullYear();
    console.log(this.currentYear);
  }

}
