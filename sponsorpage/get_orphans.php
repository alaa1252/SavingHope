<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "savinghope";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $sql = "SELECT * FROM orphans WHERE status = 'active'";
    $result = $conn->query($sql);

    $orphans = [];
    
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $sponsorshipPercentage = isset($row['sponsorship_amount']) && isset($row['sponsorship_goal']) ? ($row['sponsorship_amount'] / $row['sponsorship_goal']) * 100 : 0;
            
            $sponsorshipPercentage = min(round($sponsorshipPercentage, 2), 100);
            
            $row['sponsorship_percentage'] = $sponsorshipPercentage;
            
            $orphans[] = $row;
        }
        
        echo json_encode(['success' => true, 'data' => $orphans]);
    } else {
        echo json_encode(['success' => true, 'data' => []]);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$conn->close();
?>