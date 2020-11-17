function address()
{
    a = $("#patients option:selected").text();

    b = a.split(" : ");
    $("#wa").val(b[0].toLowerCase());
    $("#dname").val(b[1]);
}
