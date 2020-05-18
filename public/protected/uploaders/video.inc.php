<?php
require_once dirname(__FILE__) . "/../output.inc.php";

class VideoPreprocessor
{
  private $file_extension;
  private $file_width;
  private $file_height;
  private $thumbnail_height;
  private $thumbnail_width;
  private $thumbnail_path;
  private $file_id;
  private $file_analysis;

  public function __construct($file, array $file_analysis, string $file_id, int $thumbnail_width)
  {
    $this->file_analysis = $file_analysis;
    $this->file_id = $file_id;
    $this->thumbnail_width = $thumbnail_width;
    $this->thumbnail_path = $GLOBALS["upload_directory"] . $this->file_id . ".thumb.jpg";

    $this->get_file_dimensions();
  }

  /**
   * Determines file dimensions in pixels
   * and assigns them to the private variables `$file_width` and `$file_height`
   * 
   * @uses getID3
   */
  private function get_file_dimensions()
  {
    try {
      $this->file_extension = $this->file_analysis["fileformat"];
      switch ($this->file_extension) {
        case "mp4":
          $parent_data = $this->file_analysis["video"];
          $this->file_width = $parent_data["resolution_x"];
          $this->file_height = $parent_data["resolution_y"];
          break;
        default:
          error("File format '" . $this->file_extension . "' is not supported by the video preprocessor.", 415);
          break;
      }
    } catch (ErrorException $ee) {
      if (isset($this->file_analysis["error"])) {
        error("An error happened with getID3 while retrieving the file's dimensions: " . json_encode($this->file_analysis["error"]));
      } else {
        error("An unknown error happened while retrieving the file's dimensions: " . $ee);
      }
    }
  }

  /**
   * Generates a thumbnail for the video.
   */
  private function generate_thumbnail()
  {
    $this->thumbnail_height =  $this->thumbnail_width * ($this->file_height / $this->file_width);

    // Path to the play icon
    $icon_path = dirname(__FILE__) . "/../../static/media/play.png";

    // Using an array to make this part more readable
    $exec_array = array(
      $GLOBALS["imagick_path"],
      "convert",
      "-size " . $this->thumbnail_width . "x" . $this->thumbnail_height . "",
      "\( xc: +noise Random -channel G  -separate -level 0%,100%,2.0 \)",
      "null: \( $icon_path \) -gravity Center",
      "-layers Composite",
      "-layers Optimize",
      $this->thumbnail_path,
      "2>&1",
    );

    // Combining arguments into exec string
    exec(implode(" ", $exec_array));
    return true;
  }

  /**
   * Executes every task needed for uploading the video
   * @return array Available keys: "file_width", "file_height", "thumbnail_height"
   */
  public function upload()
  {
    if (!$this->generate_thumbnail()) {
      throw new ErrorException("Generating video thumbnail did not succeed.");
    }

    return array(
      "file_width" => $this->file_width,
      "file_height" => $this->file_height,
      "thumbnail_height" => $this->thumbnail_height
    );
  }

  /**
   * Removes everything that was saved to disk on upload.
   * This function is used if an error happened while uploading.
   */
  public function cleanup_upload_error()
  {
    if (file_exists($this->thumbnail_path)) unlink($this->thumbnail_path);
  }
}
