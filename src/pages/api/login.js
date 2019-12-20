import csrf from '../../csrf'

export default (req, res) => {
    if (req.method !== 'POST') {
        return res.status(400).json({ status: 400, message: 'invalid method' })
    }

    const { isValidCSRFToken } = csrf({ req, res })

    if (!isValidCSRFToken) {
        return res.status(403).json({ status: 403, message: 'invalid CSRF token' })
    }

    console.log(JSON.stringify(req.body, null, 2))

    if (!req.body.username || req.body.username === '' || !req.body.password || req.body.password === '') {
        // res.setHeader('WWW-Authenticate', 'bearer')
        return res.status(401).json({ status: 401, message: 'auth required' })
    }

    if (req.body.username !== 'admin' || req.body.password !== 'admin') {
        return res.status(403).json({ status: 403, message: 'invalid credentials' })
    }

    return res.status(200).json({ status: 200 })
}