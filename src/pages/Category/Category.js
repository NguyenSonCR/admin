import { useContext, useEffect, useState } from 'react';
import { CategoryContext } from '~/contexts/CategoryContext';
import styles from './Category.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import Spinner from '~/components/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { ToastContext } from '~/contexts/ToastContext';
import { AlertContext } from '~/contexts/AlertContext';
import { ProductContext } from '~/contexts/ProductContext';

const cx = classNames.bind(styles);
function Category() {
  // toast
  const {
    addToast,
    toastState: { toastList },
  } = useContext(ToastContext);

  const [formValue, setFormValue] = useState({
    name: '',
  });

  const { uploadFile } = useContext(ProductContext);
  const { name } = formValue;
  const {
    categoryState: { categories, category, categoriesLoading },
    getCategories,
    addCategory,
    deleteCategory,
    addCategoryChild,
    chooseCategory,
    deleteCategoryChild,
  } = useContext(CategoryContext);

  useEffect(() => {
    getCategories();
    // eslint-disable-next-line
  }, []);

  const [model, setModel] = useState(false);

  const handleSetModel = (category) => {
    chooseCategory(category);
    setModel(true);
  };

  const handelCloseModel = () => {
    setModel(false);
  };

  const onChangeForm = (event) => {
    setFormValue({
      ...formValue,
      [event.target.name]: event.target.value,
    });
  };

  const [formValueChild, setFormValueChild] = useState({
    childrenName: '',
  });

  const { childrenName } = formValueChild;

  const onChangeFormChild = (event) => {
    event.preventDefault();
    setFormValueChild({
      ...formValueChild,
      [event.target.name]: event.target.value,
    });
  };

  const handleDeleteCategoryChildren = async ({ slug, categoryChildren }) => {
    try {
      const response = await deleteCategoryChild({ slug, categoryChildren });
      console.log(response);
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

  // add img
  const [file, setFile] = useState();
  const [imgPreview, setImgPreview] = useState();

  useEffect(() => {
    return () => {
      imgPreview && URL.revokeObjectURL(imgPreview.preview);
    };
  });

  const onChangeImg = (event) => {
    const file = event.target.files[0];
    file.preview = URL.createObjectURL(file);
    setFile(file);
    setImgPreview(file);
  };

  // upload img
  function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
    );
  }
  const handleUploadFile = async (file) => {
    let data = new FormData();

    const fileId = uuidv4();
    const blob = file.slice(0, file.size, 'image/jpeg');
    const newFile = new File([blob], `${fileId}_category.jpeg`, { type: 'image/jpeg' });
    data.append('file', newFile);

    try {
      const response = await uploadFile(data);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const addCategorySubmit = async (event) => {
    event.preventDefault();
    try {
      if (!file) {
        addToast({
          id: toastList.length + 1,
          title: 'Thất bại',
          content: 'Bạn chưa chọn hình ảnh',
          type: 'warning',
        });
      }
      const responseUploadImg = await handleUploadFile(file);
      if (!responseUploadImg.success) return;

      const response = await addCategory({ ...formValue, img: responseUploadImg.result });
      if (response.success) {
        addToast({
          id: toastList.length + 1,
          title: 'Thành công',
          content: response.message,
          type: 'success',
        });
        setFormValue({
          name: '',
        });
        setFile();
        setImgPreview();
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

  // upload Img category children

  const [fileChild, setFileChild] = useState();
  const [imgChildPreview, setImgChildPreview] = useState();
  const onChangeImgChild = (event) => {
    const file = event.target.files[0];
    file.preview = URL.createObjectURL(file);
    setImgChildPreview(file);
    setFileChild(file);
  };

  const handleAddChildren = async (formValueChild) => {
    if (!fileChild) {
      addToast({
        id: toastList.length + 1,
        title: 'Thất bại',
        content: 'Bạn chưa chọn hình ảnh',
        type: 'warning',
      });
      return;
    }
    try {
      const responseUploadImg = await handleUploadFile(fileChild);
      const response = await addCategoryChild({
        slug: category.slug,
        newCategoryChildren: { ...formValueChild, childrenImg: responseUploadImg.result },
      });
      if (response.success) {
        setModel(false);
        setFormValueChild({
          childrenName: '',
          childrenImg: '',
        });
        addToast({
          id: toastList.length + 1,
          title: 'Thành công',
          content: response.message,
          type: 'success',
        });
        setImgChildPreview();
        setFileChild();
      } else {
        setModel(false);
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

  // alert
  const { alertShow } = useContext(AlertContext);

  let body = null;
  if (categoriesLoading) {
    body = <Spinner />;
  } else {
    body = (
      <div className={cx('wrapper')}>
        <div className={cx('content')}>
          <div className={cx('header-title')}>
            <p className={cx('header')}> Danh mục sản phẩm</p>
          </div>
          <ul className={cx('list')}>
            {categories &&
              categories.map((category, index) => (
                <div key={index} className={cx('body')}>
                  <div className={cx('category')}>
                    <div className={cx('category-main')}>
                      <div className={cx('main-info')}>
                        <img className={cx('img')} src={category.img} alt={category.name}></img>
                        <p className={cx('text')}>{category.name}</p>
                      </div>
                      <div className={cx('main-btn')}>
                        <Button
                          deleted
                          className={cx('delete-btn')}
                          onClick={() => {
                            alertShow({
                              title: 'Bạn có muốn xóa danh mục sản phẩm này không?',
                              data: category._id,
                              successFunction: deleteCategory,
                            });
                          }}
                        >
                          Xóa danh mục
                        </Button>
                      </div>
                    </div>
                    <div className={cx('category-child-body')}>
                      {category.children.length > 0 &&
                        category.children.map((categoryChildren, index) => (
                          <div className={cx('children')} key={index}>
                            <div className={cx('children-header')}>
                              <img
                                className={cx('img')}
                                src={categoryChildren.childrenImg}
                                alt={categoryChildren.childrenName}
                              ></img>
                              <p className={cx('text')}>{categoryChildren.childrenName}</p>
                            </div>
                            <div
                              className={cx('child-btn-delete')}
                              onClick={() => handleDeleteCategoryChildren({ slug: category.slug, categoryChildren })}
                            >
                              <Button deleted>Xóa</Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <div className={cx('action')}>
                      <Button primary onClick={() => handleSetModel(category)}>
                        Thêm mới danh mục con
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </ul>

          <div className={cx('add-category')}>
            <p className={cx('add-title')}>Thêm mới danh mục</p>
            <form onSubmit={addCategorySubmit} className={cx('form')}>
              <div className={cx('form-group')}>
                <label className={cx('label')} htmlFor="name">
                  Tên danh mục:
                </label>
                <input
                  required
                  spellCheck={false}
                  className={cx('input')}
                  value={name}
                  type="text"
                  id="name"
                  name="name"
                  onChange={onChangeForm}
                ></input>
              </div>
              <div className={cx('form-group')}>
                <label className={cx('label-img')} htmlFor="img">
                  {!imgPreview && <span>Chọn hình ảnh</span>}
                  {imgPreview && (
                    <img className={cx('img-preview')} src={imgPreview.preview && imgPreview.preview}></img>
                  )}
                </label>
                <input hidden className={cx('input')} type="file" id="img" name="img" onChange={onChangeImg}></input>
              </div>
              <Button primary type="submit" className={cx('add-btn')}>
                nhấn để thêm mới
              </Button>
            </form>
          </div>
        </div>
        {model && (
          <div
            className={cx('model')}
            onClick={() => {
              handelCloseModel();
            }}
          >
            <div
              className={cx('add-category')}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className={cx('model-header')}>
                <p className={cx('add-title')}>Thêm mới danh mục con</p>
                <div
                  className={cx('model-close')}
                  onClick={() => {
                    handelCloseModel();
                  }}
                >
                  <FontAwesomeIcon className={cx('icon')} icon={faClose}></FontAwesomeIcon>
                </div>
              </div>

              <form className={cx('form')}>
                <div className={cx('form-group')}>
                  <label className={cx('label')} htmlFor="childrenName">
                    Tên danh mục:
                  </label>
                  <input
                    required
                    spellCheck={false}
                    className={cx('input')}
                    value={childrenName}
                    type="text"
                    id="childrenName"
                    name="childrenName"
                    onChange={onChangeFormChild}
                  ></input>
                </div>
                <div className={cx('form-group')}>
                  <label className={cx('label-img')} htmlFor="childrenImg">
                    {!imgChildPreview && <span>Chọn hình ảnh</span>}
                    {imgChildPreview && (
                      <img className={cx('img-preview')} src={imgChildPreview.preview && imgChildPreview.preview}></img>
                    )}
                  </label>
                  <input
                    hidden
                    className={cx('input')}
                    type="file"
                    id="childrenImg"
                    name="childrenImg"
                    onChange={onChangeImgChild}
                  ></input>
                </div>
                <Button
                  primary
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddChildren(formValueChild);
                  }}
                  className={cx('add-btn')}
                >
                  nhấn để thêm mới
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return body;
}

export default Category;
