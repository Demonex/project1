import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { InvertorDto } from 'src/app/models/dto/invertor-list-dto.model';
import { ModalDataIn, DataValidate } from 'src/app/modules/core/models/modal-form.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({

    templateUrl: './create-form.component.html',
    styleUrls: ['./create-form.component.scss']
})
export class CreateFormComponent implements OnInit {

    @Input() data: ModalDataIn<InvertorDto>;
    @Output() dataCreated: EventEmitter<DataValidate<InvertorDto>> = new EventEmitter();

    public curData: InvertorDto;

    public formGroupControl: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
    ) { }

    ngOnInit(): void {

        this.curData = this.data?.row || {};

        this.formGroupControl = this.formBuilder.group({
            name: [this.curData.name, [Validators.required]],
            watt: [this.curData.watt, [Validators.required]],
            volt: [this.curData.volt, [Validators.required]],
            price: [this.curData.price, [Validators.required]],
        });

        const retValue: DataValidate<InvertorDto> = {
            data: this.curData,
            valid: this.formGroupControl.valid
        }
        this.dataCreated.emit(retValue);
    }

    ngAfterViewInit() {
        this.formGroupControl.valueChanges.subscribe((data: InvertorDto) => {
            this.curData = Object.assign({}, this.curData, data);

            const retValue: DataValidate<InvertorDto> = {
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
