import { lazy, useEffect } from 'react';
import { Route, useLocation, Routes, useNavigate } from 'react-router-dom';
import { Footer } from '../app/components/common/Footer';

import { Navbar } from '../app/components/common/Navbar';

const RegistrationPage = lazy(() => import('../app/views/RegistrationPage'));
const LoginPage = lazy(() => import('../app/views/LoginPage'));
const Home = lazy(() => import('../app/views/Home'));
const User = lazy(() => import('../app/views/UserPage'));
const NotFound = lazy(() => import('../app/views/NotFound'));
const Product = lazy(() => import('../app/views/Product'));
const Products = lazy(() => import('../app/views/Products'));
const ProductCreate = lazy(() => import('../app/views/Product/Create'));
const ProductEdit = lazy(() => import('../app/views/Product/Edit'));
const Categories = lazy(() => import('../app/views/Categories'));

/** Route base config implementation */
export class ComponentRoutes {
    /** data route config*/
    constructor(
        public path: string,
        public component: any,
        public exact: boolean,
        public className?: string,
        public children?: ComponentRoutes[]
    ) { }
    /** Method for creating child subroutes path */
    public with(child: ComponentRoutes, parrent: ComponentRoutes): ComponentRoutes {
        child.path = `${parrent.path}/${child.path}`;

        return this;
    }
    /** Call with method for each child */
    public addChildren(children: ComponentRoutes[]): ComponentRoutes {
        this.children = children.map((item) => item.with(item, this));

        return this;
    }
}

export class RouteConfig {
    public static Home: ComponentRoutes
        = new ComponentRoutes(
            '/',
            <Home />,
            false
        );
    public static NotFound: ComponentRoutes
        = new ComponentRoutes(
            '/*',
            <NotFound />,
            false
        );
    public static User: ComponentRoutes
        = new ComponentRoutes(
            '/user/:id',
            <User />,
            false
        );
    public static Product: ComponentRoutes
        = new ComponentRoutes(
            '/product/:id',
            <Product />,
            false
        );
    public static Products: ComponentRoutes
        = new ComponentRoutes(
            '/products',
            <Products />,
            false
        );
    public static ProductCreate: ComponentRoutes
        = new ComponentRoutes(
            '/product/create',
            <ProductCreate />,
            false
        );
    public static ProductEdit: ComponentRoutes
        = new ComponentRoutes(
            '/product/:id/edit',
            <ProductEdit />,
            false
        );
    public static Categories: ComponentRoutes
        = new ComponentRoutes(
            '/categories',
            <Categories />,
            false
        );
    public static routes: ComponentRoutes[] = [
        RouteConfig.Home,
        RouteConfig.User,
        RouteConfig.NotFound,
        RouteConfig.Product,
        RouteConfig.Products,
        RouteConfig.ProductCreate,
        RouteConfig.ProductEdit,
        RouteConfig.Categories
    ];
}

export class AuthRoutesConfig {
    public static Registration: ComponentRoutes
        = new ComponentRoutes(
            '/registration',
            <RegistrationPage />,
            false
        );
    public static Login: ComponentRoutes
        = new ComponentRoutes(
            '/login',
            <LoginPage />,
            false
        );
    /** Routes is an array of logical router components */
    public static routes: ComponentRoutes[] = [
        AuthRoutesConfig.Login,
        AuthRoutesConfig.Registration,
    ];
}

export const GlobalRoutes = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isLoggedin = window.localStorage.getItem('IS_LOGGINED');

    useEffect(() => {
        if (!isLoggedin && location.pathname !== AuthRoutesConfig.Login.path) {
            console.log(location.pathname )
            navigate(AuthRoutesConfig.Registration.path);
        } else if (!isLoggedin && location.pathname === AuthRoutesConfig.Login.path) {
            console.log('hello')
            navigate(AuthRoutesConfig.Login.path);
        } else {
            navigate(RouteConfig.Home.path);
        }
    }, [isLoggedin]);

    return (
        <>
            {!isLoggedin ?
                <Routes>
                    {AuthRoutesConfig.routes.map(
                        (route: ComponentRoutes, index: number) =>
                            <Route
                                key={index}
                                path={route.path}
                                element={route.component}
                            />
                    )}
                </Routes>
                : <div>
                    <Navbar />
                    <div className="page">
                        <Routes>
                            {RouteConfig.routes.map(
                                (route: ComponentRoutes, index: number) =>
                                    <Route
                                        key={index}
                                        path={route.path}
                                        element={route.component}
                                    />
                            )}
                        </Routes>
                    </div>
                    <Footer />
                </div>
            }
        </>)
};