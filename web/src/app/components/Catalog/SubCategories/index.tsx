import { Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';

import { SubCategory, SubSubCategory } from '@/categories';
import { getListByCategory } from '@/app/store/actions/products';
import { useAppDispatch } from '@/app/hooks/useReduxToolkit';

import './index.scss';

export const SubCategories: React.FC<{
    subcategory: SubCategory;
    setCatalogOpened: Dispatch<SetStateAction<boolean>>;
}> = ({ subcategory, setCatalogOpened }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleRedirectingCategoryProducts = async(id: string) => {
        await dispatch(getListByCategory(id));

        navigate(`/category/${id}/products`);

        setCatalogOpened(false);
    };

    return <div className="subcategory">
        <h3 className="subcategory__title">{subcategory.name}</h3>
        <div className="subcategory__subsubcategories">
            {subcategory.subsubcategories.map((subsubcategory: SubSubCategory) =>
                <div
                    className="subcategory__subsubcategories__item"
                    onClick={() => handleRedirectingCategoryProducts(subsubcategory.id)}
                    key={subcategory.id}
                >
                    {subsubcategory.name}
                </div>
            )}
        </div>
    </div>;
};


