export class SubCategory {
    public constructor(
        public id: string = '00000000-0000-0000-0000-000000000000',
        public subcategory: string = '',
        public subsubcategory: string[],
    ) { };
}

export class Category {
    public constructor(
        public id: string = '00000000-0000-0000-0000-000000000000',
        public category: string = '',
        public subcategories: SubCategory[] = [],
    ) { };
}
