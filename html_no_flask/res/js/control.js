//驗證firebase用的   這部分不用動
var firebaseConfig = {
    apiKey: "AIzaSyBZhnI2gpyT2H55z70QcAf6ffNYacPil38",
    authDomain: "weblab-d72de.firebaseapp.com",
    databaseURL: "https://weblab-d72de.firebaseio.com",
    projectId: "weblab-d72de",
    storageBucket: "",
    messagingSenderId: "587284098249",
    appId: "1:587284098249:web:d52fad367efb270c"
};

firebase.initializeApp(firebaseConfig);

// 帳戶處理
var userID = 77; //這個就是使用者id 要嘛是token 要嘛是使用者自己創的Id

// 取data用的ref
var db = firebase.firestore();
var reservationRef = db.collection("reservation");
var chestRef = db.collection("reservation").doc("chestRef");
var legRef = db.collection("reservation").doc("legRef");
var bottomRef = db.collection("reservation").doc("bottomRef");
var delayRef = db.collection("reservation").doc(userID.toString());
delayRef.set({ equipment: [] })

//變數
var flag = 0; // 確認預約過的防呆裝至
var flag1 = 0;
var flag2 = 0;

//隨時更新資料庫 超時直接刪除

function init() {

    var checkID = [];

    const dateTime = Date.now();
    const nowtime = Math.floor(dateTime / 1000);
    console.log(nowtime)



    legRef.get().then(function(doc) {
        var timestamp = doc.data().timestamp
        var code = doc.data().verfiycode
        var user = doc.data().user
        if (timestamp) {
            if (nowtime - timestamp[0].seconds > 60) {
                addDelay(user[0], "leg")
                removeData(user[0], timestamp[0], code[0], "leg")
            }
            if (nowtime - timestamp[1].seconds > 60) {
                addDelay(user[1], "leg")
                removeData(user[1], timestamp[1], code[1], "leg")
            }
            if (nowtime - timestamp[2].seconds > 60) {
                addDelay(user[2], "leg")
                removeData(user[2], timestamp[2], code[2], "leg")
            }
        }

    })

    bottomRef.get().then(function(doc) {
        var timestamp = doc.data().timestamp
        var code = doc.data().verfiycode
        var user = doc.data().user
        if (timestamp) {
            console.log(timestamp[0].seconds)

            if (nowtime - timestamp[0].seconds > 60) {
                addDelay(user[0], "bottom")
                removeData(user[0], timestamp[0], code[0], "bottom")
            }
            if (nowtime - timestamp[1].seconds > 60) {
                addDelay(user[1], "bottom")
                removeData(user[1], timestamp[1], code[1], "bottom")
            }
            if (nowtime - timestamp[2].seconds > 60) {
                addDelay(user[2], "bottom")
                removeData(user[2], timestamp[2], code[2], "bottom")
            }
        }

    })


    chestRef.get().then(function(doc) {
        var timestamp = doc.data().timestamp
        var code = doc.data().verfiycode
        var user = doc.data().user
        if (timestamp) {
            if (nowtime - timestamp[0].seconds > 60) {
                addDelay(user[0], "chest")
                removeData(user[0], timestamp[0], code[0], "chest")
            }
            if (nowtime - timestamp[1].seconds > 60) {
                addDelay(user[1], "chest")
                removeData(user[1], timestamp[1], code[1], "chest")
            }
            if (nowtime - timestamp[2].seconds > 60) {
                addDelay(user[2], "chest")
                removeData(user[2], timestamp[2], code[2], "chest")
            }

        }
    })
    delayRef.get().then(function(doc) {
        var equipment = doc.data().equipment
        if (equipment.length == 1) {
            delayRef.update({
                userID: firebase.firestore.FieldValue.arrayRemove(equipment[0]),
            }).then(function(t) {
                alert("您預約的器材:" + equipment[0] + "已逾時")
            })

        } else if (equipment.length > 1) {
            delayRef.update({
                userID: firebase.firestore.FieldValue.arrayRemove(equipment[0]),
            });
            delayRef.update({
                userID: firebase.firestore.FieldValue.arrayRemove(equipment[1]),
            }).then(function(t) {
                alert("您預約的多項器材已逾時")
            })


        }
    })

}
init();

//給page1確認使用者是否有在預約 有的話給vervify code
$('page1.html').ready(function() {
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
            console.log("No user")
        } else {
            chestRef.get().then(function(doc) {
                index = doc.data().user.indexOf(userID)
                var code = doc.data().verfiycode[index]
                var timestamp = doc.data().timestamp
                var wait_time = new Date(timestamp[timestamp.length - 1].seconds * 1000);
                var hour = wait_time.getHours();
                var minutes = wait_time.getMinutes();
                $("#rand_num_pop2").text(code);
                $("#rand_num_orig_3").text(code);
                $("#reserve_time_chest").text(hour + ":" + minutes)
                flag1 += 1
                $("#cancel_button2").hide();
                $("#ansure_button").text("完成");
            })

        }
        if (checkID.indexOf("bottomRef") == -1) {
            console.log("No user")
        } else {
            bottomRef.get().then(function(doc) {
                index = doc.data().user.indexOf(userID)
                var code = doc.data().verfiycode[index]
                var timestamp = doc.data().timestamp
                var wait_time = new Date(timestamp[timestamp.length - 1].seconds * 1000);
                var hour = wait_time.getHours();
                var minutes = wait_time.getMinutes();
                $("#rand_num_pop1").text(code);
                $("#rand_num_orig_2").text(code);
                $("#reserve_time_bottom").text(hour + ":" + minutes)
                flag2 += 1
                $("#cancel_button1").hide();
                $("#ansure_button").text("完成");
            })

        }
    })


})






//leg的預約
$("#ansure_button").on('click', function() {
    if (flag == 0) {
        flag += 1;
        checkUserReservation(userID, "legRef").then(function(check) {
                if (check == false) {
                    $("#cancel_button").hide();
                    var random = getRandom(9999);
                    $("#rand_num_pop").text(random);
                    $("#rand_num_orig_1").text(random)
                    storedata(userID, "leg", random).then(function(wait_time) {
                        $("#reserve_time_leg").text(wait_time)
                    })

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



//bottom的預約
$("#ansure_button1").on('click', function() {
    if (flag1 == 0) {
        flag1 += 1;
        checkUserReservation(userID, "bottomRef").then(function(check) {
                if (check == false) {
                    $("#cancel_button1").hide();
                    var random = getRandom(9999);
                    $("#rand_num_pop1").text(random);
                    $("#rand_num_orig_2").text(random)
                    storedata(userID, "bottom", random).then(function(wait_time) {
                        $("#reserve_time_bottom").text(wait_time)
                    })

                } else {

                    //console.log("what the fuck say")

                }

            })
            .catch(function(err) {
                console.log('fetch failed', err);
            });
    } else {
        $('#bottom_body').modal('hide');
    }
});

//big big big chest的預約
$("#ansure_button2").on('click', function() {

    if (flag2 == 0) {
        flag2 += 1;
        checkUserReservation(userID, "chestRef").then(function(check) {
                if (check == false) {
                    $("#cancel_button2").hide();
                    var random = getRandom(9999);
                    $("#rand_num_pop2").text(random);
                    $("#rand_num_orig_3").text(random)
                    storedata(userID, "chest", random).then(function(wait_time) {
                        $("#reserve_time_chest").text(wait_time)
                    })

                } else {

                    //console.log("what the fuck say")

                }

            })
            .catch(function(err) {
                console.log('fetch failed', err);
            });
    } else {
        $('#pectorals').modal('hide');
    }
});




$("#leg_key_check").on('click', function() {
    key = $("#input_leg_key").val()
    checkKey(key, "leg").then(function(check) {
        if (check == true) {
            legRef.get().then(function(doc) {

                if (doc.exists) {
                    var verID = doc.data().verfiycode[0]
                    var time = doc.data().timestamp[0]
                    console.log(verID)
                    console.log("fuck")
                    legRef.update({
                        user: firebase.firestore.FieldValue.arrayRemove(userID),
                    });
                    legRef.update({
                        timestamp: firebase.firestore.FieldValue.arrayRemove(time),
                    });
                    legRef.update({
                            verfiycode: firebase.firestore.FieldValue.arrayRemove(verID),
                        })
                        .then(function(docRef) {
                            alert("成功登記!")
                            window.location.href = 'leg.html';
                        });

                }
            })
        } else {

        }
    })
});


$("#bottom_body_key_check").on('click', function() {

    key = $("#input_bottom_body_key").val()
    checkKey(key, "bottom").then(function(check) {
        if (check == true) {
            bottomRef.get().then(function(doc) {

                if (doc.exists) {
                    var verID = doc.data().verfiycode[0]
                    var time = doc.data().timestamp[0]
                    console.log(verID)
                    console.log("fuck")
                    bottomRef.update({
                        user: firebase.firestore.FieldValue.arrayRemove(userID),
                    });
                    bottomRef.update({
                        timestamp: firebase.firestore.FieldValue.arrayRemove(time),
                    });
                    bottomRef.update({
                            verfiycode: firebase.firestore.FieldValue.arrayRemove(verID),
                        })
                        .then(function(docRef) {
                            alert("成功登記!")
                            window.location.href = 'bottomBody.html';
                        });

                }
            })
        } else {

        }
    })

});

$("#chest_key_check").on('click', function() {
    key = $("#input_chest_key").val()
    checkKey(key, "chest").then(function(check) {
        if (check == true) {


            chestRef.get().then(function(doc) {

                if (doc.exists) {
                    var verID = doc.data().verfiycode[0]
                    var time = doc.data().timestamp[0]
                    console.log(verID)
                    console.log("fuck")
                    chestRef.update({
                        user: firebase.firestore.FieldValue.arrayRemove(userID),
                    });
                    chestRef.update({
                        timestamp: firebase.firestore.FieldValue.arrayRemove(time),
                    });
                    chestRef.update({
                            verfiycode: firebase.firestore.FieldValue.arrayRemove(verID),
                        })
                        .then(function(docRef) {
                            alert("成功登記!")
                            window.location.href = 'chest.html';
                        });

                }
            })

        } else {}
    })

});


//倒數的地方 也是跳通知的地方  我先關掉 不然跟病毒一樣一直跳一直爽=.=
$('leg.html,bottomBody.html,chest.html').ready(function() {
    //window.open(' https://test-72def.firebaseapp.com?userId=' + userID, '通知', config = 'height=100,width=100');
    val = 10 * 1000;
    selectedDate = new Date().valueOf() + val;
    $('.left_time').countdown(selectedDate, function(event) {

        $(this).html(event.strftime('%M:%S'))
    });
    $('.left_time').on('finish.countdown', function() {
        alert('時間到');
        /* $.ajax({
             type: 'POST',
             url: "https://fcm.googleapis.com/fcm/send",
             headers: {
                 Authorization: 'key=' + 'AAAAEPLkz7k:APA91bE5yTF55iygNRapTTVDzm0mjOfFJOGQnspQm1sarhWOalJ2WWY21M2k_dV-lnrCeFtaZH8BBqWTseZLk2iiC-MevgPEws5FL0JcsedS3UKig-o9IlKkt6y1_OihNOWrXoWJwFi0'
             },
             contentType: 'application/json',
             dataType: 'json',
             data: JSON.stringify({ "to": "eOLehKXG9Ao:APA91bHJToli_46vXnNGYFdsncr0qva9H3mA6ZUk-EP7D9ElNvo8T8pFqLRk2oqSqDS4KffqyDnFCIitvakH-Lt6ptfk1iOsz4Hzsrgv3cGjDzqDsrfrZBI5g_BTk4VP1wqMAYNFT1v6", "notification": { "title": "Test", "body": "test123", "icon": "firebase-logo.png" } }),
             success: function(response) {
                 console.log(response);
             },
             error: function(xhr, status, error) {
                 console.log(xhr.error);
             }
         });*/
        window.location.href = 'page1.html';
    });
});

//小function
function changeText(id) {
    id.innerHTML = "完成";
};
//隨機亂數
function getRandom(x) {
    return Math.floor(Math.random() * x) + 1;
};
//是否預約過
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

//存data
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
                chestRef.get().then(function(doc) {

                    if (doc.exists) {

                        var time = doc.data().timestamp

                        if (time.length == 0) {
                            //var timestamp = firebase.firestore.Timestamp.fromMillis(new Date());
                            var timestamplocal = new Date();
                            chestRef.update({
                                user: firebase.firestore.FieldValue.arrayUnion(userID),
                            });
                            chestRef.update({
                                timestamp: firebase.firestore.FieldValue.arrayUnion(timestamplocal),
                            });
                            chestRef.update({
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
                            chestRef.update({
                                user: firebase.firestore.FieldValue.arrayUnion(userID),
                            });
                            chestRef.update({
                                timestamp: firebase.firestore.FieldValue.arrayUnion(lastTime),
                            });
                            chestRef.update({
                                verfiycode: firebase.firestore.FieldValue.arrayUnion(random),
                            });
                            resolve(hour + ":" + minute)
                        }


                    } else {
                        console.log('fuck')
                    }

                })

                break;
            case "bottom":


                bottomRef.get().then(function(doc) {

                    if (doc.exists) {

                        var time = doc.data().timestamp

                        if (time.length == 0) {
                            //var timestamp = firebase.firestore.Timestamp.fromMillis(new Date());
                            var timestamplocal = new Date();
                            bottomRef.update({
                                user: firebase.firestore.FieldValue.arrayUnion(userID),
                            });
                            bottomRef.update({
                                timestamp: firebase.firestore.FieldValue.arrayUnion(timestamplocal),
                            });
                            bottomRef.update({
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
                            bottomRef.update({
                                user: firebase.firestore.FieldValue.arrayUnion(userID),
                            });
                            bottomRef.update({
                                timestamp: firebase.firestore.FieldValue.arrayUnion(lastTime),
                            });
                            bottomRef.update({
                                verfiycode: firebase.firestore.FieldValue.arrayUnion(random),
                            });
                            resolve(hour + ":" + minute)
                        }


                    } else {
                        console.log('fuck')
                    }

                })
                break;
        }
    })

}
// 確認驗證碼對不對
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

                    if (checkID.indexOf("chestRef") == -1) {
                        alert("打錯了?或是忘記預約?")
                        resolve(false)
                    } else {
                        chestRef.get().then(function(doc) {
                            index = doc.data().verfiycode.indexOf(key)
                            if (index == 0) {
                                resolve(true)
                            } else {
                                chestRef.get().then(function(doc) {
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
                case "bottom":
                    if (checkID.indexOf("bottomRef") == -1) {
                        alert("打錯了?或是忘記預約?")
                        resolve(false)
                    } else {
                        bottomRef.get().then(function(doc) {
                            index = doc.data().verfiycode.indexOf(key)
                            if (index == 0) {
                                resolve(true)
                            } else {
                                bottomRef.get().then(function(doc) {
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


            }
        })
    })
}



function doPost(e) {

    var param = e.parameter;
    var userToken = param.userToken;
    var userId = param.userId

    var replyMsg = 'userToken :' + userToken + ' userId :' + userId;

    return ContentService.createTextOutput(replyMsg);

}

function removeData(userID, time, verID, equipment) {
    switch (equipment) {
        case "leg":
            legRef.update({
                user: firebase.firestore.FieldValue.arrayRemove(userID),
            });
            legRef.update({
                timestamp: firebase.firestore.FieldValue.arrayRemove(time),
            });
            legRef.update({
                verfiycode: firebase.firestore.FieldValue.arrayRemove(verID),
            })

            break;
        case "bottom":
            bottomRef.update({
                user: firebase.firestore.FieldValue.arrayRemove(userID),
            });
            bottomRef.update({
                timestamp: firebase.firestore.FieldValue.arrayRemove(time),
            });
            bottomRef.update({
                verfiycode: firebase.firestore.FieldValue.arrayRemove(verID),
            })
            break;
        case "chest":
            chestRef.update({
                user: firebase.firestore.FieldValue.arrayRemove(userID),
            });
            chestRef.update({
                timestamp: firebase.firestore.FieldValue.arrayRemove(time),
            });
            chestRef.update({
                verfiycode: firebase.firestore.FieldValue.arrayRemove(verID),
            })
            break;


    }


}

function addDelay(userID, equipment) {
    switch (equipment) {
        case "leg":
            delayRef.update({
                equipment: firebase.firestore.FieldValue.arrayUnion("腿部伸張機"),
            });

            break;
        case "bottom":
            delayRef.update({
                equipment: firebase.firestore.FieldValue.arrayUnion("深蹲架"),
            });

            break;
        case "chest":
            delayRef.update({
                equipment: firebase.firestore.FieldValue.arrayUnion("握推架"),
            });
            break;
    }
}