import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSidenavComponent } from './table-sidenav.component';

describe('TableSidenavComponent', () => {
  let component: TableSidenavComponent;
  let fixture: ComponentFixture<TableSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableSidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
