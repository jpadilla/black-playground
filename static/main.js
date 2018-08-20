$(document).ready(function() {
  var editor = ace.edit("editor"),
    result = ace.edit("result"),
    $textarea = $('textarea[name="source"]'),
    $options = $("#options"),
    $optionsButton = $("#options-button"),
    $submitButton = $("#submit-button"),
    $reportButton = $("#report-button"),
    $form = $("form"),
    $sourceInput = $form.find("[name=source]");

  editor.setTheme("ace/theme/tomorrow_night");
  editor.getSession().setMode("ace/mode/python");

  result.setTheme("ace/theme/tomorrow_night");
  result.getSession().setMode("ace/mode/python");
  result.setReadOnly(true);

  editor.getSession().setValue($textarea.val());
  editor.getSession().on("change", function() {
    $textarea.val(editor.getSession().getValue());
  });

  $optionsButton.click(function(e) {
    e.preventDefault();
    if ($options.hasClass("hidden")) {
      $options.removeClass("hidden");
      $optionsButton.addClass("bg-black text-white");
    } else {
      $options.addClass("hidden");
      $optionsButton.removeClass("bg-black text-white");
    }
  });

  $submitButton.click(function(e) {
    e.preventDefault();
    $form.attr("action", "").submit();
  });

  $reportButton.click(function(e) {
    e.preventDefault();
    $form.attr("action", "/report-issue").submit();
  });
});
