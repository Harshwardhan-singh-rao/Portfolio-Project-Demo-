import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import FeatureCard from '../components/FeatureCard'
import { Users, GraduationCap, CalendarDays } from 'lucide-react'
import { Button } from '../components/ui/Button'

export default function Landing() {
  return (
    <main className="max-w-7xl mx-auto px-4 pt-16 pb-24">
      <section className="text-center mt-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight"
        >
          Connect. Collaborate. Conquer Campus.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-white/90 text-lg"
        >
          AI-powered platform to find teammates, mentors & opportunities.
        </motion.p>
        <motion.div className="mt-8 flex justify-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Link to="/login"><Button variant="outline">Login</Button></Link>
          <Link to="/signup"><Button>Sign Up</Button></Link>
        </motion.div>
      </section>

      <section className="mt-16 grid md:grid-cols-3 gap-6">
        <FeatureCard icon={Users} title="Find Teammates" desc="Discover peers with complementary skills for your next project or hackathon." />
        <FeatureCard icon={GraduationCap} title="Get Mentorship" desc="Connect with seniors and alumni for guidance and career advice." />
        <FeatureCard icon={CalendarDays} title="Join Events" desc="Explore workshops, meetups and hackathons happening around you." />
      </section>
    </main>
  )
}
