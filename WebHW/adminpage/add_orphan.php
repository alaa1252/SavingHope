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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
    $conn->close();
    exit;
}

try {
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $age = isset($_POST['age']) ? intval($_POST['age']) : 0;
    $photo_url = isset($_POST['photo_url']) ? trim($_POST['photo_url']) : '';
    $story = isset($_POST['story']) ? trim($_POST['story']) : '';
    $education = isset($_POST['education']) ? trim($_POST['education']) : '';
    $location = isset($_POST['location']) ? trim($_POST['location']) : '';
    $medical_needs = isset($_POST['medical_needs']) ? trim($_POST['medical_needs']) : '';
    $interests = isset($_POST['interests']) ? trim($_POST['interests']) : '';
    $sponsorship_amount = isset($_POST['sponsorship_amount']) ? floatval($_POST['sponsorship_amount']) : 0.00;
    $sponsorship_goal = isset($_POST['sponsorship_goal']) ? floatval($_POST['sponsorship_goal']) : 1000.00;
    $status = isset($_POST['status']) ? trim($_POST['status']) : 'active';

    $errors = [];
    
    if (empty($name)) {
        $errors[] = 'Name is required';
    }
    
    if ($age <= 0 || $age > 18) {
        $errors[] = 'Age must be between 1 and 18';
    }
    
    if (empty($story)) {
        $errors[] = 'Story is required';
    }
    
    if (empty($education)) {
        $errors[] = 'Education information is required';
    }
    
    if (empty($location)) {
        $errors[] = 'Location is required';
    }
    
    if (!empty($photo_url) && strlen($photo_url) > 255) {
        $errors[] = 'Photo path is too long';
    }
    
    if ($sponsorship_amount < 0) {
        $errors[] = 'Sponsorship amount cannot be negative';
    }
    
    if ($sponsorship_goal < 100) {
        $errors[] = 'Sponsorship goal must be at least $100';
    }
    
    if (!in_array($status, ['active', 'inactive'])) {
        $errors[] = 'Invalid status value';
    }
    
    if (strlen($name) > 100) {
        $errors[] = 'Name must be less than 100 characters';
    }
    
    if (strlen($education) > 255) {
        $errors[] = 'Education information must be less than 255 characters';
    }
    
    if (strlen($location) > 255) {
        $errors[] = 'Location must be less than 255 characters';
    }

    if (!empty($errors)) {
        echo json_encode(['success' => false, 'error' => implode(', ', $errors)]);
        $conn->close();
        exit;
    }

    $sql = "INSERT INTO orphans (name, age, photo_url, story, education, location, medical_needs, interests, sponsorship_amount, sponsorship_goal, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sissssssdds", $name, $age, $photo_url, $story, $education, $location, $medical_needs, $interests, $sponsorship_amount, $sponsorship_goal, $status);
    
    if ($stmt->execute()) {
        $orphan_id = $conn->insert_id;
        echo json_encode(['success' => true, 'message' => 'Orphan added successfully', 'id' => $orphan_id]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to add orphan: ' . $stmt->error]);
    }
    
    $stmt->close();

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$conn->close();
?>