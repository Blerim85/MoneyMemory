$("#confirm_modal_").on("show.bs.modal", function(e) {
    $(this).find(".to_select_").attr("href", e.relatedTarget.href);
});

$(document).ready(function() {
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    var today = year + "-" + month + "-" + day;       
    $("#table_date").attr("value", today);
});

$('#download_monat, #download_jahr').click(function() {
    $('#exampleModal-month, #exampleModal-year').modal('hide');
});

function loadnumbers() {
    let $total, $ein, $aus, $taxein, $taxaus;

    if ($total && $ein && $taxein === undefined || $total && $aus && $taxaus === undefined) {
        console.log("Money Memory");
    } else {
    $total = $("#print_total").html().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    $("#print_total").empty().append($total);
    $ein = $("#print_ein").html().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    $("#print_ein").empty().append($ein);
    $taxein = $("#print_taxein").html().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    $("#print_taxein").empty().append($taxein);
    $aus = $("#print_aus").html().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    $("#print_aus").empty().append($aus);
    $taxaus = $("#print_taxaus").html().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    $("#print_taxaus").empty().append($taxaus);
    }
}

