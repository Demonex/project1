import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MaterialProxyModule } from './modules/material-proxy/material-proxy.module';
import { getRussianPaginatorIntl } from './components/translate-paginator/russian-paginator-intl';
import { TranslatePipe } from './pipes/translate-pipe/translate.pipe';
import { PluralRuDirective } from './directives/plural-directive/plural-ru.directive';
import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';
import { BaseTableViewComponent } from './components/base-table-view/base-table-view.component';
import { CreateModalComponent } from './components/create-modal/create-modal.component';
import { BaseTableFilterComponent } from './components/base-table-filter/base-table-filter.component';
import { DropZoneDirective } from './directives/drop-zone-directive/drop-zone.directive';
import { NgChartsModule } from 'ng2-charts';


@NgModule({
    declarations: [
        TranslatePipe,
        PluralRuDirective,
        DropZoneDirective,
        DeleteModalComponent,
        BaseTableViewComponent,
        BaseTableFilterComponent,
        CreateModalComponent

    ],
    imports: [
        CommonModule,
        MaterialProxyModule,
        ReactiveFormsModule,
        FormsModule,
        NgChartsModule
    ],
    exports: [
        TranslatePipe,
        PluralRuDirective,
        DropZoneDirective,
        BaseTableViewComponent,
        BaseTableFilterComponent,

    ],
    providers: [
        { provide: MatPaginatorIntl, useValue: getRussianPaginatorIntl() },
    ]
})
export class CoreModule { }
