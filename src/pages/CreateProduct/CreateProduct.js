import classNames from 'classnames/bind';
import styles from './CreateProduct.module.scss';
import { useState, useContext, useEffect, useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

import { ProductContext } from '~/contexts/ProductContext';
import config from '~/config';
import { CategoryContext } from '~/contexts/CategoryContext';
import Button from '~/components/Button';
import { ToastContext } from '~/contexts/ToastContext';
import ProductItemPreview from '~/components/ProductItemPreview';

const cx = classNames.bind(styles);

function CreateProduct() {
  const {
    categoryState: { categories, categoryChildren },
    getCategories,
    setCategoryChildren,
  } = useContext(CategoryContext);

  useEffect(() => {
    getCategories();
    // eslint-disable-next-line
  }, []);

  const { addProduct, uploadFile, uploadFiles } = useContext(ProductContext);

  const [formValue, setFormValue] = useState({
    name: '',
    category: '',
    categoryChild: '',
    gender: '',
    priceOld: '',
    priceCurrent: '',
    saleOffPercent: 0,
    saleOffLable: '',
  });

  const { name, category, categoryChild, gender, priceOld, priceCurrent, saleOffLable } = formValue;

  const onChangeForm = (event) => {
    event.preventDefault();
    setFormValue({
      ...formValue,
      [event.target.name]: event.target.value,
    });
  };

  // toast
  const {
    toastState: { toastList },
    addToast,
  } = useContext(ToastContext);

  const [showCategory, setShowCategory] = useState(false);

  const handleSetShow = () => {
    if (showCategory) {
      setShowCategory(false);
    } else {
      setShowCategory(true);
    }
  };

  const handleSetCategory = (category) => {
    setFormValue({
      ...formValue,
      category: category,
      categoryChild: '',
    });
  };

  const [showCategoryChildren, setShowCategoryChildren] = useState(false);

  const handleSetShowChildren = () => {
    if (showCategoryChildren) {
      setShowCategoryChildren(false);
    } else {
      setShowCategoryChildren(true);
    }
  };

  const handleSetCategoryChildren = (category) => {
    setFormValue({
      ...formValue,
      categoryChild: category,
    });
  };

  const handleCloseSelection = () => {
    setShowCategoryChildren(false);
    setShowCategory(false);
    setShowGender(false);
    setShowLableSaleOff(false);
  };

  // gender
  const [showGender, setShowGender] = useState(false);

  const handleSetShowGender = () => {
    if (showGender) {
      setShowGender(false);
    } else {
      setShowGender(true);
    }
  };

  const handleSetGender = (gender) => {
    setFormValue({
      ...formValue,
      gender: gender,
    });
  };

  // lable sale off
  const [showLableSaleOff, setShowLableSaleOff] = useState(false);

  const handleSetShowLableSaleOff = () => {
    if (showLableSaleOff) {
      setShowLableSaleOff(false);
    } else {
      setShowLableSaleOff(true);
    }
  };

  const handleSetLableSaleOff = (label) => {
    setFormValue({
      ...formValue,
      saleOffLable: label,
    });
  };

  let percent = 0;
  if (priceCurrent && priceOld) {
    if (Number(priceCurrent) < Number(priceOld)) {
      percent = Number.isInteger(((priceOld - priceCurrent) / priceOld) * 100)
        ? ((priceOld - priceCurrent) / priceOld) * 100
        : (((priceOld - priceCurrent) / priceOld) * 100).toFixed(1);
    } else if (Number(priceCurrent) > Number(priceOld)) {
      percent = Number.isInteger(((priceCurrent - priceOld) / priceOld) * 100)
        ? ((priceCurrent - priceOld) / priceOld) * 100
        : (((priceCurrent - priceOld) / priceOld) * 100).toFixed(1);
    }
  } else {
    percent = 0;
  }

  // handle image

  const [avatar, setAvatar] = useState();
  const [slideUrl, setSlideImg] = useState([]);
  const [amountImg, setAmountImg] = useState();

  const [file, setFile] = useState();
  const [files, setFiles] = useState();

  const handleOnChangeAvatar = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setAvatar(URL.createObjectURL(selectedFile));
  };

  const handleOnChangeImgSlide = (e) => {
    const selectedImgs = e.target.files;
    setFiles(selectedImgs);
    const selectedFilesArray = Array.from(selectedImgs);
    const imagesArray = selectedFilesArray.map((file) => {
      return URL.createObjectURL(file);
    });
    setSlideImg(imagesArray);
    setAmountImg(imagesArray.length);
  };

  function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
    );
  }

  const handleUploadFile = async () => {
    let dataSingle = new FormData();

    const imgId = uuidv4();
    const blob = file.slice(0, file.size, 'image/jpeg');
    const newFile = new File([blob], `${imgId}_product.jpeg`, { type: 'image/jpeg' });
    dataSingle.append('file', newFile);

    let data = new FormData();
    _.forEach(files, (file) => {
      const imgId = uuidv4();
      const blob = file.slice(0, file.size, 'image/jpeg');
      const newFile = new File([blob], `${imgId}_product.jpeg`, { type: 'image/jpeg' });
      data.append('files', newFile);
    });

    try {
      const response = await uploadFiles(data);
      const responseSingle = await uploadFile(dataSingle);
      return { response, responseSingle };
    } catch (error) {
      console.log(error);
    }
  };

  const [createdLoading, setCreatedLoading] = useState(false);

  const addProductSubmit = async (event) => {
    event.preventDefault();
    if (!name || !valueDescription) {
      addToast({
        id: toastList.length + 1,
        title: 'Thất bại',
        content: 'Vui lòng nhập thông tin sản phẩm trước khi đăng',
        type: 'error',
      });
      return;
    }
    if (!file || !files) {
      addToast({
        id: toastList.length + 1,
        title: 'Thất bại',
        content: 'Vui lòng chọn hình ảnh',
        type: 'error',
      });
      return;
    }
    setCreatedLoading(true);
    try {
      const uploadImg = await handleUploadFile();
      if (uploadImg.responseSingle.success && uploadImg.response.success) {
        const data = {
          ...formValue,
          description: valueDescription,
          img: uploadImg.responseSingle.result,
          imgSlide: uploadImg.response.result,
          saleOffPercent: percent,
        };
        const response = await addProduct(data);
        if (response.success) {
          setFormValue({
            name: '',
            category: '',
            categoryChild: '',
            gender: '',
            priceOld: '',
            priceCurrent: '',
            saleOffPercent: '',
            saleOffLable: '',
          });
          addToast({
            id: toastList.length + 1,
            title: 'Thành công',
            content: response.message,
            type: 'success',
          });

          setFiles();
          setFile();
          setAmountImg();
          setAvatar();
          setSlideImg([]);
          setValueDescription('');
          setCreatedLoading(false);
        } else {
          addToast({
            id: toastList.length + 1,
            title: 'Thất bại',
            content: response.message,
            type: 'error',
          });
          setCreatedLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // rich editor
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
          if (responseSingle.success) {
            const url = responseSingle.success && responseSingle.result;
            const index = editor.getSelection()?.index; // get cursor position
            editor.insertEmbed(index, 'image', url);
            return;
          }
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
    <div className={cx('create-product')}>
      <div className={cx('create__container', ['col', 'l-12', 'm-12', 'c-12'])} onClick={handleCloseSelection}>
        <h2 className={cx('create__tilte')}>Đăng mới sản phẩm</h2>
        <form
          spellCheck="false"
          className={cx('create__form')}
          onSubmit={addProductSubmit}
          encType="multipart/form-data"
        >
          <div className={cx('create__form-all')}>
            <label className={cx('create__form-all-lable')} htmlFor="name">
              Tên sản phẩm:
            </label>
            <input
              spellCheck="false"
              type="text"
              value={name}
              className={cx('create__form-all-input')}
              onChange={onChangeForm}
              id="name"
              placeholder=""
              name="name"
            />
          </div>

          <div className={cx('create__form-all')}>
            <label className={cx('create__form-all-lable')} htmlFor="description">
              Mô tả sản phẩm:
            </label>

            <ReactQuill
              theme="snow"
              ref={quillRef}
              value={valueDescription}
              modules={modules}
              onChange={setValueDescription}
            />
          </div>

          <div className={cx('create__form-all')} onClick={(e) => e.stopPropagation()}>
            <label className={cx('create__form-all-lable')} onClick={handleSetShow}>
              Danh mục sản phẩm:
            </label>
            <div className={cx('category-content')}>
              <div className={cx('category-main')}>
                <div className={cx('content-title')} onClick={handleSetShow}>
                  <p className={cx('content-text')}>
                    {category ? category : <span>-- Chọn danh mục sản phẩm --</span>}
                  </p>
                  <FontAwesomeIcon className={cx('content-icon')} icon={faChevronDown} onClick={handleSetShow} />
                </div>
                {showCategory && (
                  <div className={cx('category-body')}>
                    {categories && categories.length > 0 ? (
                      categories.map((category, index) => (
                        <div
                          className={cx('category-option')}
                          key={index}
                          onClick={() => {
                            handleSetShow();
                            handleSetCategory(category.name);
                            setCategoryChildren(category);
                          }}
                        >
                          <p className={cx('option-text')}>{category.name}</p>
                        </div>
                      ))
                    ) : (
                      <div className={cx('category-option')}>
                        <p className={cx('option-text')}>Chưa có danh mục sản phẩm nào </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={cx('create__form-all')} onClick={(e) => e.stopPropagation()}>
            <label className={cx('create__form-all-lable')} onClick={handleSetShowChildren}>
              Danh mục sản phẩm con:
            </label>
            <div className={cx('category-content')}>
              <div className={cx('category-main')}>
                <div className={cx('content-title')} onClick={handleSetShowChildren}>
                  <p className={cx('content-text')}>
                    {categoryChild ? categoryChild : <span>-- Chọn danh mục sản phẩm con --</span>}
                  </p>
                  <FontAwesomeIcon
                    className={cx('content-icon')}
                    icon={faChevronDown}
                    onClick={handleSetShowChildren}
                  />
                </div>
                {showCategoryChildren && (
                  <div className={cx('category-body', 'children')}>
                    {categoryChildren && categoryChildren.length > 0 ? (
                      categoryChildren.map((item, index) => (
                        <div
                          className={cx('category-option')}
                          key={index}
                          onClick={() => {
                            handleSetShowChildren();
                            handleSetCategoryChildren(item.childrenName);
                          }}
                        >
                          <p className={cx('option-text')}>{item.childrenName}</p>
                        </div>
                      ))
                    ) : (
                      <div className={cx('category-option')}>
                        <p className={cx('option-text')}>Chưa có danh mục con nào </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* gender */}

          <div className={cx('create__form-all')} onClick={(e) => e.stopPropagation()}>
            <label className={cx('create__form-all-lable')} onClick={handleSetShowGender}>
              Giới tính:
            </label>
            <div className={cx('category-content')}>
              <div className={cx('category-main')}>
                <div className={cx('content-title')} onClick={handleSetShowGender}>
                  <p className={cx('content-text')}>{gender ? gender : <span>-- Chọn giới tính --</span>}</p>
                  <FontAwesomeIcon className={cx('content-icon')} icon={faChevronDown} onClick={handleSetShowGender} />
                </div>
                {showGender && (
                  <div className={cx('category-body')}>
                    <div
                      className={cx('category-option')}
                      onClick={() => {
                        handleSetShowGender();
                        handleSetGender('Nam');
                      }}
                    >
                      <p className={cx('option-text')}>Nam</p>
                    </div>
                    <div
                      className={cx('category-option')}
                      onClick={() => {
                        handleSetShowGender();
                        handleSetGender('Nữ');
                      }}
                    >
                      <p className={cx('option-text')}>Nữ</p>
                    </div>
                    <div
                      className={cx('category-option')}
                      onClick={() => {
                        handleSetShowGender();
                        handleSetGender('Dùng cho cả nam và nữ');
                      }}
                    >
                      <p className={cx('option-text')}>Dùng cho cả nam và nữ</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={cx('create__form-all')}>
            <label className={cx('create__form-all-lable')} htmlFor="priceOld">
              Giá cũ:
            </label>
            <input
              spellCheck="false"
              type="number"
              onWheel={() => document.activeElement.blur()}
              className={cx('create__form-all-input')}
              id="priceOld"
              placeholder="đồng"
              name="priceOld"
              value={priceOld}
              onChange={onChangeForm}
            />
          </div>

          <div className={cx('create__form-all')}>
            <label className={cx('create__form-all-lable')} htmlFor="priceCurrent">
              Giá hiện tại:
            </label>
            <input
              spellCheck="false"
              type="number"
              onWheel={() => document.activeElement.blur()}
              className={cx('create__form-all-input')}
              id="priceCurrent"
              placeholder="đồng"
              name="priceCurrent"
              value={priceCurrent}
              onChange={onChangeForm}
            />
          </div>

          <div className={cx('create__form-all')} onClick={(e) => e.stopPropagation()}>
            <label className={cx('create__form-all-lable')} onClick={handleSetShowLableSaleOff}>
              Nhãn giảm giá:
            </label>
            <div className={cx('category-content')}>
              <div className={cx('category-main')}>
                <div className={cx('content-title')} onClick={handleSetShowLableSaleOff}>
                  <p className={cx('content-text')}>
                    {saleOffLable ? saleOffLable : <span>-- Chọn nhãn giảm giá --</span>}
                  </p>
                  <FontAwesomeIcon
                    className={cx('content-icon')}
                    icon={faChevronDown}
                    onClick={handleSetShowLableSaleOff}
                  />
                </div>
                {showLableSaleOff && (
                  <div className={cx('category-body')}>
                    <div
                      className={cx('category-option')}
                      onClick={() => {
                        handleSetShowLableSaleOff();
                        handleSetLableSaleOff('TĂNG');
                      }}
                    >
                      <p className={cx('option-text')}>Tăng giá</p>
                    </div>
                    <div
                      className={cx('category-option')}
                      onClick={() => {
                        handleSetShowLableSaleOff();
                        handleSetLableSaleOff('GIẢM');
                      }}
                    >
                      <p className={cx('option-text')}>Giảm giá</p>
                    </div>
                    <div
                      className={cx('category-option')}
                      onClick={() => {
                        handleSetShowLableSaleOff();
                        handleSetLableSaleOff('');
                      }}
                    >
                      <p className={cx('option-text')}>Không chọn</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={cx('create__form-all')}>
            <label className={cx('create__form-all-lable')} htmlFor="saleOffPercent">
              Phần trăm giảm giá:
            </label>
            <input
              spellCheck="false"
              type="number"
              className={cx('create__form-all-input')}
              id="saleOffPercent"
              placeholder="%"
              name="saleOffPercent"
              value={percent}
              onChange={onChangeForm}
            />
          </div>

          {/* images */}

          <div className={cx('create__form-img')}>
            <label className={cx('label-img')} htmlFor="img">
              <span> Chọn ảnh chính</span>
            </label>
            <input
              type="file"
              className={cx('create__form-all-input')}
              id="img"
              hidden
              placeholder=""
              name="img"
              onChange={handleOnChangeAvatar}
            />
            <label className={cx('label-img')} htmlFor="img-slide">
              <span> Chọn ảnh chi tiết {amountImg && `(${amountImg}) ảnh`}</span>
            </label>
            <input
              type="file"
              multiple
              hidden
              className={cx('create__form-all-input')}
              id="img-slide"
              placeholder=""
              name="img"
              onChange={handleOnChangeImgSlide}
            />
          </div>
          <div className={cx('preview')}>
            <p className={cx('preview-title')}>Xem trước sản phẩm</p>
            <div className={cx('product-preview')}>
              <ProductItemPreview
                product={{
                  ...formValue,
                  img: avatar,
                  imgSlide: slideUrl,
                  saleOffPercent: percent,
                }}
              />
            </div>
          </div>

          <div className={cx('button')}>
            <Button primary to={config.routes.products} className={cx('btn_create')}>
              Quay lại
            </Button>
            {createdLoading === true ? (
              <Button disable primary className={cx('btn_create')}>
                Đang đăng sản phẩm
              </Button>
            ) : (
              <Button primary type="submit" className={cx('btn_create')}>
                Thêm mới sản phẩm
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProduct;
