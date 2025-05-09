<?php
if (isset($_POST['Username']) && isset($_POST['Password'])) {
    $Username = $_POST['Username'];
    $Password = sha1($_POST['Password']);
    $FullName = $_POST['Fullname'];
    $Email = $_POST['Email'];

    try {
        $dp = new mysqli("localhost", "root", "", "security");
        $qryStr = "select * from members where Username = ? OR Email = ?";
        $stmt = $dp->prepare($qryStr);
        $stmt->bind_param("ss", $Username, $Email);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            echo "<script>alert('Username or Email already taken. Please try again.'); window.history.back();</script>";
        } else {
            $insertQuery = "INSERT INTO members (FullName, Email, Username, Password) VALUES (?, ?, ?, ?)";
            $stmt = $dp->prepare($insertQuery);
            $stmt->bind_param("ssss", $FullName, $Email, $Username, $Password);

            if ($stmt->execute()) {
                echo "<script>alert('Registration successful! You may Login Now!'); window.location.href='login.html';</script>";
            } else {
                echo "<script>alert('Error while registering. Please try again.'); window.location.href='signup.html';</script>";
            }

        }
        $stmt->close();
        $dp->close();
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage();
    }
}

    ?>
