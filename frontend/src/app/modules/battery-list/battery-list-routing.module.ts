import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BatteryListComponent } from './battery-list.component';


const routes: Routes = [
    { path: '', component: BatteryListComponent }
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
export class BatteryListRoutingModule { }
