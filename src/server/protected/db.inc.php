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
    public function request($sql_stmt, $types, ...$args)
    {
        $stmt = mysqli_stmt_init($this->con);

        if (!mysqli_stmt_prepare($stmt, $sql_stmt)) {
            error("An error happened while trying to prepare the MySQLi statement.");
        }

        mysqli_stmt_bind_param($stmt, $types, ...$args);
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
}

$db = new db();
