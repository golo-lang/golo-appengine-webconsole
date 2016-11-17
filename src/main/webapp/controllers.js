/*
 * Copyright (C) 2013 Julien Ponge
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

function ConsoleController($scope, $http) {
  "use strict";

  var defaultCode = function() {
    console.log("Loading default code");
    if (document.location.search === undefined || !document.location.search.startsWith("?code=")) {
      return $("#hello").text();
    }
    return decodeURIComponent(document.location.search.substr(6));
  };

  $scope.readyMode = function() {
    $("#exec-icon").removeClass("icon-spinner icon-spin").addClass("icon-play");
    $("#exec-button").removeClass("disabled btn-inverse");
  };

  $scope.waitingMode = function() {
    $scope.output = "(running...)";
    $("#exec-icon").addClass("icon-spinner icon-spin").removeClass("icon-play");
    $("#exec-button").addClass("disabled btn-inverse");
  };

  $scope.output = "(type some code then run it!)";

  $scope.run = function() {
    var code = editor.doc.getValue();
    $scope.waitingMode();    
    $http.post("/run", code)
    .success(function(data, status, headers, config) {
      $scope.output = data;
      $scope.readyMode();
    }).
    error(function(data, status, headers, config) {
      $scope.output = "Error encountered:\n" + data;
      $scope.readyMode();
    });
  };

  window.editor = CodeMirror(document.getElementById("editor"), {
    mode: "golo",
    theme : "solarized",
    styleActiveLine: true,
    lineNumbers : true,
    value: defaultCode(),
    extraKeys: {
      "Ctrl-E": function() {
        $scope.run();
      },
      "Cmd-E": function() {
        $scope.run();
      }
    }
  });

  editor.setSize("100%","100%")
  editor.doc.setCursor(0,0)

  $scope.load = function(sample) {
    editor.doc.setValue($("#" + sample).text());
    editor.doc.setCursor(0,0)
  };
}
