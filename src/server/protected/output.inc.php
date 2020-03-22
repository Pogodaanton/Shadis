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

/**
 * Returns the URL of the current server
 * 
 * @param array $s A server array, usually $_SERVER
 */
function url_origin($s)
{
    $ssl      = (!empty($s['HTTPS']) && $s['HTTPS'] == 'on');
    $sp       = strtolower($s['SERVER_PROTOCOL']);
    $protocol = substr($sp, 0, strpos($sp, '/')) . (($ssl) ? 's' : '');
    $port     = $s['SERVER_PORT'];
    $port     = ((!$ssl && $port == '80') || ($ssl && $port == '443')) ? '' : ':' . $port;
    $host     = isset($s['HTTP_HOST']) ? $s['HTTP_HOST'] : null;
    $host     = isset($host) ? $host : $s['SERVER_NAME'] . $port;
    return $protocol . '://' . $host;
}
