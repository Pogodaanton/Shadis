<?php
require_once "../protected/db.inc.php";
require_once "../protected/output.inc.php";
require_once "../protected/input.inc.php";
session_start();

// Request can only be GET
$input->whitelist_request_method("GET");

// Make sure arguments exist
$id = $input->get("id");

if (!isset($id)) {
  error("Missing argument \"id\".", 401);
}

$result = $db->request_file($id);

header("Content-type: application/json");
echo json_encode($result);
