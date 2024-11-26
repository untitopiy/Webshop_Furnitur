import { FC } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';

type DeleteModalType = {
  isOpen: boolean;
  setOpen: (data: boolean) => void;
  deleteFunction: () => void;
  onDeleteClick: () => void;
  deleteLabel: string;
  isLoading?: boolean;
};

const DeleteModal: FC<DeleteModalType> = ({
  deleteFunction,
  onDeleteClick,
  deleteLabel,
  isOpen,
  setOpen,
  isLoading,
}) => {
  const onClose = () => {
      if (!isLoading) {
        setOpen(false)
      }
  }

  return (
    <>
      <Button sx={{alignSelf: 'flex-end'}} onClick={onDeleteClick}>{<Tooltip title="Delete" placement="bottom"><DeleteIcon /></Tooltip>}</Button>
      {isOpen && <Dialog open onClose={onClose}>
        <DialogContent>
          <DialogTitle>{`Do you want to delete ${deleteLabel}?`}</DialogTitle>
        </DialogContent>
        <DialogActions>
          <Button disabled={isLoading} onClick={onClose}>{'Cancel'}</Button>
          <Button disabled={isLoading} onClick={() => deleteFunction()}>{'Delete'}</Button>
        </DialogActions>
      </Dialog>}
    </>

  );
};

export default DeleteModal;
