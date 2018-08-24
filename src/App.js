import { hot } from "react-hot-loader";
import React from "react";
import styled from "react-emotion";
import Slider from "@/components/Slider";

const Container = styled.div`
  background-color: #eee;
  color: #fff;
  position: absolute;
  width: 100%;
  height: 100%;
  font: 28px/1em "Helvetica";
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

@hot(module)
class App extends React.Component {
  render() {
    return (
      <Container>
        <Slider>Hello Word!</Slider>
      </Container>
    );
  }
}

export default App;
