import { Component, EventEmitter, OnInit, Output, Input, AfterViewInit } from '@angular/core';
import { BatteryDto } from 'src/app/models/dto/battery-list-dto.model';
import { ModalDataIn, DataValidate } from 'src/app/modules/core/models/modal-form.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({

    templateUrl: './create-form.component.html',
    styleUrls: ['./create-form.component.scss']
})
export class CreateFormComponent implements OnInit, AfterViewInit {

    @Input() data: ModalDataIn<BatteryDto>;
    @Output() dataCreated: EventEmitter<DataValidate<BatteryDto>> = new EventEmitter();

    public curData: BatteryDto;
    public types = ["Авто", "GEL", "AGM", "LFP"]

    public formGroupControl: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
    ) { }

    ngOnInit(): void {
        this.curData = this.data?.row || {};

        this.formGroupControl = this.formBuilder.group({
            name: [this.curData.name, [Validators.required]],
            type: [this.curData.type, [Validators.required]],
            cap: [this.curData.cap, [Validators.required]],
            volt: [this.curData.volt, [Validators.required]],
            bound: [this.curData.bound, [Validators.required]],
            price: [this.curData.price, [Validators.required]],
        });

        const retValue: DataValidate<BatteryDto> = {
            data: this.curData,
            valid: this.formGroupControl.valid
        }
        this.dataCreated.emit(retValue);
    }

    ngAfterViewInit() {
        this.formGroupControl.valueChanges.subscribe((data: BatteryDto) => {
            this.curData = Object.assign({}, this.curData, data);

            const retValue: DataValidate<BatteryDto> = {
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
