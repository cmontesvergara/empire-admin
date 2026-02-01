import { TemplateRef } from '@angular/core';

export interface TableColumn {
    header: string;
    field?: string;
    template?: TemplateRef<any>;
    width?: string;
    sortable?: boolean;
}
