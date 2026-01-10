import {createRouter, createWebHistory} from 'vue-router'
import {useAuthStore} from '@/stores/auth'
import LoginForm from '../components/LoginForm.vue'
import RegisterForm from '../components/RegisterForm.vue'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DashboardView,
      meta: {requiresAuth: true},
    },

    {
      path: '/login',
      name: 'login',
      component: LoginForm,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterForm,
    },
  ],
})

// Глобальный маршрут для проверки аутентификации
// Централизованная функция проверки аутентификации
const checkAuth = (requiresAuth) => {
  const Authstore = useAuthStore();
  const isAuthenticated = Authstore.isAuthenticated
  console.log(isAuthenticated)
  console.log(requiresAuth)
  if (requiresAuth && isAuthenticated) {
      return true;
  } else if (!requiresAuth) {
      return true;
  }
  return false;
};

router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const isAuthenticated = checkAuth(requiresAuth);

  if (isAuthenticated) {
      next();
  } else {
      next('/login');
  }
});

export default router
