
import {createUserHandler, getUsersHandler, loginHandler} from "./user.controller";
import {$ref} from "./user.schema";
import {server} from "../app";
import {FastifyInstance} from "fastify";

async function userRoute(fastify: FastifyInstance) {
    fastify.post('/',
        {
            schema: {
                body: $ref("createUserSchema"),
                response: {
                    200: $ref("createUserResponseSchema")
                }
            }
        },
        createUserHandler);

    fastify.post('/login', {
        schema: {
            body: $ref("loginSchema"),
            response: {
                200: $ref("loginResponseSchema")
            }
        }
    }, loginHandler);

    fastify.get('/', {
        preHandler: [server.authenticate],
    }, getUsersHandler);
}

export default userRoute;