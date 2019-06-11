var firebaseConfig = {
    apiKey: "AIzaSyBZhnI2gpyT2H55z70QcAf6ffNYacPil38",
    authDomain: "weblab-d72de.firebaseapp.com",
    databaseURL: "https://weblab-d72de.firebaseio.com",
    projectId: "weblab-d72de",
    storageBucket: "",
    messagingSenderId: "587284098249",
    appId: "1:587284098249:web:d52fad367efb270c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


var db = firebase.firestore();
var reservationRef = db.collection("reservation");
var chestRef = db.collection("reservation").doc("chestRef");
var legRef = db.collection("reservation").doc("legRef");
var bottomRef = db.collection("reservation").doc("bottomRef");
//var userID = getRandom(999999);
var userID = 77;
var flag = 0;

function init() {

    var checkID = [];
    const query = reservationRef.where('user', 'array-contains', userID);
    query.get().then(snapshot => {
        snapshot.docs.forEach(doc => {
                checkID.push(doc.id)

            })
            //console.log(checkID)
        if (checkID.indexOf("legRef") == -1) {
            console.log("No user")
        } else {
            legRef.get().then(function(doc) {
                index = doc.data().user.indexOf(userID)
                var code = doc.data().verfiycode[index]
                var timestamp = doc.data().timestamp
                var wait_time = new Date(timestamp[timestamp.length - 1].seconds * 1000);
                var hour = wait_time.getHours();
                var minutes = wait_time.getMinutes();
                $("#rand_num_pop").text(code);
                $("#rand_num_orig_1").text(code);
                $("#reserve_time_leg").text(hour + ":" + minutes)
                flag += 1
                $("#cancel_button").hide();
                $("#ansure_button").text("完成");
            })

        }
        if (checkID.indexOf("chestRef") == -1) {

        } else {

        }
        if (checkID.indexOf("bottomRef") == -1) {

        } else {

        }
    })
}
init();

function changeText(id) {
    id.innerHTML = "完成";
};


var flag = 0;
$("#ansure_button").on('click', function() {
    if (flag == 0) {
        checkUserReservation(userID, "legRef").then(function(check) {
                if (check == false) {
                    $("#cancel_button").hide();
                    var random = getRandom(9999);
                    $("#rand_num_pop").text(random);
                    $("#rand_num_orig_1").text(random)
                    storedata(userID, "leg", random).then(function(wait_time) {
                        $("#reserve_time_leg").text(wait_time)
                    })
                    flag += 1;
                } else {

                    //console.log("what the fuck say")

                }

            })
            .catch(function(err) {
                console.log('fetch failed', err);
            });
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
    key = $("#input_leg_key").val()
    checkKey(key, "leg").then(function(check) {
        if (check == true) {
            alert("成功登記!")
            window.location.href = "{{ url_for('auth.leg') }}";
        } else {

        }
    })

});

var bottom_body_database_key = 0
$("#bottom_body_key_check").on('click', function() {
    if (bottom_body_database_key == $("#input_bottom_body_key").val()) {
        window.location.href = "{{ url_for('auth.bottomBody') }}";
        //window.location.href = /auth/bottomBody;
    } else {
        alert('輸入錯誤喔~~有預約嗎?');
    }

});

var chest_database_key = 0
$("#chest_key_check").on('click', function() {
    if (leg_database_key == $("#chest_leg_key").val()) {
        window.location.href = "{{ url_for('auth.chest') }}";
        //window.location.href = /auth/chest;
    } else {
        alert('輸入錯誤喔~~有預約嗎?');
    }

});

$('auth.leg,auth.bottomBody,auth.chest').ready(function() {
    //window.open(' https://test-72def.firebaseapp.com?userId=' + userID, '通知', config = 'height=100,width=100');
    val = 2 * 1000;
    selectedDate = new Date().valueOf() + val;
    $('.left_time').countdown(selectedDate, function(event) {

        $(this).html(event.strftime('%M:%S'))
    });
    $('.left_time').on('finish.countdown', function() {
        window.location.href = "{{ url_for('auth.page1') }}";
    });
});

function checkUserReservation(userID, equipment) {
    return new Promise(function(resolve, reject) {
        var checkID = [];
        const query = reservationRef.where('user', 'array-contains', userID);
        query.get().then(snapshot => {
            snapshot.docs.forEach(doc => {
                checkID.push(doc.id)

            })
            console.log(checkID)
            if (checkID.indexOf(equipment) == -1) {
                reservationRef.doc(equipment).get().then(function(doc) {
                    var userQueue = doc.data().user;
                    if (userQueue.length == 3) {
                        alert("超過預約人數!");
                        resolve(true)
                    } else {
                        resolve(false)
                    }

                })
            } else {
                alert("您已預約過!!!");
                resolve(true)
            }
        })
    });
}

function storedata(userID, equipment, random) {
    return new Promise(function(resolve, reject) {
        switch (equipment) {
            case "leg":
                var test;
                //var timestamp = firebase.firestore.Timestamp.fromMillis(new Date());
                legRef.get().then(function(doc) {

                    if (doc.exists) {

                        var time = doc.data().timestamp

                        if (time.length == 0) {
                            //var timestamp = firebase.firestore.Timestamp.fromMillis(new Date());
                            var timestamplocal = new Date();
                            legRef.update({
                                user: firebase.firestore.FieldValue.arrayUnion(userID),
                            });
                            legRef.update({
                                timestamp: firebase.firestore.FieldValue.arrayUnion(timestamplocal),
                            });
                            legRef.update({
                                verfiycode: firebase.firestore.FieldValue.arrayUnion(random),
                            });
                            var hour = timestamplocal.getHours();
                            var minute = timestamplocal.getMinutes();
                            alert("您預約時間:" + hour + ":" + minute);
                            resolve(hour + ":" + minute)
                        } else {
                            var lastTime = new Date(time[time.length - 1].seconds * 1000 + 600000);
                            var hour = lastTime.getHours();
                            var minute = lastTime.getMinutes();
                            alert("您預約時間:" + hour + ":" + minute);
                            legRef.update({
                                user: firebase.firestore.FieldValue.arrayUnion(userID),
                            });
                            legRef.update({
                                timestamp: firebase.firestore.FieldValue.arrayUnion(lastTime),
                            });
                            legRef.update({
                                verfiycode: firebase.firestore.FieldValue.arrayUnion(random),
                            });
                            resolve(hour + ":" + minute)
                        }


                    } else {
                        console.log('fuck')
                    }

                })


                /*legRef.update({
                    time: firebase.firestore.FieldValue.arrayUnion(time),
                });*/
                break;
            case "chest":
                break;
            case "bottom":
                break;
        }
    })

}

function checkKey(key, equipment) {

    return new Promise(function(resolve, reject) {
        key = Number(key)
        console.log(key)
        var checkID = [];
        const query = reservationRef.where('verfiycode', 'array-contains', key);
        query.get().then(snapshot => {
            snapshot.docs.forEach(doc => {
                checkID.push(doc.id)

            })
            console.log(checkID)
            switch (equipment) {
                case "leg":
                    if (checkID.indexOf("legRef") == -1) {
                        alert("打錯了?或是忘記預約?")
                        resolve(false)
                    } else {
                        legRef.get().then(function(doc) {
                            index = doc.data().verfiycode.indexOf(key)
                            if (index == 0) {
                                resolve(true)
                            } else {
                                legRef.get().then(function(doc) {
                                    var timestamp = doc.data().timestamp
                                    var wait_time = new Date(timestamp[index].seconds * 1000);
                                    var hour = wait_time.getHours();
                                    var minutes = wait_time.getMinutes();
                                    alert("您預約時間:" + hour + ":" + minutes)
                                    resolve(false)
                                })
                            }
                        })

                    }

                    break;
                case "chest":
                    break;
                case "bottom":
                    break;


            }
        })
    })
}