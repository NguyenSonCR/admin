import classNames from 'classnames/bind';
import styles from './Posts.module.scss';
import Spinner from '~/components/Spinner';
import config from '~/config';
import { useContext, useEffect } from 'react';
import { PostContext } from '~/contexts/PostContext';

import PostItem from '~/components/PostItem';
import Button from '~/components/Button';

const cx = classNames.bind(styles);
function Posts() {
  const {
    postsState: { posts, postsLoading },
    getPosts,
  } = useContext(PostContext);
  useEffect(() => {
    getPosts();
    // eslint-disable-next-line
  }, [postsLoading]);

  let body = null;
  if (postsLoading) {
    body = <Spinner />;
  } else if (posts.length === 0) {
    body = (
      <div className={cx('wrapper')}>
        <p className={cx('text')}>Bạn chưa có bài đăng nào</p>
        <Button primary to={config.routes.newPost} className={cx('link')}>
          Thêm mới bài viết
        </Button>
      </div>
    );
  } else {
    body = (
      <div className={cx(['row', 'sm-gutter'])}>
        <h3 className={cx('title')}>Trang quản lý bài viết</h3>
        {posts.map((post, index) => (
          <div key={index} className="col l-12 m-12 c-12">
            <PostItem key={index} post={post}></PostItem>
          </div>
        ))}
      </div>
    );
  }
  return body;
}

export default Posts;
