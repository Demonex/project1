import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { ControllerDto } from 'src/app/models/dto/controller-list-dto.model';
import { ContractDto } from 'src/app/models/dto/contract-list-dto.model';
import { ControllerListService } from 'src/app/services/controller-list.service';
import { ModalDataIn, DataValidate } from 'src/app/modules/core/models/modal-form.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({

    templateUrl: './create-form.component.html',
    styleUrls: ['./create-form.component.scss']
})
export class CreateFormComponent implements OnInit {

    @Input() data: ModalDataIn<ContractDto>;
    @Output() dataCreated: EventEmitter<DataValidate<ContractDto>> = new EventEmitter();

    public controllerList: ControllerDto[];
    public curData: ContractDto;

    public formGroupControl: FormGroup;

    constructor(
        private controllerService: ControllerListService,
        private formBuilder: FormBuilder,
    ) { }

    ngOnInit(): void {
        this.controllerService.getControllers().subscribe(
            (data) => this.controllerList = data
        );

        this.curData = this.data?.row || {};

        this.formGroupControl = this.formBuilder.group({
            name: [this.curData.name, [Validators.required]],
            code: [this.curData.code, [Validators.required]],
            startDate: [this.curData.startDate ? formatDate(this.curData.startDate, "yyyy-MM-dd", "en-US") : null, [Validators.required]],
            endDate: [this.curData.endDate ? formatDate(this.curData.endDate, "yyyy-MM-dd", "en-US") : null, [Validators.required]],
            controllerId: [this.curData.controllerId, [Validators.required]]
        });

        const retValue: DataValidate<ContractDto> = {
            data: this.curData,
            valid: this.formGroupControl.valid
        }
        this.dataCreated.emit(retValue);
    }

    ngAfterViewInit() {
        this.formGroupControl.valueChanges.subscribe((data: ContractDto) => {
            this.curData = Object.assign({}, this.curData, data);

            const retValue: DataValidate<ContractDto> = {
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
