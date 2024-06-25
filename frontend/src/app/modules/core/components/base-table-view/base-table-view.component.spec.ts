import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseTableViewComponent } from './base-table-view.component';

describe('BaseTableViewComponent', () => {
    let component: BaseTableViewComponent;
    let fixture: ComponentFixture<BaseTableViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BaseTableViewComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BaseTableViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
