import { FC } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks.ts';
import { setProducts } from '../store/reducers/bucketSlice.ts';
import { Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import RemoveIcon from '@mui/icons-material/Remove';
import { apiImageUrl, userRole } from '../constants.ts';

interface ThisProps {
  product: any;
}

const CatalogListItem: FC<ThisProps> = ({ product }) => {
  const { products } = useAppSelector((state) => state.bucket);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const currentBucketInfo = products.find((item) => item.value.id === product.id);

  const add = () => {
    dispatch(setProducts({ value: product, operation: '+' }));
  };
  const remove = () => {
    dispatch(setProducts({ value: product, operation: '-' }));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '5px',
        flexGrow: 1,
        p: 2,
        bgcolor: '#83a3ce61',
        borderRadius: '10px',
      }}
    >
      <img style={{ borderRadius: '10px' }} width={'150'} height={'150'} src={`${apiImageUrl}${product.image}`} alt={product.name} />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ mt: '3px', fontSize: '1rem', alignSelf: 'center' }} variant="h5" component="h3">
          {product.title}
        </Typography>
        <Typography sx={{ mt: '3px', fontSize: '1rem', alignSelf: 'center' }} variant="h5" component="h3">
          {`Description: ${product.description}`}
        </Typography>
        <Typography sx={{ mt: '3px', fontSize: '1rem', alignSelf: 'center' }} variant="h5" component="h3">
          {`Price: ${product.price} $`}
        </Typography>
          <Typography sx={{ mt: '3px', fontSize: '1rem', alignSelf: 'center' }} variant="h5" component="h3">
          {`Category: ${product.category?.name}`}
        </Typography>
        <Typography sx={{ mt: '3px', fontSize: '1rem', alignSelf: 'center' }} variant="h5" component="h3">
          {`Size: ${product.size}`}
        </Typography>
        <Typography sx={{ mt: '3px', fontSize: '1rem', alignSelf: 'center' }} variant="h5" component="h3">
          {`Color: ${product.color}`}
        </Typography>
        {product.isoutofstock && (
          <Box sx={{ bgcolor: '#fb0000', color: '#fff', display: 'flex', justifyContent: 'center', mt: 1, borderRadius: '10px' }}>
            <Typography sx={{ mt: '3px', fontSize: '1rem', alignSelf: 'center' }} variant="h5" component="h3">
              {`Is out of stock`}
            </Typography>
          </Box>
        )}
        {user?.role === userRole && !product.isoutofstock && (
          <Box sx={{ alignSelf: 'center' }}>
            {!currentBucketInfo && <Button onClick={add}>{'Add to Backet'}</Button>}
            {currentBucketInfo && (
              <Box sx={{ display: 'flex', gap: '5px' }}>
                <Button onClick={remove}>
                  <RemoveIcon />
                </Button>
                <Typography sx={{ mt: '3px', fontSize: '1rem', alignSelf: 'center' }} variant="body2" component="p">
                  {currentBucketInfo.count}
                </Typography>
                <Button onClick={add}>
                  <AddIcon />
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CatalogListItem;
