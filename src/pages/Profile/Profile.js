import classNames from 'classnames/bind';
import { useContext, useEffect, useState } from 'react';
import Button from '~/components/Button';
import { AuthContext } from '~/contexts/AuthContext';
import { ProductContext } from '~/contexts/ProductContext';
import { ToastContext } from '~/contexts/ToastContext';
import styles from './Profile.module.scss';

const cx = classNames.bind(styles);

function Profile() {
  const {
    authState: { user },
    updatedUser,
    changePassword,
  } = useContext(AuthContext);
  const { username, img } = user;
  const { uploadFile } = useContext(ProductContext);

  const {
    toastState: { toastList },
    addToast,
  } = useContext(ToastContext);
  const [avatar, setAvatar] = useState();
  const [file, setFile] = useState();

  useEffect(() => {
    return () => {
      avatar && URL.revokeObjectURL(avatar.preview);
    };
  });
  const handlePreviewAvatar = (event) => {
    const file = event.target.files[0];
    file.preview = URL.createObjectURL(file);
    setAvatar(file);
    setFile(file);
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

    try {
      const response = await uploadFile(dataSingle);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeAvatar = async (event) => {
    event.preventDefault();
    if (!file) return;
    try {
      const response = await handleUploadFile();
      if (response.success) {
        const res = await updatedUser({
          username,
          img: response.result,
        });
        if (res.success) {
          addToast({
            id: toastList.length + 1,
            title: 'Thành công',
            content: res.message,
            type: 'success',
          });
          setAvatar();
          setFile();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [model, setModel] = useState(false);
  const [formValue, setFormValue] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const { oldPassword, newPassword, confirmPassword } = formValue;

  const handelOnchange = (event) => {
    setFormValue({
      ...formValue,
      [event.target.name]: event.target.value,
    });
  };

  const [warning, setWarning] = useState({
    warningOldPassword: false,
    warningNewPassword: false,
    warningConfirmPassword: false,
  });

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (oldPassword === '' && newPassword === '' && confirmPassword === '') {
      setWarning({
        warningOldPassword: 'Bạn chưa nhập trường này',
        warningNewPassword: 'Bạn chưa nhập trường này',
        warningConfirmPassword: 'Bạn chưa nhập trường này',
      });
      return;
    } else if (oldPassword === '' && newPassword !== '' && confirmPassword !== '') {
      setWarning({
        ...warning,
        warningOldPassword: 'Bạn chưa nhập trường này',
      });
      return;
    } else if (oldPassword !== '' && newPassword === '' && confirmPassword !== '') {
      setWarning({
        ...warning,
        warningNewPassword: 'Bạn chưa nhập trường này',
      });
      return;
    } else if (oldPassword !== '' && newPassword !== '' && confirmPassword === '') {
      setWarning({
        ...warning,
        warningConfirmPassword: 'Bạn chưa nhập trường này',
      });
      return;
    }
    if (oldPassword === '' || newPassword === '' || confirmPassword === '') {
      return;
    }

    if (newPassword !== confirmPassword) {
      setWarning({
        ...warning,
        warningConfirmPassword: 'Mật khẩu mới không trùng nhau',
      });
      return;
    }
    try {
      const response = await changePassword({
        ...formValue,
        username,
      });
      if (response.success) {
        addToast({
          id: toastList.length + 1,
          title: 'Thành công',
          content: response.message,
          type: 'success',
        });
        setWarning(false);
        setFormValue({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setModel(false);
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

  return (
    <div className={cx('wrapper')}>
      <div className={cx('info')}>
        <div className={cx('password')}>
          <p className={cx('text')}> Tên tài khoản: {username} </p>
          <Button primary onClick={() => setModel(true)}>
            Đổi mật khẩu
          </Button>
          {model && (
            <div className={cx('model')}>
              <form onSubmit={handleChangePassword}>
                <div className={cx('form-group')}>
                  <label className={cx('form-label')}>Nhập mật khẩu cũ</label>
                  <input
                    className={cx('form-input')}
                    onChange={handelOnchange}
                    onFocus={() => setWarning({ ...warning, warningOldPassword: false })}
                    name="oldPassword"
                    value={oldPassword}
                    type={'password'}
                    autoComplete={'true'}
                  ></input>
                  {warning.warningOldPassword && (
                    <span className={cx('form-warning')}>{warning.warningOldPassword}</span>
                  )}
                </div>
                <div className={cx('form-group')}>
                  <label className={cx('form-label')}> Nhập mật khẩu mới</label>
                  <input
                    className={cx('form-input')}
                    onChange={handelOnchange}
                    name="newPassword"
                    onFocus={() => setWarning({ ...warning, warningNewPassword: false })}
                    value={newPassword}
                    type={'password'}
                    autoComplete={'true'}
                  ></input>
                  {warning.warningNewPassword && (
                    <span className={cx('form-warning')}>{warning.warningNewPassword}</span>
                  )}
                </div>
                <div className={cx('form-group')}>
                  <label className={cx('form-label')}> Nhập lại mật khẩu mới</label>
                  <input
                    onChange={handelOnchange}
                    name="confirmPassword"
                    onFocus={() => setWarning({ ...warning, warningConfirmPassword: false })}
                    value={confirmPassword}
                    type={'password'}
                    className={cx('form-input')}
                    autoComplete={'true'}
                  ></input>
                  {warning.warningConfirmPassword && (
                    <span className={cx('form-warning')}>{warning.warningConfirmPassword}</span>
                  )}
                </div>
                <div className={cx('form-btn')}>
                  <Button
                    primary
                    onClick={(event) => {
                      event.preventDefault();
                      setModel(false);
                    }}
                    className={cx('back')}
                  >
                    Hủy
                  </Button>
                  <Button primary type="submit">
                    Lưu lại
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
        <p className={cx('text')}>Ảnh đại diện: </p>
        <div>
          <form onSubmit={handleChangeAvatar}>
            <label htmlFor="avatar" className={cx('label-avatar')}>
              {!avatar || (!img && <span>Chọn ảnh đại diện</span>)}
              {((avatar && avatar.preview) || img) && (
                <img
                  className={cx('avatar')}
                  src={avatar && avatar.preview ? avatar.preview : img}
                  alt={username}
                ></img>
              )}
            </label>
            <input type="file" hidden id="avatar" onChange={handlePreviewAvatar}></input>

            <Button primary type="submit">
              Lưu lại
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
