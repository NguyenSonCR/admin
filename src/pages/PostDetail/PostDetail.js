import classNames from 'classnames/bind';
import styles from './PostDetail.module.scss';
import Spinner from '~/components/Spinner';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PostContext } from '~/contexts/PostContext';
import config from '~/config';
import Button from '~/components/Button';
import { AlertContext } from '~/contexts/AlertContext';

const cx = classNames.bind(styles);

function ProductDetail() {
  const { slug } = useParams();
  const {
    postsState: { postLoading },
    getPost,
    deletePost,
  } = useContext(PostContext);
  const { alertShow } = useContext(AlertContext);

  const [postValue, setPostValue] = useState({
    title: '',
    header: '',
    content: '',
    img: '',
  });

  useEffect(() => {
    getPost(slug).then((post) => {
      setPostValue(post);
    });
    // eslint-disable-next-line
  }, []);

  const { title, header, content, img } = postValue;

  let body = null;
  if (postLoading) {
    body = <Spinner />;
  } else {
    body = (
      <div className={cx('wrapper')}>
        <h4 className={cx('title')}>{title}</h4>
        <p className={cx('header')}>{header}</p>
        <div
          className={cx('content', ['ql-editor'])}
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        ></div>

        <div className={cx('action')}>
          <Button primary to={`${config.routes.posts}/${slug}/update`} className={cx['btn']}>
            Chỉnh sửa
          </Button>

          <Button
            deleted
            onClick={() => {
              alertShow({
                title: 'Bạn có muốn xóa bài viết này không?',
                navigateValue: config.routes.posts,
                buttonValue: 'Xóa',
                data: slug,
                successFunction: deletePost,
              });
            }}
            className={cx('btn-action')}
          >
            Xóa
          </Button>

          <Button primary to={config.routes.posts}>
            Quay lại
          </Button>
        </div>
      </div>
    );
  }
  return body;
}

export default ProductDetail;
