import React from 'react';
import Link from 'next/link';
import Icon from './icon';

const Head = (props) => (
  <div className="flex justify-between content-center items-center p-4">
    <div className="flex flex-col">
      <h1 className="text-left my-2">
        Black <span className="text-sm text-grey-dark">{props.version}</span>
      </h1>
      <Link href="http://black.readthedocs.io/en/latest/">
        <a className="font-semibold text-xs text-grey-darkest hover:text-black">
          The uncompromising Python code formatter.
        </a>
      </Link>
    </div>
    <div className="flex justify-between content-center items-center">
      <p className="text-xs text-grey-darkest font-semibold mr-2">
        Playground built by{' '}
        <Link href="https://jpadilla.com">
          <a className="text-grey-darkest hover:text-black">José Padilla</a>
        </Link>
      </p>
      <Link href="https://github.com/jpadilla/black-playground">
        <a className="text-grey-darkest hover:text-black">
          <Icon icon="github" />
        </a>
      </Link>
    </div>
  </div>
);

export default Head;
