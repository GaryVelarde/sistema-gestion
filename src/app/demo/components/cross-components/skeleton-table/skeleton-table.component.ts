import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton-table',
  templateUrl: './skeleton-table.component.html',
  styleUrls: ['./skeleton-table.component.scss']
})
export class SkeletonTableComponent {
  @Input() columnTitles: string[] = [];
  @Input() skeletonCount: string[];
}
