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

import React from 'react';
import AudioVisualizer from './AudioVisualizer';

export default function AudioDataContainer() {
  const audioFile = React.useRef<HTMLAudioElement>(undefined);
  const audioData = React.useRef<AnalyserNode>(undefined);

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
  }

  function pause() {
    audioFile.current.pause();
  }

  function getFrequencyData(styleAdjuster) {
    const bufferLength = audioData.current.frequencyBinCount;
    const amplitudeArray = new Uint8Array(bufferLength);
    audioData.current.getByteFrequencyData(amplitudeArray);
    styleAdjuster(amplitudeArray);
  }

  return (
    <AudioVisualizer
      initializeAudioAnalyser={initializeAudioAnalyser}
      getFrequencyData={getFrequencyData}
      pause={pause}
    />
  );
}
