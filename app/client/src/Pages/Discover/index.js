import React from "react";
import { Footer, Navbar, HowItWorks } from "../../Components";
import { ImageBgContainer } from "../../Resources/Styles/global";

const Discover = () => {
  return (
    <div>
      <Navbar />
      <ImageBgContainer>
        <HowItWorks />
      </ImageBgContainer>
      <Footer />
    </div>
  );
};

export default Discover;
