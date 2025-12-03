const routes = [
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/home',
      },
      { 
        path: 'home', 
        component: () => import('src/pages/PageHome.vue'),
        meta: { 
          title: 'Home',
          hideHeaderElement: true,
          requiresAuth: true
        } 
      },
      { 
        path: '/atividades', 
        component: () => import('src/pages/PageAtividades.vue'),
        meta: { 
          title: 'Atividades',
          requiresAuth: true
        }
      },
      { 
        path: '/ranking', 
        component: () => import('src/pages/PageRanking.vue'),
        meta: { 
          title: 'Ranking',
          requiresAuth: true
        }
      },
      { 
        path: '/turmas', 
        component: () => import('src/pages/PageTurmas.vue'),
        meta: { 
          title: 'Turmas',
          requiresAuth: true
        }
      },
      { 
        path: 'turma/:id',
        name: 'turmaAcessar',
        component: () => import('src/components/turmas/TurmaAcessar.vue'),
        meta: { requiresAuth: true }
      },
      { 
        path: '/badges', 
        component: () => import('src/pages/PageBadges.vue'),
        meta: { 
          title: 'Badges',
          requiresAuth: true
        }
      },
      { 
        path: '/settings', 
        component: () => import('src/pages/PageSettings.vue'),
        meta: { 
          title: 'Settings',
          hideHeaderElement: true,
          requiresAuth: true
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
            name: 'login', 
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
          hideHeaderElement: true,
          requiresAuth: true
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