<?php
require_once "../protected/db.inc.php";
require_once "../protected/input.inc.php";
require_once "../protected/output.inc.php";
session_start();

// Request can only be GET
$input->whitelist_request_method("GET");

// Login check
if (!isset($_SESSION["u_id"])) {
  error("Unauthorized", 401);
}

// Make sure arguments exist
$type = $input->get("type");

if (!isset($type)) {
  error("Missing argument \"type\".", 401);
}

// A valid column in the MySQL table
$tableColumn = "";

switch ($type) {
  case "video-thumbnail":
    $tableColumn = "thumbnail";
    break;

  case "video-gif":
    $tableColumn = "gif";
    break;

  default:
    error("Invalid argument value for \"type\".");
    break;
}

// Due to switch, this will only be executed if a valid $reqType was assigned.
$sql = "SELECT id FROM `" . $GLOBALS["table_prefix"] . "file_tasks` WHERE " . $tableColumn . "=1";
$result = mysqli_query($db->con, $sql);

if ($result === false) error("Unexpected response from server.");

header("Content-type: application/json");
echo json_encode($result->fetch_all(MYSQLI_ASSOC));
