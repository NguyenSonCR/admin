import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { Link } from 'react-router-dom';
import songs from '~/assets/songs';

const cx = classNames.bind(styles);

function Home() {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('header')}>
        <h4 className={cx('title')}>Chào mừng bạn quay lại</h4>
        <p className={cx('text')}> Ngày hôm nay của bạn thế nào?</p>
        <p className={cx('text')}>Cùng thưởng thức một bản nhạc trước khi vào công việc nhé</p>

        <audio className={cx('audio')} controls src={songs.song1}></audio>
      </div>
      <div className={cx('content')}>
        <Link to="notify">Những thông báo cần xử lý</Link>
      </div>
    </div>
  );
}

export default Home;
