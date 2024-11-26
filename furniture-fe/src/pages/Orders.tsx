import { ChangeEvent, FC, useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  Typography,
  Collapse,
  Pagination,
  Tooltip,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp, Forward } from '@mui/icons-material';
import moment from 'moment';
import { userApiSlice } from '../store/reducers/UserApiSlice';
import { adminApiSlice } from '../store/reducers/AdminApiSlice';
import { createToast } from '../utils/toasts';
import { useShowErrorToast } from '../hooks';
import NoData from '../components/NoData';
import { apiImageUrl, defaultLimit, defaultStartPage } from '../constants';

const headers = [{ label: '№' }, { label: 'User(ID)' }, { label: 'Status' }, { label: 'Created' }, { label: 'Completed' }];

const subHeaders = [{ label: 'Title' }, { label: '' }, { label: 'Count' }, { label: 'Price' }];

const getForwardTooltip = (status: string) => {
  if (status === 'created') return 'Forward to In progress';
  if (status === 'inprogress') return 'Forward to Completed';
  return '';
};

const getForwardStatus = (status: string) => {
  if (status === 'created') return 'inprogress';
  if (status === 'inprogress') return 'completed';
  return status;
};

interface SubTableRowProps {
  order: any;
  onUpdateOrderStatus: (id: number, status: string) => void;
}

const SubTableRow: FC<SubTableRowProps> = ({ order, onUpdateOrderStatus }) => {
  const [open, setOpen] = useState(false);

  const total = order.orderItems?.reduce((sum, item) => sum + item.orderitem.price * item.orderitem.count, 0);

  const handleUpdate = () => {
    const nextStatus = getForwardStatus(order.status);
    if (nextStatus !== order.status) {
      onUpdateOrderStatus(order.id, nextStatus);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>
          {order.orderItems?.length > 0 && (
            <IconButton size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          )}
        </TableCell>
        <TableCell>{order.id}</TableCell>
        <TableCell>{`${order.user?.username} (${order.user?.id})`}</TableCell>
        <TableCell>
          <Box display="flex" alignItems="center" gap="5px">
            {order.status}
            {order.status !== 'completed' && (
              <Tooltip title={getForwardTooltip(order.status)}>
                <IconButton onClick={handleUpdate}>
                  <Forward fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </TableCell>
        <TableCell>{moment(order.created_at).format('DD.MM.YYYY HH:mm')}</TableCell>
        <TableCell>{order.completed_date && moment(order.completed_date).format('DD.MM.YYYY HH:mm')}</TableCell>
      </TableRow>
      {order.orderItems?.length > 0 && (
        <TableRow>
          <TableCell colSpan={6} style={{ padding: 0 }}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box m={1} p={1} bgcolor="#dceaeb">
                <Typography variant="h6">Products</Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {subHeaders.map((header, index) => (
                        <TableCell key={index}>{header.label}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>
                          <img src={`${apiImageUrl}${item.image}`} alt={item.title} width={80} height={80} />
                        </TableCell>
                        <TableCell>{item.orderitem.count}</TableCell>
                        <TableCell>{item.orderitem.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Typography align="right" mt={1}>
                  {`Total: ${total}$`}
                </Typography>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

const Orders: FC = () => {
  const [page, setPage] = useState<number>(defaultStartPage);
  const [limit, setLimit] = useState<number>(defaultLimit);

  const { data, error } = userApiSlice.useGetOrdersQuery<any>({
    page,
    limit,
  });

  const [updateOrderStatus, { data: updatedData, error: updatedError }] = adminApiSlice.useUpdateOrderStatusMutation();

  useEffect(() => {
    if (updatedData) {
      createToast.success('Updated');
    }
  }, [updatedData]);

  const onPaginationChange = (_event: ChangeEvent<unknown>, value: number) => {
    window.scrollTo(0, 0);
    setPage(value - 1);
  };

  useShowErrorToast(error);
  useShowErrorToast(updatedError);

  const onUpdateOrderStatus = (id: number, status: string) => {
    updateOrderStatus({ id, data: { status } });
  };

  return (
    <Box p={2} display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Typography variant="h1" fontWeight={600} fontSize="30px">
        Orders
      </Typography>
      {!data || !data.content || data?.content?.length === 0 ? (
        <NoData />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  {headers.map((header, index) => (
                    <TableCell key={index}>{header.label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.content.map((order) => (
                  <SubTableRow key={order.id} order={order} onUpdateOrderStatus={onUpdateOrderStatus} />
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

export default Orders;
