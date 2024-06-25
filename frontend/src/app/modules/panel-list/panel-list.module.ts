import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PanelListComponent } from './panel-list.component'
import { PanelListRoutingModule } from './panel-list-routing.module'
import { MaterialProxyModule } from '../core/modules/material-proxy/material-proxy.module';
import { CreateFormComponent } from './create-form/create-form.component'
import { CoreModule } from '../core/core.module';
import { TableFilterComponent } from './table-filter/table-filter.component';

@NgModule({
    declarations: [
        PanelListComponent,
        CreateFormComponent,
        TableFilterComponent,

    ],
    imports: [
        CommonModule,
        PanelListRoutingModule,
        MaterialProxyModule,
        FormsModule,
        CoreModule,
        ReactiveFormsModule,

    ]
})
export class PanelListModule { }
