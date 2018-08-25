import os
import json
import base64
import lzma
import black
import urllib

from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_cors import cross_origin

BASE_URL = "https://black.now.sh"
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


def format_code(source, line_length, skip_string_normalization, py36, pyi):
    try:
        mode = black.FileMode.from_configuration(
            py36=py36, pyi=pyi, skip_string_normalization=skip_string_normalization
        )
        formatted = black.format_str(source, line_length=line_length, mode=mode)
    except Exception as exc:
        formatted = exc

    return formatted


@app.route("/", methods=["POST", "GET"])
@cross_origin()
def index():
    if request.method == "POST":
        data = request.get_json()
        source = data.get("source")
        options = data.get("options", {})
        line_length = int(options.get("line_length", 60))
        skip_string_normalization = bool(
            options.get("skip_string_normalization", False)
        )
        py36 = bool(options.get("py36", False))
        pyi = bool(options.get("pyi", False))

    else:
        state = request.args.get("state")

        if state:
            state = decompress_state(state)
            source = state.get("sc")
            line_length = state.get("ll")
            skip_string_normalization = state.get("ssn")
            py36 = state.get("py36")
            pyi = state.get("pyi")
        else:
            source = render_template("source.py")
            line_length = 60
            skip_string_normalization = False
            py36 = False
            pyi = False

    formatted = format_code(source, line_length, skip_string_normalization, py36, pyi)

    state = compress_state(
        {
            "sc": source,
            "ll": line_length,
            "ssn": skip_string_normalization,
            "py36": py36,
            "pyi": pyi,
        }
    )

    options = [f"`--line-length={line_length}`"]

    if skip_string_normalization:
        options.append("`--skip-string-normalization`")

    if py36:
        options.append("`--py36`")

    if pyi:
        options.append("`--pyi`")

    if BLACK_VERSION == "stable":
        version = f"v{black_version}"
    else:
        version = f"https://github.com/ambv/black/commit/{black_version}"

    issue_data = {
        "source_code": source,
        "formatted_code": formatted,
        "options": "\n".join(options),
        "version": version,
        "playground_link": f"{BASE_URL}/?version={BLACK_VERSION}&state={state}",
    }

    issue_body = urllib.parse.quote_plus(render_template("issue.md", **issue_data))
    issue_link = f"https://github.com/ambv/black/issues/new?body={issue_body}"

    return jsonify(
        {
            "source_code": source,
            "formatted_code": formatted,
            "options": {
                "line_length": line_length,
                "skip_string_normalization": skip_string_normalization,
                "py36": py36,
                "pyi": pyi,
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
