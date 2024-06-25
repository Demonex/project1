import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { FilterPanelDto } from 'src/app/models/dto/filters/filter-panel-dto.model';

@Component({
    selector: 'app-table-filter',
    templateUrl: './table-filter.component.html',
    styleUrls: ['./table-filter.component.scss']
})
export class TableFilterComponent implements OnInit, AfterViewInit {

    @Input() readonly filterData: FilterPanelDto;

    @Output() readonly filterProps: EventEmitter<FilterPanelDto> = new EventEmitter();
    @Output() readonly filterCount: EventEmitter<number> = new EventEmitter();

    @ViewChild(MatAccordion) accordion: MatAccordion;
    @ViewChild('panel1') panel1: MatExpansionPanel;
    @ViewChild('panel2') panel2: MatExpansionPanel;
    @ViewChild('panel3') panel3: MatExpansionPanel;
    @ViewChild('panel4') panel4: MatExpansionPanel;
    @ViewChild('panel5') panel5: MatExpansionPanel;
    @ViewChild('panel6') panel6: MatExpansionPanel;
    @ViewChild('panel7') panel7: MatExpansionPanel;
    @ViewChild('panel8') panel8: MatExpansionPanel;

    public readonly separatorKeysCodes = [ENTER, COMMA];

    public formGroupControl: FormGroup;
    public filterCollapsed: boolean = true;

    public names: string[] = [];
    public namesLen: number;

    public types: string[] = [];
    public typesLen: number;

    public watts: string[] = [];
    public wattsLen: number;

    public volts: string[] = [];
    public voltsLen: number;

    public ampers: string[] = [];
    public ampersLen: number;

    public effs: string[] = [];
    public effsLen: number;

    public sizes: string[] = [];
    public sizesLen: number;

    public prices: string[] = [];
    public pricesLen: number;

    constructor(
        private formBuilder: FormBuilder,

    ) { }

    ngOnInit(): void {
        this.formGroupControl = this.formBuilder.group({
            name: ["", []],
            type: ["", []],
            watt: ["", []],
            volt: ["", []],
            amper: ["", []],
            eff: ["", []],
            size: ["", []],
            price: ["", []],
        });

        this.names = this.filterData.names ? [...this.filterData.names] : [];
        this.namesLen = this.names.length;

        this.types = this.filterData.types ? [...this.filterData.types] : [];
        this.typesLen = this.types.length;

        this.watts = this.filterData.watts ? [...this.filterData.watts] : [];
        this.wattsLen = this.watts.length;

        this.volts = this.filterData.volts ? [...this.filterData.volts] : [];
        this.voltsLen = this.volts.length;

        this.ampers = this.filterData.ampers ? [...this.filterData.ampers] : [];
        this.ampersLen = this.ampers.length;

        this.effs = this.filterData.effs ? [...this.filterData.effs] : [];
        this.effsLen = this.effs.length;

        this.sizes = this.filterData.sizes ? [...this.filterData.sizes] : [];
        this.sizesLen = this.sizes.length;

        this.prices = this.filterData.prices ? [...this.filterData.prices] : [];
        this.pricesLen = this.prices.length;

        this.filterCount.emit(
            this.namesLen +
            this.typesLen +
            this.wattsLen +
            this.voltsLen +
            this.ampersLen +
            this.effsLen +
            this.sizesLen +
            this.pricesLen
        );
    }

    ngAfterViewInit(): void {
        if (this.names.length > 0) {
            this.panel1.toggle();
        }
        if (this.types.length > 0) {
            this.panel8.toggle();
        }
        if (this.watts.length > 0) {
            this.panel2.toggle();
        }
        if (this.volts.length > 0) {
            this.panel3.toggle();
        }
        if (this.ampers.length > 0) {
            this.panel4.toggle();
        }
        if (this.effs.length > 0) {
            this.panel5.toggle();
        }
        if (this.sizes.length > 0) {
            this.panel6.toggle();
        }
        if (this.prices.length > 0) {
            this.panel7.toggle();
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
                case 'watt': {
                    this.watts.push(value);
                    this.formGroupControl.controls.watt.patchValue("");
                    break;
                }
                case 'volt': {
                    this.volts.push(value);
                    this.formGroupControl.controls.volt.patchValue("");
                    break;
                }
                case 'amper': {
                    this.ampers.push(value);
                    this.formGroupControl.controls.amper.patchValue("");
                    break;
                }
                case 'eff': {
                    this.effs.push(value);
                    this.formGroupControl.controls.eff.patchValue("");
                    break;
                }
                case 'size': {
                    this.sizes.push(value);
                    this.formGroupControl.controls.size.patchValue("");
                    break;
                }
                case 'price': {
                    this.prices.push(value);
                    this.formGroupControl.controls.price.patchValue("");
                    break;
                }
                case 'type': {
                    this.types.push(value);
                    this.formGroupControl.controls.type.patchValue("");
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
                    case 'watt': {
                        this.watts.push(data[field]);
                        break;
                    }
                    case 'volt': {
                        this.volts.push(data[field]);
                        break;
                    }
                    case 'amper': {
                        this.ampers.push(data[field]);
                        break;
                    }
                    case 'eff': {
                        this.effs.push(data[field]);
                        break;
                    }
                    case 'size': {
                        this.sizes.push(data[field]);
                        break;
                    }
                    case 'price': {
                        this.prices.push(data[field]);
                        break;
                    }
                    case 'type': {
                        this.types.push(data[field]);
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
            case 'watt': {
                const index = this.watts.indexOf(toRemove);

                if (index < this.wattsLen) {
                    this.wattsLen --;
                }

                if (index >= 0) {
                    this.watts.splice(index, 1);
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
            case 'amper': {
                const index = this.ampers.indexOf(toRemove);

                if (index < this.ampersLen) {
                    this.ampersLen --;
                }

                if (index >= 0) {
                    this.ampers.splice(index, 1);
                }
                break;
            }
            case 'eff': {
                const index = this.effs.indexOf(toRemove);

                if (index < this.effsLen) {
                    this.effsLen --;
                }

                if (index >= 0) {
                    this.effs.splice(index, 1);
                }
                break;
            }
            case 'size': {
                const index = this.sizes.indexOf(toRemove);

                if (index < this.sizesLen) {
                    this.sizesLen --;
                }

                if (index >= 0) {
                    this.sizes.splice(index, 1);
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
        }
    }

    public clearField(field: string): void {
        this.formGroupControl.patchValue({
            [field]: ''
        });

        if (field === 'name') {
            this.names.length = 0;
            this.namesLen = 0;
        }
        if (field === 'watt') {
            this.watts.length = 0;
            this.wattsLen = 0;
        }
        if (field === 'volt') {
            this.volts.length = 0;
            this.voltsLen = 0;
        }
        if (field === 'amper') {
            this.ampers.length = 0;
            this.ampersLen = 0;
        }
        if (field === 'eff') {
            this.effs.length = 0;
            this.effsLen = 0;
        }
        if (field === 'size') {
            this.sizes.length = 0;
            this.sizesLen = 0;
        }
        if (field === 'price') {
            this.prices.length = 0;
            this.pricesLen = 0;
        }
        if (field === 'type') {
            this.prices.length = 0;
            this.pricesLen = 0;
        }
    }

    public applyFilters(state: string): void {

        this.addByGroupControl();

        this.namesLen = this.names.length;
        this.wattsLen = this.watts.length;
        this.voltsLen = this.volts.length;
        this.ampersLen = this.ampers.length;
        this.effsLen = this.effs.length;
        this.sizesLen = this.sizes.length;
        this.pricesLen = this.prices.length;
        this.typesLen = this.types.length;

        this.filterCount.emit(
            this.namesLen +
            this.wattsLen +
            this.voltsLen +
            this.ampersLen +
            this.effsLen +
            this.sizesLen +
            this.pricesLen +
            this.typesLen

        );
        this.filterProps.emit({
            names: this.names.length ? this.names : undefined,
            watts: this.watts.length ? this.watts : undefined,
            volts: this.volts.length ? this.volts : undefined,
            ampers: this.ampers.length ? this.ampers : undefined,
            effs: this.effs.length ? this.effs : undefined,
            sizes: this.sizes.length ? this.sizes : undefined,
            prices: this.prices.length ? this.prices : undefined,
            types: this.types.length ? this.types : undefined,
            state
        });
    }

    public togglePanel(panel: MatExpansionPanel) {
       panel.expanded = !panel.expanded;
    }
}
