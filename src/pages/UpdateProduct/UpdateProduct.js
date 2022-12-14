import classNames from 'classnames/bind';
import styles from './UpdateProduct.module.scss';
import { useParams, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { ProductContext } from '~/contexts/ProductContext';
import { ToastContext } from '~/contexts/ToastContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import ProductItemPreview from '~/components/ProductItemPreview';
import _ from 'lodash';

import config from '~/config';
import Button from '~/components/Button';
import { CategoryContext } from '~/contexts/CategoryContext';

const cx = classNames.bind(styles);

function UpdateProduct() {
  let { slug } = useParams();
  const {
    productState: { product },
    getProduct,
    updateProduct,
    uploadFile,
    uploadFiles,
  } = useContext(ProductContext);

  const {
    categoryState: { categories, categoryChildren },
    setCategoryChildren,
    getCategories,
  } = useContext(CategoryContext);

  useEffect(() => {
    getCategories();
    // eslint-disable-next-line
  }, []);

  // get one product with slug
  useEffect(() => {
    getProduct(slug);
    // eslint-disable-next-line
  }, []);

  const [formValue, setFormValue] = useState({
    name: '',
    description: '',
    category: '',
    categoryChild: '',
    gender: '',
    priceOld: '',
    priceCurrent: '',
    saleOffLable: '',
    saleOffPercent: 0,
  });

  useEffect(() => {
    if (product) {
      setFormValue(product);
    } // eslint-disable-next-line
  }, [product]);

  const { name, description, category, categoryChild, gender, priceOld, priceCurrent, saleOffLable } = formValue;

  const {
    toastState: { toastList },
    addToast,
  } = useContext(ToastContext);

  let navigate = useNavigate();

  const onChangeForm = (event) => {
    setFormValue({
      ...formValue,
      [event.target.name]: event.target.value,
    });
  };

  // category
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

  // handle image
  const [avatar, setAvatar] = useState();
  const [slideUrl, setSlideImg] = useState([]);
  const [amountImg, setAmountImg] = useState();

  const [file, setFile] = useState();
  const [files, setFiles] = useState();
  const [updateLoading, setUpdateLoading] = useState(false);

  const handleOnChangeAvatar = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setAvatar(URL.createObjectURL(selectedFile));
  };

  useEffect(() => {
    setFormValue({
      ...formValue,
      img: avatar,
    });
    // eslint-disable-next-line
  }, [avatar]);

  useEffect(() => {
    setFormValue({
      ...formValue,
      imgSlide: slideUrl,
    });
    // eslint-disable-next-line
  }, [slideUrl]);

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

  let percent = 0;
  if (priceCurrent && priceOld) {
    if (Number(priceCurrent) < Number(priceOld)) {
      percent = Number.isInteger(((priceOld - priceCurrent) / priceOld) * 100)
        ? ((priceOld - priceCurrent) / priceOld) * 100
        : (((priceOld - priceCurrent) / priceOld) * 100).toFixed(1);
    } else {
      percent = Number.isInteger(((priceCurrent - priceOld) / priceOld) * 100)
        ? ((priceCurrent - priceOld) / priceOld) * 100
        : (((priceCurrent - priceOld) / priceOld) * 100).toFixed(1);
    }
  } else {
    percent = 0;
  }

  // upload files
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

    try {
      const responseSingle = await uploadFile(dataSingle);
      return responseSingle;
    } catch (error) {
      console.log(error);
    }
  };

  const handleUploadFiles = async () => {
    let data = new FormData();
    _.forEach(files, (file) => {
      const imgId = uuidv4();
      const blob = file.slice(0, file.size, 'image/jpeg');
      const newFile = new File([blob], `${imgId}_product.jpeg`, { type: 'image/jpeg' });
      data.append('files', newFile);
    });

    try {
      const response = await uploadFiles(data);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  // handle update
  const updateProductSubmit = async (event) => {
    event.preventDefault();
    setUpdateLoading(true);
    try {
      if (!file && !files) {
        const data = {
          ...formValue,
          saleOffPercent: percent,
        };
        const response = await updateProduct(data);
        if (response.success) {
          addToast({
            id: toastList.length + 1,
            title: 'Th??nh c??ng',
            content: response.message,
            type: 'success',
          });
          setFiles();
          setFile();
          setAmountImg();
          setAvatar();
          setSlideImg([]);
          setUpdateLoading(false);

          navigate(`${config.routes.products}/${slug}`);
          setFormValue({
            name: '',
            description: '',
            category: '',
            categoryChild: '',
            gender: '',
            priceOld: '',
            priceCurrent: '',
            saleOffLable: '',
            saleOffPercent: '',
            bought: '',
          });
        } else {
          addToast({
            id: toastList.length + 1,
            title: 'Th???t b???i',
            content: response.message,
            type: 'error',
          });
          setUpdateLoading(false);
        }
      } else if (file && !files) {
        const uploadImg = await handleUploadFile();
        if (uploadImg.success) {
          const data = {
            ...formValue,
            img: uploadImg.result,
            saleOffPercent: percent,
          };
          const response = await updateProduct(data);
          if (response.success) {
            addToast({
              id: toastList.length + 1,
              title: 'Th??nh c??ng',
              content: response.message,
              type: 'success',
            });
            setFiles();
            setFile();
            setAmountImg();
            setAvatar();
            setSlideImg([]);
            setUpdateLoading(false);

            navigate(`${config.routes.products}/${slug}`);
            setFormValue({
              name: '',
              description: '',
              category: '',
              categoryChild: '',
              gender: '',
              priceOld: '',
              priceCurrent: '',
              saleOffLable: '',
              saleOffPercent: '',
              bought: '',
            });
          } else {
            addToast({
              id: toastList.length + 1,
              title: 'Th???t b???i',
              content: response.message,
              type: 'error',
            });
            setUpdateLoading(false);
          }
        }
      } else if (files && !file) {
        const uploadImgs = await handleUploadFiles();
        if (uploadImgs.success) {
          const data = {
            ...formValue,
            imgSlide: uploadImgs.result,
            saleOffPercent: percent,
          };
          const response = await updateProduct(data);
          if (response.success) {
            addToast({
              id: toastList.length + 1,
              title: 'Th??nh c??ng',
              content: response.message,
              type: 'success',
            });
            setFiles();
            setFile();
            setAmountImg();
            setAvatar();
            setSlideImg([]);
            setUpdateLoading(false);

            navigate(`${config.routes.products}/${slug}`);
            setFormValue({
              name: '',
              description: '',
              category: '',
              categoryChild: '',
              gender: '',
              priceOld: '',
              priceCurrent: '',
              saleOffLable: '',
              saleOffPercent: '',
              bought: '',
            });
          } else {
            addToast({
              id: toastList.length + 1,
              title: 'Th???t b???i',
              content: response.message,
              type: 'error',
            });
            setUpdateLoading(false);
          }
        }
      } else {
        const uploadImg = await handleUploadFile();
        const uploadImgs = await handleUploadFiles();
        if (uploadImg.success && uploadImgs.success) {
          const data = {
            ...formValue,
            img: uploadImg.result,
            imgSlide: uploadImgs.result,
            saleOffPercent: percent,
          };
          const response = await updateProduct(data);
          if (response.success) {
            addToast({
              id: toastList.length + 1,
              title: 'Th??nh c??ng',
              content: response.message,
              type: 'success',
            });
            setFiles();
            setFile();
            setAmountImg();
            setAvatar();
            setSlideImg([]);
            setUpdateLoading(false);

            navigate(`${config.routes.products}/${slug}`);
            setFormValue({
              name: '',
              description: '',
              category: '',
              categoryChild: '',
              gender: '',
              priceOld: '',
              priceCurrent: '',
              saleOffLable: '',
              saleOffPercent: '',
              bought: '',
            });
          } else {
            addToast({
              id: toastList.length + 1,
              title: 'Th???t b???i',
              content: response.message,
              type: 'error',
            });
            setUpdateLoading(false);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  let body;
  if (product) {
    body = (
      <div className={cx('create-product')} onClick={handleCloseSelection}>
        <div className={cx('create__container', ['col', 'l-12', 'm-12', 'c-12'])}>
          <h2 className={cx('create__tilte')}>Ch???nh s???a s???n ph???m</h2>
          <form className={cx('create__form')} onSubmit={updateProductSubmit}>
            <div className={cx('create__form-all')}>
              <label className={cx('create__form-all-lable')} htmlFor="name">
                T??n s???n ph???m:
              </label>
              <input
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
                M?? t??? s???n ph???m:
              </label>
              <textarea
                rows="6"
                spellCheck="false"
                className={cx('create__form-all-input')}
                id="description"
                placeholder=""
                name="description"
                value={description}
                onChange={onChangeForm}
              ></textarea>
            </div>

            <div className={cx('create__form-all')} onClick={(e) => e.stopPropagation()}>
              <label className={cx('create__form-all-lable')} onClick={handleSetShow}>
                Danh m???c s???n ph???m:
              </label>
              <div className={cx('category-content')}>
                <div className={cx('category-main')}>
                  <div className={cx('content-title')} onClick={handleSetShow}>
                    <p className={cx('content-text')}>
                      {category ? category : <span>-- Ch???n danh m???c s???n ph???m --</span>}
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
                          <p className={cx('option-text')}> Ch??a c?? danh m???c s???n ph???m n??o </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={cx('create__form-all')} onClick={(e) => e.stopPropagation()}>
              <label className={cx('create__form-all-lable')} onClick={handleSetShowChildren}>
                Danh m???c s???n ph???m con:
              </label>
              <div className={cx('category-content')}>
                <div className={cx('category-main')}>
                  <div className={cx('content-title')} onClick={handleSetShowChildren}>
                    <p className={cx('content-text')}>
                      {categoryChild ? categoryChild : <span>-- Ch???n danh m???c s???n ph???m con --</span>}
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
                          <p className={cx('option-text')}>Ch??a c?? danh m???c con n??o </p>
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
                Gi???i t??nh:
              </label>
              <div className={cx('category-content')}>
                <div className={cx('category-main')}>
                  <div className={cx('content-title')} onClick={handleSetShowGender}>
                    <p className={cx('content-text')}>{gender ? gender : <span>-- Ch???n gi???i t??nh --</span>}</p>
                    <FontAwesomeIcon
                      className={cx('content-icon')}
                      icon={faChevronDown}
                      onClick={handleSetShowGender}
                    />
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
                          handleSetGender('N???');
                        }}
                      >
                        <p className={cx('option-text')}>N???</p>
                      </div>
                      <div
                        className={cx('category-option')}
                        onClick={() => {
                          handleSetShowGender();
                          handleSetGender('D??ng cho c??? nam v?? n???');
                        }}
                      >
                        <p className={cx('option-text')}>D??ng cho c??? nam v?? n???</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={cx('create__form-all')}>
              <label className={cx('create__form-all-lable')} htmlFor="priceOld">
                Gi?? c??:
              </label>
              <input
                spellCheck="false"
                type="number"
                className={cx('create__form-all-input')}
                id="priceOld"
                placeholder=""
                name="priceOld"
                value={priceOld}
                onChange={onChangeForm}
              />
            </div>

            <div className={cx('create__form-all')}>
              <label className={cx('create__form-all-lable')} htmlFor="priceCurrent">
                Gi?? hi???n t???i:
              </label>
              <input
                spellCheck="false"
                type="number"
                className={cx('create__form-all-input')}
                id="priceCurrent"
                placeholder=""
                name="priceCurrent"
                value={priceCurrent}
                onChange={onChangeForm}
              />
            </div>

            <div className={cx('create__form-all')} onClick={(e) => e.stopPropagation()}>
              <label className={cx('create__form-all-lable')} onClick={handleSetShowLableSaleOff}>
                Nh??n gi???m gi??:
              </label>
              <div className={cx('category-content')}>
                <div className={cx('category-main')}>
                  <div className={cx('content-title')} onClick={handleSetShowLableSaleOff}>
                    <p className={cx('content-text')}>
                      {saleOffLable ? saleOffLable : <span>-- Ch???n nh??n gi???m gi?? --</span>}
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
                          handleSetLableSaleOff('T??NG');
                        }}
                      >
                        <p className={cx('option-text')}>T??ng gi??</p>
                      </div>
                      <div
                        className={cx('category-option')}
                        onClick={() => {
                          handleSetShowLableSaleOff();
                          handleSetLableSaleOff('GI???M');
                        }}
                      >
                        <p className={cx('option-text')}>Gi???m gi??</p>
                      </div>
                      <div
                        className={cx('category-option')}
                        onClick={() => {
                          handleSetShowLableSaleOff();
                          handleSetLableSaleOff('');
                        }}
                      >
                        <p className={cx('option-text')}>Kh??ng ch???n</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={cx('create__form-all')}>
              <label className={cx('create__form-all-lable')} htmlFor="saleOffPercent">
                Ph???n tr??m gi???m gi??:
              </label>
              <input
                type="number"
                className={cx('create__form-all-input')}
                id="saleOffPercent"
                placeholder=""
                name="saleOffPercent"
                value={percent}
                onChange={onChangeForm}
              />
            </div>

            <div className={cx('create__form-img')}>
              <label className={cx('label-img')} htmlFor="img">
                <span> Ch???n ???nh ch??nh</span>
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
                <span> Ch???n ???nh chi ti???t {amountImg && `(${amountImg}) ???nh`}</span>
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
              <p className={cx('preview-title')}>Xem tr?????c s???n ph???m</p>
              <div className={cx('product-preview')}>
                {product && (
                  <ProductItemPreview
                    product={{
                      ...formValue,
                      saleOffPercent: percent,
                    }}
                  />
                )}
              </div>
            </div>

            <div className={cx('btn')}>
              <Button primary to={config.routes.products} className={cx('btn_create')}>
                Quay l???i
              </Button>
              {updateLoading === true ? (
                <Button disable primary className={cx('btn_create')}>
                  ??ang ch???nh s???a
                </Button>
              ) : (
                <Button primary type="submit" className={cx('btn_create')}>
                  L??u l???i
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }
  return body;
}

export default UpdateProduct;
