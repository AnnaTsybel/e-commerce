import { Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';

import { SubCategory, SubSubCategory } from '@/categories';

import './index.scss';

export const SubCategories: React.FC<{
    subcategory: SubCategory;
    setCatalogOpened: Dispatch<SetStateAction<boolean>>;
}> = ({ subcategory, setCatalogOpened }) => {
    const navigate = useNavigate();

    const handleRedirectingCategoryProducts = (id: string) => {
        navigate(`/category/${id}/products`);
        setCatalogOpened(false);
    };

    return <div className="subcategory">
        <h3 className="subcategory__title">{subcategory.name}</h3>
        <div className="subcategory__subsubcategories">
            {subcategory.subsubcategories.map((subsubcategory: SubSubCategory, index: number) =>
                <div
                    className="subcategory__subsubcategories__item"
                    onClick={() => handleRedirectingCategoryProducts(subsubcategory.id)}
                    key={`${subcategory.id}-${index}`}
                >
                    {subsubcategory.name}
                </div>
            )}
        </div>
    </div>;
};


