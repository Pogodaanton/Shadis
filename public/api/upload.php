<?php
require_once "../protected/config.php";
require_once "../protected/output.inc.php";
session_start();

$loggedIn = isset($_SESSION["u_id"]);
$secret = $_POST["secret"];
$file = $_FILES["data"];

// Check if key set or logged in
if ((!isset($secret) || $secret !== UPLOAD_TOKEN) && !$loggedIn) {
  error("Unauthorized", 401);
}

// Size must not exceed 2gb
if ($file["size"] > 1.342e+8 || !isset($file["size"])) {
  error("Either no file was provided or the size exceeded the predefined limit of the server.");
}

// Generic upload error
if ($file["error"] > 0) {
  error("An unexpected error happened, upload did not succeed. Info: " . $file["error"]);
}

require_once "../protected/uploaders/file.inc.php";
$uploader = new FileUploader($file, $_POST["title"], $_POST["timestamp"]);
$uploader->upload();
$urls = $uploader->get_url_info();

header("Content-type: application/json");
echo json_encode($urls);
