import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslatePipe } from '@ngx-translate/core';
import { ContactUsComponent } from './contact-us.component';

describe('ContactUsComponent', () => {
  let component: ContactUsComponent;
  let fixture: ComponentFixture<ContactUsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactUsComponent],
      imports: [TranslatePipe],
      providers: [provideTranslateService()],
    });
    fixture = TestBed.createComponent(ContactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('links the email address via mailto', () => {
    const link: HTMLAnchorElement | null =
      fixture.nativeElement.querySelector(`a[href="mailto:${component.email}"]`);
    expect(link).not.toBeNull();
  });

  it('renders the contact details', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain(component.email);
    expect(text).toContain(component.mobile);
  });
});
