import { FC } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { apiImageUrl } from '../constants';
import ProductsModal from '../modals/ProductsModal.tsx';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import DoNotTouchIcon from '@mui/icons-material/DoNotTouch';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';

type HeaderCellType = {
  label: string;
  align: 'right' | 'center' | 'left' | 'inherit' | 'justify' | undefined;
};

const headers = [
  {
    label: 'ID',
  },
  {
    label: 'Title',
  },
  {
    label: 'Description',
  },
  {
    label: 'Is out of stock',
  },
  {
    label: 'Category',
  },
  {
    label: 'Size',
  },
  {
    label: 'Color',
  },
  {
    label: 'Price',
  },
  {
    label: 'Image',
  },
] as HeaderCellType[];

interface ThisProps {
  products: any[];
  changeOutOfStock: (id: number, data: boolean) => void;
}

const ProductsTable: FC<ThisProps> = ({ products, changeOutOfStock }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
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
            {products.map((item, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {item.id}
                </TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Tooltip title={item.isoutofstock ? 'Restock' : 'Set out of stock'} placement="bottom">
                      <IconButton onClick={() => changeOutOfStock(item.id, !item.isoutofstock)}>
                        {item.isoutofstock ? <CheckIcon fontSize="small" /> : <AddIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell>{item.category?.name}</TableCell>
                <TableCell>{item.size}</TableCell>
                <TableCell>{item.color}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>
                  <img width={'80'} height={'80'} src={`${apiImageUrl}${item.image}`} alt={item.name} />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: '5px' }}>
                    <ProductsModal product={item} />
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

export default ProductsTable;
