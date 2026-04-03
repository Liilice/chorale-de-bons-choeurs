import { Header } from "@/components/Header";
import { About } from "@/components/About";
import { Concerts } from "@/components/Concerts";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div id="about" className="min-h-screen pt-16 bg-[#FBF5F0]">
      <Header />
      <About />
      <Concerts />
      <Footer />
    </div>
  );
}
