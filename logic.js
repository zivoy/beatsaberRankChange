let bsId = "",
    update = 60,
    showChange = true,
    showAcc = true;

// variables:
// uid: - -scoresaber id
// change: bool - true - show score and pp change since launch
// update: number - 60 - update time in seconds
// square: bool/present - false - use a square image
// stroke: bool/present - false - add a black stroke to text
// acc: bool - true - show the average accuracy and change
// image: bool - true - show image

const params = new URLSearchParams(window.location.search);

let url;
let rankStart, rankLocalStart, ppStart, updateData, accStart, kill = true;

if (params.has("uid") && params.get("uid") !== "") {
    bsId = params.get("uid");
    url = "https://new.scoresaber.com/api/player/" + bsId + "/full";//"/basic";

    if (params.has("change"))
        showChange = "true" === params.get("change");

    if (params.has("acc")) {
        showAcc = "true" === params.get("acc");
        if (!showAcc)
            $("#acc").parent().remove()
    }

    if (params.has("image") && "true" !== params.get("image"))
        $("#image").parent().parent().remove();

    if (params.has("update"))
        update = Math.max(10, parseInt(params.get("update")));

    if (params.has("square") && "false" !== params.get("square"))
        $("#image").removeClass("is-rounded");

    if (params.has("stroke") && "false" !== params.get("stroke")) {
        $(".stroked").each(function (index) {
            $(this).addClass("stroke");
        });
        $('.gap').css('margin-left', '3px')
    }

    updatePage();
    updateData = setInterval(updateFunc, update * 1000);
    setTimeout(() => {
        if (kill) {
            clearInterval(updateData);
            showInstructions();
        }
    }, 5000);
} else {
    showInstructions()
}

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function round2dec(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100
}

let data;

function updateFunc() {
    if (showAcc)
        $.getJSON("https://new.scoresaber.com/api/user/" + bsId + "/refresh", function (res) {
            // console.log(res)
        }).always(updatePage);
    else
        updatePage();
}

function updatePage() {
    $.getJSON(url, function (res) {
        kill = false;
        if ("error" in res) {
            clearInterval(updateData);
            showInstructions();
            return;
        }
        $("#main").removeClass("hidden");
        data = res;
        let info = data["playerInfo"];
        if (info === undefined) return;
        let accuracy = res["scoreStats"]["averageRankedAccuracy"];

        if (showChange && rankStart === undefined) {
            rankStart = info["rank"];
            rankLocalStart = info["countryRank"];
            ppStart = info["pp"];
            accStart = accuracy;
        }

        $("#name").text(info["playerName"]);
        $("#pp").text(formatNumber(info["pp"]));
        $("#globalrank").text(formatNumber(info["rank"]));
        $("#localrank").text(formatNumber(info["countryRank"]));
        $("#image").attr('src', "https://new.scoresaber.com" + info["avatar"]);
        $("#country").attr('src', `https://scoresaber.com/imports/images/flags/${info["country"].toLowerCase()}.png`);
        $("#acc").text(round2dec(accuracy));


        if (showChange) {
            let text;

            let rankDiff = info["rank"] - rankStart;
            let localRankDiff = info["countryRank"] - rankLocalStart;
            let ppDiff = info["pp"] - ppStart;
            let accDiff = accuracy - accStart;

            if (rankDiff !== 0) {
                if (rankDiff < 0) {
                    text = `${formatNumber(rankDiff)}`;
                    $("#rankAdjust").addClass("has-text-link");
                } else {
                    $("#rankAdjust").addClass("has-text-danger");
                    text = `+${formatNumber(rankDiff)}`;
                }
                $("#rankAdjust").text(text);
                $("#rankAdjust").removeClass("hidden");
            } else {
                $("#rankAdjust").addClass("hidden");
                $("#rankAdjust").removeClass("has-text-danger");
                $("#rankAdjust").removeClass("has-text-link");
            }

            if (localRankDiff !== 0) {
                if (localRankDiff < 0) {
                    text = `${formatNumber(localRankDiff)}`;
                    $("#localRankAdjust").addClass("has-text-link");
                } else {
                    $("#localRankAdjust").addClass("has-text-danger");
                    text = `+${formatNumber(localRankDiff)}`;
                }
                $("#localRankAdjust").text(text);
                $("#localRankAdjust").removeClass("hidden");
            } else {
                $("#localRankAdjust").addClass("hidden");
                $("#localRankAdjust").removeClass("has-text-danger");
                $("#localRankAdjust").removeClass("has-text-link");
            }

            if (ppDiff !== 0) {
                if (ppDiff < 0) {
                    text = `${formatNumber(round2dec(ppDiff))}pp`;
                    $("#ppAdjust").addClass("has-text-danger");
                } else {
                    $("#ppAdjust").addClass("has-text-link");
                    text = `+${formatNumber(round2dec(ppDiff))}pp`;
                }
                $("#ppAdjust").text(text);
                $("#ppAdjust").removeClass("hidden");
            } else {
                $("#ppAdjust").addClass("hidden");
                $("#ppAdjust").removeClass("has-text-danger");
                $("#ppAdjust").removeClass("has-text-link");
            }

            if (accDiff !== 0 && showAcc) {
                if (accDiff < 0) {
                    text = `${round2dec(accDiff)}<span style="margin-left:3px"></span>%`;
                    $("#accAdjust").addClass("has-text-danger");
                } else {
                    $("#accAdjust").addClass("has-text-link");
                    text = `+${round2dec(accDiff)}<span style="margin-left:3px"></span>%`;
                }
                $("#accAdjust").html(text);
                $("#accAdjust").removeClass("hidden");
            } else {
                $("#accAdjust").addClass("hidden");
                $("#accAdjust").removeClass("has-text-danger");
                $("#accAdjust").removeClass("has-text-link");
            }
        }
    });
}

function showInstructions() {
    (new URLSearchParams(window.location.search)).forEach((val, key) => {
        if (key !== "uid") params.delete(key)
    });
    params.append("failed", "true");
    window.location.replace("./?" + params.toString());
}
