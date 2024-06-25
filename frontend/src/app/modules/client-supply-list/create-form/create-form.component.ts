import { Component, EventEmitter, OnInit, Output, Input, AfterViewInit } from '@angular/core';
import { BatterySupplyDto } from 'src/app/models/dto/client-supply-list-dto.model';
import { BatteryListService } from 'src/app/services/battery-list.service';
import { SupplyListService } from 'src/app/services/supply-list.service';
import { BatteryDto } from 'src/app/models/dto/battery-list-dto.model';
import { SupplyDto } from 'src/app/models/dto/supply-list-dto.model';
import { ModalDataIn, DataValidate } from 'src/app/modules/core/models/modal-form.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({

    templateUrl: './create-form.component.html',
    styleUrls: ['./create-form.component.scss']
})
export class CreateFormComponent implements OnInit, AfterViewInit {

    @Input() data: ModalDataIn<BatterySupplyDto>;
    @Output() dataCreated: EventEmitter<DataValidate<BatterySupplyDto>> = new EventEmitter();

    public curData: BatterySupplyDto;
    public batteryList: BatteryDto[];
    public supplyList: SupplyDto[];

    public formGroupControl: FormGroup;

    constructor(
        private batteryListService: BatteryListService,
        private supplyListService: SupplyListService,
        private formBuilder: FormBuilder,
    ) { }

    ngOnInit(): void {
        this.batteryListService.getBatteries().subscribe(
            (data: BatteryDto[]) => this.batteryList = data,
            (err) => console.log(err)
        )

        this.supplyListService.getSupplies().subscribe(
            (data: SupplyDto[]) => this.supplyList = data,
            (err) => console.log(err)
        )

        this.curData = this.data?.row || {};

        this.formGroupControl = this.formBuilder.group({
            batteryId: [this.curData.batteryId, [Validators.required]],
            supplyId: [this.curData.supplyId, [Validators.required]],
        });

        const retValue: DataValidate<BatterySupplyDto> = {
            data: this.curData,
            valid: this.formGroupControl.valid
        }
        this.dataCreated.emit(retValue);
    }

    ngAfterViewInit() {
        this.formGroupControl.valueChanges.subscribe((data: BatterySupplyDto) => {
            this.curData = Object.assign({}, this.curData, data);

            const retValue: DataValidate<BatterySupplyDto> = {
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
