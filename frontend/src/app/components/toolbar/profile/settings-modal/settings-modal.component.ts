import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-settings-modal',
    templateUrl: './settings-modal.component.html',
    styleUrls: ['./settings-modal.component.scss']
})
export class SettingsModalComponent implements OnInit {

    @Output() readonly darkModeSwitched: EventEmitter<boolean> = new EventEmitter();

    constructor(
        public dialogRef: MatDialogRef<SettingsModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit(): void {
    }

    public onDarkModeSwitched({ checked }: MatSlideToggleChange) {
        this.darkModeSwitched.emit(checked);
    }
}
