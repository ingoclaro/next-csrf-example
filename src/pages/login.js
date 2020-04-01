import { Fragment, useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { withCSRF } from '../csrf'

const Login = ({ csrfToken, validLogin }) => {
    const [loggedIn, setLoggedIn] = useState(false)

    if (loggedIn) {
        return <div>logged in!</div>
    }

    const deleteCookie = () => {
        fetch('/api/csrf', {
            method: 'DELETE',
        })
    }

    return (
        <Fragment>
            <Formik
                initialStatus={{ error: false }}
                initialValues={{ username: '', password: '' }}
                onSubmit={async (values, { setStatus }) => {
                    setStatus({ error: false })
                    const response = await fetch('/api/login', {
                        method: 'POST',
                        body: JSON.stringify(values),
                        headers: {
                            'Content-Type': 'application/json',
                            'csrf-token': csrfToken // send csrf token as a header, could be added as a hidden post param instead.
                        }
                    })
                    try {
                        const content = await response.json()
                        if (!response.ok) {
                            setStatus({ error: true, message: content.message })
                        } else {
                            setLoggedIn(true)
                        }
                    }
                    catch (e) {
                        setStatus({ error: true, message: 'error' })
                    }

                }}
            >
                {props => (
                    <Form>
                        {props.status.error && <div>{props.status.message}</div>}
                        <Field name="username" type="text" /><br />
                        <Field name="password" type="password" /><br />
                        <button type="submit" disabled={props.isSubmitting}>
                            Submit
                    </button>
                    </Form>
                )}
            </Formik>
            <div>valid credential: {validLogin}</div>
            <div><a href="#" onClick={() => deleteCookie()}>delete csrf cookie</a></div>
        </Fragment >
    )
}

Login.getInitialProps = ctx => {
    return {
        validLogin: 'admin / admin'
    }
}

export default withCSRF(Login)
