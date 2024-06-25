import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
    { path: 'panel-list', loadChildren: () => import('./panel-list/panel-list.module').then(m => m.PanelListModule) },
    { path: 'supply-list', loadChildren: () => import('./supply-list/supply-list.module').then(m => m.SupplyListModule) },
    { path: 'battery-list', loadChildren: () => import('./battery-list/battery-list.module').then(m => m.BatteryListModule) },
    { path: 'deviceType-list', loadChildren: () => import('./device-type-list/device-type-list.module').then(m => m.DeviceTypeListModule) },
    { path: 'invertor-list', loadChildren: () => import('./invertor-list/invertor-list.module').then(m => m.InvertorListModule) },
    { path: 'controller-list', loadChildren: () => import('./controller-list/controller-list.module').then(m => m.ControllerListModule) },
    { path: 'contract-list', loadChildren: () => import('./contract-list/contract-list.module').then(m => m.ContractListModule) },
    { path: 'device-list', loadChildren: () => import('./device-list/device-list.module').then(m => m.DeviceListModule) },
    { path: 'client-supply-list', loadChildren: () => import('./client-supply-list/client-supply-list.module').then(m => m.BatterySupplyListModule) },
    { path: 'optimization', loadChildren: () => import('./optimization/optimization.module').then(m => m.OptimizationModule) },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
