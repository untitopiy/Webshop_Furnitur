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
import { useShowErrorToast } from '../hooks';
import { authApiSlice } from '../store/reducers/AuthApiSlice';

interface ISignUpModal {
  isOpen: boolean;
  setOpen: (data: boolean) => void;
  setLoginOpen: (data: boolean) => void;
}

const SignUpModal: FC<ISignUpModal> = ({ isOpen, setOpen, setLoginOpen }) => {
  const [signUp, { data, error, isLoading }] = authApiSlice.useSignUpMutation();

  useShowErrorToast(error);

  useEffect(() => {
    if (data) {
      setOpen(false);
      setLoginOpen(true);
    }
  }, [data]);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(4, 'Must be 4 characters or more')
        .max(40, 'Must be 40 characters or less')
        .required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string()
        .min(8, 'Must be 8 characters or more')
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Required'),
    }),
    onSubmit: (values) => {
      signUp({
        username: values.username,
        email: values.email,
        password: values.password,
      });
    },
  });

  useEffect(() => {
    if (error) {
      formik.setSubmitting(false);
    }
  }, [error]);

  const iHaveAccountClick = () => {
    setOpen(false);
    setLoginOpen(true);
  };

  return (
    <ModalComponent
      isLoading={isLoading}
      isOpen={isOpen}
      setOpen={setOpen}
      title={'Sign Up'}
    >
      <Box component="form" onSubmit={formik.handleSubmit}>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          dividers={true}
        >
          <MyTextInput formik={formik} label={'Username'} name={'username'} />
          <MyTextInput formik={formik} label={'Email'} name={'email'} />
          <MyTextInput
            formik={formik}
            label={'Password'}
            name={'password'}
            type="password"
          />
          <MyTextInput
            formik={formik}
            label={'Confirm password'}
            name={'confirmPassword'}
            type="password"
          />
          <Button
            disabled={isLoading}
            fullWidth
            variant="contained"
            onClick={iHaveAccountClick}
          >
            {'I have an account'}
          </Button>
        </DialogContent>
        <DialogActions>
          <LoadingButton disabled={isLoading} onClick={() => setOpen(false)}>
            {'Close'}
          </LoadingButton>
          <LoadingButton
            disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
            loading={isLoading}
            type="submit"
          >
            {'Sign up'}
          </LoadingButton>
        </DialogActions>
      </Box>
    </ModalComponent>
  );
};

export default SignUpModal;
