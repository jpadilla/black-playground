import black
import textwrap

from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/", methods=["POST", "GET"])
def index():
    if request.method == "POST":
        source = request.form["source"]
        line_length = int(request.form["line_length"])
    else:
        source = render_template("source.py")
        line_length = 60

    try:
        formatted = black.format_str(source, line_length=line_length)
        error = None
    except Exception as exc:
        formatted = ""
        error = exc

    data = {
        "source": source,
        "formatted": formatted,
        "line_length": line_length,
        "error": error,
        "black_version": black.__version__,
    }

    return render_template("index.html", **data)


if __name__ == "__main__":
    app.run(debug=True)
