import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { FilterInvertorDto } from 'src/app/models/dto/filters/filter-invertor-dto.model';


@Component({
    selector: 'app-table-filter',
    templateUrl: './table-filter.component.html',
    styleUrls: ['./table-filter.component.scss']
})
export class TableFilterComponent implements OnInit, AfterViewInit {

    @Input() readonly filterData: FilterInvertorDto;

    @Output() readonly filterProps: EventEmitter<FilterInvertorDto> = new EventEmitter();
    @Output() readonly filterCount: EventEmitter<number> = new EventEmitter();

    @ViewChild(MatAccordion) accordion: MatAccordion;
    @ViewChild('panel1') panel1: MatExpansionPanel;
    @ViewChild('panel2') panel2: MatExpansionPanel;
    @ViewChild('panel3') panel3: MatExpansionPanel;
    @ViewChild('panel4') panel4: MatExpansionPanel;

    public readonly separatorKeysCodes = [ENTER, COMMA];

    public formGroupControl: FormGroup;
    public filterCollapsed: boolean = true;

    public names: string[];
    public watts: string[];
    public volts: string[];
    public prices: string[];

    public namesLen: number;
    public wattsLen: number;
    public voltsLen: number;
    public pricesLen: number;

    constructor(
        private formBuilder: FormBuilder,
    ) { }

    ngOnInit(): void {

        this.formGroupControl = this.formBuilder.group({
            name: ["", []],
            watt: ["", []],
            volt: ["", []],
            price: ["", []],
        });

        this.names = this.filterData.names ? [...this.filterData.names] : [];
        this.namesLen = this.names.length;

        this.watts = this.filterData.watts ? [...this.filterData.watts] : [];
        this.wattsLen = this.watts.length;

        this.volts = this.filterData.volts ? [...this.filterData.volts] : [];
        this.voltsLen = this.volts.length;

        this.prices = this.filterData.prices ? [...this.filterData.prices] : [];
        this.pricesLen = this.prices.length;

        this.filterCount.emit(this.namesLen + this.wattsLen + this.voltsLen + this.pricesLen);
    }

    ngAfterViewInit(): void {
        if (this.names.length > 0) {
            this.panel1.toggle();
        }
        if (this.watts.length > 0) {
            this.panel2.toggle();
        }
        if (this.volts.length > 0) {
            this.panel3.toggle();
        }
        if (this.prices.length > 0) {
            this.panel4.toggle();
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
                    case 'watt': {
                        this.watts.push(data[field]);
                        break;
                    }
                    case 'volt': {
                        this.volts.push(data[field]);
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

    public remove(from: string, toRemove: string): void {
        switch (from) {
            case 'name': {
                const index = this.names.indexOf(toRemove as string);

                if (index < this.namesLen) {
                    this.namesLen --;
                }

                if (index >= 0) {
                    this.names.splice(index, 1);
                }
                break;
            }
            case 'watt': {
                const index = this.watts.indexOf(toRemove as string);

                if (index < this.wattsLen) {
                    this.wattsLen --;
                }

                if (index >= 0) {
                    this.watts.splice(index, 1);
                }
                break;
            }
            case 'volt': {
                const index = this.volts.indexOf(toRemove as string);

                if (index < this.voltsLen) {
                    this.voltsLen --;
                }

                if (index >= 0) {
                    this.volts.splice(index, 1);
                }
                break;
            }
            case 'price': {
                const index = this.prices.indexOf(toRemove as string);

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
        } else if (field === 'watt') {
            this.watts.length = 0;
            this.wattsLen = 0;
        } else if (field === 'volt') {
            this.volts.length = 0;
            this.voltsLen = 0;
        } else if (field === 'price') {
            this.prices.length = 0;
            this.pricesLen = 0;
        }
    }

    public applyFilters(state: string): void {

        this.addByGroupControl();

        this.namesLen = this.names.length;
        this.wattsLen = this.watts.length;
        this.voltsLen = this.volts.length;
        this.pricesLen = this.prices.length;

        this.filterCount.emit(this.namesLen + this.wattsLen + this.voltsLen + this.pricesLen);

        this.filterProps.emit({
            names: this.names.length ? this.names : undefined,
            watts: this.watts.length ? this.watts : undefined,
            volts: this.volts.length ? this.volts : undefined,
            prices: this.prices.length ? this.prices : undefined,
            state
        });
    }

    public togglePanel(panel: MatExpansionPanel) {
       panel.expanded = !panel.expanded;
    }
}
