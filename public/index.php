<?php
session_start();

$uri_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$segments = explode('/', trim($uri_path, '/'));
$file_data = null;
$title = "Shadis";

if (!empty($segments[0])) {
  if (strlen($segments[0]) === 8) {
    require_once "./protected/db.inc.php";
    require_once "./protected/output.inc.php";
    $file_data = $db->request_file($segments[0]);
    $title = ($file_data["title"] !== "" ? ($file_data["title"] . " - ") : "") . $file_data["id"] . " - Shadis";
  }
}
?>
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8" />
  <link rel="icon" href="%PUBLIC_URL%/static/media/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#000000" />
  <meta content="noindex" name="robots">
  <link rel="apple-touch-icon" href="%PUBLIC_URL%/static/media/logo192.png" />
  <!--
    manifest.json provides metadata used when your web app is installed on a
    user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
  -->
  <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
  <title>Shadis</title>
  <meta name="title" content="<?php echo $title; ?>">
  <meta name="description" content="Share and host your favourite screenshots and screencaptures on your own server!">
  <?php
  if (isset($_SESSION["u_id"])) {
    $user_data = array("username" => $_SESSION["u_name"]);
    echo '<script>var userData = ';
    echo json_encode($user_data);
    echo '</script>';
  }
  if (!is_null($file_data)) :
    $file_data["fromServer"] = true;
    $origin_url = url_origin($_SERVER);
    $file_url = $origin_url . "/" . $file_data["id"] . "." . $file_data["extension"];

    echo '<script>var fileData = ';
    echo json_encode($file_data);
    echo '</script>';
  ?>
    <style>
      #preContainer {
        position: fixed;
        padding-top: 64px;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        z-index: 60;
      }

      #preContainer img,
      #preContainer video {
        width: 100%;
        height: 100%;
        object-fit: scale-down;
      }
    </style>
    <link rel="image_src" href="<?php echo $file_url; ?>">

    <!-- Facebook OpenGraph Metadata -->
    <meta property="og:title" content="Shadis">
    <meta property="og:site_name" content="Shadis">
    <meta property="og:description" content="<?php echo $file_data["title"]; ?>">
    <meta property="og:image" content="<?php echo $file_url; ?>">
    <meta property="og:image:width" content="<?php echo $file_data["width"]; ?>">
    <meta property="og:image:height" content="<?php echo $file_data["height"]; ?>">
    <meta property="og:url" content="<?php echo $origin_url . "/" . $file_data["id"] . "/"; ?>">

    <!-- Twitter Metadata -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Image on Shadis">
    <meta name="twitter:description" content="<?php echo $file_data["title"]; ?>">
    <meta name="twitter:image" content="<?php echo $file_url; ?>">
  <?php endif; ?>
</head>

<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
  <?php if (!is_null($file_data)) : ?>
    <div id="preContainer">
      <?php if ($file_data["extension"] !== "mp4") : ?>
        <img src="<?php echo $file_url; ?>" />
      <?php else : ?>
        <video src="<?php echo $file_url; ?>" muted autoplay loop></video>
      <?php endif; ?>
    </div>
  <?php endif; ?>
</body>

</html>