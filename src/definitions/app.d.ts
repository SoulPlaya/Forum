/**
 * This is a TypeScript definition file.
 * It's used to provide definitions for types used in a project.
 * You don't need to touch it right now, as it doesn't actually do
 * anything other than give the IDE better information about your
 * project's data types.
 */

import { Context, Next, Request } from 'koa'
import { User } from '../model/users.model'

declare global {
    /**
     * Application routing context
     */
    interface AppContext extends Context {
        /**
         * The associated user
         */
        user: User | null

        /**
         * Whether the current request is from a logged-in user
         */
        isLoggedIn: boolean
        
        /**
         * The actual request
         */
        request: Request & { body?: any }

        /**
         * @param template The name of the template to render
         * @param pageTitle The name of the page to render
         * @param errorMessage The error message to provide (defaults to null)
         * @param data Any additional data to pass
         */
        defaultRender: (template: string, pageTitle: string, errorMessage: string | null, data?: any) => Promise<void>
    }

    /**
     * Function called to invoke the next request handler
     */
    type NextFunction = Next
}
