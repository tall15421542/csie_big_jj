function changeText(id) {
    id.innerHTML = "完成";
};


var flag = 0;
$("#ansure_button").on('click', function() {
    if (flag == 0) {
        $("#cancel_button").hide();
        var random = getRandom(9999);
        $("#rand_num_pop").text(random);
        $("#rand_num_orig_1").text(random)
        flag += 1;
    } else {
        $('#leg').modal('hide');
    }
});

var flag1 = 0;
$("#ansure_button1").on('click', function() {
    if (flag1 == 0) {
        $("#cancel_button1").hide();
        var random = getRandom(9999);
        $("#rand_num_pop1").text(random);
        $("#rand_num_orig_2").text(random)
        flag1 += 1;
    } else {
        $('#bottom_body').modal('hide');
    }
});

var flag2 = 0;
$("#ansure_button2").on('click', function() {
    if (flag2 == 0) {
        $("#cancel_button2").hide();
        var random = getRandom(9999);
        $("#rand_num_pop2").text(random);
        $("#rand_num_orig_3").text(random)
        flag2 += 1;
    } else {
        $('#pectorals').modal('hide');
    }
});

function getRandom(x) {
    return Math.floor(Math.random() * x) + 1;
};

var leg_database_key = 0
$("#leg_key_check").on('click', function() {
    if (leg_database_key == $("#input_leg_key").val()) {
        window.location.href = 'leg.html';
    } else {
        alert('輸入錯誤喔~~有預約嗎?');
    }

});

var bottom_body_database_key = 0
$("#bottom_body_key_check").on('click', function() {
    if (bottom_body_database_key == $("#input_bottom_body_key").val()) {
        window.location.href = 'bottomBody.html';
    } else {
        alert('輸入錯誤喔~~有預約嗎?');
    }

});

var chest_database_key = 0
$("#chest_key_check").on('click', function() {
    if (leg_database_key == $("#chest_leg_key").val()) {
        window.location.href = 'chest.html';
    } else {
        alert('輸入錯誤喔~~有預約嗎?');
    }

});

$('leg.html,bottomBody.html,chest.html').ready(function() {
    val = 10 * 1000;
    selectedDate = new Date().valueOf() + val;
    $('.left_time').countdown(selectedDate, function(event) {
        $(this).html(event.strftime('%M:%S'))
    });
    $('.left_time').on('finish.countdown', function() {
        alert('時間到');
        window.location.href = 'page1.html';
    });
});