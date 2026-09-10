import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  provideTranslateService,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { RevealDirective } from 'src/app/directives/reveal.directive';
import { TitledText } from 'src/app/models/titled-text.model';
import { FakeIntersectionObserver } from 'src/testing/intersection-observer';
import { stubReducedMotion } from 'src/testing/motion';
import { ReasonSheetComponent } from './reason-sheet.component';

@Component({
  template: `
    <app-reason-sheet
      tag="A-05"
      [id]="'a-05'"
      titleKey="GLOBAL.AUTOMATION_OUTRO"
      [titleParams]="{ companyName: 'Just Enable' }"
      [items]="items"
    />
  `,
  standalone: false,
})
class HostComponent {
  items: TitledText[] | null = null;
}

@Component({
  template: `<app-reason-sheet id="m-06" tag="M-06" titleKey="GLOBAL.AUTOMATION_OUTRO" />`,
  standalone: false,
})
class StaticIdHostComponent {}

describe('ReasonSheetComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let element: HTMLElement;

  beforeEach(() => {
    stubReducedMotion(false);
    FakeIntersectionObserver.install();
    TestBed.configureTestingModule({
      declarations: [
        ReasonSheetComponent,
        RevealDirective,
        HostComponent,
        StaticIdHostComponent,
      ],
      imports: [TranslatePipe],
      providers: [provideTranslateService()],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      'GLOBAL.AUTOMATION_OUTRO': 'Partner with {{ companyName }}',
      'SHEET.NO': 'No',
      'SHEET.ITEM': 'Item',
      'SHEET.NOTE': 'Note',
    });
    translate.use('en');
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => FakeIntersectionObserver.restore());

  it('reveals the whole sheet on scroll', () => {
    const section = element.querySelector('section')!;
    expect(section.classList.contains('reveal')).toBeTrue();
    expect(FakeIntersectionObserver.instances[0].observed).toEqual([section]);
  });

  it('renders the heading and an empty sheet before the items arrive', () => {
    const heading = element.querySelector('h2');
    expect(heading?.id).toBe('a-05');
    expect(heading?.getAttribute('tabindex')).toBe('-1');
    expect(heading?.textContent?.trim()).toBe('Partner with Just Enable');
    expect(element.querySelectorAll('tbody tr').length).toBe(0);
    expect(element.querySelectorAll('dl dt').length).toBe(0);
  });

  it('keeps the id unique when a page writes it as a static attribute', () => {
    const staticFixture = TestBed.createComponent(StaticIdHostComponent);
    staticFixture.detectChanges();
    const root: HTMLElement = staticFixture.nativeElement;

    expect(root.querySelectorAll('#m-06').length).toBe(1);
    expect(root.querySelector('h2')?.id).toBe('m-06');
    expect(root.querySelector('app-reason-sheet')?.hasAttribute('id')).toBeFalse();
  });

  it('numbers the rows with row headers and translated column headers', () => {
    host.items = [
      { title: 'Experienced professionals', text: 'Skilled people.' },
      { title: 'Tailored solutions', text: 'Built for you.' },
    ];
    fixture.detectChanges();

    const columns = Array.from(element.querySelectorAll('thead th'));
    expect(columns.map((th) => th.getAttribute('scope'))).toEqual([
      'col',
      'col',
      'col',
    ]);
    expect(columns.map((th) => th.textContent?.trim())).toEqual([
      'No',
      'Item',
      'Note',
    ]);

    const rowHeaders = Array.from(element.querySelectorAll('tbody th'));
    expect(rowHeaders.map((th) => th.getAttribute('scope'))).toEqual([
      'row',
      'row',
    ]);
    expect(rowHeaders.map((th) => th.textContent?.trim())).toEqual([
      '01',
      '02',
    ]);
    const cells = Array.from(element.querySelectorAll('tbody tr:first-child td'));
    expect(cells.map((td) => td.textContent?.trim())).toEqual([
      'Experienced professionals',
      'Skilled people.',
    ]);
  });

  it('mirrors the rows in the definition list used below md', () => {
    host.items = [{ title: 'Cost-effective', text: 'Fewer manual steps.' }];
    fixture.detectChanges();

    const term = element.querySelector('dl dt');
    expect(term?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      '01 Cost-effective'
    );
    expect(element.querySelector('dl dd')?.textContent?.trim()).toBe(
      'Fewer manual steps.'
    );
  });

  it('leaves the item cell empty when an entry had no title', () => {
    host.items = [{ title: '', text: 'Just a note.' }];
    fixture.detectChanges();

    const cells = Array.from(element.querySelectorAll('tbody td'));
    expect(cells.map((td) => td.textContent?.trim())).toEqual([
      '',
      'Just a note.',
    ]);
    expect(element.querySelector('dl dt .font-semibold')).toBeNull();
  });
});
