import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Header from '~/layouts/components/Header';
import Sidebar from '~/layouts/components/Sidebar';
import Footer from '../components/Footer';
import styles from './DefaultLayout.module.scss';
import Toast from '~/components/Toast';
import Alert from '~/components/Alert';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
  return (
    <div className={cx('app')}>
      <Toast />
      <Alert />
      <div className={cx('wrapper', ['grid', 'wide'])}>
        <Header />
        <div className={cx('container', ['row'])}>
          <Sidebar />
          <div className={cx('content', ['col', 'l-10', 'm-9', 'c-9'])}>{children}</div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DefaultLayout;
