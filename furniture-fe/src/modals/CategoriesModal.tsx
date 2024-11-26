import { FC, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useFormik } from 'formik';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import * as Yup from 'yup';
import Tooltip from '@mui/material/Tooltip';

import ModalComponent from '../components/Modal';
import { MyTextInput } from '../components/FormFields';
import { adminApiSlice } from '../store/reducers/AdminApiSlice';
import { useShowErrorToast } from '../hooks';
import { createToast } from '../utils/toasts';

interface IDrinksModal {
  category?: any;
}

const ProductsModal: FC<IDrinksModal> = ({ category }) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const [updateCategory, { data, error, isLoading }] = adminApiSlice.useUpdateCategoryMutation();
  const [createCategory, { data: createdData, error: createdError, isLoading: createdIsLoading }] = adminApiSlice.useCreateCategoryMutation();

  useShowErrorToast(error);
  useShowErrorToast(createdError);

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);
  useEffect(() => {
    if (data) {
      console.log('+')
      setOpen(false);
      createToast.success('Updated');
    }
  }, [data]);
  useEffect(() => {
    if (createdData) {
      setOpen(false);
      createToast.success('Created');
    }
  }, [createdData]);

  const formik = useFormik({
    initialValues: {
      name: category?.name || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().max(100, 'Must be 100 characters or less').required('Required'),
    }),
    onSubmit: (values) => {
      if (category) {
        updateCategory({ id: category.id, data: values });
      } else {
        createCategory({ name: values.name });
      }
      formik.setSubmitting(false);
    },
  });

  return (
    <>
      <Button sx={{ alignSelf: 'flex-end' }} onClick={() => setOpen(true)}>
        {category ? (
          <Tooltip title="Edit" placement="bottom">
            <EditIcon />
          </Tooltip>
        ) : (
          'Create Category'
        )}
      </Button>
      {isOpen && (
        <ModalComponent
          isLoading={isLoading || createdIsLoading}
          isOpen={isOpen}
          setOpen={setOpen}
          title={category ? 'Update Category' : 'Create Category'}
        >
          <Box component="form" onSubmit={formik.handleSubmit}>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }} dividers={true}>
              <MyTextInput formik={formik} label={'name'} name={'name'} />
            </DialogContent>
            <DialogActions>
              <LoadingButton disabled={isLoading || createdIsLoading} onClick={() => setOpen(false)}>
                {'Cancel'}
              </LoadingButton>
              <LoadingButton
                disabled={formik.isSubmitting || !formik.isValid || (!formik.dirty && !category)}
                loading={isLoading || createdIsLoading}
                type="submit"
              >
                {category ? 'Update' : 'Create'}
              </LoadingButton>
            </DialogActions>
          </Box>
        </ModalComponent>
      )}
    </>
  );
};

export default ProductsModal;
