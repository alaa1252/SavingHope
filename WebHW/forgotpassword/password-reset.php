<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['email'])) {
    $email = $_POST['email'];


    $dp = new mysqli("localhost", "root", "", "security");


    $stmt = $dp->prepare("select * from members where Email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $token = bin2hex(openssl_random_pseudo_bytes(32));
        $expires = date("Y-m-d H:i:s", strtotime("+4 hour"));


        $stmt = $dp->prepare("replace INTO password_resets (Email, Token, Expires) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $email, $token, $expires);
        $stmt->execute();

        $resetLink = "http://localhost/webcourse/WebHW/forgotpassword/resetpassword.php?token=$token";

        echo "<script>alert('A reset link has been created to reset your password..);</script>";
        echo "Reset link: <a href='$resetLink'>$resetLink</a>";

    } else {
        echo "<script>alert('Email not found in our records.'); window.history.back();</script>";
    }

    $stmt->close();
    $dp->close();
}
?>

