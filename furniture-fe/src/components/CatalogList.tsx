import {FC} from "react";
import Box from "@mui/material/Box";
import CatalogListItem from "./CatalogListItem.tsx";

interface ThisProps {
    products: any[];
};

const CatalogList: FC<ThisProps> = ({products}) => {
    return (
        <Box sx={{display: 'flex', flexBasis: 200, flexWrap: 'wrap', gap: '20px', p: 2, bgcolor: '#d0dbeb61', width: '100%'}}>
            {products.map((product, index) => <CatalogListItem key={index} product={product} />)}
        </Box>
    );
};

export default CatalogList;
