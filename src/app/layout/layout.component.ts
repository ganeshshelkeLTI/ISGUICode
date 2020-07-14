/******************************************* ***********/
/************** © 2018 ISG - All Rights Reserved     ***********/
/******************************************************/

/*******************************************************/
/** File Name:isg-kpi-data.ts **/
/** Description:  **/
/** Created By: 106##### Created Date: 28/09/2018 **/
/** Update By:  10650919 Update Date:  03/10/2018 **/
/*******************************************************/

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor() { }

  catId = 'ACV126673';
  color = 'blue';
  public bg: string;

  testClick(event, percentage: number) {
    
    if(event.target.classList.contains('fill')) {
      event.target.classList.remove('fill');
    }
    percentage = (100 - percentage) || 0;
      var percentage_initial = 100,
      percentage_current = percentage_initial,
      interval = 0.5;

      var interval_gradient = setInterval(function(){
        event.target.classList.add('background');
        var temp = 'linear-gradient(#a0c884 '+percentage_current+'%, #426e1f '+percentage_current+'%)';
        
        event.style.background = temp;
       
        percentage_current -= interval;
        
        if(percentage_current <= percentage) clearInterval(interval_gradient);
      }, 5);

      
      event.target.classList.add('filled');

    
  }

 



  ngOnInit() {

    function animate( $that, percentage ) {
      if ( !$that.hasClass('fill') ) return;
      $that.removeClass('fill');

      percentage = (100 - percentage) || 0;
      var percentage_initial = 100,
      percentage_current = percentage_initial,
      interval = 0.5;

      var interval_gradient = setInterval(function(){
        $that.css(
          'background',
          'linear-gradient(#a0c884 '+percentage_current+'%,#426e1f '+percentage_current+'%)'
        );
        percentage_current -= interval;
        if(percentage_current <= percentage) clearInterval(interval_gradient);
      }, 5);

      $that.addClass('filled');
    };
    var fill = 0;
    var update = setInterval(function() {
      fill += 1;
      if (fill <= 100) {
        
      } else {
        clearInterval(update);
      }
    }, 100);
   
  }
}
