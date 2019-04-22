import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Icon from './icon';

export default class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {}
    };
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.props.onChange({ [name]: value });
  };

  render() {
    let {
      version,
      versions,
      options: {
        line_length,
        skip_string_normalization,
        py36,
        pyi
      }
    } = this.props;

    let latestUrl = `https://github.com/ambv/black/commit/${versions.master}`;
    let stableUrl = `https://pypi.org/project/black/${versions.stable}/`;

    return (
      <div
        className={classNames('w-1/4', {
          hidden: !this.props.visible
        })}>
        <div className="p-4">
          <div className="flex flex-wrap">
            <div className="w-full px-3 mb-6">
              <label className="block uppercase tracking-wide text-xs font-bold mb-2">
                Version
              </label>
              <div className="inline-block relative w-full mb-3">
                <select
                  name="version"
                  className="block appearance-none w-full bg-white border border-grey-darkest px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                  value={version}
                  onChange={this.handleInputChange}>
                  <option value="stable">Stable</option>
                  <option value="master">Master</option>
                </select>
                <div className="pointer-events-none absolute pin-y pin-r flex items-center px-2">
                  <Icon icon="chevron-down" />
                </div>
              </div>
              <p className="text-grey-dark text-xs italic">
                Stable:{' '}
                <a target="_blank" className="text-grey-dark" href={stableUrl}>
                  {versions.stable}
                </a>{' '}
                | Master:{' '}
                <a target="_blank" className="text-grey-dark" href={latestUrl}>
                  @{versions.master}
                </a>
              </p>
            </div>

            <div className="w-full px-3 mb-6">
              <label className="block uppercase tracking-wide text-xs font-bold mb-2">
                Line Length
              </label>
              <input
                type="text"
                name="line_length"
                className="appearance-none block w-full border border-grey-darkest rounded py-3 px-4 mb-3 leading-tight"
                value={line_length}
                onChange={this.handleInputChange}
              />
              <p className="text-grey-dark text-xs italic">
                The recommended line length in Black is{' '}
                <a
                  href="http://black.readthedocs.io/en/latest/the_black_code_style.html#line-length"
                  target="_blank"
                  className="text-grey-dark">
                  88 characters
                </a>
              </p>
            </div>

            <div className="w-full px-3 mb-6">
              <label className="block uppercase tracking-wide text-xs font-bold mb-2">
                Other options
              </label>

              <label className="block text-grey-dark">
                <input
                  type="checkbox"
                  name="skip_string_normalization"
                  className="mr-2 leading-tight"
                  checked={skip_string_normalization}
                  value={skip_string_normalization}
                  onChange={this.handleInputChange}
                />
                <span className="text-sm">
                  Don't normalize string quotes or prefixes.
                </span>
              </label>

              <label className="block text-grey-dark">
                <input
                  type="checkbox"
                  name="py36"
                  className="mr-2 leading-tight"
                  checked={py36}
                  value={py36}
                  onChange={this.handleInputChange}
                />
                <span className="text-sm">
                  Allow using Python 3.6-only syntax
                </span>
              </label>

              <label className="block text-grey-dark">
                <input
                  type="checkbox"
                  name="pyi"
                  className="mr-2 leading-tight"
                  checked={pyi}
                  value={pyi}
                  onChange={this.handleInputChange}
                />
                <span className="text-sm">Format typing stubs</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Sidebar.propTypes = {
  visible: PropTypes.bool,
  versions: PropTypes.object,
  version: PropTypes.string,
  options: PropTypes.object,
  onChange: PropTypes.func
};

Sidebar.defaultProps = {
  visible: false,
  versions: {},
  version: null,
  options: {},
  onChange: null
};
