import { TestBed } from '@angular/core/testing';
import { LayoutService } from './layout.service';

describe('LayoutService', () => {
  let service: LayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutService);
  });

  it('starts with the menu closed', () => {
    expect(service.menuOpen()).toBeFalse();
  });

  it('opens and closes the menu', () => {
    service.openMenu();
    expect(service.menuOpen()).toBeTrue();

    service.closeMenu();
    expect(service.menuOpen()).toBeFalse();
  });
});
