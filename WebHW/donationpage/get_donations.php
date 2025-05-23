<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "security";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $sql = "SELECT * FROM donations WHERE status = 'active'";
    $result = $conn->query($sql);

    $donations = [];
    
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $row['formatted_price'] = '$' . number_format($row['price'], 2);
            
            $donations[] = $row;
        }
        
        echo json_encode(['success' => true, 'data' => $donations]);
    } else {
        echo json_encode(['success' => true, 'data' => []]);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$conn->close();
?>