import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import { useAppDispatch, useAppSelector, useShowErrorToast } from '../hooks.ts';
import { deepOrange } from '@mui/material/colors';
import { localLogout } from '../store/reducers/AuthSlice.ts';
import { clearToken } from '../utils/localStorage.ts';
import { authApiSlice } from '../store/reducers/AuthApiSlice.ts';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import LoginModal from '../modals/LoginModal.tsx';
import SignUpModal from '../modals/SignUpModal.tsx';
import { adminRole, userRole } from '../constants.ts';
import Typography from "@mui/material/Typography";

const AccountMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isLoginModalOpen, setLoginModalOpen] = React.useState<boolean>(false);
  const [isSignUpModalOpen, setSignUpModalOpen] = React.useState<boolean>(false);

  const { user } = useAppSelector((state) => state.auth);
  const [logout, { data, error }] = authApiSlice.useLogoutMutation();

  const history = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) {
      dispatch(localLogout());
      clearToken();
      handleClose();
      history('/');
    }
  }, [data]);

  useShowErrorToast(error);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    user?.username ? setAnchorEl(event.currentTarget) : onLoginClick();
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogout = () => {
    logout('');
  };

  const onProductsClick = () => {
    history('/products');
  };

  const onOrdersClick = () => {
    history('/orders');
  };

  const onMyOrdersClick = () => {
    history('/my-orders');
  };

  const onBucketClick = () => {
    history('/bucket');
  };

  const onCategoriesClick = () => {
    history('/categories');
  };

  const onLoginClick = () => {
    setLoginModalOpen(true);
  };

  const onHomeClick = () => {
    history('/');
  };

  return (
    <Box sx={{ width: '100%',   height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'rgba(15,143,75,0.58)' }}>
      <Box sx={{ display: 'flex', alignSelf: 'center', justifySelf: 'flex-start' }} >
        <Typography sx={{ p: 0.5, ml: 2, borderRadius: '10px', '&:hover': { bgcolor: '#7a57c1', color: '#fff' }}} onClick={onHomeClick} >Home</Typography>
      </Box>
      <Tooltip title={user?.username ? 'Settings' : 'Login'} sx={{ justifySelf: 'flex-end' }}>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ mr: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar sx={{ width: 32, height: 32, bgcolor: deepOrange[500] }}>{user?.username?.[0]?.toUpperCase()}</Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {user?.role === adminRole && (
          <MenuItem onClick={onOrdersClick}>
            <ListItemIcon>
              <ListAltIcon fontSize="small" />
            </ListItemIcon>
            Orders
          </MenuItem>
        )}
        {user?.role === adminRole && (
          <MenuItem onClick={onProductsClick}>
            <ListItemIcon>
              <BorderColorIcon fontSize="small" />
            </ListItemIcon>
            Furniture
          </MenuItem>
        )}
        {user?.role === adminRole && (
          <MenuItem onClick={onCategoriesClick}>
            <ListItemIcon>
              <BorderColorIcon fontSize="small" />
            </ListItemIcon>
            Categories
          </MenuItem>
        )}
        {user?.role === userRole && (
          <MenuItem onClick={onMyOrdersClick}>
            <ListItemIcon>
              <ListAltIcon fontSize="small" />
            </ListItemIcon>
            My orders
          </MenuItem>
        )}
        {user?.role === userRole && (
          <MenuItem onClick={onBucketClick}>
            <ListItemIcon>
              <AddShoppingCartIcon fontSize="small" />
            </ListItemIcon>
            Bucket
          </MenuItem>
        )}
        {user?.username && (
          <MenuItem onClick={onLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        )}
      </Menu>
      {isLoginModalOpen && <LoginModal isOpen={isLoginModalOpen} setOpen={setLoginModalOpen} setSignUpOpen={setSignUpModalOpen} />}
      {isSignUpModalOpen && <SignUpModal isOpen={isSignUpModalOpen} setOpen={setSignUpModalOpen} setLoginOpen={setLoginModalOpen} />}
    </Box>
  );
};

export default AccountMenu;
