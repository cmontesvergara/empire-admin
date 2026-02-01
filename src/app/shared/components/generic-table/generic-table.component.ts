import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TableColumn } from './models/table-column.model';

@Component({
    selector: 'app-generic-table',
    standalone: true,
    imports: [CommonModule, AngularSvgIconModule],
    templateUrl: './generic-table.component.html',
    styleUrl: './generic-table.component.scss',
})
export class GenericTableComponent {
    @Input() data: any[] = [];
    @Input() columns: TableColumn[] = [];
    @Input() loading = false;

    constructor() { }
}
