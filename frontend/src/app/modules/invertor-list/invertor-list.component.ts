import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { InvertorDto } from 'src/app/models/dto/invertor-list-dto.model';
import { InvertorListService } from '../../services/invertor-list.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateModalComponent } from '../core/components/create-modal/create-modal.component';
import { ModalDataIn, ModalDataOut } from '../core/models/modal-form.model';
import { Observable, forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TableFilterComponent } from './table-filter/table-filter.component';
import { CreateFormComponent } from './create-form/create-form.component';
import { BaseTableFilterComponent } from '../core/components/base-table-filter/base-table-filter.component';
import { FilterInvertorDto } from 'src/app/models/dto/filters/filter-invertor-dto.model';


@Component({
    selector: 'app-invertor-list',
    templateUrl: './invertor-list.component.html',
    styleUrls: ['./invertor-list.component.scss']
})
export class InvertorListComponent implements OnInit {

    @ViewChild(BaseTableFilterComponent) baseFilterComponent: BaseTableFilterComponent;
    @ViewChild(TableFilterComponent) filterComponent: TableFilterComponent;

    public tableName: string = 'Инверторы';

    public displayedColumns: string[] = ['select', 'name', 'watt', 'volt', 'price', 'action'];
    public dataSource: MatTableDataSource<InvertorDto> = new MatTableDataSource<InvertorDto>();
    public selection: SelectionModel<InvertorDto> = new SelectionModel<InvertorDto>(true, []);

    public showContent: boolean = false;

    public saveDataFromDialog: InvertorDto;
    public filterData: FilterInvertorDto;
    public filterCount: number = 0;

    constructor(
        private invertorService: InvertorListService,
        private dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private cdref: ChangeDetectorRef,

    ) {
        this.activatedRoute.queryParams.subscribe((data: FilterInvertorDto) => {
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
        this.invertorService.getInvertors(this.filterData).subscribe(
            (invertors: InvertorDto[]) => {
                this.dataSource.data = invertors;
                this.showContent = true;
            },
            err => console.error('Error', err)
        );

        this.cdref.detectChanges();
    }

    public openDialog(row: InvertorDto, edit: boolean = false): void {

        const data: ModalDataIn<InvertorDto> = {
            row,
            edit,
            tableName: this.tableName,
            component: CreateFormComponent
        };

        const dialogRef = this.dialog.open(CreateModalComponent, {
            data,
            panelClass: "dialog-style",

        });

        dialogRef.afterClosed().subscribe((result: ModalDataOut<InvertorDto>) => {
            switch (result?.code) {
                case 0: {
                    !edit ? this.saveDataFromDialog = result?.cache || {} : null;
                    break;
                }
                case 1: {
                    this.selection.clear();

                    this.invertorService.createInvertor(result.row).subscribe(() =>
                        this.invertorService.getInvertors(this.filterData).subscribe(
                            (data: InvertorDto[]) => {
                                this.dataSource.data = data;
                            }, (error) => console.log(error, "Error")
                        ), (error) => console.log(error, "Error")
                    );
                    break;
                }
                case 2: {
                    this.selection.clear();

                    this.invertorService.updateInvertor(result.row.id, result.row).subscribe(() =>
                        this.invertorService.getInvertors(this.filterData).subscribe(
                            (data: InvertorDto[]) => {
                                this.dataSource.data = data;
                            }, (error) => console.log(error, "Error")
                        ), (error) => console.log(error, "Error")
                    );
                    break;
                }
            }
        });

    }

    // public deleteRecord(obj: InvertorDto): void {
    //     this.invertorService.deleteInvertor(obj.id).subscribe(() => {
    //         this.selection.deselect(obj);
    //         this.dataSource.data = this.dataSource.data.filter(
    //             (val: InvertorDto) => val.id !== obj.id
    //         );
    //     });
    // }

    public deleteRecords(): void {
        let waitArray: Observable<InvertorDto>[] = [];

        this.selection.selected.forEach((object: InvertorDto) => {
            this.selection.deselect(object);
            waitArray.push(this.invertorService.deleteInvertor(object.id));
        })

        forkJoin(waitArray).subscribe(() => {
            this.invertorService.getInvertors(this.filterData).subscribe((data: InvertorDto[]) => {
                this.dataSource.data = data;
            })
        });
    }

    public restoreRecords(): void {
        let waitArray: Observable<InvertorDto>[] = [];

        this.selection.selected.forEach((object: InvertorDto) => {
            this.selection.deselect(object);
            waitArray.push(this.invertorService.updateInvertor(object.id, object));
        })

        forkJoin(waitArray).subscribe(() => {
            this.invertorService.getInvertors(this.filterData).subscribe((data: InvertorDto[]) => {
                this.dataSource.data = data;
            })
        });
    }

    public getFilters(filters: FilterInvertorDto): void {

        if (JSON.stringify(this.filterData) !== JSON.stringify(filters)) {
            this.filterData = filters;

            this.invertorService.getInvertors(this.filterData).subscribe(
                (invertors: InvertorDto[]) => {
                    this.selection.clear();
                    this.dataSource.data = invertors;

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
        this.filterComponent.formGroupControl.reset({name: "", watt: "", volt: "", price: "" });
        this.filterComponent.names.length = 0;
        this.filterComponent.watts.length = 0;
        this.filterComponent.volts.length = 0;
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

        this.invertorService.getInvertors(this.filterData).subscribe(
            (invertors: InvertorDto[]) => {
                this.dataSource.data = invertors;
            },
            err => console.error('Error', err)
        );

    }

}
