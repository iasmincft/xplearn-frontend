const routes = [
  {
    path: '/',
    component: () => import('layouts/Layout.vue'),
    children: [
      { 
        path: '', 
        component: () => import('pages/Home.vue') 
      },
      { 
        path: '', 
        component: () => import('pages/Atividades.vue') 
      },
      { 
        path: '', 
        component: () => import('pages/Ranking.vue') 
      },
      { 
        path: '', 
        component: () => import('pages/Turmas.vue') 
      },
      { 
        path: '', 
        component: () => import('pages/Badges.vue') 
      },
      { 
        path: '', 
        component: () => import('pages/Settings.vue') 
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
