<?php
require_once "../protected/db.inc.php";
require_once "../protected/output.inc.php";
session_start();

// Request can only be GET
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
  error("Only GET request allowed!", 401);
}

// Login check
if (!isset($_SESSION["u_id"])) {
  error("Unauthorized", 401);
}

// Make sure arguments exist
$type = $_GET["type"];

if (!isset($type)) {
  error("Missing argument \"type\".", 401);
}

if ($type === "video-thumbnail") {
  $sql = "SELECT id FROM `" . $GLOBALS["table_prefix"] . "file_tasks` WHERE thumbnail=1";
  $result = mysqli_query($db->con, $sql);
  header("Content-type: application/json");
  echo json_encode($result->fetch_all(MYSQLI_ASSOC));
  die();
}

error("Invalid argument value for \"type\".");
