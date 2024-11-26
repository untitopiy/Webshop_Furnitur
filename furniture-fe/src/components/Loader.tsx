import CircularProgress from '@mui/material/CircularProgress';
import { FC } from "react";
 
const Loader: FC = () => {
    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
            <CircularProgress />
        </div>
    );
}
 
export default Loader;