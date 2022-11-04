import { Orbitron } from '@next/font/google';
import classNames from 'classnames';
import Link from 'next/link';

const orbitron = Orbitron({ subsets: ['latin'] });

const NavigationBar = () => {
  return (
    <div
      className='bg-black p-4 h-12 flex justify-between'
      style={{ padding: '12px 24px' }}
    >
      <Link
        href='/'
        className={classNames(
          'text-base md:text-2xl text-orange-500',
          orbitron.className
        )}
      >
        Dave Peach:
        <br />
        Professional Voice
      </Link>
      <div>
        <div className='justify-end'>
          <div
          // a11yTitle='Navigation Menu'
          // dropProps={{ align: { top: 'bottom', right: 'right' } }}
          // icon={<MenuIcon />}
          // dropBackground='#252529'
          // items={[
          //   // TODO: make this use an anchor for each that has an href for SEO purposes
          //   // https://nextjs.org/docs/api-reference/next/link#if-the-child-is-a-custom-component-that-wraps-an-a-tag
          //   // (note that it might not matter that much because we have real links outside of the mobile experience that are the same)
          //   {
          //     label: <Box pad='small'>Portfolio</Box>,
          //     onClick: () => {
          //       Router.push('/portfolio');
          //     },
          //   },
          //   {
          //     label: <Box pad='small'>Services</Box>,
          //     onClick: () => {
          //       Router.push('/services');
          //     },
          //   },
          // ]}
          ></div>
        </div>
        <div className='flex justify-end flex-row gap-4'>
          <Link className='text-orange-500' href='/portfolio'>
            Portfolio
          </Link>
          <Link className='text-orange-500' href='/services'>
            Services
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
