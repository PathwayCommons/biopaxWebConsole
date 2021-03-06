$(document).ready(function() {
    // SAMPLE FILES
    var sampleFiles = [
        "akt_signaling_pathway",
        "biopax3-short-metabolic-pathway",
        "fanconi_anemia_reactome",
        "intrinsic_apoptosis_reactome",
        "raf_map_kinase_cascade_reactome"
    ];

    var gistIds = {
        "b6f7ba64e1156b001282":"hello.groovy",
        "b6f7ba64e1156b001282":"bwcBasicTraversal.groovy",
        "b6f7ba64e1156b001282":"bwcListFiles.groovy",
        "b6f7ba64e1156b001282":"jenkins_build_install.R",
        "b6f7ba64e1156b001282":"deployAppWithData.R",
        "b6f7ba64e1156b001282":"jenkins_build.R",
        "b6f7ba64e1156b001282":"checkTestCoverage.R"
    };

    var gistId = "b6f7ba64e1156b001282";
    var gistFiles = [
        "listFiles_0.groovy",
        "firstModel_1.groovy",
        "simpleIO_2.groovy",
        "basicTraversal_3.groovy",
        "pathAccessors_4.groovy",
        "listProperties_5.groovy",
        "excisor_6.groovy",
        "merging_7.groovy",
        "exportSif_8.groovy",
        "graphQuery_9.groovy",
        "combinedExample_10.groovy",
        "pattern_11.groovy"
    ];

    // SETUP EDITORS
    outputCm = CodeMirror(document.getElementById("output"), {
        lineNumbers: true,
        lineWrapping: true,
        mode: { name: "groovy"},
        value: "Output Panel: Script output appears here"
    });

    owlfileCm = CodeMirror(document.getElementById("owlfile"), {
        lineNumbers: true,
        lineWrapping: true,
        mode: { name: "xml"},
        submitFunction: function() {
            $(".load-file").click();
        },
        styleActiveLine: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    });

    CodeMirror.commands.autocomplete = function(cm) {
        cm.showHint({hint: CodeMirror.hint.anyword});
    };

    editor = CodeMirror.fromTextArea(document.getElementById('script'), {
        height: "100%",
        width: "100%",
        continuousScanning: 500,
        lineNumbers: true,
        lineWrapping: false,
        matchBrackets: true,
        autoCloseBrackets: true,
        mode: { name: "groovy"},
        //extraKeys: {"Ctrl-Space": "autocomplete"},
        extraKeys: {"Ctrl-Space": "autocomplete"},
        submitFunction: function() {
            $("#executeButton").click();
        },
        styleActiveLine: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    });

    warningText = '<!-- NOTE: This is a viewer only; files must be loaded in the script and changes made here are not saved. -->\n';

    // DEFAULT CONTENT
    $("#script").load("./data/sample.groovy", function(text) {
        editor.setValue(text);
    });

    var owlFilename = "./data/akt_signaling_pathway.owl";
    filenameText = "<!-- FILE: " + owlFilename + " -->\n";

    $("#owl-file-contents").load(owlFilename, function(text) {
        owlfileCm.setValue(warningText + filenameText + text);
    });

    // LOAD SAMPLE FILE
    $.each(sampleFiles, function(i, val) {
        $('#' + val).click(function(event) {
            var owlFilename = './data/' + val + '.owl';
            filenameText = "<!-- FILE: " + owlFilename + " -->\n";

            $("#owl-file-contents").load(owlFilename, function(text) {
                owlfileCm.setValue(warningText + filenameText + text);
            });
        });
    });

    // RUN SCRIPT
    $("#executeButton").click(function(event) {
        $.ajax({
            type: "POST",
            url: "/executor.groovy",
            data: { script: editor.getValue() },
            dataType: "json",
            complete: function (xhr, status) {
                if (status === 'error' || !xhr.responseText) {
                    alert("Error interacting with the server: " + status);
                } else {
                    var data;
                    try {
                        data = $.parseJSON(xhr.responseText);
                    } catch (e) {
                        alert("Impossible to parse JSON response: " + e);
                        data = {executionResult: "", outputText: "", stacktraceText: ""};
                    }

                    if (data.outputText.length > 0) {
                        outputCm.setValue(data.outputText);
                    } else if (data.stacktraceText.length > 0) {
                        outputCm.setValue(data.stacktraceText);
                    } else {
                        outputCm.setValue("ERROR: Output could not be parsed");
                    }
                }
            }
        });
    });

    // RESIZE EDITORS
    // Taken from: http://jsfiddle.net/xBjnY/122/
    window.onresize = resize;
    resize();

    function resize() {
        var h = (window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight));
        var divHeight = 20 + $("#div_left").height();//20=body padding:10px
        $("#content").css({ "min-height": h - divHeight + "px" });
        $("#div_vertical").css({ "height": h - divHeight + "px" });
        //$("#div_vertical").css({ "height": 20 + "px" });
        $("#LeftPanel").css({ "height": h - divHeight + "px" });
        $("#RightPanel").css({
            "height": h - divHeight + "px",
            "width": $("#content").width() - $("#LeftPanel").width() - $("#div_vertical").width() + "px"
        });

        //console.log("H: " + h + " DH: " + divHeight +
        //    " DVH: " + $("#div_vertical").height() + " DVW: " + $("#div_vertical").width() +
        //    " RPH: " + $("#RightPanel").height() + " RPW: " + $("#RightPanel").width());
    }

    $.resizable = function(resizerID, vOrH){
        $('#' + resizerID).bind("mousedown", function(e){
            var start = e.pageY;
            if(vOrH=='v') start = e.pageX;
            $('body').bind("mouseup", function(){
                $('body').unbind("mousemove");
                $('body').unbind("mouseup");

            });
            $('body').bind("mousemove", function(e){
                var end = e.pageY;
                if(vOrH=='v') end = e.pageX;
                if(vOrH=='h'){
                    $('#' + resizerID).prev().height($('#' + resizerID).prev().height()+ (end-start));
                    $('#' + resizerID).next().height($('#' + resizerID).next().height()- (end-start));
                }
                else{
                    $('#' + resizerID).prev().width($('#' + resizerID).prev().width()+ (end-start));
                    $('#' + resizerID).next().width($('#' + resizerID).next().width()- (end-start));
                }
                start = end;

                // NOTE: Allow the div to expand the original size
                $('#container').css({"height": $('#snippets').height()});
            });
        });
    }

    $.resizable('div_vertical', "v");
    $.resizable('div_right', "h");
    $.resizable('div_left', "h");

    // WAITING DIALOG
    // NOTE: waitingDialog from waitingDialog.js
    $(document)
        .ajaxStart(function() {
            //$loading.show();
            waitingDialog.show('Running ...', { dialogSize: 'sm', progressType: 'info' });
        })
        .ajaxStop(function() {
            //$loading.hide();
            waitingDialog.hide();
        });

    // GET GISTS
    function getFirstKey(data) {
        for(elem in data) {
            return elem;
        }
    }

    // LOAD SAMPLE FILES
    var $template = $(".template");

    //$.each(gistIds, function(gistId, filename) {
    $.each(gistFiles, function(i, filename) {
        var hash =  filename.substring(0, filename.length-7);
        var link = "https://gist.githubusercontent.com/cannin/" + gistId + "/raw/" + filename;
        var gistLink = "https://gist.github.com/cannin/" + gistId;

        $.ajax({
            //url: "https://api.github.com/gists/" + gistId,
            url: link,
            dataType: "text",
            async: false,
            success: function (returnData) {
                //var description = returnData.description;
                //var filename = getFirstKey(returnData.files);
                //var tmp = returnData.files[filename];
                //var raw = tmp.raw_url;
                //var content = tmp.content;
                var content = returnData;
                var description = filename;

                content = content.replace(/</g, '&lt;');
                content = content.replace(/>/g, '&gt;');

                var $newPanel = $template.clone();
                $newPanel.attr("id", "template" + hash);
                $newPanel.find(".collapse").addClass("collapse").removeClass("in");

                $newPanel.find(".panel-heading").attr("id", "heading" + hash);
                $newPanel.find(".panel-collapse").attr("id", "collapse" + hash);
                $newPanel.find(".panel-collapse").attr("aria-labelledby", "heading" + hash);

                $newPanel.find(".panel-title-button").attr("id", "panelTitleButton" + hash);
                $newPanel.find(".panel-title-button").attr("href", "#collapse" + hash);
                $newPanel.find(".panel-title-button").attr("aria-controls", "collapse" + hash);
                $newPanel.find(".panel-title-button").html(description);
                $newPanel.find(".panel-title-button").html('<i class="fa fa-plus-square-o fa-fw"></i>&nbsp;' + description);

                $newPanel.find(".snippetLink").attr("id", hash);
                $newPanel.find(".snippetRaw").attr("href", gistLink);

                $newPanel.find(".panel-body").append('<pre id="Script' + hash + '" class="templateClone"><code class="java">' + content + '</code></pre>');

                $("#accordion").append($newPanel);

                $('#panelTitleButton' + hash).click(function(event) {
                    var isCollapsed = $(this).find("i").hasClass('fa fa-plus-square-o fa-fw');

                    $(".panel-title-button").find("i").attr("class", 'fa fa-plus-square-o fa-fw');

                    if (isCollapsed) {
                    //if ($(this).find("i").attr('aria-expanded') == "true") {
                        $(this).find("i").attr('class', 'fa fa-minus-square-o fa-fw');
                    } else {
                        $(this).find("i").attr('class', 'fa fa-plus-square-o fa-fw');
                    }
                });

                $('#' + hash).click(function (event) {
                    //alert($(this).attr("id") + " A: " +  $(this).attr("class") + JSON.stringify($(this)));
                    editor.setValue($('#Script' + hash).text());
                });
            }
        });
    });

    // NOTE: Does not run if async is true in Gist download
    $("code").each(function(i, codeDiv) {
        hljs.highlightBlock(codeDiv);
    });
});

//var $loading = $('#loadingDiv').hide();
//
//$('#textarea-container').tooltip({
//    animated: 'fade',
//    placement: 'right'
//});
//
//$('#output').tooltip({
//    animated: 'fade',
//    placement: 'right'
//});
//
//$('#owlfile').tooltip({
//    animated: 'fade',
//    placement: 'left'
//});
//
//$('#snippets').tooltip({
//    animated: 'fade',
//    placement: 'left'
//});

