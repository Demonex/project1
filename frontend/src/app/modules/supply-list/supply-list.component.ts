import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SupplyDto } from 'src/app/models/dto/supply-list-dto.model';
import { SupplyListService } from '../../services/supply-list.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateModalComponent } from '../core/components/create-modal/create-modal.component';
import { ModalDataIn, ModalDataOut } from '../core/models/modal-form.model';
import { Observable, forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TableFilterComponent } from './table-filter/table-filter.component';
import { CreateFormComponent } from './create-form/create-form.component';
import { BaseTableFilterComponent } from '../core/components/base-table-filter/base-table-filter.component';
import { FilterSupplyDto } from '../../models/dto/filters/filter-supply-dto.model';


@Component({
    selector: 'app-supply-list',
    templateUrl: './supply-list.component.html',
    styleUrls: ['./supply-list.component.scss']
})
export class SupplyListComponent implements OnInit {

    @ViewChild(BaseTableFilterComponent) baseFilterComponent: BaseTableFilterComponent;
    @ViewChild(TableFilterComponent) filterComponent: TableFilterComponent;

    public tableName: string = 'Поставки';

    public displayedColumns: string[] = ['select', 'name', 'startDate', 'endDate', 'contractName', 'action'];
    public dataSource: MatTableDataSource<SupplyDto> = new MatTableDataSource<SupplyDto>();
    public selection: SelectionModel<SupplyDto> = new SelectionModel<SupplyDto>(true, []);

    public showContent: boolean = false;

    public saveDataFromDialog: SupplyDto;
    public filterData: FilterSupplyDto;
    public filterCount: number = 0;

    constructor(
        private supplyService: SupplyListService,
        private dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private cdref: ChangeDetectorRef,

    ) {
        this.activatedRoute.queryParams.subscribe((data: FilterSupplyDto) => {
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
        this.supplyService.getSupplies(this.filterData).subscribe(
            (supplies: SupplyDto[]) => {
                this.dataSource.data = supplies;
                this.showContent = true;
            },
            err => console.error('Error', err)
        );

        this.cdref.detectChanges();
    }

    public openDialog(row: SupplyDto, edit: boolean = false): void {

        const data: ModalDataIn<SupplyDto> = {
            row,
            edit,
            tableName: this.tableName,
            component: CreateFormComponent
        };

        const dialogRef = this.dialog.open(CreateModalComponent, {
            data,
            panelClass: "dialog-style",

        });

        dialogRef.afterClosed().subscribe((result: ModalDataOut<SupplyDto>) => {
            switch (result?.code) {
                case 0: {
                    !edit ? this.saveDataFromDialog = result?.cache || {} : null;
                    break;
                }
                case 1: {
                    this.selection.clear();

                    this.supplyService.createSupply(result.row).subscribe(() =>
                        this.supplyService.getSupplies(this.filterData).subscribe(
                            (data: SupplyDto[]) => {
                                this.dataSource.data = data;
                            }, (error) => console.log(error, "Error")
                        ), (error) => console.log(error, "Error")
                    );
                    break;
                }
                case 2: {
                    this.selection.clear();

                    this.supplyService.updateSupply(result.row.id, result.row).subscribe(() =>
                        this.supplyService.getSupplies(this.filterData).subscribe(
                            (data: SupplyDto[]) => {
                                this.dataSource.data = data;
                            }, (error) => console.log(error, "Error")
                        ), (error) => console.log(error, "Error")
                    );
                    break;
                }
            }
        });

    }

    // public deleteRecord(obj: SupplyDto): void {
    //     this.supplyService.deleteSupply(obj.id).subscribe(() => {
    //         this.selection.deselect(obj);
    //         this.dataSource.data = this.dataSource.data.filter(
    //             (val: SupplyDto) => val.id !== obj.id
    //         );
    //     });
    // }

    public deleteRecords(): void {
        let waitArray: Observable<SupplyDto>[] = [];

        this.selection.selected.forEach((object: SupplyDto) => {
            this.selection.deselect(object);
            waitArray.push(this.supplyService.deleteSupply(object.id));
        })

        forkJoin(waitArray).subscribe(() => {
            this.supplyService.getSupplies(this.filterData).subscribe((data: SupplyDto[]) => {
                this.dataSource.data = data;
            })
        });
    }

    public restoreRecords(): void {
        let waitArray: Observable<SupplyDto>[] = [];

        this.selection.selected.forEach((object: SupplyDto) => {
            this.selection.deselect(object);
            waitArray.push(this.supplyService.updateSupply(object.id, object));
        })

        forkJoin(waitArray).subscribe(() => {
            this.supplyService.getSupplies(this.filterData).subscribe((data: SupplyDto[]) => {
                this.dataSource.data = data;
            })
        });
    }

    public getFilters(filters: FilterSupplyDto): void {

        if (JSON.stringify(this.filterData) !== JSON.stringify(filters)) {
            this.filterData = filters;

            this.supplyService.getSupplies(this.filterData).subscribe(
                (supplies: SupplyDto[]) => {
                    this.selection.clear();
                    this.dataSource.data = supplies;

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
        this.filterComponent.formGroupControl.reset({name: "", startDate: "", endDate: "", contracts: []});
        this.filterComponent.names.length = 0;
        this.filterComponent.startDates.length = 0;
        this.filterComponent.endDates.length = 0;

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

        this.supplyService.getSupplies(this.filterData).subscribe(
            (supplies: SupplyDto[]) => {
                this.dataSource.data = supplies;
            },
            err => console.error('Error', err)
        );
    }

}
