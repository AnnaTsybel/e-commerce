import { Product } from '../product';

export const product = new Product(
    '9342442',
    'Mobile phone',
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
     incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud 
     exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure
      dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
       mollit anim id est laborum.`,
    1000,
    ['./static/img/phone-photo.jpeg'],
    true,
    ['purple'],
    false
);
export const product1 = new Product(
    '942924924',
    'Mobile phone',
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
     incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud 
     exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure
      dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
       mollit anim id est laborum.`,
    300000,
    ['./static/img/phone-photo.jpeg'],
    true,
    ['yellow'],
    true
);

export const products = [
    product, product, product1,
    product, product, product1,
    product1, product, product,
    product, product, product,
    product, product, product, product,
];