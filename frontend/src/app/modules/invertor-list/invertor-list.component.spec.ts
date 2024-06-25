import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvertorListComponent } from './invertor-list.component';

describe('InvertorListComponent', () => {
    let component: InvertorListComponent;
    let fixture: ComponentFixture<InvertorListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InvertorListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InvertorListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
