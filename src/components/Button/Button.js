import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './Button.module.scss';
const cx = classNames.bind(styles);

function Button({
  to,
  href,
  text = false,
  primary = false,
  rounded = false,
  outline = false,
  small = false,
  large = false,
  disable = false,
  deleted = false,
  leftIcon,
  full,
  fill,
  rightIcon,
  className,
  children,
  onClick,
  ...passProps
}) {
  let Comp = 'button';
  const props = {
    onClick,
    ...passProps,
  };
  if (to) {
    props.to = to;
    Comp = Link;
  } else if (href) {
    props.href = href;
    Comp = 'a';
  }

  if (disable) {
    delete props.onClick;
  }
  const classes = cx('wrapper', {
    deleted,
    full,
    primary,
    outline,
    small,
    fill,
    large,
    text,
    disable,
    rounded,
    [className]: className,
  });
  return (
    <Comp className={cx(classes)} {...props}>
      {leftIcon && <span className={cx('icon-left')}>{leftIcon}</span>}
      {children}
      {rightIcon && <span className={cx('icon')}>{rightIcon}</span>}
    </Comp>
  );
}

Button.propTypes = {
  to: PropTypes.string,
  href: PropTypes.string,
  text: PropTypes.bool,
  deleted: PropTypes.bool,
  primary: PropTypes.bool,
  rounded: PropTypes.bool,
  outline: PropTypes.bool,
  small: PropTypes.bool,
  large: PropTypes.bool,
  disable: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  fill: PropTypes.bool,
};

export default Button;
