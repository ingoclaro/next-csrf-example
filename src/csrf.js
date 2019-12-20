// import { Fragment } from 'react'
// import Head from 'next/head'

const csrf = (ctx) => {
    let csrfToken
    if (!ctx.req && typeof document !== 'undefined') {
        // browser side
        // this can be used if token is saved in the html
        // const meta = document.querySelector('meta[name="csrf-token"]')
        // csrfToken = (meta && meta.getAttribute('content')) || ''
        // return { csrfToken, isValidCSRFToken: false }
        return { csrfToken: '', isValidCSRFToken: false }
    }

    if (process.browser === false) { //don't load the stuff below browser side, in particular the required modules. Code will be eliminated by webpack
        if (!ctx.req) {
            // static nextjs export html page
            return { csrfToken: '', isValidCSRFToken: false }
        }

        // server side
        const Tokens = require('csrf')
        const { parseCookies, setCookie } = require('nookies')

        const cookies = parseCookies(ctx)
        const tokens = new Tokens({})
        let secret
        // check if secret comes in cookies, use that one
        if (cookies['_csrf']) {
            secret = cookies['_csrf']
        } else {
            secret = tokens.secretSync()
            setCookie(ctx, '_csrf', secret, {
                path: '/',
                httpOnly: true,
                sameSite: 'strict'
            })
        }

        // validate incoming token
        let isValidCSRFToken = false
        if (ctx.req) {
            const incomingToken = (ctx.req.body && ctx.req.body._csrf) ||
                (ctx.req.query && ctx.req.query._csrf) ||
                (ctx.req.headers['csrf-token'])
            isValidCSRFToken = !!tokens.verify(secret, incomingToken)
        }

        // generate outgoing token
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
        const csrfProps = csrf(ctx)
        let componentProps = {}
        if (Component.getInitialProps) {
            componentProps = await Component.getInitialProps(ctx)
        }
        return { ...componentProps, ...csrfProps }
    }
    return wrapper
}

export default csrf
