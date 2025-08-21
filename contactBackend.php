<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // PHPMailer + Dotenv

header("Content-Type: application/json");

// Load .env variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $clientName    = htmlspecialchars(trim($_POST['username'] ?? ''));
    $clientEmail   = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $clientMessage = htmlspecialchars(trim($_POST['msg'] ?? ''));

    if (empty($clientName) || empty($clientEmail) || empty($clientMessage)) {
        echo json_encode(["success" => false, "message" => "All fields are required ❌"]);
        exit;
    }

    if (!filter_var($clientEmail, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["success" => false, "message" => "Invalid email address ❌"]);
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = $_ENV['SMTP_USER'];
        $mail->Password   = $_ENV['SMTP_PASS'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        $mail->setFrom($clientEmail, $clientName);
        $mail->addAddress($_ENV['RECEIVER_EMAIL'], $_ENV['RECEIVER_NAME']);
        $mail->addReplyTo($clientEmail, $clientName);

        $mail->isHTML(true);
        $mail->Subject = "📩 New Portfolio Contact from $clientName";
        $mail->Body    = "
            <h3>You received a new message via your portfolio contact form</h3>
            <p><b>Name:</b> {$clientName}</p>
            <p><b>Email:</b> {$clientEmail}</p>
            <p><b>Message:</b><br>{$clientMessage}</p>
        ";
        $mail->AltBody = "Name: $clientName\nEmail: $clientEmail\nMessage:\n$clientMessage";

        $mail->send();
        echo json_encode(["success" => true, "message" => "Message sent successfully ✅"]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Failed to send message ❌", "error" => $mail->ErrorInfo]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request ❌"]);
}
