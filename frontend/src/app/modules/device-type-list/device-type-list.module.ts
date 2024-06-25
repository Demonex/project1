import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceTypeListComponent } from './device-type-list.component'
import { DeviceTypeListRoutingModule } from './device-type-list-routing.module'
import { MaterialProxyModule } from '../core/modules/material-proxy/material-proxy.module';
import { CreateFormComponent } from './create-form/create-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { TableFilterComponent } from './table-filter/table-filter.component';


@NgModule({
    declarations: [
        DeviceTypeListComponent,
        CreateFormComponent, 
        TableFilterComponent,

    ],
    imports: [
        CommonModule,
        DeviceTypeListRoutingModule,
        MaterialProxyModule,
        FormsModule,
        CoreModule,
        ReactiveFormsModule,
        
    ]
})
export class DeviceTypeListModule { }
