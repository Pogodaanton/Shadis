<?php
require_once "./protected/output.inc.php";
session_start();

/**
 * Determines in which directory Shadis is located in
 */
$base_directory = dirname($_SERVER['SCRIPT_NAME']);

/**
 * Full public url for project root
 */
$homepage = url_origin($_SERVER) . $base_directory;

/**
 * Determine whether subdirectory is a valid file ID.
 * We remove every subdirectory until project root, so that the server knows how deeply the client really is located.
 */
$uri_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri_path = substr($uri_path, strlen($base_directory) > 1 ? strlen($base_directory) : 0);
$segments = explode('/', trim($uri_path, '/'));

/**
 * Array containing data about the currently visited file.
 * Null if no file page is being visited at the moment. 
 */
$file_data = null;

/**
 * Title used for various meta-tags 
 */
$title = "Shadis";

if (!empty($segments[0])) {
  if (strlen($segments[0]) === 8) {
    require_once "./protected/db.inc.php";
    $file_data = $db->request_file($segments[0]);
    $title = ($file_data["title"] !== "" ? ($file_data["title"] . " - ") : "") . $file_data["id"] . " - Shadis";
  }
}
?>
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8" />
  <meta content="noindex" name="robots">
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <!--
    manifest.json provides metadata used when your web app is installed on a
    user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
  -->
  <link rel="manifest" href="<?php echo $homepage . "/manifest.json"; ?>" />
  <meta name="theme-color" content="#242424" />
  <meta name="apple-mobile-web-app-capable" content="yes">

  <!--
    Following metatags and their respective images were generated with the following command:
    > npx pwa-asset-generator ./static/media/logo.svg ./static/media -i ./index.html -m ./manifest.json -b "#242424"

    Make sure to transfer the generated iOS metatags from index.html to index.php
  -->
  <link rel="icon" href="<?php echo $homepage . "/static/media/favicon.ico"; ?>" />
  <link rel="mask-icon" href="<?php echo $homepage . "/static/media/safari-pinned-tab.svg"; ?>" color="#d75e00">
  <link rel="apple-touch-icon" sizes="180x180" href="<?php echo $homepage . "/static/media/apple-icon-180.png"; ?>">
  <link rel="apple-touch-icon" sizes="167x167" href="<?php echo $homepage . "/static/media/apple-icon-167.png"; ?>">
  <link rel="apple-touch-icon" sizes="152x152" href="<?php echo $homepage . "/static/media/apple-icon-152.png"; ?>">
  <link rel="apple-touch-icon" sizes="120x120" href="<?php echo $homepage . "/static/media/apple-icon-120.png"; ?>">
  <link rel="apple-touch-startup-image" href="<?php echo $homepage . "/static/media/apple-splash-2048-2732.jpg"; ?>" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)">
  <link rel="apple-touch-startup-image" href="<?php echo $homepage . "/static/media/apple-splash-2732-2048.jpg"; ?>" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)">
  <link rel="apple-touch-startup-image" href="<?php echo $homepage . "/static/media/apple-splash-1668-2388.jpg"; ?>" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)">
  <link rel="apple-touch-startup-image" href="<?php echo $homepage . "/static/media/apple-splash-2388-1668.jpg"; ?>" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)">
  <link rel="apple-touch-startup-image" href="<?php echo $homepage . "/static/media/apple-splash-1668-2224.jpg"; ?>" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)">
  <link rel="apple-touch-startup-image" href="<?php echo $homepage . "/static/media/apple-splash-2224-1668.jpg"; ?>" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)">
  <link rel="apple-touch-startup-image" href="<?php echo $homepage . "/static/media/apple-splash-1536-2048.jpg"; ?>" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)">
  <link rel="apple-touch-startup-image" href="<?php echo $homepage . "/static/media/apple-splash-2048-1536.jpg"; ?>" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)">
  <link rel="apple-touch-startup-image" href="<?php echo $homepage . "/static/media/apple-splash-1242-2688.jpg"; ?>" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)">
  <link rel="apple-touch-startup-image" href="<?php echo $homepage . "/static/media/apple-splash-2688-1242.jpg"; ?>" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)">
  <link rel="apple-touch-startup-image" href="<?php echo $homepage . "/static/media/apple-splash-1125-2436.jpg"; ?>" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)">
  <link rel="apple-touch-startup-image" href="<?php echo $homepage . "/static/media/apple-splash-2436-1125.jpg"; ?>" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)">
  <link rel="apple-touch-startup-image" href="<?php echo $homepage . "/static/media/apple-splash-828-1792.jpg"; ?>" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)">
  <link rel="apple-touch-startup-image" href="<?php echo $homepage . "/static/media/apple-splash-1792-828.jpg"; ?>" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)">
  <link rel="apple-touch-startup-image" href="<?php echo $homepage . "/static/media/apple-splash-1242-2208.jpg"; ?>" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)">
  <link rel="apple-touch-startup-image" href="<?php echo $homepage . "/static/media/apple-splash-2208-1242.jpg"; ?>" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)">
  <link rel="apple-touch-startup-image" href="<?php echo $homepage . "/static/media/apple-splash-750-1334.jpg"; ?>" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)">
  <link rel="apple-touch-startup-image" href="<?php echo $homepage . "/static/media/apple-splash-1334-750.jpg"; ?>" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)">
  <link rel="apple-touch-startup-image" href="<?php echo $homepage . "/static/media/apple-splash-640-1136.jpg"; ?>" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)">
  <link rel="apple-touch-startup-image" href="<?php echo $homepage . "/static/media/apple-splash-1136-640.jpg"; ?>" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)">

  <?php
  echo '<script>var baseDirectory = ';
  echo json_encode($base_directory);
  echo '</script>';
  if (isset($_SESSION["u_id"])) {
    $user_data = array("username" => $_SESSION["u_name"]);
    echo '<script>var userData = ';
    echo json_encode($user_data);
    echo '</script>';
  }
  if (!is_null($file_data)) :
    $file_data["fromServer"] = true;
    $file_url = $homepage . "/" . $file_data["id"] . "." . $file_data["extension"];

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

    <!-- Basic Unfurling Metadata -->
    <title><?php echo $title; ?></title>
    <meta name="title" content="<?php echo $title; ?>">
    <meta name="description" content="Share and host your favourite screenshots and screencaptures on your own server!">
    <link rel="image_src" href="<?php echo $file_url; ?>">

    <!-- Facebook OpenGraph Metadata -->
    <meta property="og:title" content="Shadis">
    <meta property="og:site_name" content="Shadis">
    <meta property="og:description" content="<?php echo $file_data["title"]; ?>">
    <meta property="og:image" content="<?php echo $file_url; ?>">
    <meta property="og:image:width" content="<?php echo $file_data["width"]; ?>">
    <meta property="og:image:height" content="<?php echo $file_data["height"]; ?>">
    <meta property="og:url" content="<?php echo $homepage . "/" . $file_data["id"] . "/"; ?>">

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