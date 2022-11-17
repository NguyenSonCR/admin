import classNames from 'classnames/bind';
import { useContext } from 'react';
import { ToastContext } from '~/contexts/ToastContext';
import Button from '../Button';
import styles from './Alert.module.scss';
import { AlertContext } from '~/contexts/AlertContext';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function Alert() {
  const {
    alertState: { show, title, buttonValue, navigateValue, data, successFunction },
    alertHide,
  } = useContext(AlertContext);

  // toast
  const {
    toastState: { toastList },
    addToast,
  } = useContext(ToastContext);
  const navigate = useNavigate();

  let body = null;
  if (show) {
    body = (
      <div
        className={cx('wrapper')}
        onClick={() => {
          alertHide();
        }}
      >
        <div className={cx('body')} onClick={(e) => e.stopPropagation()}>
          <p className={cx('title')}> {title} </p>
          <div className={cx('action')}>
            <Button
              className={cx('btn-success')}
              deleted
              onClick={async () => {
                const response = await successFunction(data);
                if (response.success) {
                  if (navigateValue) navigate(navigateValue);

                  addToast({
                    id: toastList.length + 1,
                    title: 'Thành công',
                    content: response.message,
                    type: 'success',
                  });
                  alertHide();
                } else {
                  addToast({
                    id: toastList.length + 1,
                    title: 'Thất bại',
                    content: response.message,
                    type: 'error',
                  });
                }
              }}
            >
              {buttonValue ? buttonValue : 'Xóa'}
            </Button>
            <Button
              primary
              onClick={() => {
                alertHide();
              }}
            >
              Đóng
            </Button>
          </div>
        </div>
      </div>
    );
  } else {
    body = <div></div>;
  }

  return body;
}

export default Alert;
