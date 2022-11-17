import classNames from 'classnames/bind';
import styles from './UserShow.module.scss';
import { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GuestContext } from '~/contexts/GuestContext';
import config from '~/config';
import Button from '~/components/Button';
import NotFound from '~/components/NotFound';

const cx = classNames.bind(styles);
function User() {
  const { id } = useParams();
  const {
    userState: { user },
    getUser,
    deleteUser,
  } = useContext(GuestContext);

  useEffect(() => {
    getUser(id);
    // eslint-disable-next-line
  }, []);

  const navigate = useNavigate();
  const handelDelete = (id) => {
    deleteUser(id).then((data) => {
      if (data.success) alert('Bạn đã xóa thành công khách hàng');
      navigate(config.routes.users, { replace: true });
      return;
    });
  };
  let body = null;
  if (!user) {
    body = <NotFound />;
  } else {
    const { fullName, address, phoneNumber, email } = user;
    body = (
      <div className={cx('wrapper')}>
        <div className={cx('info')}>
          <h5 className={cx('title')}>Thông tin về khách hàng</h5>
          <p>Tên khách hàng: {fullName}</p>
          <p>Địa chỉ: {address} </p>
          <p>Số điện thoại: {phoneNumber}</p>
          <p>Email: {email} </p>
        </div>
        <div className={cx('note')}>
          <p> Các sản phẩm đã mua: </p>
          <p> Những điều cần lưu ý: </p>
        </div>
        <div className={cx('action')}>
          <Button primary to={config.routes.users}>
            {' '}
            Quay lại
          </Button>
          <Button deleted className={cx('btn-delete')} onClick={() => handelDelete(id)}>
            Xóa khách hàng{' '}
          </Button>
        </div>
      </div>
    );
  }

  return body;
}

export default User;
