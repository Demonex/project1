import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

    @Input() readonly darkModeState: boolean;
    @Output() readonly darkModeSwitched: EventEmitter<boolean> = new EventEmitter();

    constructor() { }

    ngOnInit(): void {
    }

    public onDarkModeSwitched(change: boolean) {
        this.darkModeSwitched.emit(change);
    }
}
