
// "use client"
// import { useGetUserByIdQuery } from '@/redux/features/api/authApi';
// import { useAppSelector } from '@/redux/hooks';
// import { useRouter } from 'next/navigation';
// import { ReactNode, useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
// import { IUser } from '../Cryptohub/Types';

// const AuthGuard = ({ children }: { children: ReactNode }) => {
//     const router = useRouter();
//     const user: IUser = useAppSelector((state) => state.auth.user);
//     const { data: userFromDb, isLoading: userFromDbLoading } = useGetUserByIdQuery(user?.id || null);
//     const [ toastShown, setToastShown ] = useState(false);

//     useEffect(() => {

//         if (!user && !toastShown) {
//             toast.error("Please Login First!");
//             setToastShown(true);
//             router.push("/auth/login");
//             return;
//         }
//     }, [ user, router, toastShown ]);

//     if (userFromDbLoading) return null;
//     if (!user || !userFromDb && !toastShown) {
//         toast.error("Please Login First!");
//         setToastShown(true);
//         router.push("/auth/login");
//         return;
//     }

//     if (!user) {
//         return null;
//     }
//     if ((userFromDb as { data: { isDeleted: boolean } }).data.isDeleted) {
//         toast.error("user is blocked");
//         setToastShown(true);
//         router.push("/auth/login");
//         return;
//     }

//     return <div>{children}</div>;
// };

// export default AuthGuard;


"use client"
import { useGetUserByIdQuery } from '@/redux/features/api/authApi';
import { useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IUser } from '../Cryptohub/Types';

const AuthGuard = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const user: IUser = useAppSelector((state) => state.auth.user);
    const { data: userFromDb, isLoading: userFromDbLoading } = useGetUserByIdQuery(user?.id || null, { skip: !user?.id });
    const [ toastShown, setToastShown ] = useState(false);

    useEffect(() => {
        if (!user && !toastShown) {
            toast.error("Please Login First!");
            setToastShown(true);
            router.push("/auth/login");
        }
    }, [ user, router, toastShown ]);

    if (userFromDbLoading) return null;

    if (!user || (!userFromDb && !toastShown)) {
        if (!toastShown) {
            toast.error("Please Login First!");
            setToastShown(true);
            router.push("/auth/login");
        }
        return null;
    }

    if (userFromDb && (userFromDb as { data: { isDeleted: boolean } }).data.isDeleted) {
        if (!toastShown) {
            toast.error("User is blocked");
            setToastShown(true);
            router.push("/auth/login");
        }
        return null;
    }

    return <div>{children}</div>;
};

export default AuthGuard;



// "use client";
// import { useGetUserByIdQuery } from '@/redux/features/api/authApi';
// import { useAppSelector } from '@/redux/hooks';
// import { useRouter } from 'next/navigation';
// import { ReactNode, useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
// import { IUser } from '../Cryptohub/Types';

// const AuthGuard = ({ children }: { children: ReactNode }) => {
//     const router = useRouter();
//     const user: IUser | null = useAppSelector((state) => state.auth.user);
//     const { data: userFromDb, isLoading: userFromDbLoading, refetch } = useGetUserByIdQuery(user?.id || '', { skip: !user?.id });
//     const [ hasRedirected, setHasRedirected ] = useState(false);

//     useEffect(() => {
//         if (!user && !userFromDbLoading && !hasRedirected) {
//             toast.error("Please Login First!");
//             setHasRedirected(true);
//             router.push("/auth/login");
//         } else if (user?.id && !userFromDbLoading) {
//             refetch();
//         }
//     }, [ user, userFromDb, userFromDbLoading, hasRedirected, router, refetch ]);

//     // Prevent the component from rendering children until loading is complete or redirection is handled
//     if (userFromDbLoading || !userFromDb || (!user && !userFromDb)) return null;

//     return <div>{children}</div>;
// };

// export default AuthGuard;

