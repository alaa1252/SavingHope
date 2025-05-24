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
    $current_user = isset($_GET['username']) ? $_GET['username'] : 'Alaa_444';

    $dashboard_data = [];

    $sql_total = "SELECT SUM(amount) as total_donated FROM user_donations WHERE username = ? AND status = 'Completed'";
    $stmt = $conn->prepare($sql_total);
    $stmt->bind_param("s", $current_user);
    $stmt->execute();
    $result = $stmt->get_result();
    $total_row = $result->fetch_assoc();
    $dashboard_data['total_donated'] = $total_row['total_donated'] ? number_format($total_row['total_donated'], 2) : '0.00';

    $sql_sponsorship = "SELECT 
        us.monthly_amount,
        us.next_payment_date,
        us.start_date,
        o.name as child_name,
        o.age,
        o.photo_url,
        o.story,
        o.sponsorship_amount,
        o.sponsorship_goal,
        ROUND((o.sponsorship_amount / o.sponsorship_goal) * 100, 0) as education_fund_progress
    FROM user_sponsorships us
    JOIN orphans o ON us.orphan_id = o.id
    WHERE us.username = ? AND us.status = 'Active'";

    $stmt = $conn->prepare($sql_sponsorship);
    $stmt->bind_param("s", $current_user);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $sponsorship_row = $result->fetch_assoc();
        $dashboard_data['sponsorship'] = $sponsorship_row;

        $start_date = new DateTime($sponsorship_row['start_date']);
        $current_date = new DateTime();
        $months_diff = $start_date->diff($current_date);
        $dashboard_data['months_of_support'] = ($months_diff->y * 12) + $months_diff->m;
    } else {
        $dashboard_data['sponsorship'] = null;
        $dashboard_data['months_of_support'] = 0;
    }

    $sql_history = "SELECT 
        DATE_FORMAT(donation_date, '%b %d, %Y') as formatted_date,
        donation_type,
        CONCAT('$', FORMAT(amount, 2)) as formatted_amount,
        status
    FROM user_donations 
    WHERE username = ? 
    ORDER BY donation_date DESC 
    LIMIT 5";

    $stmt = $conn->prepare($sql_history);
    $stmt->bind_param("s", $current_user);
    $stmt->execute();
    $result = $stmt->get_result();

    $donation_history = [];
    while($row = $result->fetch_assoc()) {
        $donation_history[] = $row;
    }
    $dashboard_data['donation_history'] = $donation_history;

    $sql_profile = "SELECT 
        FullName as name,
        Email as email,
        PhoneNumber as phone,
        DATE_FORMAT(JoiningDate, '%M %Y') as member_since
    FROM members 
    WHERE Username = ?";

    $stmt = $conn->prepare($sql_profile);
    $stmt->bind_param("s", $current_user);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $dashboard_data['profile'] = $result->fetch_assoc();
    } else {
        $dashboard_data['profile'] = null;
    }

    $sql_updates = "SELECT 
        DATE_FORMAT(ou.update_date, '%B %d, %Y') as formatted_date,
        ou.update_content
    FROM orphan_updates ou
    JOIN user_sponsorships us ON ou.orphan_id = us.orphan_id
    WHERE us.username = ? AND us.status = 'Active'
    ORDER BY ou.update_date DESC
    LIMIT 5";

    $stmt = $conn->prepare($sql_updates);
    $stmt->bind_param("s", $current_user);
    $stmt->execute();
    $result = $stmt->get_result();

    $updates = [];
    while($row = $result->fetch_assoc()) {
        $updates[] = $row;
    }
    $dashboard_data['child_updates'] = $updates;

    echo json_encode(['success' => true, 'data' => $dashboard_data]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$conn->close();
?>