import Hero from '@/components/sections/Hero'
import StoryStrip from '@/components/sections/StoryStrip'
import CraftProcess from '@/components/sections/CraftProcess'
import FeaturedProducts from '@/components/sections/FeaturedProducts'
import B2BCta from '@/components/sections/B2BCta'
import Testimonials from '@/components/sections/Testimonials'

export default function Home() {
  return (
    <>
      <Hero />
      <StoryStrip />
      <CraftProcess />
      <FeaturedProducts />
      <B2BCta />
      <Testimonials />
    </>
  )
}
