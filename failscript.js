const params = new URLSearchParams(window.location.search);

if (params.get("failed") === "true") {
    $("#badUid").removeClass("is-hidden");
    if (params.has("uid")) {
        $("#uidError").removeClass("is-hidden");
        $("#uid").text(params.get("uid"))
    } else {
        $("#noUid").removeClass("is-hidden");
    }
} else if(params.has("uid")) {
    params.delete("failed");
    window.location.replace("./status?" + params.toString());
}
