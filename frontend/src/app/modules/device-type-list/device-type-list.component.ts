import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DeviceTypeDto } from 'src/app/models/dto/device-type-list-dto.model';
import { DeviceTypeListService } from '../../services/device-type-list.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateModalComponent } from '../core/components/create-modal/create-modal.component';
import { ModalDataIn, ModalDataOut } from '../core/models/modal-form.model';
import { Observable, forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TableFilterComponent } from './table-filter/table-filter.component';
import { CreateFormComponent } from './create-form/create-form.component';
import { BaseTableFilterComponent } from '../core/components/base-table-filter/base-table-filter.component';
import { FilterDeviceTypeDto } from '../../models/dto/filters/filter-device-type-dto.model';


@Component({
    selector: 'app-device-type-list',
    templateUrl: './device-type-list.component.html',
    styleUrls: ['./device-type-list.component.scss']
})
export class DeviceTypeListComponent implements OnInit {

    @ViewChild(BaseTableFilterComponent) baseFilterComponent: BaseTableFilterComponent;
    @ViewChild(TableFilterComponent) filterComponent: TableFilterComponent;

    public tableName: string = 'Типы устройств';

    public displayedColumns: string[] = ['select', 'name', 'supplyCodeName', 'controllerName', 'action'];
    public dataSource: MatTableDataSource<DeviceTypeDto> = new MatTableDataSource<DeviceTypeDto>();
    public selection: SelectionModel<DeviceTypeDto> = new SelectionModel<DeviceTypeDto>(true, []);

    public showContent: boolean = false;

    public saveDataFromDialog: DeviceTypeDto;
    public filterData: FilterDeviceTypeDto;
    public filterCount: number = 0;

    constructor(
        private deviceTypeService: DeviceTypeListService,
        private dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private cdref: ChangeDetectorRef,

    ) {
        this.activatedRoute.queryParams.subscribe((data: FilterDeviceTypeDto) => {
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
        this.deviceTypeService.getDeviceTypes(this.filterData).subscribe(
            (deviceTypes: DeviceTypeDto[]) => {
                this.dataSource.data = deviceTypes;
                this.showContent = true;
            },
            err => console.error('Error', err)
        );

        this.cdref.detectChanges();
    }

    public openDialog(row: DeviceTypeDto, edit: boolean = false): void {

        const data: ModalDataIn<DeviceTypeDto> = {
            row,
            edit,
            tableName: this.tableName,
            component: CreateFormComponent
        };

        const dialogRef = this.dialog.open(CreateModalComponent, {
            data,
            panelClass: "dialog-style",

        });

        dialogRef.afterClosed().subscribe((result: ModalDataOut<DeviceTypeDto>) => {
            switch (result?.code) {
                case 0: {
                    !edit ? this.saveDataFromDialog = result?.cache || {} : null;
                    break;
                }
                case 1: {
                    this.selection.clear();

                    this.deviceTypeService.createDeviceType(result.row).subscribe(() =>
                        this.deviceTypeService.getDeviceTypes(this.filterData).subscribe(
                            (data: DeviceTypeDto[]) => {
                                this.dataSource.data = data;
                            }, (error) => console.log(error, "Error")
                        ), (error) => console.log(error, "Error")
                    );
                    break;
                }
                case 2: {
                    this.selection.clear();

                    this.deviceTypeService.updateDeviceType(result.row.id, result.row).subscribe(() =>
                        this.deviceTypeService.getDeviceTypes(this.filterData).subscribe(
                            (data: DeviceTypeDto[]) => {
                                this.dataSource.data = data;
                            }, (error) => console.log(error, "Error")
                        ), (error) => console.log(error, "Error")
                    );
                    break;
                }
            }
        });

    }

    // public deleteRecord(obj: DeviceTypeDto): void {
    //     this.deviceTypeService.deleteDeviceType(obj.id).subscribe(() => {
    //         this.selection.deselect(obj);
    //         this.dataSource.data = this.dataSource.data.filter(
    //             (val: DeviceTypeDto) => val.id !== obj.id
    //         );
    //     })
    // }

    public deleteRecords(): void {
        let waitArray: Observable<DeviceTypeDto>[] = [];

        this.selection.selected.forEach((object: DeviceTypeDto) => {
            this.selection.deselect(object);
            waitArray.push(this.deviceTypeService.deleteDeviceType(object.id));
        })

        forkJoin(waitArray).subscribe(() => {
            this.deviceTypeService.getDeviceTypes(this.filterData).subscribe((data: DeviceTypeDto[]) => {
                this.dataSource.data = data;
            })
        });
    }

    public restoreRecords(): void {
        let waitArray: Observable<DeviceTypeDto>[] = [];

        this.selection.selected.forEach((object: DeviceTypeDto) => {
            this.selection.deselect(object);
            waitArray.push(this.deviceTypeService.updateDeviceType(object.id, object));
        })

        forkJoin(waitArray).subscribe(() => {
            this.deviceTypeService.getDeviceTypes(this.filterData).subscribe((data: DeviceTypeDto[]) => {
                this.dataSource.data = data;
            })
        });
    }

    public getFilters(filters: FilterDeviceTypeDto): void {

        if (JSON.stringify(this.filterData) !== JSON.stringify(filters)) {
            this.filterData = filters;

            this.deviceTypeService.getDeviceTypes(this.filterData).subscribe(
                (deviceTypes: DeviceTypeDto[]) => {
                    this.selection.clear();
                    this.dataSource.data = deviceTypes;

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
        this.filterComponent.formGroupControl.reset({name: "", supplyCodeName: "", controllers: []});
        this.filterComponent.names.length = 0;
        this.filterComponent.supplyCodeNames.length = 0;

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

        this.deviceTypeService.getDeviceTypes(this.filterData).subscribe(
            (deviceTypes: DeviceTypeDto[]) => {
                this.dataSource.data = deviceTypes;
            },
            err => console.error('Error', err)
        );

    }

}
