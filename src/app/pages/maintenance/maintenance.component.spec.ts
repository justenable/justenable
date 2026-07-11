import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  provideTranslateService,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { MaintenanceComponent } from './maintenance.component';

describe('MaintenanceComponent', () => {
  let component: MaintenanceComponent;
  let fixture: ComponentFixture<MaintenanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaintenanceComponent],
      imports: [TranslatePipe],
      providers: [provideTranslateService()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    TestBed.inject(TranslateService).use('en');
    fixture = TestBed.createComponent(MaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('defines the maintenance content sections', () => {
    expect(component.sections.length).toBeGreaterThan(0);
    for (const section of component.sections) {
      // Not asserting on the exact key text: one source key contains a
      // typo ("MAINTENACE") that is mirrored in the i18n files.
      expect(section.title).toMatch(/^GLOBAL\./);
      expect(section.texts.length).toBeGreaterThan(0);
    }
  });
});
