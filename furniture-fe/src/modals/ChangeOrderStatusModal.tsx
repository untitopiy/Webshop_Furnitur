import { FC, useEffect, useState } from "react";
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import * as Yup from 'yup';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';

import ModalComponent from "../components/Modal";
import { useShowErrorToast } from "../hooks";
import { createToast } from "../utils/toasts";
import { useFormik } from "formik";
import { userApiSlice } from "../store/reducers/UserApiSlice";

interface ChangeOrderStatusModalProps {
    orderId: number;
}
 
const ChangeOrderStatusModal: FC<ChangeOrderStatusModalProps> = ({orderId}) => {
    const [isOpen, setOpen] = useState<boolean>(false);

    const [updateStatus, { data, error, isLoading }] =
        userApiSlice.useUpdateOrderStatusMutation();

    useShowErrorToast(error);

    useEffect(() => {
        if (data) {
            setOpen(false);
            createToast.success('Updated')
        }
    }, [data]);

    const formik = useFormik({
        initialValues: {
            status: '',
        },
        validationSchema: Yup.object({
            status: Yup.string()
        }),
        onSubmit: () => {
            updateStatus(orderId);
            formik.setSubmitting(false);
        },
    });

    return (
        <>
            <Button onClick={() => setOpen(true)} variant="contained" > <Tooltip title="Change order status" placement="bottom"><EditIcon /></Tooltip></Button>
            {isOpen && <ModalComponent isLoading={isLoading}  isOpen={isOpen} setOpen={setOpen} title={'Change order status'}>
                <Box component="form" onSubmit={formik.handleSubmit} sx={{minWidth: '80%'}}>
                    <DialogContent sx={{display: 'flex', flexDirection: 'column', gap: '10px'}} dividers={true}>
                    </DialogContent>
                    <DialogActions>
                        <LoadingButton disabled={isLoading} onClick={() => setOpen(false)}>{'Cancel'}</LoadingButton>
                        <LoadingButton disabled={formik.isSubmitting} loading={isLoading} type="submit">{'Update'}</LoadingButton>
                    </DialogActions>
                </Box>
            </ModalComponent>}
        </>
    );
}
 
export default ChangeOrderStatusModal;