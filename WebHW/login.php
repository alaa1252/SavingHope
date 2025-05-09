<?php
if (isset($_POST['Username']) && isset($_POST['Password'])) {
    $Username = $_POST['Username'];

    $Password = sha1($_POST['Password']);

    try {
        $dp= new mysqli("localhost","root","","security");
        $qryStr="select * from members where Username='$Username' and Password='$Password'";
        $result=$dp->query($qryStr);
        if ($result->num_rows == 1) {
            // $_SESSION['Username'] = $Username;
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