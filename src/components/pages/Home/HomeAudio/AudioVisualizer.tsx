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

import React, { useRef } from 'react';
import styles from './styles/AudioVisualizer.module.scss';

const useAnimationFrame = (callback: (deltaTime: number) => void) => {
  const requestRef = React.useRef<number>();
  const previousTimeRef = React.useRef<number>();

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]); // Make sure the effect runs only once
};

interface Props {
  getFrequencyData: (styleAdjuster: StyleAdjuster) => void;
}

export default function AudioVisualizer(props: Props) {
  const [frequencyBandArray] = React.useState([...Array(25).keys()]);
  const amplitudeValues = useRef(null);

  useAnimationFrame(() => {
    // Pass on a function to the setter of the state
    // to make sure we always have the latest state
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
    props.getFrequencyData(adjustFreqBandStyle);
  });

  return (
    <div className={styles.flexContainer}>
      {frequencyBandArray.map((num) => (
        <div className={styles.frequencyBands} id={`${num}`} key={num} />
      ))}
    </div>
  );
}

export type StyleAdjuster = (arr: Uint8Array) => void;
