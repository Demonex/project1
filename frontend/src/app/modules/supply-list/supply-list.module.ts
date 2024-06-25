import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplyListComponent } from './supply-list.component'
import { SupplyListRoutingModule } from './supply-list-routing.module'
import { MaterialProxyModule } from '../core/modules/material-proxy/material-proxy.module';
import { CreateFormComponent } from './create-form/create-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { TableFilterComponent } from './table-filter/table-filter.component';


@NgModule({
    declarations: [
        SupplyListComponent,
        CreateFormComponent, 
        TableFilterComponent,

    ],
    imports: [
        CommonModule,
        SupplyListRoutingModule,
        MaterialProxyModule,
        FormsModule,
        CoreModule,
        ReactiveFormsModule,
        
    ]
})
export class SupplyListModule { }
