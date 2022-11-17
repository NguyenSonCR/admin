import classNames from 'classnames/bind';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GuestContext } from '~/contexts/GuestContext';
import config from '~/config';
import styles from './NewUser.module.scss';
import Button from '~/components/Button';

const cx = classNames.bind(styles);
function NewUser() {
  const { newUser } = useContext(GuestContext);
  const [formValue, setFormValue] = useState({
    username: '',
    address: '',
    phonenumber: '',
    facebook: '',
  });

  const { username, address, phonenumber, facebook } = formValue;

  const onChange = (event) => {
    setFormValue({
      ...formValue,
      [event.target.name]: event.target.value,
    });
  };
  const navigate = useNavigate();
  const onSubmitForm = async (event) => {
    event.preventDefault();
    try {
      const userData = await newUser(formValue);
      if (userData.success) {
        alert('Thêm mới khách hàng thành công');
        navigate(config.routes.users);
        setFormValue({
          username: '',
          address: '',
          phonenumber: '',
          facebook: '',
        });
      } else {
        alert(userData.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={cx('wrapper')}>
      <h4 className={cx('title')}>Trang thêm mới người dùng</h4>
      <form className={cx('form')} onSubmit={onSubmitForm}>
        <div className={cx('form-group')}>
          <label className={cx('label')} htmlFor="username">
            Tên khách hàng
          </label>
          <input
            spellCheck="false"
            name="username"
            className={cx('input')}
            value={username}
            id="username"
            onChange={onChange}
          />
        </div>
        <div className={cx('form-group')}>
          <label className={cx('label')} htmlFor="address">
            {' '}
            Địa chỉ
          </label>
          <input
            spellCheck="false"
            name="address"
            className={cx('input')}
            value={address}
            id="address"
            onChange={onChange}
          />
        </div>
        <div className={cx('form-group')}>
          <label className={cx('label')} htmlFor="phonenumber">
            Số điện thoại
          </label>
          <input
            spellCheck="false"
            name="phonenumber"
            className={cx('input')}
            value={phonenumber}
            id="phonenumber"
            onChange={onChange}
          />
        </div>
        <div className={cx('form-group')}>
          <label className={cx('label')} htmlFor="facebook">
            Facebook
          </label>
          <input
            spellCheck="false"
            name="facebook"
            className={cx('input')}
            value={facebook}
            id="facebook"
            onChange={onChange}
          />
        </div>
        <div className={cx('action')}>
          <Button primary type="submit" className={cx('add-btn')}>
            {' '}
            Thêm mới{' '}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default NewUser;
