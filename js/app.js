const lang = 'ru'; // language (development..)
const abcbank = ['black', 'yellow', 'red', 'green'];

var wheel_connect = 0;
var in_game = 0;
var opened;
var callback_timer;
var callback_get = 0;
var paysys = 0;
var witdrawsys = 0;
var chd = 0;

let gocheck;


function n(text, type, time, closein) {
    timen = (time) ? time : 1000;
    bdsd = (closein) ? closein : true;
    new Noty({
        text        : text,
        type        : type,
        dismissQueue: true,
        layout      : 'bottomCenter',
        theme       : 'mint',
        progressBar: true,
        timeout: timen,
        killer: bdsd
    }).show();
}

const socket = io.connect(':3333');
console.log('connected to :3333')
socket.on('live', function(data) {
    $('.online').html(data.count);
});

socket.on('add_wheel', function(data) {
    if ($('.bet[data-userid='+data.user_id+'][data-color='+data.to+']').length >= 1) {
        $('#bet_'+data.to+'_'+data.user_id).html(data.total_bet);
    } else $('.bets[data-color='+data.to+']').append(data.html);
    for(i=0;i<=4;i++) {
        $('.price[data-bank='+abcbank[i]+']').html(data.color[abcbank[i]]);
    }
    var colors = {
        'ru':{"black":'черный', "red":'красный', "yellow":'желтый',"green":'зеленый'},
        'en':{"black":'black', "red":'red', "yellow":'yellow',"green":'green'}
    };
    console.log(`[WHEEL ROOM] Ставка на ${colors[lang][data.to]} добавлена`);
});

socket.on('upd_wheel', function(data) {

});

socket.on('wheel_clear', function(data) {
//clearTimeout(gocheck);
    $('.bets[data-color]').html('');
    $('.price').html('0.00');
    $('#wheelSpin').css({
        transition: '0s',
        transform: 'rotate(-370deg)'
    });
    $('.rez-stat').prepend(`<button class="animate__animated animate__fadeInRight rez-stat__item rez-stat__item--${data.last.data}"></button>`);
    $('.rez-stat').children().slice(14).remove();
    $('.description.wheel').html('До начала игры:');
    gocheck = setTimeout(() => wheelInfo(data.game.id), 650);
});

socket.on('wheel_start', function(data) {
    $('.description.wheel').html('До начала игры:');
    $('#wheelTime').html(data);
    in_game = 0;
});

socket.on('test', function(data){
    console.log(data);
    let out, total, coef, bet;
    if(data.type == 'lose') {
        bet = parseFloat(data.bet).toFixed(2);
        coef = 0;
        out = "danger";
        total = 0;
    }
    else {
        bet = parseFloat(data.bet).toFixed(2);
        coef = data.coef.toFixed(2);
        total = data.total.toFixed(2);
        out = "success";
    }
    $(".games-history").prepend(`<div class="panel"><span> <img alt="Dice" class="game" src="/img/dice.svg">${data.game}</span><span>${data.name}</span><span>${bet}₽</span> <span>x${coef}</span><span class="${out}">${total}</span></div>`);
    $('.games-history').children().slice(15).remove();

});

socket.on('wheel_roll', function(data) {
    $('.description.wheel').html('Прокрутка');
    $('#wheelTime').html(data.timer.data);
    if(wheel_connect == 0) {
        var contime = {
            '20':{'data':16},
            '19':{'data':16},
            '18':{'data':16},
            '17':{'data':16},
            '16':{'data':16},
            '15':{'data':15},
            '14':{'data':14},
            '13':{'data':13},
            '12':{'data':11},
            '10':{'data':10},
            '9':{'data':7},
            '8':{'data':6},
            '7':{'data':5},
            '6':{'data':4},
            '5':{'data':3},
            '4':{'data':2},
            '3':{'data':1},
            '2':{'data':0},
            '1':{'data':0}

        };
        if(in_game == 0) {
            $('#wheelSpin').css({
                transition: 'all '+contime[data.timer.data].data+'s cubic-bezier(0, 0.49, 0, 1) -7ms',
                transform: 'rotate('+data.roll.data+'deg)'
            });
            in_game++;
        }
    } else {
        $('#wheelSpin').css({
            transition: 'all 16s cubic-bezier(0, 0.49, 0, 1) -7ms',
            transform: 'rotate('+data.roll.data+'deg)'
        });
//} else return n('CLIENT_ERR', 'error');
    }
});

function callback_set() {
    if(callback_get < 1) callback_get++;
    else console.log(callback_get);
}
function callback_re() {
    clearTimeout(callback_timer);
    callback_get = 0;
}
function tryPost() {

    if(callback_get == 0 && chd >= 1) {
        n('Произошла ошибка!<br>Пожалуйста, обновите страницу', 'error');
        console.log(callback_get);
    } else;
    chd++;
}

function wheelBet(color) {
    callback_re();
    $.post('/api/wheel/bet/'+color,{_token: $('meta[name="csrf-token"]').attr('content'), bet: $('#wheelBet').val()}).then(e=>{
        callback_set();
        if(e.success){
            $('#balance').html(e.balance.toFixed(2));
            return n('Ставка принята!', 'success');
        }
        if(e.error){
            return n(e.message, 'error');
        }
    });
    callback_timer = setTimeout(()=>tryPost(),650);
}

function wheelInfo(game_id) {
    if(!client_user) return false;
    $.post('/user/wheel', {_token: $('meta[name="csrf-token"]').attr('content'), game_id: game_id}).then(e=>{
        if(e.success){
            $('#balance').html(e.balance.toFixed(2));
            for(i=0;i<=e.winarr.length-1;i++) {n(`Ваша ставка #${e.winarr[i]} выиграла`, 'success', '', 'false');}
            for(i=0;i<=e.losearr.length-1;i++) {n(`Ваша ставка #${e.losearr[i]} проиграла`, 'error', '', 'false');}
        }
        if(e.error){
            return n(e.message, 'error');
        }
    });
}

function choosePay(payId, e) {
    const paySys = {
        '1':{'data': 'piastrix'},
        '2':{'data': 'qiwi'},
        '3':{'data': 'card'},
        '4':{'data': 'fkwallet'}
    }
    $('.depositBlock').removeClass('active').css('filter', 'blur(3px)');
    $(e).addClass('active').css('filter', 'blur(0px)');
    $('#'+paySys[payId]['data']).show(100);
    paysys = paySys[payId]['data'];
}

function chooseWithdraw(payId, e) {
    const withdraw = {
        '1':{'data': 'qiwi'},
        '2':{'data': 'piastrix'},
        '3':{'data': 'payeer'},
        '4':{'data': 'card'}
    }
    $('.action').removeClass('active').css('filter', 'blur(3px)');
    $(e).addClass('active').css('filter', 'blur(0px)');
    witdrawsys = withdraw[payId]['data'];
}

function deposit() {
    $.post('/user/pay/'+paysys, {_token: $('meta[name="csrf-token"]').attr('content'), size:$('#amount-deposit').val()}).then(e=>{
        if(e.success){
            n('Перенаправление...', 'success');
            setTimeout(()=>location.href=e.redirect,1000);
        }
        if(e.error){
            return n(e.message, 'error');
        }
    });
}

function daily() {
    var response = grecaptcha.getResponse(daily1);
    if(response.length == 0){
        return n("Вы не прошли проверку на робота", "error");
    }
    else {
        $.post('/user/daily', {_token: $('meta[name="csrf-token"]').attr('content')}).then(e=>{
            if(e.success){
                n('В раздаче получено '+e.bonus+' монет(-ы)', 'success');
                $('#balance').html(e.balance.toFixed(2));
            }
            if(e.error){
                return n(e.message, 'error');
            }
        });
    }
}

function vk_bonus() {
    var response = grecaptcha.getResponse(vk_bonus1);
    if(response.length == 0){
        return n("Вы не прошли проверку на робота", "error");
    }
    else {
        $.post('/user/vk_bonus', {_token: $('meta[name="csrf-token"]').attr('content')}).then(e=>{
            if(e.success){
                n('Вы успешно получили бонус', 'success');
                $('#balance').html(e.balance.toFixed(2));
            }
            if(e.error){
                return n(e.message, 'error');
            }
        });
    }
}

function withdraw() {
    $.post('/user/withdraw', {_token: $('meta[name="csrf-token"]').attr('content'), wallet:$('#input-number').val(),sum:$('#input-amount').val(), system: witdrawsys}).then(e=>{
        if(e.success){
            return n('Заявка на выплату успешно создана!', 'success');
            location.replace('/withdraw');

        }
        if(e.error){
            return n(e.message, 'error');
        }
    });
}
function load_withdrawals() {
    $.post('/user/getWithdraw', {_token: $('meta[name="csrf-token"]').attr('content')}).then(e=>{
        if(e.success){
            $('#withdraw_table').html('');
            //<td>${e.withdraws[i].id}</td>
            for(i=0;i<=e.withdraws.length-1;i++) {
                $('#withdraw_table').append(`<tr>

                          <td class="text-muted">${e.withdraws[i].system}</td>
                          <td class="text-muted">${e.withdraws[i].wallet}</td>
                          <td class="text-muted">${e.withdraws[i].sum}</td>
                          <td class="text-muted">${e.withdraws[i].time}</td>
                          <td id="status_${e.withdraws[i].id}">${e.withdraws[i].status}</td>
                        </tr>`);
            }
        }
        if(e.error){
            return n(e.message, 'error');
        }
    });
}
function load_deposits() {
    $.post('/user/getPayment', {_token: $('meta[name="csrf-token"]').attr('content')}).then(e=>{
        if(e.success){
            $('#deposit_table').html('');
            //<td>${e.payments[i].id}</td>
            for(i=0;i<=e.payments.length-1;i++) {
                $('#deposit_table').append(`<tr>

                          <td class="text-muted">${e.payments[i].sum}</td>
                          <td class="text-muted">${e.payments[i].system}</td>
                        </tr>`);
            }
        }
        if(e.error){
            return n(e.message, 'error');
        }
    });
}

function dice(type) {
    $.post('/dice/bet', {
        _token: $('meta[name="csrf-token"]').attr('content'),
        bet: $('.nvuti_sum').val(),
        percent: $('.nvuti_chance').val(),
        type: type
    }).then(e => {
        callback_set();
        if(e.type == 'success')
            if(e.out == 'win') {
                $('.result').css('display', 'block').removeClass("danger").addClass("success").html("Выиграли <b>"+e.cash.toFixed(2)+"</b>");
                $('#balance').html(e.balance.toFixed(2));
                $('#hashBet').hide().fadeIn().html(e.hash);
                return false;
            }
        if(e.out == 'lose') {
            $('.result').css('display', 'block').removeClass("success").addClass("danger").html('Выпало <b>' + e.random + '</b>');
            $('#balance').html(e.balance.toFixed(2));
            $('#hashBet').hide().fadeIn().html(e.hash);
            return false;
        } else $('.result').css('display', 'block').removeClass("success").addClass("danger").html(e.msg);
    });
    callback_timer = setTimeout(()=>tryPost(),650);
}

function promo() {
    $.post('/user/promo',{_token: $('meta[name="csrf-token"]').attr('content'), code: $('#promocode').val()}).then(e=>{
        if(e.success){
            $('#balance').html(e.balance.toFixed(2));
            return n('Промокод '+e.code+' активирован!', 'success');
        }
        if(e.error){
            return n(e.message, 'error');
        }
    });
}

function updProfit() {
    $('.x').html(((100 / $('.nvuti_chance').val()) * $('.nvuti_sum').val()).toFixed(2));
    $('.min-prog').html('0 - '+Math.floor(($('.nvuti_chance').val() / 100) * 999999));
    $('.max-prog').html(999999 - Math.floor(($('.nvuti_chance').val() / 100) * 999999)+' - 999999');
}

function validateSum(that) {
    var inp = $(that);
    if(inp.val() > 1000) inp.val(1000);
}

function validatePer(that) {
    var inp = $(that);
    if(inp.val() > 80) inp.val(80);
    //if(inp.val() < 1) inp.val(1);
}

function copyRef() {
    var copyText = document.getElementById('ref');
    copyText.select();
    copyText.setSelectionRange(0, 99999)
    document.execCommand("copy");
    n('Реферальная ссылка скопирована!', 'success');
}

function jackpot() {
    callback_re();
    $.post('/api/jackpot/newBet', {_token: $('meta[name="csrf-token"]').attr('content'), sum:$("#amount").val()}).then(e=>{
        callback_set();
        if(e.success){
            $('#balance').html(e.balance.toFixed(2));
            return n('Ставка принята!', 'success');
        }
        if(e.error){
            return n(e.message, 'error');
        }
    });
    callback_timer = setTimeout(()=>tryPost(),650);
}
function _getTransformOffset(e) {
    var t = e.css("transform").split(",");
    return 6 === t.length ? parseInt(t[4]) : 16 === t.length ? parseInt(t[12]) : 0
}
    socket.on('jackpot.newBet', function(data) {
        console.log(data.bets.length);
        var bet = '';
        data.bets.forEach(function (info) {
            bet += '<div class="bet">';
            bet += '<span class="profile">';
            bet += '<img src="'+ info.avatar +'" alt="'+ info.username +'">';
            bet += info.username;
            bet += '</span>';
            bet += '<span class="bet-info">';
            bet += '(' + info.from + '-' + info.to + ')';
            bet += '<img alt="coin" src="/img/hrust.svg?v=1">'
            bet += info.sum;
            bet += '</span>';
            bet += '</div>';
        });


        var chances = '';
        for(var i = 0; i < data.chances.length; i++) {
            chances += '<div class="player">';
            chances += '<img src="'+ data.chances[i].avatar +'">';
            chances += '<div class="winner-bilet">' + data.chances[i].chance + '%</div>';
            chances += '</div>';
        }

        $('#app .price span').html(data.game.price);

        $('#app .jackpot .bets').html(bet);
        $('#app .jackpot .players').show().html(chances);
    });

    socket.on('jackpot.timer', function(data) {
        var sec = data.sec,
            min = data.min,
            time = data.time,
            timer = data.timer;
        if(sec < 10) sec = '0' + sec;
        if(min < 10) min = '0' + min;
        $('.time').html(min+':'+sec);
        $('.progress-bar').css({width: (time/timer)*100+'%'})
    });

socket.on('jackpot.ngTimer', function(data) {
    if(data.ngtime < 10) data.ngtime = '0' + data.ngtime;
    $('.time').html('00:'+data.ngtime);
    $('.progress-bar').css({width: (data.ngtime/15)*100+'%'})
});
    socket.on('jackpot.slider', function(data) {
        var time = 20;
        setInterval(() => {
            time--;
        },1000)
        $('.roulette').slideDown();
        var members = '';
        var e = 5000;
        var l, h, d = (l = 5195, h = 5239, l = Math.ceil(l), h = Math.floor(h), Math.floor(Math.random() * (h - l)) + l),
                    p = Math.round(d),
                    v = 1e3 * e;
                v < 0 && (v = 0);
                var g = 1 - (v - 5e3) / 15e3,
                    m = 15e3 - 15e3 * (1 - (g = g < 0 ? 0 : g));
        for(var i = 0; i < data.members.length; i++) members += '<img id='+ i +' src='+ data.members[i].avatar + ' alt='+ data.members[i].username +'>';
        $('#app .roulette .inbox .players').html(members);
        $('.progress-bar').css({width:(time/15)*100+'%'});
        $('#app .roulette .inbox .players').css({
            transition: "15000ms cubic-bezier(0, 0, 0, 1) -6ms",
            transform: "translate3d(-" + data.ml + "px, 0px, 0px)"
        });
        
        var m = 4, p = 0;
        rouletteInterval = setInterval(function () {
            p = _getTransformOffset($('.roulette')), m - p >= 60 && (m = p);
        }, 80);
        setTimeout(function () {
            $('.winner').css('display', '');
            $('.winner').slideDown();
            $('.winner .profile img').attr('src', data.winner.avatar);
            $('.winner .profile .info .name').text(data.winner.username);
            $('#winnersum').text(data.winner.sum);
            $('#winnerchance').text(data.winner.chance+'%');

        }, 16000);
    });
    socket.on('jackpot.newGame', function(data) {
        $('#app .game .roulette').slideUp();
        $('.winner').slideUp();
        $('#app .roulette .inbox .players').css({
            transform: "translateX(0px)"
        });
        $('.time').text(data.time[0]+':'+data.time[1]);
        $('.price span').html('0');
        $('.bets').html('');
        $('.progress-bar').css({width: '100%'});
    });

function startgame(){
    var bet = $("#amountBetInputBomb").val();
    var mine = "mine";
    $.ajax({
        url: '/api/mines/bet',
        type: "POST",
        dataType: "html",
        data: {
            type: mine,
            mines: $('#InputBombs').val(),
            bet: bet,
        },
        success: function(response){
            obj = $.parseJSON(response);
            if(obj.info == "warning"){
                n(obj.warning, "error");
            }else{
                if(obj.info == "true"){
                    $('#finishmines').show();
                    $('#startmines').hide();
                    $(".win").css("color","green").text("0");

                    for(i=0;i<26;i++){
                        $(".cell[data-number="+i+"]").removeClass("active").removeAttr("disabled","disabled").text("");
                        $(".cell[data-number="+i+"]").removeClass("fas fa-bomb").removeAttr("disabled","disabled").text("");
                    }
                    $("#startmines").attr("disabled","disabled");
                    $("#finishmines").removeAttr("disabled","disabled");
                    n("Игра началась!", "success");

                    $("#balance").text(obj.money);

                }
                if(obj.info == "false"){
                    n("У вас есть активная игра", "error");
                }
            }
        }
    });
};
var lastClick;
function checkClick(timeclick)
{var timeStamp = 0;
    if ( !lastClick || lastClick && timeStamp - lastClick > timeclick ) {
        lastClick = timeStamp;
        return true;
    }
    else
    {
        return false;
    }
}
$( document ).ready(function() {
    var click = checkClick(300);
    if(click){
        $(".cell").click(
            function minclick(){
                var pressmine = $(this).attr("data-number");
                $.ajax({
                    url: '/api/mines/mine',
                    type: "POST",
                    dataType: "html",
                    data: {
                        press: pressmine,
                    },
                    success: function(response){ //response
                        obj = $.parseJSON(response); //response
                        if(obj.info == "warning"){
                            n(obj.warning, "error");
                        }
                        if(obj.info == "click"){
                            if(obj.bombs == "true"){
                                $('#startmines').show();
                                $('#finishmines').hide();
                                $(".cell[data-number="+obj.pressmine+"]").addClass("lose-mine fas fa-bomb");
                                n("Поле "+obj.pressmine+" оказалось с миной", "error");
                                $("#finishmines").attr("disabled","disabled");
                                $("#startmines").removeAttr("disabled","disabled");
                                $(".win").css("color","red").text("0");
                                obj.tamines = $.parseJSON(obj.tamines);
                                for(i = 0; i < obj.tamines.length; i++){
                                    $(".cell[data-number="+obj.tamines[i]+"]").addClass('lose-mine fas fa-bomb');
                                }
                                for(i=0;i<26;i++){
                                    $(".cell[data-number="+i+"]").attr("disabled","disabled");
                                }
                            }else{
                                $(".cell[data-number="+obj.pressmine+"]").text("+"+obj.win).addClass("win-mine");
                                $("#winSummaBoxBomb").text(obj.win);
                                $(".cell[data-number="+obj.pressmine+"]").attr("disabled","disabled");
                                n("Поле " +pressmine+" оказалось призовым", "success");
                            }
                        }
                    }
                })
            }
        );
    }else{
        n("Не спеши!","error");
    }
});
function finishgame(){
    $.ajax({
        url: '/api/mines/finish',
        type: "POST",
        dataType: "html",
        data: {
            finish: true,
        },
        success: function(response){
            obj = $.parseJSON(response);
            if(obj.info == "warning"){
                n(obj.warning, "error");
            }else{
                obj.tamines = $.parseJSON(obj.tamines);
                if (obj.info = true){
                    n('Поздравляем, вы выиграли '+obj.win+' монет', "success");

                    $('#startmines').show();
                    $('#finishmines').hide();
                    $("#balance").text(obj.money);
                    $("#startmines").removeAttr("disabled","disabled");
                    $("#finishmines").attr("disabled","disabled");

                    for(i=0;i<26;i++){
                        $(".cell[data-number="+i+"]").attr("disabled","disabled");
                    }
                    for(i = 0; i < obj.tamines.length; i++){
                        $(".cell[data-number="+obj.tamines[i]+"]").addClass('lose-mine fas fa-bomb');
                    }
                }
            }

        },
    })
}
