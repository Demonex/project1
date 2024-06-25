import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { FilterOptimizationDto } from 'src/app/models/dto/filters/filter-optimization-dto.model';

@Component({
    selector: 'app-table-filter',
    templateUrl: './table-filter.component.html',
    styleUrls: ['./table-filter.component.scss']
})
export class TableFilterComponent implements OnInit, AfterViewInit {

    @Input() readonly filterData: FilterOptimizationDto;


    @Output() readonly filterProps: EventEmitter<FilterOptimizationDto> = new EventEmitter();
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
    public startTimes: string[] = [];
    public durations: string[] = [];
    public watts: string[] = [];


    public namesLen: number;
    public startTimesLen: number;
    public durationsLen: number;
    public wattsLen: number;

    constructor(
        private formBuilder: FormBuilder,

    ) { }

    ngOnInit(): void {
        this.formGroupControl = this.formBuilder.group({
            name: ["", []],
            startTime: ["", []],
            duration: ["", []],
            watt: ["", []],
        });

        this.names = this.filterData.names ? [...this.filterData.names] : [];
        this.namesLen = this.names.length;

        this.startTimes = this.filterData.startTimes ? [...this.filterData.startTimes] : [];
        this.startTimesLen = this.startTimes.length;

        this.durations = this.filterData.durations ? [...this.filterData.durations] : [];
        this.durationsLen = this.durations.length;

        this.watts = this.filterData.watts ? [...this.filterData.watts] : [];
        this.wattsLen = this.watts.length;

        this.filterCount.emit(this.namesLen + this.startTimesLen + this.durationsLen + this.wattsLen);
    }

    ngAfterViewInit(): void {
        if (this.names.length > 0) {
            this.panel1.toggle();
        }
        if (this.startTimes.length > 0) {
            this.panel2.toggle();
        }
        if (this.durations.length > 0) {
            this.panel3.toggle();
        }
        if (this.watts.length > 0) {
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
                case 'startTime': {
                    this.startTimes.push(value);
                    this.formGroupControl.controls.startTime.patchValue("");
                    break;
                }
                case 'duration': {
                    this.durations.push(value);
                    this.formGroupControl.controls.duration.patchValue("");
                    break;
                }
                case 'watt': {
                    this.watts.push(value);
                    this.formGroupControl.controls.watt.patchValue("");
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
                    case 'startTime': {
                        this.startTimes.push(data[field]);
                        break;
                    }
                    case 'duration': {
                        this.durations.push(data[field]);
                        break;
                    }
                    case 'watt': {
                        this.watts.push(data[field]);
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
            case 'startTime': {
                const index = this.startTimes.indexOf(toRemove);

                if (index < this.startTimesLen) {
                    this.startTimesLen --;
                }

                if (index >= 0) {
                    this.startTimes.splice(index, 1);
                }
                break;
            }
            case 'duration': {
                const index = this.durations.indexOf(toRemove);

                if (index < this.durationsLen) {
                    this.durationsLen --;
                }

                if (index >= 0) {
                    this.durations.splice(index, 1);
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
        }

    }

    public clearField(field: string): void {
        this.formGroupControl.patchValue({
            [field]: ''
        });

        if (field === 'name') {
            this.names.length = 0;
            this.namesLen = 0;
        } else if (field === 'startTime') {
            this.startTimes.length = 0;
            this.startTimesLen = 0;
        } else if (field === 'duration') {
            this.durations.length = 0;
            this.durationsLen = 0;
        } else if (field === 'watt') {
            this.watts.length = 0;
            this.wattsLen = 0;
        }
    }

    public applyFilters(state: string): void {

        this.addByGroupControl();

        this.namesLen = this.names.length;
        this.startTimesLen = this.startTimes.length;
        this.durationsLen = this.durations.length;
        this.wattsLen = this.watts.length;

        this.filterCount.emit(this.namesLen);

        this.filterProps.emit({
            names: this.names.length ? this.names : undefined,
            startTimes: this.startTimes.length ? this.startTimes : undefined,
            durations: this.durations.length ? this.durations : undefined,
            watts: this.watts.length ? this.watts : undefined,
            state
        });
    }

    public togglePanel(panel: MatExpansionPanel) {
       panel.expanded = !panel.expanded;
    }
}
