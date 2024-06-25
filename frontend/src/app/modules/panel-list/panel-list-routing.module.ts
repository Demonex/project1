import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PanelListComponent } from './panel-list.component';


const routes: Routes = [
    { path: '', component: PanelListComponent }
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
export class PanelListRoutingModule { }
