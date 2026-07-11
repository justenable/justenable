import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClickElsewhereDirective } from './click-elsewhere.directive';

@Component({
    template: `
    <div clickElsewhere (clickElsewhere)="outsideClicks = outsideClicks + 1">
      <button id="inside" type="button">inside</button>
    </div>
    <button id="outside" type="button">outside</button>
  `,
    standalone: false
})
class HostComponent {
  outsideClicks = 0;
}

describe('ClickElsewhereDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClickElsewhereDirective, HostComponent],
    });
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function click(selector: string): void {
    const element: HTMLElement =
      fixture.nativeElement.querySelector(selector);
    element.click();
    fixture.detectChanges();
  }

  it('does not emit when clicking inside the host element', () => {
    click('#inside');
    expect(host.outsideClicks).toBe(0);
  });

  it('emits when clicking outside the host element', () => {
    click('#outside');
    expect(host.outsideClicks).toBe(1);
  });
});
