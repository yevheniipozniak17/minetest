import { Divider } from '../_components/Divider/Divider';
import Category from './_sections/Category/Category';
import Currency from './_sections/Currency/Currency';
import Hero from './_sections/Hero/Hero';

const Store = () => {
  return (
    <>
      <Hero />
      <Category />
      <Divider />
      <Currency />
    </>
  );
};

export default Store;
