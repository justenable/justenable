import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  provideTranslateService,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { TitledText } from 'src/app/models/titled-text.model';
import { AutomationComponent } from './automation.component';

describe('AutomationComponent', () => {
  let component: AutomationComponent;
  let fixture: ComponentFixture<AutomationComponent>;
  let translate: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutomationComponent],
      imports: [TranslatePipe],
      providers: [provideTranslateService()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    translate = TestBed.inject(TranslateService);
    translate.use('en');
    fixture = TestBed.createComponent(AutomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('defines the automation content sections', () => {
    expect(component.sections.length).toBe(4);
    for (const section of component.sections) {
      expect(section.texts.length).toBeGreaterThan(0);
    }
  });

  it('streams the outro items from the translations', () => {
    translate.setTranslation(
      'en',
      { 'GLOBAL.AUTOMATION_OUTRO_TEXT.0': 'Why: because' },
      true
    );

    let items: TitledText[] = [];
    component.outroItems$.subscribe((value) => (items = value));

    expect(items).toEqual([{ title: 'Why', text: 'because' }]);
  });
});
