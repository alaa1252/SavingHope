<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['username'])) {
    echo json_encode(['success' => false, 'error' => 'User not logged in']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (
    !$data ||
    empty($data['orphan_id']) ||
    empty($data['monthly_amount']) ||
    !is_numeric($data['monthly_amount'])
) {
    echo json_encode(['success' => false, 'error' => 'Invalid input']);
    exit;
}

$username = $_SESSION['username'];
$orphanId = intval($data['orphan_id']);
$monthlyAmount = floatval($data['monthly_amount']);
$startDate = date('Y-m-d');
$nextPaymentDate = date('Y-m-d', strtotime('+1 month'));
$status = 'active';
$createdAt = date('Y-m-d H:i:s');

try {
    $pdo = new PDO('mysql:host=localhost;dbname=security', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);

    $stmt = $pdo->prepare('INSERT INTO user_sponsorships (username, orphan_id, monthly_amount, start_date, next_payment_date, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([$username, $orphanId, $monthlyAmount, $startDate, $nextPaymentDate, $status, $createdAt]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}