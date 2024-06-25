import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatteryListComponent } from './battery-list.component'
import { BatteryListRoutingModule } from './battery-list-routing.module'
import { MaterialProxyModule } from '../core/modules/material-proxy/material-proxy.module';
import { CreateFormComponent } from './create-form/create-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { TableFilterComponent } from './table-filter/table-filter.component';


@NgModule({
    declarations: [
        BatteryListComponent,
        CreateFormComponent,
        TableFilterComponent,

    ],
    imports: [
        CommonModule,
        BatteryListRoutingModule,
        MaterialProxyModule,
        FormsModule,
        CoreModule,
        ReactiveFormsModule,

    ]
})
export class BatteryListModule { }
