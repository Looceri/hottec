const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'criar_categoria', component: () => import('pages/categoria/RegisterPage.vue') },
      { path: 'editar_categoria', component: () => import('pages/categoria/EditPage.vue') },
      { path: 'listar_categoria', component: () => import('pages/categoria/ListPage.vue') },
      { path: 'criar_tecnologia', component: () => import('pages/tecnologia/RegisterPage.vue') },
      { path: 'editar_tecnologia', component: () => import('pages/tecnologia/EditPage.vue') },
      { path: 'listar_tecnologia', component: () => import('pages/tecnologia/ListPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
