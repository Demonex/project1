import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControllerListComponent } from './controller-list.component'
import { ControllerListRoutingModule } from './controller-list-routing.module'
import { MaterialProxyModule } from '../core/modules/material-proxy/material-proxy.module';
import { CreateFormComponent } from './create-form/create-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableFilterComponent } from './table-filter/table-filter.component';
import { CoreModule } from '../core/core.module';


@NgModule({
    declarations: [
        ControllerListComponent,
        CreateFormComponent,
        TableFilterComponent,

    ],
    imports: [
        CommonModule,
        ControllerListRoutingModule,
        MaterialProxyModule,
        FormsModule,
        CoreModule,
        ReactiveFormsModule,

    ]
})
export class ControllerListModule { }
