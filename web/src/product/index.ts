import { Color } from '../colors';

const DEFAULT_PRICE = 0;
const DEFAULT_IMAGE_AMOUNT = 0;

export class Product {
    public constructor(
        public id: string = '00000000-0000-0000-0000-000000000000',
        public title: string = '',
        public description: string = '',
        public price: number = DEFAULT_PRICE,
        public isAvailable: boolean = false,
        public color: Color = 'white',
        public IsLiked: boolean = false,
        public brand: string = '',
        public numOfImages: number = DEFAULT_IMAGE_AMOUNT
    ) { };
}

export class ProductCreation {
    public constructor(
        public title: string = '',
        public description: string = '',
        public price: number = DEFAULT_PRICE,
        public images: string[] = [],
        public color: Color = 'white',
        public brand: string = '',
    ) { };
}

export class ProductEdit {
    public constructor(
        public id: string = '00000000-0000-0000-0000-000000000000',
        public title: string = '',
        public description: string = '',
        public price: number = DEFAULT_PRICE,
        public isAvailable: boolean = false,
        public color: Color = 'white',
        public IsLiked: boolean = false,
        public brand: string = '',
        public images: string[] = [],
    ) { };
}
