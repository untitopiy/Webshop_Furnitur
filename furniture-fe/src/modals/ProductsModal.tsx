import { FC, useEffect, useState } from "react";
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useFormik } from 'formik';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import * as Yup from 'yup';
import Tooltip from '@mui/material/Tooltip';

import ModalComponent from "../components/Modal";
import {MySelect, MyTextArea, MyTextInput} from "../components/FormFields";
import { adminApiSlice } from "../store/reducers/AdminApiSlice";
import { useShowErrorToast } from "../hooks";
import { createToast } from "../utils/toasts";
import UploadFile from "../components/UploadFile";
import {userApiSlice} from "../store/reducers/UserApiSlice.ts";
import {useGetQueryResponse} from "../types.ts";

interface IDrinksModal {
    product?: any,
}
 
const ProductsModal: FC<IDrinksModal> = ({ product }) => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [file, setFile] = useState<null | File>(null);

    const [updateProduct, { data, error, isLoading }] =
        adminApiSlice.useUpdateProductMutation();
    const [createProduct, { data: createdData, error: createdError, isLoading: createdIsLoading }] =
        adminApiSlice.useCreateProductMutation();
    const { data: categories, error: categoriesError } = userApiSlice.useGetCategoriesQuery<useGetQueryResponse<any[]>>('');

    useShowErrorToast(error);
    useShowErrorToast(createdError);
    useShowErrorToast(categoriesError);

    useEffect(() => {
        if (!isOpen) {
            formik.resetForm();
            setFile(null);
        }
    }, [isOpen]);
    useEffect(() => {
        if (data) {
            setOpen(false);
            createToast.success('Updated')
        }
    }, [data]);
    useEffect(() => {
        if (createdData) {
            setOpen(false);
            createToast.success('Created')
        }
    }, [createdData]);

    const formik = useFormik({
      initialValues: {
        title: product?.title || '',
        description: product?.description || '',
        category_id: product?.category_id || '',
        size: product?.size || '',
        color: product?.color || '',
        price: +product?.price || '',
        cost: product?.cost || '',
        quantity: product?.quantity || '',
      },
      validationSchema: Yup.object({
        title: Yup.string().max(100, 'Must be 100 characters or less').required('Required'),
        description: Yup.string().max(2056, 'Must be 2056 characters or less').required('Required'),
        category_id: Yup.string().required('Required'),
        size: Yup.string().max(100, 'Must be 100 characters or less').required('Required'),
        color: Yup.string().max(100, 'Must be 100 characters or less').required('Required'),
        price: Yup.number().min(0, 'Must be 0 or more').max(100000, 'Must be 100000 or less').required('Required'),
      }),
      onSubmit: (values) => {
        if (product) {
          updateProduct({ id: product.id, data: { ...values, price: values.price.toString() } });
        } else {
          const data = new FormData();
          data.append('price', values.price.toString());
          data.append('description', values.description);
          data.append('category_id', values.category_id);
          data.append('size', values.size);
          data.append('color', values.color);
          data.append('title', values.title);
          data.append('image', file as File);
          createProduct(data);
        }
        formik.setSubmitting(false);
      },
    });

    return (
        <>
            <Button sx={{alignSelf: 'flex-end'}} onClick={() => setOpen(true)}>{product ? <Tooltip title="Edit" placement="bottom"><EditIcon /></Tooltip> : 'Create Furniture'}</Button>
            {isOpen && <ModalComponent isLoading={isLoading || createdIsLoading} isOpen={isOpen} setOpen={setOpen} title={product ? "Update Furniture" : "Create Furniture"}>
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <DialogContent sx={{display: 'flex', flexDirection: 'column', gap: '10px'}} dividers={true}>
                        <MyTextInput formik={formik} label={'Title'} name={'title'} />
                        <MyTextArea formik={formik} label={'Description'} name={'description'} />
                        <MyTextInput formik={formik} label={'Price'} name={'price'} type={'number'} />
                        {categories && <MySelect formik={formik} label={'Category'} name={'category_id'} options={categories} />}
                        <MyTextInput formik={formik} label={'Size'} name={'size'} />
                        <MyTextInput formik={formik} label={'Color'} name={'color'} />
                        {!product && <UploadFile setFile={setFile} disabled={!!file} />}
                    </DialogContent>
                    <DialogActions>
                        <LoadingButton disabled={isLoading || createdIsLoading} onClick={() => setOpen(false)}>{'Cancel'}</LoadingButton>
                        <LoadingButton disabled={formik.isSubmitting || !formik.isValid || !formik.dirty || file === null && !product} loading={isLoading || createdIsLoading} type="submit">{product ? 'Update' : 'Create'}</LoadingButton>
                    </DialogActions>
                </Box>
            </ModalComponent>}
        </>
    );
}
 
export default ProductsModal;