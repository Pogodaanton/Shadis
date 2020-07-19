<?php
require_once "../protected/config.php";
require_once "../protected/input.inc.php";
require_once "../protected/output.inc.php";
session_start();

// Request method can only be POST
$input->whitelist_request_method("POST");

$secret = $input->post("secret");
$file = $input->files("data");

// Check if key set or logged in
if ((!isset($secret) || $secret !== UPLOAD_TOKEN) && !isset($_SESSION["u_id"])) {
  error("Unauthorized", 401);
}

// Size must not exceed 2gb
if (!isset($file) || !isset($file["size"]) || $file["size"] > 1.342e+8) {
  error("Either no file was provided or the size exceeded the predefined limit of the server.");
}

// Generic upload error
if ($file["error"] > 0) {
  error("An unexpected error happened, upload did not succeed. Info: " . $file["error"]);
}

require_once "../protected/uploaders/file.inc.php";
$uploader = new FileUploader($file, $input->post("title"), $input->post("timestamp"));
$uploader->upload();
$urls = $uploader->get_url_info();

header("Content-type: application/json");
echo json_encode($urls);
