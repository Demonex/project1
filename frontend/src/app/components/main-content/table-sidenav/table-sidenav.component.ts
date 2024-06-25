import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-table-sidenav',
    templateUrl: './table-sidenav.component.html',
    styleUrls: ['./table-sidenav.component.scss']
})
export class TableSidenavComponent {

    @Output() toggle: EventEmitter<void> = new EventEmitter<void>();
    @Input() collapsed: boolean = false;

    public toggleSidenav(): void {
        this.toggle.emit();
        this.collapsed = !this.collapsed;
    }

    Names: string[] = [
        "ПА",
        "ИН",
        "Ак",
        "КЗ",
        // "СТ",
        // "КЛ"
    ];

    Tables: string[] = [
        "Панели",
        "Инверторы",
        "Аккумуляторы",
        "Контроллеры заряда",
        // "Рассчитать",
        // "История"
    ];

    Links: string[] = [
        "panel-list",
        "invertor-list",
        "battery-list",
        "controller-list",
        // "deviceType-list",
        // "supply-list",
        // "device-list"
    ];

}
