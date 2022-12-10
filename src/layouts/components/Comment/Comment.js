import styles from './Comment.module.scss';
import classNames from 'classnames/bind';
import Button from '../../../components/Button';
import { useContext, useState } from 'react';
import { ProductContext } from '~/contexts/ProductContext';
import { AuthContext } from '~/contexts/AuthContext';
import images from '~/assets/img';
import { ToastContext } from '~/contexts/ToastContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pagination from '~/components/Pagination';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
const cx = classNames.bind(styles);
function Comment({ product }) {
  const { sendComment, deleteComment, sendCommentChildren } = useContext(ProductContext);
  const {
    authState: { user },
  } = useContext(AuthContext);

  const [formValue, setFormValue] = useState('');
  const onChangeForm = (e) => {
    setFormValue(e.target.value);
  };
  const {
    toastState: { toastList },
    addToast,
  } = useContext(ToastContext);

  const handleSendComment = async (e) => {
    e.preventDefault();
    try {
      const response = await sendComment({
        username: user.username,
        fullName: user.fullName,
        img: user.img,
        _id: product._id,
        text: formValue,
      });
      if (response.success) {
        addToast({
          id: toastList.length + 1,
          title: 'Thành công',
          content: response.message,
          type: 'success',
        });
        setFormValue('');
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

  const [children, setFormChildren] = useState('');
  const onChangeChildren = (e) => {
    setFormChildren(e.target.value);
  };

  const handleSendCommentChildren = (e, item) => {
    e.preventDefault();
    sendCommentChildren({
      username: user.username,
      fullName: user.fullName,
      _id: product._id,
      commentId: item._id,
      img: user.img,
      text: children,
    });
  };

  const [showReply, setShowReply] = useState({
    show: false,
    value: null,
  });
  const { show, value } = showReply;
  const handleReply = (item) => {
    setShowReply({
      show: true,
      value: item._id,
    });
  };

  let comment = product.comment;
  // pagination
  const [pageNumber, setPageNumber] = useState(1);
  let startIndex = (pageNumber - 1) * 5;
  let endIndex = Math.min(startIndex + 5, comment.length);
  const currentPage = comment.slice(startIndex, endIndex);
  const pageChange = (number) => {
    setPageNumber(number);
  };

  const onPreviousPage = (currentPage) => {
    if (currentPage > 1) setPageNumber(currentPage - 1);
  };

  var totalPages = Math.ceil(comment.length / 5);
  const onNextPage = (currentPage) => {
    if (currentPage < totalPages) setPageNumber(currentPage + 1);
  };

  return (
    <div className={cx('wrapper')}>
      <p className={cx('title')}>
        <span>{product && product.comment.length}</span> đánh giá cho <span>{product && product.name}</span>
      </p>
      <div className={cx('comment-list')}>
        {product &&
          product.comment &&
          product.comment.length > 0 &&
          currentPage.map((item, index) => (
            <div key={index} className={cx('comment-item')}>
              <div className={cx('client')}>
                <div className={cx('parent')}>
                  <div className={cx('user')}>
                    <img className={cx('user-img')} src={images.avatar} alt=""></img>
                    <div className={cx('comment-info')}>
                      <div className={cx('user-name')}>{item.username}</div>
                      <p className={cx('comment-text')}> {item.text}</p>
                    </div>
                  </div>
                </div>
                <div className={cx('children')}>
                  {item.children &&
                    item.children.length > 0 &&
                    item.children.map((itemChildren, index) => (
                      <div className={cx('children-wrapper')} key={index}>
                        <div className={cx('user')}>
                          <img className={cx('user-img')} src={images.avatar} alt=""></img>
                          <div className={cx('comment-info')}>
                            <div className={cx('user-name')}>{itemChildren.username}</div>
                            <p className={cx('comment-text')}> {itemChildren.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <div className={cx('reply')}>
                  <p className={cx('reply-text')} onClick={() => handleReply(item)}>
                    Phản hồi
                  </p>
                </div>
                {show && item._id === value && (
                  <div className={cx('add-comment')}>
                    <form onSubmit={(e) => handleSendCommentChildren(e, item)} className={cx('form')}>
                      <label className={cx('label')} htmlFor="input-children">
                        Nhập phản hồi:
                      </label>
                      <textarea
                        className={cx('input')}
                        id="input-children"
                        required
                        value={children}
                        onChange={onChangeChildren}
                        type="text"
                        rows={4}
                        spellCheck="false"
                      ></textarea>
                      <Button type="submit" className={cx('btn')} primary>
                        Gửi phản hồi
                      </Button>
                    </form>
                  </div>
                )}
              </div>

              <div className={cx('action')}>
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={() => deleteComment({ _id: product._id, comment: item })}
                  className={cx('delete')}
                />
              </div>
            </div>
          ))}
      </div>
      {comment && comment.length > 0 && (
        <Pagination
          pageSize={5}
          totalProducts={comment.length}
          onChange={pageChange}
          currentPage={pageNumber}
          onPreviousPage={onPreviousPage}
          onNextPage={onNextPage}
        />
      )}
      <div className={cx('add-comment')}>
        <form onSubmit={handleSendComment} className={cx('form')}>
          <label className={cx('label')} htmlFor="input">
            Nhập đánh giá:
          </label>
          <textarea
            className={cx('input')}
            id="input"
            required
            value={formValue}
            onChange={onChangeForm}
            type="text"
            rows={4}
            spellCheck="false"
          ></textarea>
          <Button type="submit" className={cx('btn')} primary>
            Gửi đánh giá
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Comment;
