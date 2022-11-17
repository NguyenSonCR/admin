import { faCheck, faXmark, faInfo, faExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useCallback, useContext, useEffect } from 'react';
import { ToastContext } from '~/contexts/ToastContext';
import styles from './Toast.module.scss';

const cx = classNames.bind(styles);

function Toast() {
  //   const delay = (duration / 1000).toFixed(2);

  const {
    toastState: { toastList },
    deleteToast,
  } = useContext(ToastContext);
  const icons = {
    success: <FontAwesomeIcon icon={faCheck} />,
    info: <FontAwesomeIcon icon={faInfo} />,
    warning: <FontAwesomeIcon icon={faExclamation} />,
    error: <FontAwesomeIcon icon={faXmark} />,
  };
  const handleDeleteToast = useCallback(
    (id) => {
      deleteToast(id);
    },
    // eslint-disable-next-line
    [toastList, deleteToast],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (toastList.length) {
        deleteToast(toastList[0].id);
      }
    }, 2000);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line
  }, [toastList, deleteToast]);
  return (
    <div className={cx('wrapper')}>
      {toastList.map((toast, index) => {
        const { id, title, type, content } = toast;
        return (
          <div key={index} className={cx('toast', type)}>
            <div className={cx('toast__icon')}>{icons[type]}</div>
            <div className={cx('toast__body')}>
              <div className={cx('toast__title')}>
                <p>{title}</p>
              </div>
              <div className={cx('toast__msg')}>
                <p>{content}</p>
              </div>
            </div>
            <div
              className={cx('toast__close')}
              onClick={() => {
                handleDeleteToast(id);
              }}
            >
              <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Toast;
