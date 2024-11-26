import { ChangeEvent, FC, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import { IOrder, IResponsePaginatedData, useGetQueryResponce } from '../types';
import { apiImageUrl, defaultLimit, defaultStartPage, limitValues } from '../constants';
import { userApiSlice } from '../store/reducers/UserApiSlice';
import { useDebounce, useShowErrorToast } from '../hooks';
import NoData from '../components/NoData';
import Pagination from '@mui/material/Pagination';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

type HeaderCellType = {
  label: string;
  align: 'right' | 'center' | 'left' | 'inherit' | 'justify' | undefined;
};

const headers = [
  {
    label: '№',
  },
  {
    label: 'Status',
  },
  {
    label: 'Created',
  },
  {
    label: 'Completed',
  },
] as HeaderCellType[];

const subHeaders = [
  {
    label: 'Title',
  },
  {
    label: '',
  },
  {
    label: 'Count',
  },
  {
    label: 'Price',
  },
] as HeaderCellType[];

interface SubTableRowProps {
  order: IOrder;
}

const SubTableRow: FC<SubTableRowProps> = ({ order }) => {
  const [open, setOpen] = useState<boolean>(false);

  const total = order.orderItems?.reduce((sum, item) => (sum += item.orderitem.price * item.orderitem.count), 0);

  return (
    <>
      <TableRow key={order.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, p: 2 }}>
        <TableCell>
          {order.orderItems?.length && (
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        <TableCell>{order.id}</TableCell>
        <TableCell>{order.status}</TableCell>
        <TableCell>{moment(order.created_at).format('DD.MM.YYYY hh:mm')}</TableCell>
        <TableCell>{order.completed_date && moment(order.completed_date).format('DD.MM.YYYY hh:mm')}</TableCell>
      </TableRow>
      {!!order.orderItems?.length && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ m: 1, p: 1, backgroundColor: '#dceaeb' }}>
                <Typography variant="h6" gutterBottom component="div">
                  {'Products'}
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      {subHeaders.map((item, index) => (
                        <TableCell key={index} align={item.align}>
                          {item.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.orderItems.map((good) => (
                      <TableRow key={good.id}>
                        <TableCell>{good.title}</TableCell>
                        <TableCell>
                          <img width={'80'} height={'80'} src={`${apiImageUrl}${good.image}`} alt={good.title} />
                        </TableCell>
                        <TableCell>{good.orderitem.count}</TableCell>
                        <TableCell>{good.orderitem.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Typography sx={{ textAlign: 'end', mt: 1 }} variant="body1" gutterBottom component="div">
              {`Total: ${total}$`}
            </Typography>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const MyOrders: FC = () => {
  const [page, setPage] = useState<number>(defaultStartPage);
  const [limit, setLimit] = useState<number>(defaultLimit);

  const { data, error } = userApiSlice.useGetOrdersQuery<useGetQueryResponce<IResponsePaginatedData<IOrder>>>({
    page,
    limit,
  });

  const onPaginationChange = (_event: ChangeEvent<unknown>, value: number) => {
    window.scrollTo(0, 0);
    setPage(value - 1);
  };
  useShowErrorToast(error);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', p: 2 }}>
      <Typography sx={{ mt: '20px', ml: '20px', fontWeight: 600, fontSize: '30px', alignSelf: 'flex-start' }} variant="h1" component="h1">
        {'My Orders'}
      </Typography>
      {!data || (!data.totalPages && <NoData />)}
      {data && !!data.totalPages && (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 450, overflowX: 'auto' }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  {headers.map((item, index) => (
                    <TableCell key={index} align={item.align}>
                      {item.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.content.map((item, index) => (
                  <SubTableRow key={index} order={item} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination count={data.totalPages} color="primary" defaultPage={1} boundaryCount={2} page={page + 1} onChange={onPaginationChange} />
        </>
      )}
    </Box>
  );
};

export default MyOrders;
