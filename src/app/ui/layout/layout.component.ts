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
    alert(percentage);
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
        alert(temp);
        event.style.background = temp;
        // ('linear-gradient(#a0c884 100%,426e1f #100%')
        // event.target.classList.add(temp);
        // event.target.classList.add(
        //   'background',
        //   'linear-gradient(#a0c884 '+percentage_current+'%,#426e1f '+percentage_current+'%)'
        // );
        percentage_current -= interval;
        alert(percentage_current);
        if(percentage_current <= percentage) clearInterval(interval_gradient);
      }, 5);
      
      // $that.addClass('filled');
      event.target.classList.add('filled');
    
    // animate(percentage);
  }

  // testClick() {
  //   alert('hi');
  //   var t1 = this.getAttribute('property');
  //   alert(t1);
  // }

  

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
        // @('#holdci').css('width', (fill+'%'));
      } else {
        clearInterval(update);        
      }
    }, 100);
    // $('.fill').on('click', function() {
    //   var $that = this.value;
    //   var percentage = $that.attr('data-fill');
    //   setTimeout(function(){
    //     animate( $that, percentage )
    //   }, 400);
    // });
  }
}
