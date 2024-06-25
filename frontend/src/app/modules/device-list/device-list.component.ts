import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DeviceDto } from 'src/app/models/dto/device-list-dto.model';
import { DeviceListService } from '../../services/device-list.service';
import { CreateModalComponent } from '../core/components/create-modal/create-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalDataOut, ModalDataIn } from '../core/models/modal-form.model';
import { Observable, forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TableFilterComponent } from './table-filter/table-filter.component';
import { CreateFormComponent } from './create-form/create-form.component';
import { BaseTableFilterComponent } from '../core/components/base-table-filter/base-table-filter.component';
import { FilterDeviceDto } from '../../models/dto/filters/filter-device-dto.model';
import { BaseTableViewComponent } from '../core/components/base-table-view/base-table-view.component';


@Component({
    selector: 'app-device-list',
    templateUrl: './device-list.component.html',
    styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit {

    @ViewChild(BaseTableViewComponent) baseViewComponent: BaseTableViewComponent;
    @ViewChild(BaseTableFilterComponent) baseFilterComponent: BaseTableFilterComponent;
    @ViewChild(TableFilterComponent) filterComponent: TableFilterComponent;

    public tableName: string = 'Устройства';

    public displayedColumns: string[] = ['select', 'name', 'orderCode', 'comment', 'supplyName', 'deviceTypeName', 'action'];
    public dataSource: MatTableDataSource<DeviceDto> = new MatTableDataSource<DeviceDto>();
    public selection: SelectionModel<DeviceDto> = new SelectionModel<DeviceDto>(true, []);

    public showContent = false;

    public saveDataFromDialog: DeviceDto;
    public filterData: FilterDeviceDto;
    public filterCount: number = 0;

    constructor(
        private deviceService: DeviceListService,
        private dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private cdref: ChangeDetectorRef,

    ) {
        this.activatedRoute.queryParams.subscribe((data: FilterDeviceDto) => {
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
        this.deviceService.getDevices(this.filterData).subscribe(
            (devices: DeviceDto[]) => {
                this.dataSource.data = devices;
                this.showContent = true;
            },
            err => console.error('Error', err)
        );

        this.cdref.detectChanges();
    }

    public openDialog(row: DeviceDto, edit: boolean = false): void {

        const data: ModalDataIn<DeviceDto> = {
            row,
            edit,
            tableName: this.tableName,
            component: CreateFormComponent,
            state: this.filterData.state
        };

        const dialogRef = this.dialog.open(CreateModalComponent, {
            data,
            panelClass: "dialog-style",

        });

        dialogRef.afterClosed().subscribe((result: ModalDataOut<DeviceDto>) => {
            switch (result?.code) {
                case 0: {
                    !edit ? this.saveDataFromDialog = result?.cache || {} : null;
                    break;
                }
                case 1: {
                    this.selection.clear();

                    this.deviceService.createDevice(result.row).subscribe(() =>
                        this.deviceService.getDevices(this.filterData).subscribe(
                            (data: DeviceDto[]) => {
                                this.dataSource.data = data;
                            }, (error) => console.log(error, "Error")
                        ), (error) => console.log(error, "Error")
                    );
                    break;
                }
                case 2: {
                    this.selection.clear();

                    this.deviceService.updateDevice(result.row.id, result.row).subscribe(() =>
                        this.deviceService.getDevices(this.filterData).subscribe(
                            (data: DeviceDto[]) => {
                                this.dataSource.data = data;
                            }, (error) => console.log(error, "Error")
                        ), (error) => console.log(error, "Error")
                    );
                    break;
                }
                case 3: {
                    this.selection.clear();

                    this.dataSource.data = result.data;

                    this.filterComponent.namesLen = 0;
                    this.filterComponent.orderCodesLen = 0;
                    this.filterComponent.commentsLen = 0;
                    this.filterComponent.deviceTypesLen = 0;
                    this.filterComponent.suppliesLen = 0;

                    this.filterCount = 0;
                }
            }
        });

    }

    // public deleteRecord(obj: DeviceDto): void {
    //     this.deviceService.deleteDevice(obj.id).subscribe(() => {
    //         this.selection.deselect(obj);
    //         this.dataSource.data = this.dataSource.data.filter(
    //             (val: DeviceDto) => val.id !== obj.id
    //         );
    //     });
    // }

    // public deleteRecords(): void {
    //     let waitArray: Observable<DeviceDto>[] = [];

    //     this.selection.selected.forEach((object: DeviceDto) => {
    //         this.selection.deselect(object);
    //         waitArray.push(this.deviceService.deleteDevice(object.id));
    //     })

    //     forkJoin(waitArray).subscribe(() => {
    //         this.deviceService.getDevices(this.filterData).subscribe((data: DeviceDto[]) => {
    //             this.dataSource.data = data;
    //         })
    //     });
    // }

    public deleteRecords(): void {

        this.deviceService.deleteDevices(this.selection.selected.map(elem => elem.id)).subscribe(() => {

            this.selection.clear();

            this.deviceService.getDevices(this.filterData).subscribe((data: DeviceDto[]) => {
                this.dataSource.data = data;
            });
        }, (err) => console.log(err));

    }

    public restoreRecords(): void {
        let waitArray: Observable<DeviceDto>[] = [];

        this.selection.selected.forEach((object: DeviceDto) => {
            this.selection.deselect(object);
            waitArray.push(this.deviceService.updateDevice(object.id, object));
        })

        forkJoin(waitArray).subscribe(() => {
            this.deviceService.getDevices(this.filterData).subscribe((data: DeviceDto[]) => {
                this.dataSource.data = data;
            })
        });
    }

    public getFilters(filters: any): void {

        if (JSON.stringify(this.filterData) !== JSON.stringify(filters)) {
            this.filterData = filters;

            this.deviceService.getDevices(this.filterData).subscribe(
                (devices: DeviceDto[]) => {
                    this.selection.clear();
                    this.dataSource.data = devices;

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
        this.filterComponent.formGroupControl.reset({name: "", orderCode: "", comment: "", supplies: [], deviceTypes: []});
        this.filterComponent.names.length = 0;
        this.filterComponent.orderCodes.length = 0;
        this.filterComponent.comments.length = 0;

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

        this.deviceService.getDevices(this.filterData).subscribe(
            (devices: DeviceDto[]) => {
                this.dataSource.data = devices;
            },
            err => console.error('Error', err)
        );

    }

}
