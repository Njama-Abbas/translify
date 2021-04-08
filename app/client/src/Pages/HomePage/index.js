import React, { Fragment } from "react";
import { Footer, InfoSection, Navbar, HowItWorks } from "../../Components";
import { HeroInfo } from "../../Resources/Data/heroInfo";
import { ImageBgContainer } from "../../Resources/Styles/global";
import { Services } from "../index";
export default function Home() {
  return (
    <Fragment>
      <Navbar />
      <InfoSection {...HeroInfo} />
      <Services />
      <ImageBgContainer>
        <HowItWorks />
      </ImageBgContainer>
      <Footer />
    </Fragment>
  );
}
