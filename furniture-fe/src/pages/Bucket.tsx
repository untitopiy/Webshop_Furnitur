import { FC, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector, useShowErrorToast } from '../hooks';
import CatalogListItem from '../components/CatalogListItem.tsx';
import { userApiSlice } from '../store/reducers/UserApiSlice.ts';
import Button from '@mui/material/Button';
import { createToast } from '../utils/toasts.ts';
import { clearBucket } from '../store/reducers/bucketSlice.ts';

const getTotalCost = (goods: { value: { price: number }; count: number }[]) => {
  let sum = 0;
  goods.forEach((item) => {
    sum += item.value.price * item.count;
  });

  return sum;
};

const Backet: FC = () => {
  const { products } = useAppSelector((state) => state.bucket);
  const dispatch = useAppDispatch();

  const [createOrder, { data: createdData, error: createdError, isLoading: createdIsLoading }] = userApiSlice.useCreateOrderMutation();

  useEffect(() => {
    if (createdData) {
      createToast.success('Ordered');
      dispatch(clearBucket());
    }
  }, [createdData]);

  useShowErrorToast(createdError);

  const totalCost = getTotalCost(products);

  const onCreateOrder = () => {
    const orderData = products.map((item) => ({ id: item.value.id, count: item.count, price: item.value.price }));
    createOrder({ products: orderData });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', m: 2, p: 2 }}>
      <Typography sx={{ mt: '20px', ml: '20px', fontWeight: 600, fontSize: '30px', alignSelf: 'flex-start' }} variant="h1" component="h1">
        {'Backet'}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', m: 2 }}>
        {!!products?.length && (
          <Box>
            <Box sx={{ display: 'flex', flexBasis: 200, flexWrap: 'wrap', gap: '20px', p: 2, bgcolor: '#ecf0f560' }}>
              {products.map((item, index) => (
                <CatalogListItem key={index} product={item.value} />
              ))}
            </Box>
          </Box>
        )}
        {!!products?.length && (
          <Typography sx={{ mt: '20px', ml: '16px', fontWeight: 600, fontSize: '24px', alignSelf: 'flex-start' }} variant="h2" component="h2">
            {`Total: ${Math.round((totalCost + Number.EPSILON) * 100) / 100} $`}
          </Typography>
        )}
        {!!products?.length && (
          <Button onClick={onCreateOrder} disabled={createdIsLoading} variant="contained" sx={{ minWidth: '200px', mb: 4 }}>
            {'Order'}
          </Button>
        )}
      </Box>
      {!products?.length && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Typography sx={{ mt: '20px', ml: '13px', fontWeight: 600, fontSize: '30px', alignSelf: 'flex-start' }} variant="h2" component="h2">
            {'You have no positions in the Bucket'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Backet;
