import csrf from '../../csrf'

async function validate(req, res) {
    const { csrfToken, isValidCSRFToken } = await csrf({ req, res })

    if (!isValidCSRFToken) {
        return res.status(403).json({ status: 403, message: 'invalid CSRF token', csrfToken })
    }

    if (!req.body.username || req.body.username === '' || !req.body.password || req.body.password === '') {
        return res.status(401).json({ status: 401, message: 'auth required' })
    }

    // verify login and password, hardcoded as an example. Here you would fetch the user and compare the hashed password
    if (req.body.username !== 'admin' || req.body.password !== 'admin') {
        return res.status(403).json({ status: 403, message: 'invalid credentials' })
    }

    return res.status(200).json({ status: 200 })
}

export default (req, res) => {
    if (req.method === 'POST') {
        return validate(req, res)
    }

    return res.status(405).json({ status: 405, message: 'Method Not Allowed' })
}