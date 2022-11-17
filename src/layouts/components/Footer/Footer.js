import classNames from 'classnames/bind';
import styles from './Footer.module.scss';

const cx = classNames.bind(styles);
function Footer() {
  return (
    <div className={cx(['row'])}>
      <div className={cx(['col', 'l-12', 'c-12', 'm-12'])}>
        <div className={cx('wrapper')}>
          <p className={cx('text')}>Bản quyền thuộc về Nhật Bình Shop</p>
          <p className={cx('text')}>2022</p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
