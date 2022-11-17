import classNames from 'classnames/bind';
import styles from './Navigation.module.scss';
import PropTypes from 'prop-types';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function NavItem({ data, onClick }) {
  return (
    <div className={cx('content')}>
      <div className={cx('nav-item')}>
        {data.icon && <div className={cx('icon')}>{data.icon}</div>}
        <Button full className={cx('text', 'navigation')} to={data.to} onClick={onClick}>
          {data.title}
        </Button>
      </div>
    </div>
  );
}

NavItem.propTypes = {
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};

export default NavItem;
