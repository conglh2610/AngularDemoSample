
$("#btnCreateNew").on('click', function (e) {

    var frm = $('#frmNewCountry');
    if (frm.valid()) {
        $.ajax({
            url: '/Country/Create',
            type: 'POST',
            data: frm.serialize(),
            success: function (data) {
                $('#modalArea').modal('hide');
                Reload();
            }
        });
    }
});

$("#btnSave").on('click', function (e) {

    var frm = $('#frmEditCountry');
    if (frm.valid()) {
        $.ajax({
            url: '/Country/Edit',
            type: 'POST',
            data: frm.serialize(),
            success: function (data) {
                $('#modalArea').modal('hide');
                Reload();
            }
        });
    }
});



function Reload() {
    $.ajax({
        url: '/Country/GetList',
        type: 'GET',
        success: function (data) {
            $("#lstCountry").html(data);
        }
    });
}