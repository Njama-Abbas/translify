import React from "react";
import {
  LoaderContainer,
  LoadingPage,
  LoadingText,
  SpinnerItem,
} from "./elements";

const BouncingBalls = ({ message }) => {
  return (
    <LoadingPage>
      <LoaderContainer>
        <SpinnerItem></SpinnerItem>
        <SpinnerItem index="two"></SpinnerItem>
        <SpinnerItem index="three"></SpinnerItem>
        <SpinnerItem index="four"></SpinnerItem>
        <SpinnerItem index="five"></SpinnerItem>
      </LoaderContainer>
      <LoadingText>
        {message || " Loading...."}
        <br />
        Please Wait
      </LoadingText>
    </LoadingPage>
  );
};

export default BouncingBalls;
