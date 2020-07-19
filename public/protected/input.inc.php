<?php
require_once "../protected/input.inc.php";

/**
 * PHP can leave notices behind for unset variables.
 * This input requester class avoids this by returning NULL for
 * requested parameters, which don't exist, instead of undefined.
 */
class Input
{
  /**
   * $_GET input retrieval.
   */
  function get($name)
  {
    return isset($_GET[$name]) ? $_GET[$name] : null;
  }

  /**
   * Read input as JSON.
   */
  function read_as_json()
  {
    $json = json_decode(file_get_contents("php://input"), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
      error("Could note decode JSON data: (" . json_last_error() . ") " . json_last_error_msg());
    }

    return $json;
  }

  /**
   * $_POST input retrieval.
   */
  function post($name)
  {
    return isset($_POST[$name]) ? $_POST[$name] : null;
  }

  /**
   * $_FILES input retrieval.
   */
  function files($name)
  {
    return isset($_FILES[$name]) ? $_FILES[$name] : null;
  }

  /**
   * Input retrieval based on which exists.
   */
  function get_post($name)
  {
    return $this->get($name) ? $this->get($name) : $this->post($name);
  }

  /**
   * Lets only requests with the given request method through.
   * Else, the request will error out informing clients which method to use. 
   * 
   * @param string $method "GET", "POST", "PUT", "HEAD", "DELETE", "CONNECT", "OPTIONS", "TRACE", "PATCH"
   */
  function whitelist_request_method($method = "GET")
  {
    if (!is_string($method) || empty($method)) return;
    if ($_SERVER["REQUEST_METHOD"] !== $method) {
      error("Only " . $method . " requests are allowed!", 401);
    }
  }
}

$input = new Input();
