import { Route, Routes } from 'react-router-dom';

/**
 * ComponentRoutes describes location mapping with components.
 */
export class ComponentRoutes {
    constructor(
        public path: string,
        public element: JSX.Element,
        public children?: ComponentRoutes[]
    ) { }

    /** with is method that creates child sub routes path */
    public with(
        child: ComponentRoutes,
        parrent: ComponentRoutes
    ): ComponentRoutes {
        child.path = `${parrent.path}/${child.path}`;

        return this;
    }

    /** addChildren is method that adds children components to component */
    public addChildren(children: ComponentRoutes[]): ComponentRoutes {
        this.children = children.map((child: ComponentRoutes) =>
            child.with(child, this)
        );

        return this;
    }
}

/**
 * RoutesConfig contains information about all routes and subroutes.
 */
export class RoutesConfig {
    /** Routes is an array of logical router components */
    public static routes: ComponentRoutes[] = [
    ];
}

export const Switch = () =>
    <Routes>
        {RoutesConfig.routes.map(
            (route: ComponentRoutes, index: number) =>
                <Route
                    key={index}
                    path={route.path}
                    element={route.element}
                    caseSensitive={false}
                />
        )}
    </Routes>;
