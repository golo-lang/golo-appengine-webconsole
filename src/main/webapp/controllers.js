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
  
  $scope.output = "";
  
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
  document.getElementById('editor').style.fontSize='16px';
  editor.setHighlightActiveLine(true);
  editor.getSession().setUseSoftTabs(true);
  editor.getSession().setTabSize(2);
    
  editor.setValue([
    "module test",
    "",
    "function run = |context| {",
    "  context: log(\"Golo World\")",
    "}",
    ""
    ].join('\n'));
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
}
