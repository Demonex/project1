import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatterySupplyListComponent } from './client-supply-list.component';

describe('BatterySupplyListComponent', () => {
    let component: BatterySupplyListComponent;
    let fixture: ComponentFixture<BatterySupplyListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BatterySupplyListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BatterySupplyListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
