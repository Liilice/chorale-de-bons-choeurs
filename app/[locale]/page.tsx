import { Header } from "@/components/Header";
import { About } from "@/components/About";
import { Concerts } from "@/components/Concerts";
import { Venue } from "@/components/Venue";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div id="about" className="min-h-screen pt-16 bg-[#FBF5F0]">
      <Header />
      <About />
      <Concerts />
      <Venue />
      <Footer />
    </div>
  );
}
