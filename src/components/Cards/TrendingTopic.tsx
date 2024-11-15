"use client"
import React from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Flame } from 'lucide-react'
import { useGetAllTopicQuery } from '@/redux/features/api/topicApi'
import Loading from '../Shared/Loading'
import Image from 'next/image'
import { ITopic } from '../Cryptohub/Types'
import Link from 'next/link'

const TrendingTopic = () => {
  const { data: allTopicData, isLoading: allTopicDataLoading } = useGetAllTopicQuery("");
  if (allTopicDataLoading) {
    return <Loading />
  }
  const allTopics: ITopic[] = allTopicData?.data || [];
  return (
    <div>
      <Card className="bg-transparent border border-cyan-400 text-white ">
        <CardHeader>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Flame className="text-red-500" fill="red" />
            <h3>Trending Topics</h3>
          </h2>
        </CardHeader>

        <CardContent className=" h-[300px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:transparent [&::-webkit-scrollbar-thumb]:bg-gray-500">
          {allTopics.length > 0 && allTopics?.map((topic) => (
            <div key={topic.id} className='text-white font-bold flex w-full mb-3 gap-3'>
              <div key={topic.id} className='size-8 rounded-full'>
                {topic?.image ?
                  <Image height={300} width={300} className=' h-7 w-8 rounded-full bg-cover' alt='topic' src={topic?.image} />
                  :
                  <div className=' bg-gray-500 h-7 w-7 text-white rounded-full flex items-center justify-center text-center'>
                    {topic?.title?.[ 0 ]}
                  </div>
                }
              </div>
              <div className='w-full flex justify-between'>
                <h3 className=''>{topic?.title}</h3>
                <div>

                  <Link className=' bg-indigo-600 px-3 py-2 hover:bg-indigo-500 transition-all hover:scale-105  items-center rounded-md' href={`/cryptohub/cryptochat/${topic?.id}`}>Details</Link>
                </div>
              </div>
            </div>

          ))
          }
        </CardContent>
      </Card>
    </div>
  )
}

export default TrendingTopic
