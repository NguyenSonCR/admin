import classNames from 'classnames/bind';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NewPost.module.scss';
import config from '~/config';
import { PostContext } from '~/contexts/PostContext';
import Button from '~/components/Button';
import { ToastContext } from '~/contexts/ToastContext';
import { ProductContext } from '~/contexts/ProductContext';
import _ from 'lodash';

const cx = classNames.bind(styles);
function Posts() {
  const {
    // postsState: { posts },
    addPost,
  } = useContext(PostContext);

  const { uploadFiles } = useContext(ProductContext);
  const [formValue, setFormValue] = useState({
    title: '',
    header: '',
    content: '',
  });
  const { title, header, content } = formValue;
  const onChangeForm = (event) => {
    setFormValue({
      ...formValue,
      [event.target.name]: event.target.value,
    });
  };

  const [imgs, setImgs] = useState();
  const [files, setFiles] = useState();
  const handleChangeImgs = (event) => {
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

  const {
    toastState: { toastList },
    addToast,
  } = useContext(ToastContext);

  let navigate = useNavigate();
  const addPostSubmit = async (event) => {
    event.preventDefault();
    if (!files || !title || !header || !content) {
      addToast({
        id: toastList.length + 1,
        title: 'Th???t b???i',
        content: 'B???n ch??a nh???p th??ng tin b??i vi???t',
        type: 'warning',
      });
      return;
    }
    try {
      const responseUpdatedImgs = await handleUploadFile(files);
      if (responseUpdatedImgs.success) {
        const response = await addPost({ ...formValue, img: responseUpdatedImgs.result });
        if (response.success) {
          addToast({
            id: toastList.length + 1,
            title: 'Th??nh c??ng',
            content: response.message,
            type: 'success',
          });
          navigate(config.routes.posts);
          setFormValue({
            title: '',
            header: '',
            content: '',
            img: '',
          });
        } else {
          addToast({
            id: toastList.length + 1,
            title: 'Th???t b???i',
            content: response.message,
            type: 'error',
          });
        }
        setFiles();
        setImgs();
      } else {
        addToast({
          id: toastList.length + 1,
          title: 'Th???t b???i',
          content: responseUpdatedImgs.message,
          type: 'error',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h4 className={cx('title')}>Th??m m???i b??i vi???t</h4>
      <form className={cx('form')} onSubmit={addPostSubmit}>
        <div className={cx('form-group')}>
          <label htmlFor="title" className={cx('lable')}>
            Ti??u ????? b??i vi???t
          </label>
          <input
            className={cx('input')}
            spellCheck={false}
            type="text"
            value={title}
            onChange={onChangeForm}
            name="title"
            id="title"
          />
        </div>
        <div className={cx('form-group')}>
          <label htmlFor="header" className={cx('lable')}>
            Header
          </label>
          <input
            className={cx('input')}
            type="text"
            spellCheck={false}
            value={header}
            onChange={onChangeForm}
            name="header"
            id="header"
          />
        </div>
        <div className={cx('form-group')}>
          <label htmlFor="content" className={cx('lable')}>
            N???i dung b??i vi???t
          </label>
          <textarea
            spellCheck="false"
            rows="8"
            className={cx('text-area')}
            value={content}
            onChange={onChangeForm}
            name="content"
            id="content"
          ></textarea>
        </div>
        <div className={cx('form-group-img')}>
          <label htmlFor="img" className={cx('lable-imgs')}>
            <span>Ch???n ???nh</span>
          </label>
          <input
            className={cx('input')}
            hidden
            multiple
            type={'file'}
            onChange={handleChangeImgs}
            name="img"
            id="img"
          />
        </div>
        <div className={cx('imgs-preview')}>
          {imgs && imgs.map((url, index) => <img key={index} className={cx('imgs')} src={url} alt=""></img>)}
        </div>
        <Button primary type="submit" className={cx('btn')}>
          Th??m m???i b??i vi???t
        </Button>
      </form>
    </div>
  );
}

export default Posts;
