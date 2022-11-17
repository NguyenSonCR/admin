import classNames from 'classnames/bind';
import styles from './UserItem.module.scss';
import Button from '../Button';
import config from '~/config';
import { useContext } from 'react';
import { GuestContext } from '~/contexts/GuestContext';
const cx = classNames.bind(styles);

function ProductItem({ user: { username, fullName, address, phoneNumber, email, _id } }) {
  const { findUser } = useContext(GuestContext);

  const chooseUser = (_id) => {
    findUser(_id);
  };
  return (
    <div className={cx(['col', 'l-12', 'c-12', 'm-12'])}>
      <Button to={`${config.routes.users}/${username}`} className={cx('wrapper')} onClick={chooseUser.bind(this, _id)}>
        <div className={cx('user')}>
          <p className={cx('text')}>Tên khách hàng: {fullName} </p>
          <p className={cx('text')}>Địa chỉ: {address}</p>
          <p className={cx('text')}>Số điện thoại: {phoneNumber} </p>
          <p className={cx('text')}>Email: {email}</p>
        </div>
      </Button>
    </div>
  );
}

export default ProductItem;
