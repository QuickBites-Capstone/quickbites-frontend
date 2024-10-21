import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'
import someRoutes from './someRoutes';
import { isLoggedIn } from '@/pages/AdminCMS/adminAuthServiceProvider/adminAuthService';
import { getAuth } from '../pages/auth/authServiceProvider/authService';


import NotFound from '@/pages/404.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(routes),
    ...someRoutes,
    {
      path: '/:pathMatch(.*)*',
      component: NotFound,
    },
  
  ],
  
});

router.beforeEach((to, from, next) => {
  const isUserAuthenticated = !!getAuth().token;

  if (!isUserAuthenticated && (to.path === '/wallet' || to.path === '/orders')) {
    next('/'); 
  } 
  
  else if (isUserAuthenticated && (to.path === '/auth/login' || to.path === '/auth/register')) {
    next('/'); 
  } 

  else {
    next(); 
  }
});

router.beforeEach((to, from, next) => {
  const { token, role_id } = isLoggedIn();
  const isAuthenticated = !!token;

  const isAdminRoute = to.path.startsWith('/admincms');

  if (!isAuthenticated && isAdminRoute && to.path !== '/admincms') {
    return next('/admincms/dashboard');
  }

  if (isAuthenticated && isAdminRoute && (Number(role_id) !== 1 && Number(role_id) !== 2)) {
    return next('/');
  }

  next();
});

router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
