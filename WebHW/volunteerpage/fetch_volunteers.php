<?php
header('Content-Type: application/json');

$mysqli = new mysqli("localhost", "root", "", "security");
if ($mysqli->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

$sql = "SELECT id, Title, Description, IconClass FROM volunteer";
$result = $mysqli->query($sql);

$volunteers = [];
while ($row = $result->fetch_assoc()) {
    $volunteers[] = $row;
}

echo json_encode($volunteers);
$mysqli->close();
?>