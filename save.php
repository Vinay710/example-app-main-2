<?php
include 'db.php';

$type = $_POST['typeofFeature'];
$name = $_POST['nameofFeature'];
$geomstring = $_POST['geom'];
$image_data = $_POST['image_data'];
$image_data_decoded = base64_decode($image_data);

$insert_query = "INSERT INTO public.\"featuresDrawn\" (type, name, geom, image_data) VALUES ($1, $2, ST_GeomFromGeoJSON($3), $4)";
$params = array($type, $name, $geomstring, $image_data_decoded);
$result = pg_query_params($dbconn, $insert_query, $params);

if($result){
    echo json_encode(array('statusCode' => 200));
} else {
    echo json_encode(array('statusCode' => 201, 'error' => pg_last_error($dbconn)));
}

?>
