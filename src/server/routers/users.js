import {z} from 'zod';
import {router, publicProcedure} from '../trpc.js';

// Sample data store (in a real app, you'd use a database)
let users = [
    {id: 1, name: 'John Doe', email: 'john@example.com', createdAt: new Date().toISOString()},
    {id: 2, name: 'Jane Smith', email: 'jane@example.com', createdAt: new Date().toISOString()},
];

export const usersRouter = router({
    // Get all users
    getAll: publicProcedure.query(() => {
        return users;
    }),

    // Get user by ID
    getById: publicProcedure
        .input(z.object({id: z.number()}))
        .query(({input}) => {
            const user = users.find(u => u.id === input.id);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        }),

    // Create a new user
    create: publicProcedure
        .input(z.object({
            name: z.string().min(1, 'Name is required'),
            email: z.string().email('Invalid email format'),
        }))
        .mutation(({input}) => {
            const newUser = {
                id: Math.max(...users.map(u => u.id), 0) + 1,
                name: input.name,
                email: input.email,
                createdAt: new Date().toISOString(),
            };
            users.push(newUser);
            return newUser;
        }),

    // Update user
    update: publicProcedure
        .input(z.object({
            id: z.number(),
            name: z.string().min(1, 'Name is required'),
            email: z.string().email('Invalid email format'),
        }))
        .mutation(({input}) => {
            const userIndex = users.findIndex(u => u.id === input.id);
            if (userIndex === -1) {
                throw new Error('User not found');
            }

            users[userIndex] = {
                ...users[userIndex],
                name: input.name,
                email: input.email,
            };

            return users[userIndex];
        }),

    // Delete user
    delete: publicProcedure
        .input(z.object({id: z.number()}))
        .mutation(({input}) => {
            const userIndex = users.findIndex(u => u.id === input.id);
            if (userIndex === -1) {
                throw new Error('User not found');
            }

            const deletedUser = users.splice(userIndex, 1)[0];
            return deletedUser;
        }),

    // Get user count
    getCount: publicProcedure.query(() => {
        return {count: users.length};
    }),
});
