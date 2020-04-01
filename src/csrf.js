
// DON'T DO THIS HERE:
// const Tokens = require('csrf')
// const { parseCookies, setCookie } = require('nookies')
// it would add them to the client side code!!
// these are required further below so that they are only added to the server bundle.

const csrf = async (ctx) => {
    let csrfToken
    let isValidCSRFToken

    if (!ctx.req && typeof document !== 'undefined') {
        // browser side

        // make api call to fetch csrf token
        const response = await fetch('/api/csrf')
        try {
            const content = await response.json()
            if (!response.ok) {
                console.error(response)
            } else {
                csrfToken = content.csrf
            }
        }
        catch (e) {
            console.error(e)
        }

        return { csrfToken, isValidCSRFToken }
    }

    // Code will be eliminated by webpack for browser build
    if (process.browser === false) {
        // server side    

        if (!ctx.req) {
            // static nextjs export html page
            return { csrfToken, isValidCSRFToken }
        }

        // when called without cookies, this will generate a new csrf secret, this is the behaviour when loading the page for the first time
        // when called with the _csrf cookie, it will use that as a secret and create a new token
        // it will validate the csrf token present as a body param, query param or a header agains the cookie that holds the private key

        const Tokens = require('csrf')
        const { parseCookies, setCookie } = require('nookies')

        const cookies = parseCookies(ctx)
        const tokens = new Tokens({})
        let secret
        // check if secret comes in cookies, use that one
        if (cookies['_csrf']) {
            secret = cookies['_csrf']

            // validate incoming token in request
            const incomingToken = (ctx.req.body && ctx.req.body._csrf) ||
                (ctx.req.query && ctx.req.query._csrf) ||
                (ctx.req.headers['csrf-token'])
            isValidCSRFToken = !!tokens.verify(secret, incomingToken)
        } else {
            // new secret is created and returned in cookie
            secret = tokens.secretSync()
            setCookie(ctx, '_csrf', secret, {
                path: '/',
                httpOnly: true,
                sameSite: 'strict'
            })
        }

        // generate new outgoing token for client to use as request parameter
        csrfToken = tokens.create(secret)

        return { csrfToken, isValidCSRFToken }
    }
}

export const withCSRF = Component => {
    const wrapper = props => {
        return (
            <Component {...props} />
        )
    }
    wrapper.getInitialProps = async ctx => {
        const csrfProps = await csrf(ctx)
        let componentProps = {}
        if (Component.getInitialProps) {
            componentProps = await Component.getInitialProps(ctx)
        }
        return { ...componentProps, ...csrfProps }
    }

    return wrapper
}

export default csrf
