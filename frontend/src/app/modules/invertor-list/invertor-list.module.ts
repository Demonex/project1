import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvertorListComponent } from './invertor-list.component'
import { InvertorListRoutingModule } from './invertor-list-routing.module'
import { MaterialProxyModule } from '../core/modules/material-proxy/material-proxy.module';
import { CreateFormComponent } from './create-form/create-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { TableFilterComponent } from './table-filter/table-filter.component';


@NgModule({
    declarations: [
        InvertorListComponent,
        CreateFormComponent,
        TableFilterComponent,

    ],
    imports: [
        CommonModule,
        InvertorListRoutingModule,
        MaterialProxyModule,
        FormsModule,
        CoreModule,
        ReactiveFormsModule,

    ]
})
export class InvertorListModule { }
