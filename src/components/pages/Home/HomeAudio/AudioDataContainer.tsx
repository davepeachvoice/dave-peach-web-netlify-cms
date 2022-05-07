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
import React from 'react';
import styled from 'styled-components';
import AudioVisualizer from './AudioVisualizer';

const SmallableSpan = styled.span`
  @media screen and (max-width: 400px) {
    font-size: 5vw;
    line-height: 5vw;
  }
`;

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

export default function AudioDataContainer() {
  const audioFile = React.useRef<HTMLAudioElement>(undefined);
  const audioData = React.useRef<AnalyserNode>(undefined);
  const [isPlaying, setIsPlaying] = React.useState(false);

  function initializeAudioAnalyser() {
    audioFile.current = new Audio();

    const audioContext = new AudioContext();
    const source = audioContext.createMediaElementSource(audioFile.current);
    audioData.current = audioContext.createAnalyser();

    audioFile.current.crossOrigin = 'anonymous';
    audioFile.current.src =
      'https://res.cloudinary.com/prestocloud/video/upload/v1635110958/dave-peach-web-netlify-cms/commercial-sample_v49stm.mp3';
    audioData.current.fftSize = 64;

    source.connect(audioContext.destination);
    source.connect(audioData.current);

    audioFile.current.play();
    setIsPlaying(true);
  }

  function pause() {
    audioFile.current.pause();
    setIsPlaying(false);
  }

  function getFrequencyData(styleAdjuster) {
    const bufferLength = audioData.current.frequencyBinCount;
    const amplitudeArray = new Uint8Array(bufferLength);
    audioData.current.getByteFrequencyData(amplitudeArray);
    styleAdjuster(amplitudeArray);
  }

  function toggleAudio() {
    if (isPlaying) {
      pause();
      setIsPlaying(false);
    } else {
      initializeAudioAnalyser();
      setIsPlaying(true);
    }
  }

  return (
    <>
      <div>
        <Stack guidingChild='last'>
          {isPlaying && <AudioVisualizer getFrequencyData={getFrequencyData} />}
          <Box background={{ color: 'brand', opacity: 'weak' }} height='100%'>
            <NewHeading
              level={1}
              size='large'
              margin='large'
              textAlign='center'
            >
              {HomeContentAttributes.hero_main_text}
            </NewHeading>
          </Box>
        </Stack>
      </div>
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
    </>
  );
}
