import { Component, EventEmitter, OnInit, Output, Input, AfterViewInit } from '@angular/core';
import { OptimizationDto } from 'src/app/models/dto/optimization-dto.model';
import { ModalDataIn, DataValidate } from 'src/app/modules/core/models/modal-form.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({

    templateUrl: './create-form.component.html',
    styleUrls: ['./create-form.component.scss']
})
export class CreateFormComponent implements OnInit, AfterViewInit {

    @Input() data: ModalDataIn<OptimizationDto>;
    @Output() dataCreated: EventEmitter<DataValidate<OptimizationDto>> = new EventEmitter();

    public curData: OptimizationDto;

    public formGroupControl: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
    ) { }

    ngOnInit(): void {
        this.curData = this.data?.row || {};

        this.formGroupControl = this.formBuilder.group({
            name: [this.curData.name, [Validators.required]],
            startTime: [this.curData.startTime, [Validators.required]],
            duration: [this.curData.duration, [Validators.required]],
            watt: [this.curData.watt, [Validators.required]],
        });

        const retValue: DataValidate<OptimizationDto> = {
            data: this.curData,
            valid: this.formGroupControl.valid
        }
        this.dataCreated.emit(retValue);
    }

    ngAfterViewInit() {
        this.formGroupControl.valueChanges.subscribe((data: OptimizationDto) => {
            this.curData = Object.assign({}, this.curData, data);

            const retValue: DataValidate<OptimizationDto> = {
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
