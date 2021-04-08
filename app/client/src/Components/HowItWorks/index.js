import React from "react";
import StepCard from "./StepCard";
import { CardWrapper, Container, CardHeder } from "./elements";
const data = [
  {
    number: "01",
    desc: "Sign up for a Translify account",
  },
  {
    number: "02",
    desc: "Navigate to the order page",
  },
  {
    number: "03",
    desc: "Fill in your shipping details",
  },
  {
    number: "04",
    desc: "Chooose Your favorite driver",
  },
  {
    number: "05",
    desc: "Confirm details and make payment",
  },
  {
    number: "06",
    desc: "Sit, Relax lets take care of the rest",
  },
];
const HowItWorks = () => {
  return (
    <Container>
      <CardHeder>How it Works</CardHeder>
      <CardWrapper>
        {data.map((step) => (
          <StepCard number={step.number} desc={step.desc} key={step.number} />
        ))}
      </CardWrapper>
    </Container>
  );
};

export default HowItWorks;
