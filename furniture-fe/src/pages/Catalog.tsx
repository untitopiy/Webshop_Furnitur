import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import { defaultLimit, defaultStartPage } from '../constants.ts';
import { useDebounce, useShowErrorToast } from '../hooks.ts';
import { adminApiSlice } from '../store/reducers/AdminApiSlice.ts';
import { IResponsePaginatedData, ISurvey, useGetQueryResponse } from '../types.ts';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';
import NoData from '../components/NoData.tsx';
import CatalogList from '../components/CatalogList.tsx';
import { userApiSlice } from '../store/reducers/UserApiSlice.ts';
import Categories from '../components/Categories.tsx';
import { Typography } from '@mui/material';

const Catalog: FC = () => {
  const [page, setPage] = useState<number>(defaultStartPage);
  const [query, setQuery] = useState<string>('');
  const [category, setCategory] = useState<string>('All');

  const debouncedValue = useDebounce(query);

  const onPaginationChange = (_event: ChangeEvent<unknown>, value: number) => {
    window.scrollTo(0, 0);
    setPage(value - 1);
  };

  const { data, error } = adminApiSlice.useGetAdminProductsQuery<useGetQueryResponse<IResponsePaginatedData<ISurvey>>>({
    page,
    limit: defaultLimit,
    query: debouncedValue,
    category,
  });
  const { data: categories, error: categoriesError } = userApiSlice.useGetCategoriesQuery<useGetQueryResponse<any[]>>('');

  useShowErrorToast(error);
  useShowErrorToast(categoriesError);

  useEffect(() => {
    if (query) {
      setPage(defaultStartPage);
    }
  }, [query]);

  useEffect(() => {
    if (category) {
      setPage(defaultStartPage);
    }
  }, [category]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (query) {
      setPage(defaultStartPage);
    }
  };

  return (
    <Box sx={{ p: 2, display: 'flex', gap: '20px', '@media(max-width: 780px)': { flexDirection: 'column', justifyContent: 'center' } }}>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <Typography sx={{ mt: '20px', fontWeight: 600, fontSize: '22px', alignSelf: 'flex-start' }} variant="h2" component="h2">
          {'Categories'}
        </Typography>
        <Categories categories={categories} category={category} setCategory={setCategory} />
      </Box>
      <Box sx={{ width: '100%' }}>
        <Box
          component="form"
          onSubmit={onSubmit}
          noValidate
          sx={{ m: 1, display: 'flex', alignItems: 'center', '@media(max-width: 780px)': { flexDirection: 'column', justifyContent: 'center' } }}
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
            onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.currentTarget.value)}
          />
        </Box>
        {data?.content && (
          <Box sx={{ display: 'flex', m: 2, flexDirection: 'column', alignItems: 'center', p: 2, gap: '10px' }}>
            <CatalogList products={data.content} isShownStatus />
            <Pagination count={data.totalPages} color="primary" defaultPage={1} boundaryCount={2} page={page + 1} onChange={onPaginationChange} />
          </Box>
        )}
        {!data?.content && <NoData />}
      </Box>
    </Box>
  );
};

export default Catalog;
