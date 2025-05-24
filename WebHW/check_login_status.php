<?php
session_start();

$origin = 'http://localhost';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: $origin");
header('Access-Control-Allow-Credentials: true');
$response = [
    'logged_in' => false,
    'user_info' => null
];

if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    $response['logged_in'] = true;
    $response['user_info'] = [
        'username' => $_SESSION['username'],
        'full_name' => $_SESSION['full_name'],
        'email' => $_SESSION['email']
    ];
}

echo json_encode($response);
?>