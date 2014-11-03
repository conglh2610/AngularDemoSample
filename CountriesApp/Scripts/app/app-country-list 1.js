$("#btnCreate").on('click', function (e) {
    ///$('#progress').show();
    $.ajax({
        url: '/Country/Create',
        type: 'GET',
        success: function (data) {
            // $("#progress").hide();
            $("#modalArea").html(data);
            $('#modalArea').modal('toggle')
        }
    });
});


function EditCountry(Id) {

    $.ajax({
        url: '/Country/Edit',
        type: 'GET',
        data: { Id: Id },
        success: function (data) {

            $("#modalArea").html(data);
            $('#modalArea').modal('toggle')
        }
    });
}

function DeleteCountry(Id) {

    if (confirm('Do you want to delete?')) {
        $.ajax({
            url: '/Country/Delete',
            type: 'POST',
            data: { Id: Id },
            success: function (data) {
                if (data) {
                    Reload();
                }
                else {
                    alert(' Cannot delete this country');
                }
            }
        });
    }
}

function Reload() {
    $.ajax({
        url: '/Country/GetList',
        type: 'GET',
        success: function (data) {
            $("#lstCountry").html(data);
        }
    });
}



var listElement = $('#lstCountry');
var perPage = 2;
var numItems = listElement.children().size();
var numPages = Math.ceil(numItems / perPage);

$('.pager').data("curr", 0);

var curr = 0;
while (numPages > curr) {
    $('<li><a href="#" class="page_link">' + (curr + 1) + '</a></li>').appendTo('.pager');
    curr++;
}

$('.pager .page_link:first').addClass('active');

listElement.children().css('display', 'none');
listElement.children().slice(0, perPage).css('display', 'block');

$('.pager li a').click(function () {
    var clickedPage = $(this).html().valueOf() - 1;
    goTo(clickedPage, perPage);
});

function previous() {
    var goToPage = parseInt($('.pager').data("curr")) - 1;
    if ($('.active').prev('.page_link').length == true) {
        goTo(goToPage);
    }
}

function next() {
    goToPage = parseInt($('.pager').data("curr")) + 1;
    if ($('.active_page').next('.page_link').length == true) {
        goTo(goToPage);
    }
}

function goTo(page) {

    var startAt = page * perPage,
      endOn = startAt + perPage;

    listElement.children().css('display', 'none').slice(startAt, endOn).css('display', 'block');
    $('.pager').attr("curr", page);
}