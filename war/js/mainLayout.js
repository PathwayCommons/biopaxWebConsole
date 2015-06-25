$(document).ready(function() {
    outputCm = CodeMirror(document.getElementById("output"), {
        lineNumbers: true,
        mode: { name: "groovy"},
        value: "Output Panel: Script output appears here"
    });

    stacktraceCm = CodeMirror(document.getElementById("stacktrace"), {
        lineNumbers: true,
        mode: { name: "groovy"},
        value: "Stacktrace Panel: Script errors appear here"
    });

    editor = CodeMirror.fromTextArea(document.getElementById('script'), {
        height: "100%",
        width: "100%",
        continuousScanning: 500,
        lineNumbers: true,
        textWrapping: false,
        tabMode: "spaces",
        mode: { name: "groovy"},
        submitFunction: function() {
            jQuery("#executeButton").click();
        }
    });

    jQuery("#script").load("./data/sample.groovy", function(text) {
        editor.setValue(text);
    });

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

                    //$('#output').text(data.outputText);
                    //$('#result').text(data.executionResult);
                    //$('#stacktrace').text(data.stacktraceText);

                    console.log("tehoun");
                    console.log("O: " + data.outputText);
                    console.log("R: " + data.executionResult);
                    console.log("S: " + data.stacktraceText);

                    if (data.outputText.length > 0) {
                        //$('#output').text(data.outputText).fadeIn();
                        outputCm.setValue(data.outputText);
                    } else {
                        //$('#output').fadeOut();
                        outputCm.setValue("No output");
                    }

                    if (data.stacktraceText.length > 0) {
                        //$('#stacktrace').text(data.stacktraceText).fadeIn();
                        stacktraceCm.setValue(data.stacktraceText);
                    } else {
                        //$('#stacktrace').fadeOut();
                        stacktraceCm.setValue("No errors");
                    }
                }
            }
        });
    });

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
            });
        });
    }

    jQuery.resizable('div_vertical', "v");
    jQuery.resizable('div_right', "h");
    jQuery.resizable('div_left', "h");

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
    //$('#stacktrace').tooltip({
    //    animated: 'fade',
    //    placement: 'left'
    //});
    //
    //$('#snippets').tooltip({
    //    animated: 'fade',
    //    placement: 'left'
    //});

    $('#loadingDiv')
        .hide()
        .ajaxStart(function() {
            $(this).show();
        })
        .ajaxStop(function() {
            $(this).hide();
        });
});
