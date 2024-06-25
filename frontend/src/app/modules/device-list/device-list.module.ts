import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceListComponent } from './device-list.component'
import { DeviceListRoutingModule } from './device-list-routing.module'
import { MaterialProxyModule } from '../core/modules/material-proxy/material-proxy.module';
import { CreateFormComponent } from './create-form/create-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { TableFilterComponent } from './table-filter/table-filter.component';


@NgModule({
    declarations: [
        DeviceListComponent,
        CreateFormComponent, 
        TableFilterComponent,

    ],
    imports: [
        CommonModule,
        DeviceListRoutingModule,
        MaterialProxyModule,
        FormsModule,
        CoreModule,
        ReactiveFormsModule,
        
    ]
})
export class DeviceListModule { }
