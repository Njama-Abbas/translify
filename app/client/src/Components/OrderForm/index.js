import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectLoad,
  moveTypeSelected,
  loadSelected,
  selectMoveType,
} from "../../State/navigation.slice";

import {
  Select,
  InputLabel,
  Container,
  CssBaseline,
  Typography,
  Grid,
} from "@material-ui/core";

import {
  Form,
  FormAvatar,
  FormPaper,
  FormControlWrapper,
  FormContainer,
  Label,
  Option,
} from "./elements";

import { FaHelicopter } from "react-icons/fa";
import MapSearchInput from "../MapInput";

const OderForm = () => {
  const dispatch = useDispatch();
  const load = useSelector(selectLoad);
  const moveType = useSelector(selectMoveType);

  const handleMoveTypeChange = (event) => {
    dispatch(moveTypeSelected(event.target.value));
  };
  const handleLoadChange = (event) => {
    dispatch(loadSelected(event.target.value));
  };
  const isHouseMoving = () => moveType === "hm";
  const isOfficeMoving = () => moveType === "om";
  const isFreightMoving = () => moveType === "fr";

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <FormPaper elevation={6}>
        <FormAvatar>
          <FaHelicopter />
        </FormAvatar>
        <Typography component="h1" variant="h4">
          Haul&nbsp;with&nbsp;
          <b
            style={{
              color: "#022144",
              fontFamily: "sans-serif",
            }}
          >
            translify
          </b>
        </Typography>
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlWrapper variant="outlined">
                <InputLabel id="service-select-outlined-label">
                  What are you Moving
                </InputLabel>
                <Select
                  labelId="service-select-outlined-label"
                  id="service-select-outlined"
                  value={moveType}
                  onChange={handleMoveTypeChange}
                  label="What are you Moving"
                >
                  <Option value="fr">Freight</Option>
                  <Option value="hm">House Moving</Option>
                  <Option value="om">Office Moving</Option>
                </Select>
              </FormControlWrapper>
            </Grid>
            {isFreightMoving() && (
              <Grid item xs={12}>
                <FormControlWrapper variant="outlined">
                  <InputLabel id="freight-select-outlined-label">
                    Approx Weight
                  </InputLabel>
                  <Select
                    labelId="freight-select-outlined-label"
                    id="freight-select-outlined"
                    value={load}
                    onChange={handleLoadChange}
                    label="Approx Weight"
                  >
                    <Option value={1}>0-1 Tone(s)</Option>
                    <Option value={2}>1-2 Tone(s)</Option>
                    <Option value={3}>2-3 Tone(s)</Option>
                    <Option value={4}>4-5 Tone(s)</Option>
                    <Option value={5}>More than 5 Tone(s)</Option>
                  </Select>
                </FormControlWrapper>
              </Grid>
            )}
            {isHouseMoving() && (
              <Grid item xs={12}>
                <FormControlWrapper variant="outlined">
                  <InputLabel id="bdrms-select-outlined-label">
                    Number of Bedrooms
                  </InputLabel>
                  <Select
                    labelId="bdrms-select-outlined-label"
                    id="bdrms-select-outlined"
                    value={load}
                    onChange={handleLoadChange}
                    label="Number of Bedrooms"
                  >
                    <Option value={1}>1 Bed Room</Option>
                    <Option value={2}>2 Bed Rooms</Option>
                    <Option value={3}>3 Bed Rooms</Option>
                    <Option value={4}>4 Bed Rooms</Option>
                    <Option value={5}>5 Bed Rooms</Option>
                  </Select>
                </FormControlWrapper>
              </Grid>
            )}
            {isOfficeMoving() && (
              <Grid item xs={12}>
                <FormControlWrapper variant="outlined">
                  <InputLabel id="office-select-outlined-label">
                    Approx SQ Feet
                  </InputLabel>
                  <Select
                    labelId="office-select-outlined-label"
                    id="office-select-outlined"
                    value={load}
                    onChange={handleLoadChange}
                    label="Approx SQ Feet"
                  >
                    <Option value={1}>0 -2500 sq/ft</Option>
                    <Option value={2}>2500-4500 sq/ft</Option>
                    <Option value={3}>4500 -7000 sq/ft</Option>
                    <Option value={4}>7000 -10000 sq/ft</Option>
                    <Option value={5}>Above 10000 sq/ft</Option>
                  </Select>
                </FormControlWrapper>
              </Grid>
            )}
            <Grid item xs={12}>
              <FormContainer>
                <Label>Pick Up Location</Label>
                <MapSearchInput inputType="pickup" />
              </FormContainer>
            </Grid>
            <Grid item xs={12}>
              <FormContainer>
                <Label>Destination Of Your Goods</Label>
                <MapSearchInput inputType="destination" />
              </FormContainer>
            </Grid>
          </Grid>
        </Form>
      </FormPaper>
    </Container>
  );
};

export default OderForm;
