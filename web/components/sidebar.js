import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Icon from './icon';

const TARGET_VERSIONS = {
  py33: 'Python 3.3',
  py34: 'Python 3.4',
  py35: 'Python 3.5',
  py36: 'Python 3.6',
  py37: 'Python 3.7',
  py38: 'Python 3.8',
  py39: 'Python 3.9',
  py310: 'Python 3.10',
};

export default class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {},
    };
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.props.onChange({ [name]: value });
  };

  handleTargetVersionChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    let targetVersions = this.props.options.target_versions || [];
    if (value) {
      targetVersions.push(name);
    } else {
      targetVersions = targetVersions.filter((t) => t !== name);
    }

    this.props.onChange({ target_versions: [...new Set(targetVersions)] });
  };

  render() {
    let { version, versions, options } = this.props;

    let {
      line_length,
      skip_string_normalization,
      skip_magic_trailing_comma,
      target_versions = [],
      pyi,
      fast,
      preview,
    } = options;

    let latestUrl = `https://github.com/psf/black/commit/${versions.main}`;
    let stableUrl = `https://pypi.org/project/black/${versions.stable}/`;

    return (
      <div
        className={classNames('w-1/4', {
          hidden: !this.props.visible,
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
                  <option value="main">Main</option>
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
                | Main:{' '}
                <a target="_blank" className="text-grey-dark" href={latestUrl}>
                  @{versions.main}
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
                Target versions
              </label>

              {Object.keys(TARGET_VERSIONS).map((target) => (
                <label className="block text-grey-dark" key={target}>
                  <input
                    type="checkbox"
                    name={target}
                    className="mr-2 leading-tight"
                    checked={target_versions.includes(target)}
                    value={true}
                    onChange={this.handleTargetVersionChange}
                  />
                  <span className="text-sm">{TARGET_VERSIONS[target]}</span>
                </label>
              ))}
            </div>

            <div className="w-full px-3 mb-6">
              <label className="block uppercase tracking-wide text-xs font-bold mb-2">
                Other options
              </label>

              <label className="block text-grey-dark">
                <input
                  type="checkbox"
                  name="fast"
                  className="mr-2 leading-tight"
                  checked={fast}
                  value={fast}
                  onChange={this.handleInputChange}
                />
                <span className="text-sm">Skip temporary sanity checks.</span>
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
                  name="skip_magic_trailing_comma"
                  className="mr-2 leading-tight"
                  checked={skip_magic_trailing_comma}
                  value={skip_magic_trailing_comma}
                  onChange={this.handleInputChange}
                />
                <span className="text-sm">
                  Don't use trailing commas as a reason to split lines.
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

              <label className="block text-grey-dark">
                <input
                  type="checkbox"
                  name="preview"
                  className="mr-2 leading-tight"
                  checked={preview}
                  value={preview}
                  onChange={this.handleInputChange}
                />
                <span className="text-sm">
                  Enable potentially disruptive style changes that may be added
                  to Black's main functionality in the next major release.
                </span>
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
  onChange: PropTypes.func,
};

Sidebar.defaultProps = {
  visible: false,
  versions: {},
  version: null,
  options: {},
  onChange: null,
};
