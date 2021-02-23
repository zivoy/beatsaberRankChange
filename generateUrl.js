function generate() {
    let scoresaberID = $("#scoresaberId").val();
    if (scoresaberID === "" || scoresaberID === undefined) {
        $("#resultUrl").val("");
        return;
    }
    let isUrl = scoresaberID.match(/scoresaber\.com\/u\/(\d+)/);
    if (isUrl !== null) scoresaberID = isUrl[1];
    let params = new URLSearchParams();

    params.append("uid", scoresaberID);

    if (!$('#change').is(":checked")) {
        params.append("change", "false")
    }
    if ($('#square').is(":checked")) {
        params.append("square", "true")
    }
    if ($('#stroke').is(":checked")) {
        params.append("stroke", "true")
    }
    if (!$('#image').is(":checked")) {
        params.append("image", "false")
    }
    if (!$('#acc').is(":checked")) {
        params.append("acc", "false")
    }

    let time = 0+$("#update").val();
    time = Math.max(10, time);
    if (time !== 60) params.append("update", "" + time);

    $("#resultUrl").val("https://ziv.shalit.name/scoresaberStatus/status?" + params.toString())

}

function copyText() {
    let value = $("#resultUrl").val();
    if (value === "" || value === undefined) return;
    let copyText = document.querySelector("#resultUrl");

    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */

    document.execCommand("copy");
}


$("#change").on("change", generate);
$("#square").on("change", generate);
$("#stroke").on("change", generate);
$("#acc").on("change", generate);
$("#image").on("change", generate);
$("#scoresaberId").on("change keyup", generate);
$("#update").on("change keyup", generate);
