import classNames from 'classnames/bind';
import styles from './User.module.scss';
import { useContext, useEffect } from 'react';
import { GuestContext } from '~/contexts/GuestContext';
import Spinner from '~/components/Spinner';
import UserItem from '~/components/UserItem';
import config from '~/config';
import Button from '~/components/Button';

const cx = classNames.bind(styles);
function User() {
  const {
    userState: { users, usersLoading },
    getUsers,
  } = useContext(GuestContext);
  useEffect(() => {
    getUsers();
    // eslint-disable-next-line
  }, []);

  let body = null;
  if (usersLoading) {
    body = <Spinner />;
  } else if (users && users.length === 0) {
    body = (
      <div className={cx('wrapper')}>
        <p className={cx('text')}>Chưa có khách hàng nào</p>
        <Button primary to={config.routes.newUser} className={cx('link')}>
          {' '}
          Thêm mới khách hàng
        </Button>
      </div>
    );
  } else {
    body = (
      <div className={cx('wrapper-body')}>
        <h4 className={cx('title')}>Trang quản lý thông tin khách hàng</h4>
        <div className={cx(['row', 'sm-gutter'])}>
          {users.map((user, index) => (
            <UserItem key={index} user={user}></UserItem>
          ))}
        </div>
      </div>
    );
  }
  return body;
}

export default User;
