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
        title: 'Th???t b???i',
        content: 'B???n ch??a nh???p t??n ch??? ?????',
        type: 'error',
      });
      return;
    }
    try {
      const response = await addTheme(formValue);
      if (response.success) {
        addToast({
          id: toastList.length + 1,
          title: 'Th??nh c??ng',
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
          title: 'Th???t b???i',
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
        <p className={cx('themes-title')}>Ch??? ????? ???? th??m</p>
        <Button primary onClick={() => defaultTheme()}>
          S??? d???ng ch??? ????? m???c ?????nh
        </Button>
        {themes.length === 0 ? (
          <div className={cx('default-theme')}> ??ang ??p d???ng ch??? ????? m???c ?????nh </div>
        ) : (
          themes.map((theme, index) => (
            <div key={index} className={cx('theme-wrapper')}>
              <p className={cx('theme-name')}>Ch??? ?????: {theme.name}</p>
              <div style={{ backgroundColor: theme.backgroundColor }} className={cx('theme-color')}></div>
              <div className={cx('action')}>
                <Button primary deleted onClick={() => deleteTheme(theme.name)}>
                  X??a
                </Button>
                {theme.active !== 'active' ? (
                  <Button primary className={cx('action-choose')} onClick={() => activeTheme(theme.name)}>
                    ??p d???ng
                  </Button>
                ) : (
                  <Button primary disable className={cx('action-choose')}>
                    ??ang ??p d???ng
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <div className={cx('new')}>
        <p className={cx('new-title')}>Th??m m???i ch??? ?????</p>
        <form onSubmit={handleSubmit} className={cx('form')}>
          <div className={cx('form-group')}>
            <label className={cx('label')}>T??n ch??? ?????</label>
            <input
              className={cx('input-text')}
              name="name"
              onChange={handleOnchange}
              value={name}
              type={'text'}
            ></input>
          </div>
          <div className={cx('form-group')}>
            <label className={cx('label')}>M??u ch??? ?????o</label>
            <input
              className={cx('input')}
              name="primaryColor"
              onChange={handleOnchange}
              value={primaryColor}
              type={'color'}
            ></input>
          </div>
          <div className={cx('form-group')}>
            <label className={cx('label')}>M??u ch??? ?????o (hover)</label>
            <input
              className={cx('input')}
              name="hoverPrimaryColor"
              onChange={handleOnchange}
              value={hoverPrimaryColor}
              type={'color'}
            ></input>
          </div>
          <div className={cx('form-group')}>
            <label className={cx('label')}>M??u ch???</label>
            <input
              className={cx('input')}
              name="textColor"
              onChange={handleOnchange}
              value={textColor}
              type={'color'}
            ></input>
          </div>
          <div className={cx('form-group')}>
            <label className={cx('label')}>M??u n???n</label>
            <input
              className={cx('input')}
              name="backgroundColor"
              onChange={handleOnchange}
              value={backgroundColor}
              type={'color'}
            ></input>
          </div>
          <div className={cx('form-group')}>
            <label className={cx('label')}>M??u ???????ng vi???n</label>
            <input
              className={cx('input')}
              name="borderColor"
              onChange={handleOnchange}
              value={borderColor}
              type={'color'}
            ></input>
          </div>
          <div className={cx('form-group')}>
            <label className={cx('label')}>M??u n??t x??a</label>
            <input
              className={cx('input')}
              name="deleteColor"
              onChange={handleOnchange}
              value={deleteColor}
              type={'color'}
            ></input>
          </div>
          <Button type="submit" primary fill className={cx('btn-submit')}>
            Th??m m???i
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Themes;
