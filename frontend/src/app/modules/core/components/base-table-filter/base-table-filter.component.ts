import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FilterState } from '../base-table-view/base-table-view.component';

@Component({
    selector: 'app-base-table-filter',
    templateUrl: './base-table-filter.component.html',
    styleUrls: ['./base-table-filter.component.scss']
})
export class BaseTableFilterComponent implements OnInit, AfterViewInit {

    @Input() readonly filterData: any;

    @Output() readonly reset: EventEmitter<void> = new EventEmitter<void>();
    @Output() readonly submit: EventEmitter<void> = new EventEmitter<void>();
    @Output() readonly state: EventEmitter<string> = new EventEmitter<string>();
    
    public filterCollapsed: boolean = false;
    
    public filterStateControl: FormControl = new FormControl();

    ngOnInit(): void {
        this.filterStateControl.patchValue(this.filterData.state);
    }

    ngAfterViewInit(): void {
        this.filterStateControl.valueChanges.subscribe((data: string) => {
            this.state.emit(data); 
        });
    }

    public resetFilters(): void {
        this.reset.emit();
    }

    public submitFilters(): void {
        this.submit.emit();
    }
}