export type Gender = 'man' | 'woman' | '';
export type UserStatus = 'admin' | 'user';

const DEFAULT_ROLE = 0;

export class User {
    public constructor(
        public id: string = '00000000-0000 - 0000 - 0000 - 000000000000',
        public name: string = '',
        public surname: string = '',
        public phoneNumber: string = '',
        public email: string = '',
        public role: number = DEFAULT_ROLE,
        public avatar: string = '',
        public passwordHash: string = '',
        public gender: Gender = '',
        public createdAt: string = ''
    ) { };
}

export class UserRegisterData {
    public constructor(
        public name: string = '',
        public surname: string = '',
        public phoneNumber: string = '',
        public email: string = '',
        public gender: Gender = '',
        public password: string = '',
    ) { };
}

export class UserUpdateData {
    public constructor(
        public id: string = '00000000-0000 - 0000 - 0000 - 000000000000',
        public name: string = '',
        public surname: string = '',
        public phoneNumber: string = '',
        public gender: Gender = '',
    ) { };
}
