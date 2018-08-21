import { UtilsService } from './services/utils.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<app-loading [show]='showLoading'></app-loading>
  <router-outlet><spinner></spinner></router-outlet>`
})
export class AppComponent {

  showLoading = false;

  constructor(private utils: UtilsService) {
    this.utils.eventLoading.subscribe((res) => {
      console.log(res);
      this.showLoading = res;
    })
  }
}
