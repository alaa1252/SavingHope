<?php
session_start();
if (isset($_POST['Username']) && isset($_POST['Password'])) {
    $Username = $_POST['Username'];
    $Password = sha1($_POST['Password']);

    try {
        $dp= new mysqli("localhost","root","","security");
        $qryStr="select * from members where Username='$Username' and Password='$Password'";
        $result=$dp->query($qryStr);
        if ($result->num_rows == 1) {
            // GET USER DATA
            $user_data = $result->fetch_assoc();

            // CREATE SESSION - STORE USER INFORMATION
            $_SESSION['logged_in'] = true;
            $_SESSION['username'] = $user_data['Username'];
            $_SESSION['full_name'] = $user_data['FullName'];
            $_SESSION['email'] = $user_data['Email'];
            $_SESSION['phone'] = $user_data['PhoneNumber'];
            $_SESSION['member_id'] = $user_data['Username'];
            $_SESSION['login_time'] = time();


            header("Location: dashboard.html");
            exit();
        } else {
            echo "<script>alert('Incorrect username or password.'); window.location.href = 'login.html';</script>";
        }


        $dp->close();

    }catch(Exception $e){

    }

}



?>