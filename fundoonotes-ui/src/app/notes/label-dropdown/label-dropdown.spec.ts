import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelDropdown } from './label-dropdown';

describe('LabelDropdown', () => {
  let component: LabelDropdown;
  let fixture: ComponentFixture<LabelDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelDropdown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabelDropdown);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
