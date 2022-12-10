import classNames from 'classnames/bind';
import styles from './Navigation.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faSignsPost, faStore, faUser, faTruckFast } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import config from '~/config';

import NavItem from './NavItem';
import Header from './Header';
import { faThemeco } from '@fortawesome/free-brands-svg-icons';

const cx = classNames.bind(styles);

function Navigation() {
  const onChange = (item) => {
    // console.log(item.code);
  };

  const NAV_MENU = [
    {
      icon: <FontAwesomeIcon icon={faUser} />,
      title: 'User',
      children: {
        title: 'Khách hàng',
        data: [
          {
            code: 'users',
            title: 'Quản lý khách hàng',
            to: config.routes.users,
          },
          {
            code: 'newUser',
            title: 'Thêm mới khách hàng',
            to: config.routes.newUser,
          },
        ],
      },
    },
    {
      icon: <FontAwesomeIcon icon={faStore} />,
      title: 'Sản phẩm',
      children: {
        title: 'Sản phẩm',
        data: [
          {
            code: 'category',
            title: 'Danh mục',
            to: config.routes.category,
          },
          {
            code: 'products',
            title: 'Tất cả sản phẩm',
            to: config.routes.products,
          },
          {
            code: 'create',
            title: 'Thêm mới',
            to: config.routes.create,
          },
          {
            code: 'trashProduct',
            title: 'Thùng rác',
            to: config.routes.trash,
          },
        ],
      },
    },
    {
      icon: <FontAwesomeIcon icon={faSignsPost} />,
      title: 'Bài viết',
      children: {
        title: 'Bài viết',
        data: [
          {
            code: 'products',
            title: 'Tất cả bài viết',
            to: config.routes.posts,
          },
          {
            code: 'newPost',
            title: 'Thêm mới',
            to: config.routes.newPost,
          },
          {
            code: 'trashProduct',
            title: 'Thùng rác',
            to: config.routes.postTrash,
          },
        ],
      },
    },
    {
      icon: <FontAwesomeIcon icon={faCartPlus} />,
      title: 'Đơn hàng',
      children: {
        title: 'Đơn hàng',
        data: [
          {
            code: 'order',
            title: 'Tất cả đơn hàng',
            to: config.routes.order,
          },
          {
            code: 'done',
            title: 'Đơn hàng đã xử lý xong',
            to: config.routes.orderDone,
          },
        ],
      },
    },
    {
      icon: <FontAwesomeIcon icon={faTruckFast} />,
      title: 'Vận chuyển',
      to: config.routes.transport,
    },
    {
      icon: <FontAwesomeIcon icon={faThemeco} />,
      title: 'Giao diện',
      to: config.routes.theme,
    },
  ];

  const [history, setHistory] = useState([{ data: NAV_MENU }]);
  const current = history[history.length - 1];
  const renderItems = () => {
    return current.data.map((item, index) => {
      const isParent = !!item.children;
      return (
        <NavItem
          key={index}
          data={item}
          onClick={() => {
            if (isParent) {
              setHistory((prev) => [...prev, item.children]);
            } else {
              onChange(item);
            }
          }}
        />
      );
    });
  };
  return (
    <nav className={cx('wrapper')}>
      <h3 className={cx('title')}> Quick Menu </h3>
      {history.length > 1 && (
        <Header
          title={current.title}
          onBack={() => {
            setHistory((prev) => prev.slice(0, prev.length - 1));
          }}
        />
      )}
      {renderItems()}
    </nav>
  );
}

export default Navigation;
