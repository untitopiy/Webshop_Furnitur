import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import { defaultLimit, defaultStartPage } from '../constants.ts';
import { useDebounce, useShowErrorToast } from '../hooks.ts';
import { useNavigate } from 'react-router-dom';
import { adminApiSlice } from '../store/reducers/AdminApiSlice.ts';
import { IResponsePaginatedData, ISurvey, useGetQueryResponse } from '../types.ts';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { SurveysList } from '../components/SurveysList.tsx';
import Pagination from '@mui/material/Pagination';
import SearchIcon from '@mui/icons-material/Search';
import NoData from '../components/NoData.tsx';
import { Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import Filters from '../components/Categories.tsx';
import ProductsTable from '../components/ProductsTable.tsx';
import ProductsModal from '../modals/ProductsModal.tsx';

const AdminProducts: FC = () => {
  const [page, setPage] = useState<number>(defaultStartPage);
  const [query, setQuery] = useState<string>('');

  const debouncedValue = useDebounce(query);
  const history = useNavigate();

  const onPaginationChange = (_event: ChangeEvent<unknown>, value: number) => {
    window.scrollTo(0, 0);
    setPage(value - 1);
  };

  const { data, error } = adminApiSlice.useGetAdminProductsQuery<useGetQueryResponse<IResponsePaginatedData<ISurvey>>>({
    page,
    limit: defaultLimit,
    query: debouncedValue,
    category: 'All'
  });
  const [updateProduct, { data: updatedData, error: updatedError }] = adminApiSlice.useUpdateProductMutation();

  useShowErrorToast(error);

  useEffect(() => {
    if (query) {
      setPage(defaultStartPage);
    }
  }, [query]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (query) {
      setPage(defaultStartPage);
    }
  };

  const changeOutOfStock = (id: number, data: boolean) => {
    updateProduct({
      id,
      data: {
        isoutofstock: data,
      },
    });
  };

  return (
    <Box sx={{ p: 2, display: 'flex', gap: '20px', '@media(max-width: 870px)': { flexDirection: 'column', justifyContent: 'center' } }}>
      <Box sx={{ width: '100%' }}>
        <Box
          component="form"
          onSubmit={onSubmit}
          noValidate
          sx={{ m: 1, display: 'flex', alignItems: 'center', gap: '10px', '@media(max-width: 870px)': { flexDirection: 'column', justifyContent: 'center' } }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="query"
            label="Search"
            name="query"
            autoComplete="text"
            autoFocus
            sx={{ mb: 0 }}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.currentTarget.value)}
          />
          <ProductsModal />
        </Box>
        {data?.content && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <ProductsTable products={data.content} changeOutOfStock={changeOutOfStock} />
            <Pagination count={data.totalPages} color="primary" defaultPage={1} boundaryCount={2} page={page + 1} onChange={onPaginationChange} />
          </Box>
        )}
        {!data?.content && <NoData />}
      </Box>
    </Box>
  );
};

export default AdminProducts;
