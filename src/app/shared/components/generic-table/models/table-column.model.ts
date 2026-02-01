import { TemplateRef } from '@angular/core';

export interface TableColumn {
    header: string;
    field?: string;
    template?: TemplateRef<any>;
    width?: string;
    sortable?: boolean;
    type?: 'text' | 'date' | 'badge' | 'custom';
}
