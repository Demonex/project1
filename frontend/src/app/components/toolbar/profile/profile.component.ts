import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { SettingsModalComponent } from './settings-modal/settings-modal.component'

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    @Input() readonly darkModeState: boolean;
    @Output() readonly darkModeSwitched: EventEmitter<boolean> = new EventEmitter();

    constructor(private dialog: MatDialog) { }

    public openDialog() {
        const dialogRef = this.dialog.open(SettingsModalComponent, {
            data: this.darkModeState,
            panelClass: "dialog-style"
        });

        dialogRef.componentInstance.darkModeSwitched.subscribe((change: boolean) => {
            this.darkModeSwitched.emit(change);
        });
        dialogRef.afterClosed().subscribe();

    }

    ngOnInit(): void {
    }

}
