import classNames from 'classnames/bind';
import styles from './Notify.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faEnvelope, faComment } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Notify() {
  return (
    <nav className={cx('wrapper')}>
      <h3 className={cx('title')}> Notifications </h3>
      <div className={cx('content')}>
        <div className={cx('nav-item')}>
          <FontAwesomeIcon icon={faMessage} className={cx('icon')}></FontAwesomeIcon>
          <button className={cx('text')}>Messages</button>
        </div>
        <div className={cx('nav-item')}>
          <FontAwesomeIcon icon={faEnvelope} className={cx('icon')}></FontAwesomeIcon>
          <button className={cx('text')}>Mail</button>
        </div>
        <div className={cx('nav-item')}>
          <FontAwesomeIcon icon={faComment} className={cx('icon')}></FontAwesomeIcon>
          <button className={cx('text')}>Feedback</button>
        </div>
      </div>
    </nav>
  );
}

export default Notify;
