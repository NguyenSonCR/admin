import classNames from 'classnames/bind';
import styles from './Themes.module.scss';
import { useContext, useEffect, useState } from 'react';
import Button from '~/components/Button';
import { TransportContext } from '~/contexts/TransportContext';
import { ToastContext } from '~/contexts/ToastContext';
const cx = classNames.bind(styles);

function Themes() {
  const {
    transportState: { themes, themeActive },
    addTheme,
    getThemes,
    deleteTheme,
    getThemeActive,
    activeTheme,
    defaultTheme,
  } = useContext(TransportContext);
  const {
    toastState: { toastList },
    addToast,
  } = useContext(ToastContext);

  useEffect(() => {
    getThemeActive();
    getThemes();
    // eslint-disable-next-line
  }, []);

  if (themeActive) {
    const changeTheme = () => {
      document.documentElement.style.setProperty('--primary-color', themeActive.primaryColor);
      document.documentElement.style.setProperty('--text-color', themeActive.textColor);
      document.documentElement.style.setProperty('--background-color', themeActive.backgroundColor);
      document.documentElement.style.setProperty('--border-color', themeActive.borderColor);
      document.documentElement.style.setProperty('--delete-color', themeActive.deleteColor);
      document.documentElement.style.setProperty('--hoverPrimary-color', themeActive.hoverPrimaryColor);
    };
    changeTheme();
  }

  const [formValue, setFormValue] = useState({
    name: '',
    active: 'inactive',
    primaryColor: '#2ea865',
    hoverPrimaryColor: '#2ea865',
    textColor: '#2ea865',
    backgroundColor: '#2ea865',
    borderColor: '#2ea865',
    deleteColor: '#2ea865',
  });

  const { name, primaryColor, hoverPrimaryColor, textColor, backgroundColor, borderColor, deleteColor } = formValue;

  const handleOnchange = (event) => {
    setFormValue({
      ...formValue,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (name === '') {
      addToast({
        id: toastList.length + 1,
        title: 'Thất bại',
        content: 'Bạn chưa nhập tên chủ đề',
        type: 'error',
      });
      return;
    }
    try {
      const response = await addTheme(formValue);
      if (response.success) {
        addToast({
          id: toastList.length + 1,
          title: 'Thành công',
          content: response.message,
          type: 'success',
        });
        setFormValue({
          name: '',
          active: 'inactive',
          primaryColor: '#2ea865',
          hoverPrimaryColor: '#2ea865',
          textColor: '#2ea865',
          backgroundColor: '#2ea865',
          borderColor: '#2ea865',
          deleteColor: '#2ea865',
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

  return (
    <div className={cx('wrapper')}>
      <div className={cx('themes')}>
        <p className={cx('themes-title')}>Chủ đề đã thêm</p>
        <Button primary onClick={() => defaultTheme()}>
          Sử dụng chủ đề mặc định
        </Button>
        {themes.length === 0 ? (
          <div className={cx('default-theme')}> Đang áp dụng chủ đề mặc định </div>
        ) : (
          themes.map((theme, index) => (
            <div key={index} className={cx('theme-wrapper')}>
              <p className={cx('theme-name')}>Chủ đề: {theme.name}</p>
              <div style={{ backgroundColor: theme.backgroundColor }} className={cx('theme-color')}></div>
              <div className={cx('action')}>
                <Button primary deleted onClick={() => deleteTheme(theme.name)}>
                  Xóa
                </Button>
                {theme.active !== 'active' ? (
                  <Button primary className={cx('action-choose')} onClick={() => activeTheme(theme.name)}>
                    Áp dụng
                  </Button>
                ) : (
                  <Button primary disable className={cx('action-choose')}>
                    Đang áp dụng
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <div className={cx('new')}>
        <p className={cx('new-title')}>Thêm mới chủ đề</p>
        <form onSubmit={handleSubmit} className={cx('form')}>
          <div className={cx('form-group')}>
            <label className={cx('label')}>Tên chủ đề</label>
            <input
              className={cx('input-text')}
              name="name"
              onChange={handleOnchange}
              value={name}
              type={'text'}
            ></input>
          </div>
          <div className={cx('form-group')}>
            <label className={cx('label')}>Màu chủ đạo</label>
            <input
              className={cx('input')}
              name="primaryColor"
              onChange={handleOnchange}
              value={primaryColor}
              type={'color'}
            ></input>
          </div>
          <div className={cx('form-group')}>
            <label className={cx('label')}>Màu chủ đạo (hover)</label>
            <input
              className={cx('input')}
              name="hoverPrimaryColor"
              onChange={handleOnchange}
              value={hoverPrimaryColor}
              type={'color'}
            ></input>
          </div>
          <div className={cx('form-group')}>
            <label className={cx('label')}>Màu chữ</label>
            <input
              className={cx('input')}
              name="textColor"
              onChange={handleOnchange}
              value={textColor}
              type={'color'}
            ></input>
          </div>
          <div className={cx('form-group')}>
            <label className={cx('label')}>Màu nền</label>
            <input
              className={cx('input')}
              name="backgroundColor"
              onChange={handleOnchange}
              value={backgroundColor}
              type={'color'}
            ></input>
          </div>
          <div className={cx('form-group')}>
            <label className={cx('label')}>Màu đường viền</label>
            <input
              className={cx('input')}
              name="borderColor"
              onChange={handleOnchange}
              value={borderColor}
              type={'color'}
            ></input>
          </div>
          <div className={cx('form-group')}>
            <label className={cx('label')}>Màu nút xóa</label>
            <input
              className={cx('input')}
              name="deleteColor"
              onChange={handleOnchange}
              value={deleteColor}
              type={'color'}
            ></input>
          </div>
          <Button type="submit" primary fill className={cx('btn-submit')}>
            Thêm mới
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Themes;
