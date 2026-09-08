import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoComponent } from './logo.component';

describe('LogoComponent', () => {
  let fixture: ComponentFixture<LogoComponent>;
  let img: HTMLImageElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [LogoComponent] });
    fixture = TestBed.createComponent(LogoComponent);
    fixture.detectChanges();
    img = fixture.nativeElement.querySelector('img');
  });

  it('names the company and keeps intrinsic dimensions for layout', () => {
    expect(img.alt).toBe('Just Enable');
    expect(img.getAttribute('width')).toBe('472');
    expect(img.getAttribute('height')).toBe('596');
  });

  it('renders the mark at the requested pixel height', () => {
    expect(img.style.height).toBe('32px');
    fixture.componentInstance.height = 28;
    fixture.detectChanges();
    expect(img.style.height).toBe('28px');
  });
});
