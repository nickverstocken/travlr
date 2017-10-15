import { Component, OnInit } from '@angular/core';
declare var $ : any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    appsecret: string = '37e2968d90c772e889b168736f78e1e3';
  constructor() { }

  ngOnInit() {
      var tab = $('.tabs h3 a');

      tab.on('click', function(event) {
          event.preventDefault();
          tab.removeClass('active');
          $(this).addClass('active');

         var tab_content = $(this).attr('href');
          $('div[id$="tab-content"]').removeClass('active');
          $(tab_content).addClass('active');
      });
  }

}
