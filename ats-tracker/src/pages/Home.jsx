import Navbar from "../components/Navbar/Navbar";
import Box from "../components/Box/Box";

import HowItWorks   from "../components/HomeSections/HowItWorks";
import Features     from "../components/HomeSections/Features";
import ATSReasons   from "../components/HomeSections/ATSReasons";
import Formats      from "../components/HomeSections/Formats";
import FAQ          from "../components/HomeSections/FAQ";
import FinalCTA     from "../components/HomeSections/FinalCTA";
import Footer       from "../components/HomeSections/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Box />

      <HowItWorks />
      <Features />
      <ATSReasons />
      <Formats />
      <FAQ />
      <FinalCTA />
      <Footer />
    </>
  );
}

export default Home;
