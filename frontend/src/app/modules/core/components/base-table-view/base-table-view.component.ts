import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import DataLabelsPlugin from 'chartjs-plugin-datalabels';

import { dataSet, insAst, insKrasnodar, insMoscow, insMur, insTwer } from '../../../dataset';
import { PanelDto } from 'src/app/models/dto/panel-list-dto.model';
import { BatteryDto } from 'src/app/models/dto/battery-list-dto.model';
import { InvertorDto } from 'src/app/models/dto/invertor-list-dto.model';
import { ControllerDto } from 'src/app/models/dto/controller-list-dto.model';
import { PanelListService } from 'src/app/services/panel-list.service';
import { BatteryListService } from 'src/app/services/battery-list.service';
import { InvertorListService } from 'src/app/services/invertor-list.service';
import { ControllerListService } from 'src/app/services/controller-list.service';
import { forkJoin } from 'rxjs';

export enum FilterState {
    Actual = 1,
    All = 2,
    Archive = 0
};



interface OptimizationParameters {
    Panels: PanelDto[];
    Batteries: BatteryDto[];
    Invertors: InvertorDto[];
    Controllers: ControllerDto[];
    Area: number;
    Region: number;
    WinterSeason: boolean;
    RequiredEnergy: number;
    PeakEnergy: number;
    Insolation: number;
    NightEnergy: number;
}

interface OptimalSolution {
    panels: PanelDto[];
    batteries: BatteryDto[];
    invertors: InvertorDto[];
    controllers: ControllerDto[];
    totalPrice: number;
}


@Component({
    selector: 'app-base-table-view',
    templateUrl: './base-table-view.component.html',
    styleUrls: ['./base-table-view.component.scss']
})
export class BaseTableViewComponent implements AfterViewInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
    @ViewChild(BaseChartDirective) chartPanel: BaseChartDirective | undefined;
    @ViewChild(BaseChartDirective) chartInvertor: BaseChartDirective | undefined;
    @ViewChild(BaseChartDirective) chartBattery: BaseChartDirective | undefined;

    @Input() readonly tableName: string;
    @Input() readonly displayedColumns: string[];
    @Input() readonly dataSource: MatTableDataSource<any>;
    @Input() readonly selection: SelectionModel<any>;
    @Input() readonly filterComponent: any;
    @Input() readonly saveDataFromDialog: any;
    @Input() readonly filterState: FilterState;
    @Input() readonly filterCount: number;
    @Input() readonly optObj: { area: string, region: string, winterSeason: boolean };

    @Output() readonly deleteRecords: EventEmitter<void> = new EventEmitter();
    @Output() readonly restoreRecords: EventEmitter<void> = new EventEmitter();
    @Output() readonly openDialog: EventEmitter<any> = new EventEmitter();

    public formGroupControl: FormGroup;
    public showContent = true;
    public showCharts = -1;
    public curData: { area: string, region: string, winterSeason: boolean };
    public regionList = ['Москва', 'Краснодар', 'Тверь', 'Мурманск', 'Астрахань']


    public powerList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    public powerAmountNeeded = 0


    //* chart
    public barChartType: ChartType = 'bar';
    public barChartPlugins = [DataLabelsPlugin];

    public barChartData: ChartConfiguration<'bar'>['data'] = {
        labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00',
            '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
            '19:00', '20:00', '21:00', '22:00', '23:00',],
        datasets: [
            {
                data: this.powerList,
                label: 'Требуемая энергия',
                backgroundColor: 'rgba(61, 78, 174, 0.7)'
            },

        ]
    };

    public barChartOptions: ChartConfiguration<'bar'>['options'] = {
        responsive: true,
        scales: {
            x: {},
            y: {
                min: 0
            }
        },
        plugins: {
            legend: {
                display: true,
            },
            datalabels: {
                anchor: 'end',
                align: 'end'
            }
        }
    };

    // line
    public lineChartPanelType: ChartType = 'line';

    public lineChartPanelData: ChartConfiguration<'line'>['data'] = {
        labels: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь',
            'Октябрь', 'Ноябрь', 'Декабрь'],
        datasets: [
            {
                data: [],
                label: 'Выработанная энергия',

                backgroundColor: 'rgba(61, 78, 174, 0.7)'
            },
            {
                data: [],
                label: 'Требуемая энергия',
                backgroundColor: 'rgba(61, 78, 174, 0.7)',
            },
        ]
    };

    public lineChartOptions: ChartConfiguration<'line'>['options'] = {
        responsive: true,
        elements: {
            line: {
                tension: 0.7
            }
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Месяцы'
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Энергия (Вт*ч)'
                },
                min: 0
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Выработка энергии солнечными панелями в зависимости от месяца'
            },
            legend: {
                display: true,
            },
            datalabels: {
                anchor: 'end',
                align: 'end',
            },

        }
    };

    // bar battery
    public barChartBatteryData: ChartConfiguration<'bar'>['data'] = {
        labels: ['-'],
        datasets: [
            {
                data: [],
                label: 'Требуемая емкость',
                backgroundColor: 'rgba(255, 99, 132, 0.7)'
            },
            {
                data: [],
                label: 'Емкость с ограниченным разрядом',
                backgroundColor: 'rgba(61, 78, 174, 0.7)'
            },
            {
                data: [],
                label: 'Вся полученная емкость',
                backgroundColor: 'rgba(206, 143, 94, 0.7)'
            },

        ]
    };

    // barinvertor
    public barChartInvertorData: ChartConfiguration<'bar'>['data'] = {
        labels: ['-'],
        datasets: [
            {
                data: [],
                label: 'Требуемая мощность',
                backgroundColor: 'rgba(244, 74, 62, 0.7)'
            },
            {
                data: [],
                label: 'Полученная мощность',
                backgroundColor: 'rgba(61, 78, 174, 0.7)'

            },

        ]
    };

    public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    }

    public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    }

    // tables
    public dataSourcePanel: MatTableDataSource<Partial<PanelDto>> = new MatTableDataSource<Partial<PanelDto>>()
    public displayedColumnsPanel = ['name', 'type', 'watt', 'eff', 'size', 'price', 'amount']

    public dataSourceBattery: MatTableDataSource<Partial<BatteryDto>> = new MatTableDataSource<Partial<BatteryDto>>()
    public displayedColumnsBattery = ['name', 'type', 'cap', 'volt', 'bound', 'price', 'amount']

    public dataSourceInvertor: MatTableDataSource<Partial<InvertorDto>> = new MatTableDataSource<Partial<InvertorDto>>()
    public displayedColumnsInvertor = ['name', 'watt', 'volt', 'price', 'amount']

    public dataSourceController: MatTableDataSource<Partial<ControllerDto>> = new MatTableDataSource<Partial<ControllerDto>>()
    public displayedColumnsController = ['name', 'type', 'voltmod', 'nwatt', 'price', 'amount']

    constructor(
        private dialog: MatDialog,
        private formBuilder: FormBuilder,

        private panelService: PanelListService,
        private batteryService: BatteryListService,
        private invertorService: InvertorListService,
        private controllerService: ControllerListService
    ) { }

    public panelPrice = 0
    public batteryPrice = 0
    public invertorPrice = 0
    public controllerPrice = 0
    public overallPrice = 0


    ngOnInit(): void {
        this.curData = { ...this.optObj };

        if (this.optObj) {
            this.formGroupControl = this.formBuilder.group({
                area: [this.curData.area, [Validators.required]],
                region: [this.curData.region, [Validators.required]],
                winterSeason: [this.curData.winterSeason, [Validators.required]],
            });
        }
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        if (this.optObj) {
            this.formGroupControl.valueChanges.subscribe((data: any) => {
                this.curData = Object.assign({}, this.curData, data);
            })
        }
    }

    public clearField(field: string) {
        this.formGroupControl.patchValue({
            [field]: ''
        });
        this.curData[field] = '';
    }

    public openDeleteDialog(rowList: any[], restore: boolean = false): void {
        const dialogRef = this.dialog.open(DeleteModalComponent, {
            data: {
                rowList,
                columns: this.displayedColumns.slice(1, -1),
                restore
            },
            panelClass: "dialog-style"
        });

        dialogRef.afterClosed().subscribe((data: boolean) => {
            if (data && !restore) {
                this.deleteRecords.emit();
            }
            else if (data && restore) {
                this.restoreRecords.emit();
            }
        });
    }

    public openCreateDialog(row?: any): void {
        this.openDialog.emit({ row, edit: false });
    }

    public openEditDialog(row?: any): void {
        this.openDialog.emit({ row, edit: true });
    }

    public toggleFilters(): void {
        this.filterComponent.filterCollapsed = !this.filterComponent.filterCollapsed;
    }

    private getPageData(): any[] {
        return this.dataSource._pageData(this.dataSource._orderData(this.dataSource.filteredData));
    }

    public selectAll(): void {
        if (this.optObj) {
            this.dataSource.data.forEach(row => {
                for (let i = 0; i <= +row.duration - 1; i++) {
                    this.powerList[(+row.startTime + i) % 24] += +row.watt
                }
            })

            this.selection.selected.forEach(row => {
                for (let i = 0; i <= +row.duration - 1; i++) {
                    this.powerList[(+row.startTime + i) % 24] -= +row.watt
                }
            })

            this.barChartData.datasets[0].data = this.powerList
            this.powerAmountNeeded = this.powerList.reduce((prev, acc) => prev + acc)
            this.chart.update()
        }

        this.selection.select(...this.dataSource.data);
    }

    public deselectAll(): void {
        if (this.optObj) {
            this.dataSource.data.forEach(row => {
                for (let i = 0; i <= +row.duration - 1; i++) {
                    this.powerList[(+row.startTime + i) % 24] -= +row.watt
                }
            })

            this.barChartData.datasets[0].data = this.powerList
            this.powerAmountNeeded = this.powerList.reduce((prev, acc) => prev + acc)
            this.chart.update()
        }

        this.selection.deselect(...this.dataSource.data);
    }

    public isAllPageSelected(): boolean {
        return this.getPageData().every((row) => this.selection.isSelected(row));
    }

    public masterToggle(): void {
        if (this.isAllPageSelected()) {
            if (this.optObj) {
                this.getPageData().forEach(row => {
                    for (let i = 0; i <= +row.duration - 1; i++) {
                        this.powerList[(+row.startTime + i) % 24] -=
                            this.selection.isSelected(row) ? +row.watt : 0
                    }
                })
            }

            this.selection.deselect(...this.getPageData())
        } else {
            if (this.optObj) {
                this.getPageData().forEach(row => {
                    for (let i = 0; i <= +row.duration - 1; i++) {
                        this.powerList[(+row.startTime + i) % 24] +=
                            this.selection.isSelected(row) ? 0 : +row.watt
                    }
                })
            }

            this.selection.select(...this.getPageData());
        }

        if (this.optObj) {
            this.barChartData.datasets[0].data = this.powerList
            this.powerAmountNeeded = this.powerList.reduce((prev, acc) => prev + acc)
            this.chart.update()
        }
    }

    public checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllPageSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }

    public checkboxHandler(event: any, row: any) {
        this.selection.toggle(row)

        if (!this.optObj) {
            return
        }

        for (let i = 0; i <= +row.duration - 1; i++) {
            if (event.checked) {
                this.powerList[(+row.startTime + i) % 24] += +row.watt
            } else {
                this.powerList[(+row.startTime + i) % 24] -= +row.watt
            }
        }

        this.barChartData.datasets[0].data = this.powerList
        this.powerAmountNeeded = this.powerList.reduce((prev, acc) => prev + acc)

        this.chart.update()
    }

    public powerClickHandler(): void {
        if (!this.optObj) {
            return
        }

        this.powerList.fill(0)
        this.powerAmountNeeded = this.powerList.reduce((prev, acc) => prev + acc)

        this.chart.update()
    }



    public optimizeBtnHandler(): void {
        const RequiredEnergy = this.powerAmountNeeded
        const PeakEnergy = this.powerList.reduce((prev, acc) => prev > acc ? prev : acc)
        const NightEnergy = this.powerList.reduce((prev, acc, index) => index < 10 || index > 19 ? prev + acc : acc)

        console.log(PeakEnergy, NightEnergy)

        this.showContent = !this.showContent

        forkJoin([
            this.panelService.getPanels({ state: '1' }),
            this.batteryService.getBatteries({ state: '1' }),
            this.invertorService.getInvertors({ state: '1' }),
            this.controllerService.getControllers({ state: '1' })]
        ).subscribe(([Panels, Batteries, Invertors, Controllers]) => {
            const panels: any = [...Panels]

            for (let i = 0; i < panels.length; i++) {
                panels[i].watt = parseFloat(panels[i].watt)
                panels[i].volt = parseFloat(panels[i].volt)
                panels[i].amper = parseFloat(panels[i].amper)
                panels[i].size = parseFloat(panels[i].size)
                panels[i].price = parseFloat(panels[i].price)
                panels[i].eff = parseFloat(panels[i].eff)
                panels[i].voltoc = parseFloat(panels[i].voltoc)
            }

            const batteries: any = [...Batteries]

            for (let i = 0; i < batteries.length; i++) {
                batteries[i].volt = parseFloat(batteries[i].volt)
                batteries[i].cap = parseFloat(batteries[i].cap)
                batteries[i].price = parseFloat(batteries[i].price)
            }

            const invertors: any = [...Invertors]

            for (let i = 0; i < invertors.length; i++) {
                invertors[i].watt = parseFloat(invertors[i].watt)
                invertors[i].volt = parseFloat(invertors[i].volt)
                invertors[i].price = parseFloat(invertors[i].price)
            }

            const controllers: any = [...Controllers]

            for (let i = 0; i < controllers.length; i++) {
                controllers[i].mwatt = parseFloat(controllers[i].mwatt)
                controllers[i].mvolt = parseFloat(controllers[i].mvolt)
                controllers[i].mamper = parseFloat(controllers[i].mamper)
                controllers[i].price = parseFloat(controllers[i].price)
            }

            let insMonth = []
            let ins: number

                if (this.formGroupControl.controls.region?.value === 1) {
                    insMonth = insMoscow
                    if (this.formGroupControl.controls.winterSeason?.value) {
                        ins = 1.40
                    } else {
                        ins = 3.35
                    }
                } else if (this.formGroupControl.controls.region?.value === 2) {
                    insMonth = insKrasnodar

                    if (this.formGroupControl.controls.winterSeason?.value) {
                        ins = 1.59
                    } else {
                        ins = 4.50
                    }
                } else if (this.formGroupControl.controls.region?.value === 3) {
                    insMonth = insTwer

                    if (this.formGroupControl.controls.winterSeason?.value) {
                        ins = 1.01
                    } else {
                        ins = 3.16
                    }
                } else if (this.formGroupControl.controls.region?.value === 4) {
                    insMonth = insMur

                    if (this.formGroupControl.controls.winterSeason?.value) {
                        ins = 1.06
                    } else {
                        ins = 2.67
                    }
                } else if (this.formGroupControl.controls.region?.value === 5) {
                    insMonth = insAst

                    if (this.formGroupControl.controls.winterSeason?.value) {
                        ins = 1.77
                    } else {
                        ins = 4.73
                    }
                }

            const params: OptimizationParameters = {
                RequiredEnergy,
                PeakEnergy,
                NightEnergy,
                Area: Number(this.formGroupControl.controls.area?.value),
                Region: this.formGroupControl.controls.region?.value,
                WinterSeason: this.formGroupControl.controls.winterSeason?.value,
                Insolation: ins,
                Panels: panels,
                Batteries: batteries,
                Invertors: invertors,
                Controllers: controllers
            }

            const {optimalPanels, optimalPrice} = this.optimizePanels(params)

            setTimeout(() => {
                this.showContent = !this.showContent
                this.showCharts += 1

                const { panels, batteries, invertors, controllers } = dataSet[this.showCharts]

                console.log(panels, batteries, invertors, controllers)

                // panels
                let dataPanels = Array(12).fill(0)
                this.panelPrice = 0

                dataPanels = dataPanels.map((_, ind) => {
                    let panelsEnergy = 0
                    for (let i = 0; i < optimalPanels.length; i++) {
                        panelsEnergy += optimalPanels[i].size * optimalPanels[i].eff * (optimalPanels[i].type === 'Умный' ? 10 : 9) * insMonth[ind] * optimalPanels[i].amount
                    }

                    return Number(panelsEnergy).toFixed(2)
                })

                this.panelPrice = optimalPrice
                // for (let i = 0; i < optimalPanels.length; i++) {
                //     this.panelPrice += optimalPanels[i].price * optimalPanels[i].amount
                // }

                this.dataSourcePanel.data = optimalPanels

                this.lineChartPanelData.datasets[0].data = dataPanels
                this.lineChartPanelData.datasets[1].data = Array(12).fill(RequiredEnergy)
                this.chartPanel.update()

                // end panels
                // battery

                let overallCapacity = 0
                let boundCapacity = 0
                this.batteryPrice = 0

                batteries.forEach(bat => {
                    overallCapacity += bat.cap * bat.volt * bat.amount
                    boundCapacity += overallCapacity * (100 - bat.bound) / 100
                    this.batteryPrice += bat.price * bat.amount
                })

                this.dataSourceBattery.data = batteries
                this.barChartBatteryData.datasets[0].data = [NightEnergy]
                this.barChartBatteryData.datasets[1].data = [boundCapacity]
                this.barChartBatteryData.datasets[2].data = [overallCapacity]
                this.chartBattery.update()

                // end battery
                // invertor

                let overallPower = 0
                this.invertorPrice = 0

                invertors.forEach(inv => {
                    overallPower += inv.watt * inv.amount
                    this.invertorPrice += inv.price * inv.amount
                })

                this.dataSourceInvertor.data = invertors
                this.barChartInvertorData.datasets[0].data = [PeakEnergy]
                this.barChartInvertorData.datasets[1].data = [overallPower]
                this.chartInvertor.update()

                // end invertor
                // controller

                this.controllerPrice = 0

                controllers.forEach(con => {
                    this.controllerPrice += con.price * con.amount
                })
                this.dataSourceController.data = controllers

                // end controller

                this.overallPrice = this.panelPrice + this.batteryPrice + this.invertorPrice + this.controllerPrice

            }, 2300)
        })
    }

    public optimizePanels(params: OptimizationParameters) {
        const { Panels, Area, RequiredEnergy, Insolation } = params
console.log(Area)
        const optimizer: SolarPanelsOptimizer = new SolarPanelsOptimizer(
            Panels.length,
            Panels,
            Insolation,
            Area,
            RequiredEnergy
        );

        const obj = optimizer.getMinCostAndIndices();

        if (obj.optimalPanels.length === 0) return { optimalPanels: [], optimalPrice: -1 }

        const optimalPanels = []
        let optPrice = obj.optimalPrice

        for (let i = obj.optimalPanels.length - 1; i > -1; i--) {
            if (optPrice !== 0) {
                if (optimalPanels[optimalPanels.length - 1]?.id === obj.optimalPanels[i].id) {
                    optimalPanels[optimalPanels.length - 1].amount += 1
                } else {
                    optimalPanels.push({...obj.optimalPanels[i], amount: 1})
                }

                optPrice -= obj.optimalPanels[i].price
            } else break
        }
        console.log(optimalPanels, " - DP ", optimizer.count)

//         return { optimalPanels, optimalPrice: obj.optimalPrice }

        // const n = Panels.length;
        // const dp: number[][] = new Array(RequiredEnergy + 1).fill(null).map(() => new Array(Area + 1).fill(Number.MAX_VALUE));
        // const chosenPanels: PanelDto[][][] = new Array(RequiredEnergy + 1).fill(null).map(() => new Array(Area + 1).fill([]));

        // dp[0][0] = 0;

        // for (let i = 0; i < n; i++) {
        //   const panel = Panels[i];
        //   const providedEnergy = Math.round((Insolation * panel.eff * panel.size) / 100);

        //   for (let j = RequiredEnergy; j >= providedEnergy; j--) {
        //     for (let k = Area; k >= Math.ceil(panel.size); k--) {
        //       if (dp[j - providedEnergy][k - Math.ceil(panel.size)] + panel.price < dp[j][k]) {
        //         dp[j][k] = dp[j - providedEnergy][k - Math.ceil(panel.size)] + panel.price;
        //         chosenPanels[j][k] = [...chosenPanels[j - providedEnergy][k - Math.ceil(panel.size)], panel];
        //       }
        //     }
        //   }
        // }

        // let optimalPanels: PanelDto[] = [];
        // let totalPrice = Number.MAX_VALUE;

        // for (let k = 0; k <= Area; k++) {
        //   if (dp[RequiredEnergy][k] < totalPrice) {
        //     totalPrice = dp[RequiredEnergy][k];
        //     optimalPanels = chosenPanels[RequiredEnergy][k];
        //   }
        // }

        // console.log(optimalPanels, totalPrice)

        // return { panels: optimalPanels, totalPrice };

        // const { Panels, Insolation, Area, RequiredEnergy } = params

        console.log(Panels, Insolation, Area, RequiredEnergy)
        // let chosenPanels: PanelDto[] = []
        // let chosenPrice: number = Number.MAX_VALUE
        // let c = {
        //     count : 0
        // }

        // const temp: PanelDto[] = []

        // const out = (energy, size, price, buf: PanelDto[], c) => {
        //     c.count += 1

        //     if (size > Area) {
        //         return
        //     }

        //     if (energy > RequiredEnergy) {
        //         if (price < chosenPrice) {
        //             chosenPrice = price
        //             chosenPanels = [...buf]
        //         }

        //         return
        //     }

        //     for (let i = 0; i < Panels.length; i++) {
        //         buf.push(Panels[i])

        //         let val = Panels[i].eff * Panels[i].size * Insolation * 9

        //         energy += val
        //         size += Panels[i].size
        //         price += Panels[i].price

        //         out(energy, size, price, buf, c)

        //         energy -= val
        //         size -= Panels[i].size
        //         price -= Panels[i].price
        //         buf.pop()
        //     }
        // }

        // out(0, 0, 0, temp, c)
        // console.log(c.count, chosenPanels, chosenPrice, " - BF")

        return { optimalPanels, optimalPrice: obj.optimalPrice }
    }

}

class SolarPanelsOptimizer {
    private dp: number[][][];
    private parentIndices: number[][][][];
    private panels: PanelDto[];
    private insolation: number;
    private maxArea: number;
    private requiredEnergy: number;

    public count: number;

    constructor(n: number, panels: PanelDto[], insolation: number, maxArea: number, requiredEnergy: number) {
        this.insolation = insolation;
        this.maxArea = maxArea;
        this.requiredEnergy = requiredEnergy;
        this.panels = panels;
        this.dp = new Array(n).fill(null).map(() =>
            new Array(maxArea + 1).fill(null).map(() => new Array(requiredEnergy + 1).fill(-1))
        );
        this.parentIndices = new Array(n + 1).fill(null).map(() =>
            new Array(maxArea + 1).fill(null).map(() => new Array(requiredEnergy + 1).fill(null).
            map(() => []))
        );

        this.count = 0
        // dp(n, vector< vector<int> >(maxArea + 1, vector<int>(requiredEnergy + 1, -1))),
        // p (n + 1, vector< vector< vector<int> > >(maxArea + 1, vector< vector<int> >(requiredEnergy + 1))) {}
    }

    private solve(idx: number, currArea: number, currEnergy: number): number {
        this.count += 1
        if (idx === this.panels.length || currEnergy >= this.requiredEnergy) {
            if (currArea <= this.maxArea && currEnergy >= this.requiredEnergy) return 0;
            return 1e9+7;
        }

        let cost: number = this.dp[idx][currArea][currEnergy];
        if (cost !== -1) return cost;

        cost = this.solve(idx + 1, currArea, currEnergy);

        this.parentIndices[idx][currArea][currEnergy] = [...this.parentIndices[idx + 1][currArea][currEnergy]];

        if (Math.ceil(currArea + this.panels[idx].size) <= this.maxArea) {
            const newEnergy: number =
            Math.round(currEnergy + this.panels[idx].eff * this.panels[idx].size * this.insolation * 9);
            const costWithCurrPanel: number =
                this.panels[idx].price + this.solve(idx, Math.ceil(currArea + this.panels[idx].size), newEnergy);

            if (costWithCurrPanel < cost) {
                cost = costWithCurrPanel;

                if (newEnergy <= this.requiredEnergy) {
                    this.parentIndices[idx][currArea][currEnergy] = [...this.parentIndices[idx][Math.ceil(currArea + this.panels[idx].size)][newEnergy]];
                }

                this.parentIndices[idx][currArea][currEnergy].push(idx);
            }
        }

        return cost;
    }

    public getMinCostAndIndices() {
        const minCost: number = this.solve(0, 0, 0);
        if (minCost === 1e9+7) {
            console.log("Not possible to achieve the required energy with the given maximum area");
        } else {
            console.log("Minimum cost:", minCost);
            console.log("PanelDto indices:", ...this.parentIndices[0][0][0]);
        }

        const panels: PanelDto[] = Array()
        for (let index of this.parentIndices[0][0][0]) {
            panels.push(this.panels[index])
        }

        return { optimalPanels: panels, optimalPrice: minCost }
    }
}









// class SolarOptimizer {
//     private dp: number[][][];
//     private parentIndices: number[][][][];
//     private equipment: PanelDto[];
//     private insolation: number;
//     private maxArea: number;
//     private requiredEnergy: number;

//     constructor(n: number, equipment: EquipmentDto[], insolation: number, maxArea: number, requiredEnergy: number) {
//         this.insolation = insolation;
//         this.maxArea = maxArea;
//         this.requiredEnergy = requiredEnergy;
//         this.equipment = equipment;
//         this.dp = new Array(n).fill(null).map(() =>
//             new Array(maxArea + 1).fill(null).map(() => new Array(requiredEnergy + 1).fill(-1))
//         );
//         this.parentIndices = new Array(n + 1).fill(null).map(() =>
//             new Array(maxArea + 1).fill(null).map(() => new Array(requiredEnergy + 1).fill(null).
//             map(() => []))
//         );
//     }

//     private solve(idx: number, currArea: number, currEnergy: number): number {
//         if (idx === this.equipment.length || currEnergy >= this.requiredEnergy) {
//             if (currArea <= this.maxArea && currEnergy >= this.requiredEnergy) return 0;
//             return 1e9+7;
//         }
//         let cost: number = this.dp[idx][currArea][currEnergy];

//         if (cost !== -1) return cost;

//         cost = this.solve(idx + 1, currArea, currEnergy);
//         this.parentIndices[idx][currArea][currEnergy] = [...this.parentIndices[idx + 1][currArea][currEnergy]];

//         if (Math.ceil(currArea + this.equipment[idx].size) <= this.maxArea) {
//             const newEnergy: number =
//             Math.round(currEnergy + this.equipment[idx].eff * this.equipment[idx].size * this.insolation * 9);
//             const costWithCurrPanel: number =
//                 this.equipment[idx].price + this.solve(idx, Math.ceil(currArea + this.equipment[idx].size), newEnergy);

//             if (costWithCurrPanel < cost) {
//                 cost = costWithCurrPanel;
//                 if (newEnergy <= this.requiredEnergy) {
//                     this.parentIndices[idx][currArea][currEnergy] = [...this.parentIndices[idx][Math.ceil(currArea + this.equipment[idx].size)][newEnergy]];
//                 }
//                 this.parentIndices[idx][currArea][currEnergy].push(idx);
//             }
//         }

//         return cost;
//     }

//     public getMinCostAndIndices() {
//         const minCost: number = this.solve(0, 0, 0);
//         if (minCost === 1e9+7) {
//             console.log("Not possible");
//         } else {
//             console.log("Minimum cost:", minCost);
//             console.log("Indices:", ...this.parentIndices[0][0][0]);
//         }

//         const equipment: EquipmentDto[] = Array()
//         for (let index of this.parentIndices[0][0][0]) {
//             equipment.push(this.equipment[index])
//         }
//         const { panels, batteries, invertors, controllers } = equipment

//         return { panels, batteries, invertors, controllers, totalPrice: minCost } as OptimalSolution
//     }
// }
