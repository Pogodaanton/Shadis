<?php
require_once dirname(__FILE__) . "/../db.inc.php";
require_once dirname(__FILE__) . "/../output.inc.php";

$base_folder = dirname(__FILE__) . "/../../uploads/";

class ImageUpload
{
  public $file;
  public $file_name;
  public $file_extension;
  public $file_width;
  public $file_height;
  public $thumbnail_height;
  public $timestamp;
  public $file_title;
  public $file_id;
  public $file_token;
  public $db;

  public function __construct($file, $title, $timestamp)
  {
    $this->file = $file;
    $this->timestamp = $timestamp ?: time();
    $this->file_title = $title ?: "Untitled Image";
    $this->db = new db();

    $this->file_id = $this->loop_through_random_string(8);
    $this->file_token = $this->loop_through_random_string(16, "token");

    $this->get_file_dimensions($this->file["tmp_name"]);
    // $this->file_extension = $this->get_file_extension($file);
  }

  /**
   * Makes sure that the supported filetypes are correctly displayed
   * e.g.: jpg is also available as jpeg
   * 
   * @param mixed $file The file to be analysed 
   */
  private function get_file_extension($file)
  {
    $type = substr($file["type"], 6);
    if ($type == "jpeg") return "jpg";
    else return $type;
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
   * Generates a thumbnail for the image.
   * The function assumes that the image has already been put to the uploads directory.
   */
  private function generate_thumbnail()
  {
    $type = substr($this->file["type"], 6);
    $image_path = $GLOBALS["base_folder"] . $this->file_id . "." . $this->file_extension;
    $thumbnail_path = $GLOBALS["base_folder"] . $this->file_id . ".thumb.jpg";
    exec($GLOBALS["imagick_path"] . " convert -define " . $type . ":size=" . $this->file_width . "x" . $this->file_height . " " . $image_path . " -thumbnail '200>' -background white -alpha Background " . $thumbnail_path . " 2>&1");
    $this->thumbnail_height = exec($GLOBALS["imagick_path"] . " identify -ping -format '%h' " . $thumbnail_path);
    return true;
  }

  /**
   * Moves the uploaded file into its appropriate location
   * and adds a new row to the files table 
   */
  public function upload()
  {
    $base_folder = $GLOBALS["base_folder"];
    $target_name = $base_folder . $this->file_id . "." . $this->file_extension;

    mkdir($base_folder);
    if (!move_uploaded_file($this->file["tmp_name"], $target_name)) {
      error("Uploading image did not succeed. Check whether the destination is writeable.");
    }

    if (!$this->generate_thumbnail()) {
      error("Generating image thumbnail did not succeed.");
    }

    $this->db->request_upload($this->file_id, $this->file_token, $this->file_extension, $this->timestamp, $this->file_title, $this->file_width, $this->file_height, $this->thumbnail_height);
    return true;
  }

  /**
   * Determines file dimensions in pixels
   * and assignes them to the class variables "file_width" and "file_height"
   * 
   * @param string $filename The path to the file to be analysed
   * @uses getID3
   */
  private function get_file_dimensions($filename)
  {
    try {
      require_once dirname(__FILE__) . "/../getID3/getid3.php";
      $getID3 = new getID3();
      $analyzed_data = $getID3->analyze($filename);

      if (isset($analyzed_data["error"])) {
        error("An error happened while using getID3: " . json_encode($analyzed_data["error"]));
      }

      $this->file_extension = $analyzed_data["fileformat"];

      switch ($this->file_extension) {
        case "png":
          $parent_data = $analyzed_data[$this->file_extension]["IHDR"];
          $this->file_width = $parent_data["width"];
          $this->file_height = $parent_data["height"];
          break;
        case "jpg":
        case "gif":
          $parent_data = $analyzed_data["video"];
          $this->file_width = $parent_data["resolution_x"];
          $this->file_height = $parent_data["resolution_y"];
          break;
      }
    } catch (ErrorException $th) {
      error($th);
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
      "file_url" => $base_url . $this->file_id . "/?token=" . $this->file_token,
      "file_editable_url" => $base_url . $this->file_id . "/?token=" . $this->file_token,
      "file_direct_url" => $base_url . $this->file_id . "." . $this->file_extension,
      "file_delete_url" => $base_url . "api/edit.php?action=delete&token=" . $this->file_token
    );
  }
}
