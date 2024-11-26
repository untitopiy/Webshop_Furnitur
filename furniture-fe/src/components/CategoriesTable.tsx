import {FC, useEffect, useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import DeleteModal from "../modals/DeleteModal.tsx";
import {adminApiSlice} from "../store/reducers/AdminApiSlice.ts";
import {useShowErrorToast} from "../hooks.ts";
import {createToast} from "../utils/toasts.ts";
import CategoriesModal from "../modals/CategoriesModal.tsx";

type HeaderCellType = {
  label: string;
  align: 'right' | 'center' | 'left' | 'inherit' | 'justify' | undefined;
};

const headers = [
  {
    label: 'ID',
  },
  {
    label: 'Name',
  },
  {
    label: 'Functions',
  },
] as HeaderCellType[];

interface ThisProps {
  categories: any[];
}

const CategoriesTable: FC<ThisProps> = ({ categories }) => {
  const [deleteID, setDeleteID] = useState<number>(null!);
  const [isOpen, setOpen] = useState<boolean>(false);

  const [deleteCategory, { data: deleteData, error: deleteError, isLoading: deleteIsLoading }] = adminApiSlice.useDeleteCategoryMutation();
  useShowErrorToast(deleteError);

  useEffect(() => {
    if (deleteData !== undefined) {
      setOpen(false);
      createToast.success('Deleted')
    }
  }, [deleteData]);

  const onDelete = () => {
    deleteCategory(deleteID);
  };

  const onDeleteClick = (id: number) => {
    setDeleteID(id);
    setOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 450, overflowX: 'auto' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {headers.map((item, index) => (
                <TableCell key={index} align={item.align}>
                  {item.label}
                </TableCell>
              ))}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((item, index) => (
              <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {item.id}
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: '5px' }}>
                    <CategoriesModal category={item} />
                    <DeleteModal isLoading={deleteIsLoading} isOpen={isOpen} onDeleteClick={() => onDeleteClick(item.id)} setOpen={setOpen} deleteFunction={onDelete} deleteLabel="category" />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CategoriesTable;
