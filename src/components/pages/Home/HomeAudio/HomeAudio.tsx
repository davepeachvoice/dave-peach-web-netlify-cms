import { Box } from 'grommet';
import React from 'react';
import AudioDataContainer from './AudioDataContainer';
import { attributes as HomeContentAttributes } from '@content/home.md';
import { Box, Button, Heading, Stack } from 'grommet';
import { Microphone, PauseFill } from 'grommet-icons';
import React from 'react';
import styled from 'styled-components';
import AudioVisualizer from './AudioVisualizer';

const HomeAudio = () => {
  return (
    <>
      <Box>
        <>
          <div>
            <Stack guidingChild='last'>
              {isPlaying && (
                <AudioVisualizer getFrequencyData={getFrequencyData} />
              )}
              <Box
                background={{ color: 'brand', opacity: 'weak' }}
                height='100%'
              >
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
              <SmallableSpan>
                {HomeContentAttributes.hero_sub_text}
              </SmallableSpan>
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
        <AudioDataContainer audioSource='https://res.cloudinary.com/prestocloud/video/upload/v1635110958/dave-peach-web-netlify-cms/commercial-sample_v49stm.mp3' />
      </Box>
    </>
  );
};

export default HomeAudio;
