import React from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { BadgeCheck } from 'lucide-react'
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar'
import { Button } from '../ui/button'
import { useRecommendedUserQuery } from '@/redux/features/api/authApi'
import Loading from '../Shared/Loading'
import Image from 'next/image'
interface IUser {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    profileImage?: string;
    coverImage?: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    followers?: string[];
    role: ("ADMIN" | "USER");
    refreshToken?: string;
    // posts: ObjectId[];
    // comments: ObjectId[];
}
const VerifiedAccounts = () => {
    const { data: allUsersData, isLoading: allUsersDataLoading } = useRecommendedUserQuery("");
    if (allUsersDataLoading) {
        return <Loading />
    }
    const allUsers: IUser[] = allUsersData?.data || [];
    console.log(allUsersData);
    return (
        <div>
            <Card className="border bg-transparent border-cyan-400 text-white">
                <CardHeader>
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <BadgeCheck className="h-5 w-5 fill-blue-400 text-white" />
                        Recommended Accounts
                    </h2>
                </CardHeader>
                <CardContent className="space-y-3 h-[300px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:transparent [&::-webkit-scrollbar-thumb]:bg-gray-500">
                    {allUsers?.map((user: IUser) => (
                        <div key={user?.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    {
                                        user?.profileImage ? <Image width={300} height={300} className='rounded-full h-7 w-7' src={user?.profileImage} alt='profile image' /> : <AvatarFallback className=' bg-gray-500 h-7 w-7 text-white rounded-full flex items-center justify-center text-center'>{user?.firstName[ 0 ].toUpperCase()}</AvatarFallback>
                                    }

                                </Avatar>
                                <span>{user?.firstName + "" + user?.lastName}</span>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                className="hover:bg-purple-800 bg-indigo-600 hover:text-white text-white"
                            >
                                Follow
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}

export default VerifiedAccounts
