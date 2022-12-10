import styles from './Comment.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import { useContext, useState } from 'react';
import { ProductContext } from '~/contexts/ProductContext';
import { AuthContext } from '~/contexts/AuthContext';
import images from '~/assets/img';
import { ToastContext } from '~/contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import Pagination from '../Pagination';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
const cx = classNames.bind(styles);

function Comment({ product }) {
  const { sendComment, sendCommentChildren, uploadFiles, deleteComment } = useContext(ProductContext);
  const {
    authState: { user },
  } = useContext(AuthContext);

  const width = window.innerWidth > 0 ? window.innerWidth : window.screen.width;

  const [formValue, setFormValue] = useState('');

  const onChangeForm = (e) => {
    setFormValue(e.target.value);
  };
  const {
    toastState: { toastList },
    addToast,
  } = useContext(ToastContext);

  const navigate = useNavigate();

  const [children, setFormChildren] = useState('');
  const onChangeChildren = (e) => {
    setFormChildren(e.target.value);
  };

  const handleSendCommentChildren = async (e, item) => {
    e.preventDefault();
    if (!user) {
      navigate(config.routes.login);
    }
    try {
      const response = await sendCommentChildren({
        username: user.username,
        fullName: user.fullName,
        _id: product._id,
        commentId: item._id,
        img: user.img,
        text: children,
      });
      if (response.success) {
        setFormChildren('');
      }
    } catch (error) {
      console.log(error);
    }
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

  const totalPages = Math.ceil(comment.length / 5);
  const onNextPage = (currentPage) => {
    if (currentPage < totalPages) setPageNumber(currentPage + 1);
  };

  // preview imgs
  const [imgs, setImgs] = useState();
  const [files, setFiles] = useState();

  const handleOnchangeImgs = (event) => {
    const files = event.target.files;
    const selectedFilesArray = Array.from(files);
    const imagesArray = selectedFilesArray.map((file) => {
      return URL.createObjectURL(file);
    });
    setImgs(imagesArray);
    setFiles(files);
  };
  // upload imgs
  function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
    );
  }

  const handleUploadFile = async (files) => {
    if (files.length > 5) {
      addToast({
        id: toastList.length + 1,
        title: 'Thất bại',
        content: 'Không chọn quá 5 hình ảnh',
        type: 'error',
      });
      return { success: false };
    }
    let data = new FormData();
    _.forEach(files, (file) => {
      const imgId = uuidv4();
      const blob = file.slice(0, file.size, 'image/jpeg');
      const newFile = new File([blob], `${imgId}_post.jpeg`, { type: 'image/jpeg' });
      data.append('files', newFile);
    });

    try {
      const response = await uploadFiles(data);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  // send comment
  const handleSendComment = async (e) => {
    if (!user) {
      navigate(config.routes.login);
    }
    e.preventDefault();

    try {
      if (files) {
        const imgData = await handleUploadFile(files);
        if (imgData.success) {
          const response = await sendComment({
            username: user.username,
            fullName: user.fullName,
            img: user.img,
            _id: product._id,
            text: formValue,
            imgsComment: imgData.result,
          });
          if (response.success) {
            addToast({
              id: toastList.length + 1,
              title: 'Thành công',
              content: response.message,
              type: 'success',
            });
            setFormValue('');
            setFiles();
            setImgs();
          } else {
            addToast({
              id: toastList.length + 1,
              title: 'Thất bại',
              content: response.message,
              type: 'error',
            });
          }
        }
      } else {
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  let body = null;
  if (width > 740) {
    body = (
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
                    <div className={cx('header')}>
                      <div className={cx('user')}>
                        <img className={cx('user-img')} src={item.img ? item.img : images.avatar} alt=""></img>
                        <div className={cx('user-name')}>
                          <p className={cx('user-name')}>{item.fullName}</p>
                          <p className={cx('comment-date')}> {item.createdAt}</p>
                        </div>
                      </div>
                      <div>
                        {user && item.username === user.username && (
                          <FontAwesomeIcon
                            icon={faTrash}
                            onClick={() => deleteComment({ _id: product._id, comment: item })}
                            className={cx('btn-delete')}
                          />
                        )}
                      </div>
                    </div>
                    <div className={cx('comment-info')}>
                      <p className={cx('comment-text')}> {item.text}</p>
                    </div>
                    <div className={cx('comment-img')}>
                      {item.imgsComment.map((url, index) => (
                        <img className={cx('comment-img-tag')} key={index} alt="" src={url}></img>
                      ))}
                    </div>
                  </div>
                  <div className={cx('children')}>
                    {item.children &&
                      item.children.length > 0 &&
                      item.children.map((itemChildren, index) => (
                        <div className={cx('children-wrapper')} key={index}>
                          <div className={cx('parent')}>
                            <div className={cx('user')}>
                              <img
                                className={cx('user-img')}
                                src={itemChildren.img ? itemChildren.img : images.avatar}
                                alt=""
                              ></img>
                              <div className={cx('user-name')}>
                                <p className={cx('user-name')}>{itemChildren.fullName}</p>
                                <p className={cx('comment-date')}> {itemChildren.createdAt}</p>
                              </div>
                            </div>
                            <div className={cx('comment-info')}>
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
                        <div className={cx('sendcomment-action')}>
                          <Button
                            primary
                            onClick={() =>
                              setShowReply({
                                show: false,
                                value: null,
                              })
                            }
                          >
                            Hủy
                          </Button>
                          <Button type="submit" className={cx('btn')} primary>
                            Gửi
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
        {product && product.comment && product.comment.length > 0 && (
          <Pagination
            pageSize={5}
            totalProducts={comment.length}
            onChange={pageChange}
            currentPage={pageNumber}
            onPreviousPage={onPreviousPage}
            onNextPage={onNextPage}
          />
        )}
        {user && (
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
              <div className={cx('form-group')}>
                <label className={cx('label-img')} htmlFor="imgs">
                  Chọn hình ảnh
                </label>
                <input hidden type={'file'} multiple onChange={handleOnchangeImgs} name="imgs" id="imgs"></input>
                <div>
                  {imgs &&
                    imgs.map((url, index) => <img key={index} src={url} alt="" className={cx('imgs-preview')}></img>)}
                </div>
              </div>
              <div className={cx('btn-submit')}>
                <Button type="submit" primary>
                  Gửi
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  } else {
    body = (
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
                    <div className={cx('header')}>
                      <div className={cx('user')}>
                        <img className={cx('user-img')} src={item.img ? item.img : images.logo} alt=""></img>
                        <div className={cx('user-name')}>
                          <p className={cx('user-name')}>{item.username}</p>
                          <p className={cx('comment-date')}> {item.createdAt}</p>
                        </div>
                      </div>
                      <div>
                        {user && item.username === user.username && (
                          <FontAwesomeIcon
                            icon={faTrash}
                            onClick={() => deleteComment({ _id: product._id, comment: item })}
                            className={cx('btn-delete')}
                          />
                        )}
                      </div>
                    </div>
                    <div className={cx('comment-info')}>
                      <p className={cx('comment-text')}> {item.text}</p>
                    </div>
                    <div className={cx('comment-img')}>
                      {item.imgsComment.map((url, index) => (
                        <img className={cx('comment-img-tag')} key={index} alt="" src={url}></img>
                      ))}
                    </div>
                  </div>
                  <div className={cx('children')}>
                    {item.children &&
                      item.children.length > 0 &&
                      item.children.map((itemChildren, index) => (
                        <div className={cx('children-wrapper')} key={index}>
                          <div className={cx('parent')}>
                            <div className={cx('user')}>
                              <img
                                className={cx('user-img')}
                                src={itemChildren.img ? itemChildren.img : images.logo}
                                alt=""
                              ></img>
                              <div className={cx('user-name')}>
                                <p className={cx('user-name')}>{itemChildren.username}</p>
                                <p className={cx('comment-date')}> {itemChildren.createdAt}</p>
                              </div>
                            </div>
                            <div className={cx('comment-info')}>
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
                          rows={2}
                          spellCheck="false"
                        ></textarea>
                        <div className={cx('sendcomment-action')}>
                          <Button
                            primary
                            onClick={() =>
                              setShowReply({
                                show: false,
                                value: null,
                              })
                            }
                          >
                            Hủy
                          </Button>
                          <Button type="submit" className={cx('btn')} primary>
                            Gửi
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
        {product && product.comment && product.comment.length > 0 && (
          <Pagination
            pageSize={5}
            totalProducts={comment.length}
            onChange={pageChange}
            currentPage={pageNumber}
            onPreviousPage={onPreviousPage}
            onNextPage={onNextPage}
          />
        )}
        {user && (
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
                rows={2}
                spellCheck="false"
              ></textarea>
              <div className={cx('form-group')}>
                <label className={cx('label-img')} htmlFor="imgs">
                  Chọn hình ảnh
                </label>
                <input hidden type={'file'} multiple onChange={handleOnchangeImgs} name="imgs" id="imgs"></input>
                <div>
                  {imgs &&
                    imgs.map((url, index) => <img key={index} src={url} alt="" className={cx('imgs-preview')}></img>)}
                </div>
              </div>
              <div className={cx('btn-submit')}>
                <Button type="submit" primary>
                  Gửi
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }
  return body;
}

export default Comment;
