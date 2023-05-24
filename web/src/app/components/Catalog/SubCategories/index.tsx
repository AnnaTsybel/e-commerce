import './index.scss';

export const SubCategories: React.FC<{ subcategory: any }> = ({ subcategory }) =>
    <div className="subcategory">
        <h3 className="subcategory__title">{subcategory.subcategory}</h3>
        <div className="subcategory__subsubcategories">
            {subcategory.subsubcategory.map((subsubcategory: any) =>
                <p className="subcategory__subsubcategories__item">
                    {subsubcategory}
                </p>
            )}
        </div>
    </div>;

