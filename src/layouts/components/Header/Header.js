import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import images from '~/assets/img';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import config from '~/config';
import { faSignOut, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import { useContext } from 'react';
import Menu from '~/components/Popper/Menu';
import Search from '../Search';
import { AuthContext } from '~/contexts/AuthContext';

const cx = classNames.bind(styles);

function Header() {
  const {
    authState: {
      user: { username, img, fullName },
    },
    logoutUser,
  } = useContext(AuthContext);

  const userMenu = [
    {
      icon: <FontAwesomeIcon icon={faUser} />,
      title: 'Tài khoản',
      to: config.routes.profile,
    },
    // {
    //   icon: <FontAwesomeIcon icon={faGear} />,
    //   title: 'Cài đặt',
    //   to: '/setting',
    // },
    {
      icon: <FontAwesomeIcon icon={faSignOut} />,
      title: 'Đăng xuất',
      separate: true,
    },
  ];

  const handleMenuOnchange = (menuItem) => {
    if (menuItem.title === 'Đăng xuất') {
      logoutUser();
    }
  };
  return (
    <header className={cx('wrapper', ['grid', 'wide'])}>
      <div className={cx('inner')}>
        <div className={cx('logo')}>
          <Link to={config.routes.home} className={cx('logo-link')}>
            <img src={images.logo} alt="logo" className={cx('logo-img')}></img>
          </Link>
        </div>
        <Search />

        <div className={cx('actions')}>
          <Menu items={userMenu} onChange={handleMenuOnchange} offset={[20, 8]}>
            <div className={cx('user-info')}>
              <img src={img} className={cx('user-avatar')} alt={username}></img>
              <p className={cx('fullname')}>{fullName}</p>
            </div>
          </Menu>
        </div>
      </div>
    </header>
  );
}

export default Header;
