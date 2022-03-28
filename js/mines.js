let cookieIcon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 52 52" style="enable-background:new 0 0 52 52;" xml:space="preserve"><g><path d="M26,0C11.664,0,0,11.663,0,26s11.664,26,26,26s26-11.663,26-26S40.336,0,26,0z M26,50C12.767,50,2,39.233,2,26   S12.767,2,26,2s24,10.767,24,24S39.233,50,26,50z"/><path d="M38.252,15.336l-15.369,17.29l-9.259-7.407c-0.43-0.345-1.061-0.274-1.405,0.156c-0.345,0.432-0.275,1.061,0.156,1.406   l10,8C22.559,34.928,22.78,35,23,35c0.276,0,0.551-0.114,0.748-0.336l16-18c0.367-0.412,0.33-1.045-0.083-1.411   C39.251,14.885,38.62,14.922,38.252,15.336z"/></g></svg>';
let bombIcon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 512 512" enable-background="new 0 0 512 512"><g><path d="m411.313,123.313c6.25-6.25 6.25-16.375 0-22.625s-16.375-6.25-22.625,0l-32,32-9.375,9.375-20.688-20.688c-12.484-12.5-32.766-12.5-45.25,0l-16,16c-1.261,1.261-2.304,2.648-3.31,4.051-21.739-8.561-45.324-13.426-70.065-13.426-105.867,0-192,86.133-192,192s86.133,192 192,192 192-86.133 192-192c0-24.741-4.864-48.327-13.426-70.065 1.402-1.007 2.79-2.049 4.051-3.31l16-16c12.5-12.492 12.5-32.758 0-45.25l-20.688-20.688 9.375-9.375 32.001-31.999zm-219.313,100.687c-52.938,0-96,43.063-96,96 0,8.836-7.164,16-16,16s-16-7.164-16-16c0-70.578 57.422-128 128-128 8.836,0 16,7.164 16,16s-7.164,16-16,16z"/><path d="m459.02,148.98c-6.25-6.25-16.375-6.25-22.625,0s-6.25,16.375 0,22.625l16,16c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688 6.25-6.25 6.25-16.375 0-22.625l-16.001-16z"/><path d="m340.395,75.605c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688 6.25-6.25 6.25-16.375 0-22.625l-16-16c-6.25-6.25-16.375-6.25-22.625,0s-6.25,16.375 0,22.625l15.999,16z"/><path d="m400,64c8.844,0 16-7.164 16-16v-32c0-8.836-7.156-16-16-16-8.844,0-16,7.164-16,16v32c0,8.836 7.156,16 16,16z"/><path d="m496,96.586h-32c-8.844,0-16,7.164-16,16 0,8.836 7.156,16 16,16h32c8.844,0 16-7.164 16-16 0-8.836-7.156-16-16-16z"/><path d="m436.98,75.605c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688l32-32c6.25-6.25 6.25-16.375 0-22.625s-16.375-6.25-22.625,0l-32,32c-6.251,6.25-6.251,16.375-0.001,22.625z"/></g></svg>';
let coefs = [
    [],
    [1.09,1.19,1.3,1.43,1.58,1.75,1.96,2.21,2.5,2.86,3.3,3.85,4.55,5.45,6.67,8.33,10.71,14.29,20,30,50,100,300],
    [1.14,1.3,1.49,1.73,2.02,2.37,2.82,3.38,4.11,5.05,6.32,8.04,10.45,13.94,19.17,27.38,41.07,65.71,115,230,575,2300],
    [1.19,1.43,1.73,2.11,2.61,3.26,4.13,5.32,6.95,9.27,12.64,17.69,25.56,38.33,60.24,100.4,180.71,361.43,843.33,2530,12650],
    [1.25,1.58,2.02,2.61,3.43,4.57,6.2,8.59,12.16,17.69,26.54,41.28,67.08,115,210.83,421.67,948.75,2530,8855,53130],
    [1.32,1.75,2.37,3.26,4.57,6.53,9.54,14.31,22.12,35.38,58.97,103.21,191.67,383.33,843.33,2108.33],
    [1.39,1.96,2.82,4.13,6.2,9.54,15.1,24.72,42.02,74.7,140.06,280.13,606.94,1456.67,4005.83,13352.78],
    [1.47,2.21,3.38,5.32,8.59,14.31,24.72,44.49,84.04,168.08,360.16,840.38,2185,6555,24035,120175,1081575],
    [1.56,2.5,4.11,6.95,12.16,22.12,42.02,84.04,178.58,408.19,1020.47,2857.31,9286.25,37145,204297.5,2042975],
    [1.67,2.86,5.05,9.27,17.69,35.38,74.7,168.08,408.19,1088.5,3265.49,11429.23,49526.67,297160,3268760],
    [1.79,3.3,6.32,12.64,26.54,58.97,140.06,360.16,1020.47,3265.49,12245.6,57146.15,371450,4457400],
    [1.92,3.85,8.04,17.69,41.28,103.21,280.13,840.38,2857.31,11429.23,57146.15,400023.08,5200300],
    [2.08,4.55,10.45,25.56,67.08,191.67,606.94,2185,9286.25,49526.67,371450,5200300],
    [2.27,5.45,13.94,38.33,115,383.33,1456.67,6555,37145,297160,4457400],
    [2.5,6.67,19.17,60.24,210.83,843.33,4005.83,24035,204297.5,3268760],
    [2.78,8.33,27.38,100.4,421.67,2108.33,13352.78,120175,2042975],
    [3.13,10.71,41.07,180.71,948.75,6325,60087.5,1081575],
    [3.57,14.29,65.71,361.43,2530,25300,480700],
    [4.17,20,115,843.33,8855,177100],
    [5,30,230,2530,53130],
    [6.25,50,575,12650],
    [8.33,100,2300],
    [12.5,300],
    [25]
];
$(document).ready(function () {
    $("#InputBombs").change(function() {
        getItems()
    });
});
function validateBombs(that) {
    var inp = $(that);
    if(inp.val() > 24) inp.val(24);
    //if(inp.val() < 2) inp.val(2);
    if(inp.val() % 1 !== 0) inp.val(parseInt(inp.val()));
    getItems();
}
function getItems(bombs = $("#InputBombs").val()) {
    let i = 1;
    $('.multipliers').html('');
    coefs[bombs-1].forEach(e => {
        $('.multipliers').append(`
        <div class="multiplier-wrap">
            <div data-p="${i}" class="multiplier" style="${(e < 1000) ? '' : 'font-size: 13.5px;'}">
                x${(e < 1000) ? e.toFixed(2) : (e / 1000).toFixed(1).replace('.0', "") + 'K'}
            </div>
            <div class="pointer ${(i == coefs[bombs-1].length) ? 'd-none' : ''}">
                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/></svg>
            </div>
        </div>`);
        i++;
    });
}
function catchMines() {
    $.post("/mines/take").then((e) => {
        if (e.error) return n(e.msg, "error");
        $("#mines_catch").hide();
        $("#mines_start").show();
        e.bombs.forEach((i) => {
            $(".cell[data-number=" + i + "]")
                .html(bombIcon)
                .addClass("bomb-mine nk-4");
        });

        renderCristall();
        $("#balance").html(e.balance.toFixed(2));
        $('#hashBet').html(e.hash);
        return n(e.msg, "success");
    });
}
function createMines() {
    $.post("/mines/create", {
        bomb: $("#InputBombs").val(),
        bet: $("#amountBetInputBomb").val(),
    }).then((e) => {
        if (e.error) return n(e.msg, "error");
        $("#mines_start").hide();
        $("#mines_catch").show();
        $('#win').html(Number($("#amountBetInputBomb").val()).toFixed(2));
        $(".cell").html("");
        for (i = 0; i <= 25; i++) {
            $(".cell[data-number=" + i + "]").attr("disabled", false).removeClass('bomb-mine diamond-mine nk-4 active');
        }
        $('.multiplier').removeClass('active');
        $('.multipliers-wrap').animate({scrollLeft: 0}, 0);
        $("#mines_take").html(0.0);
        $("#balance").html(e.balance.toFixed(2));
        return n(e.msg, "success");
    });
}
function renderMines() {
    $.post("/mines/get").then((e) => {
        if (e.error) return n(e.msg, "error");
        if (e.status == 1) {
            $("#mines_start").hide();
            $("#mines_catch").show();
            $(".cell").html("");
            $("#MineProfit").html(e.next);
            $("#win").html(e.coef);
            for (i = 0; i <= 25; i++) {
                $(".cell[data-number=" + i + "]").attr("disabled", false);
            }
            setTimeout(() => {
                e.click.forEach((i) => {
                    $(".cell[data-number=" + i + "]")
                        .hide()
                        .html(cookieIcon)
                        .fadeIn(500)
                        .addClass("diamond-mine active");
                });
                for(i = 1; i <= e.click.length; i++) {
                    $('.multiplier[data-p=' + i + ']').addClass('active')
                }
                if(e.click.length % 3 === 0 || e.click.length >= 3) {
                $('.multipliers-wrap').animate({scrollLeft: $('.multiplier-wrap').width() * (e.click.length - 2)}, 800);
                }
            }, 150);
        }
    });
}
function renderCristall() {
    for (i = 0; i <= 25; i++) {
        let mine_now = $(".cell[data-number=" + i + "]");
        if (mine_now.hasClass("bomb-mine") || mine_now.hasClass("diamond-mine")) {
            // nothing to do
        } else {
            mine_now.hide().addClass("nk-4").html('<svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="bi bi-triangle-fill icon"><path fill-rule="evenodd" d="M7.022 1.566a1.13 1.13 0 011.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z" clip-rule="evenodd"></path></svg>').fadeIn().addClass("diamond-mine");
        }
    }
}