import { Component, EventEmitter, OnInit, Output, Input, AfterViewInit } from '@angular/core';
import { DeviceDto } from 'src/app/models/dto/device-list-dto.model';
import { SupplyListService } from 'src/app/services/supply-list.service';
import { DeviceTypeListService } from 'src/app/services/device-type-list.service';
import { SupplyDto } from 'src/app/models/dto/supply-list-dto.model';
import { DeviceTypeDto } from 'src/app/models/dto/device-type-list-dto.model';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ModalDataIn, DataValidate } from '../../core/models/modal-form.model';

@Component({

    templateUrl: './create-form.component.html',
    styleUrls: ['./create-form.component.scss']
})
export class CreateFormComponent implements OnInit, AfterViewInit {

    @Input() data: ModalDataIn<DeviceDto>;
    @Output() dataCreated: EventEmitter<DataValidate<DeviceDto>> = new EventEmitter();

    public supplyList: SupplyDto[];
    public deviceTypeList: DeviceTypeDto[];
    public curData: DeviceDto;

    public formGroupControl: FormGroup;

    constructor(
        private supplyService: SupplyListService,
        private deviceTypeService: DeviceTypeListService,
        private formBuilder: FormBuilder,
    ) { }

    ngOnInit(): void {
        this.supplyService.getSupplies().subscribe(
            (data: SupplyDto[]) => this.supplyList = data
        );

        this.deviceTypeService.getDeviceTypes().subscribe(
            (data: DeviceTypeDto[]) => this.deviceTypeList = data
        );

        this.curData = this.data?.row || {};

        this.formGroupControl = this.formBuilder.group({
            name: [this.curData.name, [Validators.required]],
            orderCode: [this.curData.orderCode, [Validators.required]],
            comment: [this.curData.comment, []],
            supplyId: [this.curData.supplyId, [Validators.required]],
            deviceTypeId: [this.curData.deviceTypeId, [Validators.required]]
        });

        const retValue: DataValidate<DeviceDto> = {
            data: this.curData,
            valid: this.formGroupControl.valid
        }
        this.dataCreated.emit(retValue);
    }

    ngAfterViewInit() {
        this.formGroupControl.valueChanges.subscribe((data: DeviceDto) => {
            this.curData = Object.assign({}, this.curData, data);

            const retValue: DataValidate<DeviceDto> = {
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
