import csrf from '../../csrf'
const { setCookie } = require('nookies')

async function generate(req, res) {
    const { csrfToken } = await csrf({ req, res })
    return res.status(200).json({ status: 200, csrf: csrfToken })
}

function delete_cookie(req, res) {
    setCookie({ req, res }, '_csrf', '', {
        maxAge: -99999999,
        path: '/',
        httpOnly: true,
        sameSite: 'strict'
    })
    return res.status(200).json({ status: 200 })
}

export default (req, res) => {
    if (req.method === 'GET') {
        return generate(req, res)
    }
    if (req.method === 'DELETE') {
        return delete_cookie(req, res)
    }

    return res.status(405).json({ status: 405, message: 'Method Not Allowed' })
}
