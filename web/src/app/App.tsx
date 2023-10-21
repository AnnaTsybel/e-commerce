import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Notification } from '@components/common/Notification';

import { GlobalRoutes } from '@app/routes';

import '../index.scss';

/** initial App setup */
function App() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BrowserRouter>
                <Notification />
                <GlobalRoutes />
            </BrowserRouter>
        </Suspense>
    );
}

export default App;
