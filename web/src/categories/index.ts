export class SubSubCategory {
    public constructor(
        public id: string = '00000000-0000-0000-0000-000000000000',
        public name: string = '',
        public categoryId: string = '',
    ) { };
}

export class SubCategory {
    public constructor(
        public id: string = '00000000-0000-0000-0000-000000000000',
        public name: string = '',
        public categoryId: string = '',
        public subsubcategories: SubSubCategory[] = [],
    ) { };
}

export class Category {
    public constructor(
        public id: string = '00000000-0000-0000-0000-000000000000',
        public name: string = '',
        public image: string = '',
        public subcategories: SubCategory[] = [],
    ) { };
}
