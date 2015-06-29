$(document).ready(function() {
    // SETUP EDITORS
    outputCm = CodeMirror(document.getElementById("output"), {
        lineNumbers: true,
        mode: { name: "groovy"},
        value: "Output Panel: Script output appears here"
    });

    owlfileCm = CodeMirror(document.getElementById("owlfile"), {
        lineNumbers: true,
        mode: { name: "xml"},
        submitFunction: function() {
            jQuery(".load-file").click();
        },
        styleActiveLine: true
    });

    editor = CodeMirror.fromTextArea(document.getElementById('script'), {
        height: "100%",
        width: "100%",
        continuousScanning: 500,
        lineNumbers: true,
        textWrapping: false,
        mode: { name: "groovy"},
        submitFunction: function() {
            jQuery("#executeButton").click();
        },
        styleActiveLine: true
    });

    warningText = '<!-- NOTE: This is a viewer only; files must be loaded in the script and changes made here are not saved. -->\n';

    // DEFAULT CONTENT
    jQuery("#script").load("./data/sample.groovy", function(text) {
        editor.setValue(text);
    });

    var owlFilename = "./data/akt_signaling_pathway.owl";
    filenameText = "<!-- FILE: " + owlFilename + " -->\n";

    jQuery("#owl-file-contents").load(owlFilename, function(text) {
        owlfileCm.setValue(warningText + filenameText + text);
    });

    // SAMPLE FILES
    var sampleFiles = ["akt_signaling_pathway", "biopax3-short-metabolic-pathway",
        "fanconi_anemia_reactome", "intrinsic_apoptosis_reactome",
        "raf_map_kinase_cascade_reactome"];

    $.each(sampleFiles, function(i, val) {
        $('#' + val).click(function(event) {
            var owlFilename = './data/' + val + '.owl';
            filenameText = "<!-- FILE: " + owlFilename + " -->\n";

            jQuery("#owl-file-contents").load(owlFilename, function(text) {
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
        $("#LeftPanel").css({ "height": h - divHeight + "px" });
        $("#RightPanel").css({
            "height": h - divHeight + "px",
            "width": $("#content").width() - $("#LeftPanel").width() - $("#div_vertical").width() + "px"
        });
    }

    jQuery.resizable = function(resizerID, vOrH){
        jQuery('#' + resizerID).bind("mousedown", function(e){
            var start = e.pageY;
            if(vOrH=='v') start = e.pageX;
            jQuery('body').bind("mouseup", function(){
                jQuery('body').unbind("mousemove");
                jQuery('body').unbind("mouseup");

            });
            jQuery('body').bind("mousemove", function(e){
                var end = e.pageY;
                if(vOrH=='v') end = e.pageX;
                if(vOrH=='h'){
                    jQuery('#' + resizerID).prev().height(jQuery('#' + resizerID).prev().height()+ (end-start));
                    jQuery('#' + resizerID).next().height(jQuery('#' + resizerID).next().height()- (end-start));
                }
                else{
                    jQuery('#' + resizerID).prev().width(jQuery('#' + resizerID).prev().width()+ (end-start));
                    jQuery('#' + resizerID).next().width(jQuery('#' + resizerID).next().width()- (end-start));
                }
                start = end;

                // NOTE: Allow the div to expand the original size
                $('#container').css({"height": $('#snippets').height()});
            });
        });
    }

    jQuery.resizable('div_vertical', "v");
    jQuery.resizable('div_right', "h");
    jQuery.resizable('div_left', "h");

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

    var gistIds = {
        "328ac70995da3472d196":"bwcBasicTraversal.groovy",
        "b6f7ba64e1156b001282":"bwcListFiles.groovy",
        "3a31bd3b91a7e610a733":"jenkins_build_install.R",
        "c78097528a2d2f34bdea":"deployAppWithData.R",
        "b77c366d2a94592cd67e":"jenkins_build.R",
        "819e73426b4ebd5752d5":"checkTestCoverage.R"
    };

    var $template = $(".template");

    $.each(gistIds, function(gistId, filename) {
        var hash = gistId;
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

                $newPanel.find(".snippetLink").attr("id", gistId);
                $newPanel.find(".snippetRaw").attr("href", gistLink);

                $newPanel.find(".panel-body").append('<pre id="Script' + gistId + '" class="templateClone"><code class="java">' + content + '</code></pre>');

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

                $('#' + gistId).click(function (event) {
                    //alert($(this).attr("id") + " A: " +  $(this).attr("class") + JSON.stringify($(this)));
                    editor.setValue($('#Script' + gistId).text());
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

