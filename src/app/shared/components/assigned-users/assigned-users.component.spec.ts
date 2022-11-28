import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedUsersComponent } from './assigned-users.component';

describe('AssignedUsersComponent', () => {
  let component: AssignedUsersComponent;
  let fixture: ComponentFixture<AssignedUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignedUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
