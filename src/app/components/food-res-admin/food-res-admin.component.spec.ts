import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodResAdminComponent } from './food-res-admin.component';

describe('FoodResAdminComponent', () => {
  let component: FoodResAdminComponent;
  let fixture: ComponentFixture<FoodResAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodResAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodResAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
