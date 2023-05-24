// Copyright (C) 2021 Creditor Corp. Group.
// See LICENSE for copying information.

import { User, UserRegisterData, UserUpdateData } from '.';
import { UsersClient } from '@/api/users';

/**
 * Exposes all users related logic.
 */
export class UsersService {
    private readonly users: UsersClient;
    /** UsersService contains http implementation of users API  */
    public constructor(users: UsersClient) {
        this.users = users;
    }
    /** handles user registration */
    public async register(user: UserRegisterData): Promise<void> {
        await this.users.register(user);
    }
    /** handles user login */
    public async login(email: string, password: string): Promise<void> {
        await this.users.login(email, password);
    }
    /** gets user info */
    public async getUser(): Promise<User> {
        return await this.users.getUser();
    }

    /** updates user info */
    public async update(user: UserUpdateData): Promise<void> {
        await this.users.update(user);
    }
}
