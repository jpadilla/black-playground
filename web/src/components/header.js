import React from 'react';
import Link from 'next/link';
import Icon from './icon';

const Head = (props) => (
  <div className="flex justify-between content-center items-center px-4">
    <div className="flex flex-col">
      <Link href="https://black.readthedocs.io/en/latest/" style={{ textDecoration: 'inherit', color: 'inherit' }} className="hover:text-black">
        <h1 className="text-4xl font-black text-left my-2">
          Black{' '}
          <span className="text-sm font-bold text-slate-500">
            {props.version} - The uncompromising Python code formatter.
          </span>
        </h1>
      </Link>
    </div>
    <div className="flex justify-between content-center items-baseline mt-2">
      <p className="text-xs text-slate-900 font-semibold mr-2">
        Playground built by{' '}
        <Link href="https://jpadilla.com" className="text-slate-900 underline hover:text-black">
          José Padilla
        </Link>
      </p>
      <Link href="https://github.com/jpadilla/black-playground" className="text-slate-900 hover:text-black">
        <Icon icon="github" />
      </Link>
    </div>
  </div>
);

export default Head;
