import bcrypt from "bcrypt";
import prisma from "../utils/prisma";
import {CreateUserSchemaInput} from "./user.schema";

export async function createUser(input: CreateUserSchemaInput) {
    const {password, ...user} = input;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userToCreate = {...user, password: hashedPassword};

    return  prisma.user.create({
        data: userToCreate
    })
}

export async function findUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: {
            email
        }
    })
}

export async function findUsers() {
    return prisma.user.findMany()
}