'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import classNames from 'classnames';
import { useDebounceValue, useLocalStorage } from 'usehooks-ts';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import Icon from '../components/icon';
import Spinner from '../components/spinner';
import { formatByVersion } from '../lib/api';

const Editor = dynamic(() => import('../components/editor', { ssr: false }));

export default function HomePage({ props }) {
  const router = useRouter();

  const [version, setVersion] = useState(props.version);
  const [source, setSource] = useState(props.source);
  const [isLoading, setIsLoading] = useState(props.isLoading);
  const [formatted, setFormatted] = useState(props.formatted);
  const [options, setOptions] = useState(props.options);
  const [state, setState] = useState(props.state);
  const [issueLink, setIssueLink] = useState(props.issueLink);
  const debouncedSource = useDebounceValue(source, 100);
  const debouncedOptions = useDebounceValue(options, 100);
  const debouncedVersion = useDebounceValue(version, 100);
  const [isSidebarVisible, setIsSidebarVisible] = useLocalStorage(
    'sidebar:visible',
    false
  );

  useEffect(() => {
    const href = `/?version=${version}&state=${state}`;
    router.replace(href, { scroll: false });
  }, [router, version, state]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const json = await formatByVersion(debouncedVersion, {
        source: debouncedSource,
        options: debouncedOptions,
      });
      setIsLoading(false);
      setFormatted(json.formatted_code);
      setState(json.state);
      setIssueLink(json.issue_link);
    })();
  }, [debouncedSource, debouncedVersion, debouncedOptions]);

  const handleOptionsUpdate = async (value) => {
    if (value.version) {
      setVersion(value.version);
    } else {
      setOptions((prev) => Object.assign({}, prev, value));
    }
  };

  const handleSourceUpdate = (value) => {
    setSource(value);
  };

  const handleToggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header version={props.currentVersion} />

      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 min-h-0">
          <Sidebar
            version={version}
            versions={props.versions}
            options={options}
            visible={isSidebarVisible}
            onChange={handleOptionsUpdate}
          />

          <div className="flex flex-1">
            <div className="flex flex-1 relative">
              <Editor
                value={source}
                marginColumn={options.line_length}
                onChange={handleSourceUpdate}
              />
            </div>
            <div className="flex flex-1 relative">
              {isLoading ? (
                <div className="flex items-center justify-center w-full ace-tomorrow-night">
                  <Spinner />
                </div>
              ) : (
                <Editor
                  value={formatted}
                  marginColumn={options.line_length}
                  readOnly={true}
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between content-center items-center p-4">
          <button
            className={classNames('text-sm inline-flex items-center', {
              'text-black': isSidebarVisible,
              'hover:text-slate-500': isSidebarVisible,
              'text-slate-500': !isSidebarVisible,
              'hover:text-black': !isSidebarVisible,
            })}
            onClick={handleToggleSidebar}
          >
            <Icon icon="cog" />
          </button>
          <div className="flex text-right">
            <div className="flex text-right">
              <Link
                href={issueLink}
                className="bg-transparent text-xs py-1 text-black font-bold no-underline hover:underline"
              >
                Report issue
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
