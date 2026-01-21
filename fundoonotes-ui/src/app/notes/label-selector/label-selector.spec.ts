import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelSelector } from './label-selector';

describe('LabelSelector', () => {
  let component: LabelSelector;
  let fixture: ComponentFixture<LabelSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabelSelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
