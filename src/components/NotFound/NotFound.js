import config from '~/config';
import Button from '../Button';
import styles from './NotFound.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function NotFound() {
  return (
    <div className={cx('wrapper')}>
      <p className={cx('text')}>Trang web không tồn tại</p>
      <Button className={cx('text')} primary to={config.routes.home}>
        Quay về trang chủ
      </Button>
    </div>
  );
}

export default NotFound;
