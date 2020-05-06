<?php
require_once "../protected/db.inc.php";
require_once "../protected/output.inc.php";
session_start();

// Request can only be GET
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
  error("Only GET request allowed!", 401);
}

// Make sure arguments exist
$id = $_GET["id"];

if (!isset($id)) {
  error("Missing argument \"id\".", 401);
}

$result = $db->request_file($id);

header("Content-type: application/json");
echo json_encode($result);
