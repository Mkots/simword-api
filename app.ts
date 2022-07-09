import Fastify, {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify'
import jwt from '@fastify/jwt'
import swagger from "@fastify/swagger";
import { withRefResolver } from "fastify-zod";

import userRoute from "./src/user/user.route";

import {UserSchemas} from "./src/user/user.schema";

declare module 'fastify' {
    export interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => void
    }
}

export const server: FastifyInstance = Fastify({})

const start = async () => {
    for (const schema of UserSchemas) {
        server.addSchema(schema)
    }
    server.register(swagger, withRefResolver({
        routePrefix: '/docs',
        exposeRoute: true,
        staticCSP: true,
        openapi:{
            info: {
                title: 'Title',
                description: 'Description',
                version: '1.0.0'
            }
        }
    }))
    server.register(userRoute, {prefix: 'api/user'})

    server.register(jwt, {
        secret: 'secret',
    })

    server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify()
        } catch (e) {
            return reply.status(401).send(e)
        }
    })

    try {
        await server.listen({port: 3000})


    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}
start()