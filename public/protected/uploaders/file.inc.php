<?php
require_once dirname(__FILE__) . "/../db.inc.php";
require_once dirname(__FILE__) . "/../output.inc.php";
require_once dirname(__FILE__) . "/../config.php";
require_once dirname(__FILE__) . "/../getID3/getid3.php";

$thumbnail_width = 200;

class FileUploader
{
  public $file;
  public $file_name;
  public $file_extension;
  public $timestamp;
  public $file_title;
  public $file_id;
  public $file_token;
  private $file_analysis;
  private $file_preprocessor;
  private $db;

  public function __construct($file, $title = null, $timestamp = null)
  {
    $this->file = $file;
    $this->timestamp = $timestamp ?: time();
    $this->file_title = $title ?: "";
    $this->file_name = $file["tmp_name"];

    $this->db = new db();
    $this->file_id = $this->loop_through_random_string(8);
    $this->file_token = $this->loop_through_random_string(16, "token");

    $this->prepare_file_analysis();
  }

  /**
   * Determines which file preprocessor to use
   * which then can determine type specific data and generate an appropriate thumbnail
   * 
   * @uses getID3
   */
  private function prepare_file_analysis()
  {
    try {
      require_once dirname(__FILE__) . "/../getID3/getid3.php";
      $getID3 = new getID3();
      $this->file_analysis = $getID3->analyze($this->file_name);

      try {
        $this->file_extension = $this->file_analysis["fileformat"];
        if (!is_string($this->file_extension)) throw new ErrorException("");

        switch ($this->file_extension) {
          case "png":
          case "jpg":
          case "gif":
            require_once dirname(__FILE__) . "/image.inc.php";
            $this->file_preprocessor = new ImagePreprocessor($this->file, $this->file_analysis, $this->file_id, $GLOBALS["thumbnail_width"]);
            break;
          case "mp4":
            require_once dirname(__FILE__) . "/video.inc.php";
            $this->file_preprocessor = new VideoPreprocessor($this->file, $this->file_analysis, $this->file_id, $GLOBALS["thumbnail_width"]);
            break;
          default:
            if (empty($this->file_extension)) $this->file_extension = $this->file["type"];
            error("File type '" . $this->file_extension . "' not supported.", 415);
            break;
        }
      } catch (ErrorException $ee) {
        if (isset($this->file_analysis["error"])) {
          error("An error happened while using getID3: " . json_encode($this->file_analysis["error"]));
        } else {
          error("An unknown error happened while checking file type: " . $ee);
        }
      }
    } catch (ErrorException $th) {
      error("An error happened while setting up getID3: " . $th);
    }
  }

  /**
   * Generates a string with randomly selected letters and numbers
   * 
   * @param int $length The desired length of the string
   */
  private function generate_random_string($length = 8)
  {
    $characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    $characters_length = strlen($characters);
    $random_string = "";
    for ($i = 0; $i < $length; $i++) {
      $random_string .= $characters[rand(0, $characters_length - 1)];
    }
    return $random_string;
  }

  /**
   * Checks whether the given string is already being used in the files table
   * 
   * @param string $column An existing column in the files table to search in 
   * @param string $value The string to look for
   */
  private function is_string_available($column, $value)
  {
    $con = $this->db->con;
    $result = mysqli_query($con, "SELECT id FROM `" . $GLOBALS["table_prefix"] . "files` WHERE $column='$value'");
    if (mysqli_error($con)) {
      error(mysqli_errno($con) . ":" . mysqli_error($con));
    }
    return $result->num_rows !== 0;
  }

  /**
   * Generates a randomly generated string
   * and compares it to the already existing ones in the database
   * 
   * @param int $length The desired length of the string
   * @param string $column An existing column in the files table to search in
   */
  private function loop_through_random_string($length = 8, $column = "id")
  {
    do {
      $random_string = $this->generate_random_string($length);
    } while ($this->is_string_available($column, $random_string));
    return $random_string;
  }

  /**
   * Moves the uploaded file into its appropriate location
   * and adds a new row to the files table 
   */
  public function upload()
  {
    $target_name = $GLOBALS["upload_directory"] . $this->file_id . "." . $this->file_extension;
    try {
      if (!file_exists($GLOBALS["upload_directory"])) {
        mkdir($GLOBALS["upload_directory"]);
      }

      if (!move_uploaded_file($this->file["tmp_name"], $target_name)) {
        error("Uploading image did not succeed. Check whether the destination is writeable.");
      }

      $file_preprocessor_data = $this->file_preprocessor->upload();
      $this->db->request_upload($this->file_id, $this->file_token, $this->file_extension, $this->timestamp, $this->file_title, $file_preprocessor_data["file_width"], $file_preprocessor_data["file_height"], $file_preprocessor_data["thumbnail_height"]);
    } catch (ErrorException $ee) {
      // Reverting steps in order to clean up failed upload
      if (file_exists($target_name)) {
        unlink($target_name);
      }

      $this->file_preprocessor->cleanup_upload_error();
      error("Uploading file \"" . $this->file_id . "\" did not succeed: \n" . $ee);
    }
  }

  /**
   * Returns an array with useful URLs of the uploaded file
   * 
   * @return string[] Available keys: "id", "file_url", "file_editable_url", "file_direct_url", "file_delete_url"
   */
  public function get_url_info()
  {
    $base_url = dirname(dirname(url_origin($_SERVER) . $_SERVER["REQUEST_URI"])) . "/";
    return array(
      "id" => $this->file_id,
      "file_url" => $base_url . $this->file_id . "/",
      "file_editable_url" => $base_url . $this->file_id . "/?token=" . $this->file_token,
      "file_direct_url" => $base_url . $this->file_id . "." . $this->file_extension,
      "file_delete_url" => $base_url . "api/edit.php?action=delete&token=" . $this->file_token
    );
  }
}
