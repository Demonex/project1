import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ControllerDto } from 'src/app/models/dto/controller-list-dto.model';
import { ControllerListService } from '../../services/controller-list.service';
import { CreateModalComponent } from '../core/components/create-modal/create-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalDataIn, ModalDataOut } from '../core/models/modal-form.model';
import { Observable, forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TableFilterComponent } from './table-filter/table-filter.component';
import { CreateFormComponent } from './create-form/create-form.component';
import { BaseTableFilterComponent } from '../core/components/base-table-filter/base-table-filter.component';
import { FilterControllerDto } from '../../models/dto/filters/filter-controller-dto.model';


@Component({
    selector: 'app-controller-list',
    templateUrl: './controller-list.component.html',
    styleUrls: ['./controller-list.component.scss']
})
export class ControllerListComponent implements OnInit {

    @ViewChild(BaseTableFilterComponent) baseFilterComponent: BaseTableFilterComponent;
    @ViewChild(TableFilterComponent) filterComponent: TableFilterComponent;

    public tableName: string = 'Контроллеры заряда';

    public displayedColumns: string[] = ['select', 'name', 'type', 'voltmod', 'mwatt', 'mvolt', 'mamper', 'price', 'action'];
    public dataSource: MatTableDataSource<ControllerDto> = new MatTableDataSource<ControllerDto>();
    public selection: SelectionModel<ControllerDto> = new SelectionModel<ControllerDto>(true, []);

    public showContent: boolean = false;

    public saveDataFromDialog: ControllerDto;
    public filterData: FilterControllerDto;
    public filterCount: number = 0;

    constructor(
        private controllerService: ControllerListService,
        private dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private cdref: ChangeDetectorRef,

    ) {
        this.activatedRoute.queryParams.subscribe((data: FilterControllerDto) => {
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
        this.controllerService.getControllers(this.filterData).subscribe(
            (controllers: ControllerDto[]) => {
                this.dataSource.data = controllers;
                this.showContent = true;
            },
            err => console.error('Error', err)
        );

        this.cdref.detectChanges();
    }


    public openDialog(row: ControllerDto, edit: boolean = false): void {

        const data: ModalDataIn<ControllerDto> = {
            row,
            edit,
            tableName: this.tableName,
            component: CreateFormComponent
        };

        const dialogRef = this.dialog.open(CreateModalComponent, {
            data,
            panelClass: "dialog-style",

        });

        dialogRef.afterClosed().subscribe((result: ModalDataOut<ControllerDto>) => {
            switch (result?.code) {
                case 0: {
                    !edit ? this.saveDataFromDialog = result?.cache || {} : null;
                    break;
                }
                case 1: {
                    this.selection.clear();

                    this.controllerService.createController(result.row).subscribe(() =>
                        this.controllerService.getControllers(this.filterData).subscribe(
                            (data: ControllerDto[]) => {
                                this.dataSource.data = data;
                            }, (error) => console.log(error, "Error")
                        ), (error) => console.log(error, "Error")
                    );
                    break;
                }
                case 2: {
                    this.selection.clear();

                    this.controllerService.updateController(result.row.id, result.row).subscribe(() =>
                        this.controllerService.getControllers(this.filterData).subscribe(
                            (data: ControllerDto[]) => {
                                this.dataSource.data = data;
                            }, (error) => console.log(error, "Error")
                        ), (error) => console.log(error, "Error")
                    );
                    break;
                }
            }
        });

    }

    // public deleteRecord(obj: ControllerDto): void {
    //     this.controllerService.deleteController(obj.id).subscribe(() => {
    //         this.selection.deselect(obj);
    //         this.dataSource.data = this.dataSource.data.filter(
    //             (val: ControllerDto) => val.id !== obj.id
    //         );
    //     });
    // }

    public deleteRecords(): void {
        let waitArray: Observable<ControllerDto>[] = [];

        this.selection.selected.forEach((object: ControllerDto) => {
            this.selection.deselect(object);
            waitArray.push(this.controllerService.deleteController(object.id));
        })

        forkJoin(waitArray).subscribe(() => {
            this.controllerService.getControllers(this.filterData).subscribe((data: ControllerDto[]) => {
                this.dataSource.data = data;
            })
        });
    }

    public restoreRecords(): void {
        let waitArray: Observable<ControllerDto>[] = [];

        this.selection.selected.forEach((object: ControllerDto) => {
            this.selection.deselect(object);
            waitArray.push(this.controllerService.updateController(object.id, object));
        })

        forkJoin(waitArray).subscribe(() => {
            this.controllerService.getControllers(this.filterData).subscribe((data: ControllerDto[]) => {
                this.dataSource.data = data;
            })
        });
    }

    public getFilters(filters: FilterControllerDto): void {

        if (JSON.stringify(this.filterData) !== JSON.stringify(filters)) {
            this.filterData = filters;

            this.controllerService.getControllers(this.filterData).subscribe(
                (controllers: ControllerDto[]) => {
                    this.selection.clear();
                    this.dataSource.data = controllers;

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
        this.filterComponent.formGroupControl.reset({name: "", type: "", voltmod: "", price: ""});
        this.filterComponent.names.length = 0;
        this.filterComponent.types.length = 0;
        this.filterComponent.voltmods.length = 0;
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

        this.controllerService.getControllers(this.filterData).subscribe(
            (controllers: ControllerDto[]) => {
                this.dataSource.data = controllers;
            },
            err => console.error('Error', err)
        );

    }
}
