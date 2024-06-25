import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BatterySupplyDto } from 'src/app/models/dto/client-supply-list-dto.model';
import { BatterySupplyListService } from '../../services/client-supply-list.service';
import { CreateModalComponent } from '../core/components/create-modal/create-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalDataIn, ModalDataOut } from '../core/models/modal-form.model';
import { Observable, forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TableFilterComponent } from './table-filter/table-filter.component';
import { CreateFormComponent } from './create-form/create-form.component';
import { BaseTableFilterComponent } from '../core/components/base-table-filter/base-table-filter.component';
import { FilterBatterySupplyDto } from '../../models/dto/filters/filter-client-supply-dto.model';


@Component({
    selector: 'app-client-supply-list',
    templateUrl: './client-supply-list.component.html',
    styleUrls: ['./client-supply-list.component.scss']
})
export class BatterySupplyListComponent implements OnInit {

    @ViewChild(BaseTableFilterComponent) baseFilterComponent: BaseTableFilterComponent;
    @ViewChild(TableFilterComponent) filterComponent: TableFilterComponent;

    public tableName: string = 'Клиенты-Поставки';

    public displayedColumns: string[] = ['select', 'batteryName', 'supplyName', 'action'];
    public dataSource: MatTableDataSource<BatterySupplyDto> = new MatTableDataSource<BatterySupplyDto>();
    public selection: SelectionModel<BatterySupplyDto> = new SelectionModel<BatterySupplyDto>(true, []);

    public showContent: boolean = false;

    public saveDataFromDialog: BatterySupplyDto;
    public filterData: FilterBatterySupplyDto;
    public filterCount: number = 0;

    constructor(
        private batterySupplyService: BatterySupplyListService,
        private dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private cdref: ChangeDetectorRef,
    ) {
        this.activatedRoute.queryParams.subscribe((data: FilterBatterySupplyDto) => {
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
        this.batterySupplyService.getBatterySupplies(this.filterData).subscribe(
            (batterySupplies: BatterySupplyDto[]) => {
                this.dataSource.data = batterySupplies;
                this.showContent = true;
            },
            err => console.error('Error', err)
        );

        this.cdref.detectChanges();
    }

    public openDialog(row: BatterySupplyDto, edit: boolean = false): void {

        const data: ModalDataIn<BatterySupplyDto> = {
            row,
            edit,
            tableName: this.tableName,
            component: CreateFormComponent
        };

        const dialogRef = this.dialog.open(CreateModalComponent, {
            data,
            panelClass: "dialog-style",

        });

        dialogRef.afterClosed().subscribe((result: ModalDataOut<BatterySupplyDto>) => {
            switch (result?.code) {
                case 0: {
                    !edit ? this.saveDataFromDialog = result?.cache || {} : null;
                    break;
                }
                case 1: {
                    this.selection.clear();

                    this.batterySupplyService.createBatterySupply(result.row).subscribe(() =>
                        this.batterySupplyService.getBatterySupplies(this.filterData).subscribe(
                            (data: BatterySupplyDto[]) => {
                                this.dataSource.data = data;
                            }, (error) => console.log(error, "Error")
                        ), (error) => console.log(error, "Error")
                    );
                    break;
                }
                case 2: {
                    this.selection.clear();

                    this.batterySupplyService.updateBatterySupply(result.row.id, result.row).subscribe(() =>
                        this.batterySupplyService.getBatterySupplies(this.filterData).subscribe(
                            (data: BatterySupplyDto[]) => {
                                this.dataSource.data = data;
                            }, (error) => console.log(error, "Error")
                        ), (error) => console.log(error, "Error")
                    );
                    break;
                }
            }
        });
    }

    // public deleteRecord(obj: BatterySupplyDto): void {
    //     this.batterySupplyService.deleteBatterySupply(obj.id).subscribe(() => {
    //         this.selection.deselect(obj);
    //         this.dataSource.data = this.dataSource.data.filter(
    //             (val: BatterySupplyDto) => val.id !== obj.id
    //         );
    //     });
    // }

    public deleteRecords(): void {
        let waitArray: Observable<BatterySupplyDto>[] = [];

        this.selection.selected.forEach((object: BatterySupplyDto) => {
            this.selection.deselect(object);
            waitArray.push(this.batterySupplyService.deleteBatterySupply(object.id));
        })

        forkJoin(waitArray).subscribe(() => {
            this.batterySupplyService.getBatterySupplies(this.filterData).subscribe((data: BatterySupplyDto[]) => {
                this.dataSource.data = data;
            })
        });
    }

    public restoreRecords(): void {
        let waitArray: Observable<BatterySupplyDto>[] = [];

        this.selection.selected.forEach((object: BatterySupplyDto) => {
            this.selection.deselect(object);
            waitArray.push(this.batterySupplyService.updateBatterySupply(object.id, object));
        })

        forkJoin(waitArray).subscribe(() => {
            this.batterySupplyService.getBatterySupplies(this.filterData).subscribe((data: BatterySupplyDto[]) => {
                this.dataSource.data = data;
            })
        });
    }

    public getFilters(filters: FilterBatterySupplyDto): void {

        if (JSON.stringify(this.filterData) !== JSON.stringify(filters)) {
            this.filterData = filters;

            this.batterySupplyService.getBatterySupplies(this.filterData).subscribe(
                (batterySupplies: BatterySupplyDto[]) => {
                    this.selection.clear();
                    this.dataSource.data = batterySupplies;

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
        this.filterComponent.formGroupControl.reset({name: "", batteries: [], supplies: []});

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

        this.batterySupplyService.getBatterySupplies(this.filterData).subscribe(
            (batterySupplys: BatterySupplyDto[]) => {
                this.dataSource.data = batterySupplys;
            },
            err => console.error('Error', err)
        );

    }

}
