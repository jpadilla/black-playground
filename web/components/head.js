import React from 'react';
import NextHead from 'next/head';
import { string } from 'prop-types';

const DEFAULT_DESCRIPTION = 'Playground for Black, the uncompromising Python code formatter.';
const DEFAULT_OG_URL = 'https://black.vercel.sh/';
const DEFAULT_OG_IMAGE = 'https://black.vercel.sh/static/screenshot.png';

const Head = (props) => (
  <NextHead>
    <meta charSet="UTF-8" />
    <title>{props.title || ''}</title>
    <meta
      name="description"
      content={props.description || DEFAULT_DESCRIPTION}
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="static/favicon.ico" />
    <meta property="og:url" content={props.url || DEFAULT_OG_URL} />
    <meta property="og:title" content={props.title || ''} />
    <meta
      property="og:description"
      content={props.description || DEFAULT_DESCRIPTION}
    />
    <meta name="twitter:site" content={props.url || DEFAULT_OG_URL} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content={props.ogImage || DEFAULT_OG_IMAGE} />
    <meta property="og:image" content={props.ogImage || DEFAULT_OG_IMAGE} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
  </NextHead>
);

Head.propTypes = {
  title: string,
  description: string,
  url: string,
  ogImage: string
};

export default Head;
