import React from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { BadgeCheck } from 'lucide-react'
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar'
import { Button } from '../ui/button'

const RecommendedAccounts = () => {
    const names = [ "Tabi", "junaid", "Tabi", "Tabi", "junaid", "Tabi", "Tabi", "name", "junaid", "ccjames00" ]
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
                  {names?.map((name) => (
                      <div key={name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                  <AvatarFallback>{name[ 0 ].toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span>{name}</span>
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

export default RecommendedAccounts
