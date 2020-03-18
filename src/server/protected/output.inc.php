<?php
require_once "config.php";

/**
 * Dies with a message in JSON format.
 *
 * @param string $message A custom message
 * @param int $code An http code to respond with
 */
function respond($message = "Request successful", $code = 200)
{
    header("Content-type: application/json");
    http_response_code($code);
    die(json_encode(array("code" => $code, "message" => $message)));
}

/**
 * Dumps an error message in JSON format.
 *
 * @param string $message A custom error message
 * @param int $code An http error code to respond with
 */
function error($message = "An unexpected error happened!", $code = 500)
{
    respond($message, $code);
}
