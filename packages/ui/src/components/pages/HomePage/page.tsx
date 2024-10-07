import React from "react";

import { Header, Hero } from "./landing";
import { Intro } from "./landing/Intro";
import { About } from "./landing/About";

interface PageProps {}

const Page: React.FC<PageProps> = () => {
  return (
    <>
      <Header />
      <Hero />
      <Intro />
      <About />
    </>
  );
};

export default Page;
