import {z} from "zod";
import {buildJsonSchemas} from "fastify-zod";

const userMainFields = {
    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    }).email(),
    name: z.string().min(2),
}
const createUserSchema = z.object({
    ...userMainFields,
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    }).min(8),
});

const createUserResponseSchema = z.object({
    id: z.number(),
    ...userMainFields,
});

const loginSchema = z.object({
    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    }).email(),
    password: z.string()
})

const loginResponseSchema = z.object({
    accessToken: z.string(),
})

export type CreateUserSchemaInput = z.infer<typeof createUserSchema>;
export type LoginSchemaInput = z.infer<typeof loginSchema>;

export const {schemas: UserSchemas, $ref} = buildJsonSchemas({
    createUserSchema,
    createUserResponseSchema,
    loginSchema,
    loginResponseSchema,
});