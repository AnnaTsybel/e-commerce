import { Color } from '../colors';

const DEFAULT_PRICE = 0;

export class Product {
    public constructor(
        public id: string = '00000000-0000-0000-0000-000000000000',
        public title: string = '',
        public description: string = '',
        public price: number = DEFAULT_PRICE,
        public photo: string[] = [],
        public isAvailable: boolean = false,
        public color: Color[] = ['white'],
        public IsLiked: boolean = false,
    ) { };
}

export class ProductCreation {
    public constructor(
        public title: string = '',
        public description: string = '',
        public price: number = DEFAULT_PRICE,
        public photo: string[] = [],
        public color: Color[] = ['white'],
    ) { };
}

export class ProductEdit {
    public constructor(
        public id: string = '00000000-0000-0000-0000-000000000000',
        public title: string = '',
        public description: string = '',
        public price: number = DEFAULT_PRICE,
        public isAvailable: boolean = false,
        public color: Color[] = ['white'],
        public IsLiked: boolean = false,
    ) { };
}
