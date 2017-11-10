import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesModalComponent } from './images-modal.component';

describe('ImagesModalComponent', () => {
  let component: ImagesModalComponent;
  let fixture: ComponentFixture<ImagesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
