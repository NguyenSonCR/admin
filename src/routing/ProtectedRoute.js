import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '~/contexts/AuthContext';
import Spinner from '~/components/Spinner';
import config from '~/config';

const ProtectedRoute = ({ children }) => {
  const {
    authState: { authLoading, isAuthenticated },
  } = useContext(AuthContext);
  if (authLoading)
    return (
      <div>
        <Spinner />
      </div>
    );
  if (!isAuthenticated) return <Navigate to={config.routes.login} replace />;
  return children;
};
export default ProtectedRoute;
