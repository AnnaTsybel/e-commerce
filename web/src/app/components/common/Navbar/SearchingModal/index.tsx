import { useNavigate } from 'react-router-dom';

import { Product } from '@/product';
import { getProduct } from '@/app/store/actions/products';
import { useAppDispatch } from '@/app/hooks/useReduxToolkit';

import './index.scss';

type SearchingModalProps = {
    setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
    foundedProducts: Product[];
    classname?: string;
};

export const SearchingModal: React.FC<SearchingModalProps>
    = ({ setIsSearching, foundedProducts, classname }) => {
        const navigate = useNavigate();
        const dispatch = useAppDispatch();

        const handleRedirectFoundProduct = (productId: string) => {
            dispatch(getProduct(productId));
            navigate(`/product/${productId}`);

            setIsSearching(false);
        };

        return (
            <div className={`searching-modal ${classname && classname}`}>
                <div className="searching-modal__content">
                    {foundedProducts.length ? foundedProducts.map((product: Product) =>
                        <div
                            className="searching-modal__info"
                            key={product.id}
                            onClick={() => handleRedirectFoundProduct(product.id)}
                        >
                            <p className="searching-modal__title">{product.title}</p>
                        </div>
                    ) :
                        <p className="searching-modal__no-item">
                            нема схожих товарів
                        </p>}
                </div>
            </div>
        );
    };
