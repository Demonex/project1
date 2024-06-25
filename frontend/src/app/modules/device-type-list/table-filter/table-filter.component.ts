import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { ControllerListService } from 'src/app/services/controller-list.service';
import { ControllerDto } from 'src/app/models/dto/controller-list-dto.model';
import { FilterDeviceTypeDto } from 'src/app/models/dto/filters/filter-device-type-dto.model';

@Component({
    selector: 'app-table-filter',
    templateUrl: './table-filter.component.html',
    styleUrls: ['./table-filter.component.scss']
})
export class TableFilterComponent implements OnInit, AfterViewInit {

    @Input() readonly filterData: FilterDeviceTypeDto;

    @Output() readonly filterProps: EventEmitter<FilterDeviceTypeDto> = new EventEmitter();
    @Output() readonly filterCount: EventEmitter<number> = new EventEmitter();

    @ViewChild(MatAccordion) accordion: MatAccordion;
    @ViewChild('panel1') panel1: MatExpansionPanel;
    @ViewChild('panel2') panel2: MatExpansionPanel;
    @ViewChild('panel3') panel3: MatExpansionPanel;

    public readonly separatorKeysCodes = [ENTER, COMMA];

    public formGroupControl: FormGroup;
    public filterCollapsed: boolean = true;

    public names: string[] = [];
    public supplyCodeNames: string[] = [];
    public controllerList: ControllerDto[] = [];

    public namesLen: number;
    public supplyCodeNamesLen: number;
    public controllersLen: number;

    constructor(
        private formBuilder: FormBuilder,
        private controllerService: ControllerListService,

    ) { }

    ngOnInit(): void {
        this.formGroupControl = this.formBuilder.group({
            name: ["", []],
            supplyCodeName: ["", []],
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

            this.supplyCodeNames = this.filterData.supplyCodeNames ? [...this.filterData.supplyCodeNames] : [];
            this.supplyCodeNamesLen = this.supplyCodeNames.length;

            this.filterCount.emit(this.namesLen + this.supplyCodeNamesLen + this.controllersLen);

            if (this.names.length > 0) {
                this.panel1.toggle();
            }
            if (this.supplyCodeNames.length > 0) {
                this.panel2.toggle();
            }
            if (this.formGroupControl.controls.controllers.value.length > 0) {
                this.panel3.toggle();
            }
        });
    }

    ngAfterViewInit(): void {

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
                case 'supplyCodeName': {
                    this.supplyCodeNames.push(value);
                    this.formGroupControl.controls.supplyCodeName.patchValue("");
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
                    case 'supplyCodeName': {
                        this.supplyCodeNames.push(data[field]);
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
            case 'supplyCodeName': {
                const index = this.supplyCodeNames.indexOf(toRemove);

                if (index < this.supplyCodeNamesLen) {
                    this.supplyCodeNamesLen --;
                }

                if (index >= 0) {
                    this.supplyCodeNames.splice(index, 1);
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

            if (field === 'name') {
                this.names.length = 0;
                this.namesLen = 0;
            } else {
                this.supplyCodeNames.length = 0;
                this.supplyCodeNamesLen = 0;
            }
        }

    }

    public applyFilters(state: string): void {

        this.addByGroupControl();

        const controllers: string[] = [];
        const controllersControl: ControllerDto[] = this.formGroupControl.controls.controllers.value as ControllerDto[];

        controllersControl.forEach(elem => {
            controllers.push(elem.id.toString());
        });

        this.namesLen = this.names.length;
        this.supplyCodeNamesLen = this.supplyCodeNames.length;
        this.controllersLen = controllers.length;

        this.filterCount.emit(this.namesLen + this.supplyCodeNamesLen + this.controllersLen);

        this.filterProps.emit({
            names: this.names.length ? this.names : undefined,
            supplyCodeNames: this.supplyCodeNames.length ? this.supplyCodeNames : undefined,
            controllers: controllers.length ? controllers : undefined,
            state
        });
    }

    public togglePanel(panel: MatExpansionPanel) {
       panel.expanded = !panel.expanded;
    }
}
