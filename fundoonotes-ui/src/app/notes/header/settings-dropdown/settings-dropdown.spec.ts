import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsDropdown } from './settings-dropdown';

describe('SettingsDropdown', () => {
  let component: SettingsDropdown;
  let fixture: ComponentFixture<SettingsDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsDropdown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsDropdown);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
