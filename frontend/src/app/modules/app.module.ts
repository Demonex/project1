import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from '../components/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialProxyModule } from './core/modules/material-proxy/material-proxy.module';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { ProfileComponent } from '../components/toolbar/profile/profile.component';
import { TableSidenavComponent } from '../components/main-content/table-sidenav/table-sidenav.component';
import { MainComponent } from '../components/main-content/main.component';
import { SettingsModalComponent } from '../components/toolbar/profile/settings-modal/settings-modal.component'
import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
    declarations: [
        AppComponent,
        ToolbarComponent,
        ProfileComponent,
        TableSidenavComponent,
        MainComponent,
        SettingsModalComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialProxyModule,
        HttpClientModule,
        NgChartsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
