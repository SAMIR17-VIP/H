<?php 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener datos del formulario y sanitizarlos
    $name = isset($_POST['name']) ? htmlspecialchars(trim($_POST['name'])) : '';
    $mail = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
    $subject = isset($_POST['subject']) ? htmlspecialchars(trim($_POST['subject'])) : '';
    $message = isset($_POST['message']) ? htmlspecialchars(trim($_POST['message'])) : '';

    // Validar que los campos no estén vacíos
    if (empty($name) || empty($mail) || empty($subject) || empty($message)) {
        echo "Todos los campos son obligatorios.";
        exit;
    }

    // Validar formato de correo
    if (!filter_var($mail, FILTER_VALIDATE_EMAIL)) {
        echo "El correo no es válido.";
        exit;
    }

    // Configurar destinatario y asunto del correo
    $para = 'consultas@servitecflhuaraz.com';
    $asunto = "Mensaje de $name - $subject";

    // Construir el mensaje
    $mensaje = "Este mensaje fue enviado por: $name \r\n";
    $mensaje .= "E-mail: $mail \r\n";
    $mensaje .= "Asunto: $subject \r\n";
    $mensaje .= "Mensaje: \r\n$message \r\n";
    $mensaje .= "Enviado el: " . date('d/m/Y H:i:s') . "\r\n";

    // Configurar encabezados
    $header = "From: $mail\r\n";
    $header .= "Reply-To: $mail\r\n";
    $header .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $header .= "MIME-Version: 1.0\r\n";
    $header .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // Enviar el correo
    if (mail($para, $asunto, $mensaje, $header)) {
        echo "OK"; // Esto es lo que espera el JS para mostrar el mensaje de éxito
    } else {
        echo "Error al enviar el mensaje. Inténtalo de nuevo.";
    }
} else {
    echo "Acceso no permitido.";
}
?>
