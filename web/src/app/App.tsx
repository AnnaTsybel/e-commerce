import { Suspense } from 'react';

import { BrowserRouter } from 'react-router-dom';
import { GlobalRoutes } from '../routes';

import '../index.scss';

function App() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BrowserRouter>
                <GlobalRoutes />
            </BrowserRouter>
        </Suspense>
    );
}

export default App;
