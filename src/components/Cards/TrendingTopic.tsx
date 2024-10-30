import React from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Flame } from 'lucide-react'

const TrendingTopic = () => {
  return (
    <div>
          <Card className="bg-transparent border border-cyan-400 text-white ">
              <CardHeader>
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Flame className="text-red-500" fill="red" />
                  </h2>
              </CardHeader>
              <CardContent className="text-gray-400">
                  Trending topics will go here.
              </CardContent>
          </Card>
    </div>
  )
}

export default TrendingTopic
