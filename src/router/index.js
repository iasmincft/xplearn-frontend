import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'stores/authStore'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function ( { store }/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  Router.beforeEach((to, from, next) => {
    const authStore = useAuthStore(store)
    
    // 1. Verifica se a rota exige autenticação
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    
    // 2. Verifica se o usuário tem token
    const isAuthenticated = authStore.isAuthenticated

    // --- LÓGICA DE PROTEÇÃO ANTI-LOOP ---

    // CASO 1: Rota exige login e usuário NÃO está logado
    if (requiresAuth && !isAuthenticated) {
      // Se já estiver indo para o login ou auth, deixa passar para não dar loop
      if (to.path !== '/auth/login' && to.path !== '/auth') {
        next('/auth/login')
      } else {
        next()
      }
    } 
    // CASO 2: Usuário JÁ está logado e tenta acessar páginas de Login/Cadastro
    else if (to.path.includes('/auth') && isAuthenticated) {
       // Redireciona para home, MAS apenas se não estivermos já lá
       if (to.path !== '/home') {
        next('/home')
       } else {
        next()
       }
    } 
    // CASO 3: Tudo certo, segue o fluxo
    else {
      next()
    }
  })

  return Router
})