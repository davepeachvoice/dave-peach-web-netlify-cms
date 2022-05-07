// MIT License

// Copyright (c) 2019 strengthmate

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// https://betterprogramming.pub/using-react-ui-components-to-visualize-real-time-spectral-data-of-an-audio-source-17a498a6d8d7
// https://github.com/matt-eric/web-audio-fft-visualization-with-react-hooks

import { attributes as HomeContentAttributes } from '@content/home.md';
import { Box, Button, Heading, Stack } from 'grommet';
import { Microphone, PauseFill } from 'grommet-icons';
import React, { useCallback, useRef } from 'react';
import styled from 'styled-components';
import styles from './styles/AudioVisualizer.module.scss';

const ButtonWithIcon = styled(Button)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const TaglineContainer = styled.div`
  height: 100%;
  background-color: var(--status-ok);
  color: white;
  clip-path: polygon(17% 0, 100% 0, 100% 100%, 0% 100%);
  width: 300px;
  display: flex;
  justify-content: flex-end;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: #db7f00;
  }
`;

const NewHeading = styled(Heading)`
  @media screen and (max-width: 400px) {
    font-size: 12vw;
    line-height: 13vw;
  }
`;

const SmallableSpan = styled.span`
  @media screen and (max-width: 400px) {
    font-size: 5vw;
    line-height: 5vw;
  }
`;

interface Props {
  getFrequencyData: (styleAdjuster: StyleAdjuster) => void;
  initializeAudioAnalyser: () => void;
  pause: () => void;
}

/**
 * @todo type props
 * @todo make bars disappear when user clicks the pause button (currently they freeze where they
 * are because the animation frame is cancelled right away)
 */
export default function AudioVisualizer(props: Props) {
  const { getFrequencyData, initializeAudioAnalyser, pause } = props;

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [animationFrameId, setAnimationFrameId] = React.useState(0);
  const [frequencyBandArray] = React.useState([...Array(25).keys()]);

  const amplitudeValues = useRef(null);

  const runSpectrumA = useCallback(() => {
    function adjustFreqBandStyle(newAmplitudeData) {
      amplitudeValues.current = newAmplitudeData;
      const domElements = frequencyBandArray.map((num) =>
        document.getElementById(`${num}`)
      );
      for (let i = 0; i < frequencyBandArray.length; i++) {
        const num = frequencyBandArray[i];
        domElements[num].style.backgroundColor = `rgb(25, ${
          amplitudeValues.current[num] / 3
        }, ${amplitudeValues.current[num] / 3})`;
        const percentage = (amplitudeValues.current[num] / 255) * 100;
        domElements[num].style.height = `${percentage}%`;
      }
    }

    getFrequencyData(adjustFreqBandStyle);
    setAnimationFrameId(requestAnimationFrame(runSpectrumA));
  }, [getFrequencyData, frequencyBandArray]);

  function toggleAudio() {
    if (isPlaying) {
      pause();
      setIsPlaying(false);
      cancelAnimationFrame(animationFrameId);
    } else {
      initializeAudioAnalyser();
      setIsPlaying(true);
      setAnimationFrameId(requestAnimationFrame(runSpectrumA));
    }
  }

  return (
    <div>
      <Stack guidingChild='last'>
        <div className={styles.flexContainer}>
          {frequencyBandArray.map((num) => (
            <div className={styles.frequencyBands} id={`${num}`} key={num} />
          ))}
        </div>
        <Box background={{ color: 'brand', opacity: 'weak' }} height='100%'>
          <NewHeading level={1} size='large' margin='large' textAlign='center'>
            {HomeContentAttributes.hero_main_text}
          </NewHeading>
        </Box>
      </Stack>
      <Box
        direction='row'
        justify='between'
        align='center'
        height='60px'
        background={{ color: 'white' }}
      >
        <Box style={{ paddingLeft: '20px' }}>
          <SmallableSpan>{HomeContentAttributes.hero_sub_text}</SmallableSpan>
        </Box>
        <TaglineContainer
          style={{ paddingRight: '20px' }}
          onClick={toggleAudio}
        >
          <ButtonWithIcon>
            <div style={{ textAlign: 'right' }}>
              <SmallableSpan>
                {HomeContentAttributes.audio_sample_text}
              </SmallableSpan>
            </div>
            {isPlaying ? (
              <PauseFill color='white'></PauseFill>
            ) : (
              <Microphone color='white'></Microphone>
            )}
          </ButtonWithIcon>
        </TaglineContainer>
      </Box>
    </div>
  );
}

export type StyleAdjuster = (arr: Uint8Array) => void;
