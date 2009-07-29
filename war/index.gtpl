<html>
    <head>
        <title>Groovy web console</title>
        
        <script src="js/codemirror.js" type="text/javascript"></script>
        <script src="js/mirrorframe.js" type="text/javascript"></script>
        <script src="js/jquery-1.3.2.min.js" type="text/javascript"></script>
        <script src="js/jquery-ui-1.7.2.custom.min.js" type="text/javascript"></script>
        
        <link rel="stylesheet" type="text/css" href="css/redmond/jquery-ui-1.7.1.custom.css"/>
        <link rel="stylesheet" type="text/css" href="css/main.css"/>
    </head>
    <body>
        <script src="js/main.js" type="text/javascript"></script>      

        <div id="loadingDiv">
            <img src="images/ajax-spinner-blue.gif">
        </div>        

        <h1>Groovy web console</h1>

        <form id="publishform" action="publish.groovy" method="POST">
            <div id="textarea-container" class="border">
                <textarea id="script" name="script" cols="140" rows="40"><% include "/loadscript.groovy" %></textarea>
            </div>
        
            <div id="button-bar">
                <input id="executeButton" type="button" value="Execute">
                <input id="publishButton" type="submit" value="Publish">
                <input id="title" name="title" type="hidden" value="">
                <input id="author" name="author" type="hidden" value="">
                <input id="tags" name="tags" type="hidden" value="">
            </div>
        </form>

        <div id="dialog" title="Publish your Groovy snippet">
            <label for="dialogTitle">Title</label>
            <br/>
            <input type="text" name="dialogTitle" id="dialogTitle" class="text ui-widget-content ui-corner-all"/>
            <br/>
            <br/>
            <label for="dialogAuthor">Author</label>
            <br/>
            <input type="text" name="dialogAuthor" id="dialogAuthor" value="" class="text ui-widget-content ui-corner-all"/>
            <br/>
            <br/>
            <label for="dialogTags">Tags <span class="smaller">(comma separated)</span></label>
            <br/>
            <input type="text" name="dialogTags" id="dialogTags" value="" class="text ui-widget-content ui-corner-all"/>
        </div>
        
        <div id="tabs">
            <ul>
            	<li><a href="#tabs-result">Result</a></li>
            	<li><a href="#tabs-output">Output</a></li>
            	<li><a href="#tabs-stacktrace">Stacktrace</a></li>
            </ul>
            
            <div id="tabs-result">
                <pre id="result" class="border hidden"></pre>
            </div>
        
            <div id="tabs-output">
                <pre id="output" class="border hidden"></pre>
            </div>
        
            <div id="tabs-stacktrace">
                <pre id="stacktrace" class="border hidden"></pre>
            </div>
        </div>

        <% include '/WEB-INF/includes/about.gtpl' %>

        <script language="javascript">
        	var editor = CodeMirror.fromTextArea('script', {
                height: "300px",
                parserfile: ["tokenizejavascript.js", "parsejavascript.js"],
                stylesheet: "css/jscolors.css",
                path: "js/",
                continuousScanning: 500,
                lineNumbers: true,
                textWrapping: false,
                tabMode: "spaces",
                submitFunction: function() {
                    \$("#executeButton").click();
                }
            });
        </script>
                
    </body>
</html>