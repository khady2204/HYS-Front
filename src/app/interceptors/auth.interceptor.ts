import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('🟡 INTERCEPTEUR: Méthode', req.method, 'URL:', req.url);
  
  if (req.method === 'OPTIONS') {
    console.log('✅ REQUÊTE OPTIONS DÉTECTÉE');
  }
  // ✅ LISTE COMPLÈTE des URLs à ignorer
  const excludedUrls = [
    '/api/auth/register',
    '/api/auth/login', 
    '/api/auth/send-otp',
    '/api/auth/verify-otp'
  ];
  
  const shouldSkip = excludedUrls.some(url => req.url.includes(url));
  
  if (shouldSkip) {
    console.log('✅ INTERCEPTEUR: Ignoré pour', req.url);
    return next(req); // ← PAS de token pour ces URLs
  }

  const token = localStorage.getItem('jwtToken');
  console.log('🟡 INTERCEPTEUR: Token trouvé?', !!token);
  
  if (token) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ INTERCEPTEUR: Token ajouté');
    return next(authReq);
  }

  console.log('✅ INTERCEPTEUR: Requête sans token');
  return next(req);
};