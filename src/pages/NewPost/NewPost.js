import { useState, useContext, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import _ from 'lodash';
import classNames from 'classnames/bind';
import styles from './NewPost.module.scss';

import config from '~/config';
import { PostContext } from '~/contexts/PostContext';
import Button from '~/components/Button';
import { ToastContext } from '~/contexts/ToastContext';
import { ProductContext } from '~/contexts/ProductContext';

const cx = classNames.bind(styles);
function Posts() {
  const {
    // postsState: { posts },
    addPost,
  } = useContext(PostContext);

  const { uploadFiles, uploadFile } = useContext(ProductContext);
  const [formValue, setFormValue] = useState({
    title: '',
    header: '',
  });
  const { title, header } = formValue;
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
    if (!files || !title || !header) {
      addToast({
        id: toastList.length + 1,
        title: 'Thất bại',
        content: 'Bạn chưa nhập thông tin bài viết và hình ảnh',
        type: 'warning',
      });
      return;
    }
    try {
      const responseUpdatedImgs = await handleUploadFile(files);
      if (responseUpdatedImgs.success) {
        const response = await addPost({ ...formValue, content: valueDescription, img: responseUpdatedImgs.result });
        if (response.success) {
          addToast({
            id: toastList.length + 1,
            title: 'Thành công',
            content: response.message,
            type: 'success',
          });
          navigate(config.routes.posts);
          setFormValue({
            title: '',
            header: '',
            img: '',
          });
        } else {
          addToast({
            id: toastList.length + 1,
            title: 'Thất bại',
            content: response.message,
            type: 'error',
          });
        }
        setValueDescription('');
        setFiles();
        setImgs();
      } else {
        addToast({
          id: toastList.length + 1,
          title: 'Thất bại',
          content: responseUpdatedImgs.message,
          type: 'error',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // editor
  const [valueDescription, setValueDescription] = useState('');
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
      <h4 className={cx('title')}>Thêm mới bài viết</h4>
      <form className={cx('form')} onSubmit={addPostSubmit}>
        <div className={cx('form-group')}>
          <label htmlFor="title" className={cx('lable')}>
            Tiêu đề bài viết
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
            Miêu tả
          </label>
          <input
            className={cx('input')}
            spellCheck={false}
            type="text"
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
          <ReactQuill
            theme="snow"
            ref={quillRef}
            value={valueDescription}
            modules={modules}
            onChange={setValueDescription}
          />
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
        <Button primary type="submit" className={cx('btn')}>
          Thêm mới bài viết
        </Button>
      </form>
    </div>
  );
}

export default Posts;
