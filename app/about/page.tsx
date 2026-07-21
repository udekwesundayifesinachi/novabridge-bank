import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Landmark, Target, Users, TrendingUp, Shield, Globe, Award, Heart } from 'lucide-react';

const teamMembers = [
  {
    name: 'Dr. James Mitchell',
    role: 'Chief Executive Officer',
    img: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: '20+ years in financial services',
  },
  {
    name: 'Sarah Anderson',
    role: 'Chief Technology Officer',
    img: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'Former Google & Stripe',
  },
  {
    name: 'Michael Thompson',
    role: 'Chief Risk Officer',
    img: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'Ex-Federal Reserve Risk Examiner',
  },
  {
    name: 'Jennifer Davis',
    role: 'Chief Financial Officer',
    img: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'CFA, 15 years in fintech',
  },
];

const values = [
  { icon: Shield, title: 'Trust & Transparency', desc: 'We operate with complete transparency. No hidden fees, no fine print surprises.', color: '#0A5CFF' },
  { icon: Target, title: 'Customer First', desc: 'Every decision starts with asking: how does this help our customers?', color: '#00C853' },
  { icon: TrendingUp, title: 'Innovation', desc: 'We constantly push boundaries to bring smarter financial tools to you.', color: '#F64C9C' },
  { icon: Heart, title: 'Inclusion', desc: 'Democratizing access to financial services for every American.', color: '#FFB300' },
  { icon: Globe, title: 'Global Standards', desc: 'World-class security and compliance that meets international benchmarks.', color: '#7C3AED' },
  { icon: Award, title: 'Excellence', desc: 'We hold ourselves to the highest standards in everything we do.', color: '#E53935' },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="gradient-hero py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, #F64C9C 0%, transparent 50%)' }} />
          <div className="container-max text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm text-white font-medium mb-6">
              <Landmark className="w-4 h-4" />
              About NovabridgeBank
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Building the future of<br />American banking
            </h1>
            <p className="text-white/70 text-xl max-w-2xl mx-auto leading-relaxed">
              NovabridgeBank was founded in 2020 with a singular mission: to make quality financial services accessible to every American, regardless of geography or income level.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="section-padding bg-white">
          <div className="container-max grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-extrabold text-[#0F172A] mb-6">Our Story</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>Welcome to Novabridgebank, a leading financial institution dedicated to providing exceptional banking services to individuals, businesses, and communities. With a rich history spanning 20 years, we have established ourselves as a trusted and reliable partner for our customers.</p>
<p>We are guided by a set of core values that shape our approach to banking and our interactions with customers, colleagues, and the community..</p>
                <p>Within our first year, we disbursed over $500 thousand in loans to over 10,000 customers who had previously been locked out of the financial system. Today, we serve over 250,000 customers across USA.</p>
              
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=700"
                alt="NovabridgeBank team"
                className="rounded-3xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 card-shadow-lg">
                <p className="text-3xl font-extrabold text-[#0A5CFF]">$10B+</p>
                <p className="text-sm text-slate-500">Loans disbursed since 2020</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding bg-[#F8FAFC]">
          <div className="container-max">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-extrabold text-[#0F172A]">Our Values</h2>
              <p className="text-slate-500 text-lg mt-3">The principles that guide everything we do</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((v) => (
                <div key={v.title} className="feature-card bg-white rounded-2xl p-6 card-shadow">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${v.color}15` }}>
                    <v.icon className="w-6 h-6" style={{ color: v.color }} />
                  </div>
                  <h3 className="font-bold text-[#0F172A] mb-2">{v.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-extrabold text-[#0F172A]">Leadership Team</h2>
              <p className="text-slate-500 text-lg mt-3">Experienced professionals driving our mission forward</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member) => (
                <div key={member.name} className="bg-[#F8FAFC] rounded-2xl overflow-hidden card-shadow banking-card">
                  <img src={member.img} alt={member.name} className="w-full h-52 object-cover" />
                  <div className="p-5">
                    <h3 className="font-bold text-[#0F172A]">{member.name}</h3>
                    <p className="text-sm text-[#0A5CFF] font-medium mt-0.5">{member.role}</p>
                    <p className="text-xs text-slate-500 mt-2">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
