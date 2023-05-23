export type Gender = 'man' | 'woman' | '';
export type UserStatus = 'admin' | 'user'

export class User {
    public constructor(
        public id: string = '00000000-0000 - 0000 - 0000 - 000000000000',
        public name: string = '',
        public surname: string = '',
        public phoneNumber: string = '',
        public email: string = '',
        public status: UserStatus = 'admin',
        public avatar: string = '',
        public gender: Gender = ''
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