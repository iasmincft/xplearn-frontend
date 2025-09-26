const routes = [
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      { 
        path: 'home', 
        component: () => import('src/pages/PageHome.vue') 
      },
      { 
        path: '/atividades', 
        component: () => import('src/pages/PageAtividades.vue') 
      },
      { 
        path: '/ranking', 
        component: () => import('src/pages/PageRanking.vue') 
      },
      { 
        path: '/turmas', 
        component: () => import('src/pages/PageTurmas.vue') 
      },
      { 
        path: '/badges', 
        component: () => import('src/pages/PageBadges.vue') 
      },
      { 
        path: '/settings', 
        component: () => import('src/pages/PageSettings.vue') 
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
