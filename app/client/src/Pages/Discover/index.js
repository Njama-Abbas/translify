import React from "react";
import {
  Footer,
  Navbar,
  HowItWorks,
  TermsAndConditions,
} from "../../Components";
import { ImageBgContainer } from "../../Resources/Styles/global";

const Discover = ({ withNav }) => {
  return (
    <div>
      <Navbar />
      <ImageBgContainer>
        <HowItWorks />
        <TermsAndConditions />
      </ImageBgContainer>
      <Footer />
    </div>
  );
};

export default Discover;
