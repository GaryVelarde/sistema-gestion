import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-label-error',
  templateUrl: './label-error.component.html',
  styleUrls: ['./label-error.component.scss']
})
export class LabelErrorComponent {
  @Input() message: string = 'Ha ocurrido un error al cargar la información. Por favor, inténtalo de nuevo más tarde.';
  @Input() buttonVisible: boolean = true;
  @Output() reload: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  handleReload() {
    this.reload.emit(true);
  }

}
