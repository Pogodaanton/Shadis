<?php
session_start();
require_once "../protected/db.inc.php";
require_once "../protected/output.inc.php";

$username = $_POST["username"];
$password = $_POST["password"];

if (!empty($_SESSION["u_id"])) {
    error("You are already logged in!");
}

if (empty($username) || empty($password)) {
    error("Missing username or password!", 400, "error.loginMissingData");
}

$result = $db->request_user("SELECT *", "username", $username);
$row = mysqli_fetch_array($result, MYSQLI_ASSOC);

if (!password_verify($password, $row["password"])) {
    error("Invalid username or password!", 401, "error.loginInvalidData");
}

$_SESSION["u_id"] = $row["id"];
$_SESSION["u_name"] = $row["username"];

respond("Successfully logged in!");
exit();
