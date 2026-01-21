import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelManager } from './label-manager';

describe('LabelManager', () => {
  let component: LabelManager;
  let fixture: ComponentFixture<LabelManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelManager]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabelManager);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
