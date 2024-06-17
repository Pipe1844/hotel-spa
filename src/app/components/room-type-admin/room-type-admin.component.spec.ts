import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomTypeAdminComponent } from './room-type-admin.component';

describe('RoomTypeAdminComponent', () => {
  let component: RoomTypeAdminComponent;
  let fixture: ComponentFixture<RoomTypeAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomTypeAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomTypeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
