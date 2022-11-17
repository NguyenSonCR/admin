import styles from './UserMenu.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/img';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEdit, faStore, faUser } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const cx = classNames.bind(styles);

function UserMenu() {
  const [userList, setUserList] = useState(false);
  const onClick = () => {
    if (userList === false) {
      setUserList(true);
    } else {
      setUserList(false);
    }
  };
  return (
    <div className={cx('wrapper')}>
      <div className={cx('user')}>
        <div className={cx('icon')}>
          <img className={cx('user-img')} src={images.avatar} alt=""></img>
        </div>
        <div className={cx('action')}>
          <div className={cx('user-name')}> User name</div>
          <div className={cx('user-edit')}>
            <FontAwesomeIcon className={cx('edit-icon')} icon={faEdit} />
            <p className={cx('user-name')}>Sửa hồ sơ</p>
          </div>
        </div>
      </div>
      <div className={cx('navigate')}>
        <div className={cx('navigate-list')}>
          <div className={cx('icon')}>
            <FontAwesomeIcon className={cx('list-icon')} icon={faUser} />
          </div>

          <div>
            <div className={cx('list-text')} onClick={onClick}>
              Tài khoản của tôi
            </div>
            {userList && (
              <ul className={cx('user-list')}>
                <li className={cx('user-item')}>Hồ sơ</li>
                <li className={cx('user-item')}>Ngân hàng</li>
                <li className={cx('user-item')}>Địa chỉ</li>
                <li className={cx('user-item')}>Đổi mật khẩu</li>
              </ul>
            )}
          </div>
        </div>
        <div className={cx('navigate-list')}>
          <div className={cx('icon')}>
            <FontAwesomeIcon className={cx('list-icon')} icon={faStore} />
          </div>
          <p className={cx('list-text')}> Đơn mua</p>
        </div>
        <div className={cx('navigate-list')}>
          <div className={cx('icon')}>
            <FontAwesomeIcon className={cx('list-icon')} icon={faBell} />
          </div>
          <p className={cx('list-text')}>Thông báo</p>
        </div>
      </div>
    </div>
  );
}

export default UserMenu;
