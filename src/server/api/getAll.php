<?php
require_once "../protected/db.inc.php";
require_once "../protected/output.inc.php";
session_start();

// Request can only be GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
  error('Only GET request allowed!', 401);
}

// Login check
if (!isset($_SESSION['u_id'])) {
  error('Unauthorized', 401);
}

// Retrieve everything above this timestamp
$since = $_GET["since"];

if (isset($since)) {
  $result = $db->request("SELECT id, thumb_height, timestamp, title FROM `" . $table_prefix . "files` WHERE timestamp > " . $since . " ORDER BY timestamp DESC");
} else {
  $result = $db->request("SELECT id, thumb_height, timestamp, title FROM `" . $table_prefix . "files` ORDER BY timestamp DESC");
}

header('Content-type: application/json');
echo json_encode($result->fetch_all(MYSQLI_ASSOC));
