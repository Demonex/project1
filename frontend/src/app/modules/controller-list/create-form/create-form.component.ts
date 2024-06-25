import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { ControllerDto } from 'src/app/models/dto/controller-list-dto.model';
import { ModalDataIn, DataValidate } from 'src/app/modules/core/models/modal-form.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({

    templateUrl: './create-form.component.html',
    styleUrls: ['./create-form.component.scss']
})
export class CreateFormComponent implements OnInit {

    @Input() data: ModalDataIn<ControllerDto>;
    @Output() dataCreated: EventEmitter<DataValidate<ControllerDto>> = new EventEmitter();

    public curData: ControllerDto;
    public types = ['PWM', "MPPT"]
    public voltmods = ['12', '12/24', '12/24/36/48']

    public formGroupControl: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
    ) { }

    ngOnInit(): void {

        this.curData = this.data?.row || {};

        this.formGroupControl = this.formBuilder.group({
            name: [this.curData.name, [Validators.required]],
            type: [this.curData.type, [Validators.required]],
            voltmod: [this.curData.voltmod, [Validators.required]],
            mwatt: [this.curData.mwatt, [Validators.required]],
            mvolt: [this.curData.mvolt, [Validators.required]],
            mamper: [this.curData.mamper, [Validators.required]],
            price: [this.curData.price, [Validators.required]],
        });

        const retValue: DataValidate<ControllerDto> = {
            data: this.curData,
            valid: this.formGroupControl.valid
        }
        this.dataCreated.emit(retValue);
    }

    ngAfterViewInit() {
        this.formGroupControl.valueChanges.subscribe((data: ControllerDto) => {
            this.curData = Object.assign({}, this.curData, data);

            const retValue: DataValidate<ControllerDto> = {
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
