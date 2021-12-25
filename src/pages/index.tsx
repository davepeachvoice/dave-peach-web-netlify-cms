import HomeExperience from '@components/HomeExperience';
import HomeHero from '@components/HomeHero';
import HomePortfolio from '@components/HomePortfolio';
import Layout from '@components/Layout';
import VideoModal from '@components/Media/VideoModal';
import HomeAudio from '@components/pages/Home/HomeAudio/HomeAudio';
import { PortfolioItemInterface } from '@components/PortfolioItems/PortfolioItemInterface';
import { buildImageUrl } from 'cloudinary-build-url';
import type { InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { importPortfolioItems } from 'src/import-portfolio-data';
const AudioWaveform = dynamic(() => import('@components/Media/AudioWaveform'), {
  ssr: false,
});

export default function Index(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const [playingPortfolioItem, setPlayingPortfolioItem] =
    useState<PortfolioItemInterface>(null);

  useEffect(() => {
    console.debug('got new playing portfolio item');
    console.debug(playingPortfolioItem);
  }, [playingPortfolioItem]);

  return (
    <Layout title=''>
      <HomeHero imageBlurDataUrl={props.heroImageBlurData}></HomeHero>
      <HomeAudio></HomeAudio>
      <HomeExperience></HomeExperience>
      <HomePortfolio
        setPlayingPortfolioItem={setPlayingPortfolioItem}
        portfolioItems={props.portfolioItems}
      ></HomePortfolio>
      <AudioWaveform portfolioItem={playingPortfolioItem}></AudioWaveform>
      <VideoModal
        portfolioItem={playingPortfolioItem}
        setPortfolioItem={setPlayingPortfolioItem}
      ></VideoModal>
    </Layout>
  );
}

export async function getStaticProps() {
  const portfolioItemsMarkdownData = await importPortfolioItems();

  const portfolioItems = portfolioItemsMarkdownData.map(
    (portfolioItemMarkdownData) => portfolioItemMarkdownData.attributes
  );

  const url = buildImageUrl('/dave-peach-web-netlify-cms/march_madness.png', {
    cloud: { cloudName: 'prestocloud' },
    transformations: {
      quality: 1,
      format: 'auto',
      resize: {
        width: 10,
        type: 'scale',
        aspectRatio: '1',
      },
    },
  });

  return {
    props: {
      portfolioItems,
      heroImageBlurData: url,
    },
  };
}
