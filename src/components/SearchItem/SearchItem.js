import PropTypes from 'prop-types';
import styles from './SearchItem.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import config from '~/config';
const cx = classNames.bind(styles);

function SearchItem({ data, onClick }) {
  return (
    <Link to={`${config.routes.products}/${data.slug}`} className={cx('wrapper')} onClick={() => onClick()}>
      <img className={cx('img')} src={data.img} alt={data.img}></img>
      <div className={cx('info')}>
        <p className={cx('name')}>{data.name}</p>
        <span className={cx('id')}>Mã sản phẩm: {data.productId}</span>
      </div>
    </Link>
  );
}
SearchItem.propTypes = {
  data: PropTypes.object.isRequired,
};

export default SearchItem;
