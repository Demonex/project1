import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { ContractListService } from 'src/app/services/contract-list.service';
import { ContractDto } from 'src/app/models/dto/contract-list-dto.model';
import { formatDate } from '@angular/common';
import { FilterSupplyDto } from 'src/app/models/dto/filters/filter-supply-dto.model';

@Component({
    selector: 'app-table-filter',
    templateUrl: './table-filter.component.html',
    styleUrls: ['./table-filter.component.scss']
})
export class TableFilterComponent implements OnInit, AfterViewInit {

    @Input() readonly filterData: FilterSupplyDto;

    @Output() readonly filterProps: EventEmitter<FilterSupplyDto> = new EventEmitter();
    @Output() readonly filterCount: EventEmitter<number> = new EventEmitter();

    @ViewChild(MatAccordion) accordion: MatAccordion;
    @ViewChild('panel1') panel1: MatExpansionPanel;
    @ViewChild('panel2') panel2: MatExpansionPanel;
    @ViewChild('panel3') panel3: MatExpansionPanel;

    public readonly separatorKeysCodes = [ENTER, COMMA];

    public formGroupControl: FormGroup;
    public filterCollapsed: boolean = true;

    public names: string[] = [];
    public startDates: string[] = [];
    public endDates: string[] = [];
    public contractList: ContractDto[] = [];

    public namesLen: number;
    public startDatesLen: number;
    public endDatesLen: number;
    public contractsLen: number;

    constructor(
        private formBuilder: FormBuilder,
        private contractService: ContractListService,

    ) { }

    ngOnInit(): void {
        this.formGroupControl = this.formBuilder.group({
            name: ["", []],
            startDate: ["", []],
            endDate: ["", []],
            contracts: [[], []],
        });

        this.contractService.getContracts().subscribe((contracts: ContractDto[]) => {
            this.contractList = contracts;

            let contractFilter: ContractDto[] = [];

            this.filterData.contracts?.forEach((id: string) => {
                contractFilter.push(...this.contractList.filter((record: ContractDto) => {
                    return record.id.toString() === id;
                }));
            });

            this.formGroupControl.patchValue({
                contracts: contractFilter
            });
            this.contractsLen = this.filterData.contracts?.length || 0;

            this.names = this.filterData.names ? [...this.filterData.names] : [];
            this.namesLen = this.names.length;

            this.startDates = this.filterData.startDates ? [...this.filterData.startDates] : [];
            this.startDatesLen = this.startDates.length;

            this.endDates = this.filterData.endDates ? [...this.filterData.endDates] : [];
            this.endDatesLen = this.endDates.length;

            this.filterCount.emit(this.namesLen + this.startDatesLen + this.endDatesLen);

            if (this.names.length > 0) {
                this.panel1.toggle();
            }
            if (this.startDates.length + this.endDates.length > 0) {
                this.panel2.toggle();
            }
            if (this.formGroupControl.controls.contracts.value.length > 0) {
                this.panel3.toggle();
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
                    case 'startDate': {
                        this.startDates.push(data[field]);
                        break;
                    }
                    case 'endDate': {
                        this.endDates.push(data[field]);
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
            case 'contract': {
                const contracts: ContractDto[] = this.formGroupControl.controls.contracts.value;
                const index = contracts.findIndex(element => element.id === toRemove.id);

                if (index < this.contractsLen) {
                    this.contractsLen --;
                }

                if (index >= 0) {
                    contracts.splice(index, 1);
                }

                this.formGroupControl.controls.contracts.setValue([...contracts]);
                break;
            }
        }
    }

    public clearField(field: string): void {
        if (field === 'contracts') {
            this.formGroupControl.patchValue({
                [field]: []
            });

            this.contractsLen = 0;
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
            };

        }
    }

    public applyFilters(state: string): void {

        this.addByGroupControl();

        const contracts: string[] = [];
        const contractsControl: ContractDto[] = this.formGroupControl.controls.contracts.value as ContractDto[];

        contractsControl.forEach(elem => {
            contracts.push(elem.id.toString());
        })

        this.namesLen = this.names.length;
        this.startDatesLen = this.startDates.length;
        this.endDatesLen = this.endDates.length;
        this.contractsLen = contracts.length;

        this.filterCount.emit(this.namesLen + this.startDatesLen + this.endDatesLen + this.contractsLen);

        this.filterProps.emit({
            names: this.names.length ? this.names : undefined,
            startDates: this.startDates.length ? this.startDates : undefined,
            endDates: this.endDates.length ? this.endDates : undefined,
            contracts: contracts.length ? contracts : undefined,
            state
        });
    }

    public togglePanel(panel: MatExpansionPanel) {
       panel.expanded = !panel.expanded;
    }
}
