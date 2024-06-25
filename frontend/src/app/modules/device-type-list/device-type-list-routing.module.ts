import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DeviceTypeListComponent } from './device-type-list.component';


const routes: Routes = [
    { path: '', component: DeviceTypeListComponent }
]


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class DeviceTypeListRoutingModule { }
