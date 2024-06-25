import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptimizationComponent } from './optimization.component'
import { OptimizationRoutingModule } from './optimization-routing.module'
import { MaterialProxyModule } from '../core/modules/material-proxy/material-proxy.module';
import { CreateFormComponent } from './create-form/create-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { TableFilterComponent } from './table-filter/table-filter.component';


@NgModule({
    declarations: [
        OptimizationComponent,
        CreateFormComponent,
        TableFilterComponent,

    ],
    imports: [
        CommonModule,
        OptimizationRoutingModule,
        MaterialProxyModule,
        FormsModule,
        CoreModule,
        ReactiveFormsModule,

    ]
})
export class OptimizationModule { }
