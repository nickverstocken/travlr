import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowsModalComponent } from './follows-modal.component';

describe('FollowsModalComponent', () => {
  let component: FollowsModalComponent;
  let fixture: ComponentFixture<FollowsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
