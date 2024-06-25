import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BatteryDto } from 'src/app/models/dto/battery-list-dto.model';
import { BatteryListService } from '../../services/battery-list.service';
import { CreateModalComponent } from '../core/components/create-modal/create-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalDataIn, ModalDataOut } from '../core/models/modal-form.model';
import { Observable, forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TableFilterComponent } from './table-filter/table-filter.component';
import { CreateFormComponent } from './create-form/create-form.component';
import { BaseTableFilterComponent } from '../core/components/base-table-filter/base-table-filter.component';
import { FilterBatteryDto } from '../../models/dto/filters/filter-battery-dto.model';


@Component({
    selector: 'app-battery-list',
    templateUrl: './battery-list.component.html',
    styleUrls: ['./battery-list.component.scss']
})
export class BatteryListComponent implements OnInit {

    @ViewChild(BaseTableFilterComponent) baseFilterComponent: BaseTableFilterComponent;
    @ViewChild(TableFilterComponent) filterComponent: TableFilterComponent;

    public tableName: string = 'Аккумуляторы';

    public displayedColumns: string[] = ['select', 'name', 'type', 'cap', 'volt', 'bound', 'price', 'action'];
    public dataSource: MatTableDataSource<BatteryDto> = new MatTableDataSource<BatteryDto>();
    public selection: SelectionModel<BatteryDto> = new SelectionModel<BatteryDto>(true, []);

    public showContent: boolean = false;

    public saveDataFromDialog: BatteryDto;
    public filterData: FilterBatteryDto;
    public filterCount: number = 0;

    constructor(
        private batteryService: BatteryListService,
        private dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private cdref: ChangeDetectorRef,
    ) {
        this.activatedRoute.queryParams.subscribe((data: FilterBatteryDto) => {
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
        this.batteryService.getBatteries(this.filterData).subscribe(
            (batteries: BatteryDto[]) => {
                this.dataSource.data = batteries;
                this.showContent = true;
            },
            err => console.error('Error', err)
        );

        this.cdref.detectChanges();
    }

    public openDialog(row: BatteryDto, edit: boolean = false): void {

        const data: ModalDataIn<BatteryDto> = {
            row,
            edit,
            tableName: this.tableName,
            component: CreateFormComponent
        };

        const dialogRef = this.dialog.open(CreateModalComponent, {
            data,
            panelClass: "dialog-style",

        });

        dialogRef.afterClosed().subscribe((result: ModalDataOut<BatteryDto>) => {
            switch (result?.code) {
                case 0: {
                    !edit ? this.saveDataFromDialog = result?.cache || {} : null;
                    break;
                }
                case 1: {
                    this.selection.clear();

                    this.batteryService.createBattery(result.row).subscribe(() =>
                        this.batteryService.getBatteries(this.filterData).subscribe(
                            (data: BatteryDto[]) => {
                                this.dataSource.data = data;
                            }, (error) => console.log(error, "Error")
                        ), (error) => console.log(error, "Error")
                    );
                    break;
                }
                case 2: {
                    this.selection.clear();

                    this.batteryService.updateBattery(result.row.id, result.row).subscribe(() =>
                        this.batteryService.getBatteries(this.filterData).subscribe(
                            (data: BatteryDto[]) => {
                                this.dataSource.data = data;
                            }, (error) => console.log(error, "Error")
                        ), (error) => console.log(error, "Error")
                    );
                    break;
                }
            }
        });

    }

    // public deleteRecord(obj: BatteryDto) {
    //     this.batteryService.deleteBattery(obj.id).subscribe(() => {
    //         this.selection.deselect(obj);
    //         this.dataSource.data = this.dataSource.data.filter(
    //             (val: BatteryDto) => val.id !== obj.id
    //         );
    //     });
    // }

    public deleteRecords(): void {
        let waitArray: Observable<BatteryDto>[] = [];

        this.selection.selected.forEach((object: BatteryDto) => {
            this.selection.deselect(object);
            waitArray.push(this.batteryService.deleteBattery(object.id));
        })

        forkJoin(waitArray).subscribe(() => {
            this.batteryService.getBatteries(this.filterData).subscribe((data: BatteryDto[]) => {
                this.dataSource.data = data;
            })
        });
    }

    public restoreRecords(): void {
        let waitArray: Observable<BatteryDto>[] = [];

        this.selection.selected.forEach((object: BatteryDto) => {
            this.selection.deselect(object);
            waitArray.push(this.batteryService.updateBattery(object.id, object));
        })

        forkJoin(waitArray).subscribe(() => {
            this.batteryService.getBatteries(this.filterData).subscribe((data: BatteryDto[]) => {
                this.dataSource.data = data;
            })
        });
    }

    public getFilters(filters: FilterBatteryDto): void {

        if (JSON.stringify(this.filterData) !== JSON.stringify(filters)) {
            this.filterData = filters;

            this.batteryService.getBatteries(this.filterData).subscribe(
                (batteries: BatteryDto[]) => {
                    this.selection.clear();
                    this.dataSource.data = batteries;

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
        this.filterComponent.formGroupControl.reset({name: "", type: "", cap: "", volt: "", bound: "", price: ""});
        this.filterComponent.names.length = 0;
        this.filterComponent.types.length = 0;
        this.filterComponent.caps.length = 0;
        this.filterComponent.volts.length = 0;
        this.filterComponent.bounds.length = 0;
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

        this.batteryService.getBatteries(this.filterData).subscribe(
            (batteries: BatteryDto[]) => {
                this.dataSource.data = batteries;
            },
            err => console.error('Error', err)
        );
    }

}
