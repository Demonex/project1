import { Component, EventEmitter, OnInit, Output, Input, AfterViewInit } from '@angular/core';
import { ControllerDto } from 'src/app/models/dto/controller-list-dto.model';
import { DeviceTypeDto } from 'src/app/models/dto/device-type-list-dto.model';
import { ControllerListService } from 'src/app/services/controller-list.service';
import { ModalDataIn, DataValidate } from 'src/app/modules/core/models/modal-form.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({

    templateUrl: './create-form.component.html',
    styleUrls: ['./create-form.component.scss']
})
export class CreateFormComponent implements OnInit, AfterViewInit {

    @Input() data: ModalDataIn<DeviceTypeDto>;
    @Output() dataCreated: EventEmitter<DataValidate<DeviceTypeDto>> = new EventEmitter();

    public controllerList: ControllerDto[];
    public curData: DeviceTypeDto;

    public formGroupControl: FormGroup;

    constructor(
        private controllerService: ControllerListService,
        private formBuilder: FormBuilder,
    ) { }

    ngOnInit(): void {
        this.controllerService.getControllers().subscribe(
            (data: ControllerDto[]) => this.controllerList = data
        );

        this.curData = this.data?.row || {};

        this.formGroupControl = this.formBuilder.group({
            name: [this.curData.name, [Validators.required]],
            supplyCodeName: [this.curData.supplyCodeName, [Validators.required]],
            controllerId: [this.curData.controllerId, [Validators.required]],
        });

        const retValue: DataValidate<DeviceTypeDto> = {
            data: this.curData,
            valid: this.formGroupControl.valid
        }
        this.dataCreated.emit(retValue);
    }

    ngAfterViewInit() {
        this.formGroupControl.valueChanges.subscribe((data: DeviceTypeDto) => {
            this.curData = Object.assign({}, this.curData, data);

            const retValue: DataValidate<DeviceTypeDto> = {
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
