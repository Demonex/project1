import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    public collapsed: boolean = false;

    constructor() { }

    ngOnInit(): void {
    }
}
