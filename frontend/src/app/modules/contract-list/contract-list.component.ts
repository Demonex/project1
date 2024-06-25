import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ContractDto } from 'src/app/models/dto/contract-list-dto.model';
import { ContractListService } from '../../services/contract-list.service';
import { CreateModalComponent } from '../core/components/create-modal/create-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalDataIn, ModalDataOut } from '../core/models/modal-form.model';
import { Observable, forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TableFilterComponent } from './table-filter/table-filter.component';
import { CreateFormComponent } from './create-form/create-form.component';
import { BaseTableFilterComponent } from '../core/components/base-table-filter/base-table-filter.component';
import { FilterContractDto } from '../../models/dto/filters/filter-contract-dto.model';


@Component({
    selector: 'app-contract-list',
    templateUrl: './contract-list.component.html',
    styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent implements OnInit {

    @ViewChild(BaseTableFilterComponent) baseFilterComponent: BaseTableFilterComponent;
    @ViewChild(TableFilterComponent) filterComponent: TableFilterComponent;

    public tableName: string = 'Контракты';

    public displayedColumns: string[] = ['select', 'name', 'startDate', 'endDate', 'code', 'controllerName', 'action'];
    public dataSource: MatTableDataSource<ContractDto> = new MatTableDataSource<ContractDto>();
    public selection: SelectionModel<ContractDto> = new SelectionModel<ContractDto>(true, []);

    public showContent: boolean = false;

    public saveDataFromDialog: ContractDto;
    public filterData: FilterContractDto;
    public filterCount: number = 0;

    constructor(
        private contractService: ContractListService,
        private dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private cdref: ChangeDetectorRef,
    ) {
        this.activatedRoute.queryParams.subscribe((data: FilterContractDto) => {
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
        this.contractService.getContracts(this.filterData).subscribe(
            (contracts: ContractDto[]) => {
                this.dataSource.data = contracts;
                this.showContent = true;
            },
            err => console.error('Error', err)
        );

        this.cdref.detectChanges();
    }

    public openDialog(row: ContractDto, edit: boolean = false): void {

        const data: ModalDataIn<ContractDto> = {
            row,
            edit,
            tableName: this.tableName,
            component: CreateFormComponent
        };

        const dialogRef = this.dialog.open(CreateModalComponent, {
            data,
            panelClass: "dialog-style",

        });

        dialogRef.afterClosed().subscribe((result: ModalDataOut<ContractDto>) => {
            switch (result?.code) {
                case 0: {
                    !edit ? this.saveDataFromDialog = result?.cache || {} : null;
                    break;
                }
                case 1: {
                    this.selection.clear();

                    this.contractService.createContract(result.row).subscribe(() =>
                        this.contractService.getContracts(this.filterData).subscribe(
                            (data: ContractDto[]) => {
                                this.dataSource.data = data;
                            }, (error) => console.log(error, "Error")
                        ), (error) => console.log(error, "Error")
                    );
                    break;
                }
                case 2: {
                    this.selection.clear();

                    this.contractService.updateContract(result.row.id, result.row).subscribe(() =>
                        this.contractService.getContracts(this.filterData).subscribe(
                            (data: ContractDto[]) => {
                                this.dataSource.data = data;
                            }, (error) => console.log(error, "Error")
                        ), (error) => console.log(error, "Error")
                    );
                    break;
                }
            }

        });
    }

    // public deleteRecord(obj: ContractDto): void {
    //     this.contractService.deleteContract(obj.id).subscribe(() => {
    //         this.selection.deselect(obj);
    //         this.dataSource.data = this.dataSource.data.filter(
    //             (val: ContractDto) => val.id !== obj.id
    //         );
    //     });
    // }

    public deleteRecords(): void {
        let waitArray: Observable<ContractDto>[] = [];

        this.selection.selected.forEach((object: ContractDto) => {
            this.selection.deselect(object);
            waitArray.push(this.contractService.deleteContract(object.id));
        })

        forkJoin(waitArray).subscribe(() => {
            this.contractService.getContracts(this.filterData).subscribe((data: ContractDto[]) => {
                this.dataSource.data = data;
            })
        });
    }

    public restoreRecords(): void {
        let waitArray: Observable<ContractDto>[] = [];

        this.selection.selected.forEach((object: ContractDto) => {
            this.selection.deselect(object);
            waitArray.push(this.contractService.updateContract(object.id, object));
        })

        forkJoin(waitArray).subscribe(() => {
            this.contractService.getContracts(this.filterData).subscribe((data: ContractDto[]) => {
                this.dataSource.data = data;
            })
        });
    }

    public getFilters(filters: FilterContractDto): void {

        if (JSON.stringify(this.filterData) !== JSON.stringify(filters)) {
            this.filterData = filters;

            this.contractService.getContracts(this.filterData).subscribe(
                (contracts: ContractDto[]) => {
                    this.selection.clear();
                    this.dataSource.data = contracts;

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
        this.filterComponent.formGroupControl.reset({name: "", startDate: "", endDate: "", code: "", controllers: []});
        this.filterComponent.names.length = 0;
        this.filterComponent.startDates.length = 0;
        this.filterComponent.endDates.length = 0;
        this.filterComponent.codes.length = 0;

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

        this.contractService.getContracts(this.filterData).subscribe(
            (contracts: ContractDto[]) => {
                this.dataSource.data = contracts;
            },
            err => console.error('Error', err)
        );

    }

}
