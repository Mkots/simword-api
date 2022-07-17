import {FastifyReply, FastifyRequest} from "fastify";
import {createUser, findUserByEmail, findUsers} from "./user.service";
import {CreateUserSchemaInput, LoginSchemaInput} from "./user.schema";
import bcrypt from "bcrypt";
import {server} from "../app";

export async function createUserHandler(request: FastifyRequest<{ Body: CreateUserSchemaInput }>,
                                        reply: FastifyReply) {
    const body = request.body;
    console.log('|>', body);
    try {
        const user = await createUser(body);
        reply.status(201).send(user);
    } catch (e) {
        reply.status(400).send(e);
    }

}

export async function loginHandler(request: FastifyRequest<{ Body: LoginSchemaInput }>,
                                   reply: FastifyReply) {
    const body = request.body;
    // find user by email
    const user = await findUserByEmail(body.email);
    if (!user) {
        return reply.status(404).send({
            message: 'User not found'
        })
    }
    // compare password
    const isValid = await bcrypt.compare(body.password, user.password);
    if (!isValid) {
        return reply.status(401).send({
            message: 'Invalid password'
        })
    }
    // generate token
    const {password, ...userWithoutPassword} = user;
    const token = server.jwt.sign(userWithoutPassword);
    // return token
    reply.status(200).send({accessToken: token});
}

export async function getUsersHandler(request: FastifyRequest, reply: FastifyReply) {
    const users = await findUsers();
    reply.status(200).send(users);
}