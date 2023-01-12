import classNames from 'classnames/bind';
import styles from './ProductDetail.module.scss';
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { ProductContext } from '~/contexts/ProductContext';
import { AlertContext } from '~/contexts/AlertContext';
import Spinner from '~/components/Spinner';
import config from '~/config';
import Button from '~/components/Button';
import Comment from '~/components/Comment';

const cx = classNames.bind(styles);

function ProductDetail() {
  let { slug } = useParams();
  const {
    productState: { product },
    getProduct,
    deleteProduct,
  } = useContext(ProductContext);

  // get one product with slug
  useEffect(() => {
    getProduct(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const { alertShow } = useContext(AlertContext);

  const [avatar, setAvatar] = useState();

  let body = null;
  if (product === null) {
    body = <Spinner />;
  } else {
    const {
      name,
      description,
      img,
      imgSlide,
      priceOld,
      priceCurrent,
      saleOffPercent,
      category,
      categoryChild,
      slug,
      bought,
      createdAt,
      updatedAt,
    } = product;

    const dateC = new Date(createdAt);
    const dateCreated = `${dateC.getHours()}:${dateC.getMinutes()} ngày ${dateC.getDate()}/${
      dateC.getMonth() + 1
    }/${dateC.getFullYear()}`;
    const dateU = new Date(updatedAt);
    const dateUpdated = `${dateU.getHours()}:${dateU.getMinutes()} ngày ${dateU.getDate()}/${
      dateU.getMonth() + 1
    }/${dateU.getFullYear()}`;
    body = (
      <div className={cx('wrapper')}>
        <div className={cx(['row'])}>
          <div className={cx(['col', 'l-9', 'm-6', 'c-12'])}>
            <h3 className={cx('title')}> Chi tiết sản phẩm</h3>
            <div className={cx('menu')}>
              <div className={cx('menu-item')}>
                <h4 className={cx('list')}> Tên sản phẩm: </h4>
                <p className={cx('list')}> Danh mục: </p>
                <p className={cx('list')}> Danh mục con: </p>
                <p className={cx('list')}> Giá hiện tại: </p>
                <p className={cx('list')}> Giá cũ: </p>
                <p className={cx('list')}> Giảm giá: </p>
                <p className={cx('list')}> Đã mua:</p>
                <p className={cx('list')}> Đã đăng vào:</p>
                <p className={cx('list')}> Đã chỉnh sửa vào:</p>
              </div>
              <div className={cx('menu-value')}>
                <h4 className={cx('list-value')}> {name}</h4>
                <p className={cx('list-value')}> {category}</p>
                <p className={cx('list-value')}> {categoryChild}</p>
                <p className={cx('list-value')}> {priceCurrent.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}đ</p>
                <p className={cx('list-value')}> {priceOld.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}đ</p>
                <p className={cx('list-value')}> {saleOffPercent}%</p>
                <p className={cx('list-value')}> {bought}</p>
                <p className={cx('list-value')}> {dateCreated}</p>
                <p className={cx('list-value')}> {dateUpdated}</p>
              </div>
            </div>
          </div>
          <div className={cx(['col', 'l-3', 'm-6', 'c-0'])}>
            <div className={cx('wrapper-img')}>
              <img className={cx('img')} src={avatar ? avatar : img} alt={name}></img>
              <div className={cx('slide')}>
                {imgSlide &&
                  imgSlide.map((url, index) => (
                    <img onClick={() => setAvatar(url)} className={cx('slide-img')} key={index} src={url} alt=""></img>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className={cx(['row'])}>
          <div className={cx(['col', 'l-12', 'm-12', 'c-12'])}>
            <h4 className={cx('title')}> Mô tả sản phẩm: </h4>

            <div
              className={cx('create__form-all-input', ['ql-editor'])}
              dangerouslySetInnerHTML={{
                __html: description,
              }}
            />
          </div>
        </div>
        <div className={cx(['row'])}>
          <div className={cx(['col', 'l-12', 'm-12', 'c-12'])}>
            <h4 className={cx('title')}> Đánh giá: </h4>
            <Comment product={product} />
          </div>
        </div>
        <div className={cx(['row'])}>
          <div className={cx(['col', 'l-12', 'm-12', 'c-12'])}>
            <div className={cx('action')}>
              <Button primary to={'update'}>
                Chỉnh sửa
              </Button>
              <Button
                deleted
                className={cx('btn-delete')}
                onClick={() => {
                  alertShow({
                    title: 'Bạn có muốn xóa sản phẩm này không',
                    navigateValue: config.routes.products,
                    buttonValue: 'Xóa',
                    data: slug,
                    successFunction: deleteProduct,
                  });
                }}
              >
                Xóa sản phẩm
              </Button>
              <Button primary to={config.routes.products}>
                Quay lại
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return body;
}

export default ProductDetail;
