$(document).ready(function () {
    "use strict";

    // Validación y envío del formulario de contacto
    $("form.contactForm").submit(function (e) {
        e.preventDefault(); // Evita el envío predeterminado del formulario

        var form = $(this);
        var hasError = false;
        var emailExp = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

        // Validar inputs y textarea
        form.find("input, textarea").each(function () {
            var input = $(this);
            var rule = input.attr("data-rule");
            var inputError = false;

            if (rule !== undefined) {
                var pos = rule.indexOf(":");
                var exp = pos >= 0 ? rule.substr(pos + 1) : "";
                rule = pos >= 0 ? rule.substr(0, pos) : rule;

                switch (rule) {
                    case "required":
                        if (input.val().trim() === "") inputError = true;
                        break;

                    case "minlen":
                        if (input.val().length < parseInt(exp)) inputError = true;
                        break;

                    case "email":
                        if (!emailExp.test(input.val())) inputError = true;
                        break;

                    case "checked":
                        if (!input.prop("checked")) inputError = true;
                        break;

                    case "regexp":
                        var regex = new RegExp(exp);
                        if (!regex.test(input.val())) inputError = true;
                        break;
                }

                if (inputError) {
                    hasError = true;
                    input.next(".validation").html(input.attr("data-msg") || "Entrada incorrecta").show();
                } else {
                    input.next(".validation").hide();
                }
            }
        });

        if (hasError) return false; // Si hay errores, se detiene el envío

        // Enviar formulario mediante AJAX
        $.ajax({
            type: "POST",
            url: "contactform/contactform.php",
            data: form.serialize(),
            success: function (response) {
                if (response.trim() === "OK") {
                    $("#sendmessage").addClass("show").html("Tu mensaje ha sido enviado. ¡Gracias!").show();
                    $("#errormessage").removeClass("show").hide();
                    form.find("input, textarea").val(""); // Limpiar el formulario
                } else {
                    $("#sendmessage").removeClass("show").hide();
                    $("#errormessage").addClass("show").html(response).show();
                }
            },
            error: function () {
                $("#sendmessage").removeClass("show").hide();
                $("#errormessage").addClass("show").html("Hubo un error en el servidor. Inténtalo nuevamente.").show();
            }
        });

        return false;
    });
});
