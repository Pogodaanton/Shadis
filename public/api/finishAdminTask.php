<?php
require_once "../protected/config.php";
require_once "../protected/db.inc.php";
require_once "../protected/output.inc.php";
header("Content-type: application/json");
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

switch ($type) {
  case "video-thumbnail":
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
    break;

  case "video-gif-upload":
  case "video-gif-stitch":
    $file_id = $_POST["id"];
    $chunk_number = $_POST["chunkNum"];
    if (!isset($file_id)) error("Missing argument \"id\".", 401);
    if (!isset($chunk_number)) error("Missing argument \"chunkNum\".", 401);

    $temp_dir = "../.temp";
    $chunk_path = $temp_dir . "/" . $file_id . "-";
    mkdir($temp_dir);

    if ($type === "video-gif-upload") {
      // Uploaded file size must not exceed 2gb
      $file = $_FILES["data"];
      if ($file["size"] > 1.342e+8 || !isset($file["size"])) {
        error("Either no file was provided or the size exceeded the predefined limit of the server.");
      }

      // Appending $chunk_number to keep chunk order
      $chunk_path = $chunk_path . $chunk_number;

      // Check if temporary file exists in order to avoid upload collisions
      if (file_exists($chunk_path)) {
        error("File already exists; Uploading is not needed.", 423);
      }

      if (!move_uploaded_file($file['tmp_name'], $chunk_path)) {
        error("File is either too big or no file was sent.", 500);
      }

      return;
    }

    // Stitching procedure
    // We use $chunk_number in this context as the highest chunk number    
    $stitch_path = $chunk_path . "stitched";

    if (file_exists($stitch_path)) {
      error("Stitched file already exists", 423);
    }

    for ($i = 0; $i < $chunk_number; $i++) {
      try {
        $chunk_i_path = $chunk_path . $i;
        $file = fopen($chunk_i_path, 'rb');
        $buff = fread($file, 1024 * 1024);
        fclose($file);

        $final = fopen($stitch_path, 'ab');
        $write = fwrite($final, $buff);
        fclose($final);

        unlink($chunk_i_path);
      } catch (Exception $e) {
        error("Error while stitching: " . $e);
      }
    }

    // Generate optimized gif from upload and delete temporary image
    // MySQL update entry happens with the next switch case, since there is no `break`
    generate_gif($GLOBALS["upload_directory"] . $file_id . ".gif", $stitch_path);
    unlink($stitch_path);

  case "video-gif-too-big":
    $file_id = $_POST["id"];
    $sql = "UPDATE `" . $GLOBALS["table_prefix"] . "file_tasks` SET gif=0 WHERE id=?";
    $db->request($sql, "s", $file_id);
    break;

  default:
    error("Invalid argument value for \"type\".");
    break;
}
