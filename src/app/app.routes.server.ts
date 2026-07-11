import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'about-us', renderMode: RenderMode.Prerender },
  { path: 'automation', renderMode: RenderMode.Prerender },
  { path: 'maintenance', renderMode: RenderMode.Prerender },
  { path: 'contact-us', renderMode: RenderMode.Prerender },
  // The wildcard 404 route cannot be prerendered; it stays client-rendered
  // behind the Netlify SPA fallback.
  { path: '**', renderMode: RenderMode.Client },
];
