
<?php
session_start();

function checkLogin() {
    if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
        header("Location: login.html");
        exit();
    }
}

function isLoggedIn() {
    return isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;
}

function getUserInfo() {
    if (isLoggedIn()) {
        return [
            'username' => $_SESSION['username'],
            'full_name' => $_SESSION['full_name'],
            'email' => $_SESSION['email'],
            'phone' => $_SESSION['phone']
        ];
    }
    return null;
}
?>