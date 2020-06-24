<?php
require_once "config.php";
require_once "output.inc.php";

/**
 * Establishes a database connection
 * and provides helper functions for db communication
 *
 * @var $con mysqli Established MySQL connection
 */
class db
{
    public $con;

    public function __construct()
    {
        $con = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
        if (mysqli_connect_error() || !$con) {
            error("Failed to connect to MySQL: " . mysqli_connect_error());
        }
        $this->con = $con;
    }

    /**
     * Executes a user-defined SQL request via mysqli_stmt.
     *
     * @param string $sql_stmt The SQL request in form of a statement
     * @param string $types A string that contains one or more characters which specify the types for the corresponding bind variables. Refer to mysqli_smt_bind_param()
     * @param mixed ...$args Matching arguments for the statement.
     */
    public function request($sql_stmt, $types = null, ...$args)
    {
        $stmt = mysqli_stmt_init($this->con);

        if (!mysqli_stmt_prepare($stmt, $sql_stmt)) {
            error(mysqli_stmt_errno($stmt) . ":" . mysqli_stmt_error($stmt));
        }

        // Checking whether stmt parameters need to be appended
        if (!is_null($types)) {
            mysqli_stmt_bind_param($stmt, $types, ...$args);
        }

        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

        if ($result == false && mysqli_stmt_errno($stmt)) {
            error(mysqli_stmt_errno($stmt) . ":" . mysqli_stmt_error($stmt));
        }

        return $result;
    }

    /**
     * Executes an SQL request in the users table with one column parameter.
     * The request string looks as follows: $exec . " FROM " . $GLOBALS["table_prefix"] . "users WHERE " . $column . "=?"
     *
     * @param string $exec The operation you want to execute
     * @param string $column The adressed column for the operation
     * @param string $value The value of $column
     */
    public function request_user($exec, $column, $value)
    {
        $sql = $exec . " FROM " . $GLOBALS["table_prefix"] . "users WHERE " . $column . "=?";
        $result = $this->request($sql, "s", $value);
        return $result;
    }

    /**
     * Requests a new row in the files table
     *
     * @param string $uid Unique ID of the file.
     * @param string $token Unique ID for editing the file.
     * @param string $extension File type (Supported: gif, jpg, png).
     * @param string $timestamp Timestamp of last modification
     * @param string $title Image title that will be shown on the page
     * @param string $width Image width
     * @param string $height Image height
     * @param string $thumb_height Thumbnail height
     */
    public function request_upload($uid, $token, $extension, $timestamp, $title, $width, $height, $thumb_height)
    {
        $sql = "INSERT INTO " . $GLOBALS["table_prefix"] . "files (id, token, extension, width, height, thumb_height, timestamp, title) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $result = $this->request($sql, "sssiisis", $uid, $token, $extension, $width, $height, $thumb_height, $timestamp, $title);
        return $result;
    }

    /**
     * Retreives a file entry in the files table.
     * 
     * @param string $uid Unique ID of the file.
     */
    public function request_file($uid)
    {
        $sql = "SELECT id, width, height, thumb_height, extension, title, timestamp FROM `" . $GLOBALS["table_prefix"] . "files` WHERE id=?";
        $result = $this->request($sql, "s", $uid);
        $array = $result->fetch_assoc();

        // Add has_gif key to array
        if ($array["extension"] === "mp4" && file_exists($GLOBALS["upload_directory"] . $array["id"] . ".gif")) {
            $array["has_gif"] = true;
        }

        return $array;
    }
}

$db = new db();
