import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HydrationService } from './hydration.service';

describe('HydrationService', () => {
  let marker: HTMLElement | undefined;

  afterEach(() => marker?.remove());

  it('is not hydrating when the document was not prerendered', () => {
    expect(TestBed.inject(HydrationService).hydrating()).toBeFalse();
  });

  it('is hydrating a prerendered document until the application is stable', async () => {
    marker = document.createElement('div');
    marker.setAttribute('ng-server-context', 'ssg');
    document.body.appendChild(marker);

    const service = TestBed.inject(HydrationService);
    expect(service.hydrating()).toBeTrue();

    await TestBed.inject(ApplicationRef).whenStable();
    expect(service.hydrating()).toBeFalse();
  });
});
