import Link from 'next/link'

const App = () => {
    return <div>
        This doesn' work because it does client side rendering: <Link href="/login">
            <a>login</a>
        </Link> <br />

        you need a regular link: <a href="/login">login</a>
    </div>
}

export default App
