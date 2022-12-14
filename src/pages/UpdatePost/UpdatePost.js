import classNames from 'classnames/bind';
import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './UpdatePost.module.scss';
import { PostContext } from '~/contexts/PostContext';
import { ProductContext } from '~/contexts/ProductContext';
import { ToastContext } from '~/contexts/ToastContext';
import _ from 'lodash';
import Button from '~/components/Button';
import config from '~/config';

const cx = classNames.bind(styles);
function Posts() {
  const { slug } = useParams();
  const {
    postsState: { post, postsLoading },
    getPost,
    updatePost,
  } = useContext(PostContext);

  const {
    toastState: { toastList },
    addToast,
  } = useContext(ToastContext);

  const { uploadFiles } = useContext(ProductContext);

  const [formValue, setFormValue] = useState({
    title: '',
    header: '',
    content: '',
  });

  useEffect(() => {
    getPost(slug);
    // eslint-disable-next-line
  }, [slug, postsLoading]);

  const onChangeForm = (event) => {
    setFormValue({
      ...formValue,
      [event.target.name]: event.target.value,
    });
  };

  const [imgs, setImgs] = useState();
  const [files, setFiles] = useState();

  useEffect(() => {
    if (!postsLoading) {
      const { img } = post;
      setFormValue(post);
      setImgs(img);
    } // eslint-disable-next-line
  }, [postsLoading]);

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

  let navigate = useNavigate();
  const addPostSubmit = async (event) => {
    event.preventDefault();
    if (!header || !content) {
      addToast({
        id: toastList.length + 1,
        title: 'Th???t b???i',
        content: 'B???n ch??a nh???p th??ng tin b??i vi???t',
        type: 'warning',
      });
      return;
    }
    try {
      if (!files) {
        const postData = await updatePost({ ...formValue, img: imgs });
        if (postData.success) {
          addToast({
            id: toastList.length + 1,
            title: 'Th??nh c??ng',
            content: postData.message,
            type: 'success',
          });
          navigate(-1);
          setFormValue({
            title: '',
            header: '',
            content: '',
          });
          setFiles();
          setImgs();
        } else {
          addToast({
            id: toastList.length + 1,
            title: 'Th???t b???i',
            content: postData.message,
            type: 'error',
          });
          return;
        }
      } else {
        const response = await handleUploadFile(files);
        if (response.success) {
          const postData = await updatePost({ ...formValue, img: response.result });
          if (postData.success) {
            addToast({
              id: toastList.length + 1,
              title: 'Th??nh c??ng',
              content: postData.message,
              type: 'success',
            });
            navigate(-1);
            setFormValue({
              title: '',
              header: '',
              content: '',
            });
            setFiles();
            setImgs();
          } else {
            addToast({
              id: toastList.length + 1,
              title: 'Th???t b???i',
              content: postData.message,
              type: 'error',
            });
            return;
          }
        } else {
          addToast({
            id: toastList.length + 1,
            title: 'Th???t b???i',
            content: response.message,
            type: 'error',
          });
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { title, header, content } = formValue;
  return (
    <div>
      <h4 className={cx('title')}>Ch???nh s???a b??i vi???t</h4>
      <form className={cx('form')} onSubmit={addPostSubmit}>
        <div className={cx('form-group')}>
          <label htmlFor="title" className={cx('lable')}>
            Ti??u ????? b??i vi???t
          </label>
          <input
            className={cx('input')}
            spellCheck={false}
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
            className={cx('input-area')}
            spellCheck={false}
            value={content}
            onChange={onChangeForm}
            rows="8"
            name="content"
            id="content"
          />
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
        <div className={cx('action')}>
          <Button to={`${config.routes.posts}/${slug}`} fill className={cx('btn-back')}>
            <span>Quay l???i</span>
          </Button>
          <Button type="submit" fill className={cx('btn-submit')}>
            L??u l???i
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Posts;
