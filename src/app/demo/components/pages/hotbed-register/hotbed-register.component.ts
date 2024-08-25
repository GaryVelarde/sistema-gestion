import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hotbed-register',
  templateUrl: './hotbed-register.component.html',
  styleUrls: ['./hotbed-register.component.scss'],
  styles: [
    `
    .p-stepper {
        flex-basis: 50rem;
    } 
    `
]

})
export class HotbedRegisterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
