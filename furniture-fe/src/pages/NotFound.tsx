import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { notFoundTextColor, notFoundButtonText, notFoundSubTitle, notFoundTitle } from '../constants';

const NotFound = () => {
  const history = useNavigate();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        height: '100vh',
        gap: '10px',
      }}
    >
      <p style={{ color: notFoundTextColor, fontSize: '2rem', fontWeight: 700 }}>{notFoundTitle}</p>
      <p style={{ color: notFoundTextColor, fontSize: '1.5rem', fontWeight: 500 }}>{notFoundSubTitle}</p>
      <Button variant="contained" onClick={() => history('/')}>
        {notFoundButtonText}
      </Button>
    </div>
  );
};

export default NotFound;
