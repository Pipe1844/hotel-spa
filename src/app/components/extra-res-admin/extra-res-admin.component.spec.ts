import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraResAdminComponent } from './extra-res-admin.component';

describe('ExtraResAdminComponent', () => {
  let component: ExtraResAdminComponent;
  let fixture: ComponentFixture<ExtraResAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtraResAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtraResAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
