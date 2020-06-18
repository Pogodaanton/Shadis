<?php
require_once "config.php";

/**
 * Dies with a message in JSON format.
 *
 * @param string $message A custom message
 * @param int $code An http code to respond with
 */
function respond($message = "Request successful", $code = 200, $i18n_id = "")
{
  header("Content-type: application/json");
  http_response_code($code);
  die(json_encode(array("code" => $code, "message" => $message, "i18n" => $i18n_id)));
}

/**
 * Dumps an error message in JSON format.
 *
 * @param string $message A custom error message
 * @param int $code An http error code to respond with
 */
function error($message = "An unexpected error happened!", $code = 500, $i18n_id = "")
{
  respond($message, $code, $i18n_id);
}

/**
 * Returns the URL of the current server
 * 
 * @param array $s A server array, usually $_SERVER
 */
function url_origin($s)
{
  $ssl      = (!empty($s["HTTPS"]) && $s["HTTPS"] == "on");
  $sp       = strtolower($s["SERVER_PROTOCOL"]);
  $protocol = substr($sp, 0, strpos($sp, "/")) . (($ssl) ? "s" : "");
  $port     = $s["SERVER_PORT"];
  $port     = ((!$ssl && $port == "80") || ($ssl && $port == "443")) ? "" : ":" . $port;
  $host     = isset($s["HTTP_HOST"]) ? $s["HTTP_HOST"] : null;
  $host     = isset($host) ? $host : $s["SERVER_NAME"] . $port;
  return $protocol . "://" . $host;
}

/**
 * Generates a thumbnail from an input image.
 * @param string $destination Destination path of the thumbnail.
 * @param string $image_path A path to the image in question.
 * @param string $mime_type MIME-Type of the image in question.
 * @return string Height of the thumbnail; the width is always 200.
 */
function generate_thumbnail(string $destination, string $image_path, string $mime_type)
{
  $type = substr($mime_type, 6);

  // Using an array to make this part more readable
  $exec_array = array(
    $GLOBALS["imagick_path"],
    "convert",
    $image_path,
    "-filter Triangle",
    "-define " . $type,
    "-thumbnail '200'",
    "-background white",
    "-alpha Background",
    "-unsharp 0.25x0.25+8+0.065",
    "-dither None",
    "-sampling-factor 4:2:0",
    "-quality 82",
    "-define jpeg:fancy-upsampling=off",
    "-interlace none",
    "-colorspace RGB",
    "-strip",
    $destination,
    "2>&1",
  );

  // Combining arguments into exec string
  exec(implode(" ", $exec_array));

  // Setting the thumbnail_height according to the newly generated image
  return exec($GLOBALS["imagick_path"] . " identify -ping -format '%h' " . $destination);
}

/**
 * Generates an optimized GIF from an input image.
 * @param string $destination Destination path of the thumbnail.
 * @param string $image_path A path to the image in question.
 * @return string Width and height of the thumbnail; the width is always 200.
 */
function generate_gif(string $destination, string $image_path)
{
  // Using an array to make this part more readable
  $exec_array = array(
    $GLOBALS["imagick_path"],
    "convert",
    $image_path,
    "-colorspace RGB",
    "-ordered-dither o8x8,8,8,4",
    "+map",
    $destination,
    "2>&1",
  );

  // Combining arguments into exec string
  exec(implode(" ", $exec_array));

  // Setting the thumbnail_height according to the newly generated image
  return exec($GLOBALS["imagick_path"] . " identify -ping -format '%wx%h' " . $destination);
}
