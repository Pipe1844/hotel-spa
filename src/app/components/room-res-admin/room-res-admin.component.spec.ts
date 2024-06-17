import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomResAdminComponent } from './room-res-admin.component';

describe('RoomResAdminComponent', () => {
  let component: RoomResAdminComponent;
  let fixture: ComponentFixture<RoomResAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomResAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomResAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
