import {FC} from "react";
import Box from "@mui/material/Box";
import CategoriesTable from "../components/CategoriesTable.tsx";
import {userApiSlice} from "../store/reducers/UserApiSlice.ts";
import {useGetQueryResponse} from "../types.ts";
import NoData from "../components/NoData.tsx";
import {useShowErrorToast} from "../hooks.ts";
import CategoriesModal from "../modals/CategoriesModal.tsx";
import {Typography} from "@mui/material";

const AdminCategories: FC = () => {
    const { data: categories, error: categoriesError } = userApiSlice.useGetCategoriesQuery<useGetQueryResponse<any[]>>('');

    useShowErrorToast(categoriesError);

    return (
      <Box sx={{p: 2, display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center'}}>
          <Typography sx={{ mt: '20px', fontWeight: 600, fontSize: '30px', alignSelf: 'flex-start' }} variant="h1" component="h1">
              {'Categories'}
          </Typography>
          <Box sx={{ alignSelf: 'flex-end'}}>
              <CategoriesModal />
          </Box>

        {!!categories?.length && <CategoriesTable categories={categories} />}
        {!categories?.length && <NoData />}
      </Box>
    );
};

export default AdminCategories;