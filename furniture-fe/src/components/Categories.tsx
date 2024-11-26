import Box from "@mui/material/Box";
import {FC} from "react";

interface ThisProps {
    categories: any[];
    category: string;
    setCategory: (data: string) => void;
}

const Categories:FC<ThisProps> = ({categories, setCategory, category}) => {

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: '10px', bgcolor: '#718be3', p: 2, borderRadius: '5px', width: '100%' }}>
            <Box key={'all'} onClick={() => setCategory('All')} sx={{bgcolor: category === 'All' ? '#2f5fda' : 'rgba(105,94,177,0.87)', p: 1, borderRadius: '5px', '&:hover': { bgcolor: '#09419c', color: '#fff' } }}>
                {'All'}
            </Box>
            {categories?.map(item => {
                return <Box key={item.id} onClick={() => setCategory(item.id || 'All')} sx={{bgcolor: category === item.id ? '#2f5fda' : 'rgba(105,94,177,0.87)',  p: 1, borderRadius: '5px', '&:hover': { bgcolor: '#09419c', color: '#fff' } }}>
                    {item.name}
                </Box>
            })}
        </Box>
    );
};

export default Categories;