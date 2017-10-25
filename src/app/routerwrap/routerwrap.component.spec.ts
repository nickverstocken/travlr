import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterwrapComponent } from './routerwrap.component';

describe('RouterwrapComponent', () => {
  let component: RouterwrapComponent;
  let fixture: ComponentFixture<RouterwrapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouterwrapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouterwrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
