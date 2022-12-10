const routes = {
  landing: '/',
  home: '/home',
  login: '/login',
  logout: '/logout',
  theme: '/theme',

  profile: '/profile',

  products: '/products',
  showProduct: '/products/:slug',
  create: '/products/create',
  trash: '/products/trash',
  update: '/products/:slug/update',
  delete: '/products/:slug/delete',
  category: '/products/category',
  updatedCategory: '/products/category/:id/updated',
  search: '/search',

  posts: '/posts',
  newPost: '/posts/new',
  showPost: '/posts/:slug',
  updatePost: '/posts/:slug/update',
  postTrash: '/posts/trash',

  transport: '/transport',

  order: '/order',
  orderDone: '/order/done',
  users: '/users',
  newUser: '/users/new',
  userShow: '/users/:id',
  notFound: '*',
};
export default routes;
