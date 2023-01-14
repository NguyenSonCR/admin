import classNames from 'classnames/bind';
import { useState, useContext, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';

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

  const { uploadFiles, uploadFile } = useContext(ProductContext);

  const [formValue, setFormValue] = useState({
    title: '',
    header: '',
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
    if (!header) {
      addToast({
        id: toastList.length + 1,
        title: 'Thất bại',
        content: 'Bạn chưa nhập thông tin bài viết',
        type: 'warning',
      });
      return;
    }
    try {
      if (!files) {
        const postData = await updatePost({ ...formValue, content: valueContent, img: imgs });
        if (postData.success) {
          addToast({
            id: toastList.length + 1,
            title: 'Thành công',
            content: postData.message,
            type: 'success',
          });
          navigate(-1);
          setFormValue({
            title: '',
            header: '',
          });
          setFiles();
          setImgs();
        } else {
          addToast({
            id: toastList.length + 1,
            title: 'Thất bại',
            content: postData.message,
            type: 'error',
          });
          return;
        }
      } else {
        const response = await handleUploadFile(files);
        if (response.success) {
          const postData = await updatePost({ ...formValue, content: valueContent, img: response.result });
          if (postData.success) {
            addToast({
              id: toastList.length + 1,
              title: 'Thành công',
              content: postData.message,
              type: 'success',
            });
            navigate(-1);
            setFormValue({
              title: '',
              header: '',
            });
            setFiles();
            setImgs();
          } else {
            addToast({
              id: toastList.length + 1,
              title: 'Thất bại',
              content: postData.message,
              type: 'error',
            });
            return;
          }
        } else {
          addToast({
            id: toastList.length + 1,
            title: 'Thất bại',
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

  const { title, header } = formValue;

  // editor
  const [valueContent, setValueContent] = useState('');
  useEffect(() => {
    if (!postsLoading) {
      setValueContent(post.content);
    }
    // eslint-disable-next-line
  }, [postsLoading]);
  const imageHandler = (e) => {
    const editor = quillRef.current.getEditor();
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('multiple', true);
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];

      if (/^image\//.test(file.type)) {
        let dataSingle = new FormData();
        const imgId = uuidv4();
        const blob = file.slice(0, file.size, 'image/jpeg');
        const newFile = new File([blob], `${imgId}_product.jpeg`, { type: 'image/jpeg' });
        dataSingle.append('file', newFile);

        try {
          const responseSingle = await uploadFile(dataSingle);
          const url = responseSingle.success && responseSingle.result;
          editor.insertEmbed(editor.getSelection()?.index, 'image', url);
        } catch (error) {
          console.log(error);
        }
      } else {
        alert('You could only upload images');
      }
    };
  };
  const toolbarOptions = [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ align: [] }],
    ['link', 'image', 'video'],
    ['clean'], // remove formatting button
  ];

  const modules = useMemo(
    () => ({
      toolbar: {
        container: toolbarOptions,
        handlers: {
          image: imageHandler,
        },
      },
    }),
    // eslint-disable-next-line
    [],
  );

  const quillRef = useRef();
  useEffect(() => {
    quillRef.current?.editor.root.setAttribute('spellcheck', 'false');
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h4 className={cx('title')}>Chỉnh sửa bài viết</h4>
      <form className={cx('form')} onSubmit={addPostSubmit}>
        <div className={cx('form-group')}>
          <label htmlFor="title" className={cx('lable')}>
            Tiêu đề bài viết
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
            Mô tả
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
            Nội dung bài viết
          </label>
          <ReactQuill theme="snow" ref={quillRef} value={valueContent} modules={modules} onChange={setValueContent} />
        </div>
        <div className={cx('form-group-img')}>
          <label htmlFor="img" className={cx('lable-imgs')}>
            <span>Chọn ảnh</span>
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
            <span>Quay lại</span>
          </Button>
          <Button type="submit" fill className={cx('btn-submit')}>
            Lưu lại
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Posts;
