import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-card-error',
  templateUrl: './card-error.component.html',
  styleUrls: ['./card-error.component.scss']
})
export class CardErrorComponent {
  @Input() message: string;
  @Output() reload: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  handleReload() {
    this.reload.emit(true);
  }
}
