import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleDetailsComponent } from './sale-details.component';

describe('SaleDetailsComponent', () => {
  let component: SaleDetailsComponent;
  let fixture: ComponentFixture<SaleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
