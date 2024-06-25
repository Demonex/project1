import { Component, EventEmitter, OnInit, Output, Input, AfterViewInit } from '@angular/core';
import { SupplyDto } from 'src/app/models/dto/supply-list-dto.model';
import { ContractListService } from 'src/app/services/contract-list.service';
import { ContractDto } from 'src/app/models/dto/contract-list-dto.model';
import { ModalDataIn, DataValidate } from 'src/app/modules/core/models/modal-form.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';

@Component({

    templateUrl: './create-form.component.html',
    styleUrls: ['./create-form.component.scss']
})
export class CreateFormComponent implements OnInit, AfterViewInit {

    @Input() data: ModalDataIn<SupplyDto>;
    @Output() dataCreated: EventEmitter<DataValidate<SupplyDto>> = new EventEmitter();

    public contractList: ContractDto[];
    public curData: SupplyDto;

    public formGroupControl: FormGroup;

    constructor(
        private contractService: ContractListService,
        private formBuilder: FormBuilder,
    ) { }

    ngOnInit(): void {
        this.contractService.getContracts().subscribe(
            (data: ContractDto[]) => this.contractList = data
        );

        this.curData = this.data?.row || {};

        this.formGroupControl = this.formBuilder.group({
            name: [this.curData.name, [Validators.required]],
            startDate: [this.curData.startDate ? formatDate(this.curData.startDate, "yyyy-MM-dd", "en-US") : null, [Validators.required]],
            endDate: [this.curData.endDate ? formatDate(this.curData.endDate, "yyyy-MM-dd", "en-US") : null, [Validators.required]],
            contractId: [this.curData.contractId, [Validators.required]],
        });

        const retValue: DataValidate<SupplyDto> = {
            data: this.curData,
            valid: this.formGroupControl.valid
        }
        this.dataCreated.emit(retValue);
    }

    ngAfterViewInit() {
        this.formGroupControl.valueChanges.subscribe((data: SupplyDto) => {
            this.curData = Object.assign({}, this.curData, data);

            const retValue: DataValidate<SupplyDto> = {
                data: this.curData,
                valid: this.formGroupControl.valid
            }
            this.dataCreated.emit(retValue);
        })
    }

    public clearField(field: string) {
        this.formGroupControl.patchValue({
            [field]: ''
        });
        this.curData[field] = '';
    }
}
