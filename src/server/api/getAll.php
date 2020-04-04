<?php
require_once "../protected/db.inc.php";
require_once "../protected/output.inc.php";
session_start();

// Login check
if (!isset($_SESSION['u_id'])) {
  error('Unauthorized', 401);
}

$result = $db->request("SELECT id, thumb_height, timestamp, title FROM `" . $table_prefix . "files` ORDER BY timestamp");

header('Content-type: application/json');
echo json_encode($result->fetch_all(MYSQLI_ASSOC));
