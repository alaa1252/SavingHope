<?php
session_start();

header('Content-Type: application/json');


if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    echo json_encode([
        'success' => false,
        'error' => 'User not logged in'
    ]);
    exit();
}


$member_id = isset($_SESSION['member_id']) ? $_SESSION['member_id'] : null;
if (!$member_id) {
    echo json_encode([
        'success' => false,
        'error' => 'Member ID not found in session'
    ]);
    exit();
}


$input = json_decode(file_get_contents('php://input'), true);
$volunteer_id = isset($input['volunteer_id']) ? $input['volunteer_id'] : null;

if (!$volunteer_id) {
    echo json_encode([
        'success' => false,
        'error' => 'Missing volunteer ID'
    ]);
    exit();
}

$servername = "localhost";
$db_username = "root";
$password = "";
$dbname = "security";

$conn = new mysqli($servername, $db_username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode([
        'success' => false,
        'error' => "DB connection failed: " . $conn->connect_error
    ]);
    exit();
}

$stmt = $conn->prepare("SELECT COUNT(*) FROM volunteer_member WHERE member_id = ? AND volunteer_id = ?");
$stmt->bind_param("ii", $member_id, $volunteer_id);
$stmt->execute();
$stmt->bind_result($count);
$stmt->fetch();
$stmt->close();

if ($count > 0) {
    echo json_encode([
        'success' => false,
        'error' => 'You have already joined this volunteer group.'
    ]);
    $conn->close();
    exit();
}

$stmt = $conn->prepare("INSERT INTO volunteer_member (member_id, volunteer_id) VALUES (?, ?)");
$stmt->bind_param("ii", $member_id, $volunteer_id);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Successfully joined volunteer group.'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Failed to join volunteer group: ' . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>