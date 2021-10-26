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

import React, { useCallback, useEffect, useRef } from 'react';
import styles from './styles/VisualDemo.module.scss';
import { Stack, Box, Heading, Button } from 'grommet';
import { attributes as HomeContentAttributes } from '@content/home.md';
import styled from 'styled-components';
import { Microphone, PauseFill } from 'grommet-icons';
import { motion } from 'framer-motion';

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

export const Pulsate = (props) => (
  <motion.div
    whileHover={{
      scale: [1, 1.1, 1],
      transition: {
        duration: 1,
        ease: 'easeInOut',
        times: [0, 0.5, 1],
        loop: Infinity,
        repeatDelay: 0,
      },
    }}
  >
    {' '}
    {props.children}
  </motion.div>
);

export default function VisualDemo(props) {
  const {
    audioDataContainerInitialized,
    getFrequencyData,
    initializeAudioAnalyser,
    pause,
    frequencyBandArray,
  } = props;

  const [isPlaying, setIsPlaying] = React.useState(false);

  const amplitudeValues = useRef(null);

  const runSpectrum = useCallback(() => {
    function adjustFreqBandStyle(newAmplitudeData) {
      amplitudeValues.current = newAmplitudeData;
      const domElements = frequencyBandArray.map((num) =>
        document.getElementById(num)
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

    console.log('running spectrum');

    getFrequencyData(adjustFreqBandStyle);

    if (isPlaying) {
      requestAnimationFrame(runSpectrum);
    }
  }, [getFrequencyData, frequencyBandArray, isPlaying]);

  function toggleAudio() {
    if (isPlaying) {
      pause();
      setIsPlaying(false);
    } else {
      initializeAudioAnalyser();
      setIsPlaying(true);
    }
  }

  // check for when audioAnalyser has finished initializing
  useEffect(() => {
    console.log('useEffect');
    if (audioDataContainerInitialized && isPlaying) {
      requestAnimationFrame(runSpectrum);
    }
  }, [runSpectrum, isPlaying, audioDataContainerInitialized]);

  return (
    <div>
      <Stack guidingChild='last'>
        <div className={styles.flexContainer}>
          {frequencyBandArray.map((num) => (
            <div className={styles.frequencyBands} id={num} key={num} />
          ))}
        </div>
        <Box background={{ color: 'brand', opacity: 'weak' }} height='100%'>
          <Heading size='large' margin='large' textAlign='center'>
            {HomeContentAttributes.hero_main_text}
          </Heading>
        </Box>
      </Stack>
      <Box
        direction='row'
        justify='between'
        align='center'
        height='50px'
        background={{ color: 'white' }}
      >
        <Box style={{ paddingLeft: '20px' }}>
          {HomeContentAttributes.hero_sub_text}
        </Box>
        <TaglineContainer
          style={{ paddingRight: '20px' }}
          onClick={toggleAudio}
        >
          <ButtonWithIcon>
            <div>{HomeContentAttributes.audio_sample_text}</div>
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
