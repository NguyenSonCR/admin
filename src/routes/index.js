import config from '~/config';
import { HeaderOnly } from '~/layouts';
import Landing from '~/pages/Landing';
import Products from '~/pages/Products';
import CreateProduct from '~/pages/CreateProduct';
import Profile from '~/pages/Profile';
import Search from '~/pages/Search';
import Login from '~/pages/Login';
import Home from '~/pages/Home';
import NotFound from '~/components/NotFound';
import ProductDetail from '~/pages/ProductDetail';
import UpdateProduct from '~/pages/UpdateProduct';
import ProductTrash from '~/pages/ProductTrash';
import Posts from '~/pages/Posts';
import NewPost from '~/pages/NewPost';
import Category from '~/pages/Category';
import UpdatedCategory from '~/pages/UpdatedCategory';
import PostDetail from '~/pages/PostDetail';
import UpdatePost from '~/pages/UpdatePost';
import User from '~/pages/User';
import UserShow from '~/pages/UserShow';
import NewUser from '~/pages/NewUser';
import Order from '~/pages/Order';
import OrderDone from '~/pages/OrderDone';
import PostTrash from '~/pages/PostTrash';
import Transport from '~/pages/Transport';
import Themes from '~/pages/Themes';

const privateRoutes = [
  { path: config.routes.landing, component: Landing },
  { path: config.routes.home, component: Home },
  { path: config.routes.products, component: Products },
  { path: config.routes.showProduct, component: ProductDetail },
  { path: config.routes.create, component: CreateProduct },
  { path: config.routes.update, component: UpdateProduct },
  { path: config.routes.trash, component: ProductTrash },

  { path: config.routes.transport, component: Transport },

  { path: config.routes.profile, component: Profile },
  { path: config.routes.search, component: Search, layout: HeaderOnly },

  { path: config.routes.posts, component: Posts },
  { path: config.routes.newPost, component: NewPost },
  { path: config.routes.showPost, component: PostDetail },
  { path: config.routes.updatePost, component: UpdatePost },
  { path: config.routes.postTrash, component: PostTrash },

  { path: config.routes.order, component: Order },
  { path: config.routes.orderDone, component: OrderDone },

  { path: config.routes.users, component: User },
  { path: config.routes.userShow, component: UserShow },
  { path: config.routes.newUser, component: NewUser },

  { path: config.routes.category, component: Category },
  { path: config.routes.updatedCategory, component: UpdatedCategory },

  { path: config.routes.theme, component: Themes },
];

const publicRoutes = [
  { path: config.routes.login, component: Login, layout: null },
  { path: config.routes.notFound, component: NotFound, layout: null },
];
export { privateRoutes, publicRoutes };
