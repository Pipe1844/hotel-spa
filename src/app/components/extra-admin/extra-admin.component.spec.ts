import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraAdminComponent } from './extra-admin.component';

describe('ExtraAdminComponent', () => {
  let component: ExtraAdminComponent;
  let fixture: ComponentFixture<ExtraAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtraAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtraAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
