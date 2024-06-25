import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PanelDto } from 'src/app/models/dto/panel-list-dto.model';
import { PanelListService } from '../../services/panel-list.service';
import { CreateModalComponent } from '../core/components/create-modal/create-modal.component';
import { ModalDataIn, ModalDataOut } from '../core/models/modal-form.model';
import { forkJoin, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TableFilterComponent } from './table-filter/table-filter.component';
import { CreateFormComponent } from './create-form/create-form.component';
import { BaseTableFilterComponent } from '../core/components/base-table-filter/base-table-filter.component';
import { FilterPanelDto } from '../../models/dto/filters/filter-panel-dto.model';


@Component({
    selector: 'app-panel-list',
    templateUrl: './panel-list.component.html',
    styleUrls: ['./panel-list.component.scss']
})
export class PanelListComponent implements OnInit {

    @ViewChild(BaseTableFilterComponent) baseFilterComponent: BaseTableFilterComponent;
    @ViewChild(TableFilterComponent) filterComponent: TableFilterComponent;

    public tableName: string = 'Панели';

    public displayedColumns: string[] = ['select', 'name', 'type', 'watt', 'volt', 'voltoc', 'amper', 'eff', 'size', 'price', 'action'];
    public dataSource: MatTableDataSource<PanelDto> = new MatTableDataSource<PanelDto>();
    public selection: SelectionModel<PanelDto> = new SelectionModel<PanelDto>(true, []);

    public showContent: boolean = false;

    public saveDataFromDialog: PanelDto;
    public filterData: FilterPanelDto;
    public filterCount: number = 0;

    constructor(
        private panelService: PanelListService,
        private dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private cdref: ChangeDetectorRef,
    ) {
        this.activatedRoute.queryParams.subscribe((data: FilterPanelDto) => {
            this.filterData = Object.assign({}, this.filterData, data);

            for (let data in this.filterData) {
                if (data !== 'state' && typeof this.filterData[data] === 'string') {
                    this.filterData[data] = [this.filterData[data]];
                }
            }

            this.filterData.state = this.filterData.state || "1";
        });
    }

    ngOnInit(): void {
        this.panelService.getPanels(this.filterData).subscribe(
            (panels: PanelDto[]) => {
                this.dataSource.data = panels;
                this.showContent = true;
            },
            err => console.error('Error', err)
        );

        this.cdref.detectChanges();
    }

    public openDialog(row: PanelDto, edit: boolean = false): void {

        const data: ModalDataIn<PanelDto> = {
            row,
            edit,
            tableName: this.tableName,
            component: CreateFormComponent
        };

        const dialogRef = this.dialog.open(CreateModalComponent, {
            data,
            panelClass: "dialog-style",

        });

        dialogRef.afterClosed().subscribe((result: ModalDataOut<PanelDto>) => {
            switch (result?.code) {
                case 0: {
                    !edit ? this.saveDataFromDialog = result?.cache || {} : null;
                    break;
                }
                case 1: {
                    this.selection.clear();

                    this.panelService.createPanel(result.row).subscribe(() =>
                        this.panelService.getPanels(this.filterData).subscribe(
                            (data: PanelDto[]) => {
                                this.dataSource.data = data;
                            }, (error) => console.log(error, "Error")
                        ), (error) => console.log(error, "Error")
                    );
                    break;
                }
                case 2: {
                    this.selection.clear();

                    this.panelService.updatePanel(result.row.id, result.row).subscribe(() =>
                        this.panelService.getPanels(this.filterData).subscribe(
                            (data: PanelDto[]) => {
                                this.dataSource.data = data;
                            }, (error) => console.log(error, "Error")
                        ), (error) => console.log(error, "Error")
                    );
                    break;
                }
            }
        });

    }

    // public deleteRecord(obj: PanelDto): void {
    //     this.panelService.deletePanel(obj.id).subscribe(() => {
    //         this.selection.deselect(obj);
    //         this.dataSource.data = this.dataSource.data.filter(
    //             (val: PanelDto) => val.id !== obj.id
    //         );
    //     });
    // }

    public deleteRecords(): void {
        let waitArray: Observable<PanelDto>[] = [];

        this.selection.selected.forEach((object: PanelDto) => {
            this.selection.deselect(object);
            waitArray.push(this.panelService.deletePanel(object.id));
        })

        forkJoin(waitArray).subscribe(() => {
            this.panelService.getPanels(this.filterData).subscribe((data: PanelDto[]) => {
                this.dataSource.data = data;
            })
        });
    }

    public restoreRecords(): void {
        let waitArray: Observable<PanelDto>[] = [];

        this.selection.selected.forEach((object: PanelDto) => {
            this.selection.deselect(object);
            waitArray.push(this.panelService.updatePanel(object.id, object));
        })

        forkJoin(waitArray).subscribe(() => {
            this.panelService.getPanels(this.filterData).subscribe((data: PanelDto[]) => {
                this.dataSource.data = data;
            })
        });
    }

    public getFilters(filters: FilterPanelDto): void {

        if (JSON.stringify(this.filterData) !== JSON.stringify(filters)) {
            this.filterData = filters;

            this.panelService.getPanels(this.filterData).subscribe(
                (panels: PanelDto[]) => {
                    this.selection.clear();
                    this.dataSource.data = panels;

                    this.router.navigate(
                        ['.'],
                        {
                            relativeTo: this.activatedRoute,
                            queryParams: this.filterData,
                            queryParamsHandling: 'merge'
                        }
                    );

                }, err => console.error('Error', err)
            );
        }
    }

    public resetFilters(): void {
        this.filterComponent.formGroupControl.reset({name: "", watt: "", volt: "", amper: "", eff: "", size: "", price: ""});
        this.filterComponent.names.length = 0;
        this.filterComponent.watts.length = 0;
        this.filterComponent.volts.length = 0;
        this.filterComponent.ampers.length = 0;
        this.filterComponent.effs.length = 0;
        this.filterComponent.sizes.length = 0;
        this.filterComponent.prices.length = 0;

        setTimeout(() => this.filterComponent.applyFilters(this.filterData.state), 100);
    }

    public submitFilters(): void {
        this.filterComponent.applyFilters(this.filterData.state);
    }

    public getState(state: string): void {
        this.filterData.state = state;

        this.selection.deselect(...this.selection.selected);

        this.router.navigate(
            ['.'],
            {
                relativeTo: this.activatedRoute,
                queryParams: this.filterData,
                queryParamsHandling: 'merge'
            }
        );

        this.panelService.getPanels(this.filterData).subscribe(
            (panels: PanelDto[]) => {
                this.dataSource.data = panels;
            },
            err => console.error('Error', err)
        );

    }

}
