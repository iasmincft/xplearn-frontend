const routes = [
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/home'
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
        meta: { title: 'Atividades' }
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
        path: '/badges', 
        component: () => import('src/pages/PageBadges.vue'),
        meta: { title: 'Badges' }
      },
      { 
        path: '/settings', 
        component: () => import('src/pages/PageSettings.vue'),
        meta: { 
          title: 'Settings',
          hideHeaderElement: true
        } 
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
