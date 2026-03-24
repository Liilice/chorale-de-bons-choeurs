import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Concerts } from '@/components/Concerts';
import { Venue } from '@/components/Venue';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div id='about' className="min-h-screen pt-16">
      <Header />
      <About />
      <Concerts />
      <Footer />
    </div>
  );
}
