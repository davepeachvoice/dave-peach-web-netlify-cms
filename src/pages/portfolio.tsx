import VideoModal from '@components/Media/VideoModal';
import Portfolio from '@components/Portfolio';
import { PortfolioItemInterface } from '@components/PortfolioItems/PortfolioItemInterface';
import type { InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import Layout from '../components/Layout';
import {
  importPortfolioCategories,
  importPortfolioItems,
  PortfolioCategory,
} from '../import-portfolio-data';
import { comparePriorities } from '../lib/compare-priorities';
import * as UnlockMediaElement from '../lib/unlock-media-element';
const AudioWaveform = dynamic(() => import('@components/Media/AudioWaveform'), {
  ssr: false,
});

export default function PortfolioPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const [playingPortfolioItem, setPlayingPortfolioItem] =
    useState<PortfolioItemInterface>(null);
  const [mediaElement, setMediaElement] = useState<HTMLAudioElement>(null);

  function handleFirstUserInteraction() {
    // did we already handle the first user interaction?
    if (mediaElement) {
      return;
    }

    setMediaElement(UnlockMediaElement.constructUnlockedMediaElement());
  }

  return (
    <div
      onTouchStart={handleFirstUserInteraction}
      onClick={handleFirstUserInteraction}
    >
      <Layout title='Portfolio'>
        <Portfolio
          portfolioData={props.portfolioData}
          setPlayingPortfolioItem={setPlayingPortfolioItem}
        ></Portfolio>
        <AudioWaveform
          portfolioItem={playingPortfolioItem}
          mediaElement={mediaElement}
        ></AudioWaveform>
        <VideoModal
          portfolioItem={playingPortfolioItem}
          setPortfolioItem={setPlayingPortfolioItem}
        ></VideoModal>
      </Layout>
    </div>
  );
}

export async function getStaticProps() {
  const portfolioItemsMarkdownData = await importPortfolioItems();

  const portfolioItems = portfolioItemsMarkdownData.map(
    (portfolioItemMarkdownData) => portfolioItemMarkdownData.attributes
  );

  const portfolioItemsCategoriesMarkdownData =
    await importPortfolioCategories();

  const portfolioCategories = portfolioItemsCategoriesMarkdownData.map(
    (portfolioItemMarkdownData) => portfolioItemMarkdownData.attributes
  );

  // group portfolio items into their categories and sort them by priority
  const portfolioData = buildPortfolioCategories(
    portfolioItems,
    portfolioCategories
  );

  return {
    props: {
      portfolioData,
    },
  };
}

function buildPortfolioCategories(
  portfolioItems: PortfolioItemInterface[],
  portfolioCategories: PortfolioCategory[]
) {
  // also accept categories and build categories const from those categories
  const categories: Record<
    string,
    Pick<PortfolioCategory, 'priority' | 'items'>
  > = {};

  // build categories
  for (const portfolioCategory of portfolioCategories) {
    categories[portfolioCategory.title] = {
      priority: portfolioCategory.priority,
      items: [],
    };
  }

  // populate categories with matching items
  for (const portfolioItem of portfolioItems) {
    categories[portfolioItem.category].items.push(portfolioItem);
  }

  // sort portfolio items within each category
  for (const category in categories) {
    categories[category].items.sort(comparePriorities);
  }

  // sort categories by category priority
  const categoriesArray = Object.entries(categories);
  const sortedCategoriesArray = categoriesArray.sort((firstEl, secondEl) => {
    const firstElCategoryData = firstEl[1];
    const secondElCategoryData = secondEl[1];
    if (firstElCategoryData.priority < secondElCategoryData.priority) {
      return -1;
    } else if (firstElCategoryData.priority > secondElCategoryData.priority) {
      return 1;
    }
    return 0;
  });

  // must return array rather than object keyed by category names because the order of the elements matters
  return sortedCategoriesArray;
}
