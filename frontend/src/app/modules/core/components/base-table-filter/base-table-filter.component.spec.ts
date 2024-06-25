import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseTableFilterComponent } from './base-table-filter.component';

describe('BaseTableFilterComponent', () => {
    let component: BaseTableFilterComponent;
    let fixture: ComponentFixture<BaseTableFilterComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BaseTableFilterComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BaseTableFilterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
