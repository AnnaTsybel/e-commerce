import Auth from '@components/Auth';
import { Registration } from '@components/Auth/Registration';

const RegistrationPage = () => {
    return (
        <Auth >
            <Registration />
        </Auth>
    );
};

export default RegistrationPage;