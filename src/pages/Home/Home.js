import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import songs from '~/assets/songs';
import Button from '~/components/Button';
import config from '~/config';
import { useContext, useEffect } from 'react';
import { TransportContext } from '~/contexts/TransportContext';

const cx = classNames.bind(styles);

function Home() {
  const {
    transportState: { themeActive },
    getThemeActive,
  } = useContext(TransportContext);

  useEffect(() => {
    getThemeActive();
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

  return (
    <div className={cx('wrapper')}>
      <div className={cx('header')}>
        <h4 className={cx('title')}>Chào mừng bạn quay lại</h4>
        <p className={cx('text')}> Ngày hôm nay của bạn thế nào?</p>
        <p className={cx('text')}>Cùng thưởng thức một bản nhạc trước khi vào công việc nhé</p>

        <audio className={cx('audio')} controls src={songs.song1}></audio>
      </div>
      <div className={cx('content')}>
        <Button to={config.routes.order}>
          <span className={cx('home-order')}>Những thông báo cần xử lý</span>
        </Button>
      </div>
    </div>
  );
}

export default Home;
