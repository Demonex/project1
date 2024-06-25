import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { FilterControllerDto } from 'src/app/models/dto/filters/filter-controller-dto.model';

@Component({
    selector: 'app-table-filter',
    templateUrl: './table-filter.component.html',
    styleUrls: ['./table-filter.component.scss']
})
export class TableFilterComponent implements OnInit, AfterViewInit {

    @Input() readonly filterData: FilterControllerDto;

    @Output() readonly filterProps: EventEmitter<FilterControllerDto> = new EventEmitter();
    @Output() readonly filterCount: EventEmitter<number> = new EventEmitter();

    @ViewChild(MatAccordion) accordion: MatAccordion;
    @ViewChild('panel1') panel1: MatExpansionPanel;
    @ViewChild('panel2') panel2: MatExpansionPanel;
    @ViewChild('panel3') panel3: MatExpansionPanel;
    @ViewChild('panel4') panel4: MatExpansionPanel;

    public readonly separatorKeysCodes = [ENTER, COMMA];

    public formGroupControl: FormGroup;
    public filterCollapsed: boolean = true;

    public names: string[] = [];
    public types: string[] = [];
    public voltmods: string[] = [];
    public prices: string[] = [];

    public namesLen: number;
    public typesLen: number;
    public voltmodsLen: number;
    public pricesLen: number;

    constructor(
        private formBuilder: FormBuilder,
    ) { }

    ngOnInit(): void {
        this.formGroupControl = this.formBuilder.group({
            name: ["", []],
            type: ["", []],
            voltmod: ["", []],
            price: ["", []],
        });

        this.names = this.filterData.names ? [...this.filterData.names] : [];
        this.namesLen = this.names.length;

        this.types = this.filterData.types ? [...this.filterData.types] : [];
        this.typesLen = this.types.length;

        this.voltmods = this.filterData.voltmods ? [...this.filterData.voltmods] : [];
        this.voltmodsLen = this.voltmods.length;

        this.prices = this.filterData.prices ? [...this.filterData.prices] : [];
        this.pricesLen = this.prices.length;

        this.filterCount.emit(this.namesLen + this.typesLen + this.voltmodsLen + this.pricesLen);
    }

    ngAfterViewInit(): void {
        if (this.names.length > 0) {
            this.panel1.toggle();
        }
        if (this.types.length > 0) {
            this.panel2.toggle();
        }
        if (this.voltmods.length > 0) {
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
                case 'type': {
                    this.types.push(value);
                    this.formGroupControl.controls.type.patchValue("");
                    break;
                }
                case 'voltmod': {
                    this.voltmods.push(value);
                    this.formGroupControl.controls.voltmod.patchValue("");
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
                    case 'voltmod': {
                        this.voltmods.push(data[field]);
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
            case 'voltmod': {
                const index = this.voltmods.indexOf(toRemove);

                if (index < this.voltmodsLen) {
                    this.voltmodsLen --;
                }

                if (index >= 0) {
                    this.voltmods.splice(index, 1);
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
        if (field === 'panels') {
            this.formGroupControl.patchValue({
                [field]: []
            });

        } else {
            this.formGroupControl.patchValue({
                [field]: ''
            });

            if (field === 'name') {
                this.names.length = 0;
                this.namesLen = 0;
            } else if (field === 'type') {
                this.types.length = 0;
                this.typesLen = 0;
            } else if (field === 'voltmod') {
                this.voltmods.length = 0;
                this.voltmodsLen = 0;
            } else if (field === 'price') {
                this.prices.length = 0;
                this.pricesLen = 0;
            }
        }
    }

    public applyFilters(state: string): void {

        this.addByGroupControl();

        const panels: string[] = [];

        this.namesLen = this.names.length;
        this.typesLen = this.types.length;
        this.voltmodsLen = this.voltmods.length;
        this.pricesLen = this.prices.length;

        this.filterCount.emit(this.namesLen + this.typesLen + this.voltmodsLen + this.pricesLen);

        this.filterProps.emit({
            names: this.names.length ? this.names : undefined,
            types: this.types.length ? this.types : undefined,
            voltmods: this.voltmods.length ? this.voltmods : undefined,
            prices: this.prices.length ? this.prices : undefined,
            state
        });
    }

    public togglePanel(panel: MatExpansionPanel) {
       panel.expanded = !panel.expanded;
    }
}
