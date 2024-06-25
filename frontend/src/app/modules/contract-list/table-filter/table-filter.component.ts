import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { COMMA, ENTER, P } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { ControllerListService } from 'src/app/services/controller-list.service';
import { ControllerDto } from 'src/app/models/dto/controller-list-dto.model';
import { formatDate } from '@angular/common';
import { FilterContractDto } from 'src/app/models/dto/filters/filter-contract-dto.model';

@Component({
    selector: 'app-table-filter',
    templateUrl: './table-filter.component.html',
    styleUrls: ['./table-filter.component.scss']
})
export class TableFilterComponent implements OnInit, AfterViewInit {

    @Input() readonly filterData: FilterContractDto;

    @Output() readonly filterProps: EventEmitter<FilterContractDto> = new EventEmitter();
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
    public startDates: string[] = [];
    public endDates: string[] = [];
    public codes: string[] = [];
    public controllerList: ControllerDto[] = [];

    public namesLen: number;
    public startDatesLen: number;
    public endDatesLen: number;
    public codesLen: number;
    public controllersLen: number;

    constructor(
        private formBuilder: FormBuilder,
        private controllerService: ControllerListService,

    ) { }

    ngOnInit(): void {
        this.formGroupControl = this.formBuilder.group({
            name: ["", []],
            startDate: ["", []],
            endDate: ["", []],
            code: ["", []],
            controllers: [[], []],
        });

        this.controllerService.getControllers().subscribe((controllers: ControllerDto[]) => {
            this.controllerList = controllers;

            let controllerFilter: ControllerDto[] = [];

            this.filterData.controllers?.forEach((id: string) => {
                controllerFilter.push(...this.controllerList.filter((record: ControllerDto) => {
                    return record.id.toString() === id;
                }));
            });

            this.formGroupControl.patchValue({
                controllers: controllerFilter
            });
            this.controllersLen = this.filterData.controllers?.length || 0;

            this.names = this.filterData.names ? [...this.filterData.names] : [];
            this.namesLen = this.names.length;

            this.startDates = this.filterData.startDates ? [...this.filterData.startDates] : [];
            this.startDatesLen = this.startDates.length;

            this.endDates = this.filterData.endDates ? [...this.filterData.endDates] : [];
            this.endDatesLen = this.endDates.length;

            this.codes = this.filterData.codes ? [...this.filterData.codes] : [];
            this.codesLen = this.codes.length;

            this.filterCount.emit(this.namesLen + this.startDatesLen + this.endDatesLen + this.codesLen + this.controllersLen);

            if (this.names.length > 0) {
                this.panel1.toggle();
            }
            if (this.startDates.length + this.endDates.length > 0) {
                this.panel2.toggle();
            }
            if (this.codes.length > 0) {
                this.panel3.toggle();
            }
            if (this.formGroupControl.controls.controllers.value.length > 0) {
                this.panel4.toggle();
            }

        });
    }


    ngAfterViewInit(): void {

    }

    public addData(event: any): void {
        let value: string;

        try {
            value = event.value.toDateString();
        }
        catch (err) {
            return
        }

        if (value) {
            switch(event.targetElement.id) {
                case 'startDate': {
                    this.startDates.push(formatDate(value, "dd.MM.yyyy", 'en-US'));
                    setTimeout(() => this.formGroupControl.controls.startDate.patchValue(""))

                    break;
                }
                case 'endDate': {
                    this.endDates.push(formatDate(value, "dd.MM.yyyy", 'en-US'));
                    setTimeout(() => this.formGroupControl.controls.endDate.patchValue(""))
                    break;
                }
            }
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
                case 'startDate': {
                    this.startDates.push(value);
                    this.formGroupControl.controls.startDate.patchValue("");
                    break;
                }
                case 'endDate': {
                    this.endDates.push(value);
                    this.formGroupControl.controls.endDate.patchValue("");
                    break;
                }
                case 'code': {
                    this.codes.push(value);
                    this.formGroupControl.controls.code.patchValue("");
                    break;
                }
            }
        }
    }

    public addByGroupControl(): void {
        const data = this.formGroupControl.value;

        for (const field in data) {
            if (typeof data[field] === 'string' && data[field].trim().length > 0
                && field !== 'startDate' && field !== 'endDate') {
                switch (field) {
                    case 'name': {
                        this.names.push(data[field]);
                        break;
                    }
                    case 'code': {
                        this.codes.push(data[field]);
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
            case 'startDate': {
                const index = this.startDates.indexOf(toRemove);

                if (index < this.startDatesLen) {
                    this.startDatesLen --;
                }

                if (index >= 0) {
                    this.startDates.splice(index, 1);
                }
                break;
            }
            case 'endDate': {
                const index = this.endDates.indexOf(toRemove);

                if (index < this.endDatesLen) {
                    this.endDatesLen --;
                }

                if (index >= 0) {
                    this.endDates.splice(index, 1);
                }
                break;
            }
            case 'code': {
                const index = this.codes.indexOf(toRemove);

                if (index < this.codesLen) {
                    this.codesLen --;
                }

                if (index >= 0) {
                    this.codes.splice(index, 1);
                }
                break;
            }
            case 'controller': {
                const controllers: ControllerDto[] = this.formGroupControl.controls.controllers.value;
                const index = controllers.findIndex(element => element.id === toRemove.id);

                if (index < this.controllersLen) {
                    this.controllersLen --;
                }

                if (index >= 0) {
                    controllers.splice(index, 1);
                }

                this.formGroupControl.controls.controllers.setValue([...controllers]);
                break;
            }
        }
    }

    public clearField(field: string): void {
        if (field === 'controllers') {
            this.formGroupControl.patchValue({
                [field]: []
            });

            this.controllersLen = 0;
        } else {
            this.formGroupControl.patchValue({
                [field]: ''
            });

            switch (field) {
                case 'name': {
                    this.names.length = 0;
                    this.namesLen = 0;
                    break;
                }
                case 'startDate': {
                    this.startDates.length = 0;
                    this.startDatesLen = 0;
                    break;
                }
                case 'endDate': {
                    this.endDates.length = 0;
                    this.endDatesLen = 0;
                    break;
                }
                case 'code': {
                    this.codes.length = 0;
                    this.codesLen = 0;
                    break;
                }
            };

        }
    }

    public applyFilters(state: string): void {

        this.addByGroupControl();

        const controllers: string[] = [];
        const controllersControl: ControllerDto[] = this.formGroupControl.controls.controllers.value as ControllerDto[];

        controllersControl.forEach(elem => {
            controllers.push(elem.id.toString());
        })

        this.namesLen = this.names.length;
        this.startDatesLen = this.startDates.length;
        this.endDatesLen = this.endDates.length;
        this.codesLen = this.codes.length;
        this.controllersLen = controllers.length;

        this.filterCount.emit(this.namesLen + this.startDatesLen + this.endDatesLen + this.codesLen + this.controllersLen);

        this.filterProps.emit({
            names: this.names.length ? this.names : undefined,
            startDates: this.startDates.length ? this.startDates : undefined,
            endDates: this.endDates.length ? this.endDates : undefined,
            codes: this.codes.length ? this.codes : undefined,
            controllers: controllers.length ? controllers : undefined,
            state
        });
    }

    public togglePanel(panel: MatExpansionPanel) {
       panel.expanded = !panel.expanded;
    }
}
