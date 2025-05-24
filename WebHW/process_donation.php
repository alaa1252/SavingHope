<?php
session_start();

$origin = 'http://localhost';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: $origin");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');


if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    echo json_encode([
        'success' => false,
        'error' => 'User not logged in'
    ]);
    exit();
}


$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode([
        'success' => false,
        'error' => 'Invalid input data'
    ]);
    exit();
}

$donation_id = isset($input['donation_id']) ? $input['donation_id'] : null;
$donation_type = isset($input['donation_type']) ? $input['donation_type'] : '';
$amount = isset($input['amount']) ? $input['amount'] : 0;

if (!$donation_id || !$amount) {
    echo json_encode([
        'success' => false,
        'error' => 'Missing required donation information'
    ]);
    exit();
}

try {

    $servername = "localhost";
    $db_username = "root";
    $password = "";
    $dbname = "security";
    
    $conn = new mysqli($servername, $db_username, $password, $dbname);
    
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    

    $username = $_SESSION['username'];
    

    $sql = "INSERT INTO user_donations (username, donation_id, donation_type, amount, donation_date, status) 
            VALUES (?, ?, 'General Donation', ?, CURDATE(), 'Completed')";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sid", $username, $donation_id, $amount);
    
    if ($stmt->execute()) {

        $new_donation_id = $conn->insert_id;
        
        echo json_encode([
            'success' => true,
            'message' => 'Donation processed successfully',
            'donation_id' => $new_donation_id,
            'amount' => $amount,
            'username' => $username
        ]);
    } else {
        throw new Exception("Failed to insert donation: " . $stmt->error);
    }
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
