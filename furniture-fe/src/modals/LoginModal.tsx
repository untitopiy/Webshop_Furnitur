import { FC, useEffect } from 'react';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import ModalComponent from '../components/Modal';
import { MyTextInput } from '../components/FormFields';
import { useAppDispatch, useShowErrorToast } from '../hooks';
import { authApiSlice } from '../store/reducers/AuthApiSlice';
import { useNavigate } from 'react-router-dom';
import { getUserFromToken } from '../utils';
import { setUserData, setUserToken } from '../store/reducers/AuthSlice';
import { setToken } from '../utils/localStorage';
import {adminRole, userRole} from "../constants.ts";

interface ILoginModal {
  isOpen: boolean;
  setOpen: (data: boolean) => void;
  setSignUpOpen: (data: boolean) => void;
}

const LoginModal: FC<ILoginModal> = ({ isOpen, setOpen, setSignUpOpen }) => {
  const history = useNavigate();
  const dispatch = useAppDispatch();

  const [login, { data, error, isLoading }] = authApiSlice.useLoginMutation();

  useShowErrorToast(error);

  useEffect(() => {
    if (data) {
      const localToken = data['access_token'];
      const userFromToken = getUserFromToken(localToken);

      dispatch(setUserToken(localToken));
      dispatch(setUserData(userFromToken));
      setToken(localToken);

      setOpen(false);
    }
  }, [data]);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().min(4, 'Must be 4 characters or more').max(40, 'Must be 40 characters or less').required('Required'),
      password: Yup.string().min(4, 'Must be 4 characters or more').max(20, 'Must be 20 characters or less').required('Required'),
    }),
    onSubmit: (values) => {
      login({
        username: values.username,
        password: values.password,
      });
    },
  });

  useEffect(() => {
    if (error) {
      formik.setSubmitting(false);
    }
  }, [error]);

  const iHaventAccountClick = () => {
    setOpen(false);
    setSignUpOpen(true);
  };

  return (
    <ModalComponent isLoading={isLoading} isOpen={isOpen} setOpen={setOpen} title={'Login'}>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }} dividers={true}>
          <MyTextInput formik={formik} label={'Username'} name={'username'} />
          <MyTextInput formik={formik} label={'Password'} name={'password'} type="password" />
          <Button disabled={isLoading} fullWidth variant="contained" onClick={iHaventAccountClick}>
            {"I have't account"}
          </Button>
        </DialogContent>
        <DialogActions>
          <LoadingButton disabled={isLoading} onClick={() => setOpen(false)}>
            {'Close'}
          </LoadingButton>
          <LoadingButton disabled={formik.isSubmitting || !formik.isValid || !formik.dirty} loading={isLoading} type="submit">
            {'Login'}
          </LoadingButton>
        </DialogActions>
      </Box>
    </ModalComponent>
  );
};

export default LoginModal;
