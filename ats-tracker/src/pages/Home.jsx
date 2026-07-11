import Navbar from "../components/Navbar/Navbar";
import Box from "../components/Box/Box";

import HowItWorks   from "../components/HomeSections/HowItWorks";
import Features     from "../components/HomeSections/Features";
import ATSReasons   from "../components/HomeSections/ATSReasons";
import ReportPreview from "../components/HomeSections/ReportPreview";
import BeforeAfter  from "../components/HomeSections/BeforeAfter";
import WhyChoose    from "../components/HomeSections/WhyChoose";
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
      <ReportPreview />
      <BeforeAfter />
      <WhyChoose />
      <Formats />
      <FAQ />
      <FinalCTA />
      <Footer />
    </>
  );
}

export default Home;
