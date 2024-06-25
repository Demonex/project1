import { Component, EventEmitter, OnInit, Output, Input, AfterViewInit } from '@angular/core';
import { PanelDto } from 'src/app/models/dto/panel-list-dto.model';
import { ModalDataIn, DataValidate } from 'src/app/modules/core/models/modal-form.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({

    templateUrl: './create-form.component.html',
    styleUrls: ['./create-form.component.scss']
})
export class CreateFormComponent implements OnInit, AfterViewInit {

    @Input() data: ModalDataIn<PanelDto>;
    @Output() dataCreated: EventEmitter<DataValidate<PanelDto>> = new EventEmitter();

    public curData: PanelDto;
    public types = ["Моно", "Поли", "Умный"];

    public formGroupControl: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
    ) { }

    ngOnInit(): void {
        this.curData = this.data?.row || {};

        this.formGroupControl = this.formBuilder.group({
            name: [this.curData.name, [Validators.required]],
            type: [this.curData.type, [Validators.required]],
            watt: [this.curData.watt, [Validators.required]],
            volt: [this.curData.volt, [Validators.required]],
            voltoc: [this.curData.voltoc, [Validators.required]],
            amper: [this.curData.amper, [Validators.required]],
            eff: [this.curData.eff, [Validators.required]],
            size: [this.curData.size, [Validators.required]],
            price: [this.curData.price, [Validators.required]],
        });

        const retValue: DataValidate<PanelDto> = {
            data: this.curData,
            valid: this.formGroupControl.valid
        }
        this.dataCreated.emit(retValue);
    }

    ngAfterViewInit() {
        this.formGroupControl.valueChanges.subscribe((data: PanelDto) => {
            this.curData = Object.assign({}, this.curData, data);

            const retValue: DataValidate<PanelDto> = {
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
