import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OptimizationDto } from '../../models/dto/optimization-dto.model';
import { OptimizationService } from '../../services/optimization.service';
import { CreateModalComponent } from '../core/components/create-modal/create-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalDataIn, ModalDataOut } from '../core/models/modal-form.model';
import { Observable, forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TableFilterComponent } from './table-filter/table-filter.component';
import { CreateFormComponent } from './create-form/create-form.component';
import { BaseTableFilterComponent } from '../core/components/base-table-filter/base-table-filter.component';
import { FilterOptimizationDto } from '../../models/dto/filters/filter-optimization-dto.model';


@Component({
    selector: 'app-optimization',
    templateUrl: './optimization.component.html',
    styleUrls: ['./optimization.component.scss']
})
export class OptimizationComponent implements OnInit {

    @ViewChild(BaseTableFilterComponent) baseFilterComponent: BaseTableFilterComponent;
    @ViewChild(TableFilterComponent) filterComponent: TableFilterComponent;

    public tableName: string = 'Приборы';

    public displayedColumns: string[] = ['select', 'name', 'startTime', 'duration', 'watt', 'action'];
    public dataSource: MatTableDataSource<OptimizationDto> = new MatTableDataSource<OptimizationDto>();
    public selection: SelectionModel<OptimizationDto> = new SelectionModel<OptimizationDto>(true, []);

    public showContent: boolean = false;

    public saveDataFromDialog: OptimizationDto;
    public filterData: FilterOptimizationDto;
    public filterCount: number = 0;

    public optObj: {
        area: number
        region: number
        winterSeason: boolean
    } = { area: 30, region: 2, winterSeason: false}

    constructor(
        private optimizationService: OptimizationService,
        private dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private cdref: ChangeDetectorRef,
    ) {
        this.activatedRoute.queryParams.subscribe((data: FilterOptimizationDto) => {
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
        this.optimizationService.getOptimizations(this.filterData).subscribe(
            (optimizations: OptimizationDto[]) => {
                this.dataSource.data = optimizations;
                this.showContent = true;
            },
            err => console.error('Error', err)
        );

        this.cdref.detectChanges();
    }

    public openDialog(row: OptimizationDto, edit: boolean = false): void {

        const data: ModalDataIn<OptimizationDto> = {
            row,
            edit,
            tableName: this.tableName,
            component: CreateFormComponent
        };

        const dialogRef = this.dialog.open(CreateModalComponent, {
            data,
            panelClass: "dialog-style",

        });

        dialogRef.afterClosed().subscribe((result: ModalDataOut<OptimizationDto>) => {
            switch (result?.code) {
                case 0: {
                    !edit ? this.saveDataFromDialog = result?.cache || {} : null;
                    break;
                }
                case 1: {
                    this.selection.clear();

                    this.optimizationService.createOptimization(result.row).subscribe(() =>
                        this.optimizationService.getOptimizations(this.filterData).subscribe(
                            (data: OptimizationDto[]) => {
                                this.dataSource.data = data;
                            }, (error) => console.log(error, "Error")
                        ), (error) => console.log(error, "Error")
                    );
                    break;
                }
                case 2: {
                    this.selection.clear();

                    this.optimizationService.updateOptimization(result.row.id, result.row).subscribe(() =>
                        this.optimizationService.getOptimizations(this.filterData).subscribe(
                            (data: OptimizationDto[]) => {
                                this.dataSource.data = data;
                            }, (error) => console.log(error, "Error")
                        ), (error) => console.log(error, "Error")
                    );
                    break;
                }
            }
        });

    }

    // public deleteRecord(obj: OptimizationDto) {
    //     this.optimizationService.deleteOptimization(obj.id).subscribe(() => {
    //         this.selection.deselect(obj);
    //         this.dataSource.data = this.dataSource.data.filter(
    //             (val: OptimizationDto) => val.id !== obj.id
    //         );
    //     });
    // }

    public deleteRecords(): void {
        let waitArray: Observable<OptimizationDto>[] = [];

        this.selection.selected.forEach((object: OptimizationDto) => {
            this.selection.deselect(object);
            waitArray.push(this.optimizationService.deleteOptimization(object.id));
        })

        forkJoin(waitArray).subscribe(() => {
            this.optimizationService.getOptimizations(this.filterData).subscribe((data: OptimizationDto[]) => {
                this.dataSource.data = data;
            })
        });
    }

    public restoreRecords(): void {
        let waitArray: Observable<OptimizationDto>[] = [];

        this.selection.selected.forEach((object: OptimizationDto) => {
            this.selection.deselect(object);
            waitArray.push(this.optimizationService.updateOptimization(object.id, object));
        })

        forkJoin(waitArray).subscribe(() => {
            this.optimizationService.getOptimizations(this.filterData).subscribe((data: OptimizationDto[]) => {
                this.dataSource.data = data;
            })
        });
    }

    public getFilters(filters: FilterOptimizationDto): void {

        if (JSON.stringify(this.filterData) !== JSON.stringify(filters)) {
            this.filterData = filters;

            this.optimizationService.getOptimizations(this.filterData).subscribe(
                (optimizations: OptimizationDto[]) => {
                    this.selection.clear();
                    this.dataSource.data = optimizations;

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
        this.filterComponent.formGroupControl.reset({name: "", startTime: "", duration: "", watt: ""});
        this.filterComponent.names.length = 0;
        this.filterComponent.startTimes.length = 0;
        this.filterComponent.durations.length = 0;
        this.filterComponent.watts.length = 0;

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

        this.optimizationService.getOptimizations(this.filterData).subscribe(
            (optimizations: OptimizationDto[]) => {
                this.dataSource.data = optimizations;
            },
            err => console.error('Error', err)
        );
    }

}
