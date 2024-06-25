import { Component, ComponentFactoryResolver, ComponentRef, Inject, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalDataIn, ModalDataOut, DataValidate } from '../../models/modal-form.model';
import { DeviceListService } from 'src/app/services/device-list.service';
import { DeviceDto } from 'src/app/models/dto/device-list-dto.model';


@Component({
    selector: 'app-create-modal',
    templateUrl: './create-modal.component.html',
    styleUrls: ['./create-modal.component.scss']
})
export class CreateModalComponent implements OnInit, OnDestroy {

    @ViewChild('edit', { read: ViewContainerRef, static: true }) vcRefEdit: ViewContainerRef;
    @ViewChild('noedit', { read: ViewContainerRef, static: true }) vcRefNoEdit: ViewContainerRef;
    @ViewChild('device', { read: ViewContainerRef, static: true }) vcRefDevice: ViewContainerRef;

    private componentRef: ComponentRef<any>;
    private createData: any;
    private deviceList: DeviceDto[];

    public valid: boolean;

    public isHovering: boolean;
    public uploaded: boolean = false;
    public uploading: boolean = false;
    public uploadedOnService: boolean = false;
    public error: boolean = false;

    public recordsNumber: number = 0;

    public file: File;

    constructor(
        private dialogRef: MatDialogRef<CreateModalComponent>,
        private resolver: ComponentFactoryResolver,
        private deviceService: DeviceListService,
        @Inject(MAT_DIALOG_DATA) public data: ModalDataIn<any>
    ) { }

    ngOnInit(): void {
        const factory = this.resolver.resolveComponentFactory(this.data.component);

        if (this.data.edit) {
            this.componentRef = this.vcRefEdit.createComponent(factory);
        }
        else if (this.data.tableName !== 'Устройства') {
            this.componentRef = this.vcRefNoEdit.createComponent(factory);
        }
        else {
            this.componentRef = this.vcRefDevice.createComponent(factory);
        }

        const ref = this.componentRef.instance;

        ref.data = this.data;
        ref.dataCreated.subscribe((event: DataValidate<any>) => {
            this.createData = event.data;
            this.valid = event.valid;
        });

        this.dialogRef.backdropClick().subscribe(() => {
            const closeObject: ModalDataOut<any> = {
                code: 0,
                cache: this.createData
            };

            this.dialogRef.close(closeObject);
        });
    }

    ngOnDestroy(): void {
        if (this.componentRef) {
            this.componentRef.destroy();
        }
    }

    public toggleHover(event: boolean): void {
        this.isHovering = event;
    }

    public startUpload(event: File): void {

        this.uploaded = false;
        this.uploading = true;

        this.file = event;

        const myReader: FileReader = new FileReader();
        myReader.readAsBinaryString(this.file);

        myReader.onload = e => {

        }

        myReader.onloadend = e => {
            this.uploaded = true;
            this.uploading = false;
        }

    }

    public removeFile(event): void {
        event.stopPropagation();

        this.file = null;
        setTimeout(() => this.uploaded = false);
    }

    public onSaveClick() {

        if (!this.uploaded) {
            const saveObject: ModalDataOut<any> = {
                code: 1,
                row: this.createData
            };

            this.dialogRef.close(saveObject);
        }
        else if (!this.uploadedOnService) {
            this.uploading = true;

            this.deviceService.saveFile(this.file).subscribe(e => {

                this.deviceService.getDevices({ state: this.data.state }).subscribe((devices: DeviceDto[]) => {
                    this.deviceList = devices;

                    this.uploading = false;
                    this.uploadedOnService = true;
                })
            }, (error) => {
                console.log(error);

                this.error = true;
                this.uploading = false;
                this.uploadedOnService = true;
            });
        }
        else if (!this.error) {
            const saveObject: ModalDataOut<any> = {
                code: 3,
                data: this.deviceList
            };

            this.dialogRef.close(saveObject);
        }
    }

    public onUpdateClick() {
        const saveObject: ModalDataOut<any> = {
            code: 2,
            row: this.createData
        };
        this.dialogRef.close(saveObject);
    }

    public onCloseClick() {
        const closeObject: ModalDataOut<any> = {
            code: 0,
            cache: this.createData
        };
        this.dialogRef.close(closeObject);
    }
}
