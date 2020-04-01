import Link from 'next/link'

const App = () => {
    return <div>
        <div>
            <Link href="/login">
                <a>login using Link component (client side rendering)</a>
            </Link>
            <br />
            <a href="/login">login as regular link (server side rendering)</a>
        </div>
    </div>
}

export default App
