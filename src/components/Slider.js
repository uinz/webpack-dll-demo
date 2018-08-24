// copy from https://codesandbox.io/embed/l9zqz0m18z

import React from "react";
import { withGesture } from "react-with-gesture";
import { Spring, animated } from "react-spring";
import styled from "react-emotion";

const Item = styled.div`
  position: relative;
  width: 320px;
  height: 90px;
  pointer-events: auto;
  transform-origin: 50% 50% 0px;
  border-radius: 4px;
  color: rgb(153, 153, 153);
  line-height: 96px;
  padding-left: 32px;
  padding-right: 32px;
  font-size: 20px;
  font-weight: 400;
  box-sizing: border-box;
  display: grid;
  align-items: center;
  text-align: center;
`;

const Bubble = styled(animated.div)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: white;
`;

const Fg = styled(animated.div)`
  background-color: rgb(255, 255, 255);
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 4px;
  top: 0;
  left: 0;
  user-select: none;
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
`;

@withGesture
class Slider extends React.Component {
  render() {
    const { xDelta, down, children } = this.props;

    return (
      <Spring
        native
        to={{ x: down ? xDelta : 0 }}
        immediate={name => down && name === "x"}
      >
        {({ x }) => (
          <Item style={{ backgroundColor: xDelta < 0 ? "#FF1C68" : "#14D790" }}>
            <Bubble
              style={{
                transform: x
                  .interpolate({
                    map: Math.abs,
                    range: [50, 300],
                    output: [0.5, 1],
                    extrapolate: "clamp"
                  })
                  .interpolate(x => `scale(${x})`),
                justifySelf: xDelta < 0 ? "end" : "start"
              }}
            />
            <Fg
              style={{
                transform: x.interpolate(x => `translate3d(${x}px,0,0)`)
              }}
            >
              {down && Math.abs(xDelta) > 50
                ? xDelta < 0
                  ? "Cancel"
                  : "Accept"
                : children}
            </Fg>
          </Item>
        )}
      </Spring>
    );
  }
}

export default Slider;
