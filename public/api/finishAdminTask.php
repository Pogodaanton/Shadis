<?php
require_once "../protected/config.php";
require_once "../protected/db.inc.php";
require_once "../protected/output.inc.php";
session_start();

// Request can only be GET
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  error("Only POST request allowed!", 401);
}

// Login check
if (!isset($_SESSION["u_id"])) {
  error("Unauthorized", 401);
}

// Make sure arguments exist
$type = $_POST["type"];
if (!isset($type)) error("Missing argument \"type\".", 401);

header("Content-type: application/json");

if ($type === "video-thumbnail") {
  $file_id = $_POST["id"];
  if (!isset($file_id)) error("Missing argument \"id\".", 401);

  // Uploaded file size must not exceed 2gb
  $file = $_FILES["data"];
  if ($file["size"] > 1.342e+8 || !isset($file["size"])) {
    error("Either no file was provided or the size exceeded the predefined limit of the server.");
  }

  generate_thumbnail($GLOBALS["upload_directory"] . $file_id . ".thumb.jpg", $file["tmp_name"], $file["type"]);

  $sql = "UPDATE `" . $GLOBALS["table_prefix"] . "file_tasks` SET thumbnail=0 WHERE id=?";
  $db->request($sql, "s", $file_id);
  die();
}

error("Invalid argument value for \"type\".");
