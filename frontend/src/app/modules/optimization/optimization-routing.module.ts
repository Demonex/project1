import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { OptimizationComponent } from './optimization.component';


const routes: Routes = [
    { path: '', component: OptimizationComponent }
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
export class OptimizationRoutingModule { }
