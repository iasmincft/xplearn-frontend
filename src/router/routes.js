import { useUserStore } from 'src/stores/userStore'

const routes = [
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/auth/login'
      },
      {
        path: 'home',
        component: () => import('src/pages/PageHome.vue'),
        meta: {
          title: 'Home' ,
          hideHeaderElement: true
        }
      },
      {
        path: '/atividades',
        component: () => import('src/pages/PageAtividades.vue'),
        meta: { title: 'Atividades' },
        beforeEnter: (to, from, next) => {
          const userStore = useUserStore()
          if (userStore.currentUser?.role === 'professor') {
            next('/home')
          } else {
            next()
          }
        }
      },
      {
        path: '/ranking',
        component: () => import('src/pages/PageRanking.vue'),
        meta: { title: 'Ranking' }
      },
      {
        path: '/turmas',
        component: () => import('src/pages/PageTurmas.vue'),
        meta: { title: 'Turmas' }
      },
        {
          path: 'turmas/:id',
          name: 'turmaAcessar',
          component: () => import('src/components/turmas/TurmaAcessar.vue')
        },
      {
        path: '/badges',
        component: () => import('src/pages/PageBadges.vue'),
        meta: { title: 'Badges' }
      },
      {
        path: '/settings',
        component: () => import('src/pages/PageSettings.vue'),
        meta: {
          title: 'Configurações',
          hideHeaderElement: true
        }
      },
      {
        path: '/auth',
        component: () => import('src/pages/PageAuth.vue'),
        meta: {
          title: 'Auth',
          hideHeaderAuth: true
        },
        children: [
          {
            path: '',
            redirect: '/auth/login'
          },
          {
            path: 'login',
            component: () => import('src/components/auth/loginPage.vue')
          },
          {
            path: 'cadastro',
            component: () => import('src/components/auth/cadastroPage.vue')
          }
        ]
      },
      {
        path: '/editarUsuario',
        component: () => import('src/components/auth/user/editarUsuario.vue'),
        meta: {
          title: 'Editar Usuário',
          hideHeaderElement: true
        }
      },
      {
        path: '/atividades/:id',
        name: 'atividadeDetalhes',
        component: () => import('src/pages/PageAtividadeDetalhes.vue'),
        meta: {
          title: 'Detalhes da Atividade'
        }
      }

    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
