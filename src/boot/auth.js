import { boot } from 'quasar/wrappers'
import { useUserStore } from 'src/stores/userStore'

export default boot(async ({ store, router }) => {
  const userStore = useUserStore(store)

  await userStore.checkAuth()

  router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth && !userStore.isAuthenticated) {
      next('/auth/login')
    } else if (to.path.includes('/auth/login') && userStore.isAuthenticated) {
      next('/')
    } else {
      next()
    }
  })
})
