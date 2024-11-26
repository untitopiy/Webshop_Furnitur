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
import { MyTextInput } from "../components/FormFields";
import { adminApiSlice } from "../store/reducers/AdminApiSlice";
import { useShowErrorToast } from "../hooks";
import { createToast } from "../utils/toasts";
import { IIngredient } from "../types";

interface IIngredientsModal {
    ingredient?: IIngredient,
}
 
const IngredientsModal: FC<IIngredientsModal> = ({ ingredient }) => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [updateIngredient, { data, error, isLoading }] =
        adminApiSlice.useUpdateIngredientMutation();
    const [createIngredient, { data: createdData, error: createdError, isLoading: createdIsLoading }] =
        adminApiSlice.useCreateIngredientMutation();

    useShowErrorToast(error);
    useShowErrorToast(createdError);

    useEffect(() => {
        if (!isOpen) {
            formik.resetForm();
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
          name: ingredient?.name || '',
          cost: ingredient?.cost || '',
          weight: ingredient?.weight || '',
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .min(3, 'Must be 3 characters or more')
                .max(30, 'Must be 30 characters or less')
                .required('Required'),
            cost: Yup.number()
                .min(0, 'Must be 0 or more')
                .max(1000000, 'Must be 1000000 or less')
                .required('Required'),
            weight: Yup.number()
                .min(0, 'Must be 0 or more')
                .max(10000, 'Must be 10000 or less')
                .required('Required'),
        }),
        onSubmit: (values) => {
            if (ingredient) {
                updateIngredient({id: ingredient.id, data: values});
            } else {
                createIngredient(values);
            }
            formik.setSubmitting(false);
        },
    });

    return (
        <>
            <Button sx={{alignSelf: 'flex-end'}} onClick={() => setOpen(true)}>{ingredient ? <Tooltip title="Edit" placement="bottom"><EditIcon /></Tooltip> : 'Create Ingredient'}</Button>
            {isOpen && <ModalComponent isLoading={isLoading || createdIsLoading} isOpen={isOpen} setOpen={setOpen} title={ingredient ? "Update Ingredient" : "Create Ingredient"}>
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <DialogContent sx={{display: 'flex', flexDirection: 'column', gap: '10px'}} dividers={true}>
                        <MyTextInput formik={formik} label={'Name'} name={'name'} />
                        <MyTextInput formik={formik} label={'Cost'} name={'cost'} type={'number'} />
                        <MyTextInput formik={formik} label={'Weight'} name={'weight'} type={'number'} />
                    </DialogContent>
                    <DialogActions>
                        <LoadingButton disabled={isLoading || createdIsLoading} onClick={() => setOpen(false)}>{'Cancel'}</LoadingButton>
                        <LoadingButton disabled={formik.isSubmitting || !formik.isValid || !formik.dirty} loading={isLoading || createdIsLoading} type="submit">{ingredient ? 'Update' : 'Create'}</LoadingButton>
                    </DialogActions>
                </Box>
            </ModalComponent>}
        </>
    );
}
 
export default IngredientsModal;