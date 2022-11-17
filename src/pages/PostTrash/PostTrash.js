import classNames from 'classnames/bind';
import styles from './PostTrash.module.scss';
import Spinner from '~/components/Spinner';
import config from '~/config';
import { useContext, useEffect, useState } from 'react';
import { PostContext } from '~/contexts/PostContext';
import { ToastContext } from '~/contexts/ToastContext';
import Button from '~/components/Button';
import Alert from '~/components/Alert';

const cx = classNames.bind(styles);
function PostTrash() {
  const {
    postsState: { postsDeleted, postsDeletedLoading },
    getPostsDeleted,
    restorePost,
    destroyPost,
  } = useContext(PostContext);

  const {
    toastState: { toastList },
    addToast,
  } = useContext(ToastContext);

  const handleRestore = async (id) => {
    try {
      const response = await restorePost(id);
      if (response.success) {
        addToast({
          id: toastList.length + 1,
          title: 'Thành công',
          content: response.message,
          type: 'success',
        });
      } else {
        addToast({
          id: toastList.length + 1,
          title: 'Thất bại',
          content: response.message,
          type: 'error',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [showAlert, setShowAlert] = useState(false);

  const handleDestroy = () => {
    setShowAlert(true);
  };

  useEffect(() => {
    getPostsDeleted();
    // eslint-disable-next-line
  }, []);

  let body = null;
  if (postsDeletedLoading) {
    body = <Spinner />;
  } else if (postsDeleted.length === 0) {
    body = (
      <div className={cx('wrapper')}>
        <p className={cx('wrapper-text')}>Thùng rác trống</p>
        <Button primary to={config.routes.posts} className={cx('link')}>
          {' '}
          Đi tới trang quản lý bài viết
        </Button>
      </div>
    );
  } else {
    body = (
      <div className={cx(['row', 'sm-gutter'])}>
        <h3 className={cx('title')}>Trang quản lý bài viết</h3>
        {postsDeleted.map((post, index) => (
          <div key={index} className="col l-12 m-12 c-12">
            <div>
              <div className={cx('body')}>
                <div className={cx('main')}>
                  <div className={cx('text')}>
                    <h4 className={cx('title')}>{post.title}</h4>
                    <p className={cx('header')}>{post.header}</p>
                    <p className={cx('content')}>{post.content}</p>
                  </div>
                  <img className={cx('img')} src={post.img} alt={post.title} />
                </div>
                <div className={cx('action')}>
                  <Button deleted onClick={() => handleDestroy(post._id)}>
                    Xóa vĩnh viễn
                  </Button>
                  <Button primary onClick={() => handleRestore(post._id)}>
                    Khôi phục
                  </Button>
                </div>
              </div>
            </div>
            {showAlert && (
              <Alert
                data={{
                  title: 'Bạn có muốn xóa bài viết này không',
                  navigateValue: config.routes.posts,
                  slug: post._id,
                  success: destroyPost,
                  cancel: setShowAlert,
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  }
  return body;
}

export default PostTrash;
