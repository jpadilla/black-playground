import os
import json
import base64
import lzma
import black
import urllib
import tempfile

from flask import Flask, render_template, request, jsonify
from flask_cors import cross_origin

TEMP_DIR = tempfile.gettempdir()

BASE_URL = "https://black.vercel.app"
BLACK_VERSION = os.getenv("BLACK_VERSION")


def get_black_version():
    lockfile = json.load(open("./Pipfile.lock"))
    package = lockfile["default"]["black"]
    version = package.get("version")
    ref = package.get("ref")

    if version:
        return version.lstrip("==")

    if ref:
        return ref[0:6]


app = Flask(__name__)
black_version = get_black_version()


def compress_state(data):
    compressed = lzma.compress(json.dumps(data).encode("utf-8"))
    return base64.urlsafe_b64encode(compressed).decode("utf-8")


def decompress_state(state):
    compressed = base64.urlsafe_b64decode(state)
    return json.loads(lzma.decompress(compressed))


def normalize_exception(exc):
    exception_str = f"{exc}"

    # Try to load contents dumped to tmp file.
    if "helpful: " in exception_str:
        try:
            _, file_path = exception_str.split("helpful: ")

            if file_path.startswith(TEMP_DIR):
                with open(file_path) as f:
                    contents = f.read()
                    exception_str = f"{exception_str}\n\n{contents}"
        except Exception:
            pass

    return exception_str


def format_code(source, fast, configuration):
    try:
        mode = black.FileMode(**configuration)
        formatted = black.format_file_contents(source, fast=fast, mode=mode)
    except black.NothingChanged:
        formatted = source
    except Exception as exc:
        formatted = normalize_exception(exc)

    return formatted


@app.route("/", methods=["POST", "GET"])
@cross_origin()
def index():
    if request.method == "POST":
        data = request.get_json()
        source = data.get("source")
        options = data.get("options", {})
        line_length = int(options.get("line_length", 88))
        skip_string_normalization = bool(
            options.get("skip_string_normalization", False)
        )
        py36 = bool(options.get("py36", False))
        pyi = bool(options.get("pyi", False))
        fast = bool(options.get("fast", False))

    else:
        state = request.args.get("state")

        if state:
            state = decompress_state(state)
            source = state.get("sc")
            line_length = state.get("ll")
            skip_string_normalization = state.get("ssn")
            py36 = state.get("py36")
            pyi = state.get("pyi")
            fast = state.get("fast")
        else:
            source = render_template("source.py")
            line_length = 88
            skip_string_normalization = False
            py36 = False
            pyi = False
            fast = False

    formatted = format_code(
        source,
        fast=fast,
        configuration={
            "target_versions": black.PY36_VERSIONS if py36 else set(),
            "line_length": line_length,
            "is_pyi": pyi,
            "string_normalization": not skip_string_normalization,
        },
    )

    state = compress_state(
        {
            "sc": source,
            "ll": line_length,
            "ssn": skip_string_normalization,
            "py36": py36,
            "pyi": pyi,
            "fast": fast,
        }
    )

    options = [f"`--line-length={line_length}`"]

    if skip_string_normalization:
        options.append("`--skip-string-normalization`")

    if py36:
        options.append("`--py36`")

    if pyi:
        options.append("`--pyi`")

    if fast:
        options.append("`--fast`")
    else:
        options.append("`--safe`")

    if BLACK_VERSION == "stable":
        version = f"v{black_version}"
    else:
        version = f"https://github.com/psf/black/commit/{black_version}"

    issue_data = {
        "source_code": source,
        "formatted_code": formatted,
        "options": "\n".join(options),
        "version": version,
        "playground_link": f"{BASE_URL}/?version={BLACK_VERSION}&state={state}",
    }

    issue_body = urllib.parse.quote_plus(render_template("issue.md", **issue_data))
    issue_link = f"https://github.com/psf/black/issues/new?body={issue_body}"

    return jsonify(
        {
            "source_code": source,
            "formatted_code": formatted,
            "options": {
                "line_length": line_length,
                "skip_string_normalization": skip_string_normalization,
                "py36": py36,
                "pyi": pyi,
                "fast": fast,
            },
            "state": state,
            "issue_link": issue_link,
            "version": black_version,
        }
    )


@app.route("/version", methods=["GET"])
@cross_origin()
def version():
    return jsonify({"version": black_version})


if __name__ == "__main__":
    app.run(debug=True)
