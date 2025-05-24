<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
    $conn->close();
    exit;
}

try {
    $title = isset($_POST['title']) ? trim($_POST['title']) : '';
    $description = isset($_POST['description']) ? trim($_POST['description']) : '';
    $price = isset($_POST['price']) ? floatval($_POST['price']) : 0.00;
    $pic_url = isset($_POST['pic_url']) ? trim($_POST['pic_url']) : '';
    $status = isset($_POST['status']) ? trim($_POST['status']) : 'active';

    $errors = [];
    
    if (empty($title)) {
        $errors[] = 'Title is required';
    }
    
    if (empty($description)) {
        $errors[] = 'Description is required';
    }
    
    if ($price <= 0) {
        $errors[] = 'Price must be greater than $0';
    }
    
    if (!empty($pic_url) && strlen($pic_url) > 255) {
        $errors[] = 'Image path is too long';
    }
    
    if (!in_array($status, ['active', 'inactive', 'completed'])) {
        $errors[] = 'Invalid status value';
    }
    
    if (strlen($title) > 255) {
        $errors[] = 'Title must be less than 255 characters';
    }
    
    if (strlen($pic_url) > 255) {
        $errors[] = 'Image URL must be less than 255 characters';
    }
    
    if ($price > 99999999.99) {
        $errors[] = 'Price is too large';
    }

    if (!empty($errors)) {
        echo json_encode(['success' => false, 'error' => implode(', ', $errors)]);
        $conn->close();
        exit;
    }

    $sql = "INSERT INTO donations (title, description, price, pic_url, status) VALUES (?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssdss", $title, $description, $price, $pic_url, $status);
    
    if ($stmt->execute()) {
        $donation_id = $conn->insert_id;
        echo json_encode(['success' => true, 'message' => 'Donation option added successfully', 'id' => $donation_id]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to add donation option: ' . $stmt->error]);
    }
    
    $stmt->close();

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$conn->close();
?>