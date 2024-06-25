import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatterySupplyListComponent } from './client-supply-list.component'
import { BatterySupplyListRoutingModule } from './client-supply-list-routing.module'
import { MaterialProxyModule } from '../core/modules/material-proxy/material-proxy.module';
import { CreateFormComponent } from './create-form/create-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { TableFilterComponent } from './table-filter/table-filter.component';


@NgModule({
    declarations: [
        BatterySupplyListComponent,
        CreateFormComponent,
        TableFilterComponent,

    ],
    imports: [
        CommonModule,
        BatterySupplyListRoutingModule,
        MaterialProxyModule,
        FormsModule,
        CoreModule,
        ReactiveFormsModule,

    ]
})
export class BatterySupplyListModule { }
