import 'isomorphic-unfetch';
import debounce from 'awesome-debounce-promise';
import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import ReactGA from 'react-ga';
import classNames from 'classnames';
import Head from '../components/head';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import Icon from '../components/icon';
import Spinner from '../components/spinner';

const Editor = dynamic(import('../components/editor'), { ssr: false });

const STABLE_URL = 'https://1rctyledh3.execute-api.us-east-1.amazonaws.com/dev';
const MAIN_URL = 'https://gpv8wwc892.execute-api.us-east-1.amazonaws.com/dev';

async function getVersion(url) {
  let res = await (await fetch(`${url}/version`)).json();
  return res.version;
}

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isSidebarVisible: false,
      source: props.source,
      formatted: props.formatted,
      options: props.options,
      version: props.version,
      versions: props.versions,
      state: props.state,
      issueLink: props.issueLink
    };
  }

  static async getInitialProps({ query }) {
    let mainVersion;
    let stableVersion;
    let currentVersion = query.version || 'stable';
    let url = currentVersion === 'main' ? MAIN_URL : STABLE_URL;

    let json = await (await fetch(
      `${url}${query.state ? `?state=${query.state}` : ''}`
    )).json();

    if (currentVersion === 'main') {
      mainVersion = json.version;
      stableVersion = await getVersion(STABLE_URL);
    } else {
      stableVersion = json.version;
      mainVersion = await getVersion(MAIN_URL);
    }

    return {
      source: json.source_code,
      formatted: json.formatted_code,
      options: json.options,
      state: json.state,
      issueLink: json.issue_link,
      version: currentVersion,
      versions: {
        stable: stableVersion,
        main: mainVersion
      }
    };
  }

  componentDidMount() {
    this.updateStateParam();
    ReactGA.initialize('UA-37217294-8');
    ReactGA.set({ anonymizeIp: true });
    ReactGA.pageview(window.location.pathname);
  }

  updateStateParam() {
    let href = `/?version=${this.state.version}&state=${this.state.state}`;
    Router.replace(href, href, { shallow: true });
  }

  handleToggleSidebar = () => {
    this.setState((prevState) => ({
      isSidebarVisible: !prevState.isSidebarVisible
    }));
  };

  handleSourceUpdate = async (value) => {
    this.setState(() => ({
      source: value,
      isLoading: true
    }));

    const json = await this.fetchFormat();

    this.setState(() => ({
      isLoading: false,
      source: json.source_code,
      formatted: json.formatted_code,
      options: json.options,
      state: json.state,
      issueLink: json.issue_link
    }));

    this.updateStateParam();
  };

  handleOptionsUpdate = async (value) => {
    this.setState((prevState) => {
      if (value.version) {
        return {
          isLoading: true,
          version: value.version
        };
      }

      return {
        isLoading: true,
        options: Object.assign({}, prevState.options, value)
      };
    });

    const json = await this.fetchFormat();

    this.setState(() => ({
      isLoading: false,
      source: json.source_code,
      formatted: json.formatted_code,
      options: json.options,
      state: json.state,
      issueLink: json.issue_link
    }));

    this.updateStateParam();
  };

  fetchFormat = debounce(
    () =>
      fetch(this.state.version === 'stable' ? STABLE_URL : MAIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          source: this.state.source,
          options: this.state.options
        })
      }).then((res) => res.json()),
    700
  );

  render() {
    let currentVersion = this.state.versions[this.state.version];

    if (this.state.version === 'stable') {
      currentVersion = `v${currentVersion}`;
    } else {
      currentVersion = `@${currentVersion}`;
    }

    return (
      <div>
        <Head title="Black Playground" />
        <div className="flex flex-col h-screen">
          <Header version={currentVersion} />

          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 min-h-0">
              <Sidebar
                version={this.state.version}
                versions={this.state.versions}
                options={this.state.options}
                visible={this.state.isSidebarVisible}
                onChange={this.handleOptionsUpdate}
              />

              <div className="flex flex-1">
                <div className="flex flex-1 relative">
                  <Editor
                    value={this.state.source}
                    onChange={this.handleSourceUpdate}
                  />
                </div>
                <div className="flex flex-1 relative">
                  {this.state.isLoading ? (
                    <div className="flex items-center justify-center w-full ace-tomorrow-night">
                      <Spinner />
                    </div>
                  ) : (
                    <Editor value={this.state.formatted} readOnly={true} />
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between content-center items-center p-4">
              <button
                className={classNames('text-sm inline-flex items-center', {
                  'text-black': this.state.isSidebarVisible,
                  'hover:text-grey-dark': this.state.isSidebarVisible,
                  'text-grey-dark': !this.state.isSidebarVisible,
                  'hover:text-black': !this.state.isSidebarVisible
                })}
                onClick={this.handleToggleSidebar}>
                <Icon icon="cog" />
              </button>
              <div className="flex text-right">
                <div className="flex text-right">
                  <Link href={this.state.issueLink}>
                    <a className="bg-transparent text-xs py-1 text-black font-bold no-underline hover:underline">
                      Report issue
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
