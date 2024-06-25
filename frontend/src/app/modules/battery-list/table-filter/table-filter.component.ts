import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { FilterBatteryDto } from 'src/app/models/dto/filters/filter-battery-dto.model';

@Component({
    selector: 'app-table-filter',
    templateUrl: './table-filter.component.html',
    styleUrls: ['./table-filter.component.scss']
})
export class TableFilterComponent implements OnInit, AfterViewInit {

    @Input() readonly filterData: FilterBatteryDto;


    @Output() readonly filterProps: EventEmitter<FilterBatteryDto> = new EventEmitter();
    @Output() readonly filterCount: EventEmitter<number> = new EventEmitter();

    @ViewChild(MatAccordion) accordion: MatAccordion;
    @ViewChild('panel1') panel1: MatExpansionPanel;
    @ViewChild('panel2') panel2: MatExpansionPanel;
    @ViewChild('panel3') panel3: MatExpansionPanel;
    @ViewChild('panel4') panel4: MatExpansionPanel;
    @ViewChild('panel5') panel5: MatExpansionPanel;
    @ViewChild('panel6') panel6: MatExpansionPanel;

    public readonly separatorKeysCodes = [ENTER, COMMA];

    public formGroupControl: FormGroup;
    public filterCollapsed: boolean = true;

    public names: string[] = [];
    public types: string[] = [];
    public caps: string[] = [];
    public volts: string[] = [];
    public bounds: string[] = [];
    public prices: string[] = [];

    public namesLen: number;
    public typesLen: number;
    public capsLen: number;
    public voltsLen: number;
    public boundsLen: number;
    public pricesLen: number;

    constructor(
        private formBuilder: FormBuilder,
    ) { }

    ngOnInit(): void {
        this.formGroupControl = this.formBuilder.group({
            name: ["", []],
            type: ["", []],
            cap: ["", []],
            volt: ["", []],
            bound: ["", []],
            price: ["", []],
        });

        this.names = this.filterData.names ? [...this.filterData.names] : [];
        this.namesLen = this.names.length;

        this.types = this.filterData.types ? [...this.filterData.types] : [];
        this.typesLen = this.types.length;

        this.caps = this.filterData.caps ? [...this.filterData.caps] : [];
        this.capsLen = this.caps.length;

        this.volts = this.filterData.volts ? [...this.filterData.volts] : [];
        this.voltsLen = this.volts.length;

        this.bounds = this.filterData.bounds ? [...this.filterData.bounds] : [];
        this.boundsLen = this.bounds.length;

        this.prices = this.filterData.prices ? [...this.filterData.prices] : [];
        this.pricesLen = this.prices.length;

        this.filterCount.emit(
            this.namesLen +
            this.typesLen +
            this.capsLen +
            this.voltsLen +
            this.boundsLen +
            this.pricesLen
        );
    }

    ngAfterViewInit(): void {
        if (this.names.length > 0) {
            this.panel1.toggle();
        }
        if (this.types.length > 0) {
            this.panel2.toggle();
        }
        if (this.caps.length > 0) {
            this.panel3.toggle();
        }
        if (this.volts.length > 0) {
            this.panel4.toggle();
        }
        if (this.bounds.length > 0) {
            this.panel5.toggle();
        }
        if (this.prices.length > 0) {
            this.panel6.toggle();
        }
    }

    public add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();

        if (value) {
            switch (event.chipInput.id) {
                case 'name': {
                    this.names.push(value);
                    this.formGroupControl.controls.name.patchValue("");
                    break;
                }
                case 'type': {
                    this.types.push(value);
                    this.formGroupControl.controls.type.patchValue("");
                    break;
                }
                case 'cap': {
                    this.caps.push(value);
                    this.formGroupControl.controls.cap.patchValue("");
                    break;
                }
                case 'volt': {
                    this.volts.push(value);
                    this.formGroupControl.controls.volt.patchValue("");
                    break;
                }
                case 'bound': {
                    this.bounds.push(value);
                    this.formGroupControl.controls.bound.patchValue("");
                    break;
                }
                case 'price': {
                    this.prices.push(value);
                    this.formGroupControl.controls.price.patchValue("");
                    break;
                }
            }
        }
    }

    public addByGroupControl(): void {
        const data = this.formGroupControl.value;

        for (const field in data) {
            if (typeof data[field] === 'string' && data[field].trim().length > 0) {
                switch (field) {
                    case 'name': {
                        this.names.push(data[field]);
                        break;
                    }
                    case 'type': {
                        this.types.push(data[field]);
                        break;
                    }
                    case 'cap': {
                        this.caps.push(data[field]);
                        break;
                    }
                    case 'volt': {
                        this.volts.push(data[field]);
                        break;
                    }
                    case 'bound': {
                        this.bounds.push(data[field]);
                        break;
                    }
                    case 'price': {
                        this.prices.push(data[field]);
                        break;
                    }
                }

                this.formGroupControl.patchValue({
                    [field]: ""
                });
            }
        }
    }

    public remove(from: string, toRemove): void {
        switch (from) {
            case 'name': {
                const index = this.names.indexOf(toRemove);

                if (index < this.namesLen) {
                    this.namesLen --;
                }

                if (index >= 0) {
                    this.names.splice(index, 1);
                }
                break;
            }
            case 'type': {
                const index = this.types.indexOf(toRemove);

                if (index < this.typesLen) {
                    this.typesLen --;
                }

                if (index >= 0) {
                    this.types.splice(index, 1);
                }
                break;
            }
            case 'cap': {
                const index = this.caps.indexOf(toRemove);

                if (index < this.capsLen) {
                    this.capsLen --;
                }

                if (index >= 0) {
                    this.caps.splice(index, 1);
                }
                break;
            }
            case 'volt': {
                const index = this.volts.indexOf(toRemove);

                if (index < this.voltsLen) {
                    this.voltsLen --;
                }

                if (index >= 0) {
                    this.volts.splice(index, 1);
                }
                break;
            }
            case 'bound': {
                const index = this.bounds.indexOf(toRemove);

                if (index < this.boundsLen) {
                    this.boundsLen --;
                }

                if (index >= 0) {
                    this.bounds.splice(index, 1);
                }
                break;
            }
            case 'price': {
                const index = this.prices.indexOf(toRemove);

                if (index < this.pricesLen) {
                    this.pricesLen --;
                }

                if (index >= 0) {
                    this.prices.splice(index, 1);
                }
                break;
            }
        }

    }

    public clearField(field: string): void {
        this.formGroupControl.patchValue({
            [field]: ''
        });

        if (field === 'name') {
            this.names.length = 0;
            this.namesLen = 0;
        } else if (field === 'type') {
            this.types.length = 0;
            this.typesLen = 0;
        } else if (field === 'cap') {
            this.caps.length = 0;
            this.capsLen = 0;
        } else if (field === 'volt') {
            this.volts.length = 0;
            this.voltsLen = 0;
        } else if (field === 'bound') {
            this.bounds.length = 0;
            this.boundsLen = 0;
        } else if (field === 'price') {
            this.prices.length = 0;
            this.pricesLen = 0;
        }
    }

    public applyFilters(state: string): void {

        this.addByGroupControl();

        this.namesLen = this.names.length;
        this.typesLen = this.types.length;
        this.capsLen = this.caps.length;
        this.voltsLen = this.volts.length;
        this.boundsLen = this.bounds.length;
        this.pricesLen = this.prices.length;

        this.filterCount.emit(
            this.namesLen +
            this.typesLen +
            this.capsLen +
            this.voltsLen +
            this.boundsLen +
            this.pricesLen
        );

        this.filterProps.emit({
            names: this.names.length ? this.names : undefined,
            types: this.types.length ? this.types : undefined,
            caps: this.caps.length ? this.caps : undefined,
            volts: this.volts.length ? this.volts : undefined,
            bounds: this.bounds.length ? this.bounds : undefined,
            prices: this.prices.length ? this.prices : undefined,
            state
        });
    }

    public togglePanel(panel: MatExpansionPanel) {
       panel.expanded = !panel.expanded;
    }
}
