import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelView } from './label-view';

describe('LabelView', () => {
  let component: LabelView;
  let fixture: ComponentFixture<LabelView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabelView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
