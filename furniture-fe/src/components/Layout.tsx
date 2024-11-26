import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import AccountMenu from "./Menu.tsx";
import Footer from './Footer.tsx';

const Layout: FC = () => {

  return (
    <div style={{ width: '100%' }}>
        <AccountMenu />
        <Outlet />
        <Toaster position="bottom-right" reverseOrder={false} />
        <Footer />
    </div>
  );
};

export default Layout;