import React from "react";
import { CardContent, CardNumber, StepCardContainer } from "./elements";
const StepCard = ({ number, desc }) => {
  return (
    <StepCardContainer>
      <CardNumber>{number}</CardNumber>
      <CardContent>{desc}</CardContent>
    </StepCardContainer>
  );
};

export default StepCard;
