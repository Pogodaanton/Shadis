<?php
require_once "../protected/db.inc.php";
require_once "../protected/output.inc.php";
session_start();

// Request can only be GET
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  error("Only POST request allowed!", 401);
}

// Login check
/*
if (!isset($_SESSION["u_id"])) {
  error("Unauthorized", 401);
}
*/

// Rewrap data assuming it is a JSON request
if (empty($_POST)) {
  $_POST = json_decode(file_get_contents("php://input"));
}

$selection = $_POST->selection;
$action = $_POST->action;

// Input check
if (!isset($selection) || !isset($action) || empty($selection) || empty($action)) {
  error("Missing input! Arguments needed: selection, action", 400);
}

/**
 * Generates questionmarks to be used in a mysqli_stmt.
 * 
 * @param array $array The array of parameters that should be used in the statement.
 * @return string e.g.: "?, ?, ?, ?, ?"
 */
function generate_q_marks($array)
{
  $len = count($array);
  return (str_repeat("?, ", $len - 1) . "?");
}

/**
 * Generates a types string as is requested in a mysqli_stmt.
 * 
 * @param array $array The array of parameters that should be used in the statement.
 * @return string e.g.: "ssssss"
 */
function generate_string_types($array)
{
  $len = count($array);
  return (str_repeat("s", $len));
}

if ($action === "delete") {
  $db->request("DELETE FROM `" . $table_prefix . "files` WHERE id IN (" . generate_q_marks($selection) . ")", generate_string_types($selection), ...$selection);
  $uploads_folder = dirname(__FILE__) . "/../uploads/";
  $dir_contents = array_diff(scandir($uploads_folder), array('..', '.'));

  if (!$dir_contents) {
    error("Directory empty or was not found", 500, "error.directoryNotFound");
  }

  foreach ($selection as $selected_id) {
    foreach ($dir_contents as $filename) {
      if (!is_dir($filename) && strpos($filename, $selected_id . ".") !== false) {
        if (!unlink($uploads_folder . $filename)) {
          error("File " . $filename . " could not be deleted");
        }
      }
    }
  }
}

respond("Task successfully executed!");
