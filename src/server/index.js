import {router} from './trpc.js';
import {usersRouter} from './routers/users.js';

export const appRouter = router({
    users: usersRouter,
});

// export const AppRouter = typeof appRouter;
