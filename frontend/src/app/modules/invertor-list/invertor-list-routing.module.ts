import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { InvertorListComponent } from './invertor-list.component';


const routes: Routes = [
    { path: '', component: InvertorListComponent }
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
export class InvertorListRoutingModule { }
