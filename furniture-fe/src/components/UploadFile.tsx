import { FC } from "react";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

interface UploadFileProps {
    setFile: (data: File | null) => void;
    label?: string,
    disabled: boolean,
}

const UploadFile: FC<UploadFileProps> = ({setFile, label = 'Upload image', disabled}) => {
    return (
        <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            disabled={disabled}
            startIcon={<CloudUploadIcon />}
        >
            {label}
            <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={(event) => setFile(event.target.files && event.target.files[0])}
            />
        </Button>
    );
}

export default UploadFile;