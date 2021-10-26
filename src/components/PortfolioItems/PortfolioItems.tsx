import React from 'react';
import { Grid } from 'grommet';
import { PortfolioItemInterface } from './PortfolioItemInterface';
import RecordButton from './RecordButton';

export interface PortfolioItemsProps {
  items: PortfolioItemInterface[];
  setPlayingPortfolioItem: React.Dispatch<
    React.SetStateAction<PortfolioItemInterface>
  >;
}

/**
 * Credit: https://github.com/grommet/grommet-site/blob/master/src/screens/Components/Section.js (modified)
 */
export default function PortfolioItems(props: PortfolioItemsProps) {
  return (
    // TODO: consider providing a fallback if (!Grid.available)
    // See commit ef79eded68bec2b315beb071d9ccc6691b6249ee for an incomplete starting point (formatting is off)
    <Grid
      columns={{ count: 'fill', size: ['small', 'medium'] }}
      rows='small'
      gap={{ row: 'medium' }}
      justifyContent='center'
    >
      {props.items.map((item) => (
        <RecordButton
          key={item.title}
          item={item}
          onClick={() => {
            console.log('clicked portfolio item action button');
            return props.setPlayingPortfolioItem(item);
          }}
        ></RecordButton>
      ))}
    </Grid>
  );
}
