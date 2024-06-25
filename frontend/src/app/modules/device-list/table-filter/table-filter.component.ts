import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { COMMA, E, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { DeviceTypeListService } from 'src/app/services/device-type-list.service';
import { DeviceTypeDto } from 'src/app/models/dto/device-type-list-dto.model';
import { SupplyListService } from 'src/app/services/supply-list.service';
import { SupplyDto } from 'src/app/models/dto/supply-list-dto.model';
import { FilterDeviceDto } from 'src/app/models/dto/filters/filter-device-dto.model';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-table-filter',
    templateUrl: './table-filter.component.html',
    styleUrls: ['./table-filter.component.scss']
})
export class TableFilterComponent implements OnInit, AfterViewInit {

    @Input() readonly filterData: FilterDeviceDto;

    @Output() readonly filterProps: EventEmitter<FilterDeviceDto> = new EventEmitter();
    @Output() readonly filterCount: EventEmitter<number> = new EventEmitter();

    @ViewChild(MatAccordion) accordion: MatAccordion;
    @ViewChild('panel1') panel1: MatExpansionPanel;
    @ViewChild('panel2') panel2: MatExpansionPanel;
    @ViewChild('panel3') panel3: MatExpansionPanel;
    @ViewChild('panel4') panel4: MatExpansionPanel;
    @ViewChild('panel5') panel5: MatExpansionPanel;

    public readonly separatorKeysCodes = [ENTER, COMMA];

    public formGroupControl: FormGroup;
    public filterCollapsed: boolean = true;

    public names: string[] = [];
    public orderCodes: string[] = [];
    public comments: string[] = [];
    public deviceTypeList: DeviceTypeDto[] = [];
    public supplyList: SupplyDto[] = [];

    public namesLen: number;
    public orderCodesLen: number;
    public commentsLen: number;
    public deviceTypesLen: number;
    public suppliesLen: number;

    constructor(
        private formBuilder: FormBuilder,
        private deviceTypeService: DeviceTypeListService,
        private supplyService: SupplyListService,

    ) { }

    ngOnInit(): void {
        this.formGroupControl = this.formBuilder.group({
            name: ["", []],
            orderCode: ["", []],
            comment: ["", []],
            deviceTypes: [[], []],
            supplies: [[], []],
        });

        forkJoin([
            this.deviceTypeService.getDeviceTypes(),
            this.supplyService.getSupplies()]
        ).subscribe(([deviceTypes, supplies]) => {

            this.deviceTypeList = deviceTypes;

            let deviceTypeFilter: DeviceTypeDto[] = [];

            this.filterData.deviceTypes?.forEach((id: string) => {
                deviceTypeFilter.push(...this.deviceTypeList.filter((record: DeviceTypeDto) => {
                    return record.id.toString() === id;
                }));
            });

            this.formGroupControl.patchValue({
                deviceTypes: deviceTypeFilter
            });
            this.deviceTypesLen = this.filterData.deviceTypes?.length || 0;

            if (this.formGroupControl.controls.deviceTypes.value.length > 0) {
                this.panel5.toggle();
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
                this.panel4.toggle();
            }

            this.names = this.filterData.names ? [...this.filterData.names] : [];
            this.namesLen = this.names.length;

            this.orderCodes = this.filterData.orderCodes ? [...this.filterData.orderCodes] : [];
            this.orderCodesLen = this.orderCodes.length;

            this.comments = this.filterData.comments ? [...this.filterData.comments] : [];
            this.commentsLen = this.comments.length;

            if (this.names.length > 0) {
                this.panel1.toggle();
            }
            if (this.orderCodes.length > 0) {
                this.panel2.toggle();
            }
            if (this.comments.length > 0) {
                this.panel3.toggle();
            }

            this.filterCount.emit(this.namesLen + this.orderCodesLen + this.commentsLen + this.deviceTypesLen + this.suppliesLen);
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
                case 'orderCode': {
                    this.orderCodes.push(value);
                    this.formGroupControl.controls.orderCode.patchValue("");
                    break;
                }
                case 'comment': {
                    this.comments.push(value);
                    this.formGroupControl.controls.comment.patchValue("");
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
                    case 'orderCode': {
                        this.orderCodes.push(data[field]);
                        break;
                    }
                    case 'comment': {
                        this.comments.push(data[field]);
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
            case 'orderCode': {
                const index = this.orderCodes.indexOf(toRemove);

                if (index < this.orderCodesLen) {
                    this.orderCodesLen --;
                }

                if (index >= 0) {
                    this.orderCodes.splice(index, 1);
                }
                break;
            }
            case 'comment': {
                const index = this.comments.indexOf(toRemove);

                if (index < this.commentsLen) {
                    this.commentsLen --;
                }

                if (index >= 0) {
                    this.comments.splice(index, 1);
                }
                break;
            }
            case 'deviceType': {
                const deviceTypes: DeviceTypeDto[] = this.formGroupControl.controls.deviceTypes.value;
                const index = deviceTypes.findIndex(element => element.id === toRemove.id);

                if (index < this.deviceTypesLen) {
                    this.deviceTypesLen --;
                }

                if (index >= 0) {
                    deviceTypes.splice(index, 1);
                }

                this.formGroupControl.controls.deviceTypes.setValue([...deviceTypes]);
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
        if (field === 'deviceTypes' || field === 'supply') {
            this.formGroupControl.patchValue({
                [field]: []
            });

            if (field === 'deviceTypes') {
                this.deviceTypesLen = 0;
            } else {
                this.suppliesLen = 0;
            }
        } else {
            this.formGroupControl.patchValue({
                [field]: ''
            });

            if (field === 'name') {
                this.names.length = 0;
                this.namesLen = 0;
            }
            else if (field === 'orderCode') {
                this.orderCodes.length = 0;
                this.orderCodesLen = 0;
            }
            else {
                this.comments.length = 0;
                this.commentsLen = 0;
            }
        }
    }

    public applyFilters(state: string): void {

        this.addByGroupControl();

        const deviceTypes: string[] = [];
        const deviceTypesControl: DeviceTypeDto[] = this.formGroupControl.controls.deviceTypes.value as DeviceTypeDto[];

        deviceTypesControl.forEach(elem => {
            deviceTypes.push(elem.id.toString());
        })

        const supplies: string[] = [];
        const suppliesControl: SupplyDto[] = this.formGroupControl.controls.supplies.value as SupplyDto[];

        suppliesControl.forEach(elem => {
            supplies.push(elem.id.toString());
        })

        this.namesLen = this.names.length;
        this.orderCodesLen = this.orderCodes.length;
        this.commentsLen = this.comments.length;
        this.deviceTypesLen = deviceTypes.length;
        this.suppliesLen = supplies.length;

        this.filterCount.emit(this.namesLen + this.orderCodesLen + this.commentsLen + this.deviceTypesLen + this.suppliesLen);

        this.filterProps.emit({
            names: this.names.length ? this.names : undefined,
            orderCodes: this.orderCodes ? this.orderCodes : undefined,
            comments: this.comments ? this.comments : undefined,
            deviceTypes: deviceTypes.length ? deviceTypes : undefined,
            supplies: supplies.length ? supplies : undefined,
            state
        });
    }

    public togglePanel(panel: MatExpansionPanel) {
       panel.expanded = !panel.expanded;
    }
}
