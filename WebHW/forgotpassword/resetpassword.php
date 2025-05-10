<?php
if (isset($_GET['token'])) {
    $token = $_GET['token'];
    $dp = new mysqli("localhost", "root", "", "security");

    $stmt = $dp->prepare("SELECT Email FROM password_resets WHERE Token = ? AND Expires > NOW()");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $email = $result->fetch_assoc()['Email'];
        ?>


        <form action="updatepassword.php" method="post">
            <input type="hidden" name="email" value="<?php echo $email; ?>">
            <input type="password" name="new_password" placeholder="New Password" required>
            <button type="submit">Update Password</button>
        </form>

        <?php
    } else {
        echo "Invalid or expired token.";
    }

    $stmt->close();
    $dp->close();
}
?>