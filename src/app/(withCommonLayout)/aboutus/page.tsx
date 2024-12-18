import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Footer from "@/app/shared/Footer/Footer"
// import { Grid } from "@/components/ui/grid"

export default function AboutUs() {
  return (
    <div className="bg-[#00000077]  text-white min-h-screen pt-16">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-center text-white">About Us</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <h2 className="text-xl text-blue-400">
              Trobits: Your Fun Zone for Crypto News and Community
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Welcome to Trobits! We&lsquo;re a passionate group dedicated to making
              cryptocurrency and blockchain technology accessible and engaging for everyone.
              Whether you&lsquo;re a seasoned crypto enthusiast or just starting out, Trobits
              is your go-to hub for news, information, and entertainment.
            </p>
          </CardContent>
        </Card>

        {/* Offerings */}
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center text-white">What We Offer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  title: "Up-to-Date Crypto News",
                  description: "Stay informed with the latest in cryptocurrency, from breaking news to in-depth analyses of currencies, projects, and trends."
                },
                {
                  title: "Engaging Articles",
                  description: "Dive into a range of articles that break down complex crypto topics in a clear, reader-friendly manner."
                },
                {
                  title: "Playful Games",
                  description: "Test your crypto knowledge with our interactive games—a fun way to learn and stay sharp."
                },
                {
                  title: "Vibrant Social Community",
                  description: "Connect with fellow crypto enthusiasts, discuss the latest, share ideas, or just enjoy some friendly banter."
                }
              ].map((item, index) => (
                <Card key={index} className="bg-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-blue-400">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Our Mission */}
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center text-white">Making a Difference</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              At Trobits, we believe in crypto&lsquo;s potential. That&lsquo;s why we use ad revenue to burn
              LUNC and SHIB tokens, promoting a more sustainable crypto ecosystem. Track the
              impact directly on our homepage with live data on visitor counts, ad revenue, and
              the amount of LUNC and SHIB burned!
            </p>
            {/* <p className="text-gray-300">
              <strong>Donations Welcome:</strong> Your contributions to support our burning
              efforts are greatly appreciated. You can find a &rdquo;Donate&rdquo; button on our homepage.
            </p> */}
          </CardContent>
        </Card>

        {/* Why Choose Us */}
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center text-white">Why Choose Trobits?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-gray-300 max-w-2xl mx-auto">
              <li>We make crypto fun and approachable.</li>
              <li>Our community is welcoming to enthusiasts of all experience levels.</li>
              <li>We&lsquo;re committed to transparency in our burning efforts.</li>
              <li>We continually add new features to keep things exciting.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Call to Join */}
        <Card className="bg-gray-800">
          <CardContent className="text-center">
            <p className="text-xl text-blue-400">
              Join the Trobits community today and explore the world of crypto like never before!
            </p>
          </CardContent>
        </Card>

        {/* Meet the Team */}
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center text-white">Meet the Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  name: "Tabi",
                  bio: "Tabi transitioned from crypto skepticism to enthusiasm in 2021. He initially ventured into bot trading and quickly delved into blockchain technology. Although he faced setbacks during the 2022 crash, his passion for LUNC and the potential of crypto remains steadfast."
                },
                {
                  name: "Rolin",
                  bio: "A long-time crypto advocate, Rolin has been instrumental in developing strategies for Trobits. He shares Tabi's dedication to LUNC and continues to work on creative ways to boost the crypto community's resilience."
                },
                {
                  name: "Calvin",
                  bio: "With a background in Information Technology, Calvin brings over 20 years of experience to Trobits. An investor in Shiba Inu and Cardano, he is passionate about crypto's future and dedicated to providing a secure, engaging platform."
                },
                {
                  name: "Arrey",
                  bio: "The growth of the cryptocurrency market is evident. It is never too late to take action. Arrey believes in the use of digital media to change the narrative around cryptocurrency and power the value of coins that have stood the test of time. Arrey is strongly behind building strong online communities of crypto enthusiasts who will work together to achieve a common goal."
                },
                {
                  name: "Bernard",
                  bio: "With the relentless growth and acceptance of cryptocurrency, Bernard believes there is a need for crypto social communities. He is passionate about bridging technology and social connectivity, contributing to the development of an inclusive space where technology and community intersect. Bernard aims to harness the transformative power of crypto to build resilient, forward-thinking communities and foster a more connected, equitable digital future."
                },
              ].map((member, index) => (
                <Card key={index} className="bg-gray-700">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-blue-400">{member.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}