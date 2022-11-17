import './GlobalStyles.scss';
import PropTypes from 'prop-types';

function GlobalStyles({ children }) {
  return children;
}
export default GlobalStyles;

GlobalStyles.propTypes = {
  children: PropTypes.node.isRequired,
};
