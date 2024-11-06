"use client"
import { useRouter } from 'next/navigation'

const Redirect = () => {
    const router = useRouter();
    router.push("/cryptohub/cryptochat")
    return (
        <></>
    )
}

export default Redirect
