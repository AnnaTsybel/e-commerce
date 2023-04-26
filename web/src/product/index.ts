import { Color } from '../colors';

export class Product {
    public constructor(
        public id: string = '00000000-0000-0000-0000-000000000000',
        public title: string = '',
        public description: string = '',
        public price: number = 0,
        public photo: string[] = [],
        public isAvailable: boolean = false,
        public color: Color = 'white',
        public favorite: boolean = false,
    ) { };
}

