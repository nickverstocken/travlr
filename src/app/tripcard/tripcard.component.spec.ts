import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripcardComponent } from './tripcard.component';

describe('TripcardComponent', () => {
  let component: TripcardComponent;
  let fixture: ComponentFixture<TripcardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripcardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
