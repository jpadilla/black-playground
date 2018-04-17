import black
import textwrap

from flask import Flask, render_template, request

app = Flask(__name__)

SOURCE_CODE = textwrap.dedent(
    """
    x = {  'a':37,'b':42,

    'c':927}

    y = 'hello ''world'
    z = 'hello '+'world'
    a = 'hello {}'.format('world')
    class foo  (     object  ):
      def f    (self   ):
        return       37*-2
      def g(self, x,y=42):
          return y
    def f  (   a ) :
      return      37-a[42-x :  y**3]

    """
)


@app.route("/", methods=["POST", "GET"])
def index():
    source = SOURCE_CODE
    line_length = 88

    if request.method == "POST":
        source = request.form["source"]
        line_length = int(request.form["line_length"])

    try:
        formatted = black.format_str(SOURCE_CODE, line_length=line_length)
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
