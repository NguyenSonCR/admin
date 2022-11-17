import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '~/App';
import reportWebVitals from './reportWebVitals';
import GlobalStyles from './components/GlobalStyles';
import AuthContextProvider from './contexts/AuthContext';
import ProductContextProvider from './contexts/ProductContext';
import PostContextProvider from './contexts/PostContext';
import CategoryContextProvider from './contexts/CategoryContext';
import GuestContextProvider from './contexts/GuestContext';
import OrderContextProvider from './contexts/OrderContext';
import ToastContextProvider from './contexts/ToastContext';
import AlertContextProvider from './contexts/AlertContext';
import TransportContextProvider from './contexts/TransportContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <GlobalStyles>
    <AuthContextProvider>
      <ProductContextProvider>
        <PostContextProvider>
          <CategoryContextProvider>
            <GuestContextProvider>
              <OrderContextProvider>
                <TransportContextProvider>
                  <ToastContextProvider>
                    <AlertContextProvider>
                      <App />
                    </AlertContextProvider>
                  </ToastContextProvider>
                </TransportContextProvider>
              </OrderContextProvider>
            </GuestContextProvider>
          </CategoryContextProvider>
        </PostContextProvider>
      </ProductContextProvider>
    </AuthContextProvider>
  </GlobalStyles>,
  // </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
