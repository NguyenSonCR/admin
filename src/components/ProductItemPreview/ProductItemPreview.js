import classNames from 'classnames/bind';
import styles from './ProductItemPreview.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import images from '~/assets/img/index';
const cx = classNames.bind(styles);

function ProductItem({
  product: {
    name,
    img,
    imgSlide,
    category,
    categoryChild,
    priceOld,
    priceCurrent,
    saleOffPercent,
    saleOffLable,
    bought,
  },
}) {
  return (
    <div className={cx('home-product')}>
      <div className={cx('home-product-item')}>
        <img className={cx('home-product-item__img')} src={img ? img : images.logo} alt={name} />
        <div className={cx('img-slide')}>
          {imgSlide &&
            imgSlide.map((url, index) => (
              <img key={index} src={url} className={cx('img-slide-item')} alt="nhat binh"></img>
            ))}
        </div>

        <h4 className={cx('home-product-item__name')}>{name}</h4>
        <div className={cx('home-product-item__price')}>
          <p className={cx('home-product-item__price-old')}>
            {priceOld.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đồng
          </p>
          <p className={cx('home-product-item__price-current')}>
            {priceCurrent.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đồng
          </p>
        </div>
        <div className={cx('home-product-item__action')}>
          <span className={cx('home-product-item__like', 'home-product-item__like--liked')}>
            <i className={cx('home-product-item__like-icon-empty far fa-heart')}></i>
            <i className={cx('home-product-item__like-icon-fill fas fa-heart')}></i>
          </span>
          <div className={cx('home-product-item__rating')}>
            <i className={cx('home-product-item__star-gold fas fa-star')}></i>
            <i className="fas fa-star"></i>
          </div>
          <span className={cx('home-product-item__sold')}> {bought} Đã bán</span>
        </div>
        <div className={cx('home-product-item__origin')}>
          <span className={cx('home-product-item__brand')}> {category}</span>
          <span className={cx('home-product-item__brand')}> {categoryChild}</span>
        </div>
        <div className={cx('home-product-item__favourite')}>
          <FontAwesomeIcon className={cx('icon-heart')} icon={faHeart}></FontAwesomeIcon>
          <span>Yêu thích</span>
        </div>
        {saleOffLable && (
          <div className={cx('home-product-item__sale-off')}>
            <span className={cx('home-product-item__sale-off-percent')}> {saleOffPercent}% </span>
            <span className={cx('home-product-item__sale-off-lable')}> {saleOffLable} </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductItem;
