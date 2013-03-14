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
    var code = ace.edit('editor').getValue();
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
  
  var editor = ace.edit("editor");
  // editor.setTheme("ace/theme/solarized_light");
  // editor.getSession().setMode("ace/mode/javascript");
  document.getElementById('editor').style.fontSize='14px';
  editor.setHighlightActiveLine(true);
  editor.setPrintMarginColumn(100);
  editor.getSession().setUseSoftTabs(true);
  editor.getSession().setTabSize(2);
    
  editor.setValue($("#hello").text());
  editor.gotoLine(1);
    
  editor.commands.addCommand({
    name: 'run',
    bindKey: {
      win: 'Ctrl-E',  
      mac: 'Command-E'
    },
    exec: function(editor) {
      $scope.run();
    }
  });
  
  $scope.load = function(sample) {
    editor.setValue($("#" + sample).text());
    editor.gotoLine(1);
    editor.scrollToLine(1);
  };
}
