import { useEffect, FC } from "react";
import { RouterProvider, createBrowserRouter, redirect } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./hooks";
import { setUserData, setUserToken } from "./store/reducers/AuthSlice";
import { getToken } from "./utils/localStorage";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";
import Loader from "./components/Loader";
import Admin from "./pages/Admin";
import CreateSurvey from "./pages/CreateSurvey";
import Survey from "./pages/Survey";
import Analytic from "./pages/Analytic";
import { adminRole, userRole } from "./constants";
import { getUserFromToken } from "./utils";

import "./App.css";
import Catalog from "./pages/Catalog.tsx";
import AdminProducts from "./pages/AdminProducts.tsx";
import Bucket from "./pages/Bucket.tsx";
import MyOrders from "./pages/MyOrders.tsx";
import Orders from "./pages/Orders.tsx";
import AdminCategories from "./pages/AdminCategories.tsx";

const App: FC = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        const localToken = getToken();
        const userFromToken = getUserFromToken(localToken);

        dispatch(setUserToken(localToken));
        dispatch(setUserData(userFromToken));
    }, [dispatch]);

    const router = createBrowserRouter([
        {
            id: "root",
            path: "/",
            children: [
                {
                    Component: Layout,
                    children: [
                        {
                            index: true,
                            Component: Catalog,
                        },
                        {
                            path: "products",
                            loader: () => roleProtectedLoader([adminRole]),
                            Component: AdminProducts,
                        },
                        {
                            path: "bucket",
                            loader: () => roleProtectedLoader([userRole]),
                            Component: Bucket,
                        },
                        {
                            path: "orders",
                            loader: () => roleProtectedLoader([adminRole]),
                            Component: Orders,
                        },
                        {
                            path: "categories",
                            loader: () => roleProtectedLoader([adminRole]),
                            Component: AdminCategories,
                        },
                        {
                            path: "my-orders",
                            loader: () => roleProtectedLoader([userRole]),
                            Component: MyOrders,
                        },
                    ],
                },
                {
                    path: "*",
                    Component: NotFound,
                },
            ],
        },
    ]);

    function roleProtectedLoader(allowedRoles: string[]) {
        if (!user || !allowedRoles.includes(user.role)) {
            return redirect("/");
        }
        return null;
    }

    function protectedLoader() {
        if (!user || !user.username) {
            return redirect("/");
        }
        return null;
    }

    function publicOnlyLoader() {
        if (user) {
            if (user.role === adminRole) {
                return redirect("/admin");
            }
            if (user.role === userRole) {
                return redirect("/surveys");
            }
        }
        return null;
    }

    return <RouterProvider router={router} fallbackElement={<Loader />} />;
};

export default App;
