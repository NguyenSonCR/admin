import classNames from 'classnames/bind';
import { useContext, useEffect, useState } from 'react';
import Button from '~/components/Button';
import { ToastContext } from '~/contexts/ToastContext';
import { TransportContext } from '~/contexts/TransportContext';
import styles from './Transport.module.scss';
const cx = classNames.bind(styles);

function Tranport() {
  const {
    transportState: { transports },
    getTransport,
    addTransport,
    deleteTransport,
  } = useContext(TransportContext);
  const [formValue, setFormValue] = useState({
    name: '',
    price: '',
  });

  useEffect(() => {
    getTransport();
    // eslint-disable-next-line
  }, []);
  const {
    toastState: { toastList },
    addToast,
  } = useContext(ToastContext);

  const { name, price } = formValue;

  const handleOnchangeForm = (e) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddTransport = async (e) => {
    e.preventDefault();
    const response = await addTransport(formValue);
    if (response.success) {
      addToast({
        id: toastList.length + 1,
        title: 'Thêm mới thành công',
        content: response.message,
        type: 'success',
      });
      setFormValue({
        name: '',
        price: '',
      });
    } else {
      addToast({
        id: toastList.length + 1,
        title: 'Thất bại',
        content: response.message,
        type: 'error',
      });
      return;
    }
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('header')}>
        <p className={cx('header-title')}>Tất cả đơn vị vận chuyển</p>
        {transports.length > 0 &&
          transports.map((item, index) => (
            <div className={cx('tranport')} key={index}>
              <div className={cx('info')}>
                <p className={cx('tranport-text')}>Tên đơn vị vận chuyển: {item.name}</p>
                <p className={cx('tranport-text')}>Giá: {item.price}</p>
              </div>
              <div className={cx('action')}>
                {transports.length > 1 && (
                  <Button
                    deleted
                    onClick={() => {
                      deleteTransport(item._id);
                    }}
                  >
                    Xóa
                  </Button>
                )}
              </div>
            </div>
          ))}
      </div>
      <div className={cx('new-tranport')}>
        <form onSubmit={handleAddTransport}>
          <div className={cx('form-group')}>
            <label>Tên đơn vị vận chuyển:</label>
            <input className={cx('input')} name="name" type={'text'} value={name} onChange={handleOnchangeForm}></input>
          </div>
          <div className={cx('form-group')}>
            <label>Giá vận chuyển:</label>
            <input
              className={cx('input')}
              name="price"
              type={'number'}
              value={price}
              onChange={handleOnchangeForm}
            ></input>
          </div>
          <Button primary type="submit">
            Thêm mới
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Tranport;
