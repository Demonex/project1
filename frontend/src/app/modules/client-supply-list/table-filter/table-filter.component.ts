import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { BatteryListService } from 'src/app/services/battery-list.service';
import { BatteryDto } from 'src/app/models/dto/battery-list-dto.model';
import { SupplyListService } from 'src/app/services/supply-list.service';
import { SupplyDto } from 'src/app/models/dto/supply-list-dto.model';
import { FilterBatterySupplyDto } from 'src/app/models/dto/filters/filter-client-supply-dto.model';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-table-filter',
    templateUrl: './table-filter.component.html',
    styleUrls: ['./table-filter.component.scss']
})
export class TableFilterComponent implements OnInit, AfterViewInit {

    @Input() readonly filterData: FilterBatterySupplyDto;

    @Output() readonly filterProps: EventEmitter<FilterBatterySupplyDto> = new EventEmitter();
    @Output() readonly filterCount: EventEmitter<number> = new EventEmitter();

    @ViewChild(MatAccordion) accordion: MatAccordion;
    @ViewChild('panel1') panel1: MatExpansionPanel;
    @ViewChild('panel2') panel2: MatExpansionPanel;

    public readonly separatorKeysCodes = [ENTER, COMMA];

    public formGroupControl: FormGroup;
    public filterCollapsed: boolean = true;

    public batteryList: BatteryDto[] = [];
    public supplyList: SupplyDto[] = [];

    public batteriesLen: number;
    public suppliesLen: number;

    constructor(
        private formBuilder: FormBuilder,
        private batteryService: BatteryListService,
        private supplyService: SupplyListService,
    ) { }

    ngOnInit(): void {
        this.formGroupControl = this.formBuilder.group({
            batteries: [[], []],
            supplies: [[], []],
        });

        forkJoin([
            this.batteryService.getBatteries(),
            this.supplyService.getSupplies()
        ]).subscribe(([batteries, supplies]) => {
            this.batteryList = batteries;

            let batteryFilter: BatteryDto[] = [];

            this.filterData.batteries?.forEach((id: string) => {
                batteryFilter.push(...this.batteryList.filter((record: BatteryDto) => {
                    return record.id.toString() === id;
                }));
            });

            this.formGroupControl.patchValue({
                batteries: batteryFilter
            });
            this.batteriesLen = this.filterData.batteries?.length || 0;

            if (this.formGroupControl.controls.batteries.value.length > 0) {
                this.panel1.toggle();
            }

            // supplies

            this.supplyList = supplies;

            let supplyFilter: SupplyDto[] = [];

            this.filterData.supplies?.forEach((id: string) => {
                supplyFilter.push(...this.supplyList.filter((record: SupplyDto) => {
                    return record.id.toString() === id;
                }));
            });

            this.formGroupControl.patchValue({
                supplies: supplyFilter
            });
            this.suppliesLen = this.filterData.supplies?.length || 0;

            if (this.formGroupControl.controls.supplies.value.length > 0) {
                this.panel2.toggle();
            }

            this.filterCount.emit(this.batteriesLen + this.suppliesLen);
        })

    }

    ngAfterViewInit(): void {

    }

    public add(event: MatChipInputEvent): void {

    }

    public remove(from: string, toRemove): void {
        switch (from) {
            case 'battery': {
                const batteries: BatteryDto[] = this.formGroupControl.controls.batteries.value;
                const index = batteries.findIndex(element => element.id === toRemove.id);

                if (index < this.batteriesLen) {
                    this.batteriesLen --;
                }

                if (index >= 0) {
                    batteries.splice(index, 1);
                }

                this.formGroupControl.controls.batteries.setValue([...batteries]);
                break;
            }
            case 'supply': {
                const supplies: SupplyDto[] = this.formGroupControl.controls.supplies.value;
                const index = supplies.findIndex(element => element.id === toRemove.id);

                if (index < this.suppliesLen) {
                    this.suppliesLen --;
                }

                if (index >= 0) {
                    supplies.splice(index, 1);
                }

                this.formGroupControl.controls.supplies.setValue([...supplies]);
                break;
            }
        }
    }

    public clearField(field: string): void {
        if (field === 'batteries' || field === 'supplies') {
            this.formGroupControl.patchValue({
                [field]: []
            });

            if (field === 'batteries') {
                this.batteriesLen = 0;
            }
            else {
                this.suppliesLen = 0;
            }
        }
    }

    public applyFilters(state: string): void {

        const batteries: string[] = [];
        const batteriesControl: BatteryDto[] = this.formGroupControl.controls.batteries.value as BatteryDto[];

        batteriesControl.forEach(elem => {
            batteries.push(elem.id.toString());
        })

        const supplies: string[] = [];
        const suppliesControl: SupplyDto[] = this.formGroupControl.controls.supplies.value as SupplyDto[];

        suppliesControl.forEach(elem => {
            supplies.push(elem.id.toString());
        })

        this.batteriesLen = batteries.length;
        this.suppliesLen = supplies.length;

        this.filterCount.emit(this.batteriesLen + this.suppliesLen);

        this.filterProps.emit({
            batteries: batteries.length ? batteries : undefined,
            supplies: supplies.length ? supplies : undefined,
            state
        });
    }

    public togglePanel(panel: MatExpansionPanel) {
       panel.expanded = !panel.expanded;
    }
}
