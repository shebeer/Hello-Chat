//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size

var MESSAGE_TO;
var MESSGAE_LIST_PAGE = 1;

$(function () {
    var height;
    $(window).bind("load resize", function () {
        topOffset = 50;
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
        chat_height = height - (height * 28 / 100)
        $("#chat_window").css("min-height", (chat_height) + "px");
    });


    var url = window.location;
    var element = $('ul.nav a').filter(function () {
        return this.href == url || url.href.indexOf(this.href) == 0;
    }).addClass('active').parent().parent().addClass('in').parent();
    if (element.is('li')) {
        element.addClass('active');
    }
});

function getDateTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (month.toString().length == 1) {
        var month = '0' + month;
    }
    if (day.toString().length == 1) {
        var day = '0' + day;
    }
    if (hour.toString().length == 1) {
        var hour = '0' + hour;
    }
    if (minute.toString().length == 1) {
        var minute = '0' + minute;
    }
    if (second.toString().length == 1) {
        var second = '0' + second;
    }
    var dateTime = hour + ':' + minute + '  ' + day + ', ' + month + ' ' + year;
    return dateTime;
}

function fetch_friends(user_id) {
    var ajaxRequest = $.ajax({
        'url': "/api/v1/fetch/friends/" + user_id + "/",
        'type': 'get',
        'dataType': 'json',
        // by default async is true, this is FYI
        'async': true
    });
    // callback handler that will be called on success
    ajaxRequest.done(function (response) {
        console.log(response)
        $('.friends_list').empty();
        online_users = response.online_users;
        offline_users = response.offline_users;

        if (online_users.length <1 && offline_users.length <1){
            $('.friends_list').append('<li data-id="0" data-name="you">' +
                '<a href="#">No friends are joined, Share HelloChat with your friends ' +
                '&nbsp;</a></li>')
        }
        $.each(online_users, function (index, elem) {
            if (elem.new_msg_count > 0) {
                $('.friends_list').append('<li data-id="' + elem.id + '" data-name="' + elem.username + '">' +
                '<a href="#">' + elem.username + '  <i class="fa fa-user fa-fw" style="color:#07CE07"></i>' +
                '&nbsp;<span class="badge" style="margin-left=2%">' + elem.new_msg_count + '  </span> </a></li>')
            } else {
                $('.friends_list').append('<li data-id="' + elem.id + '" data-name="' + elem.username + '">' +
                '<a href="#">' + elem.username + '  <i class="fa fa-user fa-fw" style="color:#07CE07"></i></a></li>')
            }

            $('#chat_icon[data-id="' + elem.id + '"]').css("color", "#07CE07")
        });
        $.each(offline_users, function (index, elem) {
            if (elem.new_msg_count > 0) {
                $('.friends_list').append('<li data-id="' + elem.id + '" data-name="' + elem.username + '">' +
                '<a href="#">' + elem.username + '  <i class="fa fa-user fa-fw" style="color:grey"></i> ' +
                ' &nbsp;<span class="badge" style="margin-left=2%">' + elem.new_msg_count + '  </span> </a></li>')
            } else {
                $('.friends_list').append('<li data-id="' + elem.id + '" data-name="' + elem.username + '">' +
                '<a href="#">' + elem.username + '  <i class="fa fa-user fa-fw" style="color:grey"></i></a></li>')
            }
            $('#chat_icon[data-id="' + elem.id + '"]').css("color", "grey")

        });

        $("#side-menu li").on("click", function () {
            MESSAGE_TO = $(this).attr("data-id");
            console.log($(this).attr("data-id"))
            $('#chat_person').text($(this).attr("data-name"))
            $('#chat_icon').attr("data-id", $(this).attr("data-id"))
            $('.chat-panel').show();
            from_id = MESSAGE_TO
            MESSGAE_LIST_PAGE = 1
            fetch_prev_messages(from_id, MESSGAE_LIST_PAGE);
        });
    });
    // callback handler that will be called on failure
    ajaxRequest.fail(function (error) {
        // log the error to the console
        console.error("The following error occured: " + error);
    })
}

function fetch_prev_messages(msg_from, page) {

    if (page == 1) {
        $(".chat").empty();
    }
    console.log("fetching old messages")
    var ajaxRequest = $.ajax({
        'url': "/api/v1/fetch/old/messages/from/" + msg_from + "/page/" + page + "/",
        'type': 'get',
        'dataType': 'json',
        // by default async is true, this is FYI
        'async': true
    });
    // callback handler that will be called on success
    ajaxRequest.done(function (response) {
        console.log(response);
        msg = ''

        $.each(response, function (index, elem) {

            if (msg_from == elem.from_id) {

                msg += '<li class="right clearfix">\
                                    <span class="chat-img pull-right">\
            <div class="comment_picture"><div class="comment_char msg_received">' + elem.from_name.charAt(0).toUpperCase() + '</div></div>\
                                    </span>\
                        <div class="chat-body clearfix">\
                            <div class="header">\
                            <small class=" text-muted"><i class="fa fa-clock-o fa-fw"></i>' + elem.time + '</small>\
                            <strong class="pull-right primary-font">' + elem.from_name + '</strong>\
                            </div>\
                            <p class="pull-right">' + elem.message + '</p>\
                        </div>\
                    </li>'
            } else {
                msg += '<li class="left clearfix">\
                                    <span class="chat-img pull-left">\
                                        <div class="comment_picture"><div class="comment_char">' + elem.from_name.charAt(0).toUpperCase() + '</div></div>\
                                    </span>\
                        <div class="chat-body clearfix">\
                            <div class="header">\
                            <strong class="primary-font">' + elem.from_name + '</strong>\
                                <small class="pull-right text-muted">\
                                    <i class="fa fa-clock-o fa-fw"></i>' + elem.time + '\
                                </small>\
                            </div>\
                            <p  class="">' + elem.message + '</p>\
                        </div>\
                    </li>'
            }
        });
        $('.chat').prepend(msg)
        if (msg.length > 0) {
            $('.chat').prepend('<li class="load_prev_li left clearfix text-center">' +
            'Load Previous Messages</li>');
        } else {
            $('.chat').prepend('<li class="left clearfix text-center">' +
            'No Previous Messages</li>');
        }
        if (page == 1)
            $("#chat_window").scrollTop($("#chat_window")[0].scrollHeight);

        $(".load_prev_li").on("click", function () {
            console.log('fetching old fetch_new_messages');
            $(this).remove();
            MESSGAE_LIST_PAGE += 1;
            fetch_prev_messages(MESSAGE_TO, MESSGAE_LIST_PAGE)
        });

    });
    // callback handler that will be called on failure
    ajaxRequest.fail(function (error) {
        // log the error to the console
        console.error("The following error occured: " + error);
    });
}

function fetch_new_messages(user_id) {
    var ajaxRequest = $.ajax({
        'url': "/api/v1/fetch/new/messages/from/" + MESSAGE_TO + "/to/" + user_id + "/",
        'type': 'get',
        'dataType': 'json',
        // by default async is true, this is FYI
        'async': true
    });
    // callback handler that will be called on success
    ajaxRequest.done(function (response) {
        console.log(response)
        $.each(response, function (index, elem) {
            $('.chat').append('<li class="right clearfix">\
                                    <span class="chat-img pull-right">\
            <div class="comment_picture"><div class="comment_char msg_received">' + elem.from_name.charAt(0).toUpperCase() + '</div></div>\
                                    </span>\
                        <div class="chat-body clearfix">\
                            <div class="header">\
                            <small class=" text-muted"><i class="fa fa-clock-o fa-fw"></i>' + elem.time + '</small>\
                            <strong class="pull-right primary-font">' + elem.from_name + '</strong>\
                            </div>\
                            <p class="pull-right">' + elem.message + '</p>\
                        </div>\
                    </li>');

            $("#chat_window").scrollTop($("#chat_window")[0].scrollHeight);
        });

    });
    // callback handler that will be called on failure
    ajaxRequest.fail(function (error) {
        // log the error to the console
        console.error("The following error occured: " + error);
    });
}

function post_message(user_id, user_name) {

    data = {
        'to': MESSAGE_TO,
        'message': $("#msg-input").val()
    };

    if (user_id == MESSAGE_TO) {
        $('.chat').append('<li class="left clearfix">\
                                    <span class="chat-img pull-left">\
                                        <div class="comment_picture"><div class="comment_char">' + user_name.charAt(0).toUpperCase() + '</div></div>\
                                    </span>\
                        <div class="chat-body clearfix">\
                            <div class="header">\
                            <strong class="primary-font">' + user_name + '</strong>\
                                <small class="pull-right text-muted">\
                                    <i class="fa fa-clock-o fa-fw"></i>' + getDateTime() + '\
                                </small>\
                            </div>\
                            <p  class="">' + data["message"] + '</p>\
                        </div>\
                    </li>');

        $('.chat').append('<li class="right clearfix">\
                                    <span class="chat-img pull-right">\
            <div class="comment_picture"><div class="comment_char msg_received">CB</div></div>\
                                    </span>\
                        <div class="chat-body clearfix">\
                            <div class="header">\
                            <small class=" text-muted"><i class="fa fa-clock-o fa-fw"></i>' + getDateTime() + '</small>\
                            <strong class="pull-right primary-font">ChatBot</strong>\
                            </div>\
                            <p class="pull-right">Hi ' + user_name + ', I am too busy now :( I cant talk you now, \n Please check friends list available in left panel, and enjoy with your friends </p>\
                        </div>\
                    </li>');

        $("#msg-input").val('');
        $("#chat_window").scrollTop($("#chat_window")[0].scrollHeight);


    }


    if (data['message'].length > 0 && user_id != MESSAGE_TO) {

        console.log(data)
        var ajaxRequest = $.ajax({
            'url': "/api/v1/post/new/message/",
            'type': 'post',
            'data': data,
            'dataType': 'json',
            // by default async is true, this is FYI
            'async': true
        });
        // callback handler that will be called on success
        ajaxRequest.done(function (response) {
            console.log(response)
            $('.chat').append('<li class="left clearfix">\
                                    <span class="chat-img pull-left">\
                                        <div class="comment_picture"><div class="comment_char">' + response.from_name.charAt(0).toUpperCase() + '</div></div>\
                                    </span>\
                        <div class="chat-body clearfix">\
                            <div class="header">\
                            <strong class="primary-font">' + response.from_name + '</strong>\
                                <small class="pull-right text-muted">\
                                    <i class="fa fa-clock-o fa-fw"></i>' + response.time + '\
                                </small>\
                            </div>\
                            <p  class="">' + response.message + '</p>\
                        </div>\
                    </li>');

            $("#msg-input").val('');
            $("#chat_window").scrollTop($("#chat_window")[0].scrollHeight);


        });
        // callback handler that will be called on failure
        ajaxRequest.fail(function (error) {
            // log the error to the console
            console.error("The following error occured: " + error);
        });

    }
}

$("#clear_window").on("click", function () {
    $(".chat").empty();
});



