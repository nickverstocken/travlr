import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleImageUploaderComponent } from './multiple-image-uploader.component';

describe('MultipleImageUploaderComponent', () => {
  let component: MultipleImageUploaderComponent;
  let fixture: ComponentFixture<MultipleImageUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleImageUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleImageUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
