"use client"

import NewsCompo from '@/components/NewsPart/NewsCompo'
import { Globe } from 'lucide-react'
import React from 'react'

const ArticlesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="relative rounded-lg h-24 overflow-hidden mt-4  w-full">

        {/* Header Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between rounded-lg bg-[#80008015]">
          <h1 className="text-2xl font-medium bg-gradient-to-r from-teal-400 to-cyan-400 text-transparent bg-clip-text">
            Trobits Article
          </h1>

          <div className="w-12 h-12 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-yellow-400 absolute transform translate-x-1 translate-y-1" />
            <Globe className="w-8 h-8 text-blue-500 relative z-10" />
          </div>
        </div>

        {/* Decorative dots */}
        <div className="absolute top-4 right-8 flex gap-2">
          {[ ...Array(3) ].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-blue-400 opacity-60"
            />
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <NewsCompo />
      </main>
    </div>
  )
}

export default ArticlesPage