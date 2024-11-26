import {FC, ReactNode} from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';


interface ModalComponentProps {
    isOpen: boolean;
    isLoading: boolean;
    setOpen: (data: boolean) => void;
    children: ReactNode;
    title: string;
}
 
const ModalComponent: FC<ModalComponentProps> = ({isOpen, setOpen, title, children, isLoading}) => {
    const onClose = () => {
        if (!isLoading) {
            setOpen(false);
        }
    };

    return (
      <Dialog
        open={isOpen}
        onClose={onClose}
        scroll={'paper'}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
        {children}
      </Dialog>
    );
}
 
export default ModalComponent;