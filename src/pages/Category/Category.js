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
    updatedCategory,
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

  // updated category
  const [updated, setUpdated] = useState(false);

  const handelCloseModelUpdated = () => {
    setUpdated(false);
    setImgPreviewCategoryUpdated(false);
  };

  const [imgPreviewCategoryUpdated, setImgPreviewCategoryUpdated] = useState();
  const [fileUpdated, setFileUpdated] = useState();

  const onChangeImgCategoryUpdated = (event) => {
    const file = event.target.files[0];
    setFileUpdated(file);
    setImgPreviewCategoryUpdated(URL.createObjectURL(file));
  };

  const [nameCategoryUpdated, setNameCategoryUpdated] = useState('');

  const handleUpdatedCategory = (category) => {
    chooseCategory(category);
    setNameCategoryUpdated(category.name);
    setUpdated(true);
    setImgPreviewCategoryUpdated(category.img);
  };

  const onChangeNameCategoryUpdated = (event) => {
    event.preventDefault();
    setNameCategoryUpdated(event.target.value);
  };

  const handleUpdatedCategorySubmit = async (category) => {
    if (!fileUpdated) {
      const response = await updatedCategory({ id: category._id, name: nameCategoryUpdated, img: category.img });
      if (response.success) {
        addToast({
          id: toastList.length + 1,
          title: 'Thành công',
          content: response.message,
          type: 'success',
        });
        setUpdated(false);
        setFileUpdated();
        setNameCategoryUpdated('');
      } else {
        addToast({
          id: toastList.length + 1,
          title: 'Thất bại',
          content: response.message,
          type: 'error',
        });
      }
    } else {
      const responseImg = await handleUploadFile(fileUpdated);
      if (!responseImg.success) {
        console.log(responseImg.message);
        return;
      } else {
        const res = await updatedCategory({ id: category._id, name: nameCategoryUpdated, img: responseImg.result });
        if (res.success) {
          addToast({
            id: toastList.length + 1,
            title: 'Thành công',
            content: res.message,
            type: 'success',
          });
          setUpdated(false);
          setFileUpdated();
          setNameCategoryUpdated('');
        } else {
          addToast({
            id: toastList.length + 1,
            title: 'Thất bại',
            content: res.message,
            type: 'error',
          });
        }
      }
    }
  };

  // return

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
              categories.map((cate, index) => (
                <div key={index} className={cx('body')}>
                  <div className={cx('category')}>
                    <div className={cx('category-main')}>
                      <div className={cx('main-info')}>
                        <img className={cx('img')} src={cate.img} alt={cate.name}></img>
                        <p className={cx('text')}>{cate.name}</p>
                      </div>
                      <div className={cx('main-btn')}>
                        <Button primary onClick={() => handleUpdatedCategory(cate)}>
                          Chỉnh sửa
                        </Button>
                        {updated && (
                          <div
                            className={cx('model')}
                            onClick={() => {
                              handelCloseModelUpdated();
                            }}
                          >
                            <div
                              className={cx('add-category')}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <div className={cx('model-header')}>
                                <p className={cx('add-title')}>Chỉnh sửa danh mục</p>
                                <div
                                  className={cx('model-close')}
                                  onClick={() => {
                                    handelCloseModelUpdated();
                                  }}
                                >
                                  <FontAwesomeIcon className={cx('icon')} icon={faClose}></FontAwesomeIcon>
                                </div>
                              </div>

                              <form className={cx('form')}>
                                <div className={cx('form-group')}>
                                  <label className={cx('label')} htmlFor="nameCategoryUpdated">
                                    Tên danh mục:
                                  </label>
                                  <input
                                    required
                                    spellCheck={false}
                                    className={cx('input')}
                                    value={nameCategoryUpdated}
                                    type="text"
                                    id="nameCategoryUpdated"
                                    name="nameCategoryUpdated"
                                    onChange={onChangeNameCategoryUpdated}
                                  ></input>
                                </div>
                                <div className={cx('form-group')}>
                                  <label className={cx('label-img')} htmlFor="updatedCategoryImg">
                                    {imgPreviewCategoryUpdated ? (
                                      <img className={cx('img')} src={imgPreviewCategoryUpdated} alt=""></img>
                                    ) : (
                                      <img className={cx('img')} src={category.img} alt={category.name}></img>
                                    )}
                                  </label>
                                  <input
                                    hidden
                                    className={cx('input')}
                                    type="file"
                                    id="updatedCategoryImg"
                                    name="updatedCategoryImg"
                                    onChange={onChangeImgCategoryUpdated}
                                  ></input>
                                </div>
                                <Button
                                  primary
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleUpdatedCategorySubmit(category);
                                  }}
                                  className={cx('add-btn')}
                                >
                                  Lưu lại
                                </Button>
                              </form>
                            </div>
                          </div>
                        )}
                        <Button
                          deleted
                          className={cx('delete-btn')}
                          onClick={() => {
                            alertShow({
                              title: 'Bạn có muốn xóa danh mục sản phẩm này không?',
                              data: cate._id,
                              successFunction: deleteCategory,
                            });
                          }}
                        >
                          Xóa danh mục
                        </Button>
                      </div>
                    </div>
                    <div className={cx('category-child-body')}>
                      {cate.children.length > 0 &&
                        cate.children.map((categoryChildren, index) => (
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
                              onClick={() => handleDeleteCategoryChildren({ slug: cate.slug, categoryChildren })}
                            >
                              <Button deleted>Xóa</Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <div className={cx('action')}>
                      <Button primary onClick={() => handleSetModel(cate)}>
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
                    <img className={cx('img-preview')} alt="" src={imgPreview.preview && imgPreview.preview}></img>
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
                      <img
                        className={cx('img-preview')}
                        alt=""
                        src={imgChildPreview.preview && imgChildPreview.preview}
                      ></img>
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
