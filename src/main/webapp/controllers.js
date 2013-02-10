function ConsoleController($scope, $http) {  
  
  $scope.output = "";
  $scope.txt = "fisted";
  
  $scope.run = function() {
    var code = ace.edit('editor').getValue();
    $http.post("/run", code)
    .success(function(data, status, headers, config) {
      $scope.output = data;
    }).
    error(function(data, status, headers, config) {
      $scope.output = "Error encountered:\n" + data;
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
