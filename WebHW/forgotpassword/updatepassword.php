<?php
if (isset($_POST['email']) && isset($_POST['new_password'])) {
    $email = $_POST['email'];
    $newPassword = sha1($_POST['new_password']);

    $dp = new mysqli("localhost", "root", "", "security");

    $stmt = $dp->prepare("UPDATE members SET Password = ? WHERE Email = ?");
    $stmt->bind_param("ss", $newPassword, $email);

    if ($stmt->execute()) {
        $dp->query("DELETE FROM password_resets WHERE Email = '$email'");

        echo "<script>alert('Password updated successfully!'); window.location.href='http://localhost/webcourse/WebHW/login.html';</script>";
    } else {
        echo "Error updating password.";
    }

    $stmt->close();
    $dp->close();
}
?>