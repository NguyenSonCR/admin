import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import config from '~/config';
import { useState, useContext } from 'react';
import { AuthContext } from '~/contexts/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from '~/components/Spinner';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ToastContext } from '~/contexts/ToastContext';
import Toast from '~/components/Toast';

const cx = classNames.bind(styles);

function Login() {
  const [formValue, setFormValue] = useState({
    username: '',
    password: '',
  });
  const [show, setShow] = useState({
    type: 'password',
  });
  const {
    loginUser,
    authState: { authLoading, isAuthenticated },
  } = useContext(AuthContext);

  const { username, password } = formValue;
  const onClickIcon = () => {
    if (show.type === 'password') {
      setShow({ type: 'text' });
    } else {
      setShow({ type: 'password' });
    }
  };

  const onChangeForm = (event) => {
    setFormValue({
      ...formValue,
      [event.target.name]: event.target.value,
    });
  };

  const {
    toastState: { toastList },
    addToast,
  } = useContext(ToastContext);
  let navigate = useNavigate();
  const login = async (event) => {
    event.preventDefault();
    try {
      const response = await loginUser(formValue);
      if (response.success) {
        navigate(config.routes.home, { replace: true });
      } else {
        addToast({
          id: toastList.length + 1,
          title: 'Đăng nhập thất bại',
          content: response.message,
          type: 'error',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  if (authLoading) {
    return <Spinner />;
  } else if (isAuthenticated) {
    return <Navigate to={config.routes.home} />;
  } else {
    return (
      <div className={cx('modal')}>
        <div className={cx('modal__overlay')}>
          <Toast />
          <div className={cx('modal__body')}>
            <div className={cx('wrapper')}>
              <div className={cx('header')}>
                <h3> Wellcome to your home </h3>
              </div>
              <form className={cx('form')} onSubmit={login}>
                <div className={cx('form-group')}>
                  <label htmlFor="username" className={cx('label')}>
                    Tên tài khoản:
                  </label>
                  <input
                    value={username}
                    required
                    spellCheck={false}
                    type={'text'}
                    id="username"
                    className={cx('input')}
                    name={'username'}
                    onChange={onChangeForm}
                    placeholder="Username"
                  ></input>
                </div>
                <div className={cx('form-group')}>
                  <label htmlFor="password" className={cx('label')}>
                    Mật khẩu:
                  </label>
                  <div className={cx('input-password')}>
                    <input
                      className={cx('password')}
                      value={password}
                      type={show.type}
                      required
                      id="password"
                      name={'password'}
                      placeholder="Password"
                      onChange={onChangeForm}
                      autoComplete="true"
                    />
                    <div>
                      {show.type === 'password' ? (
                        <FontAwesomeIcon
                          icon={faEyeSlash}
                          className={cx('icon')}
                          onClick={onClickIcon}
                        ></FontAwesomeIcon>
                      ) : (
                        <FontAwesomeIcon icon={faEye} onClick={onClickIcon} className={cx('icon')}></FontAwesomeIcon>
                      )}
                    </div>
                  </div>
                </div>
                <div className={cx('button')}>
                  <button type="submit" className={cx('button-submit')}>
                    Đăng nhập
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
