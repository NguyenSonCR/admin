import classNames from 'classnames/bind';
import styles from './PostDetail.module.scss';
import Spinner from '~/components/Spinner';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PostContext } from '~/contexts/PostContext';
import config from '~/config';
import Button from '~/components/Button';
import Alert from '~/components/Alert';

const cx = classNames.bind(styles);

function ProductDetail() {
  const { slug } = useParams();
  const {
    postsState: { postLoading },
    getPost,
    deletePost,
  } = useContext(PostContext);

  const [postValue, setPostValue] = useState({
    title: '',
    header: '',
    content: '',
    img: '',
  });
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    getPost(slug).then((post) => {
      setPostValue(post);
    });
    // eslint-disable-next-line
  }, []);

  const { title, header, content, img } = postValue;

  const handleDelete = (slug) => {
    setShowAlert(true);
  };

  let body = null;
  if (postLoading) {
    body = <Spinner />;
  } else {
    body = (
      <div className={cx('wrapper')}>
        <h4 className={cx('title')}>{title}</h4>
        <p className={cx('header')}>{header}</p>
        <p className={cx('content')}>{content}</p>
        <div className={cx('imgs')}>
          {img && img.map((url, index) => <img key={index} className={cx('img')} src={url} alt={title}></img>)}
        </div>

        <div className={cx('action')}>
          <Button primary to={`${config.routes.posts}/${slug}/update`} className={cx['btn']}>
            Chỉnh sửa
          </Button>

          <Button
            deleted
            onClick={() => {
              handleDelete(slug);
            }}
          >
            Xóa
          </Button>

          <Button primary to={config.routes.posts}>
            Quay lại
          </Button>
        </div>
        {showAlert && (
          <Alert
            data={{
              title: 'Bạn có muốn xóa bài viết này không',
              navigateValue: config.routes.posts,
              slug,
              success: deletePost,
              cancel: setShowAlert,
            }}
          />
        )}
      </div>
    );
  }
  return body;
}

export default ProductDetail;
